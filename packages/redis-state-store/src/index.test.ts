import { puristaVersion, RedisStateStore } from './index.js'

describe('exports redis-state-store', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports RedisStateStore', () => {
    expect(RedisStateStore).toBeDefined()
  })
})
