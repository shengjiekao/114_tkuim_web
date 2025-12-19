// server/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './db.js';
import signupRouter from './routes/signup.js';
import authRouter from './routes/auth.js';
import { ensureParticipantIndexes } from './repositories/participants.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/signup', signupRouter);
app.use('/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

const port = process.env.PORT || 3001;

connectDB()
  .then(async () => {
    await ensureParticipantIndexes();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect MongoDB', error);
    process.exit(1);
  });
