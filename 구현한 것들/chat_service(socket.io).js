/**
 * 예전에 진행했던 프로젝트의 채팅 구현입니다.
 * 카카오톡의 동작을 떠올리며 사용성과 편의성을 고도화하고자 노력했습니다.
 */

// socket.io는 websocket 통신 코드 작성을 간편하게 만들어주는 라이브러리입니다
// 추상화 수준이 높아 선호되지 않는 경우도 있습니다.
import { Server } from "socket.io";
// 대부분의 write, read는 redis로 처리했지만 몇몇 경우는 RDB로 처리할 경우도 필요합니다
// 이 코드에서는 MySQL을 사용했습니다.   
import { connection } from "./models/db";
// http server
import server from "./index.js";
// 서버 프로세스가 여러개 구동될 때, 서로 다른 프로세스에 연결된 socket끼리 소통할 수 있도록 redis를 통해 pub-sub으로 데이터를 주고 받습니다.
import redisAdapter from "@socket.io/redis-adapter";
// 개발자마다 다른 형식(클러스터, 혹은 다양한 옵션 등)으로 레디스 객체를 정의할테니 간단히 표현했습니다.
import redis from './redis'
// polling을 제외하고 websocket으로 고정시켰습니다만, polling을 사용해도 문제는 없습니다.
// socket.io는 polling을 시도하고 websocket연결이 가능하면 upgrade합니다.
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ["websocket"],
});

const pubClient = redis;
const subClient = pubClient.duplicate();

// redis를 통해 메세지를 주고 받음으로써 일종의 sticky session을 구현합니다.
io.adapter(redisAdapter(pubClient, subClient));

