# Kickoff 決策紀錄（人類已裁定）

> 本檔為 **人類一次裁定、AI 長期遵循** 的來源。與 `log.md` 決策條目對應。
> 最後更新：2026-05-27

---

## 已裁定（可解鎖 AI）

| ID | 議題 | 決定 | 對管線的意義 |
|---|---|---|---|
| **D-001** | Production 域名 | **Vercel 預設 `*.vercel.app`** 作為 production，第一版不綁自訂網域 | Phase 0.3.3 可改為「連 Vercel + 設 production branch = main」，不需等域名 |
| **D-002** | Analytics | **第一版零第三方追蹤**（無 GA / Plausible / Pixel） | 不需 `.env`、不需改 CI、spec 資安欄位已對齊 |
| **D-003** | 教學文字 | **AI 撰寫繁中草稿，頁面不標「待審」**；人類事後抽查，Phase 11 前可再審 | 模組實作時解釋區可直接寫入 `/content`，不阻塞開發 |
| **MVP** | 第一個完整里程碑 | **模組 1 全功能**：F1-1 + F1-2 + F1-3 + 探索模式 + 三欄 layout | AI 目標 = Phase 0 → 1 → 2 → 3（含 F1-3） |
| **REPO** | Git 遠端 | **`https://github.com/captain-balung/statistics`** | 首次 push 含 Next.js 首頁 |
| **VERCEL** | 部署時機 | 已 Import；production 已上線 | **https://statistics-puce.vercel.app** |

---

## 衍生預設（未單獨表決，依上表推導）

- **Preview**：每個 PR 自動 Vercel Preview（與 production 同專案）。
- **預設進入頁**：`/module-1-descriptive`（與 README 一致）；首頁仍保留 7 模組導覽。
- **學習模式**：M1 只做 **探索**；引導／挑戰／模擬留 Phase 10。
- **深色模式**：不做（spec / design 已寫）。
- **KaTeX**：Phase 0 不新增依賴；公式先以純文字 + mono 字體呈現，若實作受阻再開決策。

---

## 仍須人類完成（管線暢通前）

見 **`human-pipeline-checklist.md`**。完成後在對話回覆：「Pipeline 已暢通」+ GitHub repo URL。

---

## AI 暢通後的自動執行順序（無需再問，除非踩 ai-rules 紅線）

1. Phase 0.1–0.2：Next.js + strict TS + Tailwind + tokens + lint/test
2. Phase 0.3.1–0.3.2：GitHub Actions + Vercel（依人類已連線的 repo）
3. Phase 0.4：三欄 layout + 首頁 + 7 placeholder
4. Phase 1 + 2（並行）：`/lib/statistics` + 共用元件
5. Phase 3：**模組 1 全功能**（F1-1、F1-2、F1-3）
6. 每個 Phase 結束：更新 `roadmap.md`、`log.md`（append-only）

**仍需人類點頭的操作**（ai-rules，無法代勞）：

- 每次 `git push`（可 session 內批次授權：「本輪開發可 push」）
- 每次 **新增** npm 依賴（Phase 0 既定依賴清單除外，見 design.md）
- `merge` 到 `main`（建議每完成一個 Phase 開 PR，人類 merge）
- 統計公式／自由度不確定時
- 修改 `spec.md` / `ai-rules.md` 本體
