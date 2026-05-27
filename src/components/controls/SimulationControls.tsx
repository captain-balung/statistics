'use client'

import { Button } from './Button'

type SimulationControlsProps = {
  running: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function SimulationControls({
  running,
  onStart,
  onPause,
  onReset,
}: SimulationControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {!running ? (
        <Button onClick={onStart}>開始</Button>
      ) : (
        <Button variant="secondary" onClick={onPause}>
          暫停
        </Button>
      )}
      <Button variant="secondary" onClick={onReset}>
        重置
      </Button>
    </div>
  )
}
