'use client'

import { normalPdf } from '@lib/statistics/distributions'
import { useMemo } from 'react'

type CurveSpec = { mu: number; sigma: number; color: string; label?: string }

type SvgNormalCurveProps = {
  width?: number
  height?: number
  curves: CurveSpec[]
  shade?: { from: number; to: number; mu: number; sigma: number }
  markerZ?: number
}

export function SvgNormalCurve({
  width = 640,
  height = 200,
  curves,
  shade,
  markerZ,
}: SvgNormalCurveProps) {
  const pad = 40
  const xMin = 10
  const xMax = 90

  const paths = useMemo(() => {
    return curves.map((c) => {
      const pts: string[] = []
      for (let x = xMin; x <= xMax; x += 1) {
        const pdf = normalPdf(x, c.mu, c.sigma)
        const y = pdf.ok ? pdf.value : 0
        const px = pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2)
        const py = height - pad - y * 800
        pts.push(`${pts.length ? 'L' : 'M'} ${px} ${py}`)
      }
      return { d: pts.join(' '), color: c.color, label: c.label }
    })
  }, [curves, width, height])

  const shadePath = useMemo(() => {
    if (!shade) return null
    const { from, to, mu, sigma } = shade
    let d = ''
    const start = Math.max(xMin, from)
    const end = Math.min(xMax, to)
    for (let x = start; x <= end; x += 1) {
      const pdf = normalPdf(x, mu, sigma)
      const px = pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2)
      const py = height - pad - (pdf.ok ? pdf.value : 0) * 800
      d += `${d ? 'L' : 'M'} ${px} ${py} `
    }
    const px0 = pad + ((start - xMin) / (xMax - xMin)) * (width - pad * 2)
    const px1 = pad + ((end - xMin) / (xMax - xMin)) * (width - pad * 2)
    d += `L ${px1} ${height - pad} L ${px0} ${height - pad} Z`
    return d
  }, [shade, width, height])

  const markerX =
    markerZ !== undefined
      ? pad + ((markerZ - xMin) / (xMax - xMin)) * (width - pad * 2)
      : null

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-3xl">
      <line
        x1={pad}
        y1={height - pad}
        x2={width - pad}
        y2={height - pad}
        stroke="var(--color-ink)"
      />
      {shadePath ? (
        <path d={shadePath} fill="var(--color-sd-band)" stroke="none" />
      ) : null}
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={2} />
      ))}
      {markerX !== null ? (
        <line
          x1={markerX}
          y1={pad}
          x2={markerX}
          y2={height - pad}
          stroke="var(--color-accent-yellow)"
          strokeDasharray="6 4"
        />
      ) : null}
    </svg>
  )
}
