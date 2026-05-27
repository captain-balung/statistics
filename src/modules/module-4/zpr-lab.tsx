'use client'

import { useMemo, useState } from 'react'
import { zToPercentileRank, percentileRankToZ } from '@lib/statistics/conversions'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
import { SvgNormalCurve } from '@/components/viz/SvgNormalCurve'
import { m4 } from '../../../content/modules/module-4'

const MU = 50
const SIGMA = 10
const copy = m4.zpr

export function ZprLab() {
  const [mode, setMode] = useState<'z-to-pr' | 'pr-to-z'>('z-to-pr')
  const [z, setZ] = useState(0)
  const [pr, setPr] = useState(50)

  const result = useMemo(() => {
    if (mode === 'z-to-pr') {
      const r = zToPercentileRank(z)
      return { pr: r.ok ? r.value : null, z, x: MU + z * SIGMA }
    }
    const r = percentileRankToZ(pr)
    return { pr, z: r.ok ? r.value : null, x: r.ok ? MU + r.value * SIGMA : MU }
  }, [mode, z, pr])

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-sm px-2 py-1 text-xs ${mode === 'z-to-pr' ? 'bg-accent-blue text-white' : 'border border-[var(--color-rule)]'}`}
              onClick={() => setMode('z-to-pr')}
            >
              Z → PR
            </button>
            <button
              type="button"
              className={`rounded-sm px-2 py-1 text-xs ${mode === 'pr-to-z' ? 'bg-accent-blue text-white' : 'border border-[var(--color-rule)]'}`}
              onClick={() => setMode('pr-to-z')}
            >
              PR → Z
            </button>
          </div>
          {mode === 'z-to-pr' ? (
            <label className="block text-sm">
              Z
              <input
                type="number"
                step={0.1}
                value={z}
                onChange={(e) => setZ(Number(e.target.value))}
                className="mt-1 w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-bg)] p-2 font-mono"
              />
            </label>
          ) : (
            <label className="block text-sm">
              PR (%)
              <input
                type="number"
                min={1}
                max={99}
                value={pr}
                onChange={(e) => setPr(Number(e.target.value))}
                className="mt-1 w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-bg)] p-2 font-mono"
              />
            </label>
          )}
        </LabControls>
      }
      visualization={
        <SvgNormalCurve
          curves={[{ mu: MU, sigma: SIGMA, color: 'var(--color-accent-blue)' }]}
          markerZ={result.x}
        />
      }
      explanation={
        <div className="space-y-4">
          <ExplanationPanel
            title={copy.title}
            definition={copy.definition}
            misconceptions={[...copy.misconceptions]}
          />
          <LiveValueDisplay label="Z" value={result.z} />
          <LiveValueDisplay label="PR (%)" value={result.pr} />
        </div>
      }
    />
  )
}
