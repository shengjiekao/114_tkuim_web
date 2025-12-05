// server/routes/signup.js
import express from 'express';
import { ObjectId } from 'mongodb';
import {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant,
} from '../repositories/participants.js';

const router = express.Router();

/**
 * POST /api/signup
 * 建立報名並回傳 _id
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位（name、email、phone）' });
    }

    const id = await createParticipant({ name, email, phone });

    // 作業要求：回傳 _id
    return res.status(201).json({
      message: '報名成功',
      _id: id,                 // ObjectId
      id: id.toString(),       // 字串版，給 REST Client 用也方便
    });
  } catch (error) {
    // 11000 = 唯一索引衝突（重複 email 報名）
    if (error && error.code === 11000) {
      return res.status(400).json({
        error: '這個 email 已經報名過了，請不要重複報名。',
      });
    }
    next(error);
  }
});

/**
 * GET /api/signup
 * 回傳清單及 total
 */
router.get('/', async (req, res, next) => {
   try {
    // 解析 query：預設 page=1, limit=10
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limitRaw = parseInt(req.query.limit, 10) || 10;
    const limit = Math.max(1, Math.min(limitRaw, 100)); // 順便限制最大 100 筆

    const { items, total } = await listParticipants({ page, limit });
    const totalPages = Math.ceil(total / limit);

    res.json({
      total,        // 總筆數（作業要求的 total）
      list: items,  // 「清單」
      page,         // 第幾頁
      limit,        // 每頁幾筆
      totalPages,   // 總頁數（方便前端用）
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/signup/:id
 * 只允許更新 phone 或 status
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: '不合法的 id 格式' });
    }

    const { phone, status } = req.body;
    const patch = {};
    if (phone !== undefined) patch.phone = phone;
    if (status !== undefined) patch.status = status;

    if (Object.keys(patch).length === 0) {
      return res
        .status(400)
        .json({ error: '沒有可更新欄位，只允許更新 phone 或 status' });
    }

    const result = await updateParticipant(id, patch);

    if (!result.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    res.json({
      message: 'signup updated',
      modified: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/signup/:id
 * 刪除特定報名
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: '不合法的 id 格式' });
    }

    const result = await deleteParticipant(id);

    if (!result.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    // 204 No Content：成功但不回 body
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
