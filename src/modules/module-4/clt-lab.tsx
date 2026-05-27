'use client'

import { cltSampleMeans, type PopulationKind } from '@lib/statistics/sampling'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { SimulationControls } from '@/components/controls/SimulationControls'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
import { useLearningMode } from '@/store/learning-mode'
import { m4 } from '../../../content/modules/module-4'

const copy = m4.clt
const W = 640
const H = 180
const PAD = 32

export function CLTLab() {
  const mode = useLearningMode((s) => s.mode)
  const [pop, setPop] = useState<PopulationKind>('skewed')
  const [n, setN] = useState(5)
  const [running, setRunning] = useState(false)
  const [means, setMeans] = useState<number[]>([])
  const [seed, setSeed] = useState(1)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (mode !== 'simulation') {
      setRunning(false)
      return
    }
    if (!running) {
      if (timer.current) clearInterval(timer.current)
      return
    }
    timer.current = setInterval(() => {
      setMeans((m) => {
        const next = cltSampleMeans(pop, n, 1, seed + m.length + 1)
        if (!next.ok || !next.value.length) return m
        return [...m, next.value[0]!].slice(-80)
      })
    }, 120)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [running, pop, n, seed, mode])

  const bins = useMemo(() => {
    const counts = new Array(16).fill(0)
    for (const v of means) {
      const i = Math.max(0, Math.min(15, Math.floor(((v - 20) / 60) * 16)))
      counts[i]++
    }
    return counts
  }, [means])

  const maxC = Math.max(1, ...bins)

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <label className="block text-sm text-ink-soft">
            母體
            <select
              className="mt-1 w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-bg)] p-2"
              value={pop}
              onChange={(e) => setPop(e.target.value as PopulationKind)}
            >
              <option value="uniform">均勻</option>
              <option value="dice">骰子</option>
              <option value="skewed">偏態</option>
            </select>
          </label>
          <Slider label="樣本數 n" value={n} min={2} max={30} step={1} onChange={setN} />
          {mode === 'simulation' ? (
            <SimulationControls
              running={running}
              onStart={() => setRunning(true)}
              onPause={() => setRunning(false)}
              onReset={() => {
                setRunning(false)
                setMeans([])
                setSeed((s) => s + 1)
              }}
            />
          ) : (
            <button
              type="button"
              className="text-sm text-accent-blue underline"
              onClick={() => {
                const next = cltSampleMeans(pop, n, 5, seed)
                if (next.ok) setMeans((m) => [...m, ...next.value].slice(-80))
              }}
            >
              抽 5 次樣本平均
            </button>
          )}
        </LabControls>
      }
      visualization={
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl">
          <text x={PAD} y={20} className="fill-[var(--color-ink-soft)] text-[11px]">
            樣本平均分布（已累積 {means.length} 次）
          </text>
          {bins.map((c, i) => {
            const bw = (W - PAD * 2) / 16
            const x = PAD + i * bw
            const h = (c / maxC) * (H - 50)
            return (
              <rect
                key={i}
                x={x + 2}
                y={H - PAD - h}
                width={bw - 4}
                height={h}
                fill="var(--color-accent-blue)"
              />
            )
          })}
        </svg>
      }
      explanation={
        <ExplanationPanel
          title={copy.title}
          definition={copy.definition}
          misconceptions={[...copy.misconceptions]}
        />
      }
    />
  )
}
