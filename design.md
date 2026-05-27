# design.md — 技術設計

## 技術選型

| 類別 | 選擇 | 為什麼選這個 |
|---|---|---|
| 語言 | TypeScript（`strict` 模式） | 統計函式錯誤對學生影響大，型別檢查能擋掉一類常見錯誤；React/Next.js 生態系預設 |
| 框架 | Next.js 14+（App Router） | 提供路由、SSG/SSR、檔案系統路由；可部署到 Vercel 零設定；社群與文件豐富 |
| UI 函式庫 | React 18+ | 業界標準；與 Next.js 天然整合 |
| 樣式 | Tailwind CSS + CSS Modules（局部） | Tailwind 處理大部分樣式快；CSS Modules 用於有複雜動畫的元件 |
| 視覺化主力 | D3.js（自訂繪圖層） | 統計視覺化常需要逐點控制 SVG，Recharts/Chart.js 在「拖曳資料點」「動畫化 SSE」等場景太僵硬 |
| 視覺化輔助 | Recharts | 標準長條圖、線圖等「不需要拖曳」的場景使用，省下開發時間 |
| 動畫 | Framer Motion | 元件動畫宣告式 API 清晰；過渡動畫處理優於手刻 |
| 數學/隨機 | mathjs + 自訂 RNG（seedable） | 模擬實驗需要可重現；Math.random 不可種子化，需自訂 |
| 狀態管理 | Zustand | 跨模組共享教學進度與偏好；Context 在動畫多的頁面會過度 re-render |
| 測試 | Vitest + React Testing Library + Playwright | Vitest 跑單元測試快；RTL 測元件行為；Playwright 測互動的端到端 |
| Lint/Format | ESLint + Prettier | 業界標準；CI 強制執行 |
| 套件管理 | pnpm | 比 npm 快、磁碟省；monorepo 友善（未來若拆 packages） |
| 部署 | Vercel | Next.js 原生支援；free tier 對教學網站足夠 |

每個重大選型決策進入 log.md 對應 DECISION 條目（半年後維護者可追溯）。

## 系統結構

```
/statistics-playground
├── /src
│   ├── /app                  # Next.js App Router pages
│   │   ├── /module-1-descriptive
│   │   ├── /module-2-correlation
│   │   ├── /module-3-probability
│   │   ├── /module-4-normal
│   │   ├── /module-5-sampling
│   │   ├── /module-6-t-distribution
│   │   └── /module-7-hypothesis
│   ├── /components
│   │   ├── /layout           # 三欄式 layout（左控制/中視覺/右解釋）
│   │   ├── /controls         # 滑桿、輸入框、按鈕等共用控制元件
│   │   ├── /viz              # 視覺化共用元件（座標軸、刻度、圖例等）
│   │   └── /explanation      # 概念解釋區共用元件
│   └── /modules              # 各模組的業務元件（依模組組織）
├── /lib
│   ├── /statistics           # 所有統計函式（核心紅線：集中管理）
│   │   ├── descriptive.ts    # 平均、中位、標準差、變異數
│   │   ├── correlation.ts    # Pearson r、Spearman、回歸
│   │   ├── distributions.ts  # 常態、t、二項式 PDF/CDF
│   │   ├── inference.ts      # z-test、t-test 三種
│   │   ├── sampling.ts       # 抽樣模擬、CLT 引擎
│   │   └── conversions.ts    # Z ↔ PR 換算
│   ├── /rng                  # 可種子化亂數產生器
│   └── /utils
├── /content
│   ├── /glossary             # 名詞統一定義
│   └── /modules              # 各模組的教學文字、誤解提醒
├── /tests
│   ├── /unit                 # /lib 的單元測試
│   ├── /component            # 元件層測試
│   └── /e2e                  # Playwright 端到端
└── /public                   # 靜態資源
```

### 結構圖

```mermaid
graph TD
    User[使用者瀏覽器] --> NextApp[Next.js App]
    NextApp --> Layout[三欄式 Layout]
    Layout --> Controls[左：控制區]
    Layout --> Viz[中：視覺化區]
    Layout --> Explanation[右：解釋區]

    Controls --> Store[Zustand Store]
    Store --> Viz
    Store --> Explanation

    Viz --> StatLib[lib/statistics]
    Controls --> StatLib
    StatLib --> RNG[lib/rng]

    Viz --> D3[D3.js / Recharts]
    Viz --> FM[Framer Motion]

    Explanation --> Content[/content 教學文字]
```

