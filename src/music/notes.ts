export const CHROMATIC_NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

export type NoteName = (typeof CHROMATIC_NOTES)[number]

const NOTE_TO_INDEX: Record<NoteName, number> = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
}

export function normalizeNoteIndex(index: number): number {
  return ((index % 12) + 12) % 12
}

export function noteNameToIndex(note: NoteName): number {
  return NOTE_TO_INDEX[note]
}

export function noteIndexToName(index: number): NoteName {
  return CHROMATIC_NOTES[normalizeNoteIndex(index)]
}