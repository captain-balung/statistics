import { describe, expect, it } from 'vitest'
import { mean, median, standardDeviation } from '../../lib/statistics/descriptive'

describe('descriptive', () => {
  it('mean of known set', () => {
    const r = mean([2, 4, 6])
    expect(r.ok && r.value).toBe(4)
  })

  it('median even count', () => {
    const r = median([1, 3, 3, 9])
    expect(r.ok && r.value).toBe(3)
  })

  it('standardDeviation sample', () => {
    const r = standardDeviation([2, 4, 4, 4, 5, 5, 7, 9], { sample: true })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value).toBeCloseTo(2.138, 2)
  })

  it('empty array returns err', () => {
    expect(mean([]).ok).toBe(false)
  })
})
