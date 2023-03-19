import { createSandbox } from 'sinon'

import { getLoggerMock } from '../../testhelper'
import { DefaultStateStore } from './DefaultStateStore.impl'

describe('DefaultStateStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('can start and stop and throws on getter and setter', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultStateStore({ logger: logger.mock })

    await expect(store.getState('example')).rejects.toThrow('getState is not implemented in state store')

    await expect(store.removeState('example')).rejects.toThrow('removeState is not implemented in state store')

    await expect(store.setState('example', 'value')).rejects.toThrow('setState is not implemented in state store')
  })
})
