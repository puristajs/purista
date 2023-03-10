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

    await expect(store.start()).resolves.toBeUndefined()
    await expect(store.isReady()).resolves.toBeTruthy()

    await expect(store.getState('example')).resolves.toBeUndefined()

    await expect(store.setState('example', 'value')).resolves.toBeUndefined()

    await expect(store.getState('example')).resolves.toStrictEqual('value')

    await expect(store.isHealthy()).resolves.toBeTruthy()

    await expect(store.destroy()).resolves.toBeUndefined()
  })
})
