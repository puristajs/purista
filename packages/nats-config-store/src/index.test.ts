import { NatsConfigStore, puristaVersion } from './index.js'

describe('exports redis-state-store', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports NatsConfigStore', () => {
    expect(NatsConfigStore).toBeDefined()
  })
})
