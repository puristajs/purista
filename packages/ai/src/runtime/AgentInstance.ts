import type { Tracer } from '@opentelemetry/api'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { AgentInvokeList } from '@purista/core'
import {
	type Complete,
	type ConfigStore,
	type EmptyObject,
	type EventBridge,
	HandledError,
	initLogger,
	type Logger,
	type QueueBridge,
	type Schema,
	type SecretStore,
	type Service,
	type StateStore,
	StatusCode,
	validate,
} from '@purista/core'
import type { ConversationStore } from '../memory/conversationStore.js'
import { InMemoryConversationStore } from '../memory/conversationStore.js'
import { PoolManager } from '../pools/PoolManager.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentSandboxRuntimeConfig } from '../sandbox/provider.js'
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
import type { AgentHandler } from '../types/AgentHandler.js'
import { type AgentManifest, defaultAgentModelCapabilities } from '../types/AgentManifest.js'
import { AgentExecutor } from './AgentExecutor.js'
import { invokeAgentInternal } from './agentInvocationTransport.js'
import { attachAgentExecutor } from './attachedAgentExecutor.js'
import type { ToolInvokeMap } from './context.js'
import { createAgentInvocationFinalResult } from './terminalResult.js'

type AgentRuntimeServiceBuilder = {
	info: {
		serviceName: string
		serviceVersion: string
	}
	getInstance(
		eventBridge: EventBridge,
		options?: {
			logLevel?: import('@purista/core').LogLevelName
			logger?: Logger
			spanProcessor?: SpanProcessor
			secretStore?: SecretStore
			configStore?: ConfigStore
			stateStore?: StateStore
			queueBridge?: QueueBridge
			serviceConfig?: Record<string, unknown>
			resources?: Record<string, unknown>
		},
	): Promise<Service>
}

export type AgentInstanceDependencies<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = Record<string, unknown>,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> = {
	info: AgentInfo
	manifest: AgentManifest
	serviceBuilder: AgentRuntimeServiceBuilder
	handler: AgentHandler<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
	callOptionsSchema?: import('zod').ZodType<import('../types/AgentHandler.js').AgentModelCallOptions>
	prepareCall?: import('../types/AgentHandler.js').AgentPrepareCallHook
	prepareStep?: import('../types/AgentHandler.js').AgentPrepareStepHook
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
	sandbox?: AgentSandboxRuntimeConfig<Record<string, unknown>>
	poolId: string
	maxConcurrencyPerInstance: number
	concurrencyHints?: {
		replicaCountHint?: number
	}
	config?: Record<string, unknown>
}

type AgentServiceConfig<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = Record<string, unknown>,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> = {
	runtime?: Record<string, unknown>
	__agentRuntime: {
		handler: AgentHandler<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
		manifest: AgentManifest
		conversationStore: ConversationStore
		poolManager: PoolManager
		models: Record<string, ModelProvider>
		eventBridge: EventBridge
		callOptionsSchema?: import('zod').ZodType<import('../types/AgentHandler.js').AgentModelCallOptions>
		prepareCall?: import('../types/AgentHandler.js').AgentPrepareCallHook
		prepareStep?: import('../types/AgentHandler.js').AgentPrepareStepHook
		tracer?: Tracer
		resources: Record<string, unknown>
		sandbox?: AgentSandboxRuntimeConfig<Record<string, unknown>>
		poolId: string
		maxConcurrencyPerInstance: number
		concurrencyHints?: {
			replicaCountHint?: number
		}
	}
}

