import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import type { ObjectWithKeysFromStringArray } from '../../helper/index.js'
import { getLoggerMock } from '../../mocks/index.js'
import { UnhandledError } from '../Error/index.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { StateStoreBaseClass } from './StateStoreBaseClass.impl.js'

class TestClass extends StateStoreBaseClass {
  protected getStateImpl<StateNames extends string[]>(
    ..._stateNames: StateNames
  ): Promise<ObjectWithKeysFromStringArray<StateNames>> {
    throw new Error('Not implemented')
  }

  protected setStateImpl(_stateName: string, _stateValue: unknown): Promise<void> {
    throw new Error('Not implemented')
  }

  protected removeStateImpl(_stateName: string): Promise<void> {
    throw new Error('Not implemented')
  }
}

describe('StateStoreBaseClass', () => {
  let sandbox: SinonSandbox
  let stateStore: StateStoreBaseClass
  let logger: ReturnType<typeof getLoggerMock>

  beforeEach(() => {
    sandbox = createSandbox()
    logger = getLoggerMock(sandbox)
    stateStore = new TestClass('test', { logger: logger.mock })
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

      await expect(stateStore.getState('test')).rejects.toEqual(new Error('Not implemented'))
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

      await expect(stateStore.setState('test', 'state_value')).rejects.toEqual(new Error('Not implemented'))
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

      await expect(stateStore.removeState('test')).rejects.toMatchObject(new Error('Not implemented'))
    })
  })
})
