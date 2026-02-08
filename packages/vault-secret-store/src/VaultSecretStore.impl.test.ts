import { VaultSecretStore } from './VaultSecretStore.impl.js'

describe('VaultSecretStore mount normalization', () => {
	it('trims leading and trailing slashes from mount path', () => {
		const store = new VaultSecretStore({
			endpoint: 'http://localhost:8200',
			token: 'root',
			mount: '///kv//',
		})

		expect(store.config.mount).toBe('kv')
	})

	it('falls back to default mount if configured mount only contains slashes', () => {
		const store = new VaultSecretStore({
			endpoint: 'http://localhost:8200',
			token: 'root',
			mount: '////',
		})

		expect(store.config.mount).toBe('secret')
	})
})
