import { MqttBridge } from './MqttEventBridge.js'
import { puristaVersion } from './version.js'

describe('exports version', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})

	it('exports MqttBridge', () => {
		expect(MqttBridge).toBeDefined()
	})
})
