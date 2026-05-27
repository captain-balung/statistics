import { describe, expect, it } from 'vitest'
import { createRng } from '../../lib/rng'

describe('rng', () => {
  it('same seed yields same sequence', () => {
    const a = createRng(42)
    const b = createRng(42)
    for (let i = 0; i < 5; i++) {
      expect(a()).toBe(b())
    }
  })
})
