'use client'

import type { ReactNode } from 'react'
import { LearningModeSwitch } from './LearningModeSwitch'
import { useLearningMode } from '@/store/learning-mode'

export function LabControls({ children }: { children: ReactNode }) {
  const mode = useLearningMode((s) => s.mode)
  return (
    <div className="space-y-4">
      <LearningModeSwitch />
      <p className="font-mono text-xs uppercase text-ink-mute">{mode} 模式</p>
      {children}
    </div>
  )
}
