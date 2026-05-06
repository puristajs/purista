import type {
	EventBridge,
	Infer,
	QueryParameter,
	QueueDefinition,
	QueueWorkerAfterGuardHook,
	QueueWorkerBeforeGuardHook,
	QueueWorkerDefinition,
	Schema,
	SupportedHttpMethod,
} from '@purista/core'
import {
	assertNonArrowFunction,
	CommandDefinitionBuilder,
	QueueDefinitionBuilder,
	QueueWorkerBuilder,
	ServiceBuilder,
	StreamDefinitionBuilder,
} from '@purista/core'
import { agentProtocolEnvelopeSchema } from '../protocol/types.js'
import type { AgentInstance } from '../runtime/AgentInstance.js'
import { AGENT_RUN_TARGET } from '../runtime/agentAddress.js'
import { getAttachedAgentExecutor } from '../runtime/attachedAgentExecutor.js'
import { adaptInvocationContextToProtocolContext } from '../runtime/protocolContextAdapter.js'
import type { AgentSandboxPolicy } from '../sandbox/provider.js'
import type { AgentDefinition, AgentInstanceOptions } from '../types/AgentDefinition.js'
import type { AgentHandler } from '../types/AgentHandler.js'
import type {
	AgentExecutionPolicy,
	AgentHistoryPreset,
	AgentManifest,
	AgentModelBinding,
	AgentModelCapability,
	AgentPolicy,
	AgentSessionConfig,
	AgentStreamProtocolAdapterId,
	AllowedAgentDefinition,
	AllowedToolDefinition,
	ReflectionPolicy,
} from '../types/AgentManifest.js'
import { defaultAgentModelCapabilities } from '../types/AgentManifest.js'
import type {
	AddAgentInvoke,
	AddModelAlias,
	AddResource,
	AddToolInvoke,
	AgentQueueBuilderTypes,
	SetOutputSchema,
	SetParameterSchema,
	SetPayloadSchema,
} from './AgentQueueBuilderTypes.js'

export type AgentModelConfig<Capabilities extends readonly AgentModelCapability[] = readonly AgentModelCapability[]> = {
	capabilities?: Capabilities
	resourceName?: string
}

export type AgentQueueBuilderInput = {
	agentName: string
	description?: string
	successEventName?: string
}

export type AgentQueueDefinitionResult<T extends AgentQueueBuilderTypes = AgentQueueBuilderTypes> = {
	queue: QueueDefinition & QueueDefinition<T['PayloadSchema'], T['ParameterSchema'], T['Resources']>
	worker: QueueWorkerDefinition & QueueWorkerDefinition<T['PayloadSchema'], T['ParameterSchema'], T['Resources']>
	manifest: AgentManifestConfig
	getInstance(
		eventBridge: EventBridge,
		options?: AgentInstanceOptions<string, Record<string, unknown>>,
	): Promise<
		AgentInstance<
			Infer<T['PayloadSchema']>,
			Infer<T['ParameterSchema']>,
			T['Resources'],
			T['Models'],
			T['AgentInvokes'],
			T['EmitPayloads'],
			T['ToolInvokes']
		>
	>
	__agentTypes?: T['Models']
}

export type AgentManifestConfig = {
	agentName: string
	serviceVersion: string
	description?: string
	sandbox?: AgentSandboxPolicy
	executionPolicy?: AgentExecutionPolicy
	reflection?: ReflectionPolicy
	agentPolicy?: AgentPolicy
	model?: AgentModelBinding
	skills?: AgentManifest['skills']
	session?: AgentSessionConfig
	allowedTools: AllowedToolDefinition[]
	allowedAgents?: AllowedAgentDefinition[]
	resources?: Record<string, { resourceName: string }>
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	httpExposure?: {
		method: SupportedHttpMethod
		path: string
		streamingMode?: 'stream' | 'aggregate'
		streamProtocolAdapter?: AgentStreamProtocolAdapterId
		requestContentType?: string
		requestEncoding?: string
		responseContentType?: string
		responseEncoding?: string
		public?: boolean
		queryParameters?: QueryParameter[]
	}
	successEventName?: string
}

