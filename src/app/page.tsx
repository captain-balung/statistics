const MODULES = [
  { n: 1, title: '敘述統計量', slug: 'module-1-descriptive' },
  { n: 2, title: '相關與回歸分析', slug: 'module-2-correlation' },
  { n: 3, title: '機率與二項式分配', slug: 'module-3-probability' },
  { n: 4, title: '常態分配', slug: 'module-4-normal' },
  { n: 5, title: '母體與抽樣分布', slug: 'module-5-sampling' },
  { n: 6, title: 'T 分配', slug: 'module-6-t-distribution' },
  { n: 7, title: '假設檢定', slug: 'module-7-hypothesis' },
] as const

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-sm uppercase tracking-widest text-accent-blue">
        Statistics Playground
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink">
        統計遊樂場
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        讓統計概念變成可拖、可拉、可模擬的物件——不是網頁版計算機。
      </p>

      <section className="mt-12 rounded-md border border-[var(--color-rule)] bg-[var(--color-bg-elevated)] p-6">
        <h2 className="font-display text-xl text-ink">七大模組</h2>
        <p className="mt-2 text-sm text-ink-soft">互動內容陸續上線。</p>
        <ol className="mt-6 space-y-3">
          {MODULES.map((m) => (
            <li
              key={m.slug}
              className="flex items-baseline gap-3 border-b border-[var(--color-rule)] pb-3 last:border-0 last:pb-0"
            >
              <span className="font-mono text-lg text-accent-yellow">{m.n}</span>
              <span className="text-ink">{m.title}</span>
              <span className="ml-auto font-mono text-xs text-ink-mute">即將推出</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-10 font-mono text-sm text-ink-mute">
        開發中 · 第一版首頁
      </p>
    </main>
  )
}
