import type { CommandFunctionContext, Logger } from '@purista/core'
import { HandledError, StatusCode } from '@purista/core'

import type { KnowledgeAdapter, KnowledgeDocument } from '../knowledge/adapters/inMemoryAdapter.js'
import type { SessionRecord, SessionRecordData, SessionStore } from '../memory/sessionStore.js'
import {
	createArtifactFrame,
	createEnvelopeFromContext,
	createErrorFrame,
	createMessageFrame,
	createTelemetryFrame,
	createToolEventFrame,
} from '../protocol/index.js'
import type { AgentProtocolEnvelope, AgentProtocolFrame } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentManifest, AllowedToolDefinition } from '../types/AgentManifest.js'
import { type ConversationHelpers, createConversationHelpers } from './conversation.js'
import { createScopedSessionId, resolveBaseSessionId } from './sessionIdentity.js'

type ProtocolFrameEntry = {
	frame: AgentProtocolFrame
}

type ProtocolEmitter = {
	emitMessage(
		content: string | { content: string; summary?: string; partial?: boolean; final?: boolean },
		options?: { summary?: string; partial?: boolean; final?: boolean },
	): void
	emitArtifact(input: {
		artifactId: string
		content: string | Record<string, unknown>
		mimeType?: string
		sequence?: number
		total?: number
		final?: boolean
	}): void
	emitTelemetry(metrics: {
		durationMs?: number
		waitTimeMs?: number
		poolId?: string
		provider?: string
		usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number; costUsd?: number }
	}): void
	emitToolEvent(event: {
		toolName: string
		status: 'invoked' | 'success' | 'error'
		input?: unknown
		output?: unknown
		message?: string
		errorCode?: string
	}): void
	emitError(error: unknown, overrides?: { code?: string; handled?: boolean }): void
	has(kind: AgentProtocolFrame['kind']): boolean
}

export type AgentProtocolBuffer = {
	protocol: ProtocolEmitter
	toEnvelopes(): AgentProtocolEnvelope[]
	frames(): AgentProtocolFrame[]
}

export type AgentStreamEmitter = {
	sendChunk(content: string): void
	sendFinal(content: string, options?: { summary?: string }): void
	sendArtifact(input: {
		artifactId: string
		content: string | Record<string, unknown>
		mimeType?: string
		sequence?: number
		total?: number
		final?: boolean
	}): void
	sendError(error: unknown, overrides?: { code?: string; handled?: boolean }): void
}

const createStreamEmitter = (protocol: ProtocolEmitter): AgentStreamEmitter => ({
	sendChunk(content) {
		protocol.emitMessage({ content, partial: true, final: false })
	},
	sendFinal(content, options) {
		protocol.emitMessage({ content, summary: options?.summary, partial: false, final: true })
	},
	sendArtifact(input) {
		protocol.emitArtifact(input)
	},
	sendError(error, overrides) {
		protocol.emitError(error, overrides)
	},
})

const stringifyResult = (result: unknown): string => {
	if (typeof result === 'string') {
		return result
	}
	if (typeof result === 'number' || typeof result === 'boolean') {
		return String(result)
	}
	if (result === undefined || result === null) {
		return ''
	}
	try {
		return JSON.stringify(result)
	} catch {
		return String(result)
	}
}

