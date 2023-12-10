import { getLoggerMock } from '@purista/core'
import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer, Wait } from 'testcontainers'

import { RedisConfigStore } from '../src/RedisConfigStore.impl.js'

const REDIS_PORT = 6379

describe('@purista/redis-state-store', () => {
  let container: StartedTestContainer

  beforeAll(async () => {
    container = await new GenericContainer('redis')
      .withExposedPorts({
        container: REDIS_PORT,
        host: REDIS_PORT - 1,
      })
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .withLogConsumer((_stream) => {
        // stream.on('data', (line) => console.debug(line))
        // eslint-disable-next-line no-console
        // stream.on('err', (line) => console.error(line))
      })
      .start()
  })

  afterAll(async () => {
    await container.stop()
  })

  it('set, get and remove values', async () => {
    const config = {
      url: `redis://127.0.0.1:${REDIS_PORT - 1}`,
    }

    const store = new RedisConfigStore({ config, enableSet: true, enableRemove: true, logger: getLoggerMock().mock })

    await expect(store.setConfig('myConfig', { some: 'value' })).resolves.toBeUndefined()

    const value = await store.getConfig('myConfig')
    expect(value).toStrictEqual({
      myConfig: { some: 'value' },
    })

    await expect(store.removeConfig('myConfig')).resolves.toBeUndefined()
    await expect(store.getConfig('myConfig')).resolves.toStrictEqual({
      myConfig: undefined,
    })

    await expect(store.destroy()).resolves.toBeUndefined()
  })

  it('throws on disabled features', async () => {
    const config = {
      url: `redis://127.0.0.1:${REDIS_PORT - 1}`,
    }

    const store = new RedisConfigStore({
      enableGet: false,
      enableRemove: false,
      enableSet: false,
      config,
      logger: getLoggerMock().mock,
    })

    await expect(store.setConfig('myConfig', { some: 'value' })).rejects.toThrow(
      'set config at store is disabled by config',
    )
    await expect(store.getConfig('myConfig')).rejects.toThrow('get config from store is disabled by config')
    await expect(store.removeConfig('myConfig')).rejects.toThrow('remove config from store is disabled by config')

    await expect(store.destroy()).resolves.toBeUndefined()
  })
})
