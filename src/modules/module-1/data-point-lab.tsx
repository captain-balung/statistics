'use client'

import { mean, median, standardDeviation } from '@lib/statistics/descriptive'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/controls/Button'
import { LabControls } from '@/components/learning/LabControls'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { formatStat } from '@/lib/format'
import { module1Labs } from '../../../content/modules/module-1'

const DOMAIN: [number, number] = [0, 100]
const INITIAL = [20, 35, 50, 62, 78]

const W = 640
const H = 120
const PAD = 32

function xScale(v: number, min: number, max: number) {
  return PAD + ((v - min) / (max - min)) * (W - PAD * 2)
}

function fromX(px: number, min: number, max: number) {
  const t = (px - PAD) / (W - PAD * 2)
  return Math.round(Math.min(max, Math.max(min, min + t * (max - min))))
}

const copy = module1Labs['data-lab']

export function DataPointLab() {
  const [points, setPoints] = useState<number[]>(INITIAL)
  const [selected, setSelected] = useState<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const stats = useMemo(() => {
    const m = mean(points)
    const med = median(points)
    const sd = standardDeviation(points, { sample: true })
    return {
      mean: m.ok ? m.value : null,
      median: med.ok ? med.value : null,
      sd: sd.ok ? sd.value : null,
    }
  }, [points])

  const [dMin, dMax] = useMemo(() => {
    const pad = 8
    const lo = Math.min(...points, DOMAIN[0])
    const hi = Math.max(...points, DOMAIN[1])
    return [Math.max(DOMAIN[0], lo - pad), Math.min(DOMAIN[1], hi + pad)] as const
  }, [points])

  const onPointerDown = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault()
    setSelected(i)
    setDragging(i)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * W
      const v = fromX(px, dMin, dMax)
      setPoints((prev) => prev.map((p, idx) => (idx === dragging ? v : p)))
    },
    [dragging, dMin, dMax],
  )

  const onPointerUp = () => setDragging(null)

  const addAtClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragging !== null) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const v = fromX(px, dMin, dMax)
    setPoints((p) => [...p, v].sort((a, b) => a - b))
  }

  const removeSelected = () => {
    if (selected === null || points.length <= 2) return
    setPoints((p) => p.filter((_, i) => i !== selected))
    setSelected(null)
  }

  const reset = () => {
    setPoints(INITIAL)
    setSelected(null)
  }

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <p className="text-sm text-ink-soft">{copy.summary}</p>
          <Button variant="secondary" onClick={reset}>
            重置資料
          </Button>
          <Button
            variant="danger"
            onClick={removeSelected}
            disabled={selected === null || points.length <= 2}
          >
            刪除選取點
          </Button>
          <p className="text-xs text-ink-mute">
            在數線上點擊可新增資料點；拖曳圓點可改變數值（至少保留 2 點）。
          </p>
        </LabControls>
      }
      visualization={
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto w-full max-w-3xl touch-none select-none"
          onClick={addAtClick}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="img"
          aria-label="可拖曳的資料點數線圖"
        >
          <line
            x1={PAD}
            y1={H / 2}
            x2={W - PAD}
            y2={H / 2}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {stats.mean !== null && (
            <line
              x1={xScale(stats.mean, dMin, dMax)}
              y1={20}
              x2={xScale(stats.mean, dMin, dMax)}
              y2={H - 20}
              stroke="var(--color-accent-blue)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          )}
          {stats.median !== null && stats.median !== stats.mean && (
            <line
              x1={xScale(stats.median, dMin, dMax)}
              y1={24}
              x2={xScale(stats.median, dMin, dMax)}
              y2={H - 24}
              stroke="var(--color-accent-red)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          )}
          {stats.mean !== null && stats.sd !== null && stats.sd > 0 && (
            <rect
              x={xScale(stats.mean - stats.sd, dMin, dMax)}
              y={H / 2 - 28}
              width={
                xScale(stats.mean + stats.sd, dMin, dMax) -
                xScale(stats.mean - stats.sd, dMin, dMax)
              }
              height={56}
              fill="var(--color-sd-band)"
            />
          )}
          {points.map((v, i) => {
            const cx = xScale(v, dMin, dMax)
            const active = i === selected || i === dragging
            return (
              <circle
                key={`${i}-${v}`}
                cx={cx}
                cy={H / 2}
                r={active ? 8 : 5}
                fill="var(--color-accent-blue)"
                stroke="var(--color-bg)"
                strokeWidth={2}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={onPointerDown(i)}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(i)
                }}
              />
            )
          })}
          <text x={PAD} y={H - 8} className="fill-[var(--color-ink-mute)] text-[10px]">
            {formatStat(dMin, 0)}
          </text>
          <text
            x={W - PAD}
            y={H - 8}
            textAnchor="end"
            className="fill-[var(--color-ink-mute)] text-[10px]"
          >
            {formatStat(dMax, 0)}
          </text>
        </svg>
      }
      explanation={
        <div className="space-y-4">
          <ExplanationPanel
            title={copy.title}
            definition={copy.definition}
            misconceptions={[...copy.misconceptions]}
          />
          <div className="grid gap-2">
            <LiveValueDisplay label="平均數 mean" value={stats.mean} hint="藍色虛線" />
            <LiveValueDisplay label="中位數 median" value={stats.median} hint="紅色虛線" />
            <LiveValueDisplay
              label="標準差 SD（樣本）"
              value={stats.sd}
              hint="藍色陰影帶 ≈ ±1 SD"
            />
          </div>
        </div>
      }
    />
  )
}
