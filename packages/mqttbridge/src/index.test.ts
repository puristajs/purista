import * as index from './index'
import { puristaVersion } from './version'

describe('exports version', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports MqttBridge', () => {
    expect(index.MqttBridge).toBeDefined()
  })
})
