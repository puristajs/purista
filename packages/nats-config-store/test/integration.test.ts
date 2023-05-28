import { NatsContainer, StartedNatsContainer } from 'testcontainers'

import { NatsConfigStore } from '../src/NatsConfigStore.impl'

describe('@purista/redis-state-store', () => {
  let container: StartedNatsContainer

  beforeAll(async () => {
    container = await new NatsContainer('nats:alpine')
      .withArg('-js', '-js')
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
    const store = new NatsConfigStore({ ...container.getConnectionOptions(), enableRemove: true, enableSet: true })

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
    const store = new NatsConfigStore({
      enableGet: false,
      enableRemove: false,
      enableSet: false,
      ...container.getConnectionOptions(),
    })

    await expect(store.setConfig('myConfig', { some: 'value' })).rejects.toThrow(
      'set state at store is disabled by config',
    )
    await expect(store.getConfig('myConfig')).rejects.toThrow('get state from store is disabled by config')
    await expect(store.removeConfig('myConfig')).rejects.toThrow('remove state from store is disabled by config')

    await expect(store.destroy()).resolves.toBeUndefined()
  })
})
