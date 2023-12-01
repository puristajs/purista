import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { StatusCode, UnhandledError } from '../../core'
import { getLoggerMock } from '../../mocks'
import { ConfigStoreBaseClass } from './ConfigStoreBaseClass.impl'

describe('ConfigStoreBaseClass', () => {
  let sandbox: SinonSandbox
  let configStore: ConfigStoreBaseClass
  let logger: ReturnType<typeof getLoggerMock>

  beforeEach(() => {
    sandbox = createSandbox()
    logger = getLoggerMock(sandbox)
    configStore = new ConfigStoreBaseClass('test', { logger: logger.mock })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getConfig', () => {
    it('should throw an UnhandledError if enableGet is false', async () => {
      sandbox.stub(configStore.config, 'enableGet').value(false)

      await expect(configStore.getConfig('test')).rejects.toEqual(
        new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })

    it('should throw an UnhandledError if enableGet is true but method is not implemented', async () => {
      sandbox.stub(configStore.config, 'enableGet').value(true)

      await expect(configStore.getConfig('test')).rejects.toEqual(
        new UnhandledError(StatusCode.NotImplemented, 'get config is not implemented in config store'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })
  })

  describe('setConfig', () => {
    it('should throw an UnhandledError if enableSet is false', async () => {
      sandbox.stub(configStore.config, 'enableSet').value(false)

      await expect(configStore.setConfig('test', {})).rejects.toEqual(
        new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })

    it('should throw an UnhandledError if enableSet is true but method is not implemented', async () => {
      // Arrange
      sandbox.stub(configStore.config, 'enableSet').value(true)

      await expect(configStore.setConfig('test', {})).rejects.toEqual(
        new UnhandledError(StatusCode.NotImplemented, 'set config is not implemented in config store'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })
  })

  describe('removeConfig', () => {
    it('should throw an UnhandledError if enableRemove is false', async () => {
      sandbox.stub(configStore.config, 'enableRemove').value(false)

      await expect(configStore.removeConfig('test')).rejects.toMatchObject(
        new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })

    it('should throw an UnhandledError if enableRemove is true but method is not implemented', async () => {
      sandbox.stub(configStore.config, 'enableRemove').value(true)

      await expect(configStore.removeConfig('test')).rejects.toMatchObject(
        new UnhandledError(StatusCode.NotImplemented, 'remove config is not implemented in config store'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })
  })
})