type AgentInvokeConfig = {
	serviceVersion?: string
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
}

const mergeHookMap = <THook extends (...args: never[]) => unknown>(
	existing: Record<string, THook>,
	hooks: Record<string, THook>,
	label: string,
) => {
	for (const [name, hook] of Object.entries(hooks)) {
		assertNonArrowFunction(hook, `${label}.${name}`)
	}

	return {
		...existing,
		...hooks,
	}
}

const getHook = <THook>(hooks: Record<string, THook>, name: keyof typeof hooks) => hooks[name]

export class AgentQueueBuilder<T extends AgentQueueBuilderTypes = AgentQueueBuilderTypes> {
	private readonly agentName: string
	private readonly serviceVersion: string
	private description: string

	private queueBuilder: QueueDefinitionBuilder
	private workerBuilder: QueueWorkerBuilder
	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private outputSchema?: Schema
	private models: Map<string, AgentModelConfig> = new Map()
	private agentFunction?: AgentHandler<
		Infer<T['PayloadSchema']>,
		Infer<T['ParameterSchema']>,
		T['Resources'],
		T['Models'],
		T['AgentInvokes'],
		T['EmitPayloads'],
		T['ToolInvokes']
	>
	private executionPolicy: AgentExecutionPolicy = {}
	private sandboxPolicy?: AgentSandboxPolicy
	private reflectionPolicy?: ReflectionPolicy
	private agentPolicy?: AgentPolicy
	private sessionConfig?: AgentSessionConfig
	private skillConfig?: AgentManifest['skills']
	private allowedTools: AllowedToolDefinition[] = []
	private allowedAgents: AllowedAgentDefinition[] = []
	private resourceBindings: Record<string, { resourceName: string }> = {}
	private emitList: Record<string, Schema> = {}
	private httpExposure?: AgentManifestConfig['httpExposure']
	private endpointIsPublic = false
	private successEventName?: string
	private beforeGuardHooks: Record<string, QueueWorkerBeforeGuardHook> = {}
	private afterGuardHooks: Record<string, QueueWorkerAfterGuardHook> = {}
	private maxParallelHandlers = 1
	private workerRegisteredOnQueue = false

	private currentManifest?: AgentManifestConfig

	private castBuilder<TNext extends AgentQueueBuilderTypes>(): AgentQueueBuilder<TNext> {
		return this as unknown as AgentQueueBuilder<TNext>
	}

	constructor(input: AgentQueueBuilderInput, serviceVersion?: string) {
		this.agentName = input.agentName
		this.serviceVersion = serviceVersion ?? '1'
		this.description = input.description ?? `Agent ${input.agentName}`
		this.successEventName = input.successEventName
		this.queueBuilder = new QueueDefinitionBuilder(input.agentName, this.description)
		this.workerBuilder = new QueueWorkerBuilder(input.agentName, `${this.agentName}-worker`)
	}

	static fromServiceBuilder(
		serviceBuilder: { info: { serviceName: string; serviceVersion: string } },
		agentName: string,
		description?: string,
		successEventName?: string,
	): AgentQueueBuilder {
		return new AgentQueueBuilder(
			{
				agentName,
				description,
				successEventName,
			},
			serviceBuilder.info.serviceVersion,
		)
	}

	addPayloadSchema<PayloadSchema extends Schema>(
		schema: PayloadSchema,
	): AgentQueueBuilder<SetPayloadSchema<T, PayloadSchema>> {
		this.payloadSchema = schema
		this.queueBuilder.addPayloadSchema(schema)
		return this.castBuilder<SetPayloadSchema<T, PayloadSchema>>()
	}

	addParameterSchema<ParameterSchema extends Schema>(
		schema: ParameterSchema,
	): AgentQueueBuilder<SetParameterSchema<T, ParameterSchema>> {
		this.parameterSchema = schema
		this.queueBuilder.addParameterSchema(schema)
		return this.castBuilder<SetParameterSchema<T, ParameterSchema>>()
	}