### 模組職責邊界

- `/src/app/*`：路由 + 頁面組裝。**不含**業務邏輯與統計運算。
- `/src/components/*`：純 UI 元件。**不含**統計運算（紅線）。
- `/src/modules/*`：業務元件。組合 `/components` 與 `/lib/statistics`，組合出特定教學情境。
- `/lib/statistics/*`：純函式。**不含** React、不含 DOM 操作、不依賴瀏覽器 API。可獨立測試。
- `/lib/rng/*`：可種子化亂數。所有模擬都應透過此模組取得隨機數，便於測試重現。
- `/content/*`：教學文字（MDX 或 JSON）。修改不需動程式碼。

## 對外介面

本專案為純前端網站，「對外介面」主要指：

### URL 路由

- `/` → 首頁（模組列表）
- `/module-{n}-{slug}` → 各模組首頁
- `/module-{n}-{slug}/{submodule}` → 子模組（如 `/module-4-normal/z-pr-conversion`）

**破壞性變更判定**：

- 改變 URL 路徑 → breaking（既有外部連結會壞）
- 新增 query string 選項 → 非 breaking（向後相容）
- 改變預設模式（探索/引導/挑戰/模擬） → 非 breaking 但需 log

### `/lib/statistics` 對外簽名

統計函式作為內部 API，但因「集中管理」紅線，視同對外介面：

```typescript
// 範例
mean(values: number[]): number
standardDeviation(values: number[], options?: { sample?: boolean }): number
pearsonR(xs: number[], ys: number[]): number
tTest(sample: number[], populationMean: number, options?: ...): TTestResult
```

**副作用**：所有 `/lib/statistics` 函式必須是純函式（無副作用）。違反者 PR 退件。

**錯誤處理**：函式不 throw，回傳 `Result<T, ErrorReason>` 型別。

**破壞性變更判定**：

- 改變函式簽名（參數順序、必選/選填）→ breaking
- 改變回傳型別 → breaking
- 新增 optional 參數且有合理預設值 → 非 breaking
- 修正運算錯誤導致結果變化 → 視為 bug fix（非 breaking），但需 log.md 記錄

### localStorage 介面

- `sp:preferences:learning-mode` → 上次選擇的學習模式
- `sp:preferences:theme` → 明暗主題（如未來支援）

**破壞性變更**：改 key 名稱或值結構視為 breaking，需提供 migration。

## 風格與慣例

主要靠工具承擔：

- **ESLint**：見 `.eslintrc.json`，採 `next/core-web-vitals` + `@typescript-eslint/strict-type-checked`
- **Prettier**：見 `.prettierrc`，2 空格縮排、單引號、無分號（依 Prettier 預設）
- **TypeScript**：`strict: true`，禁 `any`（紅線）
- **commit message**：採 Conventional Commits（`feat:`、`fix:`、`refactor:` 等）

工具管不到的：

- **命名**：
  - 統計函式採完整英文名（`standardDeviation` 非 `stdDev`）
  - React 元件 PascalCase（`ScatterPlot`）
  - 檔案與目錄 kebab-case（`scatter-plot.tsx`）
  - 子模組 slug 用 kebab-case（`z-pr-conversion`）
- **錯誤處理**：
  - 統計函式不 throw，回 Result 型別
  - UI 層 catch 後必須給使用者可讀的訊息，不可空 catch
- **本專案禁用語法**：
  - 禁 `eval`、`new Function`
  - 禁 `document.write`
  - 禁直接 mutate state（Zustand 內亦同）
- **教學文字慣例**：
  - 統計術語第一次出現附英文（如「平均數（mean）」）
  - 公式僅在解釋區出現，視覺化區不放公式
  - 「常見誤解」段落以 `> ⚠️` 開頭

## 設計系統

本節是 `spec.md`「視覺設計原則」的具體規格。所有 token 應以 CSS 變數定義於 `src/styles/tokens.css`，組件直接消費變數而非寫死數值。

