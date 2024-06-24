import { GoogleSecretStore, puristaVersion } from './index.js'

describe('exports GoogleSecretStore', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})

	it('exports GoogleSecretStore', () => {
		expect(GoogleSecretStore).toBeDefined()
	})
})
