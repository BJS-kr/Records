import { MongoClient } from "mongodb";

// docker run as --replSet
// rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] });

/**
 * 아래와 같이 change stream이 _id를 반환하는 특성을 활용하여 _id에 객체를 할당할 수도 있고,
 * 혹은 _id에는 ObjectId를 할당하고, 다른 콜렉션에 같은 _id를 가진 문서를 작성해 이벤트를 수신하면
 * 실제로 문서를 가지고 있는 콜렉션에 findOneAndDelete를 수행하는 방식으로도 구현할 수 있다.
 *
 * 이는 순전히 취향차이라고 생각한다.
 *
 * 다만, 작성자 본인은 _id에 객체를 할당하는 방식을 선호한다.
 * 그 이유는 한 번 이라도 DB I/O를 줄일 수 있기 때문이다.
 */

function addTestPropIfTest(doc: Record<string, any>, env: string) {
  return { ...doc, ...(env === "test" && { test: true }) };
}

function after(time: number, type: "hour" | "min" | "sec" | "day") {
  const types = {
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    min: 60 * 1000,
    sec: 1000,
  };

  return new Date(Date.now() + time * types[type]);
}

function isDuplicateKeyError(e: any) {
  return e.message.includes("duplicate key error");
}

function task() {
  console.log("task");
}

function safeRun(fn, testObject) {
  if (env !== "prod" && testObject.test === true) return fn();
  return false;
}
const env = process.env.ENV;
const mc = new MongoClient("mongodb://localhost:27017/", { replicaSet: "rs0" });

async function run() {
  const c = await mc.connect();
  const db = c.db("test");
  const col = db.collection<any>("test");
  const logs = db.collection<any>("logs");

  await col.deleteMany({});
  await logs.deleteMany({});

  col.createIndex({ expire: 1 }, { expireAfterSeconds: 0 });
  logs.createIndex({ expire: 1 }, { expireAfterSeconds: 0 });

  const deleteStream = col.watch([{ $match: { operationType: "delete" } }]);

  // 두개의 서버가 둘다 스트림을 받고 있다고 가정해봅시다.
  // 이 경우 처리가 까다롭습니다. 한 쪽만 실행되어야 하니까요
  // 아래와 같이 duplicate key error를 통해 작업이 한번만 실행됨을 보장해봅시다.
  deleteStream.on("change", async (change: any) => {
    const taskInfo = change.documentKey._id;
    console.log("1", taskInfo);

    try {
      await logs.insertOne({ _id: taskInfo, expire: after(30, "day") });
      return safeRun(task, taskInfo);
    } catch (e) {
      if (isDuplicateKeyError(e)) {
        /**message already sent */
      } else {
        /**handle unexpected errors */
      }
    }
  });

  deleteStream.on("change", async (change: any) => {
    const taskInfo = change.documentKey._id;
    console.log("1", taskInfo);

    try {
      await logs.insertOne({ _id: taskInfo });
      return safeRun(task, taskInfo);
    } catch (e) {
      if (isDuplicateKeyError(e)) {
        /**message already sent */
      } else {
        /**handle unexpected errors */
      }
    }
  });

  await col.insertOne(
    addTestPropIfTest(
      {
        _id: {
          hi: "there",
          hello: "im bjs",
        },
        expire: after(2, "hour"),
      },
      env
    )
  );
}

run();
