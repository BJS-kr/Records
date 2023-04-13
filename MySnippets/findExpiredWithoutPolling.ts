import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";

// docker run as --replSet
// rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] });

const mc = new MongoClient("mongodb://localhost:27017/", { replicaSet: "rs0" });

async function run() {
  const c = await mc.connect();
  const db = c.db("test");
  const col = db.collection("test");
  const col2 = db.collection("test2");
  const _id = new ObjectId();

  col.createIndex({ ttl: 1 }, { expireAfterSeconds: 0 });

  const deleteStream = col.watch([{ $match: { operationType: "delete" } }]);

  deleteStream.on("change", async (change: any) => {
    const deletedKey = change.documentKey._id;
    const doc = await col2.findOneAndDelete({ _id: deletedKey });
    console.log(doc.value);
  });

  await col.insertOne({ _id, ttl: new Date() });
  await col2.insertOne({ _id, hi: "there" });
}

run();
