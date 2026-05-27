import { createRng, randomNormal } from '../rng'
import { err, ok, type Result } from './result'

export type PopulationKind =
  | 'normal'
  | 'uniform'
  | 'skewed'
  | 'bimodal'
  | 'dice'
  | 'custom'

export function drawFromPopulation(
  kind: PopulationKind,
  rng: () => number,
  custom?: number[],
): Result<number> {
  switch (kind) {
    case 'normal':
      return ok(50 + randomNormal(rng) * 10)
    case 'uniform':
      return ok(20 + rng() * 60)
    case 'skewed':
      return ok(10 + Math.pow(rng(), 2) * 80)
    case 'bimodal':
      return ok(rng() < 0.5 ? 25 + rng() * 10 : 65 + rng() * 10)
    case 'dice':
      return ok(1 + Math.floor(rng() * 6))
    case 'custom':
      if (!custom?.length) return err('自訂母體需要資料')
      return ok(custom[Math.floor(rng() * custom.length)]!)
    default:
      return err('未知母體類型')
  }
}

export function sampleMean(values: number[]): Result<number> {
  if (!values.length) return err('空樣本')
  return ok(values.reduce((a, b) => a + b, 0) / values.length)
}

export function takeSample(
  kind: PopulationKind,
  n: number,
  rng: () => number,
  custom?: number[],
): Result<number[]> {
  if (n < 1) return err('樣本數至少為 1')
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const v = drawFromPopulation(kind, rng, custom)
    if (!v.ok) return v
    out.push(v.value)
  }
  return ok(out)
}

export function cltSampleMeans(
  kind: PopulationKind,
  sampleSize: number,
  numSamples: number,
  seed: number,
  custom?: number[],
): Result<number[]> {
  const rng = createRng(seed)
  const means: number[] = []
  for (let i = 0; i < numSamples; i++) {
    const s = takeSample(kind, sampleSize, rng, custom)
    if (!s.ok) return s
    const m = sampleMean(s.value)
    if (!m.ok) return m
    means.push(m.value)
  }
  return ok(means)
}
