import { getLoggerMock } from '@purista/core/adapter'
import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer, Wait } from 'testcontainers'

import { VaultSecretStore } from '../src/VaultSecretStore.impl.js'

const VAULT_PORT = 8200
const ROOT_TOKEN = 'root'
const VAULT_IMAGE = 'hashicorp/vault:1.15'

describe('Vault secret store', () => {
	let container: StartedTestContainer
	let store: VaultSecretStore

	beforeAll(async () => {
		container = await new GenericContainer(VAULT_IMAGE)
			.withEnvironment({
				VAULT_DEV_ROOT_TOKEN_ID: ROOT_TOKEN,
			})
			.withCommand(['server', '-dev', `-dev-root-token-id=${ROOT_TOKEN}`, '-dev-listen-address=0.0.0.0:8200'])
			.withExposedPorts(VAULT_PORT)
			.withWaitStrategy(Wait.forLogMessage(/Development mode should/))
			.start()

		store = new VaultSecretStore({
			endpoint: `http://localhost:${container.getMappedPort(VAULT_PORT)}`,
			enableGet: true,
			enableRemove: true,
			enableSet: true,
			logger: getLoggerMock().mock,
			token: ROOT_TOKEN,
		})
	})

	afterAll(async () => {
		await container?.stop()
	})

	it('set a secret key', async () => {
		await expect(store.setSecret('test', 'my-value')).resolves.toBeUndefined()
	})

	it('gets a secret key', async () => {
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: 'my-value' })
	})

	it('updates a secret key', async () => {
		await expect(store.setSecret('test', 'my-value-updated')).resolves.toBeUndefined()
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: 'my-value-updated' })
	})

	it('removes a secret key', async () => {
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: 'my-value-updated' })
		await expect(store.removeSecret('test')).resolves.toBeUndefined()
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: undefined })
	})
})