	addOutputSchema<OutputSchema extends Schema>(
		schema: OutputSchema,
	): AgentQueueBuilder<SetOutputSchema<T, OutputSchema>> {
		this.outputSchema = schema
		return this.castBuilder<SetOutputSchema<T, OutputSchema>>()
	}

	addModel<
		Alias extends string,
		Capabilities extends readonly AgentModelCapability[] = typeof defaultAgentModelCapabilities,
	>(alias: Alias, config?: AgentModelConfig<Capabilities>): AgentQueueBuilder<AddModelAlias<T, Alias, Capabilities>> {
		this.models.set(alias, config ?? ({} as AgentModelConfig<Capabilities>))
		return this.castBuilder<AddModelAlias<T, Alias, Capabilities>>()
	}

	defineResource<ResourceName extends string, Resource>(
		resourceName: ResourceName,
	): AgentQueueBuilder<AddResource<T, ResourceName, Resource>> {
		this.resourceBindings[resourceName] = { resourceName }
		return this.castBuilder<AddResource<T, ResourceName, Resource>>()
	}

	useSkills(skillNames: readonly string[], resourceName = 'skills'): AgentQueueBuilder<T> {
		this.skillConfig = {
			resourceName,
			names: [...new Set(skillNames.map(entry => entry.trim()).filter(Boolean))],
		}
		return this
	}

	persistConversation(_historyPreset: AgentHistoryPreset, config: AgentSessionConfig): AgentQueueBuilder<T> {
		this.sessionConfig = config
		return this
	}

	setReflectionPolicy(policy: ReflectionPolicy): AgentQueueBuilder<T> {
		this.reflectionPolicy = policy
		return this
	}

	setAgentPolicy(policy: AgentPolicy): AgentQueueBuilder<T> {
		this.agentPolicy = policy
		return this
	}

	setExecutionPolicy(policy: AgentExecutionPolicy): AgentQueueBuilder<T> {
		this.executionPolicy = policy
		return this
	}

	/**
	 * Declare the sandbox policy for this agent.
	 *
	 * Runtime provisioning still happens through `getInstance(..., { ai: { sandbox } })`
	 * and `context.runtime.sandbox`; the manifest only describes the intended mode
	 * and default reuse scope.
	 *
	 * @example
	 * ```ts
	 * builder.setSandboxPolicy({
	 *   mode: 'optional',
	 *   scope: 'conversation',
	 * })
	 * ```
	 */
	setSandboxPolicy(policy: AgentSandboxPolicy): AgentQueueBuilder<T> {
		this.sandboxPolicy = policy
		return this
	}

	setAgentFunction(
		fn: AgentHandler<
			Infer<T['PayloadSchema']>,
			Infer<T['ParameterSchema']>,
			T['Resources'],
			T['Models'],
			T['AgentInvokes'],
			T['EmitPayloads'],
			T['ToolInvokes']
		>,
	): AgentQueueBuilder<T> {
		assertNonArrowFunction(fn as (...args: never[]) => unknown, 'setAgentFunction')
		this.agentFunction = fn
		return this
	}

	private buildManifestConfig(): AgentManifestConfig {
		const firstModelEntry = this.models.entries().next().value as [string, AgentModelConfig] | undefined
		const modelBinding: AgentModelBinding | undefined = firstModelEntry
			? {
					alias: firstModelEntry[0],
					capabilities: firstModelEntry[1].capabilities
						? [...firstModelEntry[1].capabilities]
						: [...defaultAgentModelCapabilities],
				}
			: undefined

		return {
			agentName: this.agentName,
			serviceVersion: this.serviceVersion,
			description: this.description,
			sandbox: this.sandboxPolicy,
			executionPolicy: this.executionPolicy,
			reflection: this.reflectionPolicy,
			agentPolicy: this.agentPolicy,
			model: modelBinding,
			skills: this.skillConfig,
			session: this.sessionConfig,
			allowedTools: this.allowedTools,
			allowedAgents: this.allowedAgents,
			resources: Object.keys(this.resourceBindings).length > 0 ? this.resourceBindings : undefined,
			payloadSchema: this.payloadSchema,
			parameterSchema: this.parameterSchema,
			outputSchema: this.outputSchema,
			httpExposure: this.httpExposure,
			successEventName: this.successEventName,
		}
	}

