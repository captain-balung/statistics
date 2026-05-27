# Statistics Playground（統計遊樂場）

讓高中與大學生「看見」統計概念如何運作的互動實驗網站——不是網頁版 SPSS。

**正式站（production）**：[https://statistics-puce.vercel.app](https://statistics-puce.vercel.app)  
**原始碼**：[github.com/captain-balung/statistics](https://github.com/captain-balung/statistics)

---

## 快速開始

### 環境需求

- Node.js ≥ 20.x
- npm ≥ 10.x（專案目前以 `package-lock.json` 管理；亦可用 pnpm，需自行產生 lockfile）

### 安裝與開發

```bash
git clone https://github.com/captain-balung/statistics.git
cd statistics
npm install
npm run dev
```

瀏覽器開啟 [http://localhost:3000](http://localhost:3000)。首頁列出七大模組；進入任一實驗後為 **左控制／中視覺／右解釋** 三欄式操作。

### 建置、測試、檢查

```bash
npm run build    # 正式建置
npm run start    # 預覽建置結果
npm test         # Vitest 單元測試（/lib/statistics、/lib/rng）
npm run lint     # ESLint
npm run format:check   # Prettier
```

部署：push 至 `main` 後由 [Vercel](https://vercel.com) 自動部署（已連接 GitHub repo）。

---

## 七大模組與路由

| 模組 | 入口路徑 | 子實驗 |
|------|----------|--------|
| 1 敘述統計量 | `/module-1-descriptive` | [資料點](https://statistics-puce.vercel.app/module-1-descriptive/data-lab) · [平衡木](https://statistics-puce.vercel.app/module-1-descriptive/balance-beam) · [標準差](https://statistics-puce.vercel.app/module-1-descriptive/spread) |
| 2 相關與回歸 | `/module-2-correlation` | [散佈圖](https://statistics-puce.vercel.app/module-2-correlation/scatter) · [拖曳 r](https://statistics-puce.vercel.app/module-2-correlation/drag-r) · [回歸誤差](https://statistics-puce.vercel.app/module-2-correlation/sse) |
| 3 機率 | `/module-3-probability` | [賭博](https://statistics-puce.vercel.app/module-3-probability/gamble) · [二項式](https://statistics-puce.vercel.app/module-3-probability/binomial) · [大數法則](https://statistics-puce.vercel.app/module-3-probability/lln) |
| 4 常態分配 | `/module-4-normal` | [曲線](https://statistics-puce.vercel.app/module-4-normal/curve) · [面積](https://statistics-puce.vercel.app/module-4-normal/area) · [CLT](https://statistics-puce.vercel.app/module-4-normal/clt) · [Z/PR](https://statistics-puce.vercel.app/module-4-normal/z-pr) |
| 5 抽樣分布 | `/module-5-sampling` | 抽樣分布模擬 |
| 6 T 分配 | `/module-6-t-distribution` | 從母體生成 t |
| 7 假設檢定 | `/module-7-hypothesis` | [總覽](https://statistics-puce.vercel.app/module-7-hypothesis/intro) · [符號](https://statistics-puce.vercel.app/module-7-hypothesis/sign) · [Z](https://statistics-puce.vercel.app/module-7-hypothesis/z-test) · [單樣本 t](https://statistics-puce.vercel.app/module-7-hypothesis/t-one) · [獨立 t](https://statistics-puce.vercel.app/module-7-hypothesis/t-two) · [成對 t](https://statistics-puce.vercel.app/module-7-hypothesis/t-paired) |

每個實驗室左欄可切換 **探索／引導／挑戰／模擬**；含動畫的模擬（如 CLT、大數法則）在 **模擬** 模式下提供開始／暫停／重置。

---

## 專案文件（協作與維護）

| 文件 | 用途 |
|------|------|
| [`spec.md`](spec.md) | 產品精神、功能清單、驗收條件、工程紅線 |
| [`design.md`](design.md) | 技術選型、目錄結構、設計 token、部署 URL |
| [`roadmap.md`](roadmap.md) | Phase 進度與 WBS（**收工時先看「當前狀態」**） |
| [`ai-rules.md`](ai-rules.md) | AI 可／需確認／禁止事項 |
| [`kickoff-decisions.md`](kickoff-decisions.md) | 人類已裁定決策（D-001～D-003 等） |
| [`human-pipeline-checklist.md`](human-pipeline-checklist.md) | 帳號與部署一次性清單（已完成） |
| [`log.md`](log.md) | 變更與決策日誌（append-only） |

---

## 程式結構（摘要）

```
/lib/statistics/     # 統計運算（元件不得重複實作）
/lib/rng/            # 可種子化亂數
/src/app/            # Next.js 路由
/src/modules/        # 各模組互動實驗
/src/components/     # 共用 UI（三欄、滑桿、解釋區等）
/content/modules/    # 教學文字與常見誤解
/tests/unit/         # Vitest
```

詳見 `design.md` 系統結構一節。

---

## 授權與回報

- 授權：MIT
- 問題回報：[GitHub Issues](https://github.com/captain-balung/statistics/issues)（請附瀏覽器版本與重現步驟）
- 教學內容：AI 繁中草稿，建議統計教師事後抽查（見 `kickoff-decisions.md` D-003）
