import type { ReactNode } from 'react'

type ThreeColumnLayoutProps = {
  controls: ReactNode
  visualization: ReactNode
  explanation: ReactNode
}

export function ThreeColumnLayout({
  controls,
  visualization,
  explanation,
}: ThreeColumnLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-0px)] grid-cols-1 gap-0 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(280px,340px)]">
      <aside className="border-b border-[var(--color-rule)] bg-[var(--color-bg-elevated)] p-5 lg:border-b-0 lg:border-r">
        {controls}
      </aside>
      <section className="flex min-h-[320px] flex-col justify-center p-4 lg:p-6">
        {visualization}
      </section>
      <aside className="border-t border-[var(--color-rule)] bg-[var(--color-bg-elevated)] p-5 lg:border-l lg:border-t-0">
        {explanation}
      </aside>
    </div>
  )
}
