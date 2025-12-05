# Week11 報名系統 API

這是一個使用 Node.js、Express 與 MongoDB 實作的簡單報名系統後端專案。  
功能包含：

- 新增報名（POST /api/signup）
- 查詢報名清單（GET /api/signup，支援分頁）
- 更新報名的電話與狀態（PATCH /api/signup/:id）
- 刪除特定報名（DELETE /api/signup/:id）
- 針對 `email` 建立唯一索引，避免同一個 email 重複報名，並回傳友善錯誤訊息


### 使用技術

- Node.js + Express
- MongoDB（搭配 Docker 啟動）
- 原生 MongoDB Node.js Driver
- CORS
- dotenv（管理環境變數）
- VS Code REST Client / Postman（API 測試）

### 目錄結構（節錄）

Week11/
├─ server/
│  ├─ app.js
│  ├─ db.js
│  ├─ routes/
│  │  └─ signup.js
│  └─ repositories/
│     └─ participants.js
├─ docker/
│  ├─ docker-compose.yml
│  └─ mongo-init.js
├─ api.http          # VS Code REST Client 測試檔
├─ package.json
└─ .env

## 測試方式

本專案提供兩種主要測試方式：

1. 使用 VS Code REST Client（或 Postman）測試 API  
2. 使用 Mongo Shell 直接查詢資料庫內容與索引

### 1. 建立報名
# @name createReq
POST {{baseUrl}}/api/signup
Content-Type: application/json

{
  "name": "新同學",
  "email": "new@example.com",
  "phone": "0911222333"
}

### 更新剛剛那筆（phone 或 status）
PATCH {{baseUrl}}/api/signup/{{createReq.response.body.id}}
Content-Type: application/json

{
  "phone": "0911000111"
}

### 取得清單（支援分頁）
GET {{baseUrl}}/api/signup?page=1&limit=10

### 刪除剛剛那筆
DELETE {{baseUrl}}/api/signup/{{createReq.response.body.id}}

### 刪除後再看一次清單
GET {{baseUrl}}/api/signup

### 測試重複 email 報名（觸發唯一索引錯誤）
POST {{baseUrl}}/api/signup
Content-Type: application/json

{
  "name": "新同學2",
  "email": "new@example.com",
  "phone": "0999888777"
}

