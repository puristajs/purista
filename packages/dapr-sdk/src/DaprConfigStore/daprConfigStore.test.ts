import { HttpClient } from '@purista/core'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { DaprConfigStore } from './DaprConfigStore.impl'
import type { DaprConfigStoreConfig } from './types'

describe('DaprConfigStore', () => {
  let sandbox: SinonSandbox

  const config: DaprConfigStoreConfig = {
    configStoreName: 'test',
    clientConfig: {
      daprApiVersion: 'v1.0-alpha1',
      daprHost: 'localhost',
      daprPort: '5000',
      daprApiToken: 'token',
    },
  }

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getConfig', () => {
    it('should throw an error if enableGet is false', async () => {
      const daprConfigStore = new DaprConfigStore({
        ...config,
        enableGet: false,
      })
      await expect(daprConfigStore.getConfig('foo')).rejects.toThrow()
    })

    it('should return a key-value pair for each configName requested', async () => {
      const httpClientGetStub = sandbox.stub(HttpClient.prototype, 'get')
      httpClientGetStub.onFirstCall().resolves([{ key: 'foo', value: 'foo' }])
      httpClientGetStub.onSecondCall().resolves([{ key: 'bar', value: 'bar' }])

      const daprConfigStore = new DaprConfigStore({
        ...config,
        enableGet: true,
      })

      const result = await daprConfigStore.getConfig('foo', 'bar')
      expect(result).toEqual({ foo: 'foo', bar: 'bar' })
      expect(httpClientGetStub.callCount).toBe(2)
    })
  })

  describe('setConfig', () => {
    it('should throw an error if enableSet is false', async () => {
      const daprConfigStore = new DaprConfigStore({
        ...config,
        enableSet: false,
      })
      await expect(daprConfigStore.setConfig('foo', 'bar')).rejects.toThrow()
    })

    it('should throw an error as setting configs is not available', async () => {
      const daprConfigStore = new DaprConfigStore({
        ...config,
        enableSet: true,
      })
      await expect(daprConfigStore.setConfig('foo', 'bar')).rejects.toThrow()
    })
  })

  describe('removeConfig', () => {
    it('should throw an error if enableRemove is false', async () => {
      const daprConfigStore = new DaprConfigStore({
        ...config,
        enableRemove: false,
      })
      await expect(daprConfigStore.removeConfig('foo')).rejects.toThrow()
    })

    it('should throw an error as removing configs is not available', async () => {
      const daprConfigStore = new DaprConfigStore({
        ...config,
        enableRemove: true,
      })
      await expect(daprConfigStore.removeConfig('foo')).rejects.toThrow()
    })
  })
})