	build(): AgentDefinition<string, T['Resources']> {
		const manifestConfig = this.buildManifestConfig()
		const manifest: AgentManifest = {
			agentName: manifestConfig.agentName,
			serviceVersion: manifestConfig.serviceVersion,
			description: manifestConfig.description,
			eventBridge: 'default',
			sandbox: manifestConfig.sandbox,
			executionPolicy: manifestConfig.executionPolicy,
			reflection: this.reflectionPolicy,
			agentPolicy: this.agentPolicy,
			models: manifestConfig.model ? [manifestConfig.model] : undefined,
			skills: this.skillConfig,
			session: this.sessionConfig,
			allowedTools: manifestConfig.allowedTools,
			allowedAgents: manifestConfig.allowedAgents,
			resources: Object.keys(this.resourceBindings).length > 0 ? this.resourceBindings : undefined,
			payloadSchema: manifestConfig.payloadSchema,
			parameterSchema: manifestConfig.parameterSchema,
			outputSchema: manifestConfig.outputSchema,
			httpExposure: manifestConfig.httpExposure,
			successEventName: manifestConfig.successEventName,
		}

		return {
			info: {
				agentName: this.agentName,
				serviceVersion: this.serviceVersion,
				description: this.description,
				successEventName: this.successEventName,
			},
			manifest,
			schemas: {
				payload: this.payloadSchema,
				parameter: this.parameterSchema,
				output: this.outputSchema,
			},
			getManifest: () => manifest,
			getExternalRuntimeMetadata: () => ({
				commands: this.allowedTools,
				agents: this.allowedAgents,
			}),
			getInstance: async (eventBridge, options) => await this.getInstance(eventBridge, options),
			getDefaultConfig: () => undefined,
		}
	}

	canInvoke<
		ServiceName extends string,
		ServiceVersion extends string,
		CommandName extends string,
		OutputSchema extends Schema = Schema,
		PayloadSchema extends Schema = Schema,
		ParameterSchema extends Schema = Schema,
	>(
		serviceName: ServiceName,
		serviceVersion: ServiceVersion,
		commandName: CommandName,
		_outputSchema?: OutputSchema,
		_payloadSchema?: PayloadSchema,
		_parameterSchema?: ParameterSchema,
	): AgentQueueBuilder<
		AddToolInvoke<T, ServiceName, ServiceVersion, CommandName, PayloadSchema, ParameterSchema, OutputSchema>
	> {
		this.allowedTools.push({
			serviceName,
			serviceVersion,
			commandName,
		})
		return this.castBuilder<
			AddToolInvoke<T, ServiceName, ServiceVersion, CommandName, PayloadSchema, ParameterSchema, OutputSchema>
		>()
	}

	canInvokeAgent<
		AgentName extends string,
		ServiceVersion extends string = '1',
		PayloadSchema extends Schema = Schema,
		ParameterSchema extends Schema = Schema,
		OutputSchema extends Schema = Schema,
	>(
		agentName: AgentName,
		serviceVersionOrConfig?:
			| ServiceVersion
			| {
					serviceVersion?: ServiceVersion
					payloadSchema?: PayloadSchema
					parameterSchema?: ParameterSchema
					outputSchema?: OutputSchema
			  },
		invokeConfig?: {
			payloadSchema?: PayloadSchema
			parameterSchema?: ParameterSchema
			outputSchema?: OutputSchema
		},
	): AgentQueueBuilder<AddAgentInvoke<T, AgentName, ServiceVersion, PayloadSchema, ParameterSchema, OutputSchema>> {
		const config: AgentInvokeConfig =
			typeof serviceVersionOrConfig === 'string' ? (invokeConfig ?? {}) : (serviceVersionOrConfig ?? {})
		const serviceVersion =
			typeof serviceVersionOrConfig === 'string' ? serviceVersionOrConfig : (config.serviceVersion ?? '1')

		this.allowedAgents.push({
			agentName,
			serviceVersion,
			payloadSchema: config.payloadSchema,
			parameterSchema: config.parameterSchema,
			outputSchema: config.outputSchema,
		})
		return this.castBuilder<
			AddAgentInvoke<T, AgentName, ServiceVersion, PayloadSchema, ParameterSchema, OutputSchema>
		>()
	}

