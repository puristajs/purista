import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

import { getLoggerMock } from '@purista/core'

import { InfisicalSecretStore } from '../src/InfisicalSecretStore.impl.js'
/*
read and write:
st.647467a4fd775a75b3f6dd67.9a0a41e44f1847dd83f5710179011997.4a5b4c1e8e4380aca242ca20915762b1

readonly:
st.64746e08fd775a75b3f6e6db.82cd9d993fa4e5981a8132bdadea6adc.0c902c3ca70cb49d99660537d30c0cdc
*/

describe('Infisical secret store', () => {
  const baseUrl = 'http://localhost:8080/'

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

  const store = new InfisicalSecretStore({
    bearerToken: 'st.64f099f22d1513b001b732b6.61aa81633200b752868d9ca701ce1a61.0dd80b7bf98043da184dc719233d476d',
    baseUrl,
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
