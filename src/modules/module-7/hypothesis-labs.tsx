'use client'

import {
  oneSampleTTest,
  oneSampleZTest,
  pairedTTest,
  twoSampleTTest,
} from '@lib/statistics/inference'
import { useMemo, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
import { standardNormalCdf } from '@lib/statistics/distributions'

export function HypothesisIntroLab() {
  const [z, setZ] = useState(2)
  const tail = useMemo(() => {
    const p = standardNormalCdf(-Math.abs(z))
    return p.ok ? 2 * p.value : null
  }, [z])

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <Slider label="|Z| 臨界" value={z} min={0.5} max={3} step={0.1} onChange={setZ} />
        </LabControls>
      }
      visualization={
        <svg viewBox="0 0 640 200" className="w-full max-w-3xl">
          <path d="M40 160 Q320 20 600 160 L600 180 L40 180 Z" fill="var(--color-sd-band)" />
          <rect x={40 + ((z + 3) / 6) * 560} y={40} width={600 - (40 + ((z + 3) / 6) * 560)} height={140} fill="rgba(214,40,40,0.2)" />
          <text x={48} y={32} className="text-xs fill-[var(--color-accent-blue)]">H₀ 區（藍）</text>
          <text x={480} y={32} className="text-xs fill-[var(--color-accent-red)]">H₁ 拒絕區（紅）</text>
        </svg>
      }
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="假設檢定總覽" definition="H₀ 是預設；p-value 越小越有證據拒絕 H₀。" misconceptions={['誤解：p-value 是 H₀ 為真的機率。它是「在 H₀ 下看到這麼極端結果」的機率。', '誤解：沒拒絕 H₀ 就證明 H₀ 為真。只是證據不足。']} />
          <LiveValueDisplay label="雙尾 p-value（示意）" value={tail === null ? null : tail} />
        </div>
      }
    />
  )
}

export function SignTestLab() {
  const [before, setBefore] = useState('12,14,11,15,10')
  const [after, setAfter] = useState('13,16,12,14,11')
  const pairs = useMemo(() => {
    const b = before.split(',').map(Number)
    const a = after.split(',').map(Number)
    if (b.length !== a.length) return null
    return b.map((v, i) => ({ diff: a[i]! - v, sign: Math.sign(a[i]! - v) }))
  }, [before, after])

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <label className="block text-sm">前測（逗號分隔）<input className="mt-1 w-full border p-2 font-mono" value={before} onChange={(e) => setBefore(e.target.value)} /></label>
          <label className="block text-sm">後測<input className="mt-1 w-full border p-2 font-mono" value={after} onChange={(e) => setAfter(e.target.value)} /></label>
        </LabControls>
      }
      visualization={
        <div className="flex flex-wrap justify-center gap-4">
          {pairs?.map((p, i) => (
            <div key={i} className="text-center font-mono">
              <span className="text-2xl">{p.sign > 0 ? '↑' : p.sign < 0 ? '↓' : '＝'}</span>
              <p className="text-xs text-ink-mute">{p.diff > 0 ? '+' : ''}{p.diff}</p>
            </div>
          ))}
        </div>
      }
      explanation={
        <ExplanationPanel title="符號檢定" definition="只看差異正負號，不要求常態。" misconceptions={['誤解：符號檢定永遠比 t 檢定好。它較穩健但檢定力較低。', '誤解：全部↑就代表顯著。仍要計算符號檢定的 p-value。']} />
      }
    />
  )
}

