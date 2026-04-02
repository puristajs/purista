import type { Tracer } from '@opentelemetry/api'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import {
	type Complete,
	type ConfigStore,
	type EmptyObject,
	type EventBridge,
	HandledError,
	type Logger,
	type QueueBridge,
	type Schema,
	type SecretStore,
	type Service,
	type ServiceBuilder,
	type ServiceBuilderTypes,
	type StateStore,
	StatusCode,
	validate,
} from '@purista/core'
import type { AgentHandler } from '../builder/AgentBuilder.js'
import type { ConversationStore } from '../memory/conversationStore.js'
import { InMemoryConversationStore } from '../memory/conversationStore.js'
import { PoolManager } from '../pools/PoolManager.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import { createInlineSkillResource, type SkillResource, type SkillSourceMap } from '../skills/fileSystem.js'
import type {
	AgentInfo,
	AgentRuntimeInstance as AgentInstanceContract,
	AgentInstanceOptions,
	AgentInvocationDeliveryMode,
	AgentInvokeContext,
	AgentInvokeRequest,
	AgentInvokeResult,
	AgentRuntimeStatus,
	AgentStreamResponder,
} from '../types/AgentDefinition.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { invokeAgentInternal } from './agentInvocationTransport.js'

export type AgentInstanceDependencies<EmitPayloads extends Record<string, unknown> = Record<string, unknown>> = {
	info: AgentInfo
	manifest: AgentManifest
	serviceBuilder: ServiceBuilder<
		ServiceBuilderTypes<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
	>
	handler: AgentHandler<any, any, Record<string, unknown>, Record<string, ModelProvider>, any, EmitPayloads>
	callOptionsSchema?: import('zod').ZodType<import('../builder/AgentBuilder.js').AgentModelCallOptions>
	prepareCall?: import('../builder/AgentBuilder.js').AgentPrepareCallHook
	prepareStep?: import('../builder/AgentBuilder.js').AgentPrepareStepHook
	configSchema?: Schema
	defaultConfig?: Complete<Record<string, unknown>>
}

export type AgentRuntimeDependencies<SkillNames extends string = string> = AgentInstanceOptions<
	SkillNames,
	Record<string, unknown>,
	Record<string, unknown>
>
export type AgentRuntimeDependenciesTyped<
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
> = AgentInstanceOptions<SkillNames, Resources, ConfigInput>

type ResolvedAgentRuntimeDependencies = {
	eventBridge: EventBridge
	logger?: Logger
	spanProcessor?: SpanProcessor
	tracer?: Tracer
	secretStore?: SecretStore
	configStore?: ConfigStore
	stateStore?: StateStore
	queueBridge?: QueueBridge
	conversationStore: ConversationStore
	poolManager: PoolManager
	models: Record<string, ModelProvider>
	resources: Record<string, unknown>
	poolId: string
	maxConcurrencyPerInstance: number
	concurrencyHints?: {
		replicaCountHint?: number
	}
	config?: Record<string, unknown>
}

type AgentServiceConfig<EmitPayloads extends Record<string, unknown> = Record<string, unknown>> = {
	runtime?: Record<string, unknown>
	__agentRuntime: {
		handler: AgentHandler<any, any, Record<string, unknown>, Record<string, ModelProvider>, any, EmitPayloads>
		manifest: AgentManifest
		conversationStore: ConversationStore
		poolManager: PoolManager
		models: Record<string, ModelProvider>
		eventBridge: EventBridge
		callOptionsSchema?: import('zod').ZodType<import('../builder/AgentBuilder.js').AgentModelCallOptions>
		prepareCall?: import('../builder/AgentBuilder.js').AgentPrepareCallHook
		prepareStep?: import('../builder/AgentBuilder.js').AgentPrepareStepHook
		tracer?: Tracer
		resources: Record<string, unknown>
		poolId: string
		maxConcurrencyPerInstance: number
		concurrencyHints?: {
			replicaCountHint?: number
		}
	}
}

const supportsCapability = (
	provider: ModelProvider,
	capability: 'text' | 'stream' | 'embedding' | 'rerank' | 'json',
) => {
	const declared = provider.capabilities?.[capability]
	if (declared === true) {
		return true
	}
	switch (capability) {
		case 'text':
			return typeof provider.generate === 'function'
		case 'stream':
			return typeof provider.stream === 'function'
		case 'embedding':
			return typeof provider.embed === 'function'
		case 'rerank':
			return typeof provider.rerank === 'function'
		case 'json':
			return typeof provider.generateJson === 'function'
		default:
			return false
	}
}

