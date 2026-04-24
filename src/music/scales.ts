import { noteIndexToName, noteNameToIndex, type NoteName } from './notes'

export type ScaleType =
  | 'major'
  | 'natural-minor'
  | 'major-pentatonic'
  | 'minor-pentatonic'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'

export const SCALE_FORMULAS: Record<ScaleType, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  'natural-minor': [0, 2, 3, 5, 7, 8, 10],
  'major-pentatonic': [0, 2, 4, 7, 9],
  'minor-pentatonic': [0, 3, 5, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
}

export function getScaleSemitones(scaleType: ScaleType): readonly number[] {
  return SCALE_FORMULAS[scaleType]
}

export function getScaleNotes(root: NoteName, scaleType: ScaleType): Set<NoteName> {
  const rootIndex = noteNameToIndex(root)
  const semitones = getScaleSemitones(scaleType)

  return new Set(semitones.map((offset) => noteIndexToName(rootIndex + offset)))
}