'use client'

import { mean } from '@lib/statistics/descriptive'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Button } from '@/components/controls/Button'
import { LabControls } from '@/components/learning/LabControls'
import { Slider } from '@/components/controls/Slider'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { module1Labs } from '../../../content/modules/module-1'

const BEAM_W = 520
const INITIAL = [15, 40, 55, 85]

const copy = module1Labs['balance-beam']

export function BalanceBeamLab() {
  const [points, setPoints] = useState<number[]>(INITIAL)
  const [newValue, setNewValue] = useState(50)

  const m = useMemo(() => mean(points), [points])
  const meanVal = m.ok ? m.value : 50
  const min = 0
  const max = 100

  const toX = (v: number) => ((v - min) / (max - min)) * BEAM_W

  const beamCenter = 50
  const torque = useMemo(
    () => points.reduce((acc, p) => acc + (p - beamCenter), 0),
    [points],
  )
  const tiltDeg = Math.max(-14, Math.min(14, torque * 0.12))

  const addPoint = () => {
    setPoints((p) => [...p, newValue].sort((a, b) => a - b))
  }

  const reset = () => setPoints(INITIAL)

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <p className="text-sm text-ink-soft">{copy.summary}</p>
          <Slider
            label="新增砝碼位置"
            value={newValue}
            min={5}
            max={95}
            step={1}
            onChange={setNewValue}
          />
          <Button onClick={addPoint}>放上砝碼</Button>
          <Button variant="secondary" onClick={reset}>
            重置
          </Button>
        </LabControls>
      }
      visualization={
        <div className="mx-auto w-full max-w-2xl">
          <motion.div
            className="relative mx-auto origin-center"
            style={{ width: BEAM_W, height: 200 }}
            animate={{ rotate: tiltDeg }}
            transition={{ type: 'tween', duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-ink"
              style={{ width: BEAM_W }}
            />
            <div
              className="absolute top-1/2 z-10 h-16 w-0.5 -translate-x-1/2 -translate-y-full bg-accent-blue"
              style={{ left: toX(meanVal) }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-accent-blue">
                平均數
              </span>
            </div>
            {points.map((p, i) => (
              <div
                key={`${i}-${p}`}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-full"
                style={{ left: toX(p) }}
              >
                <div className="mx-auto h-10 w-8 rounded-sm border border-[var(--color-rule)] bg-accent-yellow" />
                <p className="mt-1 text-center font-mono text-xs text-ink">{p}</p>
              </div>
            ))}
          </motion.div>
          <p className="mt-4 text-center font-mono text-sm text-ink-mute">
            槓桿傾斜反映「力矩未平衡」；支點在平均數時才會回正。
          </p>
        </div>
      }
      explanation={
        <div className="space-y-4">
          <ExplanationPanel
            title={copy.title}
            definition={copy.definition}
            misconceptions={[...copy.misconceptions]}
          />
          <LiveValueDisplay
            label="目前平均數（支點）"
            value={m.ok ? m.value : null}
          />
        </div>
      }
    />
  )
}
