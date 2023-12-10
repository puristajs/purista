import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

import { getLoggerMock } from '@purista/core'

import { AWSConfigStore } from '../src/AWSConfigStore.impl.js'

describe('AWS Config Manager config store', () => {
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

  const store = new AWSConfigStore({
    enableGet: true,
    enableRemove: true,
    enableSet: true,
    logger: getLoggerMock().mock,
    client: {
      endpoint: 'http://localhost:4567',
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    },
  })

  it('set a config key', async () => {
    await expect(store.setConfig('test', 'my-value')).resolves.toBeUndefined()
  })

  it('gets a config key', async () => {
    await expect(store.getConfig('test')).resolves.toStrictEqual({ test: 'my-value' })
  })

  it('updates a config key', async () => {
    await expect(store.setConfig('test', 'my-value-updated')).resolves.toBeUndefined()
    await expect(store.getConfig('test')).resolves.toStrictEqual({ test: 'my-value-updated' })
  })

  it('removes a config key', async () => {
    await expect(store.getConfig('test')).resolves.toStrictEqual({ test: 'my-value-updated' })
    await expect(store.removeConfig('test')).resolves.toBeUndefined()
    await expect(store.getConfig('test')).resolves.toStrictEqual({ test: undefined })
  })
})
