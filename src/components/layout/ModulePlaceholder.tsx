import Link from 'next/link'
import { ThreeColumnLayout } from './ThreeColumnLayout'

type ModulePlaceholderProps = {
  title: string
  moduleNumber: number
}

export function ModulePlaceholder({ title, moduleNumber }: ModulePlaceholderProps) {
  return (
    <>
      <header className="border-b border-[var(--color-rule)] px-6 py-4">
        <Link href="/" className="font-mono text-xs text-ink-mute hover:text-accent-blue">
          ← 模組列表
        </Link>
        <h1 className="mt-2 font-display text-2xl text-ink">
          模組 {moduleNumber}：{title}
        </h1>
      </header>
      <ThreeColumnLayout
        controls={
          <p className="text-sm text-ink-soft">此模組互動內容建置中。</p>
        }
        visualization={
          <p className="text-center font-mono text-ink-mute">即將推出</p>
        }
        explanation={
          <p className="text-sm text-ink-soft">
            請先完成模組 1 的敘述統計量實驗；其他章節將依 roadmap 陸續上線。
          </p>
        }
      />
    </>
  )
}
