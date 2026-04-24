import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveSettings,
  loadSettings,
  saveBestStreak,
  loadBestStreak,
  saveSessionSummary,
  loadSessionSummaries,
  clearAllStorage,
} from '../storage'
import { TrainerConfig, SessionStats } from '../../types/ui'

const mockConfig: TrainerConfig = { root: 'G', scaleType: 'natural-minor', mode: 'interval' }

const mockStats: SessionStats = {
  attempts: 10,
  correct: 8,
  accuracy: 80,
  streak: 3,
  bestStreak: 5,
  avgResponseMs: 1200,
  startedAt: Date.now(),
}

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

beforeEach(() => {
  localStorageMock.clear()
})

describe('settings persistence', () => {
  it('saves and loads config correctly', () => {
    saveSettings(mockConfig)
    const loaded = loadSettings()
    expect(loaded).toEqual(mockConfig)
  })

  it('returns null when nothing is saved', () => {
    expect(loadSettings()).toBeNull()
  })
})

describe('best streak persistence', () => {
  it('saves and loads best streak', () => {
    saveBestStreak(7)
    expect(loadBestStreak()).toBe(7)
  })

  it('only saves if new value is higher', () => {
    saveBestStreak(10)
    saveBestStreak(5)
    expect(loadBestStreak()).toBe(10)
  })

  it('returns 0 when nothing is saved', () => {
    expect(loadBestStreak()).toBe(0)
  })
})

describe('session summaries persistence', () => {
  it('saves a session summary', () => {
    saveSessionSummary(mockStats, mockConfig)
    const summaries = loadSessionSummaries()
    expect(summaries).toHaveLength(1)
    expect(summaries[0].accuracy).toBe(80)
    expect(summaries[0].config.root).toBe('G')
  })

  it('skips saving when attempts is 0', () => {
    const emptyStats = { ...mockStats, attempts: 0 }
    saveSessionSummary(emptyStats, mockConfig)
    expect(loadSessionSummaries()).toHaveLength(0)
  })

  it('prepends new sessions (most recent first)', () => {
    saveSessionSummary({ ...mockStats, attempts: 5, correct: 5 }, mockConfig)
    saveSessionSummary({ ...mockStats, attempts: 10, correct: 8 }, mockConfig)
    const summaries = loadSessionSummaries()
    expect(summaries[0].attempts).toBe(10)
    expect(summaries[1].attempts).toBe(5)
  })

  it('caps summaries at 20 entries', () => {
    for (let i = 0; i < 25; i++) {
      saveSessionSummary({ ...mockStats, attempts: i + 1 }, mockConfig)
    }
    expect(loadSessionSummaries()).toHaveLength(20)
  })
})

describe('clearAllStorage', () => {
  it('removes all stored data', () => {
    saveSettings(mockConfig)
    saveBestStreak(10)
    saveSessionSummary(mockStats, mockConfig)
    clearAllStorage()
    expect(loadSettings()).toBeNull()
    expect(loadBestStreak()).toBe(0)
    expect(loadSessionSummaries()).toHaveLength(0)
  })
})