### 色票

採「米白底 + 墨黑字 + 三原色重點」結構。**禁用**漸層作為主要視覺手段。

| Token | 值（HEX） | 用途 |
|---|---|---|
| `--color-bg` | `#F5F1E8` | 全站背景（米白，不用純白） |
| `--color-bg-elevated` | `#FFFEF9` | 浮起區塊（控制區面板、卡片）|
| `--color-ink` | `#1A1A1A` | 主文（墨黑，不用純黑） |
| `--color-ink-soft` | `#4A4A4A` | 次文、輔助說明 |
| `--color-ink-mute` | `#8A8580` | 提示、placeholder |
| `--color-rule` | `#D8D2C4` | 分隔線、邊框 |
| `--color-accent-red` | `#D62828` | 警示、誤差、H₁、危險區 |
| `--color-accent-blue` | `#1D4E89` | 主要互動、滑桿、H₀、樣本 |
| `--color-accent-yellow` | `#F4B400` | 高亮、當前值、選中態 |
| `--color-data-1` | `#1D4E89` | 資料系列 1（藍） |
| `--color-data-2` | `#D62828` | 資料系列 2（紅） |
| `--color-data-3` | `#0A8754` | 資料系列 3（綠，僅當需要第三組時） |
| `--color-sd-band` | `rgba(29, 78, 137, 0.15)` | 標準差陰影帶（跨模組一致） |

**色盲友善**：紅藍對比為主，綠色僅在「明確第三類別」時使用。所有重點區別**不可只靠顏色**——必須配合形狀、線型或文字標籤。

**深色模式**（次要支援）：另立 `[data-theme="dark"]` 區塊。第一版可暫不實作。

### 字型

| Token | 字型堆疊 | 用途 |
|---|---|---|
| `--font-display` | `"Fraunces", "Source Han Serif TC", serif` | 標題、章節名、數字「主角級」呈現 |
| `--font-body` | `"Source Serif 4", "Source Han Serif TC", serif` | 內文、解釋區 |
| `--font-mono` | `"JetBrains Mono", "IBM Plex Mono", monospace` | 所有數值、公式、程式碼 |
| `--font-hand` | `"Caveat", cursive` | **僅限**解釋區的關鍵詞圈點，呼應「老師在白板上圈起來」 |

字型載入策略：採 `font-display: swap`，標題字（Fraunces）優先預載，其餘 lazy load。

**禁用**：Inter、Roboto、Arial、系統預設無襯線。這些是「AI 通用美學」訊號，違反 spec.md 視覺設計原則第 1 條。

### 字級階梯（type scale）

採模組化比例 1.25（Major Third），基準 16px：

| Token | 大小 | 行高 | 用途 |
|---|---|---|---|
| `--text-xs` | `12px` | `1.4` | 軸標籤、註腳 |
| `--text-sm` | `14px` | `1.5` | 輔助說明、提示 |
| `--text-base` | `16px` | `1.6` | 內文 |
| `--text-lg` | `20px` | `1.5` | 強調內文、滑桿當前值（最小不得低於此） |
| `--text-xl` | `25px` | `1.3` | 小標 |
| `--text-2xl` | `31px` | `1.25` | 模組副標 |
| `--text-3xl` | `39px` | `1.15` | 模組主標 |
| `--text-display` | `49px` | `1.1` | 首頁主標、模組頁的「當前數值」主角 |

**規則**：滑桿旁的「當前值」數字必須使用 `--text-lg` 以上（spec.md 視覺原則第 3 條）。

### 間距系統

採 8px 基底，例外允許 4px：

| Token | 值 | 用途 |
|---|---|---|
| `--space-1` | `4px` | 圖示與文字間 |
| `--space-2` | `8px` | 元件內部間距 |
| `--space-3` | `16px` | 元件間 |
| `--space-4` | `24px` | 區塊內群組間 |
| `--space-5` | `32px` | 區塊間 |
| `--space-6` | `48px` | 主要區段間 |
| `--space-7` | `64px` | 頁面層級間距 |
| `--space-8` | `96px` | 慷慨留白（編輯感的關鍵） |

