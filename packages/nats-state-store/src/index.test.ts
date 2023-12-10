import { NatsStateStore, puristaVersion } from './index.js'

describe('exports redis-state-store', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports NatsStateStore', () => {
    expect(NatsStateStore).toBeDefined()
  })
})
