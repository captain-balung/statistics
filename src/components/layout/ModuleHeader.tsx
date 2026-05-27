import Link from 'next/link'

type LabLink = { href: string; label: string; active?: boolean }

type ModuleHeaderProps = {
  moduleTitle: string
  labs: LabLink[]
}

export function ModuleHeader({ moduleTitle, labs }: ModuleHeaderProps) {
  return (
    <header className="border-b border-[var(--color-rule)] bg-[var(--color-bg)] px-4 py-4 lg:px-6">
      <Link
        href="/"
        className="font-mono text-xs text-ink-mute hover:text-accent-blue"
      >
        ← 模組列表
      </Link>
      <h1 className="mt-2 font-display text-2xl text-ink">{moduleTitle}</h1>
      <nav className="mt-4 flex flex-wrap gap-2">
        {labs.map((lab) => (
          <Link
            key={lab.href}
            href={lab.href}
            className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
              lab.active
                ? 'border-accent-blue bg-accent-blue text-white'
                : 'border-[var(--color-rule)] bg-[var(--color-bg-elevated)] text-ink hover:border-accent-blue'
            }`}
          >
            {lab.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
