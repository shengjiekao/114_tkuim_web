# Week11 報名系統 API

這是一個使用 **Node.js + Express + MongoDB** 實作「報名系統」後端。

---


- `POST /api/signup`：建立報名並回傳 `_id`
- `GET /api/signup`：取得清單，支援分頁 `?page=1&limit=10`
- `PATCH /api/signup/:id`：更新 `phone` 或 `status`
- `DELETE /api/signup/:id`：刪除特定報名
- `participants.email` 具有 **唯一索引**，避免重複 email 報名，API 會回傳友善錯誤訊息

---

## 一、環境需求（Environment）

- Node.js：建議 **v18 以上**
- npm
- Docker、Docker Compose
- VS Code（建議安裝 REST Client 外掛）
- MongoDB Compass（檢視資料用，非必須）

---

## 二、環境變數（.env 管理 Mongo URI / 帳號 / 密碼）

在 `Week11` 目錄下建立 `.env` 檔案，內容範例：

```env
PORT=3001
MONGODB_URI=mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11
ALLOWED_ORIGIN=http://localhost:5173

---

## 專案結構

以 `Week11` 資料夾為專案根目錄：

Week11/
├─ docker/
│  ├─ docker-compose.yml
│  └─ mongo-init.js
├─ server/
│  ├─ app.js
│  ├─ db.js
│  ├─ routes/
│  │  └─ signup.js
│  ├─ repositories/
│  │  └─ participants.js
│  ├─ package.json
│  └─ package-lock.json
├─ tests/
│  └─ api.http             
├─ docs/
│  └─ screenshots/      
├─ .env                   
└─ README.md

---

### MongoDB Compass – participants 集合

![Compass participants](docs/screenshots/{E75B75CE-4DB3-4861-94E5-CF67F4E47ED7}.png)