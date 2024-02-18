import { randomUUID } from 'node:crypto'

import { getLoggerMock } from '@purista/core'

import { GoogleSecretStore } from '../src/GoogleSecretStore.impl.js'

describe.skip('Google Secret Manager secret store', () => {
  const secretName = randomUUID()

  const store = new GoogleSecretStore({
    project: 'projects/428371962963',
    enableGet: true,
    enableRemove: true,
    enableSet: true,
    logger: getLoggerMock().mock,
  })

  it('set a secret key', async () => {
    await expect(store.setSecret(secretName, 'my-value')).resolves.toBeUndefined()
  })

  it('gets a secret key', async () => {
    await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: 'my-value' })
  })

  it('updates a secret key', async () => {
    await expect(store.setSecret(secretName, 'my-value-updated')).resolves.toBeUndefined()
    await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: 'my-value-updated' })
  })

  it('removes a secret key', async () => {
    await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: 'my-value-updated' })
    await expect(store.removeSecret(secretName)).resolves.toBeUndefined()
    await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: undefined })
  })
})
