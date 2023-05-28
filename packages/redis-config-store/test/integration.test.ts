import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

import { RedisConfigStore } from '../src/RedisConfigStore.impl'

const REDIS_PORT = 6379

describe('@purista/redis-state-store', () => {
  let container: StartedTestContainer

  beforeAll(async () => {
    container = await new GenericContainer('redis')
      .withExposedPorts({
        container: REDIS_PORT,
        host: REDIS_PORT,
      })
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .withLogConsumer((stream) => {
        // stream.on('data', (line) => console.debug(line))
        // eslint-disable-next-line no-console
        stream.on('err', (line) => console.error(line))
      })
      .start()
  })

  afterAll(async () => {
    await container.stop()
  })

  it('set, get and remove values', async () => {
    const config = {
      url: `redis://127.0.0.1:${REDIS_PORT}`,
    }

    const store = new RedisConfigStore({ config, enableSet: true, enableRemove: true })

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
      url: `redis://127.0.0.1:${REDIS_PORT}`,
    }

    const store = new RedisConfigStore({ enableGet: false, enableRemove: false, enableSet: false, config })

    await expect(store.setConfig('myConfig', { some: 'value' })).rejects.toThrow(
      'set config at store is disabled by config',
    )
    await expect(store.getConfig('myConfig')).rejects.toThrow('get config from store is disabled by config')
    await expect(store.removeConfig('myConfig')).rejects.toThrow('remove config from store is disabled by config')

    await expect(store.destroy()).resolves.toBeUndefined()
  })
})
