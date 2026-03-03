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

	it('creates a handler context with tool/session/knowledge helpers', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const sessionStore = new InMemorySessionStore()
		const knowledgeAdapter = new InMemoryKnowledgeAdapter()
		await knowledgeAdapter.upsert({ id: 'doc-1', content: 'Reset password steps', metadata: {} })

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
			sessionStore,
			knowledgeAdapters: { default: knowledgeAdapter },
			protocol: buffer.protocol,
			resources: {},
			models: {},
			manifest,
		})

		const toolResult = await context.tools.invoke('ToolService.1.createTicket', { title: 'Need help' })
		expect(toolResult).toEqual({ id: 'ticket-1' })

		await context.session.save({ sessionId: 's1', data: { value: 1 }, updatedAt: Date.now() })
		const session = await context.session.load('s1')
		expect(session?.sessionId).toBe('s1')

		const docs = await context.knowledge.query('default', 'Reset')
		expect(docs).toHaveLength(1)

		const envelopes = buffer.toEnvelopes()
		expect(envelopes.some(envelope => envelope.frame.kind === 'tool')).toBe(true)
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