	canEmit(eventName: string, schema: Schema): AgentQueueBuilder<T> {
		this.emitList = {
			...this.emitList,
			[eventName]: schema,
		}
		return this
	}

	private ensureHttpExposure(): NonNullable<AgentManifestConfig['httpExposure']> {
		if (!this.httpExposure) {
			this.httpExposure = {
				method: 'POST',
				path: this.agentName,
				requestContentType: 'application/json',
				requestEncoding: 'utf-8',
				responseContentType: 'text/event-stream',
				responseEncoding: 'utf-8',
				streamingMode: 'stream',
				streamProtocolAdapter: 'purista',
				public: this.endpointIsPublic,
			}
		}
		return this.httpExposure
	}

	private syncHttpExposureWithStreamingMode(mode: 'stream' | 'aggregate') {
		const exposure = this.ensureHttpExposure()
		exposure.streamingMode = mode
		exposure.responseEncoding = 'utf-8'
		if (mode === 'stream') {
			exposure.responseContentType = 'text/event-stream'
			exposure.streamProtocolAdapter ??= 'purista'
			return
		}
		exposure.responseContentType = 'application/json'
		delete exposure.streamProtocolAdapter
	}

	exposeAsHttpEndpoint(
		method: SupportedHttpMethod,
		path: string,
		requestContentType?: string,
		requestEncoding?: string,
		responseContentType?: string,
		responseEncoding?: string,
	): AgentQueueBuilder<T> {
		this.httpExposure = {
			method,
			path,
			requestContentType: requestContentType ?? 'application/json',
			requestEncoding: requestEncoding ?? 'utf-8',
			responseContentType: responseContentType ?? 'text/event-stream',
			responseEncoding: responseEncoding ?? 'utf-8',
			streamingMode: 'stream',
			streamProtocolAdapter: 'purista',
			public: this.endpointIsPublic,
		}
		return this
	}

	setStreamingMode(mode: 'stream' | 'aggregate'): AgentQueueBuilder<T> {
		this.syncHttpExposureWithStreamingMode(mode)
		return this
	}

	setStreamProtocolAdapter(protocol: AgentStreamProtocolAdapterId): AgentQueueBuilder<T> {
		const exposure = this.ensureHttpExposure()
		if ((exposure.streamingMode ?? 'stream') !== 'stream') {
			throw new Error('AgentQueueBuilder: stream protocol adapters can only be configured for streaming endpoints.')
		}
		exposure.streamProtocolAdapter = protocol
		return this
	}

	makeEndpointPublic(): AgentQueueBuilder<T> {
		this.endpointIsPublic = true
		this.ensureHttpExposure().public = true
		return this
	}

	addQueryParameters(params: QueryParameter[]): AgentQueueBuilder<T> {
		this.ensureHttpExposure().queryParameters = params
		return this
	}

	setSuccessEventName(eventName: string): AgentQueueBuilder<T> {
		this.successEventName = eventName
		return this
	}

	setBeforeGuardHooks(hooks: Record<string, QueueWorkerBeforeGuardHook>): AgentQueueBuilder<T> {
		this.beforeGuardHooks = mergeHookMap(this.beforeGuardHooks, hooks, 'setBeforeGuardHooks')
		return this
	}

	setAfterGuardHooks(hooks: Record<string, QueueWorkerAfterGuardHook>): AgentQueueBuilder<T> {
		this.afterGuardHooks = mergeHookMap(this.afterGuardHooks, hooks, 'setAfterGuardHooks')
		return this
	}

	getBeforeGuardHook(name: keyof typeof this.beforeGuardHooks) {
		return getHook(this.beforeGuardHooks, name)
	}

	getAfterGuardHook(name: keyof typeof this.afterGuardHooks) {
		return getHook(this.afterGuardHooks, name)
	}

