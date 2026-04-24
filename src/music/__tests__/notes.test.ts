import {
  CHROMATIC_NOTES,
  noteIndexToName,
  noteNameToIndex,
  normalizeNoteIndex,
} from '../notes'

describe('notes', () => {
  it('contains 12 chromatic notes in sharp-only representation', () => {
    expect(CHROMATIC_NOTES).toEqual([
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
    ])
  })

  it('maps note names to note indices', () => {
    expect(noteNameToIndex('C')).toBe(0)
    expect(noteNameToIndex('F#')).toBe(6)
    expect(noteNameToIndex('B')).toBe(11)
  })

  it('normalizes negative and overflowing note indices', () => {
    expect(normalizeNoteIndex(-1)).toBe(11)
    expect(normalizeNoteIndex(12)).toBe(0)
    expect(normalizeNoteIndex(25)).toBe(1)
  })

  it('maps note indices to note names with wrapping', () => {
    expect(noteIndexToName(0)).toBe('C')
    expect(noteIndexToName(13)).toBe('C#')
    expect(noteIndexToName(-1)).toBe('B')
  })
})