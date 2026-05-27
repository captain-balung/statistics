'use client'

import {
  generateCorrelatedPoints,
  linearRegression,
  pearsonR,
  sumSquaredErrors,
} from '@lib/statistics/correlation'
import { createRng } from '@lib/rng'
import { useCallback, useMemo, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
const W = 400
const H = 400
const PAD = 40

function ScatterViz({
  xs,
  ys,
  onDrag,
}: {
  xs: number[]
  ys: number[]
  onDrag?: (i: number, x: number, y: number) => void
}) {
  const toPx = (v: number) => PAD + ((v + 1) / 2) * (W - PAD * 2)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-md touch-none">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--color-ink)" />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--color-ink)" />
      {(() => {
        const reg = linearRegression(xs, ys)
        if (!reg.ok) return null
        const x1 = -0.9
        const x2 = 0.9
        const y1 = reg.value.slope * x1 + reg.value.intercept
        const y2 = reg.value.slope * x2 + reg.value.intercept
        return (
          <line
            x1={toPx(x1)}
            y1={toPx(-y1)}
            x2={toPx(x2)}
            y2={toPx(-y2)}
            stroke="var(--color-accent-red)"
            strokeWidth={2}
          />
        )
      })()}
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={toPx(x)}
          cy={toPx(-ys[i]!)}
          r={onDrag ? 7 : 5}
          fill="var(--color-accent-blue)"
          className={onDrag ? 'cursor-grab' : ''}
          onPointerDown={
            onDrag
              ? (e) => {
                  ;(e.target as Element).setPointerCapture(e.pointerId)
                  const move = (ev: PointerEvent) => {
                    const rect = (e.target as SVGSVGElement).ownerSVGElement?.getBoundingClientRect()
                    if (!rect) return
                    const px = ((ev.clientX - rect.left) / rect.width) * W
                    const py = ((ev.clientY - rect.top) / rect.height) * H
                    const nx = (px - PAD) / (W - PAD * 2) * 2 - 1
                    const ny = -((py - PAD) / (H - PAD * 2) * 2 - 1)
                    onDrag(i, Math.max(-1, Math.min(1, nx)), Math.max(-1, Math.min(1, ny)))
                  }
                  const up = () => {
                    window.removeEventListener('pointermove', move)
                    window.removeEventListener('pointerup', up)
                    window.removeEventListener('pointercancel', up)
                  }
                  window.addEventListener('pointermove', move)
                  window.addEventListener('pointerup', up)
                  window.addEventListener('pointercancel', up)
                }
              : undefined
          }
        />
      ))}
    </svg>
  )
}

export function ScatterGeneratorLab() {
  const [targetR, setTargetR] = useState(0.7)
  const [seed, setSeed] = useState(1)
  const data = useMemo(() => {
    const g = generateCorrelatedPoints(20, targetR, createRng(seed))
    return g.ok ? g.value : { xs: [], ys: [] }
  }, [targetR, seed])

  const stats = useMemo(() => {
    const r = pearsonR(data.xs, data.ys)
    const reg = linearRegression(data.xs, data.ys)
    return { r, reg }
  }, [data])

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <Slider label="目標相關 r" value={targetR} min={-0.95} max={0.95} step={0.05} onChange={setTargetR} />
          <button type="button" className="text-sm text-accent-blue underline" onClick={() => setSeed((s) => s + 1)}>
            重新生成
          </button>
        </LabControls>
      }
      visualization={<ScatterViz xs={data.xs} ys={data.ys} />}
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="散佈圖生成器" definition="調整 r 可觀察散點與回歸線、R² 的同步變化。" misconceptions={['誤解：r=0.5 代表「一半點在線上」。r 描述線性關係強度，不是比例。', '誤解：R² 可以小於 0。對配適的回歸線，R² 介於 0 與 1。']} />
          <LiveValueDisplay label="Pearson r" value={stats.r.ok ? stats.r.value : null} />
          <LiveValueDisplay label="R²" value={stats.reg.ok ? stats.reg.value.r2 : null} />
        </div>
      }
    />
  )
}

export function DragCorrelationLab() {
  const [xs, setXs] = useState([-0.8, -0.2, 0.1, 0.5, 0.9])
  const [ys, setYs] = useState([-0.6, -0.1, 0.2, 0.55, 0.85])
  const r = pearsonR(xs, ys)

  const onDrag = useCallback((i: number, x: number, y: number) => {
    setXs((a) => a.map((v, j) => (j === i ? x : v)))
    setYs((a) => a.map((v, j) => (j === i ? y : v)))
  }, [])

  return (
    <ThreeColumnLayout
      controls={<LabControls><p className="text-sm text-ink-soft">拖曳任一散點，觀察 r 即時更新。</p></LabControls>}
      visualization={<ScatterViz xs={xs} ys={ys} onDrag={onDrag} />}
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="人工製造相關" definition="相關係數對離群點與非線性模式非常敏感。" misconceptions={['誤解：把一點拉遠一定會讓 r 變大。方向取決於與整體趨勢是否一致。', '誤解：r 只跟斜率有關。同樣斜率下，散點愈分散 r 愈小。']} />
          <LiveValueDisplay label="Pearson r" value={r.ok ? r.value : null} />
        </div>
      }
    />
  )
}

export function RegressionErrorLab() {
  const xs = [-0.9, -0.4, 0, 0.35, 0.8]
  const ys = [-0.7, -0.35, 0.05, 0.4, 0.75]
  const reg = linearRegression(xs, ys)
  const sse = reg.ok ? sumSquaredErrors(xs, ys, reg.value.slope, reg.value.intercept) : null

  return (
    <ThreeColumnLayout
      controls={<LabControls><p className="text-sm text-ink-soft">紅色垂線為殘差；SSE 為殘差平方和。</p></LabControls>}
      visualization={
        <div className="relative mx-auto max-w-md">
          <ScatterViz xs={xs} ys={ys} />
        </div>
      }
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="回歸線誤差" definition="最小平方法找使 SSE 最小的直線。" misconceptions={['誤解：垂直距離與水平距離隨便選。簡單線性回歸用垂直殘差（Y 方向）。', '誤解：SSE 越小一定代表模型越好。可能過度配適或忽略非線性。']} />
          <LiveValueDisplay label="SSE" value={sse?.ok ? sse.value : null} />
        </div>
      }
    />
  )
}
