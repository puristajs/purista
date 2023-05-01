import * as index from './index'
import { puristaVersion } from './version'

describe('exports AmqpBridge', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports AmqpBridge', () => {
    expect(index.AmqpBridge).toBeDefined()
  })
})
