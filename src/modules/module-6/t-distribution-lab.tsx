'use client'

import { tPdf } from '@lib/statistics/distributions'
import { takeSample, type PopulationKind } from '@lib/statistics/sampling'
import { createRng } from '@lib/rng'
import { mean, standardDeviation } from '@lib/statistics/descriptive'
import { useMemo, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { Button } from '@/components/controls/Button'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'

const W = 640
const H = 200
const PAD = 40

export function TDistributionLab() {
  const [pop, setPop] = useState<PopulationKind>('normal')
  const [n, setN] = useState(8)
  const [knownSigma, setKnownSigma] = useState(false)
  const [tValues, setTValues] = useState<number[]>([])
  const [seed] = useState(3)

  const drawOnce = () => {
    const rng = createRng(seed + tValues.length)
    const sample = takeSample(pop, n, rng)
    if (!sample.ok) return
    const vals = sample.value
    const m = mean(vals)
    const sd = standardDeviation(vals, { sample: true })
    if (!m.ok || !sd.ok || sd.value === 0) return
    const t = knownSigma
      ? (m.value - 50) / (10 / Math.sqrt(n))
      : (m.value - 50) / (sd.value / Math.sqrt(n))
    setTValues((tv) => [...tv, t].slice(-60))
  }

  const df = n - 1
  const curve = useMemo(() => {
    const pts: string[] = []
    for (let x = -4; x <= 4; x += 0.1) {
      const tp = tPdf(x, df)
      const y = (tp.ok ? tp.value : 0) * 80
      const px = PAD + ((x + 4) / 8) * (W - PAD * 2)
      const py = H - PAD - y
      pts.push(`${pts.length ? 'L' : 'M'} ${px} ${py}`)
    }
    return pts.join(' ')
  }, [df])

  const hist = useMemo(() => {
    const bins = Array(16).fill(0)
    for (const t of tValues) {
      const i = Math.max(0, Math.min(15, Math.floor(((t + 4) / 8) * 16)))
      bins[i]++
    }
    return bins
  }, [tValues])

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <select className="w-full rounded-sm border p-2" value={pop} onChange={(e) => setPop(e.target.value as PopulationKind)}>
            <option value="normal">常態母體</option>
            <option value="uniform">均勻母體</option>
            <option value="skewed">偏態母體</option>
          </select>
          <Slider label="n" value={n} min={3} max={30} onChange={setN} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={knownSigma} onChange={(e) => setKnownSigma(e.target.checked)} />
            已知 σ（用 Z）
          </label>
          <Button onClick={drawOnce}>抽樣一次 → 算 t</Button>
          <Button variant="secondary" onClick={() => setTValues([])}>清除</Button>
        </LabControls>
      }
      visualization={
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl">
          <path d={curve} fill="none" stroke="var(--color-accent-blue)" strokeWidth={2} />
          <text x={PAD} y={24} className="text-[11px] fill-[var(--color-ink-soft)]">藍：t(df={df})</text>
          {hist.map((c, i) => {
            const bw = (W - PAD * 2) / 16
            const h = (c / Math.max(1, ...hist)) * 50
            return <rect key={i} x={PAD + i * bw} y={H - PAD - h} width={bw - 2} height={h} fill="var(--color-accent-red)" opacity={0.6} />
          })}
        </svg>
      }
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="T 分配生成器" definition="σ 未知時用樣本標準差，t 分布尾部比常態厚；n 大時兩者接近。" misconceptions={['誤解：t 與 Z 永遠差很多。n>30 時通常很接近。', '誤解：t 只用在小樣本。關鍵是 σ 是否已知，不是只有樣本大小。']} />
          <LiveValueDisplay label="已累積 t 統計量" value={tValues.length} />
        </div>
      }
    />
  )
}
