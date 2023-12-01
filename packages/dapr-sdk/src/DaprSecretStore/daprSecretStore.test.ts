import { HttpClient, UnhandledError } from '@purista/core'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { DAPR_API_VERSION } from '../types'
import { DaprSecretStore } from './DaprSecretStore.impl'

describe('DaprSecretStore', () => {
  let sandbox: SinonSandbox

  const config = {
    storeName: 'mySecretStore',
    enableGet: true,
    secretStoreName: 'test',
    clientConfig: {
      daprHost: 'localhost',
      daprPort: '5000',
      daprApiToken: 'myToken',
      daprApiVersion: DAPR_API_VERSION,
    },
  }

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
    sandbox.reset()
  })

  describe('getSecret', () => {
    it('should fetch secrets from the Dapr secret store', async () => {
      const secretName1 = 'mySecret1'
      const secretName2 = 'mySecret2'
      const secretValue1 = 'mySecretValue1'
      const secretValue2 = 'mySecretValue2'
      const httpClientGetStub = sandbox.stub(HttpClient.prototype, 'get')
      httpClientGetStub.onFirstCall().resolves({ [secretName1]: secretValue1 })
      httpClientGetStub.onSecondCall().resolves({ [secretName2]: secretValue2 })

      const secretStore = new DaprSecretStore(config)
      const result = await secretStore.getSecret(secretName1, secretName2)

      expect(result).toEqual({
        [secretName1]: secretValue1,
        [secretName2]: secretValue2,
      })
      expect(httpClientGetStub.callCount).toBe(2)
    })

    it('should throw an error if get secret is disabled by config', async () => {
      const disabledConfig = {
        storeName: 'mySecretStore',
        enableGet: false,
        config: {
          secretStoreName: 'test',
          clientConfig: {
            daprHost: 'localhost',
            daprPort: '5000',
            daprApiToken: 'myToken',
            daprApiVersion: DAPR_API_VERSION,
          },
        },
      }
      const disabledSecretStore = new DaprSecretStore(disabledConfig)

      await expect(disabledSecretStore.getSecret('mySecret')).rejects.toThrow(
        'get secret from store is disabled by config',
      )
    })
  })

  describe('setSecret', () => {
    it('should throw an UnhandledError with StatusCode.NotImplemented', async () => {
      const secretName = 'test-secret'

      const secretStore = new DaprSecretStore({
        ...config,
        enableGet: true,
        enableSet: true,
        enableRemove: true,
      })

      try {
        await secretStore.setSecret(secretName)
      } catch (err) {
        expect(err).toBeInstanceOf(UnhandledError)
        expect((err as UnhandledError).errorCode).toBe(501)
        expect((err as UnhandledError).message).toBe('setting or changing of secrets is not available')
      }
    })

    it('should throw an UnhandledError with StatusCode.Unauthorized if enableSet is false', async () => {
      const secretName = 'test-secret'
      const secretStore = new DaprSecretStore({
        ...config,
        enableGet: true,
        enableSet: false,
        enableRemove: true,
      })

      try {
        await secretStore.setSecret(secretName)
      } catch (err) {
        expect(err).toBeInstanceOf(UnhandledError)
        expect((err as UnhandledError).errorCode).toBe(401)
        expect((err as UnhandledError).message).toBe('set secret at store is disabled by config')
      }
    })
  })

  describe('removeSecret', () => {
    it('should throw an UnhandledError with StatusCode.NotImplemented', async () => {
      const secretName = 'test-secret'

      const secretStore = new DaprSecretStore({
        ...config,
        enableGet: true,
        enableSet: true,
        enableRemove: true,
      })

      try {
        await secretStore.removeSecret(secretName)
      } catch (err) {
        expect(err).toBeInstanceOf(UnhandledError)
        expect((err as UnhandledError).errorCode).toBe(501)
        expect((err as UnhandledError).message).toBe('removing of secrets is not available')
      }
    })

    it('should throw an UnhandledError with StatusCode.Unauthorized if enableSet is false', async () => {
      const secretName = 'test-secret'
      const secretStore = new DaprSecretStore({
        ...config,
        enableGet: false,
        enableSet: false,
        enableRemove: false,
      })

      try {
        await secretStore.removeSecret(secretName)
      } catch (err) {
        expect(err).toBeInstanceOf(UnhandledError)
        expect((err as UnhandledError).errorCode).toBe(401)
        expect((err as UnhandledError).message).toBe('remove secret from store is disabled by config')
      }
    })
  })
})
