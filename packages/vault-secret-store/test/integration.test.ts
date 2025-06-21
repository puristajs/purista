import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer, Wait } from 'testcontainers'
import { getLoggerMock } from '@purista/core'

import { VaultSecretStore } from '../src/VaultSecretStore.impl.js'

const VAULT_PORT = 8200
const ROOT_TOKEN = 'root'

describe('Vault secret store', () => {
  let container: StartedTestContainer

  beforeAll(async () => {
    container = await new GenericContainer('hashicorp/vault:1.13.3')
      .withEnv('VAULT_DEV_ROOT_TOKEN_ID', ROOT_TOKEN)
      .withCmd(['server', '-dev', `-dev-root-token-id=${ROOT_TOKEN}`, '-dev-listen-address=0.0.0.0:8200'])
      .withExposedPorts({ container: VAULT_PORT, host: VAULT_PORT })
      .withWaitStrategy(Wait.forLogMessage(/Development mode should/))
      .start()
  })

  afterAll(async () => {
    await container?.stop()
  })

  const store = new VaultSecretStore({
    enableGet: true,
    enableRemove: true,
    enableSet: true,
    logger: getLoggerMock().mock,
    config: { endpoint: `http://localhost:${VAULT_PORT}`, token: ROOT_TOKEN }
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
