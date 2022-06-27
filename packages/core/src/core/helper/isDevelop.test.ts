import { isDevelop } from './isDevelop.impl'

describe('check if env is develop or production', () => {
  const env = process.env

  beforeEach(() => {
    process.env = { ...env }
  })

  afterEach(() => {
    process.env = env
  })

  it('returns true if NODE_ENV is develop', () => {
    process.env.NODE_ENV = 'develop'
    expect(isDevelop()).toBeTruthy()
  })

  it('returns true if NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'
    expect(isDevelop()).toBeTruthy()
  })

  it('returns false if NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production'
    expect(isDevelop()).toBeFalsy()
  })

  it('returns false if NODE_ENV different from develop', () => {
    process.env.NODE_ENV = 'something'
    expect(isDevelop()).toBeFalsy()
  })

  it('returns false if NODE_ENV is not set', () => {
    process.env.NODE_ENV = undefined
    expect(isDevelop()).toBeFalsy()
  })
})
