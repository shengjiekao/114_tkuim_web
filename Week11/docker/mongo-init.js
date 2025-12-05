// docker/mongo-init.js

// 切換到 week11 這個資料庫（要跟 docker-compose 的 MONGO_INITDB_DATABASE 一樣）
db = db.getSiblingDB('week11');

// 建一個專門給應用程式用的帳號（可選，但你原本有，就保留）
db.createUser({
  user: 'week11-user',
  pwd: 'week11-pass',
  roles: [{ role: 'readWrite', db: 'week11' }]
});

// 確保有 participants collection
db.createCollection('participants');

// 在 participants.email 建立唯一索引
db.participants.createIndex(
  { email: 1 },
  { unique: true, name: 'uniq_email' }
);

// 建一筆示範資料（email 要是唯一的）
db.participants.insertOne({
  name: '示範學員',
  email: 'demo@example.com',
  phone: '0912345678',
  createdAt: new Date()
});
