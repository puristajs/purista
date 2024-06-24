import { HttpEventBridge, puristaVersion } from './index.js'

describe('exports HttpEventBridge', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})
	it('exports HttpEventBridge', () => {
		// http event bridge
		expect(HttpEventBridge).toBeDefined()
	})
})
