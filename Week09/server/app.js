// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as signupRouter } from './routes/signup.js';

dotenv.config();

const app = express();

// 同時支援 PORT 和 NPORT，避免 .env 寫不同時掛掉
const PORT = process.env.PORT || process.env.NPORT || 3001;

// 從 .env 讀取允許的前端來源
// ALLOWED_ORIGIN=http://localhost:5173,http://127.0.0.1:5500
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((o) => o.trim())
  : [];

// CORS 設定：允許指定來源、也讓 Postman 這種沒有 Origin 的請求通過
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // Postman / curl
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

// 讓 Express 自動解析 JSON body
app.use(express.json());

// 掛載 /api/signup 路由
app.use('/api/signup', signupRouter);

// 健康檢查：GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
});
