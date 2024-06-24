import { AWSSecretStore, puristaVersion } from './index.js'

describe('exports AWSSecretStore', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})

	it('exports AWSSecretStore', () => {
		expect(AWSSecretStore).toBeDefined()
	})
})
