import { HandledError, StatusCode } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { InMemoryKnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import { InMemoryConversationStore } from '../memory/conversationStore.js'
import { createProtocolEnvelope } from '../protocol/helpers.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createAgentHandlerContext, createProtocolBuffer } from './context.js'

const childPayload = (prompt: string) => ({
	message: prompt,
	history: [],
	attachments: [],
	prompt,
})

const baseMessage = {
	id: 'msg-1',
	correlationId: 'corr-1',
	sender: {
		serviceName: 'support',
		serviceVersion: '1',
		serviceTarget: 'runSupport',
		instanceId: 'instance-1',
	},
	principalId: 'principal-1',
	tenantId: 'tenant-1',
} as any

const baseAgentInvoke = {
	childAgent: {
		'1': {
			call: vi.fn((payload: unknown) => ({
				async *[Symbol.asyncIterator]() {
					yield createProtocolEnvelope({
						conversationId: 'sub-chain-1',
						actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
						frame: {
							kind: 'message',
							role: 'assistant',
							content: `chained:${JSON.stringify(payload)}`,
							partial: true,
						},
					})
				},
				async final() {
					return [
						createProtocolEnvelope({
							conversationId: 'sub-chain-1',
							actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
							frame: {
								kind: 'message',
								role: 'assistant',
								content: `chained:${JSON.stringify(payload)}`,
								final: true,
							},
						}),
					]
				},
			})),
		},
	},
	typedAgent: {
		'1': {
			payloadSchema: {
				'~standard': {
					vendor: 'test',
					version: 1,
					validate: async (value: unknown) =>
						typeof (value as { prompt?: unknown })?.prompt === 'string'
							? { value }
							: { issues: [{ message: 'prompt required', path: ['prompt'] }] },
				},
			},
			call: vi.fn((payload: unknown) => ({
				async *[Symbol.asyncIterator]() {
					yield createProtocolEnvelope({
						conversationId: 'typed-1',
						actor: { service: 'typed', version: '1', agent: 'typedAgent', instanceId: 'i1' },
						frame: { kind: 'message', role: 'assistant', content: `typed:${JSON.stringify(payload)}`, partial: true },
					})
				},
				async final() {
					return [
						createProtocolEnvelope({
							conversationId: 'typed-1',
							actor: { service: 'typed', version: '1', agent: 'typedAgent', instanceId: 'i1' },
							frame: { kind: 'message', role: 'assistant', content: 'typed result', final: true },
						}),
					]
				},
			})),
		},
	},
} as const

const baseServiceContext = {
	logger: {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
	},
	startActiveSpan: vi.fn(async (_name, _opts, _ctx, fn) => {
		return await fn({
			setAttribute: vi.fn(),
			setAttributes: vi.fn(),
			recordException: vi.fn(),
			setStatus: vi.fn(),
			spanContext: () => ({ traceId: 'trace', spanId: 'span', traceFlags: 1 }),
			end: vi.fn(),
		})
	}),
	message: baseMessage,
	service: {
		ToolService: {
			'1': {
				createTicket: vi.fn().mockResolvedValue({ id: 'ticket-1' }),
			},
		},
	},
	emit: vi.fn().mockResolvedValue(undefined),
	invokeAgent: baseAgentInvoke,
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
		getState: vi.fn(),
		setState: vi.fn(),
		removeState: vi.fn(),
	},
} as any

const baseEventBridge = {
	instanceId: 'bridge-1',
	invoke: vi.fn(),
	openStream: vi.fn(),
} as any

const manifest: AgentManifest = {
	agentName: 'supportAgent',
	agentVersion: '1',
	eventBridge: 'default',
	allowedTools: [{ serviceName: 'ToolService', serviceVersion: '1', commandName: 'createTicket' }],
	allowedAgents: [
		{ agentName: 'childAgent', agentVersion: '1' },
		{ agentName: 'typedAgent', agentVersion: '1' },
	],
}

