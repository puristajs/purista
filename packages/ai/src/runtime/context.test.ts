import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { HandledError, StatusCode } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { InMemoryConversationStore } from '../memory/conversationStore.js'
import { createArtifactFrame, createProtocolEnvelope } from '../protocol/helpers.js'
import { FileSkillResource } from '../skills/fileSystem.js'
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
	traceId: 'trace-parent-1',
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

const startedSpans: Array<{ name: string; span: { setAttribute: ReturnType<typeof vi.fn> } }> = []

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
		const span = {
			setAttribute: vi.fn(),
			setAttributes: vi.fn(),
			recordException: vi.fn(),
			setStatus: vi.fn(),
			spanContext: () => ({ traceId: 'trace', spanId: 'span', traceFlags: 1 }),
			end: vi.fn(),
		}
		startedSpans.push({ name: _name, span })
		return await fn(span)
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

	it('creates a handler context with tool/session/conversation helpers', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const conversationStore = new InMemoryConversationStore()
		const embed = vi.fn().mockResolvedValue({ embedding: [0.1, 0.2, 0.3] })
		const rerank = vi.fn().mockResolvedValue({
			ranking: [{ originalIndex: 0, score: 1, document: 'doc' }],
			rerankedDocuments: ['doc'],
		})

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
			conversationStore,
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: { vector: { name: 'vector', embed } },
			rerankers: { ranker: { name: 'ranker', rerank } },
			manifest,
		})

		const toolResult = await context.invoke.tools.invoke.ToolService['1'].createTicket({ title: 'Need help' })
		expect(toolResult).toEqual({ id: 'ticket-1' })
		const toolResultViaPath = await context.invoke.tools.invoke.ToolService['1'].createTicket({
			title: 'Need help (path)',
		})
		expect(toolResultViaPath).toEqual({ id: 'ticket-1' })

		await context.memory.session.save({ conversationId: 's1', data: { value: 1 }, updatedAt: Date.now() })
		const session = await context.memory.session.load('s1')
		expect(session?.conversationId).toBe('s1')

		await context.memory.conversation.addUser('Need password reset help')
		await context.memory.conversation.addAssistant('Use the forgot-password page.')
		const promptInput = await context.memory.conversation.buildPromptInput()
		expect(promptInput).toContain('user: Need password reset help')
		expect(promptInput).toContain('assistant: Use the forgot-password page.')
		await (
			context.ai.embeddings as Record<string, { embed: (request: { value: string }) => Promise<unknown> }>
		).vector.embed({
			value: 'reset password',
		})
		await (
			context.ai.rerankers as Record<
				string,
				{ rerank: (request: { query: string; documents: string[] }) => Promise<unknown> }
			>
		).ranker.rerank({ query: 'reset', documents: ['doc'] })
		expect(embed).toHaveBeenCalledOnce()
		expect(rerank).toHaveBeenCalledOnce()
		context.io.stream.sendReasoning('reasoning note')
		await (context.output.emit as (eventName: string, payload: { status: string }) => Promise<void>)('agent.updated', {
			status: 'ok',
		})
		expect(baseServiceContext.emit).toHaveBeenCalledWith('agent.updated', { status: 'ok' })

		const envelopes = buffer.toEnvelopes()
		expect(envelopes.some(envelope => envelope.frame.kind === 'tool')).toBe(true)
		expect(envelopes.some(envelope => envelope.frame.kind === 'artifact')).toBe(true)
		const toolSpan = startedSpans.find(entry => entry.name === 'ai.tool_call:ToolService/createTicket')
		expect(toolSpan).toBeDefined()
		expect(toolSpan?.span.setAttribute).toHaveBeenCalledWith('purista.ai.tool_name', 'ToolService.1.createTicket')
		expect(toolSpan?.span.setAttribute).toHaveBeenCalledWith('purista.principalId', 'principal-1')
		expect(toolSpan?.span.setAttribute).toHaveBeenCalledWith('purista.tenantId', 'tenant-1')
	})

	it('exposes durable run state helpers on the handler context', async () => {
		const stateStore = new Map<string, unknown>()
		const buffer = createProtocolBuffer({
			...baseServiceContext,
			states: {
				getState: vi.fn(async (...stateNames: string[]) =>
					Object.fromEntries(stateNames.map(stateName => [stateName, stateStore.get(stateName)])),
				),
				setState: vi.fn(async (stateName: string, value: unknown) => {
					stateStore.set(stateName, value)
				}),
				removeState: vi.fn(async (stateName: string) => {
					stateStore.delete(stateName)
				}),
			},
		} as typeof baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: {
				...baseServiceContext,
				states: {
					getState: async (...stateNames: string[]) =>
						Object.fromEntries(stateNames.map(stateName => [stateName, stateStore.get(stateName)])),
					setState: async (stateName: string, value: unknown) => {
						stateStore.set(stateName, value)
					},
					removeState: async (stateName: string) => {
						stateStore.delete(stateName)
					},
				},
			} as typeof baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'plan' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const run = await context.memory.run.start({
			title: 'Example run',
			extraScope: { projectId: 'demo' },
		})
		await run.plan([{ id: 'step-1', title: 'Collect facts' }])
		const persisted = await context.memory.run.get({ extraScope: { projectId: 'demo' } })

		expect(persisted?.title).toBe('Example run')
		expect(persisted?.tasks[0]?.title).toBe('Collect facts')
		expect(buffer.toEnvelopes().some(envelope => envelope.frame.kind === 'artifact')).toBe(true)
	})

	it('resolves implicit scoped session id from payload and message metadata', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'chat-42' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.memory.session.save({ data: { value: 'implicit' } })
		const session = await context.memory.session.load()
		expect(session?.conversationId).toBe('chat-42')
		expect(context.memory.session.identity.baseSessionId).toBe('chat-42')
		expect(context.memory.session.resolveSessionId()).toBe('supportAgent:1:tenant-1:principal-1:chat-42')
	})

	it('uses message id when payload does not provide sessionId', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		expect(context.memory.session.resolveSessionId()).toBe('supportAgent:1:tenant-1:principal-1:msg-1')
	})

	it('creates structured error frames', () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		buffer.protocol.emitError(new Error('boom'))
		const envelopes = buffer.toEnvelopes()
		expect(envelopes[0]?.frame.kind).toBe('error')
	})

	it('validates allowlisted tools', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(context.invoke.tools.invoke.Unknown['1'].run({})).rejects.toBeInstanceOf(HandledError)
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

	it('provides subagent invocation helpers on context.invoke.agents', async () => {
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
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const envelopes = await context.invoke.agents.invoke({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
		})
		expect(envelopes).toHaveLength(1)

		const childAgentApi = context.invoke.agents.invoke.childAgent?.['1']
		expect(childAgentApi).toBeDefined()
		if (!childAgentApi || typeof childAgentApi.call !== 'function') {
			throw new Error('expected child agent api to be defined')
		}
		const chainedInvocation = childAgentApi.call(childPayload('go-again'))
		const chainedEnvelopes = await chainedInvocation.final()
		expect(chainedEnvelopes).toHaveLength(1)

		const text = await context.invoke.agents.runText({
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
		const obj = await context.invoke.agents.runObject<{ ok: boolean }>({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
		})
		expect(obj).toEqual({ ok: true })
		expect(baseEventBridge.invoke).toHaveBeenCalled()
		expect(baseEventBridge.invoke.mock.calls[0][0].traceId).toBe('trace-parent-1')
		const agentSpan = startedSpans.find(entry => entry.name === 'ai.agent_invoke:childAgent/1')
		expect(agentSpan).toBeDefined()
		expect(agentSpan?.span.setAttribute).toHaveBeenCalledWith('purista.ai.agent_name', 'childAgent')
		expect(agentSpan?.span.setAttribute).toHaveBeenCalledWith('purista.ai.agent_version', '1')
		expect(agentSpan?.span.setAttribute).toHaveBeenCalledWith('purista.principalId', 'principal-1')
		expect(agentSpan?.span.setAttribute).toHaveBeenCalledWith('purista.tenantId', 'tenant-1')
	})

	it('falls back to direct event bridge invocation when no service-level agent binding is present', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-direct-1',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'direct child result', final: true },
			}),
		])

		const context = createAgentHandlerContext({
			serviceContext: {
				...baseServiceContext,
				invokeAgent: undefined,
			},
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello', sessionId: 'chat-queue' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const text = await context.invoke.agents.runText({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('queue child'),
		})
		expect(text).toBe('direct child result')

		const childAgentApi = context.invoke.agents.invoke.childAgent?.['1']
		expect(childAgentApi).toBeDefined()
		if (!childAgentApi || typeof childAgentApi.call !== 'function') {
			throw new Error('expected child agent api to be defined')
		}

		const chainedEnvelopes = await childAgentApi.call(childPayload('queue child chained')).final()
		expect(chainedEnvelopes).toHaveLength(1)
		expect(baseEventBridge.invoke).toHaveBeenCalled()
	})

	it('enforces declared agent dependencies for direct helper invocations', async () => {
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.invoke.agents.invoke({
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
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.invoke.agents.invoke({
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
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const childAgentApi = context.invoke.agents.invoke.childAgent['1']
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
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.invoke.agents.invoke({
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
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.invoke.agents.invoke({
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
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.invoke.agents.forward({
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
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.invoke.agents.forward({
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

	it('forwards structured artifact payloads such as run-state by default', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-forward-run-state',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: createArtifactFrame({
					artifactId: 'run-state',
					mimeType: 'application/json',
					content: {
						runId: 'run-1',
						title: 'Architecture draft',
						status: 'running',
					},
				}),
			}),
		])

		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.invoke.agents.forward({
			agentName: 'childAgent',
			agentVersion: '1',
			payload: childPayload('go'),
		})

		const artifactFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'artifact')

		expect(artifactFrames).toHaveLength(1)
		expect(artifactFrames[0]).toMatchObject({
			artifactId: 'run-state',
			mimeType: 'application/json',
		})
		expect(artifactFrames[0].content).toMatchObject({
			runId: 'run-1',
			title: 'Architecture draft',
			status: 'running',
		})
	})

	it('exposes secrets/configs/states directly on agent context', async () => {
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		expect(context.runtime.stores.secrets).toBe(baseServiceContext.secrets)
		expect(context.runtime.stores.configs).toBe(baseServiceContext.configs)
		expect(context.runtime.stores.states).toBe(baseServiceContext.states)
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
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.invoke.agents.invoke({
				agentName: 'childAgent',
				agentVersion: '1',
				payload: { prompt: 'go' },
			}),
		).rejects.toBeInstanceOf(HandledError)
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
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const envelopes = await context.invoke.agents.invoke({
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
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.invoke.agents.runObject({
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
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		context.io.stream.sendChunk('')
		context.io.stream.sendFinal('')
		context.io.stream.sendChunk('chunk')
		context.io.stream.sendFinal('final')

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

	it('streams public assistant replies through context.ai.reply.generate', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {
				primary: {
					name: 'reply-model',
					capabilities: { text: true, stream: true },
					generateText: async request => {
						await request.onTextDelta?.('Hello')
						await request.onTextDelta?.(' world')
						return 'Hello world'
					},
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const reply = await context.ai.reply.generate({
			model: 'primary',
			prompt: 'Say hello',
		})

		expect(reply).toBe('Hello world')
		const messageFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'message')
		expect(messageFrames).toHaveLength(3)
		if (
			messageFrames[0]?.kind === 'message' &&
			messageFrames[1]?.kind === 'message' &&
			messageFrames[2]?.kind === 'message'
		) {
			expect(messageFrames[0].content).toBe('Hello')
			expect(messageFrames[0].partial).toBe(true)
			expect(messageFrames[1].content).toBe(' world')
			expect(messageFrames[1].partial).toBe(true)
			expect(messageFrames[2].content).toBe('')
			expect(messageFrames[2].final).toBe(true)
		}
	})

	it('composes internal assistant replies without streaming them', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {
				primary: {
					name: 'reply-model',
					capabilities: { text: true },
					generateText: async request => {
						await request.onTextDelta?.('ignored')
						return 'Internal draft'
					},
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const reply = await context.ai.reply.compose({
			model: 'primary',
			prompt: 'Draft internally',
		})

		expect(reply).toBe('Internal draft')
		const messageFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'message')
		expect(messageFrames).toHaveLength(0)
	})

	it('fails public assistant replies when the selected model does not support streamed text', async () => {
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {
				primary: {
					name: 'reply-model',
					capabilities: {},
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.ai.reply.generate({
				model: 'primary',
				prompt: 'Say hello',
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})

	it('fails public assistant replies when the model returns an empty reply', async () => {
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {
				primary: {
					name: 'reply-model',
					capabilities: { text: true, stream: true },
					generateText: async () => '   ',
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.ai.reply.generate({
				model: 'primary',
				prompt: 'Say hello',
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
			message: 'Model primary generated an empty public reply',
		})
	})

	it('fails internal assistant composition when the selected model does not support text', async () => {
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {
				primary: {
					name: 'reply-model',
					capabilities: {},
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await expect(
			context.ai.reply.compose({
				model: 'primary',
				prompt: 'Draft internally',
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})

	it('publishes deterministic public assistant replies through context.ai.reply.publish', () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const reply = context.ai.reply.publish('First sentence. Second sentence.\n\nFinal paragraph.')

		expect(reply).toBe('First sentence. Second sentence.\n\nFinal paragraph.')
		const messageFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'message')
		expect(messageFrames).toHaveLength(4)
		if (
			messageFrames[0]?.kind === 'message' &&
			messageFrames[1]?.kind === 'message' &&
			messageFrames[2]?.kind === 'message' &&
			messageFrames[3]?.kind === 'message'
		) {
			expect(messageFrames[0].content).toBe('First sentence.')
			expect(messageFrames[0].partial).toBe(true)
			expect(messageFrames[1].content).toBe(' Second sentence.')
			expect(messageFrames[1].partial).toBe(true)
			expect(messageFrames[2].content).toBe('\n\nFinal paragraph.')
			expect(messageFrames[2].partial).toBe(true)
			expect(messageFrames[3].content).toBe('')
			expect(messageFrames[3].final).toBe(true)
		}
	})

	it('passes tenantId and principalId to conversation store', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const conversationStore = {
			load: vi.fn().mockResolvedValue(undefined),
			save: vi.fn().mockResolvedValue(undefined),
			delete: vi.fn().mockResolvedValue(undefined),
		}

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: conversationStore as any,
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.memory.session.save({ conversationId: 's1', data: { value: 1 } })
		expect(conversationStore.save).toHaveBeenCalledWith(expect.objectContaining({ conversationId: 's1' }), {
			agentName: 'supportAgent',
			agentVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		await context.memory.session.load('s1')
		expect(conversationStore.load).toHaveBeenCalledWith('s1', {
			agentName: 'supportAgent',
			agentVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		await context.memory.session.delete('s1')
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
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await tenantAContext.memory.session.save({ data: { owner: 'tenant-a' } })
		await tenantBContext.memory.session.save({ data: { owner: 'tenant-b' } })

		await expect(tenantAContext.memory.session.load()).resolves.toMatchObject({
			conversationId: 'shared',
			data: { owner: 'tenant-a' },
		})
		await expect(tenantBContext.memory.session.load()).resolves.toMatchObject({
			conversationId: 'shared',
			data: { owner: 'tenant-b' },
		})
	})

	it('selects generic skills from manifest defaults and required entries', async () => {
		const skillRoot = await mkdtemp(join(tmpdir(), 'purista-context-skills-'))
		await mkdir(join(skillRoot, 'spec-elicitation'), { recursive: true })
		await writeFile(
			join(skillRoot, 'spec-elicitation', 'SKILL.md'),
			`---
name: spec-elicitation
description: Ask focused clarification questions.
topics:
  - elicitation
phases:
  - spec
---

Clarify missing constraints.`,
			'utf8',
		)
		await mkdir(join(skillRoot, 'architecture-synthesis'), { recursive: true })
		await writeFile(
			join(skillRoot, 'architecture-synthesis', 'SKILL.md'),
			`---
name: architecture-synthesis
description: Turn requirements into architecture.
topics:
  - architecture
  - services
phases:
  - architecture
---

Map requirements to services and queues.`,
			'utf8',
		)

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {
				skills: new FileSkillResource({ roots: [skillRoot] }),
			},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest: {
				...manifest,
				skills: {
					resourceName: 'skills',
					names: ['spec-elicitation', 'architecture-synthesis'],
				},
			},
		})

		await expect(context.ai.skills.loadAvailable()).resolves.toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: 'spec-elicitation' }),
				expect.objectContaining({ name: 'architecture-synthesis' }),
			]),
		)
		await expect(context.ai.skills.search({ queries: ['services'] })).resolves.toEqual([
			expect.objectContaining({ name: 'architecture-synthesis' }),
		])
		expect(context.ai.skills.config).toEqual({
			resourceName: 'skills',
			names: ['spec-elicitation', 'architecture-synthesis'],
		})
	})

	it('selects relevant references from a declared skill dynamically', async () => {
		const skillRoot = await mkdtemp(join(tmpdir(), 'skill-select-'))
		await mkdir(join(skillRoot, 'purista', 'references'), { recursive: true })
		await writeFile(
			join(skillRoot, 'purista', 'SKILL.md'),
			['---', 'name: purista', 'description: Canonical Purista skill', '---', '', '# PURISTA'].join('\n'),
		)
		await writeFile(
			join(skillRoot, 'purista', 'references', '02-spec-to-architecture.md'),
			'Use business capabilities, actors, and flows to derive service boundaries and architecture.',
		)
		await writeFile(
			join(skillRoot, 'purista', 'references', '03-service-builders-and-contracts.md'),
			'Choose service builders, commands, events, and contracts explicitly.',
		)
		await writeFile(
			join(skillRoot, 'purista', 'references', '08-testing-observability-and-deployment.md'),
			'Testing and deployment guidance for Purista.',
		)

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: createProtocolBuffer(baseServiceContext).protocol,
			resources: {
				skills: new FileSkillResource({ roots: [skillRoot] }),
			},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest: {
				...manifest,
				skills: {
					resourceName: 'skills',
					names: ['purista'],
				},
			},
		})

		await expect(
			context.ai.skills.selectReferences({
				skillName: 'purista',
				queries: ['architecture service boundaries builders contracts'],
				limit: 2,
				relativePathPrefixes: ['references/'],
			}),
		).resolves.toEqual([
			expect.objectContaining({
				relativePath: 'references/02-spec-to-architecture.md',
			}),
			expect.objectContaining({
				relativePath: 'references/03-service-builders-and-contracts.md',
			}),
		])
	})
})
