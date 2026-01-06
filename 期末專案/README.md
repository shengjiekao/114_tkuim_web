# 校園活動報名系統

## 目錄
1. [專案簡介](#1-專案簡介)
2. [核心功能](#2-核心功能)
3. [使用技術](#3-使用技術)
4. [系統架構與流程圖](#4-系統架構與流程圖)
5. [安裝與執行指引](#5-安裝與執行指引)
6. [API 規格說明](#6-api-規格說明)

---

## 1. 專案簡介
本專案為一個校園活動管理平台，旨在解決報名流程繁瑣的問題。
*   **目標**：提供學生一站式瀏覽與報名活動的平台，並提供管理員活動發布的功能。

---

## 2. 核心功能
*   **學生 (User)**
    *   瀏覽活動列表 (包含圖片與詳情)
    *   註冊/登入 (使用 JWT 安全認證)
    *   一鍵報名活動
    *   查看個人報名紀錄
*   **管理員 (Admin)**
    *   新增、修改、刪除活動
    *   查看各活動的報名名單

---

## 3. 使用技術
*   **前端**：HTML5, CSS3, JavaScript (原生開發，輕量高效)
*   **後端**：Node.js, Express.js (RESTful API 設計)
*   **資料庫**：MongoDB (NoSQL 資料庫，結構靈活)
*   **環境**：Docker (容器化部署)

---

## 4. 系統架構與流程圖

### 系統架構圖
前端透過 HTTP 請求與後端 API 溝通，後端負責商業邏輯並存取 MongoDB 資料庫。

```mermaid
graph LR
    User[使用者] -- "操作介面" --> Client["前端 (HTML/JS)"]
    Client -- "API 請求 (Fetch)" --> Server["後端 (Node.js/Express)"]
    Server -- "讀寫資料" --> DB[("MongoDB 資料庫")]
```

### 報名流程圖 (CRUD Flow)
描述使用者點擊「報名」後的資料處理流程：

```mermaid
sequenceDiagram
    participant User as 使用者
    participant Client as 前端
    participant Server as 後端 API
    participant DB as 資料庫

    User->>Client: 點擊「報名參加」
    Client->>Server: 發送 POST /api/registrations (帶 Token)
    Server->>Server: 驗證 Token 身分
    Server->>DB: 檢查是否重複報名
    alt 未重複
        Server->>DB: 寫入報名資料
        DB-->>Server: 回傳成功
        Server-->>Client: 回傳 201 Created
        Client-->>User: 顯示「報名成功」
    else 已報名
        Server-->>Client: 回傳錯誤訊息
        Client-->>User: 顯示「您已報名過」
    end
```

---

## 5. 安裝與執行指引

### 步驟 1：啟動資料庫
進入 `docker` 資料夾並啟動 MongoDB：
```bash
cd docker
docker-compose up -d
```

### 步驟 2：設定環境變數
確認 `server/.env` 包含以下設定：
```env
PORT=3000
MONGO_URI=mongodb://finaltest-admin:finaltest-pass@127.0.0.1:27017/finaltest?authSource=finaltest
JWT_SECRET=mysecretkey123
```

### 步驟 3：啟動後端
進入 `server` 資料夾並啟動伺服器：
```bash
cd ../server
npm run dev
```

### 步驟 4：開啟網頁
使用 VS Code 的 **Live Server** 開啟 `client/index.html`，即可開始使用。

---

## 6. API 規格說明

### 認證 (Auth)
| 方法 | 路徑 | 描述 | 參數 (Body) |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | 註冊帳號 | `name`, `email`, `password`, `role` |
| **POST** | `/api/auth/login` | 登入 | `email`, `password` |

### 活動 (Events)
| 方法 | 路徑 | 權限 | 描述 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/events` | 公開 | 取得所有活動列表 |
| **GET** | `/api/events/:id` | 公開 | 取得單一活動詳情 |
| **POST** | `/api/events` | 管理員 | 新增活動 (`title`, `date`, `location`...) |
| **PUT** | `/api/events/:id` | 管理員 | 修改活動資料 |
| **DELETE** | `/api/events/:id` | 管理員 | 刪除活動 |

### 報名 (Registrations)
| 方法 | 路徑 | 權限 | 描述 | 參數 |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/registrations` | 登入者 | 報名活動 | `eventId`, `userId` |
| **DELETE** | `/api/registrations/:id` | 登入者 | 取消報名 | 無 |
| **GET** | `/api/registrations/user/:userId` | 本人 | 查詢我的報名紀錄 | 無 |
| **GET** | `/api/registrations/event/:eventId` | 管理員 | 查詢活動報名名單 | 無 |
