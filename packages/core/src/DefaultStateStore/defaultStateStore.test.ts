import { createSandbox } from 'sinon'

import { getLoggerMock } from '../mocks/index.js'
import { DefaultStateStore } from './DefaultStateStore.impl.js'

describe('DefaultStateStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('throws if operation is disabled', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultStateStore({
      logger: logger.mock,
      enableGet: false,
      enableRemove: false,
      enableSet: false,
    })

    await expect(store.getState('example')).rejects.toThrow('get state from store is disabled by config')

    await expect(store.removeState('example')).rejects.toThrow('remove state from store is disabled by config')

    await expect(store.setState('example', 'value')).rejects.toThrow('set state at store is disabled by config')

    expect(
      logger.stubs.warn.calledWith(
        'Using the DefaultStateStore is not secure! It should only be used for test or development purpose.',
      ),
    ).toBeTruthy()
  })

  it('handles configs', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultStateStore({
      logger: logger.mock,
      enableGet: true,
      enableRemove: true,
      enableSet: true,
      config: {
        initialValue: 'initial',
      },
    })

    await expect(store.getState('initialValue', 'unknownState')).resolves.toEqual({
      initialValue: 'initial',
      unknownState: undefined,
    })

    await expect(store.setState('initialValue', 'other_value')).resolves.toBeUndefined()

    await expect(store.getState('initialValue')).resolves.toEqual({
      initialValue: 'other_value',
    })

    await expect(store.removeState('initialValue')).resolves.toBeUndefined()

    await expect(store.getState('initialValue')).resolves.toEqual({
      initialValue: undefined,
    })
  })
})
