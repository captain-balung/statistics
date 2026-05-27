import type { ReactNode } from 'react'

export function MisconceptionAlert({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-accent-red pl-3 text-sm leading-relaxed text-ink-soft">
      <span className="mr-1" aria-hidden>
        ⚠️
      </span>
      {children}
    </blockquote>
  )
}