describe('runtime context helpers', () => {
	it('collects protocol frames and converts them into envelopes', () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		buffer.protocol.emitMessage({ content: 'hello', final: true })
		buffer.protocol.emitTelemetry({ durationMs: 10 })
		buffer.protocol.emitToolEvent({ toolName: 'ToolService.1.createTicket', status: 'success' })

		const envelopes = buffer.toEnvelopes()
		expect(envelopes).toHaveLength(3)
		expect(envelopes[0]?.frame.kind).toBe('message')
		expect(envelopes[1]?.frame.kind).toBe('telemetry')
		expect(envelopes[2]?.frame.kind).toBe('tool')
	})

	it('forwards envelopes incrementally to onEnvelope callbacks', async () => {
		const observed: Array<{ frame?: { kind?: string }; messageId?: string }> = []
		const onEnvelope = async (envelope: { frame?: { kind?: string }; messageId?: string }) => {
			observed.push(envelope)
		}
		const buffer = createProtocolBuffer(baseServiceContext, { onEnvelope })
		buffer.protocol.emitMessage({ content: 'one', partial: true })
		buffer.protocol.emitMessage({ content: 'two', final: true })
		await buffer.flush()
		const envelopes = buffer.toEnvelopes()
		expect(observed).toHaveLength(2)
		const first = observed[0]
		const second = observed[1]
		expect(first?.frame?.kind).toBe('message')
		expect(second?.frame?.kind).toBe('message')
		expect(envelopes[0]?.messageId).toBe(first?.messageId)
		expect(envelopes[1]?.messageId).toBe(second?.messageId)
	})

	it('creates a handler context with tool/session/knowledge helpers', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const conversationStore = new InMemoryConversationStore()
		const knowledgeAdapter = new InMemoryKnowledgeAdapter()
		const embed = vi.fn().mockResolvedValue({ embedding: [0.1, 0.2, 0.3] })
		const rerank = vi.fn().mockResolvedValue({
			ranking: [{ originalIndex: 0, score: 1, document: 'doc' }],
			rerankedDocuments: ['doc'],
		})
		await knowledgeAdapter.upsert({ document: { id: 'doc-1', content: 'Reset password steps', metadata: {} } })

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
			conversationStore,
			knowledgeAdapters: { default: knowledgeAdapter },
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: { vector: { name: 'vector', embed } },
			rerankers: { ranker: { name: 'ranker', rerank } },
			manifest,
		})

		const toolResult = await context.tools.invoke.ToolService['1'].createTicket({ title: 'Need help' })
		expect(toolResult).toEqual({ id: 'ticket-1' })
		const toolResultViaPath = await context.tools.invoke.ToolService['1'].createTicket({ title: 'Need help (path)' })
		expect(toolResultViaPath).toEqual({ id: 'ticket-1' })

		await context.session.save({ conversationId: 's1', data: { value: 1 }, updatedAt: Date.now() })
		const session = await context.session.load('s1')
		expect(session?.conversationId).toBe('s1')

		const docs = await context.knowledge.query('default', 'Reset')
		expect(docs).toHaveLength(1)
		const docsByAlias = await context.knowledge.default.query('Reset')
		expect(docsByAlias).toHaveLength(1)
		await context.knowledge.default.upsert({
			id: 'doc-2',
			content: 'Reset MFA settings',
		})
		const docsWithLimit = await context.knowledge.query('default', 'Reset', 1)
		expect(docsWithLimit).toHaveLength(1)

		await context.conversation.addUser('Need password reset help')
		await context.conversation.addAssistant('Use the forgot-password page.')
		const promptInput = await context.conversation.buildPromptInput()
		expect(promptInput).toContain('user: Need password reset help')
		expect(promptInput).toContain('assistant: Use the forgot-password page.')
		await (
			context.embeddings as Record<string, { embed: (request: { value: string }) => Promise<unknown> }>
		).vector.embed({
			value: 'reset password',
		})
		await (
			context.rerankers as Record<
				string,
				{ rerank: (request: { query: string; documents: string[] }) => Promise<unknown> }
			>
		).ranker.rerank({ query: 'reset', documents: ['doc'] })
		expect(embed).toHaveBeenCalledOnce()
		expect(rerank).toHaveBeenCalledOnce()
		context.stream.sendReasoning('reasoning note')
		await (context.emit as (eventName: string, payload: { status: string }) => Promise<void>)('agent.updated', {
			status: 'ok',
		})
		expect(baseServiceContext.emit).toHaveBeenCalledWith('agent.updated', { status: 'ok' })

		const envelopes = buffer.toEnvelopes()
		expect(envelopes.some(envelope => envelope.frame.kind === 'tool')).toBe(true)
		expect(envelopes.some(envelope => envelope.frame.kind === 'artifact')).toBe(true)
	})

	it('resolves implicit scoped session id from payload and message metadata', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'chat-42' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.session.save({ data: { value: 'implicit' } })
		const session = await context.session.load()
		expect(session?.conversationId).toBe('chat-42')
		expect(context.session.identity.baseSessionId).toBe('chat-42')
		expect(context.session.resolveSessionId()).toBe('supportAgent:1:tenant-1:principal-1:chat-42')
	})

	it('uses message id when payload does not provide sessionId', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		expect(context.session.resolveSessionId()).toBe('supportAgent:1:tenant-1:principal-1:msg-1')
	})

	it('creates structured error frames', () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		buffer.protocol.emitError(new Error('boom'))
		const envelopes = buffer.toEnvelopes()
		expect(envelopes[0]?.frame.kind).toBe('error')
	})

	it('validates allowlisted tools and knowledge adapters', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(context.tools.invoke.Unknown['1'].run({})).rejects.toBeInstanceOf(HandledError)
		await expect(context.knowledge.query('missing', 'test')).rejects.toMatchObject({
			errorCode: StatusCode.NotFound,
		})
	})

	it('supports message emission for primitive values and has() checks', () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		buffer.protocol.emitMessage('123')
		buffer.protocol.emitMessage({ content: 'second', partial: true })
		expect(buffer.protocol.has('message')).toBe(true)
	})

	it('ignores empty message content to keep message frame validation robust', () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		buffer.protocol.emitMessage('')
		buffer.protocol.emitMessage({ content: '' })
		buffer.protocol.emitMessage({ content: 'ok', final: true })

		const envelopes = buffer.toEnvelopes()
		expect(envelopes).toHaveLength(1)
		expect(envelopes[0]?.frame.kind).toBe('message')
		if (envelopes[0]?.frame.kind === 'message') {
			expect(envelopes[0].frame.content).toBe('ok')
		}
	})

	it('envelope helper builds valid envelopes for direct protocol tests', () => {
		const envelope = createProtocolEnvelope({
			conversationId: 'c1',
			actor: { service: 'svc', version: '1', agent: 'a', instanceId: 'i1' },
			frame: { kind: 'message', role: 'assistant', content: 'hello' },
		})
		expect(envelope.conversationId).toBe('c1')
	})

	it('provides subagent invocation helpers on context.agents', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-1',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'child result', final: true },
			}),
		])

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'chat-7' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const envelopes = await context.agents.invoke({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
		})
		expect(envelopes).toHaveLength(1)

		const childAgentApi = context.agents.invoke.childAgent?.['1']
		expect(childAgentApi).toBeDefined()
		if (!childAgentApi || typeof childAgentApi.call !== 'function') {
			throw new Error('expected child agent api to be defined')
		}
		const chainedInvocation = childAgentApi.call(childPayload('go-again'))
		const chainedEnvelopes = await chainedInvocation.final()
		expect(chainedEnvelopes).toHaveLength(1)

		const text = await context.agents.runText({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
		})
		expect(text).toBe('child result')

		baseEventBridge.invoke.mockResolvedValueOnce([
			createProtocolEnvelope({
				conversationId: 'sub-4',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: '{"ok":true}', final: true },
			}),
		])
		const obj = await context.agents.runObject<{ ok: boolean }>({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
		})
		expect(obj).toEqual({ ok: true })
		expect(baseEventBridge.invoke).toHaveBeenCalled()
	})

	it('enforces declared agent dependencies for direct helper invocations', async () => {
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.agents.invoke({
				agentName: 'missingAgent',
				agentVersion: '1',
				payload: { prompt: 'go' },
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.BadRequest,
		})
	})

	it('validates direct helper payloads against declared agent schemas', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.agents.invoke({
				agentName: 'typedAgent',
				agentVersion: '1',
				payload: { wrong: true },
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.BadRequest,
		})
	})

	it('emits tool frames for chained agent invocations', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const childAgentApi = context.agents.invoke.childAgent['1']
		expect(childAgentApi).toBeDefined()
		if (!childAgentApi || typeof childAgentApi.call !== 'function') {
			throw new Error('expected child agent api to be defined')
		}
		const invocation = childAgentApi.call(childPayload('typed'))
		await invocation.final()

		const toolFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'tool')
		expect(toolFrames.some(frame => frame.toolName === 'childAgent.1.run' && frame.status === 'invoked')).toBe(true)
		expect(toolFrames.some(frame => frame.toolName === 'childAgent.1.run' && frame.status === 'success')).toBe(true)
	})

	it('can forward sub-agent frames into the current agent stream', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-forward',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'hello ', partial: true, final: false },
			}),
			createProtocolEnvelope({
				conversationId: 'sub-forward',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: {
					kind: 'artifact',
					artifactId: 'reasoning',
					content: 'thinking',
					mimeType: 'text/markdown',
					phase: 'chunk',
				},
			}),
			createProtocolEnvelope({
				conversationId: 'sub-forward',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'world', final: true },
			}),
		])

		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.agents.invoke({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
			forwardToCurrentStream: true,
			emitInvocationToolEvents: false,
		})

		const frames = buffer.toEnvelopes().map(envelope => envelope.frame)
		const assistantFrames = frames.filter(
			(frame): frame is Extract<(typeof frames)[number], { kind: 'message' }> =>
				frame.kind === 'message' && frame.role === 'assistant',
		)
		const reasoningFrames = frames.filter(
			(frame): frame is Extract<(typeof frames)[number], { kind: 'artifact' }> =>
				frame.kind === 'artifact' && frame.artifactId === 'reasoning',
		)
		const toolFrames = frames.filter(frame => frame.kind === 'tool')

		expect(assistantFrames.map(frame => frame.content)).toEqual(['hello ', 'world'])
		expect(reasoningFrames).toHaveLength(1)
		expect(toolFrames).toHaveLength(0)
	})

	it('can suppress invocation telemetry while still returning envelopes', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.agents.invoke({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('typed'),
			emitInvocationToolEvents: false,
		})

		const toolFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'tool')
		expect(toolFrames).toHaveLength(0)
	})

	it('can forward another agent with orchestration defaults', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-forward-defaults',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'tool', toolName: 'readSpec', status: 'invoked', input: { path: 'specs/spec.md' } },
			}),
			createProtocolEnvelope({
				conversationId: 'sub-forward-defaults',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'forwarded text', final: true },
			}),
		])

		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.agents.forward({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
		})

		const frames = buffer.toEnvelopes().map(envelope => envelope.frame)
		const assistantFrames = frames.filter(
			(frame): frame is Extract<(typeof frames)[number], { kind: 'message' }> =>
				frame.kind === 'message' && frame.role === 'assistant',
		)
		const toolFrames = frames.filter(frame => frame.kind === 'tool')

		expect(assistantFrames.map(frame => frame.content)).toEqual(['forwarded text'])
		expect(toolFrames).toHaveLength(0)
	})

	it('can forward nested tool events when requested explicitly', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-forward-tool-events',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'tool', toolName: 'readSpec', status: 'invoked', input: { path: 'specs/spec.md' } },
			}),
		])

		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.agents.forward({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
			forward: {
				toolEvents: true,
			},
		})

		const toolFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'tool')
		expect(toolFrames).toHaveLength(1)
		expect(toolFrames[0]).toMatchObject({
			toolName: 'readSpec',
			status: 'invoked',
		})
	})

	it('exposes secrets/configs/states directly on agent context', async () => {
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		expect(context.secrets).toBe(baseServiceContext.secrets)
		expect(context.configs).toBe(baseServiceContext.configs)
		expect(context.states).toBe(baseServiceContext.states)
	})

	it('fails subagent invocation on protocol error envelopes by default', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-2',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'error', code: 'ChildFailed', message: 'child failed', handled: true },
			}),
		])

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'chat-8' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.agents.invoke({
				agentName: 'childAgent',
				agentVersion: '1',
				payload: { prompt: 'go' },
			}),
		).rejects.toThrow('child failed')
	})

	it('allows protocol error envelopes when failOnErrorFrame is false', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-3',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'error', code: 'Expected', message: 'expected domain result', handled: true },
			}),
		])

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'chat-9' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const envelopes = await context.agents.invoke({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: { prompt: 'go' },
			failOnErrorFrame: false,
		})
		expect(envelopes).toHaveLength(1)
		expect(envelopes[0]?.frame.kind).toBe('error')
	})

	it('fails runObject when final assistant text is not valid JSON', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-5',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'not json', final: true },
			}),
		])

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.agents.runObject({
				agentName: 'childAgent',
				agentVersion: '1',
				payload: { prompt: 'go' },
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.BadGateway,
		})
	})

	it('ignores empty stream chunks and finals', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		context.stream.sendChunk('')
		context.stream.sendFinal('')
		context.stream.sendChunk('chunk')
		context.stream.sendFinal('final')

		const messageFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'message')
		expect(messageFrames).toHaveLength(2)
		if (messageFrames[0]?.kind === 'message' && messageFrames[1]?.kind === 'message') {
			expect(messageFrames[0].content).toBe('chunk')
			expect(messageFrames[1].content).toBe('final')
		}
	})

	it('passes tenantId and principalId to conversation store', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const conversationStore = {
			load: vi.fn().mockResolvedValue(undefined),
			save: vi.fn().mockResolvedValue(undefined),
			delete: vi.fn().mockResolvedValue(undefined),
		}
		const knowledgeAdapter = new InMemoryKnowledgeAdapter()

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: conversationStore as any,
			knowledgeAdapters: { default: knowledgeAdapter },
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.session.save({ conversationId: 's1', data: { value: 1 } })
		expect(conversationStore.save).toHaveBeenCalledWith(expect.objectContaining({ conversationId: 's1' }), {
			agentName: 'supportAgent',
			agentVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		await context.session.load('s1')
		expect(conversationStore.load).toHaveBeenCalledWith('s1', {
			agentName: 'supportAgent',
			agentVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		await context.session.delete('s1')
		expect(conversationStore.delete).toHaveBeenCalledWith('s1', {
			agentName: 'supportAgent',
			agentVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})
	})

	it('isolates session state by tenant while keeping the same logical conversation id', async () => {
		const store = new InMemoryConversationStore()
		const tenantAContext = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'shared' },
			parameter: {},
			conversationStore: store,
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})
		const tenantBContext = createAgentHandlerContext({
			serviceContext: {
				...baseServiceContext,
				message: {
					...baseMessage,
					tenantId: 'tenant-2',
				},
			},
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'shared' },
			parameter: {},
			conversationStore: store,
			knowledgeAdapters: {},
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await tenantAContext.session.save({ data: { owner: 'tenant-a' } })
		await tenantBContext.session.save({ data: { owner: 'tenant-b' } })

		await expect(tenantAContext.session.load()).resolves.toMatchObject({
			conversationId: 'shared',
			data: { owner: 'tenant-a' },
		})
		await expect(tenantBContext.session.load()).resolves.toMatchObject({
			conversationId: 'shared',
			data: { owner: 'tenant-b' },
		})
	})
})
