import type { CommandFunctionContext, Schema, StreamFunctionContext, StreamWriter } from '@purista/core'
import { extendApi, HandledError, ServiceBuilder, StatusCode } from '@purista/core'
import { z } from 'zod/v4'

import type { KnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import type { SessionStore } from '../memory/sessionStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import { agentProtocolEnvelopeSchema } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import { AgentInstance, type AgentInstanceDependencies } from '../runtime/AgentInstance.js'
import type { AgentHandlerContext } from '../runtime/context.js'
import { createAgentHandlerContext, createProtocolBuffer } from '../runtime/context.js'
import type { AgentDefinition, AgentInfo, AgentInstanceOptions } from '../types/AgentDefinition.js'
import type {
	AgentHistoryPreset,
	AgentManifest,
	AgentModelCapability,
	AgentSessionConfig,
	AllowedToolDefinition,
	RetryPolicy,
} from '../types/AgentManifest.js'

type AgentHandlerResultObject = {
	message: string
	summary?: string
	usage?: {
		promptTokens?: number
		completionTokens?: number
		totalTokens?: number
		costUsd?: number
	}
}

export type AgentHandlerResult = string | AgentHandlerResultObject | undefined

export type AgentHandler<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	KnowledgeAliases extends string = never,
> = (
	context: AgentHandlerContext<Payload, Parameter, Resources, Models, KnowledgeAliases>,
	payload: Payload,
	parameter: Parameter,
) => Promise<AgentHandlerResult> | AgentHandlerResult

type AgentRuntimeConfig<KnowledgeAliases extends string = string> = {
	handler: AgentHandler<unknown, unknown, Record<string, unknown>, Record<string, ModelProvider>, KnowledgeAliases>
	manifest: AgentManifest
	sessionStore: SessionStore
	knowledgeAdapters: Record<KnowledgeAliases, KnowledgeAdapter>
	poolManager: PoolManager
	resources: Record<string, unknown>
	models: Record<string, ModelProvider>
	tracer?: import('@opentelemetry/api').Tracer
	poolId: string
}

const agentRuntimeConfigSchema = extendApi(
	z.object({
		runtime: z.record(z.string(), z.any()).optional(),
	}),
	{ title: 'AgentRuntimeConfig' },
)

const normalizeInfo = (info: AgentInfo): AgentInfo => {
	if (!info.agentName?.trim()) {
		throw new Error('Agent name is required')
	}
	const version = info.agentVersion?.trim() || '1'
	return {
		agentName: info.agentName.trim(),
		agentVersion: version,
		description: info.description?.trim(),
	}
}

const resolveHistoryPresetConfig = (
	info: AgentInfo,
	preset: AgentHistoryPreset,
	overrides?: Partial<AgentSessionConfig>,
): AgentSessionConfig => {
	const defaults: Record<AgentHistoryPreset, Omit<AgentSessionConfig, 'storeName'>> = {
		user: {
			strategy: 'full',
			maxFrames: 40,
		},
		agent: {
			strategy: 'summary',
			maxFrames: 20,
		},
	}
	const storeName = overrides?.storeName ?? `${info.agentName}:${info.agentVersion}:${preset}:history`
	return {
		storeName,
		...defaults[preset],
		...overrides,
	}
}

const capabilityConfigDefaults: AgentModelCapability[] = ['text', 'stream']

const getProviderWarnings = (metadata: Record<string, unknown> | undefined): unknown[] => {
	if (!metadata || typeof metadata !== 'object' || !('warnings' in metadata)) {
		return []
	}
	const warnings = (metadata as { warnings?: unknown }).warnings
	return Array.isArray(warnings) ? warnings : []
}

type ResolveCapability<
	Caps extends readonly AgentModelCapability[] | undefined,
	Capability extends AgentModelCapability,
> = Caps extends readonly AgentModelCapability[]
	? Caps[number] extends never
		? Capability extends 'text' | 'stream'
			? true
			: false
		: Capability extends Caps[number]
			? true
			: false
	: Capability extends 'text' | 'stream'
		? true
		: false

type DeclaredModelAliasApi<
	Alias extends string,
	TextAliases extends string,
	StreamAliases extends string,
	EmbeddingAliases extends string,
	RerankAliases extends string,
	ObjectAliases extends string,
> = Pick<ModelProvider, 'name' | 'capabilities'> &
	(Alias extends TextAliases
		? {
				generate: NonNullable<ModelProvider['generate']>
			}
		: Record<never, never>) &
	(Alias extends ObjectAliases ? { generateJson: NonNullable<ModelProvider['generateJson']> } : Record<never, never>) &
	(Alias extends StreamAliases ? { stream: NonNullable<ModelProvider['stream']> } : Record<never, never>) &
	(Alias extends EmbeddingAliases
		? {
				embed: NonNullable<ModelProvider['embed']>
				embedMany?: NonNullable<ModelProvider['embedMany']>
			}
		: Record<never, never>) &
	(Alias extends RerankAliases ? { rerank: NonNullable<ModelProvider['rerank']> } : Record<never, never>)

type DeclaredModelMap<
	ModelAliases extends string,
	TextAliases extends string,
	StreamAliases extends string,
	EmbeddingAliases extends string,
	RerankAliases extends string,
	ObjectAliases extends string,
> = {
	[Alias in ModelAliases]: DeclaredModelAliasApi<
		Alias,
		TextAliases,
		StreamAliases,
		EmbeddingAliases,
		RerankAliases,
		ObjectAliases
	>
}

export class AgentBuilder<
	KnowledgeAliases extends string = never,
	ModelAliases extends string = never,
	TextAliases extends string = never,
	StreamAliases extends string = never,
	EmbeddingAliases extends string = never,
	RerankAliases extends string = never,
	ObjectAliases extends string = never,
> {
	private readonly info: AgentInfo
	private readonly serviceBuilder: ServiceBuilder
	private readonly commandBuilder: ReturnType<ServiceBuilder['getCommandBuilder']>
	private readonly streamBuilder: ReturnType<ServiceBuilder['getStreamBuilder']>
	private commandDefinitionAdded = false
	private streamDefinitionAdded = false
	private manifest: AgentManifest
	private handler?: AgentHandler<
		unknown,
		unknown,
		Record<string, unknown>,
		Record<string, ModelProvider>,
		KnowledgeAliases
	>

	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private outputSchema?: Schema
	private contextSchema?: Schema

	constructor(info: AgentInfo) {
		this.info = normalizeInfo(info)
		this.serviceBuilder = new ServiceBuilder({
			serviceName: this.info.agentName,
			serviceVersion: this.info.agentVersion,
			serviceDescription: this.info.description ?? `Agent ${this.info.agentName}`,
		})
		this.serviceBuilder.setConfigSchema(agentRuntimeConfigSchema)
		this.commandBuilder = this.serviceBuilder.getCommandBuilder('run', `Invoke ${this.info.agentName}`)
		this.streamBuilder = this.serviceBuilder.getStreamBuilder('run', `Stream ${this.info.agentName}`)
		this.streamBuilder.addChunkSchema(agentProtocolEnvelopeSchema)
		this.streamBuilder.addFinalSchema(agentProtocolEnvelopeSchema.array())

		this.manifest = {
			agentName: this.info.agentName,
			agentVersion: this.info.agentVersion,
			description: this.info.description,
			eventBridge: 'default',
			allowedTools: [],
		}
	}

	setDescription(description: string) {
		this.manifest.description = description
		return this
	}

	useEventBridge(name: string) {
		this.manifest.eventBridge = name
		return this
	}

	useResource(alias: string, resource: { resourceName: string }) {
		this.manifest.resources = {
			...(this.manifest.resources ?? {}),
			[alias]: resource,
		}
		return this
	}

	defineModel<const Alias extends string, const Caps extends readonly AgentModelCapability[] | undefined = undefined>(
		alias: Alias,
		options?: { capabilities?: Caps },
	): AgentBuilder<
		KnowledgeAliases,
		ModelAliases | Alias,
		TextAliases | (ResolveCapability<Caps, 'text'> extends true ? Alias : never),
		StreamAliases | (ResolveCapability<Caps, 'stream'> extends true ? Alias : never),
		EmbeddingAliases | (ResolveCapability<Caps, 'embedding'> extends true ? Alias : never),
		RerankAliases | (ResolveCapability<Caps, 'rerank'> extends true ? Alias : never),
		ObjectAliases | (ResolveCapability<Caps, 'json'> extends true ? Alias : never)
	> {
		if (!alias.trim()) {
			throw new Error('Model alias must not be empty')
		}
		const normalizedAlias = alias.trim()
		const capabilities =
			options?.capabilities && options.capabilities.length > 0
				? [...new Set(options.capabilities)]
				: capabilityConfigDefaults
		const models = [...(this.manifest.models ?? [])]
		const existingIndex = models.findIndex(model => model.alias === normalizedAlias)
		if (existingIndex >= 0) {
			models[existingIndex] = {
				alias: normalizedAlias,
				capabilities,
			}
		} else {
			models.push({
				alias: normalizedAlias,
				capabilities,
			})
		}
		this.manifest.models = models
		return this as unknown as AgentBuilder<
			KnowledgeAliases,
			ModelAliases | Alias,
			TextAliases | (ResolveCapability<Caps, 'text'> extends true ? Alias : never),
			StreamAliases | (ResolveCapability<Caps, 'stream'> extends true ? Alias : never),
			EmbeddingAliases | (ResolveCapability<Caps, 'embedding'> extends true ? Alias : never),
			RerankAliases | (ResolveCapability<Caps, 'rerank'> extends true ? Alias : never),
			ObjectAliases | (ResolveCapability<Caps, 'json'> extends true ? Alias : never)
		>
	}

	useSessionStore(config: AgentSessionConfig) {
		this.manifest.session = config
		return this
	}

	useKnowledgeAdapter<const Alias extends string>(
		adapterName: Alias,
		options?: Record<string, unknown>,
	): AgentBuilder<
		KnowledgeAliases | Alias,
		ModelAliases,
		TextAliases,
		StreamAliases,
		EmbeddingAliases,
		RerankAliases,
		ObjectAliases
	>
	useKnowledgeAdapter<const Adapter extends { adapterName: string; options?: Record<string, unknown> }>(
		adapter: Adapter,
	): AgentBuilder<
		KnowledgeAliases | Adapter['adapterName'],
		ModelAliases,
		TextAliases,
		StreamAliases,
		EmbeddingAliases,
		RerankAliases,
		ObjectAliases
	>
	useKnowledgeAdapter(
		adapterOrName: string | { adapterName: string; options?: Record<string, unknown> },
		options?: Record<string, unknown>,
	) {
		const adapter = typeof adapterOrName === 'string' ? { adapterName: adapterOrName, options } : adapterOrName
		if (!adapter.adapterName?.trim()) {
			throw new Error('Knowledge adapter name must not be empty')
		}
		const existing = this.manifest.knowledge ?? []
		this.manifest.knowledge = [...existing, { adapterName: adapter.adapterName.trim(), options: adapter.options }]
		return this as unknown as AgentBuilder<
			KnowledgeAliases | typeof adapter.adapterName,
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases
		>
	}

	/**
	 * Configure conversation persistence.
	 *
	 * You can either pass a full config object or use presets:
	 * - `persistConversation('user')` defaults to full strategy with a larger frame budget
	 * - `persistConversation('agent')` defaults to summary strategy with a smaller frame budget
	 *
	 * @example
	 * ```ts
	 * new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
	 *   .persistConversation('user')
	 * ```
	 */
	persistConversation(config: AgentSessionConfig): this
	persistConversation(preset: AgentHistoryPreset, overrides?: Partial<AgentSessionConfig>): this
	persistConversation(
		configOrPreset: AgentSessionConfig | AgentHistoryPreset,
		overrides?: Partial<AgentSessionConfig>,
	): this {
		if (typeof configOrPreset === 'string') {
			return this.useSessionStore(resolveHistoryPresetConfig(this.info, configOrPreset, overrides))
		}
		return this.useSessionStore(configOrPreset)
	}

	setRuntime(mode: string) {
		this.manifest.metadata = {
			...this.manifest.metadata,
			runtime: mode,
		}
		return this
	}

	setModelResource(resource: AgentManifest['modelResource']) {
		this.manifest.modelResource = resource
		return this
	}

	setRetryPolicy(policy: RetryPolicy) {
		this.manifest.retryPolicy = policy
		return this
	}

	setMemory(config: AgentManifest['session']) {
		return this.useSessionStore(config as AgentSessionConfig)
	}

	setKnowledge(adapters: AgentManifest['knowledge']) {
		this.manifest.knowledge = adapters ?? []
		return this
	}

	allowTool(tool: AllowedToolDefinition) {
		this.manifest.allowedTools = [...this.manifest.allowedTools, tool]
		return this
	}

	setTelemetry(config: AgentManifest['telemetry']) {
		this.manifest.telemetry = config
		return this
	}

	setEvaluation(profile: Record<string, unknown>) {
		this.manifest.metadata = {
			...this.manifest.metadata,
			evaluation: profile,
		}
		return this
	}

	addPayloadSchema(schema: Schema) {
		this.payloadSchema = schema
		this.commandBuilder.addPayloadSchema(schema)
		this.streamBuilder.addPayloadSchema(schema)
		this.manifest.payloadSchema = schema
		return this
	}

	setInputSchema(schema: Schema) {
		return this.addPayloadSchema(schema)
	}

	addParameterSchema(schema: Schema) {
		this.parameterSchema = schema
		this.commandBuilder.addParameterSchema(schema)
		this.streamBuilder.addParameterSchema(schema)
		this.manifest.parameterSchema = schema
		return this
	}

	addOutputSchema(schema: Schema) {
		this.outputSchema = schema
		this.commandBuilder.addOutputSchema(schema)
		this.manifest.outputSchema = schema
		return this
	}

	addContextSchema(schema: Schema) {
		this.contextSchema = schema
		this.manifest.contextSchema = schema
		return this
	}

	setContextSchema(schema: Schema) {
		return this.addContextSchema(schema)
	}

	exposeAsHttpEndpoint(
		method: string,
		path: string,
		contentTypeRequest?: string,
		contentEncodingRequest?: string,
		contentTypeResponse?: string,
		contentEncodingResponse?: string,
	) {
		this.commandBuilder.exposeAsHttpEndpoint(
			method as never,
			path,
			contentTypeRequest as never,
			contentEncodingRequest,
			contentTypeResponse as never,
			contentEncodingResponse,
		)
		this.manifest.httpExposure = {
			method,
			path,
			streamingMode: 'sse',
			requestContentType: contentTypeRequest,
			requestEncoding: contentEncodingRequest,
			responseContentType: contentTypeResponse,
			responseEncoding: contentEncodingResponse,
		}
		return this
	}

	setStreamingMode(mode: 'sse' | 'chunked' | 'buffered') {
		if (!this.manifest.httpExposure) {
			throw new Error('Call exposeAsHttpEndpoint before configuring the streaming mode')
		}
		this.manifest.httpExposure.streamingMode = mode
		return this
	}

	makeEndpointPublic() {
		this.commandBuilder.makeEndpointPublic()
		if (this.manifest.httpExposure) {
			this.manifest.httpExposure.public = true
		}
		return this
	}

	setHandler<
		Payload = unknown,
		Parameter = unknown,
		Resources extends Record<string, unknown> = Record<string, unknown>,
		Models extends Record<string, ModelProvider> = DeclaredModelMap<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases
		>,
	>(fn: AgentHandler<Payload, Parameter, Resources, Models, KnowledgeAliases>) {
		this.handler = fn as AgentHandler<
			unknown,
			unknown,
			Record<string, unknown>,
			Record<string, ModelProvider>,
			KnowledgeAliases
		>
		const executeAgent = async (
			thisArg: { config?: { runtime?: AgentRuntimeConfig<KnowledgeAliases> } },
			context: CommandFunctionContext | StreamFunctionContext,
			payload: unknown,
			parameter: unknown,
			onEnvelope?: (envelope: unknown) => Promise<void>,
		) => {
			const runtime = thisArg.config?.runtime
			if (!runtime?.handler) {
				throw new HandledError(StatusCode.InternalServerError, 'Agent runtime not configured')
			}

			const poolId = runtime.poolId
			const enqueuedAt = Date.now()
			await runtime.poolManager.acquire(poolId)
			const started = Date.now()

			const protocolBuffer = createProtocolBuffer(context, {
				onEnvelope,
			})

			try {
				const usage = {
					provider: undefined as string | undefined,
					promptTokens: 0,
					completionTokens: 0,
					costUsd: 0,
				}
				const logProviderWarnings = (
					capability: 'generate' | 'generateJson' | 'stream' | 'embed' | 'embedMany' | 'rerank',
					alias: string,
					providerName: string,
					metadata: Record<string, unknown> | undefined,
				) => {
					const warnings = getProviderWarnings(metadata)
					if (warnings.length === 0) {
						return
					}
					context.logger.warn(
						{
							agent: runtime.manifest.agentName,
							agentVersion: runtime.manifest.agentVersion,
							modelAlias: alias,
							provider: providerName,
							capability,
							warningCount: warnings.length,
							warnings,
						},
						'AI provider returned warnings',
					)
				}
				const logProviderFailure = (
					capability: 'generate' | 'generateJson' | 'stream' | 'embed' | 'embedMany' | 'rerank',
					alias: string,
					providerName: string,
					startedAt: number,
					error: unknown,
				) => {
					context.logger.error(
						{
							err: error,
							agent: runtime.manifest.agentName,
							agentVersion: runtime.manifest.agentVersion,
							modelAlias: alias,
							provider: providerName,
							capability,
							durationMs: Date.now() - startedAt,
						},
						'AI provider invocation failed',
					)
				}

				const instrumentedModels: Record<string, ModelProvider> = {}
				const instrumentedEmbeddings: Record<
					string,
					{
						name: string
						embed: (request: { value: string; metadata?: Record<string, unknown> }) => Promise<{
							embedding: number[]
							usage?: { tokens?: number }
							metadata?: Record<string, unknown>
						}>
						embedMany?: (request: { values: string[]; metadata?: Record<string, unknown> }) => Promise<{
							embeddings: number[][]
							usage?: { tokens?: number }
							metadata?: Record<string, unknown>
						}>
					}
				> = {}
				const instrumentedRerankers: Record<
					string,
					{
						name: string
						rerank: <Document = string | Record<string, unknown>>(request: {
							query: string
							documents: Document[]
							topN?: number
							metadata?: Record<string, unknown>
						}) => Promise<{
							ranking: Array<{ originalIndex: number; score: number; document: Document }>
							rerankedDocuments: Document[]
							metadata?: Record<string, unknown>
						}>
					}
				> = {}

				for (const [alias, provider] of Object.entries(runtime.models)) {
					const modelApi: ModelProvider = {
						name: provider.name,
						capabilities: provider.capabilities,
					}

					if (provider.generate) {
						modelApi.generate = async (request: {
							prompt: string
							context?: string
							metadata?: Record<string, unknown>
						}) => {
							const requestStartedAt = Date.now()
							try {
								const metadata = request.metadata ?? {}
								const aiSdkMetadata =
									typeof metadata.aiSdk === 'object' && metadata.aiSdk !== null
										? (metadata.aiSdk as Record<string, unknown>)
										: {}

								const result = await provider.generate?.({
									...request,
									metadata: {
										...metadata,
										aiSdk: {
											...(aiSdkMetadata.generate && typeof aiSdkMetadata.generate === 'object' ? aiSdkMetadata : {}),
											generate: {
												...((aiSdkMetadata.generate as Record<string, unknown> | undefined) ?? {}),
												experimental_telemetry: {
													isEnabled: true,
													functionId: `${runtime.manifest.agentName}.model.generate`,
													metadata: {
														agentName: runtime.manifest.agentName,
														agentVersion: runtime.manifest.agentVersion,
														poolId,
														modelAlias: alias,
													},
													tracer: runtime.tracer,
												},
											},
										},
									},
								})
								if (!result) {
									throw new HandledError(StatusCode.InternalServerError, 'Model generate provider unavailable')
								}
								logProviderWarnings('generate', alias, provider.name, result.metadata)
								usage.provider = provider.name
								usage.promptTokens += result.tokens?.prompt ?? 0
								usage.completionTokens += result.tokens?.completion ?? 0
								usage.costUsd += result.costUsd ?? 0
								return result
							} catch (error) {
								logProviderFailure('generate', alias, provider.name, requestStartedAt, error)
								throw error
							}
						}
					}

					if (provider.generateJson) {
						modelApi.generateJson = async <T = unknown>(request: {
							prompt: string
							context?: string
							schema?: unknown
							metadata?: Record<string, unknown>
						}): Promise<{
							data: T
							text: string
							reasoningText?: string
							tokens?: {
								prompt: number
								completion: number
							}
							metadata?: Record<string, unknown>
						}> => {
							const requestStartedAt = Date.now()
							try {
								const metadata = request.metadata ?? {}
								const aiSdkMetadata =
									typeof metadata.aiSdk === 'object' && metadata.aiSdk !== null
										? (metadata.aiSdk as Record<string, unknown>)
										: {}
								const result = await provider.generateJson?.({
									...request,
									metadata: {
										...metadata,
										aiSdk: {
											...(aiSdkMetadata.generateJson && typeof aiSdkMetadata.generateJson === 'object'
												? aiSdkMetadata
												: {}),
											generateJson: {
												...((aiSdkMetadata.generateJson as Record<string, unknown> | undefined) ?? {}),
												experimental_telemetry: {
													isEnabled: true,
													functionId: `${runtime.manifest.agentName}.model.generateJson`,
													metadata: {
														agentName: runtime.manifest.agentName,
														agentVersion: runtime.manifest.agentVersion,
														poolId,
														modelAlias: alias,
													},
													tracer: runtime.tracer,
												},
											},
										},
									},
								})
								if (!result) {
									throw new HandledError(StatusCode.InternalServerError, 'Model JSON provider unavailable')
								}
								logProviderWarnings('generateJson', alias, provider.name, result.metadata)
								usage.provider = provider.name
								usage.promptTokens += result.tokens?.prompt ?? 0
								usage.completionTokens += result.tokens?.completion ?? 0
								return result as {
									data: T
									text: string
									reasoningText?: string
									tokens?: {
										prompt: number
										completion: number
									}
									metadata?: Record<string, unknown>
								}
							} catch (error) {
								logProviderFailure('generateJson', alias, provider.name, requestStartedAt, error)
								throw error
							}
						}
					}

					if (provider.stream) {
						modelApi.stream = (request: { prompt: string; context?: string; metadata?: Record<string, unknown> }) => {
							const requestStartedAt = Date.now()
							let streamHandle: ReturnType<NonNullable<ModelProvider['stream']>> | undefined
							try {
								const metadata = request.metadata ?? {}
								const aiSdkMetadata =
									typeof metadata.aiSdk === 'object' && metadata.aiSdk !== null
										? (metadata.aiSdk as Record<string, unknown>)
										: {}

								streamHandle = provider.stream!({
									...request,
									metadata: {
										...metadata,
										aiSdk: {
											...(aiSdkMetadata.stream && typeof aiSdkMetadata.stream === 'object' ? aiSdkMetadata : {}),
											generate: {
												...((aiSdkMetadata.generate as Record<string, unknown> | undefined) ?? {}),
												experimental_telemetry: {
													isEnabled: true,
													functionId: `${runtime.manifest.agentName}.model.stream`,
													metadata: {
														agentName: runtime.manifest.agentName,
														agentVersion: runtime.manifest.agentVersion,
														poolId,
														modelAlias: alias,
													},
													tracer: runtime.tracer,
												},
											},
										},
									},
								})
							} catch (error) {
								logProviderFailure('stream', alias, provider.name, requestStartedAt, error)
								throw error
							}

							if (!streamHandle) {
								const error = new HandledError(StatusCode.InternalServerError, 'Model stream provider unavailable')
								logProviderFailure('stream', alias, provider.name, requestStartedAt, error)
								throw error
							}

							return {
								final: async () => {
									try {
										const result = await streamHandle.final()
										logProviderWarnings('stream', alias, provider.name, result.metadata)
										usage.provider = provider.name
										usage.promptTokens += result.tokens?.prompt ?? 0
										usage.completionTokens += result.tokens?.completion ?? 0
										usage.costUsd += result.costUsd ?? 0
										return result
									} catch (error) {
										logProviderFailure('stream', alias, provider.name, requestStartedAt, error)
										throw error
									}
								},
								[Symbol.asyncIterator]: streamHandle[Symbol.asyncIterator].bind(streamHandle),
							}
						}
					}

					if (provider.embed) {
						instrumentedEmbeddings[alias] = {
							name: provider.name,
							embed: async request => {
								const requestStartedAt = Date.now()
								try {
									const metadata = request.metadata ?? {}
									const aiSdkMetadata =
										typeof metadata.aiSdk === 'object' && metadata.aiSdk !== null
											? (metadata.aiSdk as Record<string, unknown>)
											: {}
									const result = await provider.embed!({
										...request,
										metadata: {
											...metadata,
											aiSdk: {
												...aiSdkMetadata,
												embed: {
													...((aiSdkMetadata.embed as Record<string, unknown> | undefined) ?? {}),
													experimental_telemetry: {
														isEnabled: true,
														functionId: `${runtime.manifest.agentName}.model.embed`,
														metadata: {
															agentName: runtime.manifest.agentName,
															agentVersion: runtime.manifest.agentVersion,
															poolId,
															modelAlias: alias,
														},
														tracer: runtime.tracer,
													},
												},
											},
										},
									})
									logProviderWarnings('embed', alias, provider.name, result?.metadata)
									return result
								} catch (error) {
									logProviderFailure('embed', alias, provider.name, requestStartedAt, error)
									throw error
								}
							},
							embedMany: provider.embedMany
								? async request => {
										const requestStartedAt = Date.now()
										try {
											const metadata = request.metadata ?? {}
											const aiSdkMetadata =
												typeof metadata.aiSdk === 'object' && metadata.aiSdk !== null
													? (metadata.aiSdk as Record<string, unknown>)
													: {}
											const result = await provider.embedMany!({
												...request,
												metadata: {
													...metadata,
													aiSdk: {
														...aiSdkMetadata,
														embedMany: {
															...((aiSdkMetadata.embedMany as Record<string, unknown> | undefined) ?? {}),
															experimental_telemetry: {
																isEnabled: true,
																functionId: `${runtime.manifest.agentName}.model.embedMany`,
																metadata: {
																	agentName: runtime.manifest.agentName,
																	agentVersion: runtime.manifest.agentVersion,
																	poolId,
																	modelAlias: alias,
																},
																tracer: runtime.tracer,
															},
														},
													},
												},
											})
											logProviderWarnings('embedMany', alias, provider.name, result?.metadata)
											return result
										} catch (error) {
											logProviderFailure('embedMany', alias, provider.name, requestStartedAt, error)
											throw error
										}
									}
								: undefined,
						}
					}

					if (provider.rerank) {
						instrumentedRerankers[alias] = {
							name: provider.name,
							rerank: async request => {
								const requestStartedAt = Date.now()
								try {
									const metadata = request.metadata ?? {}
									const aiSdkMetadata =
										typeof metadata.aiSdk === 'object' && metadata.aiSdk !== null
											? (metadata.aiSdk as Record<string, unknown>)
											: {}
									const result = (await provider.rerank!({
										...request,
										metadata: {
											...metadata,
											aiSdk: {
												...aiSdkMetadata,
												rerank: {
													...((aiSdkMetadata.rerank as Record<string, unknown> | undefined) ?? {}),
													experimental_telemetry: {
														isEnabled: true,
														functionId: `${runtime.manifest.agentName}.model.rerank`,
														metadata: {
															agentName: runtime.manifest.agentName,
															agentVersion: runtime.manifest.agentVersion,
															poolId,
															modelAlias: alias,
														},
														tracer: runtime.tracer,
													},
												},
											},
										},
									} as any)) as any
									logProviderWarnings('rerank', alias, provider.name, result?.metadata)
									return result as any
								} catch (error) {
									logProviderFailure('rerank', alias, provider.name, requestStartedAt, error)
									throw error
								}
							},
						}
					}

					if (modelApi.generate || modelApi.stream) {
						instrumentedModels[alias] = modelApi
					}
				}

				const agentContext = createAgentHandlerContext({
					serviceContext: context,
					payload,
					parameter,
					sessionStore: runtime.sessionStore,
					knowledgeAdapters: runtime.knowledgeAdapters,
					protocol: protocolBuffer.protocol,
					resources: runtime.resources,
					models: instrumentedModels,
					embeddings: instrumentedEmbeddings,
					rerankers: instrumentedRerankers,
					manifest: runtime.manifest,
				})

				const result = await runtime.handler(
					agentContext as AgentHandlerContext<
						unknown,
						unknown,
						Record<string, unknown>,
						Record<string, ModelProvider>,
						KnowledgeAliases
					>,
					payload,
					parameter,
				)

				const resultObject =
					typeof result === 'object' && result && 'message' in result ? (result as AgentHandlerResultObject) : undefined

				if (!protocolBuffer.protocol.has('message')) {
					if (typeof result === 'object' && result && 'message' in result) {
						protocolBuffer.protocol.emitMessage({
							content: result.message,
							summary: result.summary,
							final: true,
						})
					} else {
						protocolBuffer.protocol.emitMessage(result ?? '', { final: true })
					}
				}

				if (!protocolBuffer.protocol.has('telemetry')) {
					protocolBuffer.protocol.emitTelemetry({
						durationMs: Date.now() - started,
						waitTimeMs: started - enqueuedAt,
						poolId,
						provider: usage.provider ?? runtime.manifest.modelResource?.resourceName,
						usage: resultObject?.usage ?? {
							promptTokens: usage.promptTokens || undefined,
							completionTokens: usage.completionTokens || undefined,
							totalTokens:
								usage.promptTokens || usage.completionTokens ? usage.promptTokens + usage.completionTokens : undefined,
							costUsd: usage.costUsd || undefined,
						},
					})
				}

				await protocolBuffer.flush()
				return protocolBuffer.toEnvelopes()
			} catch (error) {
				context.logger.error({ err: error, agent: runtime.manifest.agentName }, 'agent handler failed')
				protocolBuffer.protocol.emitError(error)
				await protocolBuffer.flush()
				return protocolBuffer.toEnvelopes()
			} finally {
				runtime.poolManager.release(poolId)
			}
		}

		this.commandBuilder.setCommandFunction(async function commandImpl(
			this: { config?: { runtime?: AgentRuntimeConfig<KnowledgeAliases> } },
			context: CommandFunctionContext,
			payload: unknown,
			parameter: unknown,
		) {
			return await executeAgent(this, context, payload, parameter)
		})

		this.streamBuilder.setStreamFunction(async function streamImpl(
			this: { config?: { runtime?: AgentRuntimeConfig<KnowledgeAliases> } },
			context: StreamFunctionContext,
			payload: unknown,
			parameter: unknown,
			writer: StreamWriter<unknown, unknown[]>,
		) {
			const final = (await executeAgent(this, context, payload, parameter, async envelope => {
				await writer.write(envelope)
			})) as unknown[]
			await writer.close(final)
		})

		return this as AgentBuilder<
			KnowledgeAliases,
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases
		>
	}

	build(): AgentDefinition<KnowledgeAliases> {
		if (!this.handler) {
			throw new Error('Agent handler is required. Call setHandler() before build().')
		}

		if (!this.commandDefinitionAdded) {
			this.serviceBuilder.addCommandDefinition(this.commandBuilder.getDefinition())
			this.commandDefinitionAdded = true
		}
		if (!this.streamDefinitionAdded) {
			this.serviceBuilder.addStreamDefinition(this.streamBuilder.getDefinition())
			this.streamDefinitionAdded = true
		}

		const manifest: AgentManifest = {
			...this.manifest,
		}

		manifest.allowedTools = manifest.allowedTools ?? []
		const dependencies: AgentInstanceDependencies = {
			info: this.info,
			manifest,
			serviceBuilder: this.serviceBuilder,
			handler: this.handler,
		}

		return {
			info: this.info,
			manifest,
			schemas: {
				payload: this.payloadSchema,
				parameter: this.parameterSchema,
				output: this.outputSchema,
				context: this.contextSchema,
			},
			getManifest: () => manifest,
			getInstance: async (
				eventBridge,
				...options: [KnowledgeAliases] extends [never]
					? [options?: AgentInstanceOptions<KnowledgeAliases>]
					: [options: AgentInstanceOptions<KnowledgeAliases>]
			) => {
				const runtimeOptions = options[0] as AgentInstanceOptions<KnowledgeAliases> | undefined
				const instance = new AgentInstance(dependencies, eventBridge, runtimeOptions)
				return instance
			},
		}
	}
}
