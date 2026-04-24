export type IntervalSemitones =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12

export type IntervalLabel =
  | 'R'
  | 'm2'
  | 'M2'
  | 'm3'
  | 'M3'
  | 'P4'
  | 'TT'
  | 'P5'
  | 'm6'
  | 'M6'
  | 'm7'
  | 'M7'
  | '8'

export const INTERVAL_LABELS: Record<IntervalSemitones, IntervalLabel> = {
  0: 'R',
  1: 'm2',
  2: 'M2',
  3: 'm3',
  4: 'M3',
  5: 'P4',
  6: 'TT',
  7: 'P5',
  8: 'm6',
  9: 'M6',
  10: 'm7',
  11: 'M7',
  12: '8',
}

export function getIntervalName(semitones: number): IntervalLabel {
  if (!Number.isInteger(semitones) || semitones < 0 || semitones > 12) {
    throw new RangeError('Interval semitones must be an integer from 0 to 12.')
  }

  return INTERVAL_LABELS[semitones as IntervalSemitones]
}