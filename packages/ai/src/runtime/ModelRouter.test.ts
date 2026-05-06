import type { Logger } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import { ModelRouter } from './ModelRouter.js'

const manifest = {
	agentName: 'deskAgent',
	serviceVersion: '1',
	eventBridge: 'default',
}

const identity = {
	agentName: 'deskAgent',
	serviceVersion: '1',
	traceId: 'trace-1',
	otp: 'otp-1',
	correlationId: 'corr-1',
	transportMessageId: 'msg-1',
	baseSessionId: 'chat-1',
	scopedSessionId: 'deskAgent:1:tenant-1:principal-1:chat-1',
	conversationId: 'chat-1',
	tenantId: 'tenant-1',
	principalId: 'principal-1',
}

const createLogger = (): Logger =>
	({
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
		trace: vi.fn(),
		fatal: vi.fn(),
		getChildLogger: vi.fn(),
	}) as unknown as Logger

describe('ModelRouter logging', () => {
	it('sanitizes provider failure logs', async () => {
		const logger = createLogger()
		const providerError = Object.assign(new Error('Provider request failed'), {
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
			responseBody: JSON.stringify({
				error: {
					message: 'Rate limited',
				},
			}),
		})
		const provider: ModelProvider = {
			name: 'openai',
			capabilities: {},
			generateObject: async () => {
				throw providerError
			},
		}

		const router = new ModelRouter({
			manifest,
			identity,
			models: {
				'openai:test': provider,
			},
			logger,
			poolId: 'agent:deskAgent',
			maxConcurrencyPerInstance: 1,
		})

		await expect(
			router.instrument().models['openai:test']?.generateObject?.({
				prompt: 'secret prompt',
			}),
		).rejects.toBe(providerError)

		expect(logger.error).toHaveBeenCalledTimes(1)
		const payload = (logger.error as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]
		const serialized = JSON.stringify(payload)

		expect(payload).toMatchObject({
			agentName: 'deskAgent',
			modelAlias: 'openai:test',
			provider: 'openai',
			capability: 'generateObject',
		})
		expect(serialized).not.toContain('requestBodyValues')
		expect(serialized).not.toContain('secret prompt')
		expect(serialized).not.toContain('secret message')
		expect(serialized).toContain('req_123')
		expect(serialized).toContain('Rate limited')
	})
})
