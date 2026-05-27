# roadmap.md — 開發進度駕駛艙

> 本文件為 AI 主導維護，人類監督者首要讀物。
> 狀態符號：✅ 已完成 | 🔄 進行中 | ⬜ 未開始 | ⛔ 阻塞中 | ⏭️ 已跳過
> 父節點狀態由子節點推導，不可手動覆寫。
> 葉節點原則：30 分鐘內可完成，附明確機器可驗證條件。

---

## 進度摘要（自動聚合）

- **整體**：七大模組互動頁面已上線（spec 功能清單 F1–F7 核心實作）
- **當前 Phase**：Phase 10–11 部分完成（學習模式切換器全站；模擬類含開始/暫停/重置）
- **當前焦點**：內容審查、Playwright E2E、Lighthouse 實測（待運行）
- **Production**：https://statistics-puce.vercel.app
- **近 1 小時新完成**：Kickoff 決策 D-001～D-003 已裁定（見 `kickoff-decisions.md`）

---

## 當前焦點

✅ **全模組互動已上線**（[production](https://statistics-puce.vercel.app)）：模組 1–7 共 22 個子實驗頁；`/lib/statistics` 完整；四種學習模式切換器已接入各實驗室左欄。

---

## 阻塞與待決策

- ✅ **D-001 已裁定**：Vercel 預設 `*.vercel.app` 為 production，暫不綁自訂網域
- ✅ **D-002 已裁定**：第一版零 analytics
- ✅ **D-003 已裁定**：AI 繁中草稿，不標待審，人類事後抽查
- ✅ **GitHub repo** 已就緒並完成首次 push
- ✅ **Vercel production**：https://statistics-puce.vercel.app

---

## Phase 結構

| Phase | 名稱 | 目標 | 進入條件 | 完成條件 |
|---|---|---|---|---|
| 0 | 工程基底 | 建立可開發狀態 | （起點） | dev server 可跑、CI 綠燈、三欄式 layout 可看到 |
| 1 | 統計函式庫 | `/lib/statistics` 完成且測試覆蓋 | Phase 0 完成 | 所有後續模組所需函式皆有實作 + 單元測試 |
| 2 | 共用元件 | 控制元件、視覺化基底元件完成 | Phase 0 完成（與 Phase 1 並行可） | 滑桿、輸入框、座標軸、解釋區皆有可用版本 |
| 3 | 模組 1（敘述統計量） | 第一個完整模組上線 | Phase 1、2 完成 | F1-1、F1-2、F1-3 全綠 |
| 4 | 模組 4（常態分配） | 第二個模組（先做最受歡迎章節） | Phase 3 完成 | F4-1 ~ F4-4 全綠 |
| 5 | 模組 5（抽樣分布） | 核心模組之一 | Phase 4 完成 | F5-1 全綠 |
| 6 | 模組 2（相關回歸） | 補完基礎章節 | Phase 5 完成 | F2-1、F2-2、F2-3 全綠 |
| 7 | 模組 3（機率） | 補完基礎章節 | Phase 6 完成 | F3-1、F3-2、F3-3 全綠 |
| 8 | 模組 6（T 分配） | 進階模組 | Phase 7 完成 | F6-1 全綠 |
| 9 | 模組 7（假設檢定） | 集大成模組 | Phase 8 完成 | F7-1 ~ F7-4c 全綠 |
| 10 | 學習模式擴充 | 把四種學習模式套到所有模組 | Phase 9 完成 | FX-1 在每個模組皆綠 |
| 11 | 上線準備 | 效能、可用性最後一哩 | Phase 10 完成 | Lighthouse 各項 > 90、回滾預案演練過 |

### 跨 Phase 引用

- Phase 1（統計函式庫）→ Phase 3-9（所有模組）：**硬依賴**
- Phase 2（共用元件）→ Phase 3-9：**硬依賴**
- Phase 4（常態分配）→ Phase 5（抽樣分布）：**軟依賴**（CLT 用常態分配視覺化會更順）
- Phase 5（抽樣分布）→ Phase 8（T 分配）：**硬依賴**（T 分配 = 抽樣 + 樣本標準差）
- Phase 8（T 分配）→ Phase 9（假設檢定）：**硬依賴**

---

## 工作分解結構（WBS）

### Phase 0：工程基底 ⬜

#### 0.1 專案初始化 ⬜

- ✅ 0.1.1 建立 Next.js 專案（手動 scaffold；`npm install`）
- ✅ 0.1.2–0.1.5 strict TS、Tailwind、依賴、Vitest
- ✅ 0.2 ESLint、Prettier、CI workflow
- ✅ 0.4 三欄 layout + 7 模組路由
- ⬜ 0.1.2 設定 `tsconfig.json` 為 strict 模式
  - 驗證：`tsc --noEmit` 通過且 strict 相關選項皆 `true`
- ⬜ 0.1.3 安裝並設定 Tailwind CSS
  - 驗證：在頁面用 `text-red-500` class 文字變紅
- ⬜ 0.1.4 安裝 D3、Recharts、Framer Motion、Zustand、mathjs
  - 驗證：`package.json` 含上述依賴，`pnpm install` 無錯
- ⬜ 0.1.5 安裝 Vitest、RTL、Playwright
  - 驗證：建立一個 sanity test 並 `pnpm test` 通過

#### 0.2 程式碼品質工具 ⬜

- ⬜ 0.2.1 設定 ESLint（`next/core-web-vitals` + `@typescript-eslint/strict-type-checked`）
  - 驗證：`pnpm lint` 在乾淨專案上通過
- ⬜ 0.2.2 設定 Prettier
  - 驗證：`pnpm format --check` 在乾淨專案上通過
- ⬜ 0.2.3 設定 husky + lint-staged（pre-commit 跑 lint）
  - 驗證：故意寫一個 lint 錯誤後 `git commit` 應失敗

#### 0.3 CI/CD 與部署 ⬜

- ⬜ 0.3.1 設定 GitHub Actions（lint + test + build）
  - 驗證：開一個 PR 後綠燈
- ⬜ 0.3.2 連接 Vercel 並設定 preview 部署
  - 驗證：PR 出現 Vercel preview URL 可開啟
- ⬜ 0.3.3 production 環境設定（D-001 已裁定：Vercel `*.vercel.app`）
  - 驗證：Vercel 專案 production branch = `main`，production URL 可開啟（首次 deploy 於 Phase 0 程式就緒後）
  - 前置：人類完成 `human-pipeline-checklist.md` 步驟 3–4

#### 0.4 三欄式 layout 骨架 ⬜

- ⬜ 0.4.1 建立 `src/components/layout/ThreeColumnLayout.tsx`
  - 驗證：傳入三個 children 後，桌面版三欄並排，行動版垂直堆疊
- ⬜ 0.4.2 建立首頁 `/`，列出 7 大模組連結
  - 驗證：點擊任一連結進入對應 placeholder 頁面
- ⬜ 0.4.3 為每個模組建立 placeholder 頁面（用 ThreeColumnLayout）
  - 驗證：7 個路由都能進入且 layout 正常

### Phase 1：統計函式庫 ⬜

> 預設展開於目前焦點到達時。其他 phase 預設摺疊。

#### 1.1 敘述統計（`/lib/statistics/descriptive.ts`） ⬜
- ⬜ 1.1.1 `mean`、`median`、`mode`
- ⬜ 1.1.2 `range`、`variance`、`standardDeviation`（含 sample 選項）
- ⬜ 1.1.3 上述全部 + edge case 單元測試（空陣列、單一元素、含 NaN）

#### 1.2 相關與回歸（`/lib/statistics/correlation.ts`） ⬜
- ⬜ 1.2.1 `pearsonR`
- ⬜ 1.2.2 `linearRegression`（回傳斜率、截距、R²）
- ⬜ 1.2.3 `sumSquaredErrors`
- ⬜ 1.2.4 單元測試 + 對照標準資料集（如 Anscombe's quartet）

#### 1.3 分配函數（`/lib/statistics/distributions.ts`） ⬜
- ⬜ 1.3.1 標準常態 PDF、CDF、inverse CDF
- ⬜ 1.3.2 一般常態 PDF、CDF（任意 μ, σ）
- ⬜ 1.3.3 二項式 PMF、CDF
- ⬜ 1.3.4 t 分配 PDF、CDF、inverse CDF（給定自由度）
- ⬜ 1.3.5 對照 R/Python scipy 的輸出做單元測試（誤差 < 1e-6）

#### 1.4 推論統計（`/lib/statistics/inference.ts`） ⬜
- ⬜ 1.4.1 單一樣本 z 檢定
- ⬜ 1.4.2 單一樣本 t 檢定
- ⬜ 1.4.3 獨立樣本 t 檢定（含 Welch 與 pooled 兩種）
- ⬜ 1.4.4 成對樣本 t 檢定
- ⬜ 1.4.5 對照標準教科書範例做測試

#### 1.5 抽樣模擬（`/lib/statistics/sampling.ts`） ⬜
- ⬜ 1.5.1 從給定分配抽樣的通用介面
- ⬜ 1.5.2 均勻、常態、偏態、雙峰、自訂分配的取樣器
- ⬜ 1.5.3 CLT 模擬引擎（批次抽樣 + 樣本平均）

#### 1.6 Z/PR 換算（`/lib/statistics/conversions.ts`） ⬜
- ⬜ 1.6.1 `zToPercentileRank`
- ⬜ 1.6.2 `percentileRankToZ`
- ⬜ 1.6.3 雙向換算的 round-trip 測試（誤差 < 1e-4）

#### 1.7 可種子化 RNG（`/lib/rng/`） ⬜
- ⬜ 1.7.1 實作 Mulberry32 或 xoshiro128
- ⬜ 1.7.2 介面：`createRng(seed: number): () => number`
- ⬜ 1.7.3 測試：同 seed 必得同序列

### Phase 2：共用元件 ⬜

#### 2.1 控制元件 ⬜
- ⬜ 2.1.1 `Slider`（含範圍、步進、即時值顯示）
- ⬜ 2.1.2 `NumberInput`（含驗證、邊界提示）
- ⬜ 2.1.3 `Button`（含 primary、secondary、danger 樣式）
- ⬜ 2.1.4 `Toggle`、`RadioGroup`
- ⬜ 2.1.5 各元件的 RTL 測試（可達性 + 行為）

#### 2.2 視覺化基底 ⬜
- ⬜ 2.2.1 `Axis`（X 軸、Y 軸，含刻度與標籤）
- ⬜ 2.2.2 `GridLines`
- ⬜ 2.2.3 `Legend`
- ⬜ 2.2.4 `Tooltip`（hover 顯示數值）
- ⬜ 2.2.5 響應式 SVG container（自動 viewBox）

#### 2.3 解釋區元件 ⬜
- ⬜ 2.3.1 `ExplanationPanel`（接 MDX 內容）
- ⬜ 2.3.2 `MisconceptionAlert`（⚠️ 樣式的提醒區塊）
- ⬜ 2.3.3 `LiveValueDisplay`（綁定當前數值的解讀文字）

#### 2.4 學習模式切換器（為 Phase 10 預留） ⬜
- ⬜ 2.4.1 `LearningModeSwitch`（探索/引導/挑戰/模擬）
- ⬜ 2.4.2 Zustand store 儲存當前模式

### Phase 3-9：各模組實作 ⬜

> 結構皆相同，此處摺疊以避免淹沒。展開模板：
>
> #### 3.x F{ID} - 功能名 ⬜
> - ⬜ 3.x.1 視覺化區實作（驗證：對應 spec.md 驗收條件）
> - ⬜ 3.x.2 控制區實作
> - ⬜ 3.x.3 解釋區內容 + 常見誤解
> - ⬜ 3.x.4 元件測試
> - ⬜ 3.x.5 端到端測試（Playwright）
>
> 葉節點依此模板展開，每模組約 15-25 個葉節點。
> 詳細展開將在進入該 Phase 前一次到位。

### Phase 10：學習模式擴充 ⬜

> 每個模組需補上「引導／挑戰／模擬」三種模式（探索模式為基本款）。
> 葉節點將在進入此 Phase 前展開。

### Phase 11：上線準備 ⬜

#### 11.1 效能 ⬜
- ⬜ 11.1.1 Lighthouse Performance > 90（首頁、模組首頁、深層子模組各測一個）
- ⬜ 11.1.2 LCP < 2.5s 於所有頁面
- ⬜ 11.1.3 Bundle 分析並移除無用依賴

#### 11.2 可用性 ⬜
- ⬜ 11.2.1 鍵盤操作：所有控制元件可以 Tab 觸達
- ⬜ 11.2.2 ARIA 標籤：所有互動元件有可讀的 label
- ⬜ 11.2.3 色盲友善：所有對比色組合通過 WCAG AA

#### 11.3 回滾演練 ⬜
- ⬜ 11.3.1 故意部署一個壞版本到 production，用 Vercel Promote 回滾並計時
- ⬜ 11.3.2 將演練結果寫入 log.md

#### 11.4 內容審查 ⬜
- ⬜ 11.4.1 教學文字由統計專業人員審過至少一輪
- ⬜ 11.4.2 「常見誤解」段落每個模組都有且至少 2 條

---

## 細項粒度規範

- 葉節點需可在 30 分鐘內完成
- 每個葉節點必須有具體驗證指令或可機器判斷的條件
- 不接受「測試完成」「實作好」等模糊敘述
- 如人類覺得 AI 拆得太粗，可要求重拆某節點

---

## 樹狀展開規則

- 預設展開：當前 Phase 與當前焦點路徑
- 其他 Phase 預設摺疊（在介面上以省略形式呈現）
- 完成的 Phase 自動摺疊但仍可展開查閱
