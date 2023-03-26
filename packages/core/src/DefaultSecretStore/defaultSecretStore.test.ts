import { createSandbox } from 'sinon'

import { getLoggerMock } from '../mocks'
import { DefaultSecretStore } from './DefaultSecretStore.impl'

describe('DefaultSecretStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('it throws if operation is disabled', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultSecretStore({
      logger: logger.mock,
      enableGet: false,
      enableRemove: false,
      enableSet: false,
    })

    await expect(store.getSecret('example')).rejects.toThrow('get secret from store is disabled by config')

    await expect(store.removeSecret('example')).rejects.toThrow('remove secret from store is disabled by config')

    await expect(store.setSecret('example', 'value')).rejects.toThrow('set secret at store is disabled by config')

    expect(
      logger.stubs.warn.calledWith(
        'Using the DefaultSecretStore is not secure! It should only be used for test or development purpose.',
      ),
    )
  })

  it('it handles secrets', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultSecretStore({
      logger: logger.mock,
      enableGet: true,
      enableRemove: true,
      enableSet: true,
      config: {
        initialSecret: 'initial',
      },
    })

    await expect(store.getSecret('initialSecret', 'unknownSecret')).resolves.toEqual({
      initialSecret: 'initial',
      unknownSecret: undefined,
    })

    await expect(store.setSecret('initialSecret', 'other_value')).resolves.toBeUndefined()

    await expect(store.getSecret('initialSecret')).resolves.toEqual({
      initialSecret: 'other_value',
    })

    await expect(store.removeSecret('initialSecret')).resolves.toBeUndefined()

    await expect(store.getSecret('initialSecret')).resolves.toEqual({
      initialSecret: undefined,
    })
  })
})
