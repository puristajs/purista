import { getLoggerMock } from '@purista/core'

import { GoogleSecretStore } from '../src/GoogleSecretStore.impl'

describe('Google Secret Maneger secret store', () => {
  const store = new GoogleSecretStore({
    project: 'projects/428371962963',
    enableGet: true,
    enableRemove: true,
    enableSet: true,
    logger: getLoggerMock().mock,
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
