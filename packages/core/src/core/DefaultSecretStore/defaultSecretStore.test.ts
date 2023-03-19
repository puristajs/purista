import { createSandbox } from 'sinon'

import { getLoggerMock } from '../../testhelper'
import { DefaultSecretStore } from './DefaultSecretStore.impl'

describe('DefaultSecretStore', () => {
  const sandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('can start and stop and throws on getter and setter', async () => {
    const logger = getLoggerMock(sandbox)
    const store = new DefaultSecretStore({ logger: logger.mock })

    await expect(store.getSecret('example')).rejects.toThrow('getSecret is not implemented in secret store')

    await expect(store.removeSecret('example')).rejects.toThrow('removeSecret is not implemented in secret store')

    await expect(store.setSecret('example', 'value')).rejects.toThrow('setSecret is not implemented in secret store')
  })
})
