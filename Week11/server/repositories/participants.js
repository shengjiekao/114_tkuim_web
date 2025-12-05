// server/repositories/participants.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('participants');

let indexesReady = false;
export async function ensureParticipantIndexes() {
  if (indexesReady) return;

  await collection().createIndex(
    { email: 1 },
    { unique: true, name: 'uniq_email' }
  );

  indexesReady = true;
}

// 建立報名
export async function createParticipant(data) {
  const result = await collection().insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result.insertedId;
}

/**
 * 分頁查詢參與者
 * page: 第幾頁（1-based）
 * limit: 每頁幾筆
 * 示範 Mongo 的 skip / limit
 */
export async function listParticipants({ page = 1, limit = 10 } = {}) {
  const col = collection();

  // 注意：page 從 1 開始，所以要減 1 再乘以 limit
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    col
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)      // 👈 Mongo skip
      .limit(limit)    // 👈 Mongo limit
      .toArray(),
    col.countDocuments()
  ]);

  return { items, total };
}

export async function updateParticipant(id, patch) {
  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
}

export function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}
