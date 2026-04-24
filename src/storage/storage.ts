import { TrainerConfig, SessionStats } from '../types/ui'

const STORAGE_VERSION = 1
const KEYS = {
  settings: 'guitar_trainer_settings_v1',
  bestStreak: 'guitar_trainer_best_streak_v1',
  sessionSummaries: 'guitar_trainer_sessions_v1',
} as const

export interface SessionSummary {
  date: number
  attempts: number
  correct: number
  accuracy: number
  bestStreak: number
  avgResponseMs: number
  config: Pick<TrainerConfig, 'root' | 'scaleType' | 'mode'>
}

// Settings persistence
export function saveSettings(config: TrainerConfig): void {
  try {
    localStorage.setItem(KEYS.settings, JSON.stringify({ version: STORAGE_VERSION, config }))
  } catch {
    // Silently ignore if localStorage is unavailable (e.g., private browsing quota)
  }
}

export function loadSettings(): TrainerConfig | null {
  try {
    const raw = localStorage.getItem(KEYS.settings)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.version !== STORAGE_VERSION) return null
    return parsed.config as TrainerConfig
  } catch {
    return null
  }
}

// Best streak persistence
export function saveBestStreak(bestStreak: number): void {
  try {
    const current = loadBestStreak()
    if (bestStreak > current) {
      localStorage.setItem(KEYS.bestStreak, String(bestStreak))
    }
  } catch {
    // Silently ignore
  }
}

export function loadBestStreak(): number {
  try {
    const raw = localStorage.getItem(KEYS.bestStreak)
    if (!raw) return 0
    const parsed = parseInt(raw, 10)
    return isNaN(parsed) ? 0 : parsed
  } catch {
    return 0
  }
}

// Session summaries (rolling last 20)
const MAX_SESSIONS = 20

export function saveSessionSummary(stats: SessionStats, config: TrainerConfig): void {
  if (stats.attempts === 0) return
  try {
    const existing = loadSessionSummaries()
    const summary: SessionSummary = {
      date: Date.now(),
      attempts: stats.attempts,
      correct: stats.correct,
      accuracy: stats.accuracy,
      bestStreak: stats.bestStreak,
      avgResponseMs: stats.avgResponseMs,
      config: { root: config.root, scaleType: config.scaleType, mode: config.mode },
    }
    const updated = [summary, ...existing].slice(0, MAX_SESSIONS)
    localStorage.setItem(KEYS.sessionSummaries, JSON.stringify(updated))
  } catch {
    // Silently ignore
  }
}

export function loadSessionSummaries(): SessionSummary[] {
  try {
    const raw = localStorage.getItem(KEYS.sessionSummaries)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SessionSummary[]) : []
  } catch {
    return []
  }
}

export function clearAllStorage(): void {
  try {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  } catch {
    // Silently ignore
  }
}
