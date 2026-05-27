import { err, ok, type Result } from './result'

function finiteValues(values: number[]): Result<number[]> {
  if (values.length === 0) return err('至少需要一筆資料')
  const finite = values.filter((v) => Number.isFinite(v))
  if (finite.length === 0) return err('沒有有效的數值')
  return ok(finite)
}

export function mean(values: number[]): Result<number> {
  const parsed = finiteValues(values)
  if (!parsed.ok) return parsed
  const sum = parsed.value.reduce((a, b) => a + b, 0)
  return ok(sum / parsed.value.length)
}

export function median(values: number[]): Result<number> {
  const parsed = finiteValues(values)
  if (!parsed.ok) return parsed
  const sorted = [...parsed.value].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return ok((sorted[mid - 1]! + sorted[mid]!) / 2)
  }
  return ok(sorted[mid]!)
}

export function mode(values: number[]): Result<number[]> {
  const parsed = finiteValues(values)
  if (!parsed.ok) return parsed
  const freq = new Map<number, number>()
  for (const v of parsed.value) {
    freq.set(v, (freq.get(v) ?? 0) + 1)
  }
  let maxFreq = 0
  for (const f of freq.values()) maxFreq = Math.max(maxFreq, f)
  if (maxFreq <= 1) return ok([])
  const modes: number[] = []
  for (const [v, f] of freq) {
    if (f === maxFreq) modes.push(v)
  }
  return ok(modes.sort((a, b) => a - b))
}

export function range(values: number[]): Result<number> {
  const parsed = finiteValues(values)
  if (!parsed.ok) return parsed
  const min = Math.min(...parsed.value)
  const max = Math.max(...parsed.value)
  return ok(max - min)
}

export function variance(
  values: number[],
  options?: { sample?: boolean },
): Result<number> {
  const m = mean(values)
  if (!m.ok) return m
  const parsed = finiteValues(values)
  if (!parsed.ok) return parsed
  const n = parsed.value.length
  if (options?.sample && n < 2) return err('樣本變異數至少需要 2 筆資料')
  const divisor = options?.sample ? n - 1 : n
  const sumSq = parsed.value.reduce((acc, v) => acc + (v - m.value) ** 2, 0)
  return ok(sumSq / divisor)
}

export function standardDeviation(
  values: number[],
  options?: { sample?: boolean },
): Result<number> {
  const v = variance(values, options)
  if (!v.ok) return v
  return ok(Math.sqrt(v.value))
}
