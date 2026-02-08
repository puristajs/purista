import { puristaVersion, VaultSecretStore } from './index.js'

describe('exports VaultSecretStore', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})

	it('exports VaultSecretStore', () => {
		expect(VaultSecretStore).toBeDefined()
	})
})
