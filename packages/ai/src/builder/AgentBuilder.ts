import {
	type AgentInvocation,
	type AgentInvokeList,
	type AgentProtocolResponse,
	type agentProtocolPayloadSchema,
	type CommandFunctionContext,
	type Complete,
	EBMessageType,
	type EmptyObject,
	type EventBridge,
	extendApi,
	HandledError,
	type Infer,
	type InferIn,
	type QueueJobContext,
	type QueueMessage,
	type Schema,
	ServiceBuilder,
	type ServiceBuilderTypes,
	StatusCode,
	type StreamFunctionContext,
	type StreamWriter,
	validate,
} from '@purista/core'
import { z } from 'zod'
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
import { createAgentExecutionBudget } from '../runtime/executionBudget.js'
import { resolveAgentExecutionLimits } from '../runtime/policy.js'
import type { AgentRunError, AgentRunState } from '../runtime/runState.js'
import { createAgentTerminalResult } from '../runtime/terminalResult.js'
import type { AgentDefinition, AgentInfo, AgentInstanceOptions, AgentTerminalResult } from '../types/AgentDefinition.js'
import type {
	AgentExecutionMode,
	AgentExecutionPolicy,
	AgentHistoryPreset,
	AgentManifest,
	AgentModelCapability,
	AgentPolicy,
	AgentSessionConfig,
	AgentSseProtocol,
	ReflectionPolicy,
	RetryPolicy,
} from '../types/AgentManifest.js'
import { deriveExecutionExtraScope, resolveAgentExecutionPolicy } from './agentExecutionPolicy.js'
import {
	getSseProtocolDocumentationUrl,
	isTerminalProtocolEvent,
	sseProtocolEventSchema,
} from './agentProtocolHelpers.js'
import {
	type DurableAgentQueuePayload,
	type DurableAgentQueueResult,
	durableAgentQueuePayloadSchema,
} from './agentQueuedExecution.js'

/**
 * Builder-time map of named runtime resources declared via {@link AgentBuilder.defineResource}.
 */
export type AgentDeclaredResourceMap = Record<string, unknown>

/**
 * Guard hook that runs before the agent handler executes.
 *
 * Use before-guards for short request policy checks such as auth, quota, or
 * lightweight validation that is more specific than payload schema validation.
 */
export type AgentBeforeGuardHook<Payload = unknown, Parameter = unknown> = (
	context: CommandFunctionContext | StreamFunctionContext,
	payload: Payload,
	parameter: Parameter,
) => Promise<void> | void

/**
 * Guard hook that runs after the agent handler completes successfully.
 *
 * Use after-guards for cheap audit or policy side effects. Keep them small and
 * deterministic, just like command and stream guard hooks in core builders.
 */
export type AgentAfterGuardHook<Payload = unknown, Parameter = unknown> = (
	context: CommandFunctionContext | StreamFunctionContext,
	payload: Payload,
	parameter: Parameter,
	result: AgentHandlerResult,
) => Promise<void> | void

export type AgentInvokeConfig<Payload extends Schema, Parameter extends Schema> = {
	payloadSchema?: Payload
	parameterSchema?: Parameter
}

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

export type AgentHandlerResultObject = {
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
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = EmptyObject,
> = (
	context: AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads>,
	payload: Payload,
	parameter: Parameter,
) => Promise<AgentHandlerResult> | AgentHandlerResult

type AgentRuntimeConfig<EmitPayloads extends Record<string, unknown> = Record<string, unknown>> = {
	handler: AgentHandler<
		unknown,
		unknown,
		Record<string, unknown>,
		Record<string, ModelProvider>,
		AgentInvokeList,
		EmitPayloads
	>
	manifest: AgentManifest
	conversationStore: ConversationStore
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
		__agentRuntime: z.any().optional(),
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
		successEventName: info.successEventName?.trim(),
	}
}

const QUEUED_PROTOCOL_PAGE_SIZE = 25

type QueuedProtocolMeta = {
	pageSize: number
	lastSequence: number
	terminal: boolean
}

const getRequestedQualityProfileName = (payload: unknown, parameter: unknown) => {
	const payloadProfile =
		payload &&
		typeof payload === 'object' &&
		typeof (payload as { qualityProfile?: unknown }).qualityProfile === 'string'
			? (payload as { qualityProfile: string }).qualityProfile || undefined
			: undefined
	if (payloadProfile) {
		return payloadProfile
	}
	const parameterProfile =
		parameter &&
		typeof parameter === 'object' &&
		typeof (parameter as { qualityProfile?: unknown }).qualityProfile === 'string'
			? (parameter as { qualityProfile: string }).qualityProfile || undefined
			: undefined
	return parameterProfile
}

const queuedProtocolMetaKey = (agentName: string, runId: string) =>
	`purista:ai:queued-protocol:${agentName}:${runId}:meta`
const queuedProtocolPageKey = (agentName: string, runId: string, page: number) =>
	`purista:ai:queued-protocol:${agentName}:${runId}:page:${String(page).padStart(6, '0')}`

const parseQueuedProtocolMeta = (value: unknown): QueuedProtocolMeta => {
	if (!value || typeof value !== 'object') {
		return {
			pageSize: QUEUED_PROTOCOL_PAGE_SIZE,
			lastSequence: 0,
			terminal: false,
		}
	}
	return {
		pageSize:
			typeof (value as { pageSize?: unknown }).pageSize === 'number'
				? (value as { pageSize: number }).pageSize
				: QUEUED_PROTOCOL_PAGE_SIZE,
		lastSequence:
			typeof (value as { lastSequence?: unknown }).lastSequence === 'number'
				? (value as { lastSequence: number }).lastSequence
				: 0,
		terminal:
			typeof (value as { terminal?: unknown }).terminal === 'boolean'
				? (value as { terminal: boolean }).terminal
				: false,
	}
}

const sleep = async (durationMs: number) => await new Promise(resolve => setTimeout(resolve, durationMs))

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

export type ResolveCapability<
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

