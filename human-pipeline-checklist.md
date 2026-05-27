# 人類管線清單

> **狀態：✅ 已完成（2026-05-27）**  
> 管線已暢通；後續開發可直接從 `roadmap.md` 的「下回開工」接續。

---

## 狀態總覽

| # | 步驟 | 狀態 |
|---|------|------|
| 1 | GitHub repo `captain-balung/statistics` | ✅ |
| 2 | 授權 AI `git push` | ✅ |
| 3 | Vercel ↔ GitHub | ✅ |
| 4 | Production = `main` | ✅ |
| 5 | Repo URL 已提供 | ✅ |
| 6 | 協作者（可選） | ⬜ 未設定 |

**Production**：[https://statistics-puce.vercel.app](https://statistics-puce.vercel.app)

---

## 新環境克隆時（給未來的自己）

```bash
git clone https://github.com/captain-balung/statistics.git
cd statistics
npm install
npm run dev
```

Vercel 無需重連（已綁 repo）；僅在新 fork 或新 Vercel 專案時重做 Import。

---

## 稀疏人類關卡（開發進行中）

| 時機 | 動作 |
|------|------|
| 重大 PR | Review 後 merge `main` |
| 統計公式不確定 | 確認教科書或權威軟體輸出 |
| 上線前 | 抽查 `/content` 與關鍵模組互動 |
| Phase 11 | Lighthouse、回滾演練（可選） |
