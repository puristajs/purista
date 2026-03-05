import type { CommandFunctionContext, Logger, StreamFunctionContext } from '@purista/core'
import { HandledError, StatusCode } from '@purista/core'

import type {
	KnowledgeAdapter,
	KnowledgeDeleteRequest,
	KnowledgeDocument,
	KnowledgeQueryRequest,
	KnowledgeUpsertRequest,
} from '../knowledge/adapters/inMemoryAdapter.js'
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
import type {
	ModelProvider,
	ProviderEmbedManyRequest,
	ProviderEmbedManyResponse,
	ProviderEmbedRequest,
	ProviderEmbedResponse,
	ProviderRerankRequest,
	ProviderRerankResponse,
} from '../providers/runtime/ModelProvider.js'
import type { AgentManifest, AllowedToolDefinition } from '../types/AgentManifest.js'
import { type ConversationHelpers, createConversationHelpers } from './conversation.js'
import { createScopedSessionId, resolveBaseSessionId } from './sessionIdentity.js'

type ProtocolFrameEntry = {
	frame: AgentProtocolFrame
	envelope: AgentProtocolEnvelope
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
	flush(): Promise<void>
}

export type AgentStreamEmitter = {
	sendChunk(content: string): void
	sendFinal(content: string, options?: { summary?: string }): void
	sendReasoning(content: string, options?: { artifactId?: string }): void
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
	sendReasoning(content, options) {
		protocol.emitArtifact({
			artifactId: options?.artifactId ?? 'reasoning',
			content,
			mimeType: 'text/markdown',
			final: false,
		})
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

type ProtocolBufferOptions = {
	onEnvelope?: (envelope: AgentProtocolEnvelope) => void | Promise<void>
}

type ProtocolContext = CommandFunctionContext | StreamFunctionContext

export const createProtocolBuffer = (
	context: ProtocolContext,
	config: ProtocolBufferOptions = {},
): AgentProtocolBuffer => {
	const frames: ProtocolFrameEntry[] = []
	let flushPromise = Promise.resolve()
	const pushFrame = (frame: AgentProtocolFrame) => {
		const envelope = createEnvelopeFromContext(context, frame)
		frames.push({ frame, envelope })
		if (config.onEnvelope) {
			flushPromise = flushPromise.then(async () => {
				await config.onEnvelope?.(envelope)
			})
		}
	}

	const protocol: ProtocolEmitter = {
		emitMessage(content, messageOptions) {
			const message =
				typeof content === 'object' && content !== null && 'content' in content
					? {
							content: stringifyResult(content.content),
							summary: content.summary ?? messageOptions?.summary,
							partial: content.partial ?? messageOptions?.partial,
							final: content.final ?? messageOptions?.final,
						}
					: {
							content: stringifyResult(content),
							summary: messageOptions?.summary,
							partial: messageOptions?.partial,
							final: messageOptions?.final,
						}
			const frame = createMessageFrame({
				role: 'assistant',
				content: message.content,
				summary: message.summary,
				partial: message.partial,
				final: message.final,
			})
			pushFrame(frame)
		},
		emitArtifact(input) {
			const frame = createArtifactFrame({
				artifactId: input.artifactId,
				phase: input.final ? 'final' : 'chunk',
				sequence: input.sequence,
				total: input.total,
				content: input.content,
				mimeType: input.mimeType,
				lastChunk: input.final,
			})
			pushFrame(frame)
		},
		emitTelemetry(metrics) {
			const frame = createTelemetryFrame({
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
			})
			pushFrame(frame)
		},
		emitToolEvent(event) {
			const frame = createToolEventFrame({
				toolName: event.toolName,
				status: event.status,
				args: event.input,
				result: event.output,
				message: event.message,
				errorCode: event.errorCode,
			})
			pushFrame(frame)
		},
		emitError(error, overrides) {
			const err =
				error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Agent error', { cause: error })
			const frame = createErrorFrame({
				code: overrides?.code ?? 'AgentError',
				message: err.message,
				handled: overrides?.handled ?? error instanceof HandledError,
				details: {
					stack: err.stack,
					cause: err.cause,
				},
			})
			pushFrame(frame)
		},
		has(kind) {
			return frames.some(entry => entry.frame.kind === kind)
		},
	}

	return {
		protocol,
		toEnvelopes() {
			return frames.map(entry => entry.envelope)
		},
		frames() {
			return frames.map(entry => entry.frame)
		},
		async flush() {
			await flushPromise
		},
	}
}

type ToolInvoker = {
	list(): AllowedToolDefinition[]
	invoke(definition: AllowedToolDefinition | string, payload: unknown, parameter?: unknown): Promise<unknown>
}

const createToolInvoker = (
	serviceContext: ProtocolContext,
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
	context: ProtocolContext
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

export type KnowledgeQueryInput = number | Omit<KnowledgeQueryRequest, 'query' | 'scope' | 'options'>

type KnowledgeAliasAccessor = {
	query(query: string, input?: KnowledgeQueryInput): Promise<KnowledgeDocument[]>
	upsert(
		document: KnowledgeDocument,
		input?: Omit<KnowledgeUpsertRequest, 'document' | 'scope' | 'options'>,
	): Promise<void>
	delete(id: string, input?: Omit<KnowledgeDeleteRequest, 'id' | 'scope' | 'options'>): Promise<void>
}

/**
 * High-level knowledge helper API exposed to agent handlers.
 *
 * Supports both generic calls (`context.knowledge.query('faq', ...)`) and
 * alias-first calls (`context.knowledge.faq.query(...)`).
 */
export type KnowledgeHelpers<KnowledgeAliases extends string = never> = {
	query(adapterName: string, query: string, input?: KnowledgeQueryInput): Promise<KnowledgeDocument[]>
	upsert(
		adapterName: string,
		document: KnowledgeDocument,
		input?: Omit<KnowledgeUpsertRequest, 'document' | 'scope' | 'options'>,
	): Promise<void>
	delete(
		adapterName: string,
		id: string,
		input?: Omit<KnowledgeDeleteRequest, 'id' | 'scope' | 'options'>,
	): Promise<void>
} & { [Alias in KnowledgeAliases]: KnowledgeAliasAccessor }

const createKnowledgeHelpers = (
	adapters: Record<string, KnowledgeAdapter | undefined>,
	manifest: AgentManifest,
	session: SessionHelpers,
): KnowledgeHelpers<string> => {
	const adapterConfigMap = new Map((manifest.knowledge ?? []).map(entry => [entry.adapterName, entry.options] as const))

	const resolveAdapter = (adapterName: string) => {
		const adapter = adapters[adapterName]
		if (!adapter) {
			throw new HandledError(StatusCode.NotFound, `Knowledge adapter ${adapterName} not registered`)
		}
		return adapter
	}

	const parseInput = (input?: KnowledgeQueryInput) => {
		if (typeof input === 'number') {
			return { limit: input }
		}
		return input
	}

	const getScope = () => ({
		agentName: session.identity.agentName,
		agentVersion: session.identity.agentVersion,
		tenantId: session.identity.tenantId,
		principalId: session.identity.principalId,
		sessionId: session.identity.baseSessionId,
	})

	const base: Pick<KnowledgeHelpers, 'query' | 'upsert' | 'delete'> = {
		async query(adapterName, query, input) {
			const parsedInput = parseInput(input)
			return resolveAdapter(adapterName).query({
				query,
				...parsedInput,
				scope: getScope(),
				options: adapterConfigMap.get(adapterName),
			})
		},
		async upsert(adapterName, document, input) {
			await resolveAdapter(adapterName).upsert({
				document,
				...input,
				scope: getScope(),
				options: adapterConfigMap.get(adapterName),
			})
		},
		async delete(adapterName, id, input) {
			await resolveAdapter(adapterName).delete({
				id,
				...input,
				scope: getScope(),
				options: adapterConfigMap.get(adapterName),
			})
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
				query: async (query: string, input?: KnowledgeQueryInput) => {
					const parsedInput = parseInput(input)
					return resolveAdapter(prop).query({
						query,
						...parsedInput,
						scope: getScope(),
						options: adapterConfigMap.get(prop),
					})
				},
				upsert: async (
					document: KnowledgeDocument,
					input?: Omit<KnowledgeUpsertRequest, 'document' | 'scope' | 'options'>,
				) => {
					await resolveAdapter(prop).upsert({
						document,
						...input,
						scope: getScope(),
						options: adapterConfigMap.get(prop),
					})
				},
				delete: async (id: string, input?: Omit<KnowledgeDeleteRequest, 'id' | 'scope' | 'options'>) => {
					await resolveAdapter(prop).delete({
						id,
						...input,
						scope: getScope(),
						options: adapterConfigMap.get(prop),
					})
				},
			}
		},
	}) as KnowledgeHelpers<string>
}

export type AgentHandlerContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	KnowledgeAliases extends string = never,
> = {
	logger: Logger
	payload: Payload
	parameter: Parameter
	message: ProtocolContext['message']
	conversation: ConversationHelpers
	session: SessionHelpers
	knowledge: KnowledgeHelpers<KnowledgeAliases>
	stream: AgentStreamEmitter
	tools: ToolInvoker
	resources: Resources
	models: Models
	embeddings: {
		[Alias in keyof Models as Models[Alias] extends { embed: (...args: any[]) => any } ? Alias : never]: {
			name: string
			embed(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse>
			embedMany?(request: ProviderEmbedManyRequest): Promise<ProviderEmbedManyResponse>
		}
	}
	rerankers: {
		[Alias in keyof Models as Models[Alias] extends { rerank: (...args: any[]) => any } ? Alias : never]: {
			name: string
			rerank<Document = string | Record<string, unknown>>(
				request: ProviderRerankRequest<Document>,
			): Promise<ProviderRerankResponse<Document>>
		}
	}
	serviceContext: ProtocolContext
	manifest: AgentManifest
}

export type CreateAgentHandlerContextInput<
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
	KnowledgeAliases extends string = string,
> = {
	serviceContext: CommandFunctionContext<Payload, Parameter> | StreamFunctionContext<Payload, Parameter>
	payload: Payload
	parameter: Parameter
	sessionStore: SessionStore
	knowledgeAdapters: Record<KnowledgeAliases, KnowledgeAdapter | undefined>
	protocol: ProtocolEmitter
	resources: Resources
	models: Models
	embeddings: Record<string, { name: string; embed: (request: ProviderEmbedRequest) => Promise<ProviderEmbedResponse> }>
	rerankers: Record<
		string,
		{
			name: string
			rerank: <Document = string | Record<string, unknown>>(
				request: ProviderRerankRequest<Document>,
			) => Promise<ProviderRerankResponse<Document>>
		}
	>
	manifest: AgentManifest
}

export const createAgentHandlerContext = <
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
	KnowledgeAliases extends string = string,
>(
	input: CreateAgentHandlerContextInput<Payload, Parameter, Resources, Models, KnowledgeAliases>,
): AgentHandlerContext<Payload, Parameter, Resources, Models, KnowledgeAliases> => {
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
		knowledge: createKnowledgeHelpers(
			input.knowledgeAdapters,
			input.manifest,
			sessionHelpers,
		) as KnowledgeHelpers<KnowledgeAliases>,
		stream: createStreamEmitter(input.protocol),
		tools: createToolInvoker(input.serviceContext, input.manifest.allowedTools ?? [], input.protocol),
		resources: input.resources,
		models: input.models,
		embeddings: input.embeddings as AgentHandlerContext<
			Payload,
			Parameter,
			Resources,
			Models,
			KnowledgeAliases
		>['embeddings'],
		rerankers: input.rerankers as AgentHandlerContext<
			Payload,
			Parameter,
			Resources,
			Models,
			KnowledgeAliases
		>['rerankers'],
		serviceContext: input.serviceContext,
		manifest: input.manifest,
	}
}
