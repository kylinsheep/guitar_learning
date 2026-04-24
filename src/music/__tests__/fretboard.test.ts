import {
  buildFretboardMap,
  findPositionsForNotes,
  getNoteAt,
  MAX_FRET,
  STANDARD_TUNING,
} from '../fretboard'

describe('fretboard', () => {
  it('matches standard tuning open string notes', () => {
    const openNotes = STANDARD_TUNING.map((_, stringIndex) => getNoteAt(stringIndex, 0))
    expect(openNotes).toEqual(['E', 'A', 'D', 'G', 'B', 'E'])
  })

  it('resolves note at known positions', () => {
    expect(getNoteAt(0, 12)).toBe('E')
    expect(getNoteAt(1, 3)).toBe('C')
    expect(getNoteAt(5, 5)).toBe('A')
  })

  it('builds 6 strings x 25 frets map by default', () => {
    const board = buildFretboardMap()
    expect(board).toHaveLength(6)
    expect(board[0]).toHaveLength(MAX_FRET + 1)
  })

  it('finds all matching positions for target notes', () => {
    const positions = findPositionsForNotes(['C'], 3)
    expect(positions).toEqual([
      { string: 1, fret: 3 },
      { string: 4, fret: 1 },
    ])
  })

  it('throws for invalid string or fret ranges', () => {
    expect(() => getNoteAt(-1, 0)).toThrow(RangeError)
    expect(() => getNoteAt(0, 25)).toThrow(RangeError)
    expect(() => buildFretboardMap(-1)).toThrow(RangeError)
  })
})