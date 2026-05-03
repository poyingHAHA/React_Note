# Next.js 教學專案補充文件（初學者技術細節版）

這份文件用來補充目前專案的教學脈絡，幫你從「能跑起來」進到「理解為什麼這樣設計」。

## 1. 專案在做什麼

這是一個簡化版的貼文系統（類似留言牆）：

- 首頁顯示貼文列表（含分頁）
- 可以新增貼文
- 可以點進單一貼文頁面
- 資料儲存在 MongoDB
- 前端用 React Query 管理資料請求與快取

## 2. 技術堆疊與角色（為什麼要用它）

- `Next.js 15 (App Router)`：頁面與 API route 架構
- `React 19`：UI 組件
- `TypeScript`：型別檢查
- `Tailwind CSS`：樣式
- `@tanstack/react-query`：前端資料快取、重新抓取與 mutation
- `MongoDB Node Driver`：資料庫存取
- `Headless UI`：彈窗（Dialog）

## 3. 先懂 App Router 與元件類型

### 3.1 App Router 的檔案即路由

- `src/app/page.tsx` 對應 `/`
- `src/app/post/[id]/page.tsx` 對應 `/post/:id`
- `src/app/api/post/list/route.ts` 對應 `GET /api/post/list`

關鍵概念：

- 在 `app` 底下，資料夾名稱就是 URL path 的一部分
- `[id]` 是動態路由參數
- `route.ts` 是 API 端點，不是頁面

### 3.2 Server Component vs Client Component

Next.js App Router 預設是 Server Component。只要你用到下面這些 React/瀏覽器功能，就必須加 `"use client"`：

- `useState`, `useEffect`
- 事件處理（`onClick`, `onChange`）
- `window`, `document`
- `useQuery` / `useMutation`（React Query）

本專案的例子：

- `src/modules/home/post-list.tsx` 是 client component（有 `useQuery`）
- `src/modules/home/comment-editor.tsx` 是 client component（有 state 與事件）
- `src/app/page.tsx` 可維持 server component（純組裝）

### 3.3 為什麼 `QueryClientProvider` 要放在 `layout.tsx`

React Query 的 hooks 必須在 Provider 下使用。把 Provider 放在根 layout 的好處：

- 全站共用同一個 query cache
- 分頁切換時快取可沿用
- 不會在每個頁面重複包一層 provider
## 4. 目錄導讀（重點）

- `src/app/`：路由層（頁面與 API）
- `src/modules/`：頁面功能模組（home、post）
- `src/components/`：共用 UI 元件
- `src/hooks/`：React Query 查詢 hooks
- `src/services/`：前端呼叫 API 的函式
- `src/lib/mongodb.ts`：MongoDB 連線（單例）
- `src/utils/`：API 回傳格式與錯誤包裝
- `src/config/constants.ts`：常數（狀態碼、資料庫名稱）

## 5. 資料流（請先掌握）

### 5.1 讀取貼文列表

1. `PostList` 呼叫 `useQueryPostList()`
2. hook 內用 `useSearchParams()` 取 `page`
3. `queryFn` 呼叫 `getPostList(page)`
4. `getPostList` 打 `/api/post/list?page=x&limit=5`
5. API route 到 MongoDB 查詢後回傳 `{ posts, totalPages, ... }`
6. 前端 render 列表與分頁

這裡最重要的是 `queryKey: ["posts", currentPage]`：

- key 不同就代表不同快取
- `page=1` 與 `page=2` 會有不同快取資料
- 分頁來回切換時，React Query 可直接用快取提升體感速度

### 5.2 新增貼文

1. `CommentEditor` 觸發 `useMutation(addPost)`
2. `addPost` POST 到 `/api/post/add`
3. API 檢查 `title/content` 後寫入 MongoDB
4. `onSuccess` 後 `invalidateQueries(["posts", currentPage])`
5. 如果目前不是第 1 頁，導回 `/?page=1`，讓使用者看到最新資料

`invalidateQueries` 的意思是「把舊資料標記為過期」，React Query 會再觸發抓取，避免手動維護列表狀態。

### 5.3 單一貼文頁

1. `/post/[id]` 進入詳情頁
2. `useQueryPost()` 用路由參數 `id` 打 `/api/post/detail?id=...`
3. API 用 `id` 查單筆，回傳給前端顯示

## 6. API Route Handler 技術細節

### 6.1 Route Handler 基本形狀

範例（`src/app/api/post/list/route.ts`）：

- 匯出 `GET` / `POST` 等 HTTP 方法函式
- 參數是 `NextRequest`
- 回傳 `Response.json(...)`

### 6.2 查詢參數解析

在 API 中用：

- `const { searchParams } = new URL(request.url)`
- `searchParams.get("page")`

這是 App Router 常見寫法，請避免用舊 pages router 的 `req.query` 心智模型。

### 6.3 統一回應格式

專案採用：

- 成功：`{ status, message, data }`
- 失敗：`{ status, message, data: null }`

好處是前端可以固定解析欄位，不必每支 API 各自判斷。

## 7. MongoDB 與資料模型

### 7.1 目前 `posts` 文件大致長這樣

```json
{
  "_id": "ObjectId(...)",
  "id": "uuid-string",
  "title": "post title",
  "content": "post content",
  "createdAt": 1730000000000
}
```

注意：目前同時存在 MongoDB `_id` 與自訂 `id`（uuid）。教學上可用來示範兩種主鍵策略。

### 7.2 為什麼做 MongoDB 單例

`src/lib/mongodb.ts` 把連線 Promise 掛在 `global`，避免開發時熱更新一直重連，常見於 Next.js 本地開發。

### 7.3 索引建議（進階）

當資料量上來後，建議至少建立：

- `id` 索引（詳情頁查詢）
- `createdAt` 索引（列表排序）

## 8. React Query 初學者要懂的 4 件事

### 8.1 `queryKey` 是快取識別碼

- 相同 key => 共用快取
- 不同 key => 不同快取

### 8.2 `queryFn` 只做「拿資料」

不要在 `queryFn` 裡做 UI 副作用（如 `alert` / `router.push`）。

### 8.3 `useMutation` 處理寫入

- 建立/更新/刪除用 mutation
- 成功後通常要 `invalidateQueries`，讓列表更新

### 8.4 Loading / Error / Empty 三種狀態要分開

`PostList` 已示範這個基本模式，初學者應固定養成這個 UI 思維。
## 9. 目前設計的教學重點

### 9.1 QueryClientProvider 放在 RootLayout

`src/app/layout.tsx` 透過 `MyQueryClientProvider` 把 React Query 能力包住全站，讓所有 client component 都可使用 `useQuery/useMutation`。

### 9.2 API 統一回傳格式

`success()` / `error()` 讓 response 形狀一致，降低前端判斷成本。

### 9.3 withApiHandler 的價值

`withApiHandler()` 把 try/catch 抽出，避免每支 API 重複寫錯誤處理。

### 9.4 MongoDB 單例模式

`src/lib/mongodb.ts` 利用 `global._mongoClientPromise` 避免開發模式熱更新時反覆建立連線。

## 10. 可以加強的地方（很適合當下一階段作業）

### 10.1 日期顯示目前是寫死

`src/components/post.tsx` 現在直接顯示固定日期 `2025-07-25`，建議改成：

- `new Date(createdAt).toLocaleString()`
- 或抽成 `formatDate()` 工具函式

### 10.2 API 錯誤狀態碼與商業狀態碼分離

目前 `withApiHandler` 的 `defaultStatus` 同時拿來當 HTTP status 與商業 status，會出現 `status: 0/1/2` 這種非標準 HTTP code。

建議：

- HTTP status 用標準碼（400/404/500）
- response body 的 `status` 才放 `BUSINESS_STATUS_CODE`

### 10.3 加上型別安全的 API 回傳

現在 `services/post.ts` 沒有明確定義 API response 型別，可加入：

- `ApiSuccess<T>` 介面
- `PostListResponse`、`PostDetailResponse`

範例：

```ts
type ApiSuccess<T> = {
  status: number;
  message: string;
  data: T;
};
```

### 10.4 表單驗證與 UX

新增貼文可再加：

- 送出前 trim 空白
- title/content 長度限制
- 後端也做同樣驗證（不可只信任前端）
- 失敗訊息不要用 `alert`，改用 UI 訊息

### 10.5 middleware 現在是示範狀態

`src/middleware.ts` 目前僅 `NextResponse.next()`，註解中已有導向與登入檢查範例。可當成「國際化轉址 / Auth gate」練習題。

## 11. 初學者除錯 SOP（很重要）

### 11.1 前端拿不到資料時

1. 先看 Network 有沒有打到 `/api/post/list` 或 `/api/post/detail`
2. 看 response status 是否 200
3. 看 response body 的 `status` 與 `message`
4. 看 React Query 的 `error.message`

### 11.2 API 500 時

1. 看終端機 `API Error:` log（`withApiHandler` 會印）
2. 檢查 `.env` 的 `MONGODB_URI`
3. 檢查 MongoDB 是否可連線
4. 檢查 request body 欄位是否齊全

### 11.3 分頁顯示怪怪的時

1. 確認 URL 有 `?page=...`
2. 確認 `queryKey` 有帶 page
3. 確認 API 有回 `totalPages`

## 12. 本地啟動與環境

1. 安裝套件：`npm install`
2. 設定 `.env`：至少要有 `MONGODB_URI`
3. 啟動：`npm run dev`
4. 打開：`http://localhost:3000`

## 13. 建議教學節奏（給自學或帶人教學）

1. 先跑起來並確認可以新增/查看貼文
2. 看懂列表資料流（Query -> Service -> API -> DB）
3. 實作「日期格式化」
4. 實作「API 與前端型別補強」
5. 實作「錯誤處理與 UX 改善」
6. 最後再挑戰 middleware 的驗證流程

## 14. 快速檢查清單

- 是否成功連上 MongoDB
- 新增貼文後首頁是否更新
- 分頁切換是否正常
- `/post/[id]` 是否能開啟
- API 回傳格式是否一致

## 15. 延伸練習題

- 加上刪除貼文 API 與前端按鈕
- 加上編輯貼文功能
- 支援關鍵字搜尋（query string + DB filter）
- 改成 Server Components 預載部分資料，比較與 React Query 的搭配策略
- 導入 Zod 做 API request 驗證

---

如果你要，我可以下一步直接幫你把這份文件提到的「6.1~6.4 改進項」實作成一個完整 commit 版本（含型別與錯誤處理）。