const supportsCapability = (
	provider: ModelProvider,
	capability: 'text' | 'text-stream' | 'embedding' | 'rerank' | 'object' | 'object-stream',
) => {
	const declared = provider.capabilities?.[capability]
	if (declared === true) {
		return true
	}
	switch (capability) {
		case 'text':
			return typeof provider.generateText === 'function'
		case 'text-stream':
			return typeof provider.streamText === 'function'
		case 'embedding':
			return typeof provider.embed === 'function'
		case 'rerank':
			return typeof provider.rerank === 'function'
		case 'object':
			return typeof provider.generateObject === 'function'
		case 'object-stream':
			return typeof provider.streamObject === 'function'
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

export class AgentInstance<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = Record<string, unknown>,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> implements AgentInstanceContract<EmitPayloads>
{
	private service?: Service
	private readonly dependencies: AgentInstanceDependencies<
		Payload,
		Parameter,
		Resources,
		Models,
		AgentInvokes,
		EmitPayloads,
		ToolInvokes
	>
	private readonly runtime: ResolvedAgentRuntimeDependencies

	constructor(
		deps: AgentInstanceDependencies<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>,
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
			sandbox: runtime.sandbox as AgentSandboxRuntimeConfig<Record<string, unknown>> | undefined,
			poolId,
			maxConcurrencyPerInstance,
			concurrencyHints: runtime.concurrencyHints,
		}

		for (const model of deps.manifest.models ?? []) {
			const provider = this.runtime.models[model.alias]
			if (!provider) {
				throw new Error(`Missing model provider for alias "${model.alias}"`)
			}
			for (const capability of model.capabilities ?? defaultAgentModelCapabilities) {
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
		if (!this.runtime.queueBridge) {
			throw new Error(`Agent "${this.dependencies.info.agentName}" requires a queueBridge for execution`)
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

		const serviceConfig: AgentServiceConfig<
			Payload,
			Parameter,
			Resources,
			Models,
			AgentInvokes,
			EmitPayloads,
			ToolInvokes
		> = {
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
				sandbox: this.runtime.sandbox,
				poolId: this.runtime.poolId,
				maxConcurrencyPerInstance: this.runtime.maxConcurrencyPerInstance,
				concurrencyHints: this.runtime.concurrencyHints,
			},
		}

		const executor = new AgentExecutor<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>({
			manifest: this.dependencies.manifest,
			handler: this.dependencies.handler,
			models: this.runtime.models as Models,
			poolManager: this.runtime.poolManager,
			conversationStore: this.runtime.conversationStore,
			logger: this.runtime.logger ?? initLogger(),
			eventBridge: this.runtime.eventBridge,
			tracer: this.runtime.tracer,
			callOptionsSchema: this.dependencies.callOptionsSchema,
			prepareCall: this.dependencies.prepareCall,
			prepareStep: this.dependencies.prepareStep,
			poolId: this.runtime.poolId,
			maxConcurrencyPerInstance: this.runtime.maxConcurrencyPerInstance,
			concurrencyHints: this.runtime.concurrencyHints,
			resources: this.runtime.resources as Resources,
			sandbox: this.runtime.sandbox as AgentSandboxRuntimeConfig<Resources> | undefined,
		})
		attachAgentExecutor(this.runtime.resources, executor)
		type ServiceInstanceOptions = Parameters<AgentRuntimeServiceBuilder['getInstance']>[1]
		const serviceInstanceOptions: ServiceInstanceOptions = {
			logger: this.runtime.logger,
			spanProcessor: this.runtime.spanProcessor,
			secretStore: this.runtime.secretStore,
			configStore: this.runtime.configStore,
			stateStore: this.runtime.stateStore,
			queueBridge: this.runtime.queueBridge,
			serviceConfig,
			resources: this.runtime.resources,
		}

		this.service = await this.dependencies.serviceBuilder.getInstance(this.runtime.eventBridge, serviceInstanceOptions)

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
			serviceVersion: this.dependencies.info.serviceVersion,
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

	getManifest(): AgentManifest {
		return this.dependencies.manifest
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
				serviceVersion: this.dependencies.serviceBuilder.info.serviceVersion,
				payload: request.payload,
				parameter: request.parameter,
				correlationId: request.correlationId,
				sessionId: request.sessionId,
				stream: mergedStream,
				timeoutMs: request.timeoutMs,
				principalId: request.principalId,
				tenantId: request.tenantId,
				otp: request.otp,
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
			return createAgentInvocationFinalResult({
				envelopes,
				agentName: this.dependencies.info.agentName,
				serviceVersion: this.dependencies.serviceBuilder.info.serviceVersion,
			})
		} catch (error) {
			await contextOverrides?.stream?.onError(error)
			await request.stream?.onError(error)
			throw error
		}
	}
}