export type DeclaredModelAliasApi<
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
	(Alias extends TextAliases | StreamAliases
		? {
				generateText: NonNullable<ModelProvider['generateText']>
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

export type DeclaredModelMap<
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
	ModelAliases extends string = never,
	TextAliases extends string = never,
	StreamAliases extends string = never,
	EmbeddingAliases extends string = never,
	RerankAliases extends string = never,
	ObjectAliases extends string = never,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	SkillNames extends string = never,
	Resources extends AgentDeclaredResourceMap = EmptyObject,
	EmitPayloads extends Record<string, unknown> = EmptyObject,
	ConfigType extends Record<string, unknown> = EmptyObject,
	ConfigInputType extends Record<string, unknown> = EmptyObject,
> {
	private readonly info: AgentInfo
	private readonly serviceBuilder: ServiceBuilder<
		ServiceBuilderTypes<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
	>
	private readonly commandBuilder: ReturnType<
		ServiceBuilder<
			ServiceBuilderTypes<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
		>['getCommandBuilder']
	>
	private readonly streamBuilder: ReturnType<
		ServiceBuilder<
			ServiceBuilderTypes<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
		>['getStreamBuilder']
	>
	private queueDefinitionAdded = false
	private queueWorkerDefinitionAdded = false
	private commandDefinitionAdded = false
	private streamDefinitionAdded = false
	private manifest: AgentManifest
	private handler?: AgentHandler<
		unknown,
		unknown,
		Record<string, unknown>,
		Record<string, ModelProvider>,
		AgentInvokeList,
		EmitPayloads
	>
	private runtimeConfigSchema?: Schema
	private defaultRuntimeConfig?: Complete<ConfigType>
	private declaredBeforeGuardHooks: Record<string, AgentBeforeGuardHook<any, any>> = {}
	private declaredAfterGuardHooks: Record<string, AgentAfterGuardHook<any, any>> = {}
	private declaredEmitSchemas: Record<string, Schema> = {}

	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private outputSchema?: Schema
	private contextSchema?: Schema
	private callOptionsSchema?: z.ZodType<AgentModelCallOptions>
	private prepareCallHook?: AgentPrepareCallHook
	private prepareStepHook?: AgentPrepareStepHook

	constructor(info: AgentInfo) {
		this.info = normalizeInfo(info)
		this.serviceBuilder = new ServiceBuilder<
			ServiceBuilderTypes<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
		>({
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
			allowedAgents: [],
		}
	}

	setDescription(description: string) {
		this.manifest.description = description
		return this
	}

	/**
	 * Declare the shape of host-provided runtime config passed through `getInstance(..., { config })`.
	 *
	 * Use this for agent-specific configuration that varies by environment, deployment, or tenant.
	 * Do not use it for concrete runtime dependencies like model providers or queue bridges.
	 *
	 * @example
	 * ```ts
	 * const supportAgent = new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
	 *   .setConfigSchema(z.object({ locale: z.string().default('en') }))
	 * ```
	 */
	setConfigSchema<T extends Schema>(schema: T) {
		this.runtimeConfigSchema = schema
		return this as unknown as AgentBuilder<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases,
			AgentInvokes,
			SkillNames,
			Resources,
			EmitPayloads,
			Infer<T> extends Record<string, unknown> ? Infer<T> : EmptyObject,
			InferIn<T> extends Record<string, unknown> ? InferIn<T> : EmptyObject
		>
	}

	/**
	 * Provide default values for the runtime config declared via {@link setConfigSchema}.
	 *
	 * These defaults are merged before validation and can still be overridden via `getInstance(..., { config })`.
	 */
	setDefaultConfig(config: Complete<ConfigType>) {
		this.defaultRuntimeConfig = config
		return this
	}

	/**
	 * Mark the agent endpoints as deprecated.
	 *
	 * This mirrors the core builder behavior and propagates deprecation metadata to the underlying run command and stream.
	 */
	markAsDeprecated() {
		this.commandBuilder.markAsDeprecated()
		if ('markAsDeprecated' in this.streamBuilder && typeof this.streamBuilder.markAsDeprecated === 'function') {
			this.streamBuilder.markAsDeprecated()
		}
		this.manifest.deprecated = true
		this.manifest.metadata = {
			...(this.manifest.metadata ?? {}),
			deprecated: true,
		}
		return this
	}

	/**
	 * Declare that the agent requires a runtime resource passed through `getInstance(..., { resources })`.
	 *
	 * This follows the same builder-time declaration pattern as services.
	 *
	 * @example
	 * ```ts
	 * new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
	 *   .defineResource<'sandbox', SandboxExecutionResource>()
	 * ```
	 */
	defineResource<ResourceName extends string, ResourceType>() {
		this.serviceBuilder.defineResource<ResourceName, ResourceType>()
		return this as unknown as AgentBuilder<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases,
			AgentInvokes,
			SkillNames,
			Resources & { [K in ResourceName]: ResourceType },
			EmitPayloads,
			ConfigType,
			ConfigInputType
		>
	}

	useEventBridge(name: string) {
		this.manifest.eventBridge = name
		return this
	}

	defineModel<const Alias extends string, const Caps extends readonly AgentModelCapability[] | undefined = undefined>(
		alias: Alias,
		options?: { capabilities?: Caps },
	): AgentBuilder<
		ModelAliases | Alias,
		TextAliases | (ResolveCapability<Caps, 'text'> extends true ? Alias : never),
		StreamAliases | (ResolveCapability<Caps, 'stream'> extends true ? Alias : never),
		EmbeddingAliases | (ResolveCapability<Caps, 'embedding'> extends true ? Alias : never),
		RerankAliases | (ResolveCapability<Caps, 'rerank'> extends true ? Alias : never),
		ObjectAliases | (ResolveCapability<Caps, 'json'> extends true ? Alias : never),
		AgentInvokes,
		SkillNames,
		Resources,
		EmitPayloads,
		ConfigType,
		ConfigInputType
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
			ModelAliases | Alias,
			TextAliases | (ResolveCapability<Caps, 'text'> extends true ? Alias : never),
			StreamAliases | (ResolveCapability<Caps, 'stream'> extends true ? Alias : never),
			EmbeddingAliases | (ResolveCapability<Caps, 'embedding'> extends true ? Alias : never),
			RerankAliases | (ResolveCapability<Caps, 'rerank'> extends true ? Alias : never),
			ObjectAliases | (ResolveCapability<Caps, 'json'> extends true ? Alias : never),
			AgentInvokes,
			SkillNames,
			Resources,
			EmitPayloads,
			ConfigType,
			ConfigInputType
		>
	}

	useConversationStore(config: AgentSessionConfig) {
		this.manifest.session = config
		return this
	}

	useSkills<const Names extends readonly string[]>(
		skillNames: Names,
	): AgentBuilder<
		ModelAliases,
		TextAliases,
		StreamAliases,
		EmbeddingAliases,
		RerankAliases,
		ObjectAliases,
		AgentInvokes,
		SkillNames | Names[number],
		Resources,
		EmitPayloads,
		ConfigType,
		ConfigInputType
	> {
		const names = [...new Set(skillNames.map(entry => entry.trim()).filter(Boolean))]
		this.manifest.skills = {
			resourceName: this.manifest.skills?.resourceName ?? 'skills',
			names,
		}

		this.manifest.resources = {
			...(this.manifest.resources ?? {}),
			skills: {
				resourceName: this.manifest.resources?.skills?.resourceName || 'skills',
			},
		}

		return this as unknown as AgentBuilder<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases,
			AgentInvokes,
			SkillNames | Names[number],
			Resources,
			EmitPayloads,
			ConfigType,
			ConfigInputType
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

	setExecutionMode(mode: AgentExecutionMode) {
		this.manifest.executionMode = mode
		return this
	}

	setExecutionPolicy(policy: AgentExecutionPolicy) {
		this.manifest.executionPolicy = {
			...(this.manifest.executionPolicy ?? {}),
			...policy,
			cleanup: {
				...(this.manifest.executionPolicy?.cleanup ?? {}),
				...(policy.cleanup ?? {}),
			},
		}
		return this
	}

	setAgentPolicy(policy: AgentPolicy) {
		this.manifest.agentPolicy = {
			...(this.manifest.agentPolicy ?? {}),
			...policy,
			quality: {
				...(this.manifest.agentPolicy?.quality ?? {}),
				...(policy.quality ?? {}),
				profiles: {
					...(this.manifest.agentPolicy?.quality?.profiles ?? {}),
					...(policy.quality?.profiles ?? {}),
				},
			},
			approvals: {
				...(this.manifest.agentPolicy?.approvals ?? {}),
				...(policy.approvals ?? {}),
				checkpoints: {
					...(this.manifest.agentPolicy?.approvals?.checkpoints ?? {}),
					...(policy.approvals?.checkpoints ?? {}),
				},
			},
			resources: {
				...(this.manifest.agentPolicy?.resources ?? {}),
				...(policy.resources ?? {}),
			},
		}
		return this
	}

	setReflectionPolicy(policy: ReflectionPolicy) {
		this.manifest.reflection = {
			...(this.manifest.reflection ?? {}),
			...policy,
			presets: {
				...(this.manifest.reflection?.presets ?? {}),
				...(policy.presets ?? {}),
			},
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

	canInvoke(
		serviceName: string,
		serviceVersion: string,
		commandName: string,
		outputSchema?: Schema,
		payloadSchema?: Schema,
		parameterSchema?: Schema,
	) {
		this.commandBuilder.canInvoke(
			serviceName,
			serviceVersion,
			commandName,
			outputSchema,
			payloadSchema,
			parameterSchema,
		)
		this.streamBuilder.canInvoke(serviceName, serviceVersion, commandName, outputSchema, payloadSchema, parameterSchema)

		const alreadyRegistered = this.manifest.allowedTools.some(
			tool =>
				tool.serviceName === serviceName && tool.serviceVersion === serviceVersion && tool.commandName === commandName,
		)

		if (!alreadyRegistered) {
			this.manifest.allowedTools = [
				...this.manifest.allowedTools,
				{
					serviceName,
					serviceVersion,
					commandName,
					outputSchema,
					payloadSchema,
					parameterSchema,
				},
			]
		}

		return this
	}

	canInvokeAgent<
		Payload extends Schema = typeof agentProtocolPayloadSchema,
		Parameter extends Schema = Schema,
		SName extends string = string,
		Version extends string = string,
	>(
		agentName: SName,
		agentVersion: Version,
		invokeConfigOrParameterSchema?: Parameter | AgentInvokeConfig<Payload, Parameter>,
	): AgentBuilder<
		ModelAliases,
		TextAliases,
		StreamAliases,
		EmbeddingAliases,
		RerankAliases,
		ObjectAliases,
		AgentInvokes &
			Record<
				SName,
				Record<
					Version,
					{
						call: (payload: InferIn<Payload>, parameter?: InferIn<Parameter>) => AgentInvocation<AgentProtocolResponse>
					}
				>
			>,
		SkillNames,
		Resources,
		EmitPayloads,
		ConfigType,
		ConfigInputType
	> {
		this.commandBuilder.canInvokeAgent(agentName, agentVersion, invokeConfigOrParameterSchema)
		this.streamBuilder.canInvokeAgent(agentName, agentVersion, invokeConfigOrParameterSchema)
		const invokeConfig =
			invokeConfigOrParameterSchema &&
			typeof invokeConfigOrParameterSchema === 'object' &&
			!('~standard' in invokeConfigOrParameterSchema) &&
			('payloadSchema' in invokeConfigOrParameterSchema || 'parameterSchema' in invokeConfigOrParameterSchema)
				? (invokeConfigOrParameterSchema as AgentInvokeConfig<Payload, Parameter>)
				: undefined
		const payloadSchema = invokeConfig?.payloadSchema
		const parameterSchema = invokeConfig
			? invokeConfig.parameterSchema
			: (invokeConfigOrParameterSchema as Parameter | undefined)

		const alreadyRegistered =
			this.manifest.allowedAgents?.some(
				agent => agent.agentName === agentName && agent.agentVersion === agentVersion,
			) ?? false

		if (!alreadyRegistered) {
			this.manifest.allowedAgents = [
				...(this.manifest.allowedAgents ?? []),
				{
					agentName,
					agentVersion,
					payloadSchema,
					parameterSchema,
				},
			]
		}

		return this as unknown as AgentBuilder<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases,
			AgentInvokes &
				Record<
					SName,
					Record<
						Version,
						{
							call: (
								payload: InferIn<Payload>,
								parameter?: InferIn<Parameter>,
							) => AgentInvocation<AgentProtocolResponse>
						}
					>
				>,
			SkillNames,
			Resources,
			EmitPayloads,
			ConfigType,
			ConfigInputType
		>
	}

	canEmit<EventName extends string, T extends Schema>(
		eventName: EventName,
		schema: T,
	): AgentBuilder<
		ModelAliases,
		TextAliases,
		StreamAliases,
		EmbeddingAliases,
		RerankAliases,
		ObjectAliases,
		AgentInvokes,
		SkillNames,
		Resources,
		EmitPayloads & { [K in EventName]: InferIn<T> },
		ConfigType,
		ConfigInputType
	> {
		this.declaredEmitSchemas[eventName] = schema
		this.commandBuilder.canEmit(eventName, schema)
		this.streamBuilder.canEmit(eventName, schema)
		return this as unknown as AgentBuilder<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases,
			AgentInvokes,
			SkillNames,
			Resources,
			EmitPayloads & { [K in EventName]: InferIn<T> },
			ConfigType,
			ConfigInputType
		>
	}

	/**
	 * Register one or more guard hooks that run before the agent handler logic executes.
	 *
	 * Use before guards for request-policy concerns like auth, quota checks, or tenant validation.
	 * Keep business logic in the handler itself.
	 */
	setBeforeGuardHooks(hooks: Record<string, AgentBeforeGuardHook<unknown, unknown>>) {
		const builder = this
		this.declaredBeforeGuardHooks = {
			...this.declaredBeforeGuardHooks,
			...hooks,
		}
		this.commandBuilder.setBeforeGuardHooks(
			Object.fromEntries(
				Object.entries(hooks).map(([name, hook]) => [
					name,
					async function agentCommandBeforeGuard(
						this: CommandFunctionContext,
						context: CommandFunctionContext,
						payload: unknown,
						parameter: unknown,
					) {
						if (builder.manifest.executionMode === 'queued') {
							return
						}
						await hook(context, payload, parameter)
					},
				]),
			) as Record<string, never>,
		)
		this.streamBuilder.setBeforeGuardHooks(
			Object.fromEntries(
				Object.entries(hooks).map(([name, hook]) => [
					name,
					async function agentStreamBeforeGuard(
						this: StreamFunctionContext,
						context: StreamFunctionContext,
						payload: unknown,
						parameter: unknown,
					) {
						if (builder.manifest.executionMode === 'queued') {
							return
						}
						await hook(context, payload, parameter)
					},
				]),
			) as Record<string, never>,
		)
		return this
	}

	getBeforeGuardHook(name: keyof typeof this.declaredBeforeGuardHooks) {
		return this.declaredBeforeGuardHooks[name]
	}

	/**
	 * Register one or more guard hooks that run after the agent handler logic completed successfully.
	 */
	setAfterGuardHooks(hooks: Record<string, AgentAfterGuardHook<unknown, unknown>>) {
		const builder = this
		this.declaredAfterGuardHooks = {
			...this.declaredAfterGuardHooks,
			...hooks,
		}
		this.commandBuilder.setAfterGuardHooks(
			Object.fromEntries(
				Object.entries(hooks).map(([name, hook]) => [
					name,
					async function agentCommandAfterGuard(
						this: CommandFunctionContext,
						context: CommandFunctionContext,
						result: unknown,
						payload: unknown,
						parameter: unknown,
					) {
						if (builder.manifest.executionMode === 'queued') {
							return
						}
						await hook(context, payload, parameter, result as AgentHandlerResult)
					},
				]),
			) as Record<string, never>,
		)
		this.streamBuilder.setAfterGuardHooks(
			Object.fromEntries(
				Object.entries(hooks).map(([name, hook]) => [
					name,
					async function agentStreamAfterGuard(
						this: StreamFunctionContext,
						context: StreamFunctionContext,
						result: unknown,
						payload: unknown,
						parameter: unknown,
					) {
						if (builder.manifest.executionMode === 'queued') {
							return
						}
						await hook(context, payload, parameter, result as AgentHandlerResult)
					},
				]),
			) as Record<string, never>,
		)
		return this
	}

	getAfterGuardHook(name: keyof typeof this.declaredAfterGuardHooks) {
		return this.declaredAfterGuardHooks[name]
	}

	setSuccessEventName(eventName: string) {
		this.info.successEventName = eventName.trim()
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
		this.streamBuilder.setHttpStreamingMode('stream')
		this.streamBuilder.setHttpStreamProtocol('purista')
		this.manifest.httpExposure = {
			method,
			path,
			streamingMode: 'stream',
			requestContentType: contentTypeRequest,
			requestEncoding: contentEncodingRequest,
			responseContentType: contentTypeResponse,
			responseEncoding: contentEncodingResponse,
		}
		return this
	}

	setStreamingMode(mode: 'stream' | 'aggregate') {
		if (!this.manifest.httpExposure) {
			throw new Error('Call exposeAsHttpEndpoint before configuring the streaming mode')
		}
		this.manifest.httpExposure.streamingMode = mode
		this.streamBuilder.setHttpStreamingMode(mode)
		return this
	}

	/**
	 * Selects the SSE wire protocol for exposed stream endpoints.
	 *
	 * Defaults to `purista` when not set.
	 * This setting is only relevant when `streamingMode` is `stream`.
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
		HandlerResources extends Record<string, unknown> = Resources,
		Models extends Record<string, ModelProvider> = DeclaredModelMap<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases
		>,
	>(fn: AgentHandler<Payload, Parameter, HandlerResources, Models, AgentInvokes, EmitPayloads>) {
		this.handler = fn as AgentHandler<
			unknown,
			unknown,
			Record<string, unknown>,
			Record<string, ModelProvider>,
			AgentInvokeList,
			EmitPayloads
		>
		const queueName = `agent:${this.info.agentName}:${this.info.agentVersion}:run`
		const workerName = 'execute'
		this.commandBuilder.canEnqueue(queueName, durableAgentQueuePayloadSchema)
		this.streamBuilder.canEnqueue(queueName, durableAgentQueuePayloadSchema)
		const resolveExecutionPolicy = () => resolveAgentExecutionPolicy(this.manifest.executionPolicy)
		const deriveExtraScope = (payload: unknown) =>
			deriveExecutionExtraScope(payload, resolveExecutionPolicy().scopeFromPayload)
		const normalizeAgentError = (error: unknown): AgentRunError => {
			if (error instanceof HandledError) {
				return {
					code: String(error.errorCode),
					message: error.message,
					handled: true,
				}
			}
			if (error instanceof Error) {
				return {
					code: 'UnhandledError',
					message: error.message,
					handled: false,
				}
			}
			return {
				code: 'UnhandledError',
				message: typeof error === 'string' ? error : 'Unknown queued agent error',
				handled: false,
			}
		}
		const createQueuedProtocolContext = (
			runtime: AgentRuntimeConfig<EmitPayloads>,
			context: QueueJobContext<DurableAgentQueuePayload>,
			message: QueueMessage<DurableAgentQueuePayload>,
		) =>
			({
				...context,
				message: {
					...message,
					messageType: EBMessageType.Command,
					receiver: {
						serviceName: runtime.manifest.agentName,
						serviceVersion: runtime.manifest.agentVersion,
						serviceTarget: 'run',
						instanceId: `queued-worker:${process.pid}`,
					},
					timestamp: message.createdAt,
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					id: message.payload.sessionId ?? message.id,
					correlationId: message.correlationId ?? message.id,
					principalId: message.payload.principalId,
					tenantId: message.payload.tenantId,
					sender: {
						serviceName: runtime.manifest.agentName,
						serviceVersion: runtime.manifest.agentVersion,
						serviceTarget: 'run',
						instanceId: `queued-worker:${process.pid}`,
					},
				},
				emit: (async (
					eventName: string,
					eventPayload?: unknown,
					contentType = 'application/json',
					contentEncoding = 'utf-8',
				) => {
					const schema = this.declaredEmitSchemas[eventName]
					if (!schema) {
						throw new HandledError(StatusCode.InternalServerError, `No schema for ${eventName} found`)
					}
					const validation = await validate(schema, eventPayload)
					if (!validation.success) {
						throw new HandledError(
							StatusCode.InternalServerError,
							`Payload validation for event ${eventName} failed`,
							validation.issues,
						)
					}

					await runtime.eventBridge.emitMessage({
						messageType: EBMessageType.CustomMessage,
						eventName,
						payload: validation.data,
						contentType,
						contentEncoding,
						traceId: message.traceId,
						principalId: message.payload.principalId,
						tenantId: message.payload.tenantId,
						sender: {
							serviceName: runtime.manifest.agentName,
							serviceVersion: runtime.manifest.agentVersion,
							serviceTarget: 'run',
							instanceId: `queued-worker:${process.pid}`,
						},
					})
				}) as CommandFunctionContext['emit'],
				invokeAgent: (context as { invokeAgent?: EmptyObject }).invokeAgent ?? ({} as EmptyObject),
			}) as unknown as CommandFunctionContext
		const getResolvedExecutionLimits = (
			runtime: AgentRuntimeConfig<EmitPayloads>,
			payload: unknown,
			parameter: unknown,
		) =>
			resolveAgentExecutionLimits(
				runtime.manifest.agentPolicy,
				runtime.manifest.reflection,
				runtime.manifest.executionPolicy,
				getRequestedQualityProfileName(payload, parameter),
			)
		const emitAgentSuccessEvent = async (
			runtime: AgentRuntimeConfig<EmitPayloads>,
			context: CommandFunctionContext | StreamFunctionContext,
			result: AgentTerminalResult,
		) => {
			if (!this.info.successEventName) {
				return
			}
			await runtime.eventBridge.emitMessage({
				messageType: EBMessageType.CustomMessage,
				eventName: this.info.successEventName,
				payload: result,
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				traceId: context.message.traceId,
				principalId: context.message.principalId,
				tenantId: context.message.tenantId,
				sender: {
					serviceName: runtime.manifest.agentName,
					serviceVersion: runtime.manifest.agentVersion,
					serviceTarget: 'run',
					instanceId: context.message.receiver.instanceId ?? context.message.sender.instanceId,
				},
			})
		}
		const readQueuedProtocolMeta = async (
			context: Pick<QueueJobContext | CommandFunctionContext | StreamFunctionContext, 'states'>,
			agentName: string,
			runId: string,
		) => {
			const key = queuedProtocolMetaKey(agentName, runId)
			const state = await context.states.getState(key)
			return parseQueuedProtocolMeta(state[key])
		}
		const writeQueuedProtocolMeta = async (
			context: Pick<QueueJobContext | CommandFunctionContext | StreamFunctionContext, 'states'>,
			agentName: string,
			runId: string,
			meta: QueuedProtocolMeta,
		) => {
			await context.states.setState(queuedProtocolMetaKey(agentName, runId), meta)
		}
		const appendQueuedProtocolEnvelope = async (
			context: Pick<QueueJobContext | CommandFunctionContext | StreamFunctionContext, 'states'>,
			agentName: string,
			runId: string,
			envelope: AgentProtocolEnvelope,
			options?: { terminal?: boolean },
		) => {
			const meta = await readQueuedProtocolMeta(context, agentName, runId)
			const nextSequence = meta.lastSequence + 1
			const pageIndex = Math.floor((nextSequence - 1) / meta.pageSize)
			const key = queuedProtocolPageKey(agentName, runId, pageIndex)
			const current = await context.states.getState(key)
			const page = agentProtocolEnvelopeSchema.array().catch([]).parse(current[key])
			page.push(agentProtocolEnvelopeSchema.parse(envelope))
			await context.states.setState(key, page)
			await writeQueuedProtocolMeta(context, agentName, runId, {
				pageSize: meta.pageSize,
				lastSequence: nextSequence,
				terminal: options?.terminal ?? meta.terminal,
			})
		}
		const readQueuedProtocolSince = async (
			context: Pick<CommandFunctionContext | StreamFunctionContext, 'states'>,
			agentName: string,
			runId: string,
			nextSequence: number,
		) => {
			const meta = await readQueuedProtocolMeta(context, agentName, runId)
			if (meta.lastSequence < nextSequence) {
				return {
					meta,
					envelopes: [] as AgentProtocolEnvelope[],
					nextSequence,
				}
			}
			const envelopes: AgentProtocolEnvelope[] = []
			for (let sequence = nextSequence; sequence <= meta.lastSequence; ) {
				const pageIndex = Math.floor((sequence - 1) / meta.pageSize)
				const key = queuedProtocolPageKey(agentName, runId, pageIndex)
				const state = await context.states.getState(key)
				const page = agentProtocolEnvelopeSchema.array().catch([]).parse(state[key])
				const offset = (sequence - 1) % meta.pageSize
				for (const envelope of page.slice(offset)) {
					envelopes.push(envelope)
					sequence += 1
				}
				if (page.length === 0) {
					break
				}
			}
			return {
				meta,
				envelopes,
				nextSequence: meta.lastSequence + 1,
			}
		}
		const clearQueuedProtocolState = async (
			context: Pick<QueueJobContext | CommandFunctionContext | StreamFunctionContext, 'states'>,
			agentName: string,
			runId: string,
		) => {
			const meta = await readQueuedProtocolMeta(context, agentName, runId)
			const pageCount = meta.lastSequence > 0 ? Math.ceil(meta.lastSequence / meta.pageSize) : 0
			for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
				await context.states.removeState(queuedProtocolPageKey(agentName, runId, pageIndex))
			}
			await context.states.removeState(queuedProtocolMetaKey(agentName, runId))
		}
		const executeAgent = async (
			thisArg: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
			context: CommandFunctionContext | StreamFunctionContext,
			payload: unknown,
			parameter: unknown,
			onEnvelope?: (envelope: unknown) => Promise<void>,
		) => {
			const runtime = thisArg.config?.__agentRuntime
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
			const executionLimits = getResolvedExecutionLimits(runtime, payload, parameter)
			const executionBudget = createAgentExecutionBudget({
				modelSteps: executionLimits.maxModelSteps,
				toolCalls: executionLimits.maxToolCalls,
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

				let currentAgentContext:
					| {
							ai: AgentHandlerContext<
								unknown,
								unknown,
								Record<string, unknown>,
								Record<string, ModelProvider>,
								AgentInvokes,
								EmitPayloads
							>['ai']
							invoke: AgentHandlerContext<
								unknown,
								unknown,
								Record<string, unknown>,
								Record<string, ModelProvider>,
								AgentInvokes,
								EmitPayloads
							>['invoke']
							app: AgentHandlerContext<
								unknown,
								unknown,
								Record<string, unknown>,
								Record<string, ModelProvider>,
								AgentInvokes,
								EmitPayloads
							>['app']
					  }
					| undefined

				const applyAutomaticModelRequestDefaults = async <
					Request extends {
						skills?: unknown
						bindings?: unknown
					},
				>(
					request: Request,
				): Promise<Request> => {
					if (!currentAgentContext) {
						return request
					}

					const nextRequest = { ...request }

					if (request.skills === undefined && currentAgentContext.ai.skills.available) {
						nextRequest.skills = await currentAgentContext.ai.skills.loadAvailable()
					}

					if (request.bindings === undefined) {
						const commands = currentAgentContext.app.manifest.allowedTools.map(command => ({
							serviceName: command.serviceName,
							serviceVersion: command.serviceVersion,
							commandName: command.commandName,
							name: command.toolName,
							description: command.description,
						}))
						const agents = (currentAgentContext.app.manifest.allowedAgents ?? []).map(agent => ({
							agentName: agent.agentName,
							agentVersion: agent.agentVersion,
							name: agent.toolName,
							description: agent.description,
						}))
						if (commands.length > 0 || agents.length > 0) {
							nextRequest.bindings = currentAgentContext.invoke.expose.tools({ commands, agents })
						}
					}

					return nextRequest
				}

				for (const [alias, provider] of Object.entries(runtime.models)) {
					const modelApi: ModelProvider = {
						name: provider.name,
						capabilities: provider.capabilities,
					}

					if (provider.generate) {
						modelApi.generate = async request => {
							const requestStartedAt = Date.now()
							try {
								executionBudget.consumeModelStep({ alias, callKind: 'generate' })
								const preparedRequest = await applyAutomaticModelRequestDefaults(request)
								const metadata = addAiSdkTelemetry(
									await resolvePreparedMetadata({
										alias,
										callKind: 'generate',
										requestMetadata: preparedRequest.metadata,
									}),
									'generate',
									alias,
								)

								const result = await provider.generate?.({
									...preparedRequest,
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
							developerInstruction?: string | string[]
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
								executionBudget.consumeModelStep({ alias, callKind: 'generateJson' })
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
						modelApi.stream = request => {
							const requestStartedAt = Date.now()
							executionBudget.consumeModelStep({ alias, callKind: 'stream' })
							let streamHandlePromise: Promise<ReturnType<NonNullable<ModelProvider['stream']>>> | undefined
							const resolveStream = async () => {
								streamHandlePromise ??= (async () => {
									try {
										const preparedRequest = await applyAutomaticModelRequestDefaults(request)
										const metadata = addAiSdkTelemetry(
											await resolvePreparedMetadata({
												alias,
												callKind: 'stream',
												requestMetadata: preparedRequest.metadata,
											}),
											'stream',
											alias,
										)
										const streamHandle = streamProvider({
											...preparedRequest,
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
									executionBudget.consumeModelStep({ alias, callKind: 'embed' })
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
											executionBudget.consumeModelStep({ alias, callKind: 'embedMany' })
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
									executionBudget.consumeModelStep({ alias, callKind: 'rerank' })
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
						modelApi.generateText = async request => {
							if (typeof provider.generateText === 'function') {
								const requestStartedAt = Date.now()
								try {
									executionBudget.consumeModelStep({ alias, callKind: 'generateText' })
									const preparedRequest = await applyAutomaticModelRequestDefaults(request)
									const metadata = addAiSdkTelemetry(
										await resolvePreparedMetadata({
											alias,
											callKind: 'generate',
											requestMetadata: preparedRequest.metadata,
										}),
										'generate',
										alias,
									)
									return await provider.generateText({
										...preparedRequest,
										metadata,
									})
								} catch (error) {
									logProviderFailure('generate', alias, provider.name, requestStartedAt, error)
									throw error
								}
							}

							const preparedRequest = await applyAutomaticModelRequestDefaults(request)
							executionBudget.consumeModelStep({ alias, callKind: 'generateText' })
							return await generateText({
								model: provider,
								request: {
									prompt: preparedRequest.prompt,
									context: preparedRequest.context,
									developerInstruction: preparedRequest.developerInstruction,
									skills: preparedRequest.skills,
									references: preparedRequest.references,
									bindings: preparedRequest.bindings,
									metadata: await resolvePreparedMetadata({
										alias,
										callKind: 'generate',
										requestMetadata: preparedRequest.metadata,
									}),
								},
								onReasoning: request.onReasoning,
								onTextDelta: request.onTextDelta,
							})
						}
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
					protocol: protocolBuffer.protocol,
					resources: runtime.resources,
					models: instrumentedModels,
					embeddings: instrumentedEmbeddings,
					rerankers: instrumentedRerankers,
					manifest: runtime.manifest,
					executionBudget,
				})
				currentAgentContext = agentContext as unknown as typeof currentAgentContext

				const result = await runtime.handler(
					agentContext as unknown as AgentHandlerContext<
						unknown,
						unknown,
						Record<string, unknown>,
						Record<string, ModelProvider>,
						AgentInvokes,
						EmitPayloads
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
				const envelopes = protocolBuffer.toEnvelopes()
				const terminalResult = createAgentTerminalResult({
					envelopes,
					agentName: runtime.manifest.agentName,
					agentVersion: runtime.manifest.agentVersion,
				})
				await emitAgentSuccessEvent(runtime, context, terminalResult)
				return envelopes
			} catch (error) {
				context.logger.error({ err: error, agent: runtime.manifest.agentName }, 'agent handler failed')
				protocolBuffer.protocol.emitError(error, {
					code: error instanceof HandledError ? String(error.errorCode) : undefined,
					handled: error instanceof HandledError,
				})
				await protocolBuffer.flush()
				return protocolBuffer.toEnvelopes()
			} finally {
				runtime.poolManager.release(poolId)
			}
		}

		const observeQueuedRun = async (
			thisArg: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
			context: CommandFunctionContext | StreamFunctionContext,
			payload: unknown,
			parameter: unknown,
			runId: string,
			extraScope: Record<string, string> | undefined,
			onEnvelope?: (envelope: unknown) => Promise<void>,
		) => {
			const runtime = thisArg.config?.__agentRuntime
			if (!runtime) {
				throw new HandledError(StatusCode.InternalServerError, 'Agent runtime not configured')
			}
			const collectedEnvelopes: AgentProtocolEnvelope[] = []
			const observedEnvelopeIds = new Set<string>()
			const handleObservedEnvelope = async (envelope: AgentProtocolEnvelope) => {
				if (observedEnvelopeIds.has(envelope.messageId)) {
					return
				}
				observedEnvelopeIds.add(envelope.messageId)
				collectedEnvelopes.push(envelope)
				await onEnvelope?.(envelope)
			}
			const protocolBuffer = createProtocolBuffer(context, { onEnvelope: handleObservedEnvelope })
			const pollIntervalMs = 250
			const maxDurationMs = resolveExecutionPolicy().maxDurationMs
			const startedAt = Date.now()
			let lastStateSignature = ''
			let finalState: AgentRunState | undefined
			let nextProtocolSequence = 1

			while (Date.now() - startedAt <= maxDurationMs) {
				const storedProtocol = await readQueuedProtocolSince(
					context,
					runtime.manifest.agentName,
					runId,
					nextProtocolSequence,
				)
				if (storedProtocol.envelopes.length > 0) {
					for (const envelope of storedProtocol.envelopes) {
						await handleObservedEnvelope(envelope)
					}
					nextProtocolSequence = storedProtocol.nextSequence
				}

				const snapshot = createAgentHandlerContext({
					payload,
					parameter,
					serviceContext: context,
					protocol: protocolBuffer.protocol,
					conversationStore: runtime.conversationStore,
					resources: runtime.resources,
					models: runtime.models,
					eventBridge: runtime.eventBridge,
					embeddings: {},
					rerankers: {},
					manifest: runtime.manifest,
				})
				const current = await snapshot.memory.run.get({ runId, extraScope })
				if (current) {
					const signature = JSON.stringify({
						status: current.status,
						phase: current.phase,
						tasks: current.tasks,
						summary: current.summary,
						finalMessage: current.finalMessage,
						recovery: current.recovery,
						error: current.error,
					})
					if (signature !== lastStateSignature) {
						lastStateSignature = signature
						protocolBuffer.protocol.emitArtifact({
							artifactId: 'run-state',
							content: current,
							mimeType: 'application/json',
							final: ['completed', 'failed', 'cancelled'].includes(current.status),
						})
					}
					if (['completed', 'failed', 'cancelled'].includes(current.status)) {
						finalState = current
						break
					}
				}
				await protocolBuffer.flush()
				await sleep(pollIntervalMs)
			}

			if (!finalState) {
				throw new HandledError(StatusCode.GatewayTimeout, 'Queued agent did not finish before attach timeout', {
					runId,
					agentName: runtime.manifest.agentName,
				})
			}

			if (finalState.finalMessage && !collectedEnvelopes.some(envelope => envelope.frame.kind === 'message')) {
				protocolBuffer.protocol.emitMessage({
					content: finalState.finalMessage,
					final: true,
					summary: finalState.summary,
				})
			}
			if (finalState.error && !collectedEnvelopes.some(envelope => envelope.frame.kind === 'error')) {
				protocolBuffer.protocol.emitError(new Error(finalState.error.message), {
					code: finalState.error.code,
					handled: finalState.error.handled,
				})
			}
			await protocolBuffer.flush()
			if (runtime.manifest.executionPolicy?.cleanup?.keepFinalRunRecord === false) {
				await clearQueuedProtocolState(context, runtime.manifest.agentName, runId)
			}
			return collectedEnvelopes
		}

		const executeQueuedAgent = async (
			thisArg: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
			context: CommandFunctionContext | StreamFunctionContext,
			payload: unknown,
			parameter: unknown,
			onEnvelope?: (envelope: unknown) => Promise<void>,
		) => {
			const runtime = thisArg.config?.__agentRuntime
			if (!runtime) {
				throw new HandledError(StatusCode.InternalServerError, 'Agent runtime not configured')
			}
			const extraScope = deriveExtraScope(payload)
			const helperContext = createAgentHandlerContext({
				payload,
				parameter,
				serviceContext: context,
				protocol: createProtocolBuffer(context).protocol,
				conversationStore: runtime.conversationStore,
				resources: runtime.resources,
				models: runtime.models,
				eventBridge: runtime.eventBridge,
				embeddings: {},
				rerankers: {},
				manifest: runtime.manifest,
			})
			const existing = await helperContext.memory.run.get({ extraScope })
			if (existing && !['completed', 'failed', 'cancelled'].includes(existing.status)) {
				return await observeQueuedRun(thisArg, context, payload, parameter, existing.runId, extraScope, onEnvelope)
			}

			const run = await helperContext.memory.run.start({
				title: runtime.manifest.description ?? `${runtime.manifest.agentName} execution`,
				phase: 'queued',
				status: 'queued',
				extraScope,
				metadata: {
					queuedAt: new Date().toISOString(),
				},
				retention: runtime.manifest.executionPolicy?.cleanup,
			})
			await writeQueuedProtocolMeta(context, runtime.manifest.agentName, run.state.runId, {
				pageSize: QUEUED_PROTOCOL_PAGE_SIZE,
				lastSequence: 0,
				terminal: false,
			})
			await context.queue.enqueue(queueName, {
				runId: run.state.runId,
				sessionId: context.message.id,
				payload,
				parameter,
				correlationId: context.message.correlationId,
				principalId: context.message.principalId,
				tenantId: context.message.tenantId,
				extraScope,
			} satisfies DurableAgentQueuePayload)
			return await observeQueuedRun(thisArg, context, payload, parameter, run.state.runId, extraScope, onEnvelope)
		}

		this.commandBuilder.setCommandFunction(async function commandImpl(
			this: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
			context: CommandFunctionContext,
			payload: unknown,
			parameter: unknown,
		) {
			if (this.config?.__agentRuntime?.manifest.executionMode === 'queued') {
				return await executeQueuedAgent(this, context, payload, parameter)
			}
			return await executeAgent(this, context, payload, parameter)
		})

		this.streamBuilder.setStreamFunction(async function streamImpl(
			this: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
			context: StreamFunctionContext,
			payload: unknown,
			parameter: unknown,
			writer: StreamWriter<unknown, unknown[]>,
		) {
			const protocol = this.config?.__agentRuntime?.manifest.httpExposure?.sseProtocol ?? 'purista'
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
			const final = (
				this.config?.__agentRuntime?.manifest.executionMode === 'queued' ? executeQueuedAgent : executeAgent
			)(
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
			) as Promise<unknown[]>
			const finalEnvelopesResult = await final

			if (protocol !== 'purista') {
				const finalEnvelopes = agentProtocolEnvelopeSchema.array().parse(finalEnvelopesResult)
				streamedEnvelopes.splice(0, streamedEnvelopes.length, ...finalEnvelopes)
				await flushConvertedEvents(true)
			}

			await writer.close(finalEnvelopesResult)
		})

		if (!this.queueDefinitionAdded || !this.queueWorkerDefinitionAdded) {
			const queueBuilder = this.serviceBuilder.getQueueBuilder(
				queueName as never,
				`Queued durable execution for ${this.info.agentName}`,
			)
			queueBuilder
				.addPayloadSchema(durableAgentQueuePayloadSchema)
				.setLifecycleConfig({
					visibilityTimeoutMs: resolveExecutionPolicy().leaseTtlMs,
					heartbeatIntervalMs: resolveExecutionPolicy().heartbeatIntervalMs,
					maxLeaseExtensions: resolveExecutionPolicy().maxLeaseExtensions,
					maxAttempts: resolveExecutionPolicy().maxAttempts,
				})
				.setQueueBridgeConfig({
					durable: true,
					shared: true,
					prefetch: 1,
					orderingGuarantee: 'fifo',
				})

			const workerBuilder = this.serviceBuilder.getQueueWorkerBuilder(queueName as never, workerName)
			workerBuilder
				.setMode('continuous')
				.setMaxParallelHandlers(1)
				.setBeforeGuardHooks(
					Object.fromEntries(
						Object.entries(this.declaredBeforeGuardHooks).map(([name, hook]) => [
							name,
							async function queuedAgentBeforeGuard(
								this: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
								context: QueueJobContext,
								message: QueueMessage<DurableAgentQueuePayload>,
							) {
								const runtime = this.config?.__agentRuntime
								if (!runtime) {
									throw new HandledError(StatusCode.InternalServerError, 'Agent runtime not configured')
								}
								const serviceContext = createQueuedProtocolContext(
									runtime,
									context as QueueJobContext<DurableAgentQueuePayload>,
									message,
								)
								await hook(serviceContext, message.payload.payload, message.payload.parameter)
							},
						]),
					) as Record<string, never>,
				)
				.setAfterGuardHooks(
					Object.fromEntries(
						Object.entries(this.declaredAfterGuardHooks).map(([name, hook]) => [
							name,
							async function queuedAgentAfterGuard(
								this: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
								context: QueueJobContext,
								result: DurableAgentQueueResult,
								message: QueueMessage<DurableAgentQueuePayload>,
							) {
								const runtime = this.config?.__agentRuntime
								if (!runtime) {
									throw new HandledError(StatusCode.InternalServerError, 'Agent runtime not configured')
								}
								const serviceContext = createQueuedProtocolContext(
									runtime,
									context as QueueJobContext<DurableAgentQueuePayload>,
									message,
								)
								const finalMessage =
									result && typeof result === 'object' && 'output' in result
										? ((result as { output?: { finalMessage?: unknown } }).output?.finalMessage as
												| AgentHandlerResult
												| undefined)
										: undefined
								await hook(serviceContext, message.payload.payload, message.payload.parameter, finalMessage)
							},
						]),
					) as Record<string, never>,
				)
				.setHandler(async function durableWorker(
					this: { config?: { __agentRuntime?: AgentRuntimeConfig<EmitPayloads> } },
					context: QueueJobContext<DurableAgentQueuePayload>,
					message: QueueMessage<DurableAgentQueuePayload>,
				) {
					const runtime = this.config?.__agentRuntime
					if (!runtime) {
						await context.job.fail('Agent runtime not configured', true)
						return { status: 'fail', reason: 'Agent runtime not configured', fatal: true }
					}

					const serviceContext = createQueuedProtocolContext(runtime, context, message)
					const protocolBuffer = createProtocolBuffer(serviceContext, {
						onEnvelope: async envelope => {
							await appendQueuedProtocolEnvelope(
								context,
								runtime.manifest.agentName,
								message.payload.runId,
								agentProtocolEnvelopeSchema.parse(envelope),
							)
						},
					})
					const helperContext = createAgentHandlerContext({
						payload: message.payload.payload,
						parameter: message.payload.parameter,
						serviceContext,
						protocol: protocolBuffer.protocol,
						conversationStore: runtime.conversationStore,
						resources: runtime.resources,
						models: runtime.models,
						eventBridge: runtime.eventBridge,
						embeddings: {},
						rerankers: {},
						manifest: runtime.manifest,
					})
					const run = await helperContext.memory.run.start({
						runId: message.payload.runId,
						title: runtime.manifest.description ?? `${runtime.manifest.agentName} execution`,
						phase: 'recovering',
						status: 'recovering',
						extraScope: message.payload.extraScope,
						lock: {
							key: 'execution',
							ttlMs: resolveExecutionPolicy().leaseTtlMs,
							extraScope: message.payload.extraScope,
							runId: message.payload.runId,
						},
						owner: {
							workerId: `${runtime.manifest.agentName}:${process.pid}`,
							queueName,
							leaseId: message.id,
							attachedAt: new Date().toISOString(),
						},
						recovery: {
							status: 'resumed',
							reason: 'queued-worker-start',
							resumedAt: new Date().toISOString(),
						},
						retention: runtime.manifest.executionPolicy?.cleanup,
					})

					const heartbeatIntervalMs = resolveExecutionPolicy().heartbeatIntervalMs
					const heartbeatTimer = setInterval(async () => {
						try {
							await run.update({ heartbeat: true })
						} catch {}
					}, heartbeatIntervalMs)

					try {
						await run.update({ phase: 'running', status: 'running', heartbeat: true })
						const envelopes = (await executeAgent(
							{ config: { __agentRuntime: runtime } },
							serviceContext,
							message.payload.payload,
							message.payload.parameter,
							async envelope => {
								await appendQueuedProtocolEnvelope(
									context,
									runtime.manifest.agentName,
									message.payload.runId,
									agentProtocolEnvelopeSchema.parse(envelope),
								)
							},
						)) as AgentProtocolEnvelope[]
						const terminalResult = createAgentTerminalResult({
							envelopes,
							agentName: runtime.manifest.agentName,
							agentVersion: runtime.manifest.agentVersion,
						})
						await writeQueuedProtocolMeta(context, runtime.manifest.agentName, message.payload.runId, {
							...(await readQueuedProtocolMeta(context, runtime.manifest.agentName, message.payload.runId)),
							terminal: true,
						})

						await run.finish({
							status: 'completed',
							finalMessage: terminalResult.finalMessage,
							summary: terminalResult.summary ?? terminalResult.finalMessage,
						})
						await context.job.complete({
							...terminalResult,
							runId: message.payload.runId,
						} satisfies DurableAgentQueueResult)
						return { status: 'success' as const, output: terminalResult }
					} catch (error) {
						const normalizedError = normalizeAgentError(error)
						await writeQueuedProtocolMeta(context, runtime.manifest.agentName, message.payload.runId, {
							...(await readQueuedProtocolMeta(context, runtime.manifest.agentName, message.payload.runId)),
							terminal: true,
						})
						await run.finish({
							status: 'failed',
							summary: normalizedError.message,
							error: normalizedError,
						})
						if ((message.attempt ?? 1) < resolveExecutionPolicy().maxAttempts) {
							await context.job.retry({ reason: normalizedError.message })
							return { status: 'retry' as const, reason: normalizedError.message }
						}
						await context.job.fail(normalizedError.message, normalizedError.handled)
						return { status: 'fail' as const, reason: normalizedError.message, fatal: normalizedError.handled }
					} finally {
						clearInterval(heartbeatTimer)
						await run.release()
					}
				} as any)

			this.serviceBuilder.addQueueDefinition(queueBuilder.getDefinition())
			this.serviceBuilder.addQueueWorkerDefinition(workerBuilder.getDefinition())
			this.queueDefinitionAdded = true
			this.queueWorkerDefinitionAdded = true
		}

		return this as unknown as AgentBuilder<
			ModelAliases,
			TextAliases,
			StreamAliases,
			EmbeddingAliases,
			RerankAliases,
			ObjectAliases,
			AgentInvokes,
			SkillNames,
			Resources,
			EmitPayloads,
			ConfigType,
			ConfigInputType
		>
	}

	build(): AgentDefinition<SkillNames, Resources, ConfigInputType, ConfigType, EmitPayloads> {
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
		manifest.allowedAgents = manifest.allowedAgents ?? []
		const dependencies: AgentInstanceDependencies<EmitPayloads> = {
			info: this.info,
			manifest,
			serviceBuilder: this.serviceBuilder,
			handler: this.handler,
			callOptionsSchema: this.callOptionsSchema,
			prepareCall: this.prepareCallHook,
			prepareStep: this.prepareStepHook,
			configSchema: this.runtimeConfigSchema,
			defaultConfig: this.defaultRuntimeConfig as Complete<Record<string, unknown>> | undefined,
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
			getDefaultConfig: () => this.defaultRuntimeConfig,
			getExternalRuntimeMetadata: () => ({
				commands: manifest.allowedTools,
				agents: manifest.allowedAgents ?? [],
			}),
			getInstance: async (eventBridge, options?: AgentInstanceOptions<SkillNames, Resources, ConfigInputType>) => {
				const runtimeOptions = options
				const instance = new AgentInstance(dependencies, eventBridge, runtimeOptions)
				return instance
			},
		}
	}
}
