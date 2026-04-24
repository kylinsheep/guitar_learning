import { getScaleNotes, getScaleSemitones } from '../scales'

describe('scales', () => {
  it('returns expected major formula', () => {
    expect(getScaleSemitones('major')).toEqual([0, 2, 4, 5, 7, 9, 11])
  })

  it('builds C major notes', () => {
    const notes = [...getScaleNotes('C', 'major')]
    expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
  })

  it('builds A natural minor notes', () => {
    const notes = [...getScaleNotes('A', 'natural-minor')]
    expect(notes).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
  })

  it('builds E minor pentatonic notes', () => {
    const notes = [...getScaleNotes('E', 'minor-pentatonic')]
    expect(notes).toEqual(['E', 'G', 'A', 'B', 'D'])
  })
})