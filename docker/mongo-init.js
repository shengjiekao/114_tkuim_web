// Week12/docker/mongo-init.js
db = db.getSiblingDB('finaltest');

db.createUser({
  user: 'finaltest-admin',
  pwd: 'finaltest-pass',
  roles: [{ role: 'readWrite', db: 'finaltest' }]
});

// 1. participants 集合加入索引，準備 ownerId 欄位
db.createCollection('participants');
db.participants.createIndex({ ownerId: 1 });

// 2. users 集合 + email 唯一索引
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

// 預先建立管理員帳號（pwd 需先用 bcrypt 雜湊）
db.users.insertOne({
  email: 'admin@example.com',
  passwordHash: '$2b$10$ze2hAjWgm3AMVGjoSSTgD.PGUDtX9/RhhwYDsT6tyY8P2jlc2sfQu',
  role: 'admin',
  createdAt: new Date()
});

