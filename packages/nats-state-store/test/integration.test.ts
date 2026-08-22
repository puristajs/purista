import { getLoggerMock } from '@purista/core/adapter'
import type { StartedNatsContainer } from '@testcontainers/nats'
import { NatsContainer } from '@testcontainers/nats'

import { NatsStateStore } from '../src/NatsStateStore.impl.js'

const NATS_IMAGE = 'nats:2.10-alpine'

describe('@purista/nats-state-store', () => {
	let container: StartedNatsContainer

	beforeAll(async () => {
		container = await new NatsContainer(NATS_IMAGE).withArg('-js', '-js').start()
	})

	afterAll(async () => {
		await container?.stop()
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
