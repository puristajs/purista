import { MqttBridge, puristaVersion } from './index.js'

describe('exports version', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports MqttBridge', () => {
    expect(MqttBridge).toBeDefined()
  })
})
