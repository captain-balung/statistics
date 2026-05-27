import type { ReactNode } from 'react'
import { MisconceptionAlert } from './MisconceptionAlert'

type ExplanationPanelProps = {
  title: string
  definition: string
  misconceptions: string[]
  children?: ReactNode
}

export function ExplanationPanel({
  title,
  definition,
  misconceptions,
  children,
}: ExplanationPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-ink">{title}</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{definition}</p>
      </div>
      {children}
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-mute">
          學生常見誤解
        </p>
        {misconceptions.map((text) => (
          <MisconceptionAlert key={text}>{text}</MisconceptionAlert>
        ))}
      </div>
    </div>
  )
}
