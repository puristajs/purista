import type {
	AgentInvokeList,
	CommandFunctionContext,
	EmptyObject,
	EventBridge,
	InferIn,
	InvokeList,
	Logger,
	QueueInvokeList,
	Schema,
	StreamFunctionContext,
	StreamInvokeList,
} from '@purista/core'
import { HandledError, StatusCode, validate } from '@purista/core'

import type {
	KnowledgeAdapter,
	KnowledgeDeleteRequest,
	KnowledgeDocument,
	KnowledgeQueryRequest,
	KnowledgeUpsertRequest,
} from '../knowledge/adapters/inMemoryAdapter.js'
import type {
	ConversationStore,
	ConversationStoreRecord,
	ConversationStoreRecordData,
} from '../memory/conversationStore.js'
import {
	agentProtocolEnvelopeSchema,
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
import { invokeAgent } from './invokeAgent.js'
import { createScopedSessionId, resolveBaseSessionId } from './sessionIdentity.js'
import { withSessionIdInPayload } from './sessionPayload.js'

type ProtocolFrameEntry = {
	frame: AgentProtocolFrame
	envelope: AgentProtocolEnvelope
}

export type ProtocolEmitter = {
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
		maxConcurrencyPerInstance?: number
		activeWorkers?: number
		waitingWorkers?: number
		replicaCountHint?: number
		effectiveMaxConcurrencyHint?: number
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
		if (content.length === 0) {
			return
		}
		protocol.emitMessage({ content, partial: true, final: false })
	},
	sendFinal(content, options) {
		if (content.length === 0) {
			return
		}
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
			if (frame.content.length === 0) {
				return
			}
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
				maxConcurrencyPerInstance: metrics.maxConcurrencyPerInstance,
				activeWorkers: metrics.activeWorkers,
				waitingWorkers: metrics.waitingWorkers,
				replicaCountHint: metrics.replicaCountHint,
				effectiveMaxConcurrencyHint: metrics.effectiveMaxConcurrencyHint,
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
	invoke: Record<string, Record<string, Record<string, (payload: unknown, parameter?: unknown) => Promise<unknown>>>>
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

	const invoke = async (tool: AllowedToolDefinition, payload: unknown, parameter?: unknown) => {
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

	const getAllowedTool = (serviceName: string, serviceVersion: string, commandName: string) => {
		const key = `${serviceName}.${serviceVersion}.${commandName}`
		return map.get(key)
	}

	const invokeProxy = new Proxy(
		{},
		{
			get: (_target, serviceProp) => {
				if (typeof serviceProp !== 'string') {
					return undefined
				}
				return new Proxy(
					{},
					{
						get: (_targetVersion, versionProp) => {
							if (typeof versionProp !== 'string') {
								return undefined
							}
							return new Proxy(
								{},
								{
									get: (_targetCommand, commandProp) => {
										if (typeof commandProp !== 'string') {
											return undefined
										}
										return async (payload: unknown, parameter?: unknown) => {
											const tool = getAllowedTool(serviceProp, versionProp, commandProp)
											if (!tool) {
												throw new HandledError(
													StatusCode.BadRequest,
													`Tool ${serviceProp}.${versionProp}.${commandProp} not allowlisted`,
												)
											}
											return await invoke(tool, payload, parameter)
										}
									},
								},
							)
						},
					},
				)
			},
		},
	) as ToolInvoker['invoke']

	return {
		list: () => [...tools],
		invoke: invokeProxy,
	}
}

export type SessionHelpers = {
	/**
	 * Load the session record. If no id is provided, the default scoped id is used.
	 */
	load(sessionId?: string): Promise<ConversationStoreRecord | undefined>
	/**
	 * Save session data. If `sessionId` is omitted, the default scoped id is used.
	 */
	save(
		record:
			| ConversationStoreRecord
			| { conversationId?: string; data: ConversationStoreRecordData; updatedAt?: number },
	): Promise<void>
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

const createSessionHelpers = (store: ConversationStore, input: SessionIdentityInput): SessionHelpers => {
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
				conversationId: resolveId(record.conversationId),
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
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
> = {
	logger: Logger
	payload: Payload
	parameter: Parameter
	message: ProtocolContext['message']
	emit: ProtocolContext['emit']
	conversation: ConversationHelpers
	session: SessionHelpers
	knowledge: KnowledgeHelpers<KnowledgeAliases>
	stream: AgentStreamEmitter
	protocol: ProtocolEmitter
	tools: ToolInvoker
	resources: Resources
	models: Models
	agents: {
		/**
		 * Invokes another agent via EventBridge and returns its emitted envelopes.
		 * Supports both direct options-based calls and typed chained access:
		 * `context.agents.invoke({ agentName, agentVersion, payload })`
		 * and `context.agents.invoke.someAgent['1'].call(payload, parameter)`.
		 */
		invoke: AgentInvokes & ((options: AgentInvocationOptions) => Promise<AgentProtocolEnvelope[]>)
		/**
		 * Invokes another agent and extracts a best-effort assistant text output from message frames.
		 */
		runText(options: AgentInvocationOptions): Promise<string>
		/**
		 * Invokes another agent and parses the final assistant message as JSON.
		 */
		runObject<T = unknown>(options: AgentInvocationOptions): Promise<T>
	}
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
	secrets: ProtocolContext['secrets']
	configs: ProtocolContext['configs']
	states: ProtocolContext['states']
	manifest: AgentManifest
}

export type CreateAgentHandlerContextInput<
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
	KnowledgeAliases extends string = string,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
> = {
	serviceContext:
		| CommandFunctionContext<
				Payload,
				Parameter,
				Resources,
				InvokeList,
				StreamInvokeList,
				Record<string, Schema>,
				QueueInvokeList,
				AgentInvokes
		  >
		| StreamFunctionContext<
				Payload,
				Parameter,
				Resources,
				InvokeList,
				StreamInvokeList,
				Record<string, Schema>,
				QueueInvokeList,
				AgentInvokes
		  >
	eventBridge: EventBridge
	payload: Payload
	parameter: Parameter
	conversationStore: ConversationStore
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

export type AgentInvocationOptions = {
	agentName: string
	agentVersion: string
	payload: unknown
	parameter?: unknown
	timeoutMs?: number
	correlationId?: string
	sessionId?: string
	/**
	 * Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
	 * Defaults to `true`.
	 */
	failOnErrorFrame?: boolean
	stream?: import('../types/AgentDefinition.js').AgentStreamResponder
}

type DeclaredAgentBinding = {
	call?: (
		payload: unknown,
		parameter?: unknown,
	) => {
		final(): Promise<unknown>
		[Symbol.asyncIterator](): AsyncIterator<unknown>
	}
	payloadSchema?: Schema
	parameterSchema?: Schema
}

type ResolvedAgentBinding = {
	call: (
		payload: unknown,
		parameter?: unknown,
	) => {
		final(): Promise<unknown>
		[Symbol.asyncIterator](): AsyncIterator<unknown>
	}
	payloadSchema?: Schema
	parameterSchema?: Schema
}

const hasErrorEnvelope = (envelopes: AgentProtocolEnvelope[]): boolean =>
	envelopes.some(envelope => envelope.frame.kind === 'error')

const createAgentInvocationHelpers = <AgentInvokes extends AgentInvokeList>(input: {
	eventBridge: EventBridge
	protocol: ProtocolEmitter
	serviceContext:
		| CommandFunctionContext<
				unknown,
				unknown,
				Record<string, unknown>,
				InvokeList,
				StreamInvokeList,
				Record<string, Schema>,
				QueueInvokeList,
				AgentInvokes
		  >
		| StreamFunctionContext<
				unknown,
				unknown,
				Record<string, unknown>,
				InvokeList,
				StreamInvokeList,
				Record<string, Schema>,
				QueueInvokeList,
				AgentInvokes
		  >
	session: SessionHelpers
	manifest: AgentManifest
}) => {
	const resolveDeclaredBinding = (agentName: string, agentVersion: string): ResolvedAgentBinding => {
		const allowed = input.manifest.allowedAgents?.some(
			agent => agent.agentName === agentName && agent.agentVersion === agentVersion,
		)
		if (!allowed) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Agent ${agentName}.${agentVersion} is not declared via canInvokeAgent(...)`,
			)
		}

		const invokeAgentApi = (input.serviceContext.invokeAgent ?? ({} as EmptyObject)) as AgentInvokes &
			Record<string, Record<string, DeclaredAgentBinding> | undefined>
		const versionApi = invokeAgentApi[agentName]
		const binding = versionApi?.[agentVersion]
		if (!binding?.call) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Agent ${agentName}.${agentVersion} is declared but no invoke binding is available in the current context`,
			)
		}
		return {
			call: binding.call,
			payloadSchema: binding.payloadSchema,
			parameterSchema: binding.parameterSchema,
		}
	}

	const emitStatus = (
		options: Pick<AgentInvocationOptions, 'agentName' | 'agentVersion' | 'payload'>,
		status: 'invoked' | 'success' | 'error',
		output?: unknown,
		errorCode?: string,
	) => {
		input.protocol.emitToolEvent({
			toolName: `${options.agentName}.${options.agentVersion}.run`,
			status,
			input: options.payload,
			output,
			errorCode,
		})
	}

	const validateInvocationInput = async (binding: DeclaredAgentBinding, payload: unknown, parameter: unknown) => {
		if (binding.payloadSchema) {
			const result = await validate(binding.payloadSchema, payload)
			if (!result.success) {
				throw new HandledError(StatusCode.BadRequest, 'Agent invoke payload schema validation failed', {
					issues: result.issues,
				})
			}
		}
		if (binding.parameterSchema) {
			const result = await validate(binding.parameterSchema, parameter)
			if (!result.success) {
				throw new HandledError(StatusCode.BadRequest, 'Agent invoke parameter schema validation failed', {
					issues: result.issues,
				})
			}
		}
	}

	const instrumentInvocation = (
		options: Pick<AgentInvocationOptions, 'agentName' | 'agentVersion' | 'payload'>,
		invocation: {
			final(): Promise<unknown>
			[Symbol.asyncIterator](): AsyncIterator<unknown>
		},
	) => {
		emitStatus(options, 'invoked')
		const finalPromise = invocation
			.final()
			.then(result => {
				const envelopes = Array.isArray(result) ? agentProtocolEnvelopeSchema.array().safeParse(result) : undefined
				if (envelopes?.success && hasErrorEnvelope(envelopes.data)) {
					emitStatus(options, 'error', envelopes.data, 'AgentErrorEnvelope')
				} else {
					emitStatus(options, 'success', result)
				}
				return result
			})
			.catch(error => {
				emitStatus(
					options,
					'error',
					undefined,
					error instanceof HandledError ? String(error.errorCode) : 'UnhandledError',
				)
				throw error
			})

		return {
			final: async () => await finalPromise,
			[Symbol.asyncIterator]: async function* () {
				const iterator = invocation[Symbol.asyncIterator]()
				while (true) {
					const next = await iterator.next()
					if (next.done) {
						return
					}
					yield next.value
				}
			},
		}
	}

	const invoke = async (options: AgentInvocationOptions) => {
		const binding = resolveDeclaredBinding(options.agentName, options.agentVersion)
		const payload = withSessionIdInPayload(options.payload, options.sessionId ?? input.session.identity.baseSessionId)
		const parameter = options.parameter ?? {}
		await validateInvocationInput(binding, payload, parameter)
		emitStatus(options, 'invoked')
		try {
			const envelopes = await invokeAgent({
				eventBridge: input.eventBridge,
				agentName: options.agentName,
				agentVersion: options.agentVersion,
				payload,
				parameter,
				timeoutMs: options.timeoutMs,
				stream: options.stream,
				correlationId: options.correlationId ?? input.serviceContext.message.correlationId,
				principalId: input.serviceContext.message.principalId,
				tenantId: input.serviceContext.message.tenantId,
				sessionId: options.sessionId ?? input.session.identity.baseSessionId,
				failOnErrorFrame: options.failOnErrorFrame ?? true,
			})
			if (hasErrorEnvelope(envelopes)) {
				emitStatus(options, 'error', envelopes, 'AgentErrorEnvelope')
			} else {
				emitStatus(options, 'success', envelopes)
			}
			return envelopes
		} catch (error) {
			emitStatus(
				options,
				'error',
				undefined,
				error instanceof HandledError ? String(error.errorCode) : 'UnhandledError',
			)
			throw error
		}
	}

	const runText = async (options: Parameters<typeof invoke>[0]) => {
		const envelopes = await invoke(options)
		const assistantMessageFrames = envelopes
			.map(envelope => envelope.frame)
			.filter(
				(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
					frame.kind === 'message' && frame.role === 'assistant',
			)
		let finalMessage: string | undefined
		for (let index = assistantMessageFrames.length - 1; index >= 0; index -= 1) {
			const frame = assistantMessageFrames[index]
			if (frame?.final === true) {
				finalMessage = frame.content
				break
			}
		}
		if (typeof finalMessage === 'string' && finalMessage.trim().length > 0) {
			return finalMessage
		}
		return assistantMessageFrames
			.map(frame => frame.content)
			.filter((content): content is string => typeof content === 'string' && content.length > 0)
			.join('')
	}

	const runObject = async <T = unknown>(options: Parameters<typeof invoke>[0]): Promise<T> => {
		const text = await runText(options)
		try {
			return JSON.parse(text) as T
		} catch (error) {
			throw new HandledError(StatusCode.BadGateway, 'Invoked agent did not return valid JSON in final message', {
				text,
				error: error instanceof Error ? error.message : String(error),
			})
		}
	}

	const invokeProxy = new Proxy(invoke, {
		apply(target, thisArg, argArray) {
			return Reflect.apply(target, thisArg, argArray)
		},
		get(_target, prop) {
			if (prop === 'then' || prop === 'catch' || prop === 'finally') {
				return undefined
			}
			if (typeof prop !== 'string') {
				return undefined
			}
			return new Proxy(
				{},
				{
					get(_versionTarget, versionProp) {
						if (typeof versionProp !== 'string') {
							return undefined
						}
						const binding = resolveDeclaredBinding(prop, versionProp)
						const call = binding.call
						return {
							call: (payload: InferIn<Schema>, parameter?: InferIn<Schema>) =>
								instrumentInvocation(
									{
										agentName: prop,
										agentVersion: versionProp,
										payload,
									},
									call(withSessionIdInPayload(payload, input.session.identity.baseSessionId), parameter ?? {}),
								),
							payloadSchema: binding.payloadSchema,
							parameterSchema: binding.parameterSchema,
						}
					},
				},
			)
		},
	}) as AgentHandlerContext<
		unknown,
		unknown,
		Record<string, unknown>,
		Record<string, ModelProvider>,
		string,
		AgentInvokes
	>['agents']['invoke']

	return {
		invoke: invokeProxy,
		runText,
		runObject,
	}
}

export const createAgentHandlerContext = <
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
	KnowledgeAliases extends string = string,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
>(
	input: CreateAgentHandlerContextInput<Payload, Parameter, Resources, Models, KnowledgeAliases, AgentInvokes>,
): AgentHandlerContext<Payload, Parameter, Resources, Models, KnowledgeAliases, AgentInvokes> => {
	const sessionHelpers = createSessionHelpers(input.conversationStore, {
		context: input.serviceContext,
		manifest: input.manifest,
		payload: input.payload,
	})

	return {
		logger: input.serviceContext.logger,
		payload: input.payload,
		parameter: input.parameter,
		message: input.serviceContext.message,
		emit: input.serviceContext.emit.bind(input.serviceContext) as ProtocolContext['emit'],
		session: sessionHelpers,
		conversation: createConversationHelpers(sessionHelpers, input.manifest),
		knowledge: createKnowledgeHelpers(
			input.knowledgeAdapters,
			input.manifest,
			sessionHelpers,
		) as KnowledgeHelpers<KnowledgeAliases>,
		stream: createStreamEmitter(input.protocol),
		protocol: input.protocol,
		tools: createToolInvoker(input.serviceContext, input.manifest.allowedTools ?? [], input.protocol),
		resources: input.resources,
		models: input.models,
		agents: createAgentInvocationHelpers({
			eventBridge: input.eventBridge,
			protocol: input.protocol,
			serviceContext: input.serviceContext,
			session: sessionHelpers,
			manifest: input.manifest,
		}),
		embeddings: input.embeddings as AgentHandlerContext<
			Payload,
			Parameter,
			Resources,
			Models,
			KnowledgeAliases,
			AgentInvokes
		>['embeddings'],
		rerankers: input.rerankers as AgentHandlerContext<
			Payload,
			Parameter,
			Resources,
			Models,
			KnowledgeAliases,
			AgentInvokes
		>['rerankers'],
		serviceContext: input.serviceContext,
		secrets: input.serviceContext.secrets,
		configs: input.serviceContext.configs,
		states: input.serviceContext.states,
		manifest: input.manifest,
	}
}
