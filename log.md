# log.md — 變更日誌

> **Append-only**。既有條目不可修改；發現錯誤請新增「修正」類型條目並指向舊條目。
> 時間戳採 ISO 8601 含時區。AI 必須使用 UTC 或明確時區，不使用本地時間。
> 「AI 自主判斷」觸發來源是事後追究的關鍵標籤，AI 不可省略。

---

## 條目格式

```
### [{時間戳}] {類型} | {範圍與摘要}
- 觸發來源：{人類指示 / QA 退件 / 自動偵測 / AI 自主判斷}
- 風險等級：{低 / 中 / 高 / 不可逆}
- 內容：（變更/修正使用）做了什麼、影響範圍
- 決策內容：（決策類型專用）
  - 脈絡：為何需要決策
  - 選項：考慮過哪些
  - 決定：選了哪個
  - 後果：已知的代價
```

---

## 條目

### [2025-XX-XX TXX:XX:XX+08:00] 決策 | 專案文件體系初始化
- 觸發來源：人類指示
- 風險等級：低
- 內容：依《小型軟體生產規範體系》建立 README、spec、ai-rules、design、roadmap、log 六份文件初稿。
- 決策內容：
  - 脈絡：開發 Statistics Playground 統計學教學網站，需要文件體系作為 AI 協作基礎。
  - 選項：
    1. 不寫文件，邊做邊談
    2. 採完整版 14 份文件
    3. 採小型版 6 份文件
  - 決定：採小型版 6 份文件。
  - 後果：規模擴大時需要重新分層（小型版「內容性質」分層 → 完整版「使用視角」分層），並非單純補欄位。

### [2025-XX-XX TXX:XX:XX+08:00] 決策 | 技術選型
- 觸發來源：人類指示
- 風險等級：中
- 內容：見 design.md 技術選型一節。
- 決策內容：
  - 脈絡：需要選定語言、框架、視覺化、動畫、狀態管理、測試等基礎技術。
  - 選項（節錄關鍵的）：
    - 視覺化：D3.js vs Recharts vs Chart.js vs Plotly
    - 動畫：Framer Motion vs GSAP vs CSS Animation
    - 狀態：Zustand vs Redux Toolkit vs Context only
  - 決定：D3.js（主）+ Recharts（輔）；Framer Motion；Zustand。
  - 後果：
    - D3 學習曲線陡，但拖曳資料點、SSE 動畫等場景幾乎只有 D3 能做
    - Framer Motion 包大小較 CSS animation 大，接受
    - Zustand 跨頁面共享狀態方便，但要求團隊紀律不亂用 store

### [2025-XX-XX TXX:XX:XX+08:00] 決策 | 視覺設計方向
- 觸發來源：人類指示
- 風險等級：中
- 內容：在 spec.md 新增「視覺設計原則」一節，在 design.md 新增「設計系統」一節，定義色票、字型、字級、間距、圓角、陰影、動畫、圖表規範等 token。
- 決策內容：
  - 脈絡：原文件僅有「明亮、動畫化、科普風格」等高層描述，缺乏可被 AI 一致遵循的視覺規範。實作開始後若無 token 規範，AI 會落入通用 SaaS 美學（Inter + 紫粉漸層 + 圓角卡片）。
  - 選項：
    1. 不寫，等實作時逐次討論
    2. 開獨立 design-system.md
    3. spec.md 寫原則 + design.md 寫 token（兩層分工）
  - 決定：選項 3。原則層回答「為什麼這樣設計」（可被引用拒絕方案），規格層回答「具體用什麼值」（可被 AI 直接消費）。
  - 後果：
    - 視覺方向定為「科普雜誌編輯設計」（參考 Quanta / Nautilus / Pudding），刻意避開 edtech 通用美學
    - 字型選用 Fraunces + Source Serif 4 + JetBrains Mono，**鎖死**禁用 Inter/Roboto/Arial
    - 色票採米白底 + 墨黑字 + 紅藍黃三原色，禁用漸層
    - 未來若要改方向（例：改 brutalist 工程感、80s 復古），視為 breaking 並重寫整個設計系統，須再次走決策流程

---

### [2026-05-27T00:00:00+08:00] 決策 | D-001 production 部署策略
- 觸發來源：人類指示（Kickoff 問卷）
- 風險等級：低
- 決策內容：
  - 脈絡：roadmap 阻塞 0.3.3，design.md production URL 未定。
  - 選項：延後 production / Vercel 預設網域 / 自訂網域。
  - 決定：**Vercel `*.vercel.app` 作為 production**，第一版不綁自訂網域。
  - 後果：可立即連 Vercel；對外 URL 為 vercel 子網域，日後加自訂網域需 DNS 設定（非 breaking）。

