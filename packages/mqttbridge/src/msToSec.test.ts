import { msToSec } from './msToSec.impl.js'

describe('msToSec', () => {
  it('converts milliseconds to seconds', () => {
    expect(msToSec(2000)).toBe(2)
  })

  it('rounds milliseconds to seconds', () => {
    expect(msToSec(2050)).toBe(2)
  })

  it('returns 0 on 0', () => {
    expect(msToSec(0)).toBe(0)
  })

  it('returns 0 on very small values', () => {
    expect(msToSec(200)).toBe(0)
  })

  it('returns up on very small values', () => {
    expect(msToSec(500)).toBe(1)
  })
})
