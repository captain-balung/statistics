import { describe, expect, it } from 'vitest'
import { standardNormalCdf, binomialPmf } from '../../lib/statistics/distributions'
import { zToPercentileRank, percentileRankToZ } from '../../lib/statistics/conversions'

describe('distributions', () => {
  it('standardNormalCdf at 0', () => {
    const r = standardNormalCdf(0)
    expect(r.ok && r.value).toBeCloseTo(0.5, 3)
  })

  it('binomial peak', () => {
    const r = binomialPmf(6, 12, 0.5)
    expect(r.ok).toBe(true)
  })
})

describe('conversions', () => {
  it('z-pr round trip', () => {
    const pr = zToPercentileRank(1)
    if (!pr.ok) throw new Error('fail')
    const z = percentileRankToZ(pr.value)
    if (!z.ok) throw new Error('fail')
    expect(z.value).toBeCloseTo(1, 1)
  })
})
