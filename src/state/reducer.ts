import { TrainerConfig, Question, SessionStats, Position } from '../types/ui'
import { generateQuestion } from '../quiz'

export interface TrainerState {
  config: TrainerConfig
  question: Question | undefined
  feedback: 'correct' | 'incorrect' | null
  stats: SessionStats
  isTraining: boolean
  clickedPositions: Set<string>
  questionStartedAt: number
}

export type TrainerAction =
  | { type: 'CONFIG_CHANGE'; payload: Partial<TrainerConfig> }
  | { type: 'START_TRAINING' }
  | { type: 'GENERATE_QUESTION' }
  | { type: 'HANDLE_CLICK'; payload: Position }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET' }

export const INITIAL_STATE: TrainerState = {
  config: {
    root: 'C',
    scaleType: 'major',
    mode: 'note',
  },
  question: undefined,
  feedback: null,
  stats: {
    attempts: 0,
    correct: 0,
    accuracy: 0,
    streak: 0,
    bestStreak: 0,
    avgResponseMs: 0,
    startedAt: Date.now(),
  },
  isTraining: false,
  clickedPositions: new Set(),
  questionStartedAt: 0,
}

export function trainerReducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case 'CONFIG_CHANGE':
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      }

    case 'START_TRAINING':
      return {
        ...state,
        isTraining: true,
        stats: {
          attempts: 0,
          correct: 0,
          accuracy: 0,
          streak: 0,
          bestStreak: 0,
          avgResponseMs: 0,
          startedAt: Date.now(),
        },
        clickedPositions: new Set(),
      }

    case 'GENERATE_QUESTION': {
      const newQuestion = generateQuestion(state.config.mode, state.config.root, state.config.scaleType)
      return {
        ...state,
        question: newQuestion,
        feedback: null,
        clickedPositions: new Set(),
        questionStartedAt: Date.now(),
      }
    }

    case 'HANDLE_CLICK': {
      if (!state.question || state.feedback) return state

      const clickedKey = `${action.payload.string},${action.payload.fret}`
      const validPositionKeys = new Set(
        state.question.validPositions.map((p) => `${p.string},${p.fret}`)
      )

      const isCorrect = validPositionKeys.has(clickedKey)

      const newClickedPositions = new Set(state.clickedPositions)
      newClickedPositions.add(clickedKey)

      const newStats = { ...state.stats }
      newStats.attempts += 1

      if (isCorrect) {
        newStats.correct += 1
        newStats.streak += 1
        if (newStats.streak > newStats.bestStreak) {
          newStats.bestStreak = newStats.streak
        }
      } else {
        newStats.streak = 0
      }

      newStats.accuracy = (newStats.correct / newStats.attempts) * 100

      // Update average response time using incremental mean formula
      const responseMs = state.questionStartedAt > 0 ? Date.now() - state.questionStartedAt : 0
      if (responseMs > 0) {
        newStats.avgResponseMs =
          (newStats.avgResponseMs * (newStats.attempts - 1) + responseMs) / newStats.attempts
      }

      return {
        ...state,
        feedback: isCorrect ? 'correct' : 'incorrect',
        stats: newStats,
        clickedPositions: newClickedPositions,
      }
    }

    case 'NEXT_QUESTION': {
      const newQuestion = generateQuestion(state.config.mode, state.config.root, state.config.scaleType)
      return {
        ...state,
        question: newQuestion,
        feedback: null,
        clickedPositions: new Set(),
        questionStartedAt: Date.now(),
      }
    }

    case 'RESET':
      return {
        ...INITIAL_STATE,
        config: state.config,
      }

    default:
      return state
  }
}
