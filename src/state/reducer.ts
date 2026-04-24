import { TrainerConfig, Question, SessionStats, Position } from '../types/ui'
import { generateQuestion } from '../quiz'

export interface SubmissionFeedback {
  isCorrect: boolean
  correctSelected: Set<string>
  incorrectSelected: Set<string>
  missedAnswers: Set<string>
}

export interface TrainerState {
  config: TrainerConfig
  question: Question | undefined | null
  feedback: SubmissionFeedback | null
  stats: SessionStats
  isTraining: boolean
  selectedPositions: Set<string>
  interactionState: 'idle' | 'answering' | 'submitted'
  clickedPositions: Set<string>
  questionStartedAt: number
}

export type TrainerAction =
  | { type: 'CONFIG_CHANGE'; payload: Partial<TrainerConfig> }
  | { type: 'START_TRAINING' }
  | { type: 'GENERATE_QUESTION' }
  | { type: 'SELECT_POSITION'; payload: Position }
  | { type: 'SUBMIT_ANSWER' }
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
  selectedPositions: new Set(),
  interactionState: 'idle',
  clickedPositions: new Set(),
  questionStartedAt: 0,
}

export function trainerReducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case 'CONFIG_CHANGE': {
      if (state.interactionState === 'answering' || state.interactionState === 'submitted') {
        const newQuestion = generateQuestion(
          action.payload.mode || state.config.mode,
          action.payload.root || state.config.root,
          action.payload.scaleType || state.config.scaleType
        )
        return {
          ...state,
          config: { ...state.config, ...action.payload },
          question: newQuestion,
          feedback: null,
          selectedPositions: new Set(),
          interactionState: 'answering',
          questionStartedAt: Date.now(),
        }
      }
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      }
    }

    case 'START_TRAINING':
      return {
        ...state,
        isTraining: true,
        interactionState: 'idle',
        stats: {
          attempts: 0,
          correct: 0,
          accuracy: 0,
          streak: 0,
          bestStreak: 0,
          avgResponseMs: 0,
          startedAt: Date.now(),
        },
        selectedPositions: new Set(),
        clickedPositions: new Set(),
      }

    case 'GENERATE_QUESTION': {
      const newQuestion = generateQuestion(state.config.mode, state.config.root, state.config.scaleType)
      return {
        ...state,
        question: newQuestion,
        feedback: null,
        selectedPositions: new Set(),
        interactionState: 'answering',
        clickedPositions: new Set(),
        questionStartedAt: Date.now(),
      }
    }

    case 'SELECT_POSITION': {
      if (state.interactionState !== 'answering' || !state.question) return state
      const key = `${action.payload.string},${action.payload.fret}`
      const newSelected = new Set(state.selectedPositions)
      if (newSelected.has(key)) {
        newSelected.delete(key)
      } else {
        newSelected.add(key)
      }
      return { ...state, selectedPositions: newSelected }
    }

    case 'SUBMIT_ANSWER': {
      if (state.interactionState !== 'answering' || !state.question) return state
      const correctSet = new Set(
        state.question.validPositions.map((p) => `${p.string},${p.fret}`)
      )
      const correctSelected = new Set(
        Array.from(state.selectedPositions).filter((pos) => correctSet.has(pos))
      )
      const incorrectSelected = new Set(
        Array.from(state.selectedPositions).filter((pos) => !correctSet.has(pos))
      )
      const missedAnswers = new Set(
        Array.from(correctSet).filter((pos) => !state.selectedPositions.has(pos))
      )
      const isCorrect =
        state.selectedPositions.size === correctSet.size &&
        Array.from(state.selectedPositions).every((pos) => correctSet.has(pos))
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
      const responseMs = state.questionStartedAt > 0 ? Date.now() - state.questionStartedAt : 0
      if (responseMs > 0) {
        newStats.avgResponseMs =
          (newStats.avgResponseMs * (newStats.attempts - 1) + responseMs) / newStats.attempts
      }
      return {
        ...state,
        feedback: { isCorrect, correctSelected, incorrectSelected, missedAnswers },
        stats: newStats,
        interactionState: 'submitted',
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
      const responseMs = state.questionStartedAt > 0 ? Date.now() - state.questionStartedAt : 0
      if (responseMs > 0) {
        newStats.avgResponseMs =
          (newStats.avgResponseMs * (newStats.attempts - 1) + responseMs) / newStats.attempts
      }
      return {
        ...state,
        feedback: { isCorrect, correctSelected: new Set([clickedKey]), incorrectSelected: isCorrect ? new Set() : new Set([clickedKey]), missedAnswers: new Set() },
        stats: newStats,
        clickedPositions: newClickedPositions,
      }
    }

    case 'NEXT_QUESTION': {
      if (state.interactionState !== 'submitted') return state
      const newQuestion = generateQuestion(state.config.mode, state.config.root, state.config.scaleType)
      return {
        ...state,
        question: newQuestion,
        feedback: null,
        selectedPositions: new Set(),
        interactionState: 'answering',
        clickedPositions: new Set(),
        questionStartedAt: Date.now(),
      }
    }

    case 'RESET':
      return { ...INITIAL_STATE, config: state.config }

    default:
      return state
  }
}
