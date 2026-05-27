# 人類管線清單（約 20–30 分鐘，做一次即可）

> 目標：讓 AI 之後可 **連續做到模組 1 全功能**，中途不因帳號／遠端／部署卡住。
> 完成後請回覆：**「Pipeline 已暢通」** + GitHub repo HTTPS/SSH URL。

---

## 狀態總覽

| # | 步驟 | 負責 | 狀態 |
|---|------|------|------|
| 1 | 建立 GitHub 空 repo | 人類 | ✅ `captain-balung/statistics` |
| 2 | 授權 AI 本輪可 `git push` | 人類（對話一句） | ⬜ |
| 3 | 連接 Vercel ↔ GitHub | 人類 | ✅ production：https://statistics-puce.vercel.app |
| 4 | 確認 Vercel production = `main` | 人類 | ✅ 預設即 `main`（見下方「第五步找不到」說明） |
| 5 | 提供 repo URL 給 AI | 人類 | ⬜ |
| 6 | （可選）邀請協作者 / 確認 Cursor 有 push 權 | 人類 | ⬜ |

AI 在你回覆 URL +「Pipeline 已暢通」後會做：`git init`、首次 commit（文件 + 程式）、`remote`、`push`、Phase 0 起點。

---

## 步驟 1：GitHub 空 repo

1. 到 GitHub → **New repository**
2. 建議名稱：`statistics-playground`（可自訂）
3. **不要**勾選 README / .gitignore / license（本地已有文件，避免衝突）
4. 可選 Public（教學開源）或 Private
5. 複製 **HTTPS** 或 **SSH** URL，例如：  
   `https://github.com/<你>/<repo>.git`

---

## 步驟 2：授權 push（對話一句即可）

在 Cursor 對 AI 說其中一句（本輪 Phase 0–3 有效）：

> **「本輪開發可以 git push 到 origin。」**

（若只想先 Phase 0：改說「Phase 0 完成前可以 push」。）

---

## 步驟 3：Vercel 連 GitHub

1. 登入 [vercel.com](https://vercel.com) → **Add New Project**
2. Import 剛建立的 GitHub repo
3. Framework Preset：**Next.js**（AI 建好專案後會自動對上）
4. **Environment Variables**：MVP **不需要**（已裁定無 analytics、無 API key）
5. Deploy 可先失敗沒關係（尚無 `package.json`）；連線成功即可

---

## 步驟 4：Production 分支（找不到欄位時可跳過）

Vercel 新介面常**不顯示**「Production Branch」字樣；若你是用 GitHub 的 **`main`** 建專案且 Visit 已是正式站，**預設就是 `main`**，不必改。

**要自行確認時，任一路徑即可：**

**路徑 A（最直覺）— Deployments**

1. 專案左側 **Deployments**
2. 最新一筆應有 **Production** 標籤
3. 點進去 → **Source** / **Git Branch** 應顯示 `main`

**路徑 B — Environments**

1. **Settings** → **Environments**（有時在 Git 上方或 General 附近）
2. 點 **Production** 環境
3. 看 **Branch Tracking** 或 **Git Branch** 是否為 `main`

**路徑 C — 舊版 Git 頁**

1. **Settings → Git**（你截圖那頁）
2. **往下捲到底**；部分帳號在「Connected Git Repository」下方才有 **Production Branch**
3. 若整頁都沒有 → 用路徑 A 確認即可

Production URL 已記錄：**https://statistics-puce.vercel.app**（見 `design.md`）

---

## 步驟 5：回覆 AI

範本：

```
Pipeline 已暢通
Repo: https://github.com/xxx/statistics-playground.git
Vercel production: https://xxx.vercel.app   （若有）
本輪開發可以 git push 到 origin。
```

---

## 步驟 6（可選）

- 若用 GitHub Actions：repo **Settings → Actions → General** 允許 workflow
- 若 repo 為 org：確認 Vercel GitHub App 有權限讀取該 repo

---

## 你 **不必** 現在做的事（刻意延後）

| 項目 | 延後到 |
|------|--------|
| 自訂網域 DNS | 上線後任意時間 |
| Plausible / GA | 已裁定不做；Phase 11 再議 |
| 統計內容專家審稿 | Phase 11 或你抽查時 |
| 學習進度雲端 | spec 已排除 |
| merge 每個 PR | AI 開 PR 後你點 merge 即可 |

---

## 人類在開發過程中的「稀疏關卡」（無法一次做完）

| 時機 | 你做什麼 | 預估耗時 |
|------|----------|----------|
| 每個 Phase PR | Review + 點 **Merge** | 5–15 分鐘 |
| AI 報「統計公式不確定」 | 確認公式或指定教科書 | 依議題 |
| Phase 11 | Lighthouse 肉眼看一下、回滾演練按一次 Promote | 30 分鐘 |
| 事後 | 抽查 `/content` 教學文字是否正確 | 持續 |

---

## 驗收：管線已暢通

- [ ] GitHub repo 存在且 URL 已給 AI
- [ ] 已授權本輪 `git push`
- [ ] Vercel 已 import 該 repo，production = `main`
- [ ] 對話已回覆「Pipeline 已暢通」

全部勾選後，AI 即可從 Phase 0.1.1 連續執行至 **模組 1（F1-1～F1-3）** 完成。
