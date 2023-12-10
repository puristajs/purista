import { getLoggerMock } from '@purista/core'
import type { StartedNatsContainer } from '@testcontainers/nats'
import { NatsContainer } from '@testcontainers/nats'

import { NatsStateStore } from '../src/NatsStateStore.impl.js'

describe('@purista/nats-state-store', () => {
  let container: StartedNatsContainer

  beforeAll(async () => {
    container = await new NatsContainer('nats:alpine')
      .withArg('-js', '-js')
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
    const store = new NatsStateStore({ ...container.getConnectionOptions(), logger: getLoggerMock().mock })

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
      logger: getLoggerMock().mock,
    })

    await expect(store.setState('myState', { some: 'value' })).rejects.toThrow(
      'set state at store is disabled by config',
    )
    await expect(store.getState('myState')).rejects.toThrow('get state from store is disabled by config')
    await expect(store.removeState('myState')).rejects.toThrow('remove state from store is disabled by config')

    await expect(store.destroy()).resolves.toBeUndefined()
  })
})