### [2026-05-27T00:00:00+08:00] 決策 | D-002 第一版不使用 analytics
- 觸發來源：人類指示（Kickoff 問卷）
- 風險等級：低
- 決策內容：
  - 脈絡：spec 資安欄位留 analytics 彈性，需避免 AI 擅自加追蹤腳本。
  - 選項：零追蹤 / Phase 11 再議 Plausible / 現在啟用。
  - 決定：**MVP 零第三方追蹤**。
  - 後果：無 `.env` 需求；符合 ai-rules「不可未確認加追蹤腳本」。

### [2026-05-27T00:00:00+08:00] 決策 | D-003 教學文字與 MVP 範圍
- 觸發來源：人類指示（Kickoff 問卷）
- 風險等級：中（教學正確性）
- 決策內容：
  - 脈絡：模組解釋區內容由誰產出、M1 功能範圍。
  - 決定：**AI 撰寫繁中草稿，頁面不標「待審」**；人類事後抽查。MVP = **模組 1 全功能 F1-1～F1-3** + 探索模式。
  - 後果：開發不阻塞；人類需安排抽查或 Phase 11 審稿。教學錯誤風險由 AI 對照教科書測試 + 不確定時停下詢問緩解。

### [2026-05-27T20:00:00+08:00] 變更 | 全模組 2–7 與統計函式庫完成
- 觸發來源：人類指示（繼續做到完）
- 風險等級：中
- 內容：實作 `/lib/statistics` 全模組（correlation、distributions、conversions、sampling、inference）；模組 4–7 全部子功能頁；模組 2–3、5–6 互動實驗；學習模式切換（探索/引導/挑戰/模擬）與模擬控制元件；`prefers-reduced-motion`；30 路由靜態建置通過。引導/挑戰內容可再逐頁加深。

### [2026-05-27T16:00:00+08:00] 變更 | MVP 模組 1 全功能上線
- 觸發來源：人類指示（授權 push 與安裝權限，做到模組 1 完成）
- 風險等級：中
- 內容：Phase 0–3 核心交付：`/lib/statistics`（descriptive + Result）、`/lib/rng`、Vitest、CI、三欄 layout。模組 1：F1-1 資料點拖曳數線、F1-2 平均數平衡木（Framer Motion）、F1-3 標準差伸縮雙曲線對照；探索模式；模組 2–7 placeholder。`npm test` + `npm run build` 通過。

### [2026-05-27T14:00:00+08:00] 變更 | Vercel production 上線
- 觸發來源：人類指示
- 風險等級：低
- 內容：Vercel 已連接 `captain-balung/statistics`。Production URL：https://statistics-puce.vercel.app 。已寫入 `design.md`、`kickoff-decisions.md`。

### [2026-05-27T12:00:00+08:00] 變更 | 首次 push：Next.js 首頁 + 工程骨架
- 觸發來源：人類指示（repo 就緒；Vercel 延後至 push 後）
- 風險等級：低
- 內容：手動建立 Next.js 15 + TypeScript strict + Tailwind + design tokens；首頁列出七大模組（即將推出）。`npm run build` 與 `lint` 通過。推送至 `https://github.com/captain-balung/statistics` main。套件管理暫用 npm（本機 pnpm/corepack 無權限）。

### [2026-05-27T00:00:00+08:00] 變更 | 新增管線文件 kickoff-decisions、human-pipeline-checklist
- 觸發來源：人類指示
- 風險等級：低
- 內容：記錄裁定決策與人類一次性清單，解鎖 AI 連續執行 Phase 0→3。更新 roadmap、design、spec 對齊。

---

## 預留：AI 自動寫入區

> 以下為 AI 在後續開發中自動 append 的條目所用。
> 範例（移除後請依實際操作 append）：

### [範例] [2025-XX-XX TXX:XX:XX+08:00] 變更 | 安裝新依賴 mathjs@^12.0.0
- 觸發來源：人類指示
- 風險等級：低
- 內容：在 package.json 加入 mathjs 作為 runtime dependency，用於統計函式庫的數值運算輔助。已執行 `pnpm install`，lockfile 已更新並 commit。

### [範例] [2025-XX-XX TXX:XX:XX+08:00] 變更 | refactor 標準差計算
- 觸發來源：AI 自主判斷
- 風險等級：低
- 內容：將 `/lib/statistics/descriptive.ts` 的 `standardDeviation` 從 reduce 改寫為 Welford's online algorithm，提升大資料集的數值穩定度。對外簽名不變，所有既有測試通過。判斷依據：對外行為不變、有測試保護、屬於工程改善範疇，認為落在「預設許可」範圍。

### [範例] [2025-XX-XX TXX:XX:XX+08:00] 修正 | 修正 [2025-XX-XX] 條目錯誤
- 觸發來源：自動偵測
- 風險等級：低
- 內容：先前條目誤將套件版本記為 mathjs@^11.0.0，實際安裝為 ^12.0.0。原條目保留不改，以本條目作為勘誤。

---

## 檢索用標籤索引

> AI 寫入新條目時可在此追加便於檢索的索引。

- 「AI 自主判斷」條目：（尚無）
- 「不可逆」風險條目：（尚無）
- 重大架構決策：見 design.md 技術選型；對應本檔案的「技術選型」決策條目
