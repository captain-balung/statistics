'use client'

import { normalCdf } from '@lib/statistics/distributions'
import { useMemo, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
import { SvgNormalCurve } from '@/components/viz/SvgNormalCurve'
import { formatStat } from '@/lib/format'
import { m4 } from '../../../content/modules/module-4'

const MU = 50
const SIGMA = 10
const copy = m4.area

export function AreaLab() {
  const [from, setFrom] = useState(40)
  const [to, setTo] = useState(60)

  const lo = Math.min(from, to)
  const hi = Math.max(from, to)

  const prob = useMemo(() => {
    const a = normalCdf(lo, MU, SIGMA)
    const b = normalCdf(hi, MU, SIGMA)
    if (!a.ok || !b.ok) return null
    return b.value - a.value
  }, [lo, hi])

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <Slider label="區間左端" value={from} min={20} max={80} onChange={setFrom} />
          <Slider label="區間右端" value={to} min={20} max={80} onChange={setTo} />
        </LabControls>
      }
      visualization={
        <SvgNormalCurve
          curves={[{ mu: MU, sigma: SIGMA, color: 'var(--color-accent-blue)' }]}
          shade={{ from: lo, to: hi, mu: MU, sigma: SIGMA }}
        />
      }
      explanation={
        <div className="space-y-4">
          <ExplanationPanel
            title={copy.title}
            definition={copy.definition}
            misconceptions={[...copy.misconceptions]}
          />
          <LiveValueDisplay
            label="區間機率 P(a < X < b)"
            value={prob === null ? null : prob * 100}
            hint={`${formatStat(lo)} ～ ${formatStat(hi)}（%）`}
          />
        </div>
      }
    />
  )
}
