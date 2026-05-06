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

	it('treats DNS resolver failures as retryable transient provider errors', async () => {
		const result = runBoundedModelInvocation({
			label: 'model:test',
			policy: {
				retry: {
					maxAttempts: 1,
				},
			},
			operation: async () => {
				const error = new Error('Cannot connect to API: getaddrinfo ENOTFOUND api.openai.com') as Error & {
					code?: string
				}
				error.code = 'ENOTFOUND'
				throw error
			},
		})

		await expect(result).rejects.toBeInstanceOf(UnhandledError)
		await expect(result).rejects.toMatchObject({
			errorCode: StatusCode.BadGateway,
			data: expect.objectContaining({ kind: 'transient' }),
		})
	})

	it('does not place raw provider request payloads into unhandled error data', async () => {
		const result = runBoundedModelInvocation({
			label: 'model:test',
			operation: async () => {
				throw Object.assign(new Error('Provider request failed'), {
					name: 'AI_APICallError',
					url: 'https://api.openai.com/v1/responses',
					statusCode: 429,
					code: 'rate_limit_exceeded',
					isRetryable: true,
					requestBodyValues: {
						prompt: 'secret prompt',
						messages: [{ role: 'user', content: 'secret message' }],
					},
					responseHeaders: {
						'x-request-id': 'req_123',
					},
				})
			},
		})

		await expect(result).rejects.toBeInstanceOf(UnhandledError)
		await expect(result).rejects.toMatchObject({
			data: expect.objectContaining({
				details: expect.objectContaining({
					providerCode: 'rate_limit_exceeded',
					requestId: 'req_123',
				}),
			}),
		})
		await expect(result).rejects.not.toMatchObject({
			data: expect.objectContaining({
				cause: expect.anything(),
			}),
		})
		await expect(result).rejects.not.toMatchObject({
			data: expect.objectContaining({
				requestBodyValues: expect.anything(),
			}),
		})
	})
})
