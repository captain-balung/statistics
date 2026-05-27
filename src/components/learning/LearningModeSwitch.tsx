'use client'

import { useLearningMode, type LearningMode } from '@/store/learning-mode'

const MODES: { id: LearningMode; label: string }[] = [
  { id: 'explore', label: '探索' },
  { id: 'guided', label: '引導' },
  { id: 'challenge', label: '挑戰' },
  { id: 'simulation', label: '模擬' },
]

export function LearningModeSwitch() {
  const mode = useLearningMode((s) => s.mode)
  const setMode = useLearningMode((s) => s.setMode)

  return (
    <div className="flex flex-wrap gap-1" role="tablist" aria-label="學習模式">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={mode === m.id}
          onClick={() => setMode(m.id)}
          className={`rounded-sm px-2 py-1 font-mono text-xs ${
            mode === m.id
              ? 'bg-accent-blue text-white'
              : 'bg-[var(--color-bg)] text-ink-soft hover:text-ink'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
