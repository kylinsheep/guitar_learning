import { Question, Position } from '../types/ui'

export interface ValidationResult {
  isCorrect: boolean
  allCorrectFound: boolean
  remainingTargets: Position[]
}

export function validateAnswer(question: Question, clickedPosition: Position): ValidationResult {
  const positionKey = `${clickedPosition.string},${clickedPosition.fret}`
  const validPositionKeys = new Set(
    question.validPositions.map((p) => `${p.string},${p.fret}`)
  )

  const isCorrect = validPositionKeys.has(positionKey)

  const clickedPositionKeys = new Set<string>()
  clickedPositionKeys.add(positionKey)

  const remainingTargets = question.validPositions.filter(
    (pos) => !clickedPositionKeys.has(`${pos.string},${pos.fret}`)
  )

  return {
    isCorrect,
    allCorrectFound: false,
    remainingTargets,
  }
}
