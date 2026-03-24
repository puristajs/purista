import { StatusCode, UnhandledError } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { runBoundedModelInvocation } from './modelInvocation.js'

describe('runBoundedModelInvocation', () => {
	it('retries transient failures before succeeding', async () => {
		let attempts = 0
		const result = await runBoundedModelInvocation({
			label: 'model:test',
			policy: {
				retry: {
					maxAttempts: 2,
					delayMs: 0,
				},
			},
			operation: async () => {
				attempts += 1
				if (attempts === 1) {
					throw new Error('fetch failed')
				}
				return 'ok'
			},
		})

		expect(result).toBe('ok')
		expect(attempts).toBe(2)
	})

	it('turns timeouts into unhandled gateway timeout errors', async () => {
		vi.useFakeTimers()
		try {
			const promise = runBoundedModelInvocation({
				label: 'model:test',
				policy: {
					timeoutMs: 10,
				},
				operation: async () =>
					await new Promise(resolve => {
						setTimeout(() => resolve('late'), 50)
					}),
			})

			const observed = promise.catch(error => error)
			await vi.advanceTimersByTimeAsync(11)
			await expect(observed).resolves.toBeInstanceOf(UnhandledError)
			await expect(observed).resolves.toMatchObject({
				errorCode: StatusCode.GatewayTimeout,
				data: expect.objectContaining({ kind: 'timeout' }),
			})
		} finally {
			vi.useRealTimers()
		}
	})

	it('classifies invalid structured-output provider failures as unhandled errors', async () => {
		const result = runBoundedModelInvocation({
			label: 'model:test',
			operation: async () => {
				throw new Error("Invalid schema for response_format 'response'")
			},
		})
		await expect(result).rejects.toBeInstanceOf(UnhandledError)
		await expect(result).rejects.toMatchObject({ errorCode: StatusCode.InternalServerError })
	})
})
