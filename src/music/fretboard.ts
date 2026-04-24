import { noteIndexToName, noteNameToIndex, type NoteName } from './notes'

export const STANDARD_TUNING: readonly NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E']
export const MAX_FRET = 24

export type Position = { string: number; fret: number }

function assertStringIndex(stringIndex: number): void {
  if (
    !Number.isInteger(stringIndex) ||
    stringIndex < 0 ||
    stringIndex >= STANDARD_TUNING.length
  ) {
    throw new RangeError(`String index must be an integer from 0 to ${STANDARD_TUNING.length - 1}.`)
  }
}

function assertFretInRange(fret: number, maxFret: number): void {
  if (!Number.isInteger(fret) || fret < 0 || fret > maxFret) {
    throw new RangeError(`Fret must be an integer from 0 to ${maxFret}.`)
  }
}

export function getNoteAt(stringIndex: number, fret: number): NoteName {
  assertStringIndex(stringIndex)
  assertFretInRange(fret, MAX_FRET)

  const openStringIndex = noteNameToIndex(STANDARD_TUNING[stringIndex])
  return noteIndexToName(openStringIndex + fret)
}

export function buildFretboardMap(maxFret = MAX_FRET): NoteName[][] {
  assertFretInRange(maxFret, 10_000)

  return STANDARD_TUNING.map((_, stringIndex) => {
    return Array.from({ length: maxFret + 1 }, (_, fret) => getNoteAt(stringIndex, fret))
  })
}

export function findPositionsForNotes(
  targetNotes: Iterable<NoteName>,
  maxFret = MAX_FRET,
): Position[] {
  assertFretInRange(maxFret, 10_000)
  const targetSet = new Set(targetNotes)
  const board = buildFretboardMap(maxFret)
  const positions: Position[] = []

  board.forEach((stringNotes, stringIndex) => {
    stringNotes.forEach((note, fret) => {
      if (targetSet.has(note)) {
        positions.push({ string: stringIndex, fret })
      }
    })
  })

  return positions
}

export const DEFAULT_FRETBOARD_MAP = buildFretboardMap()