'use client'

import { createRng, randomNormal } from '@lib/rng'
import { useMemo, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { Button } from '@/components/controls/Button'
import { LabControls } from '@/components/learning/LabControls'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { module1Labs } from '../../../content/modules/module-1'

const W = 640
const H = 200
const PAD = 40
const MU = 50
const N = 80

function normalPdf(x: number, mu: number, sigma: number) {
  if (sigma <= 0) return 0
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

const copy = module1Labs.spread

export function SpreadLab() {
  const [sigmaA, setSigmaA] = useState(6)
  const [sigmaB, setSigmaB] = useState(14)
  const [seed, setSeed] = useState(7)

  const dots = useMemo(() => {
    const rng = createRng(seed)
    const a = Array.from({ length: N / 2 }, () => MU + randomNormal(rng) * sigmaA)
    const b = Array.from({ length: N / 2 }, () => MU + randomNormal(rng) * sigmaB)
    return { a, b }
  }, [sigmaA, sigmaB, seed])

  const curves = useMemo(() => {
    const xs: number[] = []
    for (let x = 10; x <= 90; x += 1) xs.push(x)
    const scaleY = (pdf: number) => H - PAD - pdf * 1200
    const xPos = (x: number) => PAD + ((x - 10) / 80) * (W - PAD * 2)
    const path = (sigma: number) =>
      xs
        .map((x, i) => {
          const px = xPos(x)
          const py = scaleY(normalPdf(x, MU, sigma))
          return `${i === 0 ? 'M' : 'L'} ${px} ${py}`
        })
        .join(' ')
    return { pathA: path(sigmaA), pathB: path(sigmaB), xPos }
  }, [sigmaA, sigmaB])

  const reshuffle = () => setSeed((s) => s + 1)

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <p className="text-sm text-ink-soft">{copy.summary}</p>
          <Slider
            label="分布 A 的標準差 σ"
            value={sigmaA}
            min={2}
            max={20}
            step={0.5}
            onChange={setSigmaA}
          />
          <Slider
            label="分布 B 的標準差 σ"
            value={sigmaB}
            min={2}
            max={20}
            step={0.5}
            onChange={setSigmaB}
          />
          <Button variant="secondary" onClick={reshuffle}>
            重新抽樣點
          </Button>
          <p className="text-xs text-ink-mute">
            兩組資料平均數皆固定為 {MU}；調整 σ 觀察曲線與散點的伸縮。
          </p>
        </LabControls>
      }
      visualization={
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto w-full max-w-3xl"
          role="img"
          aria-label="標準差伸縮與雙分布對照"
        >
          <line
            x1={PAD}
            y1={H - PAD}
            x2={W - PAD}
            y2={H - PAD}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <path
            d={curves.pathA}
            fill="none"
            stroke="var(--color-accent-blue)"
            strokeWidth={2}
          />
          <path
            d={curves.pathB}
            fill="none"
            stroke="var(--color-accent-red)"
            strokeWidth={2}
          />
          {dots.a.map((v, i) => (
            <circle
              key={`a-${i}`}
              cx={curves.xPos(v)}
              cy={H - PAD - 8 - (i % 5) * 3}
              r={3}
              fill="var(--color-accent-blue)"
            />
          ))}
          {dots.b.map((v, i) => (
            <circle
              key={`b-${i}`}
              cx={curves.xPos(v)}
              cy={H - PAD - 28 - (i % 5) * 3}
              r={3}
              fill="var(--color-accent-red)"
            />
          ))}
          <line
            x1={curves.xPos(MU)}
            y1={PAD}
            x2={curves.xPos(MU)}
            y2={H - PAD}
            stroke="var(--color-accent-yellow)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
        </svg>
      }
      explanation={
        <div className="space-y-4">
          <ExplanationPanel
            title={copy.title}
            definition={copy.definition}
            misconceptions={[...copy.misconceptions]}
          />
          <LiveValueDisplay label="共同平均數 μ" value={MU} />
          <LiveValueDisplay label="分布 A：σ" value={sigmaA} hint="藍色曲線與散點" />
          <LiveValueDisplay label="分布 B：σ" value={sigmaB} hint="紅色曲線與散點" />
        </div>
      }
    />
  )
}
