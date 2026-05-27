'use client'

import { binomialPmf } from '@lib/statistics/distributions'
import { createRng } from '@lib/rng'
import { useEffect, useMemo, useState } from 'react'
import { Slider } from '@/components/controls/Slider'
import { SimulationControls } from '@/components/controls/SimulationControls'
import { ExplanationPanel } from '@/components/explanation/ExplanationPanel'
import { LiveValueDisplay } from '@/components/explanation/LiveValueDisplay'
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout'
import { LabControls } from '@/components/learning/LabControls'
import { useLearningMode } from '@/store/learning-mode'
import { formatStat } from '@/lib/format'

export function GamblingLab() {
  const [game, setGame] = useState<'dice' | 'roulette' | 'poker' | 'slots'>('dice')
  const [trials, setTrials] = useState(0)
  const [wins, setWins] = useState(0)
  const [bankroll, setBankroll] = useState(0)
  const rng = useMemo(() => createRng(99), [])

  const play = () => {
    setTrials((t) => t + 1)
    let win = false
    if (game === 'dice') win = rng() > 5 / 6
    else if (game === 'roulette') win = rng() < 18 / 37
    else win = rng() < 0.45
    if (win) {
      setWins((w) => w + 1)
      setBankroll((b) => b + 10)
    } else setBankroll((b) => b - 10)
  }

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <select className="w-full rounded-sm border p-2" value={game} onChange={(e) => setGame(e.target.value as typeof game)}>
            <option value="dice">骰子（猜 6）</option>
            <option value="poker">撲克（簡化）</option>
            <option value="roulette">輪盤（紅）</option>
            <option value="slots">老虎機（簡化）</option>
          </select>
          <button type="button" className="rounded-sm bg-accent-blue px-3 py-2 text-sm text-white" onClick={play}>
            玩一局
          </button>
          <button type="button" className="text-xs underline" onClick={() => { setTrials(0); setWins(0); setBankroll(0) }}>
            重置
          </button>
        </LabControls>
      }
      visualization={
        <div className="space-y-4 text-center font-mono">
          <p className="text-3xl text-ink">{game === 'dice' ? '🎲' : game === 'roulette' ? '🎡' : game === 'poker' ? '🃏' : '🎰'}</p>
          <p>累積輸贏：{bankroll >= 0 ? '+' : ''}{bankroll}</p>
          <p className="text-sm text-ink-soft">中獎率 {trials ? formatStat((wins / trials) * 100) : '—'}%</p>
        </div>
      }
      explanation={
        <ExplanationPanel title="賭博模擬" definition="長期期望值 EV 為負時，玩得越久越可能虧損。" misconceptions={['誤解：連輸後「比較容易贏」。獨立試驗沒有記憶。', '誤解：短期贏錢代表策略有效。樣本太小會誤導。']} />
      }
    />
  )
}

export function BinomialLab() {
  const [n, setN] = useState(12)
  const [p, setP] = useState(0.4)

  const bars = useMemo(() => {
    const out: { k: number; prob: number }[] = []
    for (let k = 0; k <= n; k++) {
      const pmf = binomialPmf(k, n, p)
      if (pmf.ok) out.push({ k, prob: pmf.value })
    }
    return out
  }, [n, p])

  const maxP = Math.max(...bars.map((b) => b.prob), 0.01)

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <Slider label="n" value={n} min={4} max={24} step={1} onChange={setN} />
          <Slider label="p" value={p} min={0.05} max={0.95} step={0.05} onChange={setP} />
        </LabControls>
      }
      visualization={
        <svg viewBox="0 0 640 200" className="w-full max-w-3xl">
          {bars.map((b) => {
            const bw = 560 / (n + 1)
            const x = 40 + b.k * bw
            const h = (b.prob / maxP) * 140
            return (
              <rect key={b.k} x={x} y={180 - h} width={bw - 4} height={h} fill="var(--color-accent-blue)" />
            )
          })}
        </svg>
      }
      explanation={
        <ExplanationPanel title="二項式實驗室" definition="n 次獨立試驗、每次成功機率 p，成功 k 次的機率為 C(n,k)p^k(1-p)^(n-k)。" misconceptions={['誤解：最可能的成功次數一定等於 np。np 是期望，最可能次數可能是 floor(np)。', '誤解：p=0.5 時分布一定對稱。對，但 p≠0.5 會偏斜。']} />
      }
    />
  )
}

export function LLNLab() {
  const mode = useLearningMode((s) => s.mode)
  const [running, setRunning] = useState(false)
  const [flips, setFlips] = useState(0)
  const [heads, setHeads] = useState(0)
  const [speed, setSpeed] = useState(5)
  const rng = useMemo(() => createRng(7), [])

  useEffect(() => {
    if (!running || mode !== 'simulation') return
    const ms = 600 - speed * 50
    const id = setInterval(() => {
      setFlips((f) => f + 1)
      if (rng() < 0.5) setHeads((h) => h + 1)
    }, ms)
    return () => clearInterval(id)
  }, [running, speed, mode, rng])

  const ratio = flips ? heads / flips : 0
  const history = useMemo(() => {
    const pts: string[] = []
    let h = 0
    let f = 0
    const r = createRng(8)
    for (let i = 1; i <= Math.min(flips, 80); i++) {
      f++
      if (r() < 0.5) h++
      const x = 40 + (i / 80) * 560
      const y = 180 - (h / f) * 140
      pts.push(`${i === 1 ? 'M' : 'L'} ${x} ${y}`)
    }
    return pts.join(' ')
  }, [flips])

  return (
    <ThreeColumnLayout
      controls={
        <LabControls>
          <Slider label="速度" value={speed} min={1} max={10} onChange={setSpeed} />
          {mode === 'simulation' ? (
            <SimulationControls
              running={running}
              onStart={() => setRunning(true)}
              onPause={() => setRunning(false)}
              onReset={() => { setRunning(false); setFlips(0); setHeads(0) }}
            />
          ) : (
            <button type="button" className="text-sm underline text-accent-blue" onClick={() => { setFlips((f) => f + 1); if (rng() < 0.5) setHeads((h) => h + 1) }}>
              擲一次
            </button>
          )}
        </LabControls>
      }
      visualization={
        <svg viewBox="0 0 640 200" className="w-full max-w-3xl">
          <line x1={40} y1={180} x2={600} y2={180} stroke="var(--color-ink)" />
          <line x1={40} y1={40} x2={40} y2={180} stroke="var(--color-ink)" />
          <path d={history} fill="none" stroke="var(--color-accent-blue)" strokeWidth={2} />
          <line x1={40} y1={180 - 0.5 * 140} x2={600} y2={180 - 0.5 * 140} stroke="var(--color-accent-yellow)" strokeDasharray="6 4" />
        </svg>
      }
      explanation={
        <div className="space-y-3">
          <ExplanationPanel title="大數法則" definition="試驗次數增加時，樣本比例會趨近真實機率 0.5。" misconceptions={['誤解：連續出現正面後反面「比較容易」。每次仍是 50%。', '誤解：前 10 次接近 50% 代表已經穩定。小樣本波動仍可能很大。']} />
          <LiveValueDisplay label="正面比例" value={flips ? ratio * 100 : null} hint="%" />
        </div>
      }
    />
  )
}