export const createProtocolBuffer = (context: CommandFunctionContext): AgentProtocolBuffer => {
	const frames: ProtocolFrameEntry[] = []

	const protocol: ProtocolEmitter = {
		emitMessage(content, options) {
			const message =
				typeof content === 'object' && content !== null && 'content' in content
					? {
							content: stringifyResult(content.content),
							summary: content.summary ?? options?.summary,
							partial: content.partial ?? options?.partial,
							final: content.final ?? options?.final,
						}
					: {
							content: stringifyResult(content),
							summary: options?.summary,
							partial: options?.partial,
							final: options?.final,
						}
			frames.push({
				frame: createMessageFrame({
					role: 'assistant',
					content: message.content,
					summary: message.summary,
					partial: message.partial,
					final: message.final,
				}),
			})
		},
		emitArtifact(input) {
			frames.push({
				frame: createArtifactFrame({
					artifactId: input.artifactId,
					phase: input.final ? 'final' : 'chunk',
					sequence: input.sequence,
					total: input.total,
					content: input.content,
					mimeType: input.mimeType,
					lastChunk: input.final,
				}),
			})
		},
		emitTelemetry(metrics) {
			frames.push({
				frame: createTelemetryFrame({
					durationMs: metrics.durationMs,
					waitTimeMs: metrics.waitTimeMs,
					poolId: metrics.poolId,
					provider: metrics.provider,
					usage: metrics.usage
						? {
								promptTokens: metrics.usage.promptTokens,
								completionTokens: metrics.usage.completionTokens,
								totalTokens: metrics.usage.totalTokens,
								costUsd: metrics.usage.costUsd,
							}
						: undefined,
				}),
			})
		},
		emitToolEvent(event) {
			frames.push({
				frame: createToolEventFrame({
					toolName: event.toolName,
					status: event.status,
					args: event.input,
					result: event.output,
					message: event.message,
					errorCode: event.errorCode,
				}),
			})
		},
		emitError(error, overrides) {
			const err =
				error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Agent error', { cause: error })
			frames.push({
				frame: createErrorFrame({
					code: overrides?.code ?? 'AgentError',
					message: err.message,
					handled: overrides?.handled ?? error instanceof HandledError,
					details: {
						stack: err.stack,
						cause: err.cause,
					},
				}),
			})
		},
		has(kind) {
			return frames.some(entry => entry.frame.kind === kind)
		},
	}

	return {
		protocol,
		toEnvelopes() {
			return frames.map(entry => createEnvelopeFromContext(context, entry.frame))
		},
		frames() {
			return frames.map(entry => entry.frame)
		},
	}
}

type ToolInvoker = {
	list(): AllowedToolDefinition[]
	invoke(definition: AllowedToolDefinition | string, payload: unknown, parameter?: unknown): Promise<unknown>
}

const createToolInvoker = (
	serviceContext: CommandFunctionContext,
	tools: AllowedToolDefinition[],
	protocol: ProtocolEmitter,
): ToolInvoker => {
	type ServiceInvokeMap = Record<
		string,
		Record<string, Record<string, (payload: unknown, parameter: unknown) => Promise<unknown>>>
	>
	const services = serviceContext.service as ServiceInvokeMap
	const map = new Map<string, AllowedToolDefinition>()
	for (const tool of tools) {
		const key = `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`
		map.set(key, tool)
	}

	const resolve = (definition: AllowedToolDefinition | string) => {
		if (typeof definition !== 'string') {
			return definition
		}
		const found = map.get(definition)
		if (!found) {
			throw new HandledError(StatusCode.BadRequest, `Tool ${definition} not allowlisted`)
		}
		return found
	}

	const emitStatus = (
		tool: AllowedToolDefinition,
		status: 'invoked' | 'success' | 'error',
		input?: unknown,
		output?: unknown,
		errorCode?: string,
	) => {
		protocol.emitToolEvent({
			toolName: `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`,
			status,
			input,
			output,
			errorCode,
		})
	}

	const invoke = async (definition: AllowedToolDefinition | string, payload: unknown, parameter?: unknown) => {
		const tool = resolve(definition)
		const serviceApi = services[tool.serviceName]
		if (!serviceApi) {
			throw new HandledError(StatusCode.BadRequest, `Service ${tool.serviceName} not available for tool invocation`)
		}
		const versionApi = serviceApi[tool.serviceVersion]
		if (!versionApi) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Version ${tool.serviceVersion} for service ${tool.serviceName} not registered`,
			)
		}
		const commandFn = versionApi[tool.commandName]
		if (!commandFn) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Command ${tool.commandName} not available on service ${tool.serviceName} v${tool.serviceVersion}`,
			)
		}
		try {
			emitStatus(tool, 'invoked', payload)
			const result = await commandFn(payload, parameter ?? {})
			emitStatus(tool, 'success', payload, result)
			return result
		} catch (error) {
			const handled = error instanceof HandledError
			emitStatus(tool, 'error', payload, undefined, handled ? String(error.errorCode) : 'UnhandledError')
			throw error
		}
	}

	return {
		list: () => [...tools],
		invoke,
	}
}

export type SessionHelpers = {
	/**
	 * Load the session record. If no id is provided, the default scoped id is used.
	 */
	load(sessionId?: string): Promise<SessionRecord | undefined>
	/**
	 * Save session data. If `sessionId` is omitted, the default scoped id is used.
	 */
	save(record: SessionRecord | { sessionId?: string; data: SessionRecordData; updatedAt?: number }): Promise<void>
	/**
	 * Delete a session. If no id is provided, the default scoped id is used.
	 */
	delete(sessionId?: string): Promise<void>
	/**
	 * Returns the effective scoped session id for explicit or implicit usage.
	 */
	resolveSessionId(sessionId?: string): string
	/**
	 * Identity metadata used to build scoped session ids.
	 */
	identity: {
		agentName: string
		agentVersion: string
		tenantId?: string
		principalId?: string
		baseSessionId: string
	}
}

