import * as index from './index'
import { puristaVersion } from './version'

describe('exports state-store-redis', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports RedisStateStore', () => {
    expect(index.RedisStateStore).toBeDefined()
  })
})