	setMaxParallelHandlers(count: number): AgentQueueBuilder<T> {
		this.maxParallelHandlers = count
		return this
	}

	async getDefinition(): Promise<AgentQueueDefinitionResult<T>> {
		if (!this.agentFunction) {
			throw new Error('AgentQueueBuilder: agent function not set. Call setAgentFunction() before getDefinition().')
		}

		const resolvedPolicy = {
			leaseTtlMs: this.executionPolicy.leaseTtlMs ?? 15 * 60 * 1000,
			heartbeatIntervalMs: this.executionPolicy.heartbeatIntervalMs ?? 5 * 60 * 1000,
			maxLeaseExtensions: this.executionPolicy.maxLeaseExtensions ?? 3,
			maxAttempts: this.executionPolicy.maxAttempts ?? 10,
			maxModelSteps: this.executionPolicy.maxModelSteps,
			maxToolCalls: this.executionPolicy.maxToolCalls,
		}

		this.queueBuilder.setLifecycleConfig({
			visibilityTimeoutMs: resolvedPolicy.leaseTtlMs,
			heartbeatIntervalMs: resolvedPolicy.heartbeatIntervalMs,
			maxLeaseExtensions: resolvedPolicy.maxLeaseExtensions,
			maxAttempts: resolvedPolicy.maxAttempts,
		})

		this.queueBuilder.setQueueBridgeConfig({
			prefetch: 1,
			orderingGuarantee: 'fifo',
		})

		this.workerBuilder
			.setMode('continuous')
			.setMaxParallelHandlers(this.maxParallelHandlers)
			.setBeforeGuardHooks(this.beforeGuardHooks)
			.setAfterGuardHooks(this.afterGuardHooks)
			.setHandler(async (context, message): Promise<{ status: 'success'; output: unknown }> => {
				const executor = getAttachedAgentExecutor(context.resources as Record<string, unknown>)
				const result = await executor.execute(context, message)
				return {
					status: 'success' as const,
					output: result,
				}
			})

		const worker = await this.workerBuilder.getDefinition()

		if (!this.workerRegisteredOnQueue) {
			this.queueBuilder.addWorkerDefinition(worker)
			this.workerRegisteredOnQueue = true
		}

		const queue = await this.queueBuilder.getDefinition()

		this.currentManifest = this.buildManifestConfig()

		return {
			queue,
			worker,
			manifest: this.currentManifest,
			getInstance: async (eventBridge: EventBridge, options?: AgentInstanceOptions<string, Record<string, unknown>>) =>
				await this.getInstance(eventBridge, options),
		}
	}

	async getManifest(): Promise<AgentManifestConfig> {
		return (await this.getDefinition()).manifest
	}

