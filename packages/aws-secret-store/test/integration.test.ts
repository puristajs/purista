import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

import { getLoggerMock } from '@purista/core'

import { AWSSecretStore } from '../src/AWSSecretStore.impl'

describe('AWS Secret Maneger secret store', () => {
  beforeAll(async () => {
    execSync(`cd ${resolve(__dirname, '../')} && npm run env:up`)

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 5000)
    })
  })

  afterAll(async () => {
    execSync(`cd ${resolve(__dirname, '../')} && npm run env:down`)
  })

  const store = new AWSSecretStore({
    enableGet: true,
    enableRemove: true,
    enableSet: true,
    logger: getLoggerMock().mock,
    client: {
      endpoint: 'http://localhost:4566',
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    },
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
