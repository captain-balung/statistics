'use client'

import { cltSampleMeans, type PopulationKind } from '@lib/statistics/sampling'
import { useEffect, useMemo, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { SimulationControls } from '@/components/controls/SimulationControls'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
import { useLearningMode } from '@/store/learning-mode'

const W = 640
const H = 200
const PAD = 32

export function SamplingLab() {
  const mode = useLearningMode((s) => s.mode)
  const [pop, setPop] = useState<PopulationKind>('bimodal')
  const [n, setN] = useState(10)
  const [count, setCount] = useState(0)
  const [seed, setSeed] = useState(42)
  const [running, setRunning] = useState(false)

  const means = useMemo(() => {
    const r = cltSampleMeans(pop, n, count, seed)
    return r.ok ? r.value : []
  }, [pop, n, count, seed])

  useEffect(() => {
    if (!running || mode !== 'simulation') return
    const id = setInterval(() => setCount((c) => Math.min(c + 1, 120)), 80)
    return () => clearInterval(id)
  }, [running, mode])

  const popBins = useMemo(() => {
    const b = Array(12).fill(0)
    for (let i = 0; i < 200; i++) {
      const v = pop === 'dice' ? 1 + (i % 6) : 20 + ((i * 7) % 60)
      const idx = Math.min(11, Math.floor(((v - 10) / 70) * 12))
      b[idx]++
    }
    return b
  }, [pop])

  const meanBins = useMemo(() => {
    const b = Array(16).fill(0)
    for (const v of means) {
      const idx = Math.min(15, Math.floor(((v - 20) / 60) * 16))
      b[idx]++
    }
    return b
  }, [means])

  const drawBars = (bins: number[], y0: number, color: string) => {
    const max = Math.max(1, ...bins)
    const bw = (W - PAD * 2) / bins.length
    return bins.map((c, i) => {
      const h = (c / max) * 60
      return (
        <rect
          key={i}
          x={PAD + i * bw + 1}
          y={y0 - h}
          width={bw - 2}
          height={h}
          fill={color}
        />
      )
    })
  }

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <label className="block text-sm text-ink-soft">
            母體
            <select
              className="mt-1 w-full rounded-sm border p-2"
              value={pop}
              onChange={(e) => {
                setPop(e.target.value as PopulationKind)
                setCount(0)
              }}
            >
              <option value="normal">常態</option>
              <option value="uniform">均勻</option>
              <option value="skewed">偏態</option>
              <option value="bimodal">雙峰</option>
            </select>
          </label>
          <Slider label="樣本數 n" value={n} min={2} max={40} onChange={(v) => { setN(v); setCount(0) }} />
          {mode === 'simulation' ? (
            <SimulationControls
              running={running}
              onStart={() => setRunning(true)}
              onPause={() => setRunning(false)}
              onReset={() => { setRunning(false); setCount(0); setSeed((s) => s + 1) }}
            />
          ) : (
            <button type="button" className="text-sm text-accent-blue underline" onClick={() => setCount((c) => c + 10)}>
              再抽 10 次平均
            </button>
          )}
        </LabControls>
      }
      visualization={
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl">
          <text x={PAD} y={24} className="text-[11px] fill-[var(--color-ink-soft)]">母體（示意）</text>
          {drawBars(popBins, 70, 'var(--color-accent-red)')}
          <text x={PAD} y={120} className="text-[11px] fill-[var(--color-ink-soft)]">樣本平均的抽樣分布</text>
          {drawBars(meanBins, H - 20, 'var(--color-accent-blue)')}
        </svg>
      }
      explanation={
        <ExplanationPanel
          title="抽樣分布模擬器"
          definition="重複從母體抽樣並計算樣本平均，這些平均數自己的分布稱為抽樣分布。n 越大，抽樣分布越窄。"
          misconceptions={[
            '誤解：抽樣分布是母體長相的複製品。它描述的是「平均數」會落在哪裡。',
            '誤解：n 變大只會讓估計比較準，不會改變分布形狀。在 CLT 下會趨近常態且變窄。',
          ]}
        />
      }
    />
  )
}