	async getInstance(
		eventBridge: EventBridge,
		options?: AgentInstanceOptions<string, Record<string, unknown>>,
	): Promise<
		AgentInstance<
			Infer<T['PayloadSchema']>,
			Infer<T['ParameterSchema']>,
			T['Resources'],
			T['Models'],
			T['AgentInvokes'],
			T['EmitPayloads'],
			T['ToolInvokes']
		>
	> {
		if (!this.agentFunction) {
			throw new Error('AgentQueueBuilder: agent function not set. Call setAgentFunction() before getInstance().')
		}

		if (!this.currentManifest) {
			await this.getDefinition()
		}

		const currentManifest = this.currentManifest
		if (!currentManifest) {
			throw new Error('AgentQueueBuilder: failed to resolve agent manifest')
		}

		const serviceBuilder = new ServiceBuilder({
			serviceName: this.agentName,
			serviceVersion: this.serviceVersion,
			serviceDescription: this.description,
		})
		const runCommandBuilder = new CommandDefinitionBuilder(AGENT_RUN_TARGET, `${this.description} run`)
		const runStreamBuilder = new StreamDefinitionBuilder(AGENT_RUN_TARGET, `${this.description} run`)

		if (this.payloadSchema) {
			runCommandBuilder.addPayloadSchema(this.payloadSchema)
			runStreamBuilder.addPayloadSchema(this.payloadSchema)
		}

		if (this.parameterSchema) {
			runCommandBuilder.addParameterSchema(this.parameterSchema)
			runStreamBuilder.addParameterSchema(this.parameterSchema)
		}

		runCommandBuilder
			.addOutputSchema(agentProtocolEnvelopeSchema.array())
			.setCommandFunction(async function (context, payload, parameter) {
				const protocolContext = adaptInvocationContextToProtocolContext(context, currentManifest, eventBridge)
				const result = await getAttachedAgentExecutor(
					context.resources as Record<string, unknown>,
				).executeWithProtocolContext(protocolContext, payload as Infer<T['PayloadSchema']>, parameter ?? {})
				return result.envelopes
			})

		runStreamBuilder
			.addChunkSchema(agentProtocolEnvelopeSchema)
			.addFinalSchema(agentProtocolEnvelopeSchema.array())
			.enableChunkAggregation(false)
			.setStreamFunction(async function (context, payload, parameter, writer) {
				const protocolContext = adaptInvocationContextToProtocolContext(context, currentManifest, eventBridge)
				const result = await getAttachedAgentExecutor(
					context.resources as Record<string, unknown>,
				).executeWithProtocolContext(
					protocolContext,
					payload as Infer<T['PayloadSchema']>,
					parameter ?? {},
					async envelope => {
						await writer.write(envelope)
					},
				)
				await writer.close(result.envelopes)
			})

		for (const [eventName, schema] of Object.entries(this.emitList)) {
			runCommandBuilder.canEmit(eventName, schema)
			runStreamBuilder.canEmit(eventName, schema)
		}

		if (this.successEventName && this.outputSchema) {
			runCommandBuilder.canEmit(this.successEventName, this.outputSchema)
			runStreamBuilder.canEmit(this.successEventName, this.outputSchema)
		}

		serviceBuilder
			.addQueueDefinition(this.queueBuilder.getDefinition())
			.addQueueWorkerDefinition(this.workerBuilder.getDefinition())
			.addCommandDefinition(runCommandBuilder.getDefinition())
			.addStreamDefinition(runStreamBuilder.getDefinition())

		const agentManifest: AgentManifest = {
			agentName: currentManifest.agentName,
			serviceVersion: currentManifest.serviceVersion,
			description: currentManifest.description,
			eventBridge: 'default',
			sandbox: currentManifest.sandbox,
			executionPolicy: currentManifest.executionPolicy,
			reflection: this.reflectionPolicy,
			agentPolicy: this.agentPolicy,
			models: currentManifest.model ? [currentManifest.model] : undefined,
			skills: this.skillConfig,
			session: this.sessionConfig,
			allowedTools: currentManifest.allowedTools,
			allowedAgents: currentManifest.allowedAgents,
			resources: Object.keys(this.resourceBindings).length > 0 ? this.resourceBindings : undefined,
			payloadSchema: currentManifest.payloadSchema,
			parameterSchema: currentManifest.parameterSchema,
			outputSchema: currentManifest.outputSchema,
			httpExposure: currentManifest.httpExposure,
			successEventName: currentManifest.successEventName,
		}

		const { AgentInstance } = await import('../runtime/AgentInstance.js')

		const instance: AgentInstance<
			Infer<T['PayloadSchema']>,
			Infer<T['ParameterSchema']>,
			T['Resources'],
			T['Models'],
			T['AgentInvokes'],
			T['EmitPayloads'],
			T['ToolInvokes']
		> = new AgentInstance(
			{
				info: {
					agentName: this.agentName,
					serviceVersion: this.serviceVersion,
					description: this.description,
					successEventName: this.successEventName,
				},
				manifest: agentManifest,
				serviceBuilder,
				handler: this.agentFunction,
			},
			eventBridge,
			options,
		)

		return instance
	}
}

export type {
	AddResource,
	AddAgentInvoke,
	AddModelAlias,
	AddToolInvoke,
	AgentQueueBuilderTypes,
	SetOutputSchema,
	SetParameterSchema,
	SetPayloadSchema,
}
