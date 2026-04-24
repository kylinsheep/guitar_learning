import { createContext, useContext, useReducer, ReactNode } from 'react'
import { trainerReducer, INITIAL_STATE, TrainerState, TrainerAction } from './reducer'

interface TrainerContextType {
  state: TrainerState
  dispatch: (action: TrainerAction) => void
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined)

export interface TrainerProviderProps {
  children: ReactNode
}

export function TrainerProvider({ children }: TrainerProviderProps) {
  const [state, dispatch] = useReducer(trainerReducer, INITIAL_STATE)

  return <TrainerContext.Provider value={{ state, dispatch }}>{children}</TrainerContext.Provider>
}

export function useTrainer(): TrainerContextType {
  const context = useContext(TrainerContext)
  if (!context) {
    throw new Error('useTrainer must be used within a TrainerProvider')
  }
  return context
}
