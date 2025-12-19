// server/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) throw new Error("Missing MONGODB_URI (or MONGO_URI)");

const client = new MongoClient(uri);
let db;

export async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(); // URI 已指定 DB，例如 .../week12
  console.log("[DB] Connected to MongoDB");
  return db;
}

export function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

export async function getCollection(name) {
  const database = db ?? (await connectDB());
  return database.collection(name);
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("\n[DB] Connection closed");
  process.exit(0);
});