export function ZTestLab() {
  const sample = useMemo(() => [52, 48, 51, 49, 53, 50, 47, 54], [])
  const test = oneSampleZTest(sample, 50, 5)

  return (
    <ThreeColumnLayout
      controls={<LabControls><p className="text-sm text-ink-soft">固定樣本反覆抽樣示意（簡化版）。</p></LabControls>}
      visualization={
        <svg viewBox="0 0 640 180" className="w-full max-w-3xl">
          <line x1={40} y1={140} x2={600} y2={140} stroke="var(--color-ink)" />
          <circle cx={320} cy={80} r={6} fill="var(--color-accent-yellow)" />
          <text x={330} y={84} className="text-xs">樣本平均</text>
          {test.ok && (
            <text x={40} y={30} className="font-mono text-sm fill-[var(--color-accent-blue)]">
              Z = {test.value.statistic.toFixed(2)}
            </text>
          )}
        </svg>
      }
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="Z 檢定" definition="σ 已知時，標準化樣本平均得到 Z。" misconceptions={['誤解：Z 檢定只用在 n>30。關鍵是 σ 已知，不是樣本大小。', '誤解：Z 落在拒絕區就代表 H₁ 為真。只是統計上拒絕 H₀。']} />
          <LiveValueDisplay label="p-value" value={test.ok ? test.value.pValue : null} />
        </div>
      }
    />
  )
}

export function OneSampleTLab() {
  const sample = [48, 52, 55, 49, 51, 53]
  const test = oneSampleTTest(sample, 50)
  return (
    <ThreeColumnLayout
      controls={<LabControls><p className="text-sm">單一樣本 t 檢定：H₀: μ=50</p></LabControls>}
      visualization={<p className="text-center font-mono text-ink">母體 μ₀ · 樣本 x̄ · t 分布同屏（簡化示意）</p>}
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="單一樣本 T 檢定" definition="σ 未知，用樣本 SD 取代。" misconceptions={['誤解：t 檢定與 Z 檢定公式完全一樣。分母標準誤算法不同。', '誤解：df 永遠等於 n。單一樣本 df=n-1。']} />
          <LiveValueDisplay label="t" value={test.ok ? test.value.statistic : null} />
          <LiveValueDisplay label="p-value" value={test.ok ? test.value.pValue : null} />
        </div>
      }
    />
  )
}

export function TwoSampleTLab() {
  const a = [52, 54, 51, 55]
  const b = [48, 47, 49, 46]
  const test = twoSampleTTest(a, b, true)
  return (
    <ThreeColumnLayout
      controls={<LabControls><p className="text-sm">兩組獨立樣本平均差</p></LabControls>}
      visualization={
        <div className="flex justify-center gap-12">
          <div className="h-24 w-24 rounded-sm bg-[var(--color-sd-band)]" />
          <div className="h-16 w-24 rounded-sm bg-[rgba(214,40,40,0.15)]" />
        </div>
      }
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="獨立樣本 T 檢定" definition="比較兩組平均是否不同。" misconceptions={['誤解：兩組 box 不重疊就一定顯著。仍要看變異與樣本數。', '誤解：一定用 pooled t。變異不相等時應 Welch。']} />
          <LiveValueDisplay label="t" value={test.ok ? test.value.statistic : null} />
        </div>
      }
    />
  )
}

export function PairedTLab() {
  const before = [10, 12, 11, 14]
  const after = [12, 15, 13, 16]
  const test = pairedTTest(before, after)
  return (
    <ThreeColumnLayout
      controls={<LabControls><p className="text-sm">成對前後測</p></LabControls>}
      visualization={
        <svg viewBox="0 0 200 120" className="mx-auto">
          {before.map((b, i) => (
            <g key={i}>
              <circle cx={40 + i * 40} cy={80} r={4} fill="var(--color-accent-blue)" />
              <circle cx={40 + i * 40} cy={40} r={4} fill="var(--color-accent-red)" />
              <line x1={40 + i * 40} y1={80} x2={40 + i * 40} y2={40} stroke="var(--color-ink)" strokeDasharray="4 2" />
            </g>
          ))}
        </svg>
      }
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="成對樣本 T 檢定" definition="分析差值而非原始兩組分數。" misconceptions={['誤解：成對資料可以當獨立樣本 t。會浪費配對資訊。', '誤解：差值為 0 就無法檢定。仍可檢定平均差是否為 0。']} />
          <LiveValueDisplay label="p-value" value={test.ok ? test.value.pValue : null} />
        </div>
      }
    />
  )
}
