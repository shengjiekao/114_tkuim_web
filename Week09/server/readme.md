前後端整合表單驗證:
後端 API（Node.js + Express）

POST /api/signup：驗證所有欄位，失敗回傳 400 + 錯誤訊息

GET /api/signup：回傳報名清單與總數

使用 dotenv 管理 PORT、ALLOWED_ORIGIN

CORS 白名單、404 / 500 基礎錯誤處理

前端（HTML + JS）

使用 fetch 串接後端

表單送出有 Loading 狀態、防止重複送出

錯誤訊息顯示、成功提示

「查看報名清單」按鈕 → 呼叫 GET /api/signup 用 <pre> 顯示結果

◎ 專案結構
Week09/
│ app.js
│ .env
│ package.json
│
├─ routes/
│    signup.js
│
└─ client/
     signup_form.html
     signup_form.js


1. 安裝套件
npm install

2. 啟動後端
npm run dev

成功後會看到：

Server ready on http://localhost:3001

3. 啟動前端

用 VS Code Live Server 打開：

client/signup_form.html

API 測試（
健康檢查
GET http://localhost:3001/health

新增報名
POST http://localhost:3001/api/signup
Content-Type: application/json

{
  "name": "測試",
  "email": "test@example.com",
  "phone": "0912345678",
  "password": "abc12345",
  "confirmPassword": "abc12345",
  "interests": ["前端"],
  "terms": true
}

查詢清單
GET http://localhost:3001/api/signup

 測試方式

Postman

建立 GET /health、POST /api/signup、GET /api/signup

