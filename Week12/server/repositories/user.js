import { getDB } from '../db.js';

export async function findUserByEmail(email) {
    return getDB().collection('users').findOne({ email });
}

export async function createUser({ email, passwordHash, role = 'student' }) {
    const doc = { email, passwordHash, role, createdAt: new Date() };
    const result = await getDB().collection('users').insertOne(doc);
    return { ...doc, _id: result.insertedId };
}
