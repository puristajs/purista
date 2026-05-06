import { describe, expect, it, vi } from 'vitest'
import { injectRuntimeAiSdkTelemetry, withRuntimeModelInvocationSpan } from './modelTelemetry.js'

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

describe('injectRuntimeAiSdkTelemetry', () => {
	it('routes capability telemetry to the correct AI SDK metadata branch', () => {
		const textMetadata = injectRuntimeAiSdkTelemetry({
			manifest,
			identity,
			capability: 'streamText',
			alias: 'openai:primary',
			poolId: 'agent:deskAgent',
			maxConcurrencyPerInstance: 2,
		})
		const objectMetadata = injectRuntimeAiSdkTelemetry({
			manifest,
			identity,
			capability: 'generateObject',
			alias: 'openai:primary',
			poolId: 'agent:deskAgent',
			maxConcurrencyPerInstance: 2,
		})
		const embedMetadata = injectRuntimeAiSdkTelemetry({
			manifest,
			identity,
			capability: 'embedMany',
			alias: 'openai:primary',
			poolId: 'agent:deskAgent',
			maxConcurrencyPerInstance: 2,
		})

		expect(textMetadata.aiSdk).toMatchObject({
			generate: {
				experimental_telemetry: {
					isEnabled: true,
					functionId: 'deskAgent.model.streamText',
					metadata: expect.objectContaining({
						conversationId: 'chat-1',
						correlationId: 'corr-1',
						traceId: 'trace-1',
					}),
				},
			},
		})
		expect(objectMetadata.aiSdk).toMatchObject({
			generateObject: {
				experimental_telemetry: {
					isEnabled: true,
					functionId: 'deskAgent.model.generateObject',
				},
			},
		})
		expect(embedMetadata.aiSdk).toMatchObject({
			embedMany: {
				experimental_telemetry: {
					isEnabled: true,
					functionId: 'deskAgent.model.embedMany',
				},
			},
		})
	})
})

describe('withRuntimeModelInvocationSpan', () => {
	it('records canonical runtime identity on the outer model span', async () => {
		const setAttribute = vi.fn()
		const setStatus = vi.fn()
		const recordException = vi.fn()
		const addEvent = vi.fn()
		const end = vi.fn()
		const tracer = {
			startActiveSpan: vi.fn(async (_name: string, fn: (span: unknown) => Promise<unknown>) => {
				return await fn({
					setAttribute,
					setStatus,
					recordException,
					addEvent,
					end,
				})
			}),
		}

		const result = await withRuntimeModelInvocationSpan({
			tracer: tracer as never,
			manifest,
			identity,
			capability: 'generateText',
			alias: 'openai:primary',
			providerName: 'openai',
			run: async () => 'ok',
		})

		expect(result).toBe('ok')
		expect(tracer.startActiveSpan).toHaveBeenCalledWith('ai.model.generateText', expect.any(Function))
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.correlation_id', 'corr-1')
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.transport_message_id', 'msg-1')
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.base_session_id', 'chat-1')
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.conversation_id', 'chat-1')
		expect(setStatus).toHaveBeenCalledWith({ code: 1 })
		expect(recordException).not.toHaveBeenCalled()
		expect(addEvent).not.toHaveBeenCalled()
		expect(end).toHaveBeenCalled()
	})

	it('records only sanitized provider diagnostics on failure', async () => {
		const setAttribute = vi.fn()
		const setStatus = vi.fn()
		const recordException = vi.fn()
		const addEvent = vi.fn()
		const end = vi.fn()
		const tracer = {
			startActiveSpan: vi.fn(async (_name: string, fn: (span: unknown) => Promise<unknown>) => {
				return await fn({
					setAttribute,
					setStatus,
					recordException,
					addEvent,
					end,
				})
			}),
		}
		const error = Object.assign(new Error('Provider request failed'), {
			name: 'AI_APICallError',
			url: 'https://api.openai.com/v1/responses',
			statusCode: 429,
			code: 'rate_limit_exceeded',
			isRetryable: true,
			requestBodyValues: {
				prompt: 'secret prompt',
			},
			responseHeaders: {
				'x-request-id': 'req_123',
			},
			responseBody: '{"error":{"message":"Rate limited"}}',
		})

		await expect(
			withRuntimeModelInvocationSpan({
				tracer: tracer as never,
				manifest,
				identity,
				capability: 'generateObject',
				alias: 'openai:primary',
				providerName: 'openai',
				run: async () => {
					throw error
				},
			}),
		).rejects.toBe(error)

		expect(recordException).toHaveBeenCalledWith(error)
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.error_kind', 'provider')
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.error_status_code', 429)
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.error_provider_code', 'rate_limit_exceeded')
		expect(setAttribute).toHaveBeenCalledWith('purista.ai.error_retryable', true)
		expect(JSON.stringify(addEvent.mock.calls)).not.toContain('secret prompt')
	})
})
