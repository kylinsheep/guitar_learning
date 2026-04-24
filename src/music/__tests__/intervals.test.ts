import { getIntervalName } from '../intervals'

describe('intervals', () => {
  it('maps semitones 0-12 to labels', () => {
    expect(getIntervalName(0)).toBe('R')
    expect(getIntervalName(3)).toBe('m3')
    expect(getIntervalName(6)).toBe('TT')
    expect(getIntervalName(12)).toBe('8')
  })

  it('throws for out-of-range semitone values', () => {
    expect(() => getIntervalName(-1)).toThrow(RangeError)
    expect(() => getIntervalName(13)).toThrow(RangeError)
    expect(() => getIntervalName(1.5)).toThrow(RangeError)
  })
})