import { getScaleNotes, getIntervalName, findPositionsForNotes, type NoteName, type ScaleType } from '../music'
import { Question, TrainingMode } from '../types/ui'

export function generateQuestionForNoteMode(root: NoteName, scaleType: ScaleType): Question {
  const scaleNotes = getScaleNotes(root, scaleType)
  const notesArray = Array.from(scaleNotes)
  const randomNote = notesArray[Math.floor(Math.random() * notesArray.length)]

  const validPositions = findPositionsForNotes([randomNote])

  return {
    type: 'note',
    targetNote: randomNote,
    prompt: `Find all ${randomNote} notes on the fretboard`,
    validPositions,
  }
}

export function generateQuestionForIntervalMode(root: NoteName, scaleType: ScaleType): Question {
  const scaleNotes = getScaleNotes(root, scaleType)
  const notesArray = Array.from(scaleNotes)

  const randomInterval = Math.floor(Math.random() * 12) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

  const intervalLabel = getIntervalName(randomInterval)

  const targetNotes = new Set<NoteName>()
  notesArray.forEach((note) => {
    const rootIndex = (notesArray.indexOf(note) + randomInterval) % notesArray.length
    targetNotes.add(notesArray[rootIndex])
  })

  const validPositions = findPositionsForNotes(targetNotes)

  return {
    type: 'interval',
    root,
    interval: randomInterval,
    prompt: `Find all notes that are a ${intervalLabel} above the notes in ${scaleType}`,
    validPositions,
  }
}

export function generateQuestion(mode: TrainingMode, root: NoteName, scaleType: ScaleType): Question {
  if (mode === 'interval') {
    return generateQuestionForIntervalMode(root, scaleType)
  } else if (mode === 'mixed') {
    const isMixed = Math.random() < 0.5
    return isMixed
      ? generateQuestionForNoteMode(root, scaleType)
      : generateQuestionForIntervalMode(root, scaleType)
  } else {
    return generateQuestionForNoteMode(root, scaleType)
  }
}
