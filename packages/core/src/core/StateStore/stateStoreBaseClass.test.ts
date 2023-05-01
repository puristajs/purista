import { createSandbox, SinonSandbox } from 'sinon'

import { StatusCode, UnhandledError } from '../../core'
import { getLoggerMock } from '../../mocks'
import { StateStoreBaseClass } from './StateStoreBaseClass.impl'

describe('StateStoreBaseClass', () => {
  let sandbox: SinonSandbox
  let stateStore: StateStoreBaseClass<unknown>
  let logger: ReturnType<typeof getLoggerMock>

  beforeEach(() => {
    sandbox = createSandbox()
    logger = getLoggerMock(sandbox)
    stateStore = new StateStoreBaseClass<unknown>('test', { logger: logger.mock })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getState', () => {
    it('should throw an UnhandledError if enableGet is false', async () => {
      sandbox.stub(stateStore.config, 'enableGet').value(false)

      await expect(stateStore.getState('test')).rejects.toEqual(
        new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })

    it('should throw an UnhandledError if enableGet is true but method is not implemented', async () => {
      sandbox.stub(stateStore.config, 'enableGet').value(true)

      await expect(stateStore.getState('test')).rejects.toEqual(
        new UnhandledError(StatusCode.NotImplemented, 'getState is not implemented in state store'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })
  })

  describe('setState', () => {
    it('should throw an UnhandledError if enableSet is false', async () => {
      sandbox.stub(stateStore.config, 'enableSet').value(false)

      await expect(stateStore.setState('test', 'state_value')).rejects.toEqual(
        new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })

    it('should throw an UnhandledError if enableSet is true but method is not implemented', async () => {
      // Arrange
      sandbox.stub(stateStore.config, 'enableSet').value(true)

      await expect(stateStore.setState('test', 'state_value')).rejects.toEqual(
        new UnhandledError(StatusCode.NotImplemented, 'setState is not implemented in state store'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })
  })

  describe('removeState', () => {
    it('should throw an UnhandledError if enableRemove is false', async () => {
      sandbox.stub(stateStore.config, 'enableRemove').value(false)

      await expect(stateStore.removeState('test')).rejects.toMatchObject(
        new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })

    it('should throw an UnhandledError if enableRemove is true but method is not implemented', async () => {
      sandbox.stub(stateStore.config, 'enableRemove').value(true)

      await expect(stateStore.removeState('test')).rejects.toMatchObject(
        new UnhandledError(StatusCode.NotImplemented, 'removeState is not implemented in state store'),
      )

      sandbox.assert.calledOnce(logger.stubs.error)
    })
  })
})
