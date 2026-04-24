import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { trainerReducer, INITIAL_STATE, TrainerState, TrainerAction } from './reducer'
import { loadSettings, loadBestStreak, saveSettings, saveBestStreak, saveSessionSummary } from '../storage'

interface TrainerContextType {
  state: TrainerState
  dispatch: (action: TrainerAction) => void
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined)

export interface TrainerProviderProps {
  children: ReactNode
}

function buildInitialState(): TrainerState {
  const savedSettings = loadSettings()
  const savedBestStreak = loadBestStreak()

  return {
    ...INITIAL_STATE,
    config: savedSettings ?? INITIAL_STATE.config,
    stats: {
      ...INITIAL_STATE.stats,
      bestStreak: savedBestStreak,
    },
  }
}

export function TrainerProvider({ children }: TrainerProviderProps) {
  const [state, dispatch] = useReducer(trainerReducer, undefined, buildInitialState)

  // Persist config whenever it changes
  useEffect(() => {
    saveSettings(state.config)
  }, [state.config])

  // Persist best streak whenever it improves
  useEffect(() => {
    if (state.stats.bestStreak > 0) {
      saveBestStreak(state.stats.bestStreak)
    }
  }, [state.stats.bestStreak])

  // Save session summary when training ends (feedback shown = question answered)
  // We save on RESET so the completed session is captured before clearing
  const wrappedDispatch = (action: TrainerAction) => {
    if (action.type === 'RESET' && state.isTraining && state.stats.attempts > 0) {
      saveSessionSummary(state.stats, state.config)
    }
    dispatch(action)
  }

  return <TrainerContext.Provider value={{ state, dispatch: wrappedDispatch }}>{children}</TrainerContext.Provider>
}

export function useTrainer(): TrainerContextType {
  const context = useContext(TrainerContext)
  if (!context) {
    throw new Error('useTrainer must be used within a TrainerProvider')
  }
  return context
}
