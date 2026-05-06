import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { type EventBridge, HandledError, StatusCode } from '@purista/core'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import type { ConversationStore } from '../memory/conversationStore.js'
import { InMemoryConversationStore } from '../memory/conversationStore.js'
import { createArtifactFrame, createProtocolEnvelope } from '../protocol/helpers.js'
import { buildTaskChunkArtifactId, PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID } from '../protocol/taskArtifacts.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import { FileSkillResource } from '../skills/fileSystem.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createAgentHandlerContext, createProtocolBuffer } from './context.js'
import { normalizeAgentInvocationFinalResult } from './terminalResult.js'

const createLoggerMock = () => {
	const logger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
		trace: vi.fn(),
		fatal: vi.fn(),
		getChildLogger: vi.fn(),
	}
	logger.getChildLogger.mockReturnValue(logger)
	return logger
}

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
}

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
					version: 1 as const,
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
	logger: createLoggerMock(),
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
} as unknown as import('./context.js').ProtocolContext

const baseEventBridge = {
	instanceId: 'bridge-1',
	invoke: vi.fn(),
	openStream: vi.fn(),
} as EventBridge & {
	invoke: ReturnType<typeof vi.fn>
	openStream: ReturnType<typeof vi.fn>
}

const manifest: AgentManifest = {
	agentName: 'supportAgent',
	serviceVersion: '1',
	eventBridge: 'default',
	allowedTools: [{ serviceName: 'ToolService', serviceVersion: '1', commandName: 'createTicket' }],
	allowedAgents: [
		{ agentName: 'childAgent', serviceVersion: '1' },
		{ agentName: 'typedAgent', serviceVersion: '1' },
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

	it('provisions sandbox access through the runtime helper using the manifest policy', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const ensureSandbox = vi.fn().mockResolvedValue({
			sandboxId: 'sb-runtime-1',
			subject: {
				tenantId: 'tenant-1',
				principalId: 'principal-1',
				projectId: 'project-1',
			},
			scope: { kind: 'shared-project-user' as const },
			status: 'ready' as const,
			created: false,
		})
		const adapter = {
			executeCommand: vi.fn(),
			readFile: vi.fn(),
			writeFiles: vi.fn(),
		}
		const createAdapter = vi.fn().mockReturnValue(adapter)
		const resolveSubject = vi.fn().mockResolvedValue({
			tenantId: 'tenant-1',
			principalId: 'principal-1',
			projectId: 'project-1',
		})

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest: {
				...manifest,
				sandbox: {
					mode: 'optional',
					scope: 'shared-project-user',
				},
			},
			sandbox: {
				provider: {
					ensureSandbox,
					createAdapter,
				},
				resolveSubject,
			},
		})

		const descriptor = await context.runtime.sandbox.ensure()
		expect(descriptor.sandboxId).toBe('sb-runtime-1')
		expect(resolveSubject).toHaveBeenCalledOnce()
		expect(ensureSandbox).toHaveBeenCalledWith({
			subject: {
				tenantId: 'tenant-1',
				principalId: 'principal-1',
				projectId: 'project-1',
			},
			scope: { kind: 'shared-project-user' },
			gitConfig: undefined,
		})

		const resolvedAdapter = await context.runtime.sandbox.adapter()
		expect(resolvedAdapter).toBe(adapter)
		expect(createAdapter).toHaveBeenCalledWith({ descriptor })
	})

	it('allows explicit custom sandbox scope overrides even without a manifest sandbox policy', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const ensureSandbox = vi.fn().mockResolvedValue({
			sandboxId: 'sb-runtime-2',
			subject: {
				tenantId: 'tenant-1',
				principalId: 'principal-1',
				projectId: 'project-1',
			},
			scope: { kind: 'custom' as const, key: 'review-123' },
			status: 'ready' as const,
			created: true,
		})

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
			sandbox: {
				provider: {
					ensureSandbox,
					createAdapter: vi.fn().mockReturnValue({
						executeCommand: vi.fn(),
						readFile: vi.fn(),
						writeFiles: vi.fn(),
					}),
				},
				resolveSubject: async () => ({
					tenantId: 'tenant-1',
					principalId: 'principal-1',
					projectId: 'project-1',
				}),
			},
		})

		const descriptor = await context.runtime.sandbox.ensure({
			scope: {
				kind: 'custom',
				key: 'review-123',
			},
		})

		expect(descriptor.scope).toEqual({ kind: 'custom', key: 'review-123' })
		expect(ensureSandbox).toHaveBeenCalledWith({
			subject: {
				tenantId: 'tenant-1',
				principalId: 'principal-1',
				projectId: 'project-1',
			},
			scope: { kind: 'custom', key: 'review-123' },
			gitConfig: undefined,
		})
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
			scope: { projectId: 'demo' },
		})
		await run.plan([{ id: 'step-1', title: 'Collect facts' }])
		const persisted = await context.memory.run.get({ scope: { projectId: 'demo' } })

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
		const error = new Error('boom')
		error.cause = { requestBodyValues: { prompt: 'secret prompt' } }
		buffer.protocol.emitError(error)
		const envelopes = buffer.toEnvelopes()
		expect(envelopes[0]?.frame.kind).toBe('error')
		if (envelopes[0]?.frame.kind === 'error') {
			expect(envelopes[0].frame.details).toEqual({
				kind: 'provider',
				statusCode: undefined,
				provider: undefined,
				providerCode: undefined,
				requestId: undefined,
				retryable: undefined,
				attempts: undefined,
				reason: undefined,
			})
			expect(JSON.stringify(envelopes[0].frame.details)).not.toContain('secret prompt')
			expect(JSON.stringify(envelopes[0].frame.details)).not.toContain('stack')
		}
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

		expect(context.invoke.tools.invoke.ToolService).toBeDefined()
		expect(context.invoke.tools.invoke.Unknown).toBeUndefined()
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
			serviceVersion: '1',
			payload: childPayload('go'),
		})
		expect(envelopes).toHaveLength(1)

		const childAgentApi = context.invoke.agents.invoke.childAgent?.['1']
		expect(childAgentApi).toBeDefined()
		if (!childAgentApi || typeof childAgentApi.call !== 'function') {
			throw new Error('expected child agent api to be defined')
		}
		const chainedInvocation = childAgentApi.call(childPayload('go-again'))
		const chainedEnvelopes = normalizeAgentInvocationFinalResult({
			result: await chainedInvocation.final(),
			agentName: 'childAgent',
			serviceVersion: '1',
		}).envelopes
		expect(chainedEnvelopes).toHaveLength(1)

		const text = await context.invoke.agents.runText({
			agentName: 'childAgent',
			serviceVersion: '1',
			payload: childPayload('go'),
		})
		expect(text).toBe('child result')

		baseEventBridge.invoke.mockResolvedValueOnce([
			createProtocolEnvelope({
				conversationId: 'sub-4',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: '{"ok":true}', final: true },
			}),
			createProtocolEnvelope({
				conversationId: 'sub-4',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: createArtifactFrame({
					artifactId: 'output',
					phase: 'final',
					content: { ok: true },
					mimeType: 'application/json',
					lastChunk: true,
				}),
			}),
		])
		const obj = await context.invoke.agents.runObject<{ ok: boolean }>({
			agentName: 'childAgent',
			serviceVersion: '1',
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

	it('provides a composable stream pipeline for child-agent invocation', async () => {
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

		const tapped: string[] = []
		const written: AgentProtocolEnvelope[] = []
		const pipeline = context.invoke.agents
			.stream({
				agentName: 'childAgent',
				serviceVersion: '1',
				payload: childPayload('pipeline'),
			})
			.tap(envelope => {
				if (envelope.frame.kind === 'message') {
					tapped.push(String(envelope.frame.content))
				}
			})
			.forwardToCurrentStream(true)

		const collected = await pipeline.toWriter({
			write: async envelope => {
				written.push(envelope)
			},
		})

		expect(tapped).toEqual(['child result'])
		expect(written).toHaveLength(1)
		expect(collected).toHaveLength(1)
		expect(buffer.toEnvelopes()).toHaveLength(3)
		const forwarded = buffer.toEnvelopes().filter(envelope => envelope.actor?.agent === 'childAgent')
		expect(forwarded).toHaveLength(1)
		expect(forwarded[0]?.actor).toMatchObject({
			service: 'child',
			version: '1',
			agent: 'childAgent',
		})
	})

	it('validates runObject output against declared canInvokeAgent outputSchema', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValueOnce([
			createProtocolEnvelope({
				conversationId: 'sub-schema-1',
				actor: { service: 'child', version: '1', agent: 'typedAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'typed result', final: true },
			}),
			createProtocolEnvelope({
				conversationId: 'sub-schema-1',
				actor: { service: 'child', version: '1', agent: 'typedAgent', instanceId: 'i1' },
				frame: createArtifactFrame({
					artifactId: 'output',
					phase: 'final',
					content: { ok: true },
					mimeType: 'application/json',
					lastChunk: true,
				}),
			}),
		])
		const outputSchema = {
			'~standard': {
				vendor: 'test',
				version: 1 as const,
				validate: async (value: unknown) =>
					typeof (value as { ok?: unknown })?.ok === 'boolean'
						? { value }
						: { issues: [{ message: 'ok must be boolean', path: ['ok'] }] },
			},
		}
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
			manifest: {
				...manifest,
				allowedAgents: [
					{ agentName: 'childAgent', serviceVersion: '1' },
					{ agentName: 'typedAgent', serviceVersion: '1', outputSchema },
				],
			},
		})

		const obj = await context.invoke.agents.runObject<{ ok: boolean }>({
			agentName: 'typedAgent',
			serviceVersion: '1',
			payload: childPayload('go'),
		})
		expect(obj).toEqual({ ok: true })
	})

	it('fails runObject when declared outputSchema validation fails', async () => {
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValueOnce([
			createProtocolEnvelope({
				conversationId: 'sub-schema-2',
				actor: { service: 'child', version: '1', agent: 'typedAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'wrong shape', final: true },
			}),
			createProtocolEnvelope({
				conversationId: 'sub-schema-2',
				actor: { service: 'child', version: '1', agent: 'typedAgent', instanceId: 'i1' },
				frame: createArtifactFrame({
					artifactId: 'output',
					phase: 'final',
					content: { status: 'wrong' },
					mimeType: 'application/json',
					lastChunk: true,
				}),
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
			manifest: {
				...manifest,
				allowedAgents: [
					{ agentName: 'childAgent', serviceVersion: '1' },
					{
						agentName: 'typedAgent',
						serviceVersion: '1',
						outputSchema: {
							'~standard': {
								vendor: 'test',
								version: 1 as const,
								validate: async (value: unknown) =>
									typeof (value as { ok?: unknown })?.ok === 'boolean'
										? { value }
										: { issues: [{ message: 'ok must be boolean', path: ['ok'] }] },
							},
						},
					},
				],
			},
		})

		await expect(
			context.invoke.agents.runObject({
				agentName: 'typedAgent',
				serviceVersion: '1',
				payload: childPayload('go'),
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.BadGateway,
		})
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
				invokeAgent: undefined as never,
			} as typeof baseServiceContext,
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
			serviceVersion: '1',
			payload: childPayload('queue child'),
		})
		expect(text).toBe('direct child result')

		const childAgentApi = context.invoke.agents.invoke.childAgent?.['1']
		expect(childAgentApi).toBeDefined()
		if (!childAgentApi || typeof childAgentApi.call !== 'function') {
			throw new Error('expected child agent api to be defined')
		}

		const chainedEnvelopes = normalizeAgentInvocationFinalResult({
			result: await childAgentApi.call(childPayload('queue child chained')).final(),
			agentName: 'childAgent',
			serviceVersion: '1',
		}).envelopes
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
				serviceVersion: '1',
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
				serviceVersion: '1',
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
		baseEventBridge.openStream.mockResolvedValue({
			sessionId: 'stream-forward-1',
			cancel: vi.fn(),
			async *[Symbol.asyncIterator]() {
				yield {
					payload: {
						frameType: 'chunk',
						sequence: 1,
						chunk: createProtocolEnvelope({
							conversationId: 'sub-forward',
							actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
							frame: { kind: 'message', role: 'assistant', content: 'hello ', partial: true, final: false },
						}),
					},
				}
				yield {
					payload: {
						frameType: 'chunk',
						sequence: 2,
						chunk: createProtocolEnvelope({
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
					},
				}
				yield {
					payload: {
						frameType: 'chunk',
						sequence: 3,
						chunk: createProtocolEnvelope({
							conversationId: 'sub-forward',
							actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
							frame: { kind: 'message', role: 'assistant', content: 'world', final: true },
						}),
					},
				}
				yield { payload: { frameType: 'complete', sequence: 4, final: [] } }
			},
		})

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
			serviceVersion: '1',
			payload: childPayload('go'),
			forwardToCurrentStream: true,
			emitInvocationToolEvents: false,
		})

		const envelopes = buffer.toEnvelopes()
		const frames = envelopes.map(envelope => envelope.frame)
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
		expect(envelopes[0]?.actor).toMatchObject({
			service: 'child',
			version: '1',
			agent: 'childAgent',
		})
		expect(envelopes[0]?.conversationId).toBe('sub-forward')
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
			serviceVersion: '1',
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
		baseEventBridge.openStream.mockResolvedValue({
			sessionId: 'stream-forward-defaults',
			cancel: vi.fn(),
			async *[Symbol.asyncIterator]() {
				yield {
					payload: {
						frameType: 'chunk',
						sequence: 1,
						chunk: createProtocolEnvelope({
							conversationId: 'sub-forward-defaults',
							actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
							frame: { kind: 'tool', toolName: 'readSpec', status: 'invoked', input: { path: 'specs/spec.md' } },
						}),
					},
				}
				yield {
					payload: {
						frameType: 'chunk',
						sequence: 2,
						chunk: createProtocolEnvelope({
							conversationId: 'sub-forward-defaults',
							actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
							frame: { kind: 'message', role: 'assistant', content: 'forwarded text', final: true },
						}),
					},
				}
				yield { payload: { frameType: 'complete', sequence: 3, final: [] } }
			},
		})

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
			serviceVersion: '1',
			payload: childPayload('go'),
		})

		const envelopes = buffer.toEnvelopes()
		const frames = envelopes.map(envelope => envelope.frame)
		const assistantFrames = frames.filter(
			(frame): frame is Extract<(typeof frames)[number], { kind: 'message' }> =>
				frame.kind === 'message' && frame.role === 'assistant',
		)
		const toolFrames = frames.filter(frame => frame.kind === 'tool')

		expect(assistantFrames.map(frame => frame.content)).toEqual(['forwarded text'])
		expect(toolFrames).toHaveLength(0)
		expect(envelopes[0]?.actor).toMatchObject({
			service: 'child',
			version: '1',
			agent: 'childAgent',
		})
		expect(envelopes[0]?.conversationId).toBe('sub-forward-defaults')
	})

	it('fails fast for forward() when stream transport is unavailable', async () => {
		baseEventBridge.openStream.mockClear()
		baseEventBridge.invoke.mockClear()
		baseEventBridge.openStream.mockRejectedValue(new Error('does not support streams'))
		baseEventBridge.invoke.mockResolvedValue([
			createProtocolEnvelope({
				conversationId: 'sub-forward-fallback-ignored',
				actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
				frame: { kind: 'message', role: 'assistant', content: 'fallback', final: true },
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
			context.invoke.agents.forward({
				agentName: 'childAgent',
				serviceVersion: '1',
				payload: childPayload('go'),
			}),
		).rejects.toThrow('does not support streams')
		expect(baseEventBridge.invoke).not.toHaveBeenCalled()
	})

	it('can forward nested tool events when requested explicitly', async () => {
		baseEventBridge.openStream.mockResolvedValue({
			sessionId: 'stream-forward-tools',
			cancel: vi.fn(),
			async *[Symbol.asyncIterator]() {
				yield {
					payload: {
						frameType: 'chunk',
						sequence: 1,
						chunk: createProtocolEnvelope({
							conversationId: 'sub-forward-tool-events',
							actor: { service: 'child', version: '1', agent: 'childAgent', instanceId: 'i1' },
							frame: { kind: 'tool', toolName: 'readSpec', status: 'invoked', input: { path: 'specs/spec.md' } },
						}),
					},
				}
				yield { payload: { frameType: 'complete', sequence: 2, final: [] } }
			},
		})

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
			serviceVersion: '1',
			payload: childPayload('go'),
			forward: {
				toolEvents: true,
			},
		})

		const envelopes = buffer.toEnvelopes()
		const toolFrames = envelopes.map(envelope => envelope.frame).filter(frame => frame.kind === 'tool')
		expect(toolFrames).toHaveLength(1)
		expect(toolFrames[0]).toMatchObject({
			toolName: 'readSpec',
			status: 'invoked',
		})
		expect(envelopes[0]?.actor).toMatchObject({
			service: 'child',
			version: '1',
			agent: 'childAgent',
		})
	})

	it('forwards structured artifact payloads such as run-state by default', async () => {
		baseEventBridge.openStream.mockResolvedValue({
			sessionId: 'stream-forward-run-state',
			cancel: vi.fn(),
			async *[Symbol.asyncIterator]() {
				yield {
					payload: {
						frameType: 'chunk',
						sequence: 1,
						chunk: createProtocolEnvelope({
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
					},
				}
				yield { payload: { frameType: 'complete', sequence: 2, final: [] } }
			},
		})

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
			serviceVersion: '1',
			payload: childPayload('go'),
		})

		const envelopes = buffer.toEnvelopes()
		const artifactFrames = envelopes.map(envelope => envelope.frame).filter(frame => frame.kind === 'artifact')

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
		expect(envelopes[0]?.actor).toMatchObject({
			service: 'child',
			version: '1',
			agent: 'childAgent',
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
				serviceVersion: '1',
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
			serviceVersion: '1',
			payload: { prompt: 'go' },
			failOnErrorFrame: false,
		})
		expect(envelopes).toHaveLength(1)
		expect(envelopes[0]?.frame.kind).toBe('error')
	})

	it('fails runObject when the invoked agent does not emit an output artifact', async () => {
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
				serviceVersion: '1',
				payload: { prompt: 'go' },
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.BadGateway,
		})
	})

	it('sends stream chunks and finals', async () => {
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

		context.io.stream.sendDelta('chunk')
		context.io.stream.sendFinal('final')

		const messageFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'message')
		expect(messageFrames).toHaveLength(2)
		if (messageFrames[0]?.kind === 'message' && messageFrames[1]?.kind === 'message') {
			expect(messageFrames[0].content).toBe('chunk')
			expect(messageFrames[0].partial).toBe(true)
			expect(messageFrames[1].content).toBe('final')
			expect(messageFrames[1].final).toBe(true)
		}
	})

	it('provides a high-level ai.streamObject helper that publishes sections and returns the final object', async () => {
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
					name: 'object-stream-model',
					capabilities: { object: true, 'object-stream': true },
					streamObject: ((_request: any) => ({
						async final() {
							return {
								data: { urgency: 'high', explanation: 'final explanation', nextSteps: 'page on-call' },
								text: 'final object',
							}
						},
						async *[Symbol.asyncIterator]() {
							yield { type: 'status' as const, message: 'thinking' }
							yield { type: 'section' as const, section: 'urgency', content: 'high' }
							yield { type: 'section' as const, section: 'explanation', content: 'final explanation' }
							yield {
								type: 'final-object' as const,
								data: { urgency: 'high', explanation: 'final explanation', nextSteps: 'page on-call' },
								text: 'final object',
							}
						},
					})) as NonNullable<ModelProvider['streamObject']>,
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const result = await context.ai.streamObject({
			model: 'primary',
			prompt: 'triage this',
			publishToCurrentStream: {
				taskId: 'classify-urgency',
				artifactIdPrefix: 'triage',
				renderSectionDelta: ({ section, content }) => `${section}:${String(content)}`,
			},
		})

		expect(result).toEqual({
			urgency: 'high',
			explanation: 'final explanation',
			nextSteps: 'page on-call',
		})

		const frames = buffer.toEnvelopes().map(envelope => envelope.frame)
		expect(frames.some(frame => frame.kind === 'artifact' && frame.artifactId === 'reasoning')).toBe(true)
		expect(frames.some(frame => frame.kind === 'artifact' && frame.artifactId === 'triage-urgency')).toBe(true)
		expect(
			frames.some(
				frame => frame.kind === 'artifact' && frame.artifactId === buildTaskChunkArtifactId('classify-urgency'),
			),
		).toBe(true)
		expect(
			frames.some(
				frame =>
					frame.kind === 'message' && frame.role === 'assistant' && String(frame.content).includes('urgency:high'),
			),
		).toBe(true)
	})

	it('streams text deltas to the current protocol stream from true provider streaming', async () => {
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
					name: 'text-stream-model',
					capabilities: { text: true, 'text-stream': true },
					streamText: ((_request: any) => ({
						async final() {
							return {
								output: 'hello world',
								reasoningText: 'thinking',
							}
						},
						async *[Symbol.asyncIterator]() {
							yield { type: 'reasoning-delta' as const, reasoningDelta: 'thinking' }
							yield { type: 'text-delta' as const, textDelta: 'hello ' }
							yield { type: 'text-delta' as const, textDelta: 'world' }
						},
					})) as NonNullable<ModelProvider['streamText']>,
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const result = await context.ai.streamText({
			model: 'primary',
			prompt: 'say hello',
			publishToCurrentStream: {
				taskId: 'draft-answer',
			},
		})

		expect(result).toBe('hello world')

		const frames = buffer.toEnvelopes().map(envelope => envelope.frame)
		expect(frames.some(frame => frame.kind === 'artifact' && frame.artifactId === 'reasoning')).toBe(true)
		expect(
			frames.some(frame => frame.kind === 'artifact' && frame.artifactId === buildTaskChunkArtifactId('draft-answer')),
		).toBe(true)
		expect(
			frames.some(
				frame => frame.kind === 'message' && frame.role === 'assistant' && String(frame.content).includes('hello '),
			),
		).toBe(true)
		expect(
			frames.some(
				frame => frame.kind === 'message' && frame.role === 'assistant' && String(frame.content).includes('world'),
			),
		).toBe(true)
	})

	it('provides worker and delegate based planning helpers for sequential autonomous execution', async () => {
		const stateStore = new Map<string, unknown>()
		const buffer = createProtocolBuffer(baseServiceContext)
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
			payload: { prompt: 'plan this support request' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {
				primary: {
					name: 'planner-model',
					capabilities: { text: true, object: true },
					generateText: (async request => `EXECUTOR:${request.prompt}`) as NonNullable<ModelProvider['generateText']>,
					generateObject: (async () => ({
						data: {
							title: 'Demo plan',
							summary: 'Execute the planned steps sequentially.',
							tasks: [{ id: 'draft-reply', title: 'Draft the reply', instruction: 'Write the final support reply.' }],
						},
						text: 'plan',
					})) as NonNullable<ModelProvider['generateObject']>,
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const worker = context.ai.createModelExecutor({
			model: 'primary',
		})

		const resultPlan = await context.plan.generate({
			model: 'primary',
			worker,
		})

		const result = await context.plan.execute(resultPlan)
		expectTypeOf(result.results).toEqualTypeOf<Record<string, string>>()

		expect(result.plan.tasks.map(task => task.id)).toEqual(['draft-reply'])
		expect(result.results['draft-reply']).toBe('EXECUTOR:Write the final support reply.')
		const frames = buffer.toEnvelopes().map(envelope => envelope.frame)
		expect(frames.some(frame => frame.kind === 'artifact' && frame.artifactId === 'purista-ai:plan')).toBe(true)
		expect(frames.some(frame => frame.kind === 'artifact' && frame.artifactId === 'purista-ai:task:draft-reply')).toBe(
			true,
		)
		expect(
			frames.some(frame => frame.kind === 'artifact' && frame.artifactId === 'purista-ai:task-chunk:draft-reply'),
		).toBe(true)
		const completedTaskIndex = frames.findIndex(
			frame =>
				frame.kind === 'artifact' &&
				frame.artifactId === 'purista-ai:task:draft-reply' &&
				typeof frame.content === 'object' &&
				frame.content !== null &&
				'status' in frame.content &&
				(frame.content as { status?: unknown }).status === 'completed',
		)
		const finalChunkIndex = frames.findIndex(
			frame =>
				frame.kind === 'artifact' &&
				frame.artifactId === 'purista-ai:task-chunk:draft-reply' &&
				frame.phase === 'final',
		)
		expect(completedTaskIndex).toBeGreaterThanOrEqual(0)
		expect(finalChunkIndex).toBeGreaterThanOrEqual(0)
		expect(completedTaskIndex).toBeLessThan(finalChunkIndex)
	})

	it('treats default-worker planner aliases as the default worker', async () => {
		const stateStore = new Map<string, unknown>()
		const buffer = createProtocolBuffer(baseServiceContext)
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
			payload: { prompt: 'plan this implementation workflow' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {
				primary: {
					name: 'planner-model',
					capabilities: { text: true, object: true },
					generateText: (async request => `EXECUTOR:${request.prompt}`) as NonNullable<ModelProvider['generateText']>,
					generateObject: (async () => ({
						data: {
							title: 'Alias plan',
							tasks: [
								{
									id: 'default-step',
									title: 'Do the core work',
									instruction: 'Implement the primary task.',
									delegate: '/default-worker',
								},
							],
						},
						text: 'plan',
					})) as NonNullable<ModelProvider['generateObject']>,
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const worker = context.ai.createModelExecutor({
			model: 'primary',
		})

		const plan = await context.plan.generate({
			model: 'primary',
			worker,
		})
		const result = await context.plan.execute(plan)

		expect(plan.tasks[0]?.delegate).toBeUndefined()
		expect(result.results['default-step']).toBe('EXECUTOR:Implement the primary task.')
	})

	it('filters delegated agent forwarding according to forwardToCurrentStream options', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'delegate this task' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const delegatedEnvelopes = [
			createProtocolEnvelope({
				conversationId: 'delegated-1',
				actor: { service: 'child', version: '1', agent: 'researchAgent', instanceId: 'i1' },
				frame: createArtifactFrame({
					artifactId: PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID,
					phase: 'chunk',
					content: {
						type: 'purista-ai-workflow-stage',
						name: 'child-finalization',
						status: 'running',
						summary: 'Synthesizing child result.',
					},
					mimeType: 'application/json',
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'delegated-1',
				actor: { service: 'child', version: '1', agent: 'researchAgent', instanceId: 'i1' },
				frame: {
					kind: 'tool',
					toolName: 'desk.1.fetchWebsite',
					status: 'success',
					input: { url: 'https://purista.dev/handbook' },
					output: { ok: true },
				},
			}),
			createProtocolEnvelope({
				conversationId: 'delegated-1',
				actor: { service: 'child', version: '1', agent: 'researchAgent', instanceId: 'i1' },
				frame: {
					kind: 'message',
					role: 'assistant',
					content: 'Delegated assistant text should stay hidden.',
					final: true,
				},
			}),
			createProtocolEnvelope({
				conversationId: 'delegated-1',
				actor: { service: 'child', version: '1', agent: 'researchAgent', instanceId: 'i1' },
				frame: createArtifactFrame({
					artifactId: 'output',
					phase: 'final',
					content: { answer: 'child output should stay hidden' },
					mimeType: 'application/json',
				}),
			}),
		]

		const executor = context.ai.createAgentExecutorFromInvoke(
			() => ({
				async *[Symbol.asyncIterator]() {},
				async final() {
					return delegatedEnvelopes
				},
			}),
			{
				id: 'research-agent',
				description: 'Delegated research agent',
				resultMode: 'text',
				forwardToCurrentStream: {
					assistant: false,
					artifacts: {
						workflow: true,
						output: false,
					},
					toolEvents: true,
				},
			},
		)

		const delegatedText = await executor.call({
			context,
			request: 'delegate this task',
			task: {
				id: 'task-1',
				title: 'Research',
				instruction: 'Fetch the handbook and summarize it.',
				order: 0,
				status: 'pending',
				kind: 'agent',
			},
			run: {} as never,
			results: {},
		})

		expect(delegatedText).toBe('Delegated assistant text should stay hidden.')
		const frames = buffer.toEnvelopes().map(envelope => envelope.frame)
		expect(
			frames.some(frame => frame.kind === 'artifact' && frame.artifactId === PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID),
		).toBe(true)
		expect(frames.some(frame => frame.kind === 'tool' && frame.toolName === 'desk.1.fetchWebsite')).toBe(true)
		expect(
			frames.some(
				frame =>
					frame.kind === 'message' &&
					frame.role === 'assistant' &&
					String(frame.content).includes('Delegated assistant text should stay hidden.'),
			),
		).toBe(false)
		expect(frames.some(frame => frame.kind === 'artifact' && frame.artifactId === 'output')).toBe(false)
	})

	it('falls back to output.message when delegated text runs do not expose a final assistant message', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'delegate this task' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		const executor = context.ai.createAgentExecutorFromInvoke(
			() => ({
				async *[Symbol.asyncIterator]() {},
				async final() {
					return [
						createProtocolEnvelope({
							conversationId: 'delegated-1',
							actor: { service: 'child', version: '1', agent: 'researchAgent', instanceId: 'i1' },
							frame: createArtifactFrame({
								artifactId: 'output',
								phase: 'final',
								content: { message: 'output-derived summary' },
								mimeType: 'application/json',
							}),
						}),
					]
				},
			}),
			{
				id: 'research-agent',
				description: 'Delegated research agent',
				resultMode: 'text',
			},
		)

		const delegatedText = await executor.call({
			context,
			request: 'delegate this task',
			task: {
				id: 'task-1',
				title: 'Research',
				instruction: 'Fetch the handbook and summarize it.',
				order: 0,
				status: 'pending',
				kind: 'agent',
			},
			run: {} as never,
			results: {},
		})

		expect(delegatedText).toBe('output-derived summary')
	})

	it('emits workflow stage artifacts through context.io.workflow.emitStage', async () => {
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'finalize' },
			parameter: {},
			conversationStore: new InMemoryConversationStore(),
			protocol: buffer.protocol,
			resources: {},
			models: {},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		context.io.workflow.emitStage({
			name: 'final-answer',
			runId: 'run-1',
			status: 'running',
			summary: 'Synthesizing final answer.',
		})

		const workflowArtifact = buffer
			.toEnvelopes()
			.find(
				envelope =>
					envelope.frame.kind === 'artifact' && envelope.frame.artifactId === PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID,
			)

		expect(workflowArtifact?.frame).toMatchObject({
			kind: 'artifact',
			artifactId: PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID,
			content: {
				type: 'purista-ai-workflow-stage',
				name: 'final-answer',
				runId: 'run-1',
				status: 'running',
				summary: 'Synthesizing final answer.',
			},
		})
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

		const reply = await context.ai.reply({
			type: 'model',
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

	it('provides a conversation-aware ai.replyObject helper', async () => {
		const conversationStore = new InMemoryConversationStore()
		const buffer = createProtocolBuffer(baseServiceContext)
		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore,
			protocol: buffer.protocol,
			resources: {},
			models: {
				primary: {
					name: 'reply-object-model',
					capabilities: { object: true, text: true },
					generateObject: (async request => ({
						data: {
							message: request.prompt.includes('Conversation history:') ? 'history-aware reply' : 'plain reply',
							mode: 'summary',
						},
						text: 'object',
					})) as NonNullable<ModelProvider['generateObject']>,
				},
			},
			embeddings: {},
			rerankers: {},
			manifest,
		})

		await context.memory.conversation.addUser('Prior user message', { sessionId: 'session-1' })
		const result = await context.ai.replyObject({
			model: 'primary',
			schema: z.object({
				message: z.string(),
				mode: z.string(),
			}),
			prompt: 'Summarize the conversation.',
			sessionId: 'session-1',
			includeConversationHistory: true,
			persistAssistantMessage: true,
			selectMessage: output => output.message,
			assistantMetadata: { source: 'test' },
		})

		expect(result).toEqual({
			message: 'history-aware reply',
			mode: 'summary',
		})
		expect(await context.memory.conversation.buildPromptInput({ sessionId: 'session-1' })).toContain(
			'assistant: history-aware reply',
		)
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

		const reply = await context.ai.reply({
			type: 'model',
			model: 'primary',
			prompt: 'Draft internally',
			stream: false,
		})

		expect(reply).toBe('Internal draft')
		const messageFrames = buffer
			.toEnvelopes()
			.map(envelope => envelope.frame)
			.filter(frame => frame.kind === 'message')
		expect(messageFrames).toHaveLength(0)
	})

	it('fails public assistant replies when the selected model does not support streamed text', () => {
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

		expect(() =>
			context.ai.reply({
				type: 'model',
				model: 'primary',
				prompt: 'Say hello',
			}),
		).toThrow()
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
			context.ai.reply({
				type: 'model',
				model: 'primary',
				prompt: 'Say hello',
			}),
		).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
			message: 'Model primary generated an empty public reply',
		})
	})

	it('fails internal assistant composition when the selected model does not support text', () => {
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

		expect(() =>
			context.ai.reply({
				type: 'model',
				model: 'primary',
				prompt: 'Say hello',
			}),
		).toThrow()
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

		const reply = context.ai.reply({
			type: 'text',
			content: 'First sentence. Second sentence.\n\nFinal paragraph.',
		})

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
		const conversationStore: ConversationStore = {
			load: vi.fn().mockResolvedValue(undefined),
			save: vi.fn().mockResolvedValue(undefined),
			delete: vi.fn().mockResolvedValue(undefined),
		}

		const context = createAgentHandlerContext({
			serviceContext: baseServiceContext,
			eventBridge: baseEventBridge,
			payload: { prompt: 'hello' },
			parameter: {},
			conversationStore,
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
			serviceVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		await context.memory.session.load('s1')
		expect(conversationStore.load).toHaveBeenCalledWith('s1', {
			agentName: 'supportAgent',
			serviceVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		await context.memory.session.delete('s1')
		expect(conversationStore.delete).toHaveBeenCalledWith('s1', {
			agentName: 'supportAgent',
			serviceVersion: '1',
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
			} as typeof baseServiceContext,
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
