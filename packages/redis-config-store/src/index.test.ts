import { puristaVersion, RedisConfigStore } from './index.js'

describe('exports redis-config-store', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports RedisConfigStore', () => {
    expect(RedisConfigStore).toBeDefined()
  })
})
