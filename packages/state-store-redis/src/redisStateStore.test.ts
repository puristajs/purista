import { GenericContainer, StartedTestContainer } from 'testcontainers'

import { RedisStateStore } from './RedisStateStore.impl'

describe('@purista/redis-state-store', () => {
  let container: StartedTestContainer

  beforeAll(async () => {
    container = await new GenericContainer('redis').withExposedPorts(6379).start()
  })

  afterAll(async () => {
    await container.stop()
  })

  it('set, get and remove values', async () => {
    const config = {
      url: 'redis://localhost:6379',
    }

    const store = new RedisStateStore({ config })

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
    const config = {
      url: 'redis://localhost:6379',
    }

    const store = new RedisStateStore({ enableGet: false, enableRemove: false, enableSet: false, config })

    await expect(store.setState('myState', { some: 'value' })).rejects.toThrow(
      'set state at store is disabled by config',
    )
    await expect(store.getState('myState')).rejects.toThrow('get state from store is disabled by config')
    await expect(store.removeState('myState')).rejects.toThrow('remove state from store is disabled by config')

    await expect(store.destroy()).resolves.toBeUndefined()
  })
})
