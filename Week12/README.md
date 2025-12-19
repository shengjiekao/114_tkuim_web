# Week 12 - Authentication & Authorization


## 1. 專案結構

- **server/**: 後端應用
  - `routes/auth.js`: 處理登入 (`/login`) 與註冊 (`/signup`)
  - `routes/signup.js`: 報名資料 API (CRUD)，已加入 `authenticateToken` 中間件驗證
  - `middleware/auth.js`: JWT Token 驗證
  - `repositories/`: MongoDB 資料庫操作
  - `.env`: 環境變數 (資料庫連線、JWT Secret)
- **client/**: 前端應用
  - `index.html`: 入口頁面 (包含登入/註冊/儀表板)
  - `js/app.js`: 前端邏輯 (API 串接、UI 切換、身分判斷)
- **docker/**: 
  - `docker-compose.yml`: 啟動 MongoDB (Container: `week12-mongo`)
  - `mongo-init.js`: 初始化資料庫與預設管理員帳號

## 2. 環境建置與啟動

### 步驟 1: 啟動資料庫

請確保已安裝 Docker Desktop。

```bash
cd docker
docker compose up -d
```
*這會啟動 MongoDB 並自動初始化預設管理員帳號。*

### 步驟 2: 啟動後端

```bash
cd server
npm install
npm run dev
```
*伺服器將運行於: `http://localhost:3001`*

### 步驟 3: 啟動前端

直接使用瀏覽器開啟 `client/index.html`，或使用 VS Code 的 **Live Server** 套件開啟。

## 3. 功能說明

### 使用者系統
- **註冊**: 支援建立一般「學生」帳號。
- **登入**: 使用 Email/密碼登入，獲取 JWT Token (2小時效期)。
- **權限分級**:
  - `admin`: 管理員
  - `student`: 一般學生

### 報名資料管理 (API: `/api/signup`)
所有 API 請求皆需在 Header 帶入 `Authorization: Bearer <TOKEN>`。

| 功能 | HTTP Method | Admin 權限 | Student 權限 |
|------|------------|------------|--------------|
| **查看列表** | `GET /` | 可看 **所有人的資料** | 僅能看 **自己建立的資料** |
| **新增資料** | `POST /` | 可新增 | 可新增 (系統紀錄 Owner) |
| **刪除資料** | `DELETE /:id` | 可刪除 **任何資料** | 僅能刪除 **自己建立的資料** |
| **修改資料** | `PATCH /:id` | 可修改 (Phone/Status) | 可修改 (Phone/Status) |

## 4. 測試帳號

系統初始化時已建立一組管理員帳號 (由 `docker/mongo-init.js` 建立)：

- **Admin**
  - Email: `admin@example.com`
  - Password: `week12-pass`

**一般使用者測試**：
請直接在前端介面點選「註冊」，建立新的學生帳號進行測試。

## 5. 開發筆記

- **JWT Secret**: 設定於 `server/.env`，預設為開發用金鑰。
- **Database**: 使用 MongoDB，連線字串設定於 `server/.env`。
- **Log**: 後端使用 `nodemon` 運行，可即時查看 API 請求紀錄與錯誤訊息。

## 6. Postman API 測試教學

如果你希望使用 Postman 直接測試後端 API，請依照以下步驟操作。

### 第一步：登入並取得 Token

1.  建立新的 Request，選擇 Method 為 `POST`。
2.  輸入 URL: `http://localhost:3001/auth/login`
3.  切換到 **Body** 分頁，選擇 **raw** 並設定格式為 **JSON**。
4.  輸入測試帳號的 JSON：
    ```json
    {
      "email": "admin@example.com",
      "password": "week12-pass"
    }
    ```
5.  按下 **Send**。
6.  成功後，下方的 Response 會回傳一個 JSON，其中包含 `token` 欄位。**請複製這個 Token**。

### 第二步：存取受保護的 API (例如：取得報名列表)

1.  建立新的 Request (或使用現有的)，選擇 Method 為 `GET`。
2.  輸入 URL: `http://localhost:3001/api/signup`
3.  切換到 **Headers** 分頁。
4.  新增一個 Key: `Authorization`。
5.  在 Value 欄位填入: `Bearer <你的Token>` (注意中間有一個空白)。
    - 例如: `Bearer eyJhbGciOiJIUz...`
6.  按下 **Send**。
7.  若 Token 正確，你將會看到報名資料的列表 (`list`) 與總數 (`total`)。

---

> [!TIP]
> 每次重新啟動伺服器或過期後 (2小時)，Token 需重新登入獲取。
