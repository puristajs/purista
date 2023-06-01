import { NatsContainer, StartedNatsContainer } from 'testcontainers'

import { NatsStateStore } from '../src/NatsStateStore.impl'

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
    const store = new NatsStateStore({ ...container.getConnectionOptions() })

    await expect(store.setState('myState', { some: 'value' })).resolves.toBeUndefined()

    const value = await store.getState('myState')
    expect(value).toStrictEqual({
      myState: { some: 'value' },
    })

    await expect(store.removeState('myState')).resolves.toBeUndefined()
    await expect(store.getState('myState')).resolves.toStrictEqual({
      myState: undefined,
    })

    await expect(store.destroy()).resolves.toBeUndefined()
  })

  it('throws on disabled features', async () => {
    const store = new NatsStateStore({
      enableGet: false,
      enableRemove: false,
      enableSet: false,
      ...container.getConnectionOptions(),
    })

    await expect(store.setState('myState', { some: 'value' })).rejects.toThrow(
      'set state at store is disabled by config',
    )
    await expect(store.getState('myState')).rejects.toThrow('get state from store is disabled by config')
    await expect(store.removeState('myState')).rejects.toThrow('remove state from store is disabled by config')

    await expect(store.destroy()).resolves.toBeUndefined()
  })
})
