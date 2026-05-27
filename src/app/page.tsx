import Link from 'next/link'

const MODULES = [
  { n: 1, title: '敘述統計量', slug: 'module-1-descriptive', entry: 'data-lab' },
  { n: 2, title: '相關與回歸分析', slug: 'module-2-correlation', entry: 'scatter' },
  { n: 3, title: '機率與二項式分配', slug: 'module-3-probability', entry: 'gamble' },
  { n: 4, title: '常態分配', slug: 'module-4-normal', entry: 'curve' },
  { n: 5, title: '母體與抽樣分布', slug: 'module-5-sampling', entry: '' },
  { n: 6, title: 'T 分配', slug: 'module-6-t-distribution', entry: '' },
  { n: 7, title: '假設檢定', slug: 'module-7-hypothesis', entry: 'intro' },
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
        <ol className="mt-6 space-y-3">
          {MODULES.map((m) => {
            const href = m.entry ? `/${m.slug}/${m.entry}` : `/${m.slug}`
            return (
              <li
                key={m.slug}
                className="flex items-baseline gap-3 border-b border-[var(--color-rule)] pb-3 last:border-0 last:pb-0"
              >
                <span className="font-mono text-lg text-accent-yellow">{m.n}</span>
                <Link
                  href={href}
                  className="text-ink underline decoration-accent-blue decoration-2 underline-offset-2 hover:text-accent-blue"
                >
                  {m.title}
                </Link>
                <span className="ml-auto font-mono text-xs text-accent-blue">可探索</span>
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}
