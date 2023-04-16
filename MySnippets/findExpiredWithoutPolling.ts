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

const mc = new MongoClient("mongodb://localhost:27017/", { replicaSet: "rs0" });

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;

async function run() {
  const c = await mc.connect();
  const db = c.db("test");
  const col = db.collection<any>("test");
  col.createIndex({ ttl: 1 }, { expireAfterSeconds: 0 });

  const deleteStream = col.watch([{ $match: { operationType: "delete" } }]);

  deleteStream.on("change", async (change: any) => {
    const deletedKey = change.documentKey._id;
    console.log(deletedKey);
  });

  await col.insertOne({
    _id: { hi: "there", hello: "im bjs" },
    ttl: new Date(Date.now() + 2 * HOUR + 30 * MIN + 30 * SEC),
  });
}

run();
