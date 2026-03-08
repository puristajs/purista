import type { CommandFunctionContext, EventBridge, Schema, StreamFunctionContext, StreamWriter } from '@purista/core'
import { extendApi, HandledError, ServiceBuilder, StatusCode } from '@purista/core'
import { z } from 'zod/v4'

import type { KnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import type { ConversationStore } from '../memory/conversationStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import { toProtocolSseEvents } from '../protocol/sse.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import { agentProtocolEnvelopeSchema } from '../protocol/types.js'
import { generateText } from '../providers/runtime/generateText.js'
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
	AgentSseProtocol,
	AllowedToolDefinition,
	RetryPolicy,
} from '../types/AgentManifest.js'

/**
 * Supported model call kinds emitted by the AgentBuilder runtime wrappers.
 */
export type AgentModelCallKind =
	| 'generate'
	| 'generateJson'
	| 'stream'
	| 'embed'
	| 'embedMany'
	| 'rerank'
	| 'generateText'

/**
 * Normalized call options that can be prepared by hooks and merged into provider request metadata.
 */
export type AgentModelCallOptions = {
	/**
	 * Additional request metadata merged into `request.metadata`.
	 */
	metadata?: Record<string, unknown>
	/**
	 * AI SDK specific call options merged into `request.metadata.aiSdk`.
	 */
	aiSdk?: Record<string, unknown>
}

/**
 * Input passed to model call preparation hooks.
 */
export type AgentModelCallPrepareInput = {
	alias: string
	callKind: AgentModelCallKind
	/**
	 * 1-based sequential index of model invocations in the current agent run.
	 */
	step: number
	/**
	 * 1-based index scoped by model alias + call kind.
	 */
	stepByAliasAndKind: number
	/**
	 * Original request metadata provided by handler code for this call.
	 */
	requestMetadata?: Record<string, unknown>
}

/**
 * Hook executed before each model call (generate/stream/embed/...).
 */
export type AgentPrepareCallHook = (
	input: AgentModelCallPrepareInput,
) => Promise<AgentModelCallOptions | undefined> | AgentModelCallOptions | undefined

/**
 * Step-level hook similar to AI SDK `prepareStep`, invoked for each model call with deterministic step indexes.
 */
export type AgentPrepareStepHook = AgentPrepareCallHook

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
	conversationStore: ConversationStore
	knowledgeAdapters: Record<KnowledgeAliases, KnowledgeAdapter>
	poolManager: PoolManager
	resources: Record<string, unknown>
	models: Record<string, ModelProvider>
	eventBridge: EventBridge
	callOptionsSchema?: z.ZodType<AgentModelCallOptions>
	prepareCall?: AgentPrepareCallHook
	prepareStep?: AgentPrepareStepHook
	tracer?: import('@opentelemetry/api').Tracer
	poolId: string
	maxConcurrencyPerInstance: number
	concurrencyHints?: {
		replicaCountHint?: number
	}
}

const agentRuntimeConfigSchema = extendApi(
	z.object({
		runtime: z.record(z.string(), z.any()).optional(),
	}),
	{ title: 'AgentRuntimeConfig' },
)