type SessionIdentityInput = {
	context: CommandFunctionContext
	manifest: AgentManifest
	payload: unknown
}

const createSessionHelpers = (store: SessionStore, input: SessionIdentityInput): SessionHelpers => {
	const baseSessionId = resolveBaseSessionId(input.context, input.payload)
	const identity = {
		agentName: input.manifest.agentName,
		agentVersion: input.manifest.agentVersion,
		tenantId: input.context.message.tenantId,
		principalId: input.context.message.principalId,
		baseSessionId,
	}

	const resolveId = (sessionId?: string) =>
		createScopedSessionId({
			agentName: identity.agentName,
			agentVersion: identity.agentVersion,
			baseSessionId: sessionId ?? identity.baseSessionId,
			tenantId: identity.tenantId,
			principalId: identity.principalId,
		})

	return {
		load: sessionId => store.load(resolveId(sessionId)),
		save: record =>
			store.save({
				sessionId: resolveId(record.sessionId),
				data: record.data,
				updatedAt: record.updatedAt ?? Date.now(),
			}),
		delete: sessionId => store.delete(resolveId(sessionId)),
		resolveSessionId: resolveId,
		identity,
	}
}

export type KnowledgeHelpers = {
	query(adapterName: string, query: string, limit?: number): Promise<KnowledgeDocument[]>
	[adapterName: string]:
		| unknown
		| ((adapterName: string, query: string, limit?: number) => Promise<KnowledgeDocument[]>)
		| { query(query: string, limit?: number): Promise<KnowledgeDocument[]> }
}

const createKnowledgeHelpers = (adapters: Record<string, KnowledgeAdapter | undefined>): KnowledgeHelpers => {
	const resolveAdapter = (adapterName: string) => {
		const adapter = adapters[adapterName]
		if (!adapter) {
			throw new HandledError(StatusCode.NotFound, `Knowledge adapter ${adapterName} not registered`)
		}
		return adapter
	}

	const base: Pick<KnowledgeHelpers, 'query'> = {
		async query(adapterName, query, limit) {
			return resolveAdapter(adapterName).query(query, limit)
		},
	}

	return new Proxy(base, {
		get(target, prop, receiver) {
			if (typeof prop !== 'string') {
				return Reflect.get(target, prop, receiver)
			}
			if (Reflect.has(target, prop)) {
				return Reflect.get(target, prop, receiver)
			}
			return {
				query: async (query: string, limit?: number) => {
					return resolveAdapter(prop).query(query, limit)
				},
			}
		},
	}) as KnowledgeHelpers
}

export type AgentHandlerContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
> = {
	logger: Logger
	payload: Payload
	parameter: Parameter
	message: CommandFunctionContext['message']
	conversation: ConversationHelpers
	session: SessionHelpers
	knowledge: KnowledgeHelpers
	stream: AgentStreamEmitter
	tools: ToolInvoker
	resources: Resources
	models: Models
	serviceContext: CommandFunctionContext
	manifest: AgentManifest
}

export type CreateAgentHandlerContextInput<
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
> = {
	serviceContext: CommandFunctionContext<Payload, Parameter>
	payload: Payload
	parameter: Parameter
	sessionStore: SessionStore
	knowledgeAdapters: Record<string, KnowledgeAdapter | undefined>
	protocol: ProtocolEmitter
	resources: Resources
	models: Models
	manifest: AgentManifest
}

export const createAgentHandlerContext = <
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
>(
	input: CreateAgentHandlerContextInput<Payload, Parameter, Resources, Models>,
): AgentHandlerContext<Payload, Parameter, Resources, Models> => {
	const sessionHelpers = createSessionHelpers(input.sessionStore, {
		context: input.serviceContext,
		manifest: input.manifest,
		payload: input.payload,
	})

	return {
		logger: input.serviceContext.logger,
		payload: input.payload,
		parameter: input.parameter,
		message: input.serviceContext.message,
		session: sessionHelpers,
		conversation: createConversationHelpers(sessionHelpers, input.manifest),
		knowledge: createKnowledgeHelpers(input.knowledgeAdapters),
		stream: createStreamEmitter(input.protocol),
		tools: createToolInvoker(input.serviceContext, input.manifest.allowedTools ?? [], input.protocol),
		resources: input.resources,
		models: input.models,
		serviceContext: input.serviceContext,
		manifest: input.manifest,
	}
}
