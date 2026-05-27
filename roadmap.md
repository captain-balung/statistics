# roadmap.md — 開發進度駕駛艙

> 本文件為 AI 主導維護，人類監督者首要讀物。
> 狀態符號：✅ 已完成 | 🔄 進行中 | ⬜ 未開始 | ⛔ 阻塞中 | ⏭️ 已跳過
> 父節點狀態由子節點推導，不可手動覆寫。
> 葉節點原則：30 分鐘內可完成，附明確機器可驗證條件。

---

## 進度摘要（2026-05-27 收工）

- **整體**：spec 功能清單 **F1–F7 核心互動已實作**；30 個 App 路由；`npm run build` / `npm test` 通過
- **Production**：[https://statistics-puce.vercel.app](https://statistics-puce.vercel.app)
- **Repo**：[github.com/captain-balung/statistics](https://github.com/captain-balung/statistics)
- **本輪狀態**：**暫停開發** — 文件已同步；下回見下方「下回開工」

### Phase 完成度（摘要）

| Phase | 名稱 | 狀態 |
|-------|------|------|
| 0 | 工程基底 | ✅ |
| 1 | 統計函式庫 | ✅（基礎測試 8 項；進階對照 scipy 待補） |
| 2 | 共用元件 | ✅（核心已用；Axis/RTL 等可擴充） |
| 3–9 | 模組 1–7 | ✅ |
| 10 | 學習模式 | 🔄 切換器全站；引導/挑戰內容可加深 |
| 11 | 上線準備 | ⬜ E2E、Lighthouse、審稿、回滾演練 |

---

## 下回開工（建議順序）

1. **內容**：統計教師抽查 `/content` 與各模組「常見誤解」
2. **FX-1 加深**：將 `LabModeHints` 接到重點實驗（如 CLT 挑戰自動判定，對應 spec 成功標準 A）
3. **品質**：Playwright 煙霧測試（首頁 + 模組 1 拖點 + 模組 4 CLT）
4. **效能**：Lighthouse（首頁、module-4/clt、module-1/data-lab）
5. **可選**：husky pre-commit、Recharts/D3 未用依賴清理

---

## 當前焦點

⏸️ **收工中** — 無進行中任務。恢復開發時從「下回開工」擇一項開始。

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

## 工作分解結構（WBS）— 收工快照

> 以下為本輪實作結果；細項模板見 spec.md。未勾選者留待下回。

### Phase 0–2 ✅（摘要）

- Next.js 15 + TS strict + Tailwind + design tokens
- `/lib/statistics` 全檔 + `/lib/rng` + Vitest（8 tests）
- 共用：`ThreeColumnLayout`、`Slider`、`Button`、`ExplanationPanel`、`SimulationControls`、`LearningModeSwitch`
- GitHub Actions CI；Vercel production 已通
- ⬜ 未做：husky、Playwright、完整 RTL 元件測試

### Phase 3–9 ✅（模組對照 spec）

| 模組 | 功能 ID | 路由前綴 |
|------|---------|----------|
| 1 | F1-1～F1-3 | `/module-1-descriptive/*` |
| 2 | F2-1～F2-3 | `/module-2-correlation/*` |
| 3 | F3-1～F3-3 | `/module-3-probability/*` |
| 4 | F4-1～F4-4 | `/module-4-normal/*` |
| 5 | F5-1 | `/module-5-sampling` |
| 6 | F6-1 | `/module-6-t-distribution` |
| 7 | F7-1～F7-4c | `/module-7-hypothesis/*` |

### Phase 10 🔄

- ✅ `LearningModeSwitch` + `LabControls` 全實驗室
- ✅ 模擬模式 + 開始／暫停／重置（CLT、抽樣、LLN 等）
- ⬜ 各頁引導步驟與挑戰自動評分（`LabModeHints` 待廣泛接入）

### Phase 11 ⬜

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
