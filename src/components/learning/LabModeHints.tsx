'use client'

import { useState } from 'react'
import { useLearningMode } from '@/store/learning-mode'

type LabModeHintsProps = {
  guided: string[]
  challenge: {
    question: string
    target: number
    tolerance?: number
    hint: string
    explain: string
  }
  getCurrentValue: () => number
}

export function LabModeHints({ guided, challenge, getCurrentValue }: LabModeHintsProps) {
  const mode = useLearningMode((s) => s.mode)
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  if (mode === 'explore' || mode === 'simulation') return null

  if (mode === 'guided') {
    const text = guided[Math.min(step, guided.length - 1)]!
    return (
      <div className="rounded-sm border border-accent-blue bg-[var(--color-bg)] p-3 text-sm text-ink-soft">
        <p className="font-mono text-xs text-accent-blue">
          引導 {step + 1}/{guided.length}
        </p>
        <p className="mt-2">{text}</p>
        <button
          type="button"
          className="mt-2 text-xs text-accent-blue underline"
          onClick={() => setStep((s) => Math.min(s + 1, guided.length - 1))}
        >
          下一步
        </button>
      </div>
    )
  }

  const tol = challenge.tolerance ?? 0.05
  const check = () => {
    const v = getCurrentValue()
    if (Math.abs(v - challenge.target) <= tol) {
      setFeedback(`✅ 正確！${challenge.explain}`)
    } else {
      setFeedback(`⛔ ${challenge.hint}`)
    }
  }

  return (
    <div className="rounded-sm border border-accent-yellow bg-[var(--color-bg)] p-3 text-sm">
      <p className="font-mono text-xs text-accent-yellow">挑戰</p>
      <p className="mt-2 text-ink">{challenge.question}</p>
      <button
        type="button"
        onClick={check}
        className="mt-2 rounded-sm bg-accent-blue px-2 py-1 text-xs text-white"
      >
        檢查答案
      </button>
      {feedback ? <p className="mt-2 text-ink-soft">{feedback}</p> : null}
    </div>
  )
}
