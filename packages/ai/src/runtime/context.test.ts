import { HandledError, StatusCode } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { InMemoryKnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import { InMemorySessionStore } from '../memory/sessionStore.js'
import { createProtocolEnvelope } from '../protocol/helpers.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createAgentHandlerContext, createProtocolBuffer } from './context.js'

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
} as any

const manifest: AgentManifest = {
	agentName: 'supportAgent',
	agentVersion: '1',
	eventBridge: 'default',
	allowedTools: [{ serviceName: 'ToolService', serviceVersion: '1', commandName: 'createTicket' }],
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
		const sessionStore = new InMemorySessionStore()
		const knowledgeAdapter = new InMemoryKnowledgeAdapter()
		const embed = vi.fn().mockResolvedValue({ embedding: [0.1, 0.2, 0.3] })
		const rerank = vi.fn().mockResolvedValue({
			ranking: [{ originalIndex: 0, score: 1, document: 'doc' }],
			rerankedDocuments: ['doc'],
		})
		await knowledgeAdapter.upsert({ document: { id: 'doc-1', content: 'Reset password steps', metadata: {} } })

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
			sessionStore,
			knowledgeAdapters: { default: knowledgeAdapter },
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: { vector: { name: 'vector', embed } },
			rerankers: { ranker: { name: 'ranker', rerank } },
			manifest,
		})

		const toolResult = await context.tools.invoke('ToolService.1.createTicket', { title: 'Need help' })
		expect(toolResult).toEqual({ id: 'ticket-1' })

		await context.session.save({ sessionId: 's1', data: { value: 1 }, updatedAt: Date.now() })
		const session = await context.session.load('s1')
		expect(session?.sessionId).toBe('supportAgent:1:tenant-1:principal-1:s1')

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

		const envelopes = buffer.toEnvelopes()
		expect(envelopes.some(envelope => envelope.frame.kind === 'tool')).toBe(true)
		expect(envelopes.some(envelope => envelope.frame.kind === 'artifact')).toBe(true)
	})

	it('resolves implicit scoped session id from payload and message metadata', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			payload: { prompt: 'hello', sessionId: 'chat-42' },
			parameter: {},
			sessionStore: new InMemorySessionStore(),
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
		expect(session?.sessionId).toBe('supportAgent:1:tenant-1:principal-1:chat-42')
		expect(context.session.identity.baseSessionId).toBe('chat-42')
		expect(context.session.resolveSessionId()).toBe('supportAgent:1:tenant-1:principal-1:chat-42')
	})

	it('uses message id when payload does not provide sessionId', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			payload: { prompt: 'hello' },
			parameter: {},
			sessionStore: new InMemorySessionStore(),
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
			payload: { prompt: 'hello' },
			parameter: {},
			sessionStore: new InMemorySessionStore(),
			knowledgeAdapters: {},
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(context.tools.invoke('Unknown.1.run', {})).rejects.toBeInstanceOf(HandledError)
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

	it('envelope helper builds valid envelopes for direct protocol tests', () => {
		const envelope = createProtocolEnvelope({
			conversationId: 'c1',
			actor: { service: 'svc', version: '1', agent: 'a', instanceId: 'i1' },
			frame: { kind: 'message', role: 'assistant', content: 'hello' },
		})
		expect(envelope.conversationId).toBe('c1')
	})
})