const isSkillResource = (value: unknown): value is SkillResource =>
	typeof value === 'object' &&
	value !== null &&
	typeof (value as SkillResource).list === 'function' &&
	typeof (value as SkillResource).load === 'function' &&
	typeof (value as SkillResource).search === 'function'

const resolveSkillResource = <SkillNames extends string>(
	skills: SkillResource | SkillSourceMap<SkillNames> | undefined,
): SkillResource | undefined => {
	if (!skills) {
		return undefined
	}
	if (isSkillResource(skills)) {
		return skills
	}
	return createInlineSkillResource(skills)
}

export class AgentInstance<EmitPayloads extends Record<string, unknown> = Record<string, unknown>>
	implements AgentInstanceContract<EmitPayloads>
{
	private service?: Service
	private readonly dependencies: AgentInstanceDependencies<EmitPayloads>
	private readonly runtime: ResolvedAgentRuntimeDependencies

	constructor(
		deps: AgentInstanceDependencies<EmitPayloads>,
		eventBridge: EventBridge,
		runtime: AgentRuntimeDependencies = {},
	) {
		this.dependencies = deps
		const poolId = runtime.poolConfig?.poolId ?? `agent:${deps.info.agentName}`
		const maxConcurrencyPerInstance = runtime.poolConfig?.maxConcurrencyPerInstance ?? 1

		const skillResource = resolveSkillResource(runtime.skills)

		this.runtime = {
			eventBridge,
			logger: runtime.logger,
			spanProcessor: runtime.spanProcessor,
			tracer: runtime.tracer,
			secretStore: runtime.secretStore,
			configStore: runtime.configStore,
			stateStore: runtime.stateStore,
			queueBridge: runtime.queueBridge,
			config: runtime.config,
			conversationStore: runtime.conversationStore ?? new InMemoryConversationStore(),
			poolManager: runtime.poolManager ?? new PoolManager(),
			models: runtime.models ?? {},
			resources: {
				...(runtime.resources ?? {}),
				...(skillResource ? { skills: skillResource } : {}),
			},
			poolId,
			maxConcurrencyPerInstance,
			concurrencyHints: runtime.concurrencyHints,
		}

		for (const model of deps.manifest.models ?? []) {
			const provider = this.runtime.models[model.alias]
			if (!provider) {
				throw new Error(`Missing model provider for alias "${model.alias}"`)
			}
			for (const capability of model.capabilities ?? ['text']) {
				if (!supportsCapability(provider, capability)) {
					throw new Error(`Model provider "${model.alias}" does not support required capability "${capability}"`)
				}
			}
		}

		this.runtime.poolManager.registerPool(poolId, maxConcurrencyPerInstance)
	}

	async start() {
		if (this.service) {
			return
		}
		if (this.dependencies.manifest.executionMode === 'queued' && !this.runtime.queueBridge) {
			throw new Error(
				`Agent "${this.dependencies.info.agentName}" is configured for queued execution but no queueBridge was provided`,
			)
		}

		const runtimeConfigInput = {
			...(this.dependencies.defaultConfig ?? {}),
			...(this.runtime.config ?? {}),
		}
		let resolvedRuntimeConfig = runtimeConfigInput
		if (this.dependencies.configSchema) {
			const validationResult = await validate(this.dependencies.configSchema, runtimeConfigInput)
			if (!validationResult.success) {
				throw new HandledError(
					StatusCode.InternalServerError,
					'The given agent runtime configuration is invalid',
					validationResult.issues,
				)
			}
			resolvedRuntimeConfig = validationResult.data as Record<string, unknown>
		}

		const serviceConfig: AgentServiceConfig<EmitPayloads> = {
			runtime: resolvedRuntimeConfig,
			__agentRuntime: {
				handler: this.dependencies.handler,
				manifest: this.dependencies.manifest,
				conversationStore: this.runtime.conversationStore,
				poolManager: this.runtime.poolManager,
				models: this.runtime.models,
				eventBridge: this.runtime.eventBridge,
				callOptionsSchema: this.dependencies.callOptionsSchema,
				prepareCall: this.dependencies.prepareCall,
				prepareStep: this.dependencies.prepareStep,
				tracer: this.runtime.tracer,
				resources: this.runtime.resources,
				poolId: this.runtime.poolId,
				maxConcurrencyPerInstance: this.runtime.maxConcurrencyPerInstance,
				concurrencyHints: this.runtime.concurrencyHints,
			},
		}
		const instanceResources = Object.keys(this.runtime.resources).length > 0 ? this.runtime.resources : undefined

		this.service = await this.dependencies.serviceBuilder.getInstance(this.runtime.eventBridge, {
			logger: this.runtime.logger,
			spanProcessor: this.runtime.spanProcessor,
			secretStore: this.runtime.secretStore,
			configStore: this.runtime.configStore,
			stateStore: this.runtime.stateStore,
			queueBridge: this.runtime.queueBridge,
			serviceConfig,
			...(instanceResources ? { resources: instanceResources } : {}),
		} as never)

		await this.service.start()
	}

	getService(): Service | undefined {
		return this.service
	}

	async stop() {
		if (!this.service) {
			return
		}
		await this.service.destroy()
		this.service = undefined
	}

	getStatus(): AgentRuntimeStatus {
		const pool = this.runtime.poolManager.getPoolStats(this.runtime.poolId)
		const replicaCountHint =
			typeof this.runtime.concurrencyHints?.replicaCountHint === 'number' &&
			this.runtime.concurrencyHints.replicaCountHint > 0
				? Math.trunc(this.runtime.concurrencyHints.replicaCountHint)
				: undefined

		return {
			agentName: this.dependencies.info.agentName,
			agentVersion: this.dependencies.info.agentVersion,
			poolId: this.runtime.poolId,
			maxConcurrencyPerInstance: this.runtime.maxConcurrencyPerInstance,
			activeWorkers: pool.activeWorkers,
			waitingWorkers: pool.waitingWorkers,
			concurrencyHints:
				replicaCountHint !== undefined
					? {
							replicaCountHint,
							effectiveMaxConcurrencyHint: this.runtime.maxConcurrencyPerInstance * replicaCountHint,
						}
					: undefined,
		}
	}

	getExternalRuntimeMetadata() {
		return {
			commands: this.dependencies.manifest.allowedTools,
			agents: this.dependencies.manifest.allowedAgents ?? [],
		}
	}

	private async notifyStream(stream: AgentStreamResponder | undefined, envelopes: AgentProtocolEnvelope[]) {
		if (!stream) {
			return
		}
		for (const envelope of envelopes) {
			await stream.onFrame(envelope)
		}
		await stream.onComplete()
	}

	private mergeStreamResponders(
		first: AgentStreamResponder | undefined,
		second: AgentStreamResponder | undefined,
	): AgentStreamResponder | undefined {
		if (!first) {
			return second
		}
		if (!second) {
			return first
		}
		return {
			onFrame: async frame => {
				await first.onFrame(frame)
				await second.onFrame(frame)
			},
			onComplete: async () => {
				await first.onComplete()
				await second.onComplete()
			},
			onError: async error => {
				await first.onError(error)
				await second.onError(error)
			},
		}
	}

	async invoke(
		request: AgentInvokeRequest,
		contextOverrides?: Partial<AgentInvokeContext>,
	): Promise<AgentInvokeResult> {
		if (!this.service) {
			await this.start()
		}

		try {
			const mergedStream = this.mergeStreamResponders(contextOverrides?.stream, request.stream)
			const deliveryMode: AgentInvocationDeliveryMode = request.deliveryMode ?? 'prefer-stream'
			const envelopes = await invokeAgentInternal({
				eventBridge: this.runtime.eventBridge,
				agentName: this.dependencies.serviceBuilder.info.serviceName,
				agentVersion: this.dependencies.serviceBuilder.info.serviceVersion,
				payload: request.payload,
				parameter: request.parameter,
				correlationId: request.correlationId,
				sessionId: request.sessionId,
				stream: mergedStream,
				timeoutMs: request.timeoutMs,
				principalId: request.principalId,
				tenantId: request.tenantId,
				deliveryMode,
				sender: {
					serviceName: 'agent.runtime',
					serviceVersion: 'v1',
					serviceTarget: this.dependencies.info.agentName,
					instanceId: this.runtime.eventBridge.instanceId,
				},
			})
			if (!mergedStream) {
				await this.notifyStream(contextOverrides?.stream, envelopes)
				await this.notifyStream(request.stream, envelopes)
			}
			return { envelopes }
		} catch (error) {
			await contextOverrides?.stream?.onError(error)
			await request.stream?.onError(error)
			throw error
		}
	}
}
