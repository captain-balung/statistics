import { formatStat } from '@/lib/format'

type LiveValueDisplayProps = {
  label: string
  value: number | null
  hint?: string
}

export function LiveValueDisplay({ label, value, hint }: LiveValueDisplayProps) {
  return (
    <div className="rounded-sm border border-[var(--color-rule)] bg-[var(--color-bg)] px-3 py-2">
      <p className="text-xs text-ink-mute">{label}</p>
      <p className="font-mono text-2xl text-ink">
        {value === null ? '—' : formatStat(value)}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  )
}
