import { erf } from 'mathjs'
import { err, ok, type Result } from './result'

export function standardNormalPdf(z: number): Result<number> {
  return ok(Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI))
}

export function standardNormalCdf(z: number): Result<number> {
  if (!Number.isFinite(z)) return err('無效的 Z 值')
  const v = 0.5 * (1 + Number(erf(z / Math.sqrt(2))))
  return ok(v)
}

export function standardNormalInvCdf(p: number): Result<number> {
  if (p <= 0 || p >= 1) return err('機率必須在 0 與 1 之間')
  // Acklam's approximation
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469138e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ]
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ]
  const c = [
    -7.784894002430293e-3, -3.223964804832978e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
  ]
  const d = [
    7.784695970378477e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ]
  const plow = 0.02425
  const phigh = 1 - plow
  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p))
    return ok(
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
        ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1),
    )
  }
  if (p > phigh) {
    const q = Math.sqrt(-2 * Math.log(1 - p))
    return ok(
      -(
        (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
        ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
      ),
    )
  }
  const q = p - 0.5
  const r = q * q
  const num =
    (((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q
  const den = ((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1
  return ok(num / den)
}

export function normalPdf(x: number, mu: number, sigma: number): Result<number> {
  if (sigma <= 0) return err('σ 必須大於 0')
  const z = (x - mu) / sigma
  const base = standardNormalPdf(z)
  if (!base.ok) return base
  return ok(base.value / sigma)
}

export function normalCdf(x: number, mu: number, sigma: number): Result<number> {
  if (sigma <= 0) return err('σ 必須大於 0')
  return standardNormalCdf((x - mu) / sigma)
}

export function normalInvCdf(p: number, mu: number, sigma: number): Result<number> {
  const z = standardNormalInvCdf(p)
  if (!z.ok) return z
  return ok(mu + sigma * z.value)
}

function logGamma(z: number): number {
  const g = 7
  const coef = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.984369578019571e-6, 1.5056327351493116e-7,
  ]
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z)
  z -= 1
  let x = coef[0]!
  for (let i = 1; i < g + 2; i++) x += coef[i]! / (z + i)
  const t = z + g + 0.5
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
}

function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200
  const EPS = 3e-7
  const FPMIN = 1e-30
  let am = 1
  let bm = 1
  let az = 1
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let bz = 1 - (qab * x) / qap
  let aold = 0
  for (let m = 1; m <= MAXIT; m++) {
    const em = m
    const tem = em + em
    let d = (em * (b - em) * x) / ((qam + tem) * (a + tem))
    am = 1 + d * am
    bm = 1 + d * bm
    d = (-(a + em) * (qab + em) * x) / ((a + tem) * (qap + tem))
    az = 1 + d * az
    bz = 1 + d * bz
    if (am !== 0) {
      d = FPMIN / am
      am *= d
      bm *= d
      az *= d
      bz *= d
    }
    if (bm !== 0) {
      d = 1 / bm
      am *= d
      az *= d
      bz *= d
    }
    aold = az
    const del = az - aold
    if (Math.abs(del) < EPS) return az
  }
  return az
}

function betaIncomplete(a: number, b: number, x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const lnBeta = logGamma(a) + logGamma(b) - logGamma(a + b)
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a
  if (x < (a + 1) / (a + b + 2)) return front * betacf(a, b, x)
  return 1 - (Math.exp(Math.log(1 - x) * b + Math.log(x) * a - lnBeta) / b) * betacf(b, a, 1 - x)
}

export function tPdf(x: number, df: number): Result<number> {
  if (df <= 0 || !Number.isFinite(df)) return err('自由度必須為正數')
  const coef = logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI)
  return ok(Math.exp(coef - ((df + 1) / 2) * Math.log(1 + (x * x) / df)))
}

export function tCdf(x: number, df: number): Result<number> {
  if (df <= 0) return err('自由度必須為正數')
  const t = df / (df + x * x)
  const p = betaIncomplete(df / 2, 0.5, t)
  return ok(x >= 0 ? 1 - 0.5 * p : 0.5 * p)
}

export function binomialPmf(k: number, n: number, p: number): Result<number> {
  if (n < 0 || k < 0 || k > n || p < 0 || p > 1) return err('二項式參數無效')
  if (k === 0) return ok(Math.pow(1 - p, n))
  let coef = 1
  for (let i = 0; i < k; i++) coef = (coef * (n - i)) / (i + 1)
  return ok(coef * Math.pow(p, k) * Math.pow(1 - p, n - k))
}

export function binomialCdf(k: number, n: number, p: number): Result<number> {
  let sum = 0
  for (let i = 0; i <= k; i++) {
    const term = binomialPmf(i, n, p)
    if (!term.ok) return term
    sum += term.value
  }
  return ok(sum)
}