### 圓角

刻意限制在低值，避免「友善 SaaS」風：

| Token | 值 | 用途 |
|---|---|---|
| `--radius-sm` | `2px` | 輸入框、按鈕（預設） |
| `--radius-md` | `4px` | 卡片、面板 |
| `--radius-pill` | `9999px` | 僅限狀態標籤（如「模擬中」） |

**禁用** ≥ 16px 的圓角（spec.md 視覺原則第 5 條）。

### 陰影

刻意保守。編輯感不靠陰影靠版式：

| Token | 值 | 用途 |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.06)` | 浮起卡片 |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | hover 強調 |
| `--shadow-focus` | `0 0 0 3px rgba(29,78,137,0.35)` | 鍵盤 focus 環 |

**禁用**毛玻璃（backdrop-filter blur）作為主要視覺效果。

### 動畫時長與曲線

| Token | 值 | 用途 |
|---|---|---|
| `--motion-fast` | `120ms` | 操作回饋（按下、hover） |
| `--motion-base` | `240ms` | 一般狀態切換 |
| `--motion-slow` | `480ms` | 圖表參數過渡 |
| `--motion-deliberate` | `800ms` | 模擬步驟動畫（學生需看清楚） |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 通用 |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | 入場 |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | 退場 |

**禁用**彈跳（spring with high bounce）動畫於圖表——數值不該「彈過頭再回來」誤導學生。

### 圖表規範

跨模組一致的圖表約定：

- **座標軸**：墨黑 1px 實線，含端點箭頭（編輯感）。軸標籤使用 `--font-mono`。
- **網格線**：`--color-rule`，0.5px，僅水平主刻度。**不**畫密集網格。
- **資料點**：圓形，半徑 4-6px，填色為 `--color-data-*`，描邊 1px `--color-bg`（避免重疊時看不清）。
- **拖曳中的點**：放大至半徑 8px，加 `--shadow-md`。
- **回歸線/趨勢線**：2px 實線。**不**用虛線（虛線保留給「理論值/期望值」）。
- **理論值線（如母體平均）**：1.5px 虛線（`stroke-dasharray: 6 4`）。
- **標準差陰影帶**：`--color-sd-band`，無描邊。
- **H₀ 區域 vs H₁ 區域**：H₀ 用 `--color-accent-blue` 系，H₁ 用 `--color-accent-red` 系。跨模組（模組 7 所有子模組）一致。
- **動畫過渡**：圖表的資料變動使用 `--motion-slow` + `--ease-standard`。

### 圖示風格

- 採線稿（line icon），描邊 1.5px，無填色
- 參考函式庫：Lucide icons（風格相符且免費）
- **禁用**多彩填色卡通圖示、emoji 作為功能圖示（emoji 僅限狀態符號 ✅⛔🔄 等）

### 響應式斷點

| Token | 值 | 用途 |
|---|---|---|
| `--bp-sm` | `640px` | 手機橫向 |
| `--bp-md` | `1024px` | 平板 |
| `--bp-lg` | `1280px` | 桌面（三欄式 layout 啟用閾值） |
| `--bp-xl` | `1536px` | 大桌面 |

- **< 1024px**：三欄式 layout 折疊為單欄垂直堆疊（控制 → 視覺 → 解釋）
- **< 640px**：簡化版，部分模組可能不可用（首次載入給出提示）

### 可達性下限

- 所有文字對 `--color-bg` 對比 ≥ 4.5:1（WCAG AA）
- 互動元件 focus 環必須清晰可見（用 `--shadow-focus`）
- 所有顏色區分必須有非顏色備援（形狀、文字、線型）
- 動畫尊重 `prefers-reduced-motion`：偵測到時將 `--motion-*` 全部降為 `1ms`

### 變更管理

設計 token 視為對外介面：

- 新增 token → 非 breaking
- 修改 token 值（如色票調整）→ 視為 breaking（會影響所有頁面視覺），須入 `log.md` 決策類型
- 刪除 token → breaking

## 部署與環境

### 環境清單

| 環境 | URL | 用途 | 差異 |
|---|---|---|---|
| local | `http://localhost:3000` | 開發 | `npm run dev`；完整除錯、HMR |
| preview | Vercel 自動產生 | PR 預覽 | 每個 PR 一個 URL，僅作 review |
| production | [https://statistics-puce.vercel.app](https://statistics-puce.vercel.app)（Vercel 專案 `statistics`，**不綁自訂網域**，見 `kickoff-decisions.md` D-001） | 對外 | minify、CDN；**第一版無 analytics**（D-002） |

### 部署步驟

正常流程：

1. 開 feature branch → push → Vercel 自動 preview
2. PR review → merge to main → Vercel 自動部署 production

**人類確認點**：

- merge to main：需人類點 GitHub 的 merge 按鈕（AI 不可代執行）
- 升級主版本依賴後的首次部署：需人類在 preview 上確認後才 merge

### 自動化程度

- CI（測試 + lint + build）：完全自動
- Preview 部署：完全自動
- Production 部署：merge 觸發，自動執行（但 merge 本身需人類）

## 回滾預案

| 變更類型 | 回滾步驟 | 時間窗 | 失敗的次選方案 |
|---|---|---|---|
| 程式碼 bug（未發布） | revert commit → push → 重新部署 | < 5 分鐘 | 改用 Vercel 的「Promote previous deployment」按鈕 |
| 程式碼 bug（已發布到 production） | Vercel Dashboard → 找到上一個 deployment → 點「Promote to Production」 | < 2 分鐘 | revert commit + 重新部署 |
| 依賴升級造成問題 | 在 package.json 改回舊版本 → `pnpm install` → 重新部署 | < 10 分鐘 | 從 Git 還原 package.json 與 pnpm-lock.yaml |
| 教學內容錯誤 | 直接編輯 `/content` 對應檔案 → PR → merge | < 30 分鐘（看 review 速度） | 在頁面上加「校正中」浮水印（hot fix） |
| URL 結構變更（誤改） | revert + 部署；若已有外部連結，需在新路徑 redirect | < 5 分鐘 | 用 `next.config.js` 的 redirects 機制橋接 |
| localStorage schema 變更導致使用者狀態壞掉 | 程式內加 migration；若 migration 寫錯，需給「重置設定」按鈕 | < 1 天（須改 code） | 在 UI 上提示使用者「請清除瀏覽器快取」 |

**通用原則**：production 出問題第一動作永遠是 Vercel 的「Promote previous deployment」，先恢復服務再找原因。

## 已知問題

按嚴重度排序（高 → 低）：

### 【高】首次載入大型模組（如 CLT 模擬器）較慢

- **症狀**：第一次進入 `/module-4-normal/clt` 頁面 LCP > 3 秒
- **緩解**：使用 Next.js 的 `dynamic import` 拆分視覺化元件
- **驗證**：執行 `pnpm build && pnpm start`，用 Lighthouse 跑該頁面，LCP < 2.5 秒視為通過
- **根因**：D3 + Framer Motion + 模擬引擎打包後 bundle 大

### 【中】Safari 上的某些 SVG 動畫卡頓

- **症狀**：Safari 17 以下版本，模組 3 的硬幣翻轉動畫掉幀
- **緩解**：偵測 Safari 並降低動畫幀率到 30fps
- **驗證**：在 Safari 開啟模組 3-3，肉眼觀察硬幣翻轉應流暢
- **根因**：Safari 的 SVG transform 加速不如 Chrome

### 【中】拖曳資料點時偶爾「黏住」滑鼠

- **症狀**：模組 1-1 拖曳資料點，放開後游標還拖著點
- **緩解**：在 `mouseup` 事件外加 `pointercancel` 監聽
- **驗證**：拖曳 10 次，每次都應在放開時立刻釋放
- **根因**：D3 drag 行為與 React 事件系統的 race condition

### 【低】localStorage 寫入失敗的 silent fail

- **症狀**：隱私模式或磁碟滿時，偏好設定不會保存但無提示
- **緩解**：包裝 localStorage 寫入並 catch 後在 console 警告（僅 dev 環境）
- **驗證**：開 Chrome 無痕模式，更改學習模式偏好，重整後檢查是否回到預設
- **備註**：暫不對使用者顯示警告（教學網站無需嚴格保存設定）
