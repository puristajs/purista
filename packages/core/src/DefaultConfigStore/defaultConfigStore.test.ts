import { createSandbox } from 'sinon'

import { getLoggerMock } from '../mocks'
import { DefaultConfigStore } from './DefaultConfigStore.impl'

describe('DefaultConfigStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('can start and stop and throws on getter and setter', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultConfigStore({ logger: logger.mock, enableRemove: true, enableSet: true })

    await expect(store.getConfig('example')).rejects.toThrow('get config is not implemented in config store')

    await expect(store.setConfig('example', 'value')).rejects.toThrow('set config is not implemented in config store')

    await expect(store.removeConfig('example')).rejects.toThrow('remove config is not implemented in config store')
  })
})
