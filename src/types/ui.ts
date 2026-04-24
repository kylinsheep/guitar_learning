import type { NoteName, ScaleType } from '../music'

export type { NoteName, ScaleType }

export type TrainingMode = 'note' | 'interval' | 'mixed'

export interface TrainerConfig {
  root: NoteName
  scaleType: ScaleType
  mode: TrainingMode
}

export interface Position {
  string: number
  fret: number
}

export interface Question {
  type: 'note' | 'interval'
  targetNote?: NoteName
  root?: NoteName
  interval?: number
  prompt: string
  validPositions: Position[]
}

export interface SessionStats {
  attempts: number
  correct: number
  accuracy: number
  streak: number
  bestStreak: number
  avgResponseMs: number
  startedAt: number
}
