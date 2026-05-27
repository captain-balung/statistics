'use client'

import { create } from 'zustand'

export type LearningMode = 'explore' | 'guided' | 'challenge' | 'simulation'

type LearningModeState = {
  mode: LearningMode
  setMode: (mode: LearningMode) => void
}

export const useLearningMode = create<LearningModeState>((set) => ({
  mode: 'explore',
  setMode: (mode) => set({ mode }),
}))
