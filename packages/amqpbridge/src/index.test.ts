import { AmqpBridge, puristaVersion } from './index.js'

describe('exports Version', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports AmqpBridge', () => {
    expect(AmqpBridge).toBeDefined()
  })
})
