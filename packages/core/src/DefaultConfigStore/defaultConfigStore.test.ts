import { createSandbox } from 'sinon'

import { getLoggerMock } from '../mocks'
import { DefaultConfigStore } from './DefaultConfigStore.impl'

describe('DefaultConfigStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('it throws if operation is disabled', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultConfigStore({
      logger: logger.mock,
      enableGet: false,
      enableRemove: false,
      enableSet: false,
    })

    await expect(store.getConfig('example')).rejects.toThrow('get config from store is disabled by config')

    await expect(store.removeConfig('example')).rejects.toThrow('remove config from store is disabled by config')

    await expect(store.setConfig('example', 'value')).rejects.toThrow('set config at store is disabled by config')

    expect(
      logger.stubs.warn.calledWith(
        'Using the DefaultConfigStore is not secure! It should only be used for test or development purpose.',
      ),
    )
  })

  it('it handles configs', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultConfigStore({
      logger: logger.mock,
      enableGet: true,
      enableRemove: true,
      enableSet: true,
      config: {
        initialConfig: 'initial',
      },
    })

    await expect(store.getConfig('initialConfig', 'unknownConfig')).resolves.toEqual({
      initialConfig: 'initial',
      unknownConfig: undefined,
    })

    await expect(store.setConfig('initialConfig', 'other_value')).resolves.toBeUndefined()

    await expect(store.getConfig('initialConfig')).resolves.toEqual({
      initialConfig: 'other_value',
    })

    await expect(store.removeConfig('initialConfig')).resolves.toBeUndefined()

    await expect(store.getConfig('initialConfig')).resolves.toEqual({
      initialConfig: undefined,
    })
  })
})
