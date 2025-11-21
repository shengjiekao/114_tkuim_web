import { Router } from 'express';
import { nanoid } from 'nanoid';

export const router = Router();

const signups = [];

function validateSignup(body) {
  const errors = {};

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const password = String(body.password || '');
  const confirmPassword = String(body.confirmPassword || '');
  const interests = Array.isArray(body.interests) ? body.interests : [];
  const terms = Boolean(body.terms);

  if (!name) {
    errors.name = '請填寫姓名。';
  }

  if (!email) {
    errors.email = '請填寫 Email。';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Email 格式不正確。';
    }
  }

  if (!phone) {
    errors.phone = '請填寫手機號碼。';
  } else if (!/^\d{10}$/.test(phone)) {
    errors.phone = '手機號碼需為 10 碼數字。';
  }

  if (!password) {
    errors.password = '請輸入密碼。';
  } else {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (password.length < 8 || !hasLetter || !hasNumber) {
      errors.password = '密碼至少 8 碼，且需包含英文字母與數字。';
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = '請再次輸入密碼。';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = '兩次輸入的密碼不一致。';
  }

  if (!interests.length) {
    errors.interests = '請至少勾選一個興趣標籤。';
  }

  if (!terms) {
    errors.terms = '請勾選同意服務條款。';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    values: { name, email, phone, interests },
  };
}

router.post('/', (req, res) => {
  const { isValid, errors, values } = validateSignup(req.body);

  if (!isValid) {
    return res.status(400).json({
      message: '欄位驗證失敗。',
      errors,
    });
  }

  const record = {
    id: nanoid(),
    ...values,
    createdAt: new Date().toISOString(),
  };

  signups.push(record);

  return res.status(201).json({
    message: '報名成功！',
    data: record,
  });
});

router.get('/', (req, res) => {
  res.json({
    total: signups.length,
    data: signups,
  });
});
