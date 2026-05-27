import { mean, standardDeviation } from './descriptive'
import { standardNormalCdf, tCdf } from './distributions'
import { err, ok, type Result } from './result'

export type TestResult = {
  statistic: number
  pValue: number
  df?: number
}

export function oneSampleZTest(
  sample: number[],
  populationMean: number,
  populationSd: number,
): Result<TestResult> {
  const m = mean(sample)
  if (!m.ok) return m
  if (populationSd <= 0) return err('母體標準差必須大於 0')
  const n = sample.length
  const z = (m.value - populationMean) / (populationSd / Math.sqrt(n))
  const p = standardNormalCdf(-Math.abs(z))
  if (!p.ok) return p
  return ok({ statistic: z, pValue: 2 * p.value })
}

export function oneSampleTTest(
  sample: number[],
  populationMean: number,
): Result<TestResult> {
  const m = mean(sample)
  const sd = standardDeviation(sample, { sample: true })
  if (!m.ok) return m
  if (!sd.ok) return sd
  const n = sample.length
  if (n < 2) return err('樣本數至少為 2')
  const se = sd.value / Math.sqrt(n)
  if (se === 0) return err('標準誤為零')
  const t = (m.value - populationMean) / se
  const df = n - 1
  const pOne = tCdf(-Math.abs(t), df)
  if (!pOne.ok) return pOne
  return ok({ statistic: t, pValue: 2 * pOne.value, df })
}

export function twoSampleTTest(
  sampleA: number[],
  sampleB: number[],
  pooled: boolean,
): Result<TestResult> {
  const ma = mean(sampleA)
  const mb = mean(sampleB)
  const sa = standardDeviation(sampleA, { sample: true })
  const sb = standardDeviation(sampleB, { sample: true })
  if (!ma.ok || !mb.ok || !sa.ok || !sb.ok) return err('無法計算檢定')
  const n1 = sampleA.length
  const n2 = sampleB.length
  if (n1 < 2 || n2 < 2) return err('每組至少 2 筆')
  let se: number
  let df: number
  if (pooled) {
    const sp2 =
      ((n1 - 1) * sa.value ** 2 + (n2 - 1) * sb.value ** 2) / (n1 + n2 - 2)
    se = Math.sqrt(sp2 * (1 / n1 + 1 / n2))
    df = n1 + n2 - 2
  } else {
    se = Math.sqrt(sa.value ** 2 / n1 + sb.value ** 2 / n2)
    const num = sa.value ** 2 / n1 + sb.value ** 2 / n2
    df =
      (num * num) /
      ((sa.value ** 4) / (n1 * n1 * (n1 - 1)) +
        (sb.value ** 4) / (n2 * n2 * (n2 - 1)))
  }
  if (se === 0) return err('標準誤為零')
  const t = (ma.value - mb.value) / se
  const pOne = tCdf(-Math.abs(t), df)
  if (!pOne.ok) return pOne
  return ok({ statistic: t, pValue: 2 * pOne.value, df })
}

export function pairedTTest(before: number[], after: number[]): Result<TestResult> {
  if (before.length !== after.length || before.length < 2) {
    return err('成對資料長度需一致且至少 2 對')
  }
  const diff = before.map((b, i) => after[i]! - b)
  return oneSampleTTest(diff, 0)
}
