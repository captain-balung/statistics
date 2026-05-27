# Kickoff 決策紀錄（人類已裁定）

> 本檔為 **人類一次裁定、AI 長期遵循** 的來源。與 `log.md` 決策條目對應。  
> 最後更新：2026-05-27（本輪收工）

---

## 已裁定

| ID | 議題 | 決定 |
|---|---|---|
| **D-001** | Production 域名 | Vercel **`https://statistics-puce.vercel.app`**，暫不綁自訂網域 |
| **D-002** | Analytics | 第一版 **零** 第三方追蹤 |
| **D-003** | 教學文字 | AI 繁中草稿，不標待審；人類事後抽查 |
| **REPO** | Git 遠端 | `https://github.com/captain-balung/statistics` |
| **VERCEL** | 部署 | 已連線；`main` push 自動部署 |

---

## 本輪開發成果（2026-05-27 收工）

- Phase **0–9** 核心互動已實作（7 模組、22 子頁、spec F1–F7 對應功能）。
- Phase **10** 部分：全站學習模式切換器；模擬類含開始／暫停／重置；引導／挑戰可再逐頁加深。
- Phase **11** 待辦：Playwright E2E、Lighthouse 實測、內容專家審稿、回滾演練。
- 套件管理：開發環境以 **npm** 為準（`package-lock.json`）。

---

## 下回協作建議起點

1. 閱讀 `roadmap.md` → **「下回開工」** 一節。  
2. 若要加深教學：指定模組編號（如「模組 7 動畫」「CLT 挑戰自動判定」）。  
3. 新增 npm 依賴或改 `spec.md` 前，依 `ai-rules.md` 確認。

---

## AI 仍需人類點頭的操作

見 `ai-rules.md`（push 已授權本專案開發期使用、merge PR、改 spec、統計公式存疑時等）。
