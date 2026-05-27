export function formatStat(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '—'
  const rounded = Number(value.toFixed(digits))
  return rounded.toLocaleString('zh-TW', { maximumFractionDigits: digits })
}
