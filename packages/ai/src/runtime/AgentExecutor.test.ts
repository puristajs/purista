import type { EventBridge } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { InMemoryConversationStore } from '../memory/conversationStore.js'
import { PoolManager } from '../pools/PoolManager.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { AgentExecutor } from './AgentExecutor.js'
import type { ProtocolContext } from './context.js'

const createLogger = () => ({
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
	debug: vi.fn(),
	trace: vi.fn(),
	fatal: vi.fn(),
	getChildLogger: vi.fn(),
})

const createProtocolContext = (): ProtocolContext<
	{ sessionId: string },
	Record<string, never>,
	Record<string, unknown>,
	any,
	any
> =>
	({
		logger: createLogger(),
		startActiveSpan: vi.fn(async (_name, _opts, _ctx, fn) => {
			return await fn({
				setAttribute: vi.fn(),
				setAttributes: vi.fn(),
				recordException: vi.fn(),
				setStatus: vi.fn(),
				spanContext: () => ({ traceId: 'trace-1', spanId: 'span-1', traceFlags: 1 }),
				end: vi.fn(),
			})
		}),
		message: {
			id: 'msg-1',
			timestamp: Date.now(),
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: 'trace-1',
			correlationId: 'corr-1',
			principalId: 'principal-1',
			tenantId: 'tenant-1',
			sender: {
				serviceName: 'desk',
				serviceVersion: '1',
				serviceTarget: 'run',
				instanceId: 'instance-1',
			},
			receiver: {
				serviceName: 'client',
				serviceVersion: '1',
				serviceTarget: 'request',
			},
			payload: {
				payload: { sessionId: 'chat-42' },
				parameter: {},
			},
		},
		emit: vi.fn(),
		invokeAgent: {},
		service: {},
		secrets: {
			getSecret: vi.fn(),
			setSecret: vi.fn(),
			removeSecret: vi.fn(),
		},
		configs: {
			getConfig: vi.fn(),
			setConfig: vi.fn(),
			removeConfig: vi.fn(),
		},
		states: {
			getState: vi.fn().mockResolvedValue({}),
			setState: vi.fn().mockResolvedValue(undefined),
			removeState: vi.fn().mockResolvedValue(undefined),
		},
	}) as unknown as ProtocolContext<{ sessionId: string }, Record<string, never>, Record<string, unknown>, any, any>

describe('AgentExecutor', () => {
	it('preserves already-emitted envelopes when the handler fails late', async () => {
		const manifest: AgentManifest = {
			agentName: 'testAgent',
			serviceVersion: '1',
			eventBridge: 'default',
		}

		const executor = new AgentExecutor({
			manifest,
			handler: async context => {
				context.io.protocol.emitMessage({ content: 'partial', partial: true })
				throw new Error('boom')
			},
			models: {} as Record<string, ModelProvider>,
			poolManager: new PoolManager({ 'agent:testAgent': 1 }),
			conversationStore: new InMemoryConversationStore(),
			logger: createLogger(),
			eventBridge: {
				instanceId: 'bridge-1',
				invoke: vi.fn(),
				openStream: vi.fn(),
			} as unknown as EventBridge,
		})

		const result = await executor.executeWithProtocolContext(createProtocolContext(), { sessionId: 'chat-42' }, {})

		expect(result.envelopes.map(envelope => envelope.frame.kind)).toEqual(['message', 'error'])
		expect(result.envelopes[0]?.conversationId).toBe('chat-42')
	})

	it('logs handler failures without leaking nested provider request payloads', async () => {
		const manifest: AgentManifest = {
			agentName: 'testAgent',
			serviceVersion: '1',
			eventBridge: 'default',
		}
		const logger = createLogger()
		const providerError = Object.assign(new Error('Provider request failed'), {
			name: 'AI_APICallError',
			requestBodyValues: {
				prompt: 'secret prompt',
				messages: [{ role: 'user', content: 'secret message' }],
			},
			responseHeaders: {
				'x-request-id': 'req_123',
			},
			responseBody: '{"error":{"message":"Rate limited"}}',
			url: 'https://api.openai.com/v1/responses',
			statusCode: 429,
			code: 'rate_limit_exceeded',
			isRetryable: true,
		})

		const executor = new AgentExecutor({
			manifest,
			handler: async () => {
				throw providerError
			},
			models: {} as Record<string, ModelProvider>,
			poolManager: new PoolManager({ 'agent:testAgent': 1 }),
			conversationStore: new InMemoryConversationStore(),
			logger,
			eventBridge: {
				instanceId: 'bridge-1',
				invoke: vi.fn(),
				openStream: vi.fn(),
			} as unknown as EventBridge,
		})

		await executor.executeWithProtocolContext(createProtocolContext(), { sessionId: 'chat-42' }, {})

		expect(logger.error).toHaveBeenCalledTimes(1)
		const payload = logger.error.mock.calls[0]?.[0]
		const serialized = JSON.stringify(payload)

		expect(payload).toMatchObject({
			agentName: 'testAgent',
			correlationId: 'corr-1',
			baseSessionId: 'chat-42',
			conversationId: 'chat-42',
		})
		expect(serialized).not.toContain('requestBodyValues')
		expect(serialized).not.toContain('secret prompt')
		expect(serialized).not.toContain('secret message')
		expect(serialized).toContain('req_123')
	})

	it('treats output contract breaches as unhandled runtime errors', async () => {
		const manifest: AgentManifest = {
			agentName: 'testAgent',
			serviceVersion: '1',
			eventBridge: 'default',
			outputSchema: {
				parse: (value: unknown) => value,
			} as never,
		}

		const executor = new AgentExecutor({
			manifest,
			handler: async () => ({ message: 'missing output' }),
			models: {} as Record<string, ModelProvider>,
			poolManager: new PoolManager({ 'agent:testAgent': 1 }),
			conversationStore: new InMemoryConversationStore(),
			logger: createLogger(),
			eventBridge: {
				instanceId: 'bridge-1',
				invoke: vi.fn(),
				openStream: vi.fn(),
			} as unknown as EventBridge,
		})

		const result = await executor.executeWithProtocolContext(createProtocolContext(), { sessionId: 'chat-42' }, {})
		expect(result.envelopes).toHaveLength(1)
		expect(result.envelopes[0]?.frame.kind).toBe('error')
		if (result.envelopes[0]?.frame.kind === 'error') {
			expect(result.envelopes[0].frame.handled).toBe(false)
			expect(result.envelopes[0].frame.message).toContain('handler did not return output')
		}
	})
})
