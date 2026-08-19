import { createSandbox } from 'sinon'
import { vi } from 'vitest'

import { getLoggerMock } from '../mocks/index.js'
import { DefaultStateStore } from './DefaultStateStore.impl.js'

describe('DefaultStateStore', () => {
	const sandbox = createSandbox()

	afterEach(() => {
		sandbox.restore()
	})

	it('throws if operation is disabled', async () => {
		const logger = getLoggerMock(sandbox)
		const store = new DefaultStateStore({
			logger: logger.mock,
			enableGet: false,
			enableRemove: false,
			enableSet: false,
		})

		await expect(store.getState('example')).rejects.toThrow('get state from store is disabled by config')

		await expect(store.removeState('example')).rejects.toThrow('remove state from store is disabled by config')

		await expect(store.setState('example', 'value')).rejects.toThrow('set state at store is disabled by config')

		expect(
			logger.stubs.warn.calledWith(
				'Using the DefaultStateStore is not secure! It should only be used for test or development purpose.',
			),
		).toBeTruthy()
	})

	it('handles configs', async () => {
		const logger = getLoggerMock(sandbox)
		const store = new DefaultStateStore({
			logger: logger.mock,
			enableGet: true,
			enableRemove: true,
			enableSet: true,
			config: {
				initialValue: 'initial',
			},
		})

		await expect(store.getState('initialValue', 'unknownState')).resolves.toEqual({
			initialValue: 'initial',
			unknownState: undefined,
		})

		await expect(store.setState('initialValue', 'other_value')).resolves.toBeUndefined()

		await expect(store.getState('initialValue')).resolves.toEqual({
			initialValue: 'other_value',
		})

		await expect(store.removeState('initialValue')).resolves.toBeUndefined()

		await expect(store.getState('initialValue')).resolves.toEqual({
			initialValue: undefined,
		})
	})

	it('honors native expiry on reads and refreshes it only when a value is written again', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
		try {
			const store = new DefaultStateStore({ logger: getLoggerMock(sandbox).mock })

			await store.setState('temporary', 'first', { retention: { mode: 'expire', ttlMs: 1_000 } })
			await vi.advanceTimersByTimeAsync(999)
			await expect(store.getState('temporary')).resolves.toEqual({ temporary: 'first' })

			await store.setState('temporary', 'refreshed', { retention: { mode: 'expire', ttlMs: 1_000 } })
			await vi.advanceTimersByTimeAsync(999)
			await expect(store.getState('temporary')).resolves.toEqual({ temporary: 'refreshed' })

			await vi.advanceTimersByTimeAsync(1)
			await expect(store.getState('temporary')).resolves.toEqual({ temporary: undefined })
		} finally {
			vi.useRealTimers()
		}
	})

	it('keeps state forever when retention is omitted', async () => {
		vi.useFakeTimers()
		try {
			const store = new DefaultStateStore({ logger: getLoggerMock(sandbox).mock })
			await store.setState('permanent', 'value')
			await vi.advanceTimersByTimeAsync(365 * 24 * 60 * 60 * 1_000)

			await expect(store.getState('permanent')).resolves.toEqual({ permanent: 'value' })
		} finally {
			vi.useRealTimers()
		}
	})
})
