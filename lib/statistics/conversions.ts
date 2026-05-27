import { standardNormalCdf, standardNormalInvCdf } from './distributions'
import { err, ok, type Result } from './result'

export function zToPercentileRank(z: number): Result<number> {
  const cdf = standardNormalCdf(z)
  if (!cdf.ok) return cdf
  return ok(cdf.value * 100)
}

export function percentileRankToZ(pr: number): Result<number> {
  if (pr < 0 || pr > 100) return err('PR 必須在 0–100 之間')
  return standardNormalInvCdf(pr / 100)
}
