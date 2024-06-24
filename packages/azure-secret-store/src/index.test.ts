import { AzureSecretStore, puristaVersion } from './index.js'

describe('exports AzureSecretStore', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})

	it('exports AzureSecretStore', () => {
		expect(AzureSecretStore).toBeDefined()
	})
})
