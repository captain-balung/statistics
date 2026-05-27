'use client'

import { useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
import { SvgNormalCurve } from '@/components/viz/SvgNormalCurve'
import { m4 } from '../../../content/modules/module-4'

const copy = m4.curve

export function NormalCurveLab() {
  const [mu, setMu] = useState(50)
  const [sigma, setSigma] = useState(10)
  const [showSecond, setShowSecond] = useState(false)
  const [mu2, setMu2] = useState(60)
  const [sigma2, setSigma2] = useState(6)

  const curves = [
    { mu, sigma, color: 'var(--color-accent-blue)', label: 'A' },
    ...(showSecond
      ? [{ mu: mu2, sigma: sigma2, color: 'var(--color-accent-red)', label: 'B' }]
      : []),
  ]

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <Slider label="μ" value={mu} min={30} max={70} step={1} onChange={setMu} />
          <Slider label="σ" value={sigma} min={3} max={20} step={0.5} onChange={setSigma} />
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={showSecond}
              onChange={(e) => setShowSecond(e.target.checked)}
            />
            疊加第二條曲線
          </label>
          {showSecond ? (
            <>
              <Slider label="μ₂" value={mu2} min={30} max={70} onChange={setMu2} />
              <Slider label="σ₂" value={sigma2} min={3} max={20} step={0.5} onChange={setSigma2} />
            </>
          ) : null}
        </LabControls>
      }
      visualization={<SvgNormalCurve curves={curves} />}
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
