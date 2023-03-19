import { createSandbox } from 'sinon'

import { getLoggerMock } from '../../testhelper'
import { DefaultConfigStore } from './DefaultConfigStore.impl'

describe('DefaultConfigStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('can start and stop and throws on getter and setter', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultConfigStore({ logger: logger.mock })

    await expect(store.getConfig('example')).rejects.toThrow('getConfig is not implemented in config store')

    await expect(store.setConfig('example', 'value')).rejects.toThrow('setConfig is not implemented in config store')

    await expect(store.removeConfig('example')).rejects.toThrow('getConfig is not implemented in config store')
  })
})
