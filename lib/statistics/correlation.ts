import { mean } from './descriptive'
import { err, ok, type Result } from './result'

export function pearsonR(xs: number[], ys: number[]): Result<number> {
  if (xs.length !== ys.length || xs.length < 2) return err('至少需要兩組配對資料')
  const mx = mean(xs)
  const my = mean(ys)
  if (!mx.ok || !my.ok) return err('無法計算平均數')
  let num = 0
  let dx = 0
  let dy = 0
  for (let i = 0; i < xs.length; i++) {
    const a = xs[i]! - mx.value
    const b = ys[i]! - my.value
    num += a * b
    dx += a * a
    dy += b * b
  }
  if (dx === 0 || dy === 0) return err('變異為零，無法計算 r')
  return ok(num / Math.sqrt(dx * dy))
}

export type RegressionResult = {
  slope: number
  intercept: number
  r2: number
}

export function linearRegression(xs: number[], ys: number[]): Result<RegressionResult> {
  const r = pearsonR(xs, ys)
  const mx = mean(xs)
  const my = mean(ys)
  if (!r.ok || !mx.ok || !my.ok) return err('無法配適回歸線')
  let sxx = 0
  for (const x of xs) sxx += (x - mx.value) ** 2
  if (sxx === 0) return err('X 變異為零')
  let sxy = 0
  for (let i = 0; i < xs.length; i++) sxy += (xs[i]! - mx.value) * (ys[i]! - my.value)
  const slope = sxy / sxx
  const intercept = my.value - slope * mx.value
  return ok({ slope, intercept, r2: r.value * r.value })
}

export function sumSquaredErrors(
  xs: number[],
  ys: number[],
  slope: number,
  intercept: number,
): Result<number> {
  if (xs.length !== ys.length) return err('資料長度不一致')
  let sse = 0
  for (let i = 0; i < xs.length; i++) {
    const pred = slope * xs[i]! + intercept
    const e = ys[i]! - pred
    sse += e * e
  }
  return ok(sse)
}

/** Generate scatter with approximate target Pearson r */
export function generateCorrelatedPoints(
  n: number,
  targetR: number,
  rng: () => number,
): Result<{ xs: number[]; ys: number[] }> {
  if (n < 3) return err('至少需要 3 點')
  const r = Math.max(-0.99, Math.min(0.99, targetR))
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i < n; i++) {
    const u = rng() * 2 - 1
    const v = rng() * 2 - 1
    xs.push(u)
    ys.push(r * u + Math.sqrt(1 - r * r) * v)
  }
  return ok({ xs, ys })
}
