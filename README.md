# Pop Quiz - Arcade Edition 👾

這是一個結合 2000 年代街機像素風格 (Pixel Art) 的網頁版問答測驗系統。
前端採用 **React + Vite** 打造，後端與資料庫則是無縫整合 **Google Apps Script** 與 **Google Sheets**。

## ✨ 特色功能
- **懷舊街機風格**：CRT 掃描線效果、霓虹配色與像素字體。
- **動態關主生成**：透過 DiceBear API 為每一題隨機生成獨一無二的像素關主。
- **無伺服器架構**：完全依賴 Google Sheets 作為資料庫，透過 Google Apps Script 進行成績計算與題目派發。

---

## 🚀 1. 本地端安裝與執行

### 環境要求
- Node.js (建議 v20 以上版本)

### 安裝步驟
1. 進入專案目錄：
   ```bash
   cd pop-quiz
   ```
2. 安裝相依套件：
   ```bash
   npm install
   ```
3. 設定環境變數：
   在專案根目錄下建立或編輯 `.env` 檔案，填入以下資訊：
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=這裡請填入您部署好的_GAS_網址
   VITE_PASS_THRESHOLD=3
   VITE_QUESTION_COUNT=5
   ```
4. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
5. 開啟瀏覽器瀏覽 `http://localhost:5173`。

---

## 📊 2. Google Sheets 資料庫設定

請建立一個全新的 Google 試算表，並設定兩個工作表（請確保名稱完全一致）：

### 工作表一：`題目`
請在第一列（A1~G1）建立以下標題，第二列開始填入題目：
- **A 欄**：題號 (例如: 1, 2, 3...)
- **B 欄**：題目
- **C 欄**：A
- **D 欄**：B
- **E 欄**：C
- **F 欄**：D
- **G 欄**：解答 (請填入 A, B, C 或 D)

### 工作表二：`回答`
用來記錄使用者的成績，請在第一列建立以下標題：
- **A 欄**：ID
- **B 欄**：闖關次數
- **C 欄**：總分
- **D 欄**：最高分
- **E 欄**：第一次通關分數
- **F 欄**：花了幾次通關
- **G 欄**：最近施測時間

---

## ⚙️ 3. Google Apps Script (GAS) 部署教學

1. 打開您剛剛建立的 Google 試算表。
2. 點擊上方選單的 **「擴充功能」** > **「Apps Script」**。
3. 將專案中的 `Code.gs` 檔案內容，完整複製並貼上到 Apps Script 的編輯器中，覆蓋原本的程式碼。
4. 點擊上方工具列的 **「儲存」** 圖示。
5. 點擊右上角的 **「部署」** > **「新增部署作業」**。
6. 點擊左上角的「選取類型」齒輪 ⚙️，選擇 **「網頁應用程式」**。
7. 設定部署細節：
   - **說明**：隨意填寫（例如：v1.0）
   - **執行身分**：選擇 **「我」** (您的 Google 帳號)
   - **誰可以存取**：選擇 **「所有人」**
8. 點擊 **「部署」**。
   *(第一次部署時會跳出授權提示，請點擊「授權存取」 -> 選擇您的帳號 -> 點擊「進階」 -> 點擊「前往... (不安全)」 -> 點擊「允許」)*
9. 部署完成後，您會得到一串 **「網頁應用程式網址」**。
10. 將這串網址複製下來，貼到專案 `.env` 檔案中的 `VITE_GOOGLE_APP_SCRIPT_URL` 即可！
------------------------------------------------

## ⚙️ 4. 開發指令

- `npm run dev`: 啟動開發伺服器
- `npm run build`: 建置生產版本
- `npm run preview`: 預覽生產版本

---

## 🚀 5. 自動部署到 GitHub Pages

專案已內建 GitHub Actions 工作流程 ([deploy.yml](.github/workflows/deploy.yml))，只需設定環境變數即可自動部署至 GitHub Pages：

1. 進入 GitHub 儲存庫頁面，點選 **Settings** > **Secrets and variables** > **Actions**。
2. 點擊 **New repository secret**，新增以下 Secret（請參考 `.env.example`）：
   - `VITE_GOOGLE_APP_SCRIPT_URL`：**(必填)** 您的 Google Apps Script 網址。
   - `VITE_PASS_THRESHOLD`：**(選填)** 通關門檻，預設為 3。
   - `VITE_QUESTION_COUNT`：**(選填)** 總題數，預設為 5。
3. 進入 **Settings** > **Pages**，將 **Build and deployment** 的 Source 改為 **GitHub Actions**。
4. 之後只要將程式碼推送到 `main` 分支，GitHub Actions 就會自動帶入這些 Secrets 進行建置，並發布您的網站！

> **注意：** 如果您的 GitHub Pages 網址帶有路徑（例如 `https://<帳號>.github.io/<儲存庫名稱>/`），請記得在 `vite.config.ts` 中設定 `base: '/<儲存庫名稱>/'`，以免資源載入失敗。
