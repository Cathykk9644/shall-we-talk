import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET_KEY = "test-secret";
  process.env.JWT_EXPIRES_IN = "1d";

  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});
