import { createSandbox } from 'sinon'

import { getLoggerMock } from '../mocks'
import { DefaultStateStore } from './DefaultStateStore.impl'

describe('DefaultStateStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('it throws if operation is disabled', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultStateStore({
      logger: logger.mock,
      enableGet: false,
      enableRemove: false,
      enableSet: false,
    })

    await expect(store.getSecret('example')).rejects.toThrow('get state from store is disabled by config')

    await expect(store.removeSecret('example')).rejects.toThrow('remove state from store is disabled by config')

    await expect(store.setSecret('example', 'value')).rejects.toThrow('set state at store is disabled by config')

    expect(
      logger.stubs.warn.calledWith(
        'Using the DefaultStateStore is not secure! It should only be used for test or development purpose.',
      ),
    )
  })

  it('it handles configs', async () => {
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

    await expect(store.getSecret('initialValue', 'unknownState')).resolves.toEqual({
      initialValue: 'initial',
      unknownState: undefined,
    })

    await expect(store.setSecret('initialValue', 'other_value')).resolves.toBeUndefined()

    await expect(store.getSecret('initialValue')).resolves.toEqual({
      initialValue: 'other_value',
    })

    await expect(store.removeSecret('initialValue')).resolves.toBeUndefined()

    await expect(store.getSecret('initialValue')).resolves.toEqual({
      initialValue: undefined,
    })
  })
})