io.on("connection", (socket) => {
  socket.on("login", async (user) => {
    const userPk = user.uid;
    if (userPk) { await redis.hset(`currentOn`, userPk, socket.id) };

    // 로그인 시, 읽지 않은 채팅이 있다면 ui에 알림을 표시하기 위한 부분입니다.
    // zrevrange는 정렬이 가능하므로, 읽지 않은 메세지가 있음을 즉각적으로 검증이 가능합니다.
    // zmemebers가 아무도 없더라도 room, unchecked가 undefined이므로 0과의 비교가 false가 되어 검증 가능
    const [room, unchecked] = await redis.zrevrange(
      String(userPk),
      0,
      0,
      "WITHSCORES"
    );

    // 읽지 않은 메세지가 존재한다는 이벤트를 발생시킵니다.
    if (unchecked > 0) await io.sockets.to(id).emit("unchecked");
    
  });

  // 한 유저가 다른 유저에게 여행 신청함 알림 이벤트(진행했던 프로젝트가 여행 관련 앱이었습니다)
  socket.on("request", async (data) => {
    const userPk = data.uid;
    redis.hget(`currentOn`, userPk, async (error, id) => {
      if (id) await io.sockets.to(id).emit("requested", true);
    });
  });

  // 대화방 입장
  socket.on("join", (data) => {
    const { joiningUserPk, targetUserPk, nickname } = data;
    // 데이터가 제대로 전달되지 않은 경우
    if (!joiningUserPk || !targetUserPk || !nickname) { return };

    socket.username = nickname;
    // redis에 데이터를 저장하기 위한 key를 생성합니다. key는 방의 이름이며, 데이터베이스에 존재하는 user의 PK의 연속으로 구성됩니다.
    // 이 PK는 로그인시 데이터베이스에서 토큰에 포함시켜 클라이언트에게 전달한 값입니다.
    const roomName =
      (joiningUserPk < targetUserPk && `${joiningUserPk}:${targetUserPk}`) ||
      `${targetUserPk}:${joiningUserPk}`;

    
    redis
    // transaction처리를 위해 multi를 사용합니다.
    .multi()
    // 자신이 속한 방의 목록을 한 눈에 볼 수 있게 하기 위해(카톡 ui) sorted set 자료형을 활용합니다.
    // 이미 입장한 방이 아니라면 방 목록에 추가됩니다.
    // 새로 입장하던 원래 존재하는 방이건 읽지 않은 갯수를 0으로 만들어줍니다.
    .zadd(String(joiningUserPk), 0, roomName)
    // 존재하지 않았다면(NX), 0을 값으로 가지도록 delCounts에 방을 추가해줍니다.
    // delCounts는 방에 입장한 사람이 모두 나갔을 때가 되어야 대화 내역이 삭제되도록 하기 위한 참조값입니다.
    // 방에 join을 하더라도 메세지를 보내기 전까진 상대방의 방 목록에 생성되지 않으므로(카톡처럼) 내가 퇴장한다면 즉시 삭제 가능하도록 delCounts의 초깃값은 0입니다. 
    .zadd("delCounts", "NX", 0, roomName)
    // 이 전에 나눴던 채팅 기록을 불러옵니다.
    .lrange(roomName, 0, -1, async (err, chatLogs) => {
      if (err) console.error(err);
      try {
        // 채팅방에서 표시하기 위한 닉네임을 불러옵니다.
        // 지금 보면 트랜잭션할 필요는 없었지만 복수의 쿼리를 사용할 수도 있으니 변경하지 않았습니다.
        await connection.beginTransaction();
        // 유저를 one, two로 표시한 이유
        // 방 이름이 숫자에 따라 정렬되어 표시되기 때문에 닉네임을 불러올 때
        // 어떤 것이 자신이고 상대방인지 구분할 수 없음
        // 그러므로, userPK와 nickname을 쿼리해 PK비교를 통한 닉네임 확정과정이 필요함
        const [firstUser, secondUser] = (
          await connection.query(
            "SELECT userPk, nickname FROM users WHERE userPk IN (?, ?)",
            roomName.split(":")
          )
        )[0];
        // join한 유저를 확정. joiningUser와 firstUser가 같다면 자신은 firstUser. 아니라면 secondUser
        const user = (firstUser.userPk === joiningUserPk && firstUser) || secondUser;
        // 확정된 user와 firstUser가 같다면 상대방은 secondUser. 아니라면 firstUser
        const target = (user === firstUser && secondUser) || firstUser;
        // 확정된 자신과 상대방, 그리고 채팅로그를 통해 나눴던 대화내역을 표시
        io.to(roomName).emit("chatLogs", {
          user: user,
          target: target,
          chatLogs: chatLogs,
          });
        } catch (err) {
          connection.rollback();
          console.error(err);
        } finally {
          connection.release();
        }
      })
      .then(async (res) => {
        // 빙에 socket을 join시킵니다. redisAdapter를 사용했으므로 다른 프로세스에도 접근할 수 있도록 remoteJoin시킵니다.
        await io.of("/").adapter.remoteJoin(socket.id, roomName);
      });
  });

  // 메세지를 보냅니다
  socket.on("sendMessage", async (data) => {
    const { roomName, targetPk, message, userPk } = data;
    const curTime = Date.now();
    const currentRoom = await io.of("/").adapter.sockets(new Set([roomName]));
    // 1. 상대방이 채팅창을 보고 있지 않다면
    if (currentRoom.size < 2) {
      // 2. 상대방에게 차단당하지 않았다면
      if (!(await redis.sismember(`block:${targetPk}`, userPk))) {
        // 3. 방이 이미 존재하지 않았다면 상대방의 방 목록에 생성되고, 있었다면 읽지 않은 채팅마다 + 1
        // 즉 두 번째 채팅부턴 원래 있던 방처럼 작동
        // 상대방의 대화방 목록에서 나와 대화중인 방의 읽지 않은 채팅의 갯수를 보낼때마다 1씩 증가시킴
        redis.zadd(String(targetPk), "INCR", 1, roomName, async (err, res) => {
          // 특정 소켓에게 new message이벤트 발송
          const target = await redis.hget("currentOn", String(targetPk));
          // 4. 상대방이 채팅방을 보고 있지는 않지만 앱에 접속해 있는 경우
          // 채팅 알림 이벤트 발생
          if (target)
            await io.sockets
              .to(target)
              .emit("newMessage", { userPk, message, time: curTime });
        });
      }
    }

    const log = JSON.stringify({
      userPk: userPk,
      message: message,
      curTime: curTime,
    });
    
    redis
    .multi()
    // 1이 더 크다면(GT), 즉 delCounts가 0이었을 경우에만 1로 설정
    // 이유는 유저가 보낸 메세지가 상대방에 도달하면 상대방의 방 목록에 대화중인 방이 생성되므로, 방 삭제 카운트를 모두 들어와 있는 상태로 만들기 위함입니다.
    .zadd("delCounts", "GT", 1, roomName)
    // 보낸 메세지를 방의 채팅로그에 쌓습니다.
    .rpush(roomName, log).then(async (res) => {
      // 서버의 처리가 끝났으니, 클라이언트에게 메세지를 표시하라는 이벤트를 발생시킵니다.
      await io
        .to(roomName)
        .emit("updateMessage", { userPk: userPk, message: message });
    });
  });

  // 상대방이 채팅방 목록을 보고 있으며, 메시지를 송신한 사람과의 대화방은 없을 때 새로운 방을 생성합니다.
  // 카톡 방 목록 보고 있다가 새로운 방에서 채팅오면 맨 위에 방 새로 생성 되는 것을 떠올리시면 됩니다.
  socket.on("newRoom", async (data) => {
    const { targetPk } = data;
    const nickAndProf = await connection.query(
      // 상대방의 프로필 사진이 방에 표시되어야 하기 때문에 DB를 조회합니다.
      "SELECT profileImg, nickname FROM users WHERE userPk=?",
      [targetPk]
    );
    await io.sockets.to(socket.id).emit("newRoom", {
      profileImg: nickAndProf[0][0].profileImg,
      nickname: nickAndProf[0][0].nickname,
    });
  });

  // 대화방 채팅창 나가기
  socket.on("leave", (data) => {
    const { userPk, roomName } = data;
    
    redis
    .multi()
    // 자신이 방금 나온 방의 읽지 않은 갯수는 0으로 만듭니다.
    .zadd(userPk + "", "XX", 0, roomName)
    // 메세지 100개로 제한. 여행앱이기 때문에 모든 채팅로그를 보관할 필요는 없다고 판단했습니다.
    .ltrim(roomName, -100, -1)
    // 마지막 채팅으로 부터 3일간 유지합니다.
    .expireat(roomName, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3)
    .then(
      // redis adapter를 통한 remoteLeave
      async (res) => await io.of("/").adapter.remoteLeave(socket.id, roomName)
    );
  });

  // 대화방 자체를 나갑니다(내 대화방 목록에서 삭제).
  socket.on("quit", (data) => {
    const { userPk, targetPk } = data;
    const roomName =
      (userPk < targetPk && `${userPk}:${targetPk}`) || `${targetPk}:${userPk}`;
    // 사용자의 방 목록으로부터 채팅방을 삭제합니다. 채팅방 자체의 데이터는 delCount 0일 경우 삭제합니다. 
    // delCounts는 채팅방에 속한 유저 둘이 모두 나갔을때 0이 됩니다.
    
    redis
    .multi()
    .zscore("delCounts", roomName, (err, delCount) => {
      if (Number(delCount) < 1) {
        // delCounts가 0인 경우, 채팅방에 속한 데이터 삭제
        redis.del(roomName);
        redis.zrem("delCounts", roomName);
      } else {
        // delCounts가 1이었다면(한 명만 나갔을 경우), delCounts를 0으로 만듦
        redis.zadd("delCounts", "LT", 0, roomName)
      };
    })
    // 나간 유저의 방 목록에서 삭제
    .zrem(String(userPk), roomName)
    .then(
      async (res) => await io.of("/").adapter.remoteLeave(socket.id, roomName)
    );
  });

  //  로그아웃 혹은 앱, 웹 끄면 세션에서 소켓 삭제
  socket.on("logout", async (data) => {
    await redis.hdel("currentOn", data.uid);
  });

  socket.on("disconnect", async () => {
    // 연결된 모든 소켓을 목록을 가져옵니다.
    let currentOn = await redis.hgetall("currentOn");
    // length property를 추가합니다.
    // 최댓값을 length로 지정하는 이유는, array like object에서 indexOf가 작동하는 방식때문에 그렇습니다.
    // currentOn에는 {userPk:socket.id} 형식으로 데이터가 저장되어있습니다.
    // indexOf를 응용해, PK값을 마치 index처럼 인식하게 하여 disconnect된 소켓을 정확히 위함입니다.
    Object.assign(currentOn, {
      length: Math.max(...Object.keys(currentOn).map((x) => Number(x))),
    });
    // currentOn의 userPK key값을 찾아 삭제합니다.
    await redis.hdel(
      "currentOn",
      String(Array.prototype.indexOf.call(currentOn, socket.id))
    );
  });
});
