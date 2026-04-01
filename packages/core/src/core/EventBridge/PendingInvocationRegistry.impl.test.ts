import { describe, expect, it, vi } from 'vitest'

import { StatusCode } from '../types/StatusCode.enum.js'
import { PendingInvocationRegistry } from './PendingInvocationRegistry.impl.js'

describe('PendingInvocationRegistry', () => {
	it('rejects with gateway timeout and marks later responses as late', async () => {
		const onLateResponse = vi.fn()
		const registry = new PendingInvocationRegistry<string>({
			retentionMs: 1_000,
			onLateResponse,
		})

		const pending = registry.register('cid-1', 5, 'trace-1')

		await expect(pending).rejects.toMatchObject({ errorCode: StatusCode.GatewayTimeout })
		expect(registry.size).toBe(0)

		expect(registry.resolve('cid-1', 'late-value')).toBe('late')
		expect(onLateResponse).toHaveBeenCalledWith('cid-1')
	})

	it('bulk rejects pending invocations during shutdown', async () => {
		const registry = new PendingInvocationRegistry<string>()
		const pending = registry.register('cid-1', 1_000, 'trace-1')

		registry.rejectAll(new Error('bridge closed'))

		await expect(pending).rejects.toThrow('bridge closed')
		expect(registry.size).toBe(0)
	})

	it('resolves active invocations normally', async () => {
		const registry = new PendingInvocationRegistry<string>()
		const pending = registry.register('cid-1', 1_000, 'trace-1')

		expect(registry.resolve('cid-1', 'ok')).toBe('resolved')
		await expect(pending).resolves.toBe('ok')
		expect(registry.size).toBe(0)
	})
})