const sseProtocolEventSchema = extendApi(
	z.object({
		event: z.string(),
		data: z.unknown(),
	}),
	{ title: 'AgentSseProtocolEvent' },
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

const getSseProtocolDocumentationUrl = (protocol: AgentSseProtocol): string | undefined => {
	if (protocol === 'ai-sdk-responses') {
		return 'https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol#openai-compatible-stream'
	}
	if (protocol === 'ai-sdk-ui-message' || protocol === 'ai-sdk-data' || protocol === 'ai-sdk-json-render') {
		return 'https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol'
	}
	if (protocol === 'agent2agent') {
		return 'https://google.github.io/A2A/'
	}
	if (protocol === 'mcp') {
		return 'https://modelcontextprotocol.io/specification/2025-06-18/'
	}
	return undefined
}

const isTerminalProtocolEvent = (event: { event: string; data: unknown }): boolean => {
	if (event.event === 'data') {
		if (event.data === '[DONE]') {
			return true
		}
		if (event.data && typeof event.data === 'object') {
			const maybeType = (event.data as { type?: unknown }).type
			return maybeType === 'finish' || maybeType === 'abort'
		}
		return false
	}
	if (event.event === 'response.completed' || event.event === 'response.error') {
		return true
	}
	return false
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
	private callOptionsSchema?: z.ZodType<AgentModelCallOptions>
	private prepareCallHook?: AgentPrepareCallHook
	private prepareStepHook?: AgentPrepareStepHook

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
		this.streamBuilder.addChunkSchema(z.union([agentProtocolEnvelopeSchema, sseProtocolEventSchema]))
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

	useConversationStore(config: AgentSessionConfig) {
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
			return this.useConversationStore(resolveHistoryPresetConfig(this.info, configOrPreset, overrides))
		}
		return this.useConversationStore(configOrPreset)
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
		return this.useConversationStore(config as AgentSessionConfig)
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

	/**
	 * Sets a validation schema for model call options returned by {@link prepareCall} / {@link prepareStep}.
	 *
	 * The schema is validated for every hook result before metadata is merged into model requests.
	 */
	setCallOptionsSchema(schema: z.ZodType<AgentModelCallOptions>) {
		this.callOptionsSchema = schema
		return this
	}

	/**
	 * Registers a per-model-call hook that can inject metadata and AI SDK call options dynamically.
	 */
	prepareCall(hook: AgentPrepareCallHook) {
		this.prepareCallHook = hook
		return this
	}

	/**
	 * Registers a step-aware hook invoked for each model call.
	 *
	 * Use this when call options need to change across iterative refinement passes.
	 */
	prepareStep(hook: AgentPrepareStepHook) {
		this.prepareStepHook = hook
		return this
	}

	exposeAsHttpEndpoint(
		method: string,
		path: string,
		contentTypeRequest?: string,
		contentEncodingRequest?: string,
		contentTypeResponse?: string,
		contentEncodingResponse?: string,
	) {
		this.streamBuilder.exposeAsHttpStreamEndpoint(
			method as never,
			path,
			contentTypeRequest as never,
			contentEncodingRequest,
		)
		this.streamBuilder.setHttpStreamProtocol('purista')
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

	/**
	 * Selects the SSE wire protocol for exposed stream endpoints.
	 *
	 * Defaults to `purista` when not set.
	 * This setting is only relevant when `streamingMode` is `sse`.
	 */
	setSseProtocol(protocol: AgentSseProtocol) {
		if (!this.manifest.httpExposure) {
			throw new Error('Call exposeAsHttpEndpoint before configuring the SSE protocol')
		}
		this.manifest.httpExposure.sseProtocol = protocol
		this.streamBuilder.setHttpStreamProtocol(protocol, getSseProtocolDocumentationUrl(protocol))
		return this
	}

	makeEndpointPublic() {
		this.streamBuilder.makeEndpointPublic()
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
			const acquireResult = await runtime.poolManager.acquire(poolId)
			const started = Date.now()
			const replicaCountHint =
				typeof runtime.concurrencyHints?.replicaCountHint === 'number' && runtime.concurrencyHints.replicaCountHint > 0
					? Math.trunc(runtime.concurrencyHints.replicaCountHint)
					: undefined
			const effectiveMaxConcurrencyHint =
				typeof replicaCountHint === 'number' ? replicaCountHint * runtime.maxConcurrencyPerInstance : undefined

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
				const stepCounters = {
					global: 0,
					byAliasAndKind: new Map<string, number>(),
				}

				const mergeAiSdkMetadata = (
					base: Record<string, unknown> | undefined,
					patch: Record<string, unknown> | undefined,
				) => {
					const next: Record<string, unknown> = {
						...(base ?? {}),
					}
					for (const [key, value] of Object.entries(patch ?? {})) {
						const existing = next[key]
						if (
							existing &&
							typeof existing === 'object' &&
							!Array.isArray(existing) &&
							value &&
							typeof value === 'object' &&
							!Array.isArray(value)
						) {
							next[key] = {
								...(existing as Record<string, unknown>),
								...(value as Record<string, unknown>),
							}
							continue
						}
						next[key] = value
					}
					return next
				}

				const mergeMetadata = (
					base: Record<string, unknown> | undefined,
					options: AgentModelCallOptions | undefined,
				): Record<string, unknown> => {
					const merged: Record<string, unknown> = {
						...(base ?? {}),
						...(options?.metadata ?? {}),
					}
					const baseAiSdk =
						merged.aiSdk && typeof merged.aiSdk === 'object' && !Array.isArray(merged.aiSdk)
							? (merged.aiSdk as Record<string, unknown>)
							: undefined
					const mergedAiSdk = mergeAiSdkMetadata(baseAiSdk, options?.aiSdk)
					if (Object.keys(mergedAiSdk).length > 0) {
						merged.aiSdk = mergedAiSdk
					}
					return merged
				}

				const addAiSdkTelemetry = (
					metadata: Record<string, unknown> | undefined,
					callKind: 'generate' | 'generateJson' | 'embed' | 'embedMany' | 'rerank' | 'stream',
					alias: string,
				): Record<string, unknown> => {
					const current = metadata ?? {}
					const aiSdk =
						current.aiSdk && typeof current.aiSdk === 'object' && !Array.isArray(current.aiSdk)
							? (current.aiSdk as Record<string, unknown>)
							: {}
					const aiSdkTargetKey = callKind === 'stream' ? 'generate' : callKind
					const aiSdkTarget =
						aiSdk[aiSdkTargetKey] && typeof aiSdk[aiSdkTargetKey] === 'object' && !Array.isArray(aiSdk[aiSdkTargetKey])
							? (aiSdk[aiSdkTargetKey] as Record<string, unknown>)
							: {}

					return {
						...current,
						aiSdk: {
							...aiSdk,
							[aiSdkTargetKey]: {
								...aiSdkTarget,
								experimental_telemetry: {
									isEnabled: true,
									functionId: `${runtime.manifest.agentName}.model.${callKind}`,
									metadata: {
										agentName: runtime.manifest.agentName,
										agentVersion: runtime.manifest.agentVersion,
										poolId,
										maxConcurrencyPerInstance: runtime.maxConcurrencyPerInstance,
										activeWorkers: acquireResult.activeWorkers,
										waitingWorkers: acquireResult.waitingWorkers,
										replicaCountHint,
										effectiveMaxConcurrencyHint,
										modelAlias: alias,
									},
									tracer: runtime.tracer,
								},
							},
						},
					}
				}

				const resolvePreparedMetadata = async (input: {
					alias: string
					callKind: AgentModelCallKind
					requestMetadata?: Record<string, unknown>
				}): Promise<Record<string, unknown> | undefined> => {
					const key = `${input.alias}:${input.callKind}`
					stepCounters.global += 1
					const kindStep = (stepCounters.byAliasAndKind.get(key) ?? 0) + 1
					stepCounters.byAliasAndKind.set(key, kindStep)

					const hookInput: AgentModelCallPrepareInput = {
						alias: input.alias,
						callKind: input.callKind,
						step: stepCounters.global,
						stepByAliasAndKind: kindStep,
						requestMetadata: input.requestMetadata,
					}

					const parseOptions = (value: AgentModelCallOptions | undefined): AgentModelCallOptions | undefined => {
						if (!value) {
							return undefined
						}
						if (runtime.callOptionsSchema) {
							return runtime.callOptionsSchema.parse(value)
						}
						return value
					}

					const preparedCall = parseOptions(await runtime.prepareCall?.(hookInput))
					const preparedStep = parseOptions(await runtime.prepareStep?.(hookInput))
					return mergeMetadata(mergeMetadata(input.requestMetadata, preparedCall), preparedStep)
				}

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
								const metadata = addAiSdkTelemetry(
									await resolvePreparedMetadata({
										alias,
										callKind: 'generate',
										requestMetadata: request.metadata,
									}),
									'generate',
									alias,
								)

								const result = await provider.generate?.({
									...request,
									metadata,
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
								const metadata = addAiSdkTelemetry(
									await resolvePreparedMetadata({
										alias,
										callKind: 'generateJson',
										requestMetadata: request.metadata,
									}),
									'generateJson',
									alias,
								)
								const result = await provider.generateJson?.({
									...request,
									metadata,
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
						const streamProvider = provider.stream.bind(provider)
						modelApi.stream = (request: { prompt: string; context?: string; metadata?: Record<string, unknown> }) => {
							const requestStartedAt = Date.now()
							let streamHandlePromise: Promise<ReturnType<NonNullable<ModelProvider['stream']>>> | undefined
							const resolveStream = async () => {
								streamHandlePromise ??= (async () => {
									try {
										const metadata = addAiSdkTelemetry(
											await resolvePreparedMetadata({
												alias,
												callKind: 'stream',
												requestMetadata: request.metadata,
											}),
											'stream',
											alias,
										)
										const streamHandle = streamProvider({
											...request,
											metadata,
										})
										if (!streamHandle) {
											throw new HandledError(StatusCode.InternalServerError, 'Model stream provider unavailable')
										}
										return streamHandle
									} catch (error) {
										logProviderFailure('stream', alias, provider.name, requestStartedAt, error)
										throw error
									}
								})()
								return await streamHandlePromise
							}

							return {
								final: async () => {
									try {
										const streamHandle = await resolveStream()
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
								async *[Symbol.asyncIterator]() {
									const streamHandle = await resolveStream()
									for await (const chunk of streamHandle) {
										yield chunk
									}
								},
							}
						}
					}

					if (provider.embed) {
						const embedProvider = provider.embed.bind(provider)
						const embedManyProvider = provider.embedMany?.bind(provider)
						instrumentedEmbeddings[alias] = {
							name: provider.name,
							embed: async request => {
								const requestStartedAt = Date.now()
								try {
									const metadata = addAiSdkTelemetry(
										await resolvePreparedMetadata({
											alias,
											callKind: 'embed',
											requestMetadata: request.metadata,
										}),
										'embed',
										alias,
									)
									const result = await embedProvider({
										...request,
										metadata,
									})
									logProviderWarnings('embed', alias, provider.name, result?.metadata)
									return result
								} catch (error) {
									logProviderFailure('embed', alias, provider.name, requestStartedAt, error)
									throw error
								}
							},
							embedMany: embedManyProvider
								? async request => {
										const requestStartedAt = Date.now()
										try {
											const metadata = addAiSdkTelemetry(
												await resolvePreparedMetadata({
													alias,
													callKind: 'embedMany',
													requestMetadata: request.metadata,
												}),
												'embedMany',
												alias,
											)
											const result = await embedManyProvider({
												...request,
												metadata,
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
						const rerankProvider = provider.rerank.bind(provider)
						instrumentedRerankers[alias] = {
							name: provider.name,
							rerank: async request => {
								const requestStartedAt = Date.now()
								try {
									const metadata = addAiSdkTelemetry(
										await resolvePreparedMetadata({
											alias,
											callKind: 'rerank',
											requestMetadata: request.metadata,
										}),
										'rerank',
										alias,
									)
									const result = (await rerankProvider({
										...request,
										metadata,
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
						modelApi.generateText = async request =>
							await generateText({
								model: modelApi,
								request: {
									prompt: request.prompt,
									context: request.context,
									metadata: request.metadata,
								},
								onReasoning: request.onReasoning,
								onTextDelta: request.onTextDelta,
							})
					}

					if (modelApi.generate || modelApi.stream) {
						instrumentedModels[alias] = modelApi
					}
				}

				const agentContext = createAgentHandlerContext({
					serviceContext: context,
					eventBridge: runtime.eventBridge,
					payload,
					parameter,
					conversationStore: runtime.conversationStore,
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
						waitTimeMs: acquireResult.waitTimeMs || started - enqueuedAt,
						poolId,
						maxConcurrencyPerInstance: runtime.maxConcurrencyPerInstance,
						activeWorkers: acquireResult.activeWorkers,
						waitingWorkers: acquireResult.waitingWorkers,
						replicaCountHint,
						effectiveMaxConcurrencyHint,
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
			const protocol = this.config?.runtime?.manifest.httpExposure?.sseProtocol ?? 'purista'
			const streamedEnvelopes: AgentProtocolEnvelope[] = []
			let emittedEventCount = 0
			const flushConvertedEvents = async (includeTerminal = false) => {
				const allEvents: Array<{ event: string; data: unknown }> = []
				for await (const event of toProtocolSseEvents(
					streamedEnvelopes,
					protocol as Exclude<AgentSseProtocol, 'purista'>,
				)) {
					allEvents.push(event)
				}
				const visibleEvents = includeTerminal ? allEvents : allEvents.filter(event => !isTerminalProtocolEvent(event))
				if (visibleEvents.length <= emittedEventCount) {
					return
				}
				for (const event of visibleEvents.slice(emittedEventCount)) {
					await writer.write(event as unknown)
				}
				emittedEventCount = visibleEvents.length
			}
			const final = (await executeAgent(
				this,
				context,
				payload,
				parameter,
				protocol === 'purista'
					? async envelope => {
							await writer.write(envelope)
						}
					: async envelope => {
							streamedEnvelopes.push(agentProtocolEnvelopeSchema.parse(envelope))
							await flushConvertedEvents(false)
						},
			)) as unknown[]

			if (protocol !== 'purista') {
				const finalEnvelopes = agentProtocolEnvelopeSchema.array().parse(final)
				streamedEnvelopes.splice(0, streamedEnvelopes.length, ...finalEnvelopes)
				await flushConvertedEvents(true)
			}

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
			callOptionsSchema: this.callOptionsSchema,
			prepareCall: this.prepareCallHook,
			prepareStep: this.prepareStepHook,
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
