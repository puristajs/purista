import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from './index.js'

describe('public exports', () => {
	it('exports the DaprConfigStore', () => {
		expect(DaprConfigStore).toBeDefined()
	})

	it('exports the DaprEventBridge', () => {
		expect(DaprEventBridge).toBeDefined()
	})

	it('exports the DaprSecretStore', () => {
		expect(DaprSecretStore).toBeDefined()
	})

	it('exports the DaprStateStore', () => {
		expect(DaprStateStore).toBeDefined()
	})
})
