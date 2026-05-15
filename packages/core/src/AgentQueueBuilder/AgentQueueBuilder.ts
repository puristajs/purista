import type {
	BuiltinToolName,
	AgentDefinition as HarnessAgentDefinition,
	WorkflowDefinition as HarnessWorkflowDefinition,
} from '@purista/harness'
import { z } from 'zod'
import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/index.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/index.js'
import { StreamDefinitionBuilder } from '../StreamDefinitionBuilder/index.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'
import { getBoundAgentRuntime } from './runtime/scopedRuntime.js'

import type {
	AgentDefinition,
	AgentExecutionDefinition,
	AgentExecutionKind,
	AgentExecutionPolicy,
	AgentHandler,
	AgentHttpExposure,
	AgentManifest,
	AgentModelBinding,
	AgentQueueBuilderTypes,
	AgentQueueResultPolicy,
	AgentResponseMode,
	AgentResponseModeOptions,
	AgentRuntimeRef,
	AgentSandboxPolicy,
	AgentSessionPolicy,
	AllowedAgentDefinition,
	AllowedCommandToolDefinition,
	AnyAgentQueueBuilderTypes,
	AttachedAgentDefinition,
	SupportedHttpMethod,
} from './types.js'

const defaultExecutionPolicy = {
	maxAttempts: 3,
	maxParallelHandlers: 1,
}

const agentStreamChunkSchema = z
	.object({
		event: z.string(),
		data: z.unknown(),
	})
	.passthrough()

type AgentQueueLongRunningExecutionProfile = {
	name: 'longRunning'
	maxRuntimeMs: number
	strict?: boolean
	shutdown?: {
		graceMs?: number
		onTimeout?: 'letLeaseExpire'
	}
	onLeaseLost?: 'abort'
}

type QueueBuilderWithEnterprisePolicy = QueueDefinitionBuilder & {
	setExecutionProfile(
		profile: 'longRunning',
		options: { maxRuntimeMs: number; strict?: boolean },
	): QueueDefinitionBuilder
	setResultPolicy(policy: AgentQueueResultPolicy): QueueDefinitionBuilder
}

/**
 * Builds an attached PURISTA agent from normal core queue, worker, command,
 * stream definitions, and a provider-neutral agent manifest.
 *
 * @example
 * ```ts
 * const triage = service
 *   .getAgentQueueBuilder('supportTriage', 'Classifies tickets')
 *   .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
 *   .setRunFunction(async context => ({ priority: 'high' }))
 * ```
 */
export class AgentQueueBuilder<S extends AnyAgentQueueBuilderTypes = AgentQueueBuilderTypes> {
	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private outputSchema?: Schema
	private models: Record<string, AgentModelBinding> = {}
	private commandTools: AllowedCommandToolDefinition[] = []
	private agentInvokes: AllowedAgentDefinition[] = []
	private skills: Array<{ names: readonly string[]; resourceName?: string }> = []
	private builtInTools: readonly BuiltinToolName[] | false | true = true
	private executionPolicy: AgentExecutionPolicy = {}
	private sessionPolicy: AgentSessionPolicy = { mode: 'ephemeral' }
	private sandboxPolicy?: AgentSandboxPolicy
	private httpExposure?: AgentHttpExposure
	private streamingMode: 'stream' | 'aggregate' = 'stream'
	private successEventName?: string
	private executionProfile?: AgentQueueLongRunningExecutionProfile
	private responseMode?: { mode: AgentResponseMode; options?: AgentResponseModeOptions }
	private executionDefinitions: Array<AgentExecutionDefinition<any, any, any, any, any, any, any>> = []

	constructor(
		private readonly serviceName: string,
		private readonly serviceVersion: string,
		private readonly agentName: string,
		private readonly description: string,
	) {}

	addPayloadSchema<PayloadSchema extends Schema>(schema: PayloadSchema) {
		this.payloadSchema = schema
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				PayloadSchema,
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				S['Execution']
			>
		>
	}

	addParameterSchema<ParameterSchema extends Schema>(schema: ParameterSchema) {
		this.parameterSchema = schema
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				ParameterSchema,
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				S['Execution']
			>
		>
	}

	addOutputSchema<OutputSchema extends Schema>(schema: OutputSchema) {
		this.outputSchema = schema
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				OutputSchema,
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				S['Execution']
			>
		>
	}

	addModel<const Alias extends string, const Binding extends AgentModelBinding>(alias: Alias, binding: Binding) {
		assertNonEmpty(alias, 'model alias')
		this.models[alias] = binding
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'] & Record<Alias, Binding>,
				S['CommandTools'],
				S['AgentTools'],
				S['Execution']
			>
		>
	}

	useSkills(names: readonly string[], resourceName?: string) {
		this.skills.push({ names, resourceName })
		return this
	}

	useBuiltInTools(namesOrFalse: readonly BuiltinToolName[] | false) {
		this.builtInTools = namesOrFalse
		return this
	}

	canInvoke<
		Output extends Schema,
		Payload extends Schema,
		Parameter extends Schema,
		ServiceName extends string,
		Version extends string,
		CommandName extends string,
	>(
		serviceName: ServiceName,
		serviceVersion: Version,
		commandName: CommandName,
		schemas?: { outputSchema?: Output; payloadSchema?: Payload; parameterSchema?: Parameter },
	) {
		this.commandTools.push({
			serviceName,
			serviceVersion,
			commandName,
			outputSchema: schemas?.outputSchema,
			payloadSchema: schemas?.payloadSchema,
			parameterSchema: schemas?.parameterSchema,
		})
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'] &
					Record<`${ServiceName}.${Version}.${CommandName}`, AllowedCommandToolDefinition<Output, Payload, Parameter>>,
				S['AgentTools'],
				S['Execution']
			>
		>
	}

	canInvokeAgent<
		Output extends Schema,
		Payload extends Schema,
		Parameter extends Schema,
		AgentName extends string,
		Version extends string,
	>(
		agentName: AgentName,
		serviceVersion: Version,
		schemas?: { outputSchema?: Output; payloadSchema?: Payload; parameterSchema?: Parameter },
	) {
		this.agentInvokes.push({
			agentName,
			serviceVersion,
			outputSchema: schemas?.outputSchema,
			payloadSchema: schemas?.payloadSchema,
			parameterSchema: schemas?.parameterSchema,
		})
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'] & Record<`${AgentName}.${Version}`, AllowedAgentDefinition<Output, Payload, Parameter>>,
				S['Execution']
			>
		>
	}

	setHarnessAgent(
		this: AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				undefined
			>
		>,
		definition: HarnessAgentDefinition<any>,
	) {
		this.assertNoExecutionDefinition()
		this.executionDefinitions.push({ kind: 'harnessAgent', definition })
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				'harnessAgent'
			>
		>
	}

	setHarnessWorkflow(
		this: AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				undefined
			>
		>,
		definition: HarnessWorkflowDefinition<any>,
	) {
		this.assertNoExecutionDefinition()
		this.executionDefinitions.push({ kind: 'harnessWorkflow', definition })
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				'harnessWorkflow'
			>
		>
	}

	setRunFunction(
		this: AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				undefined
			>
		>,
		handler: AgentHandler<
			InferIn<S['PayloadSchema']>,
			InferIn<S['ParameterSchema']>,
			S['Resources'],
			S['Models'],
			S['CommandTools'],
			S['AgentTools'],
			Infer<S['OutputSchema']>
		>,
	) {
		this.assertNoExecutionDefinition()
		this.executionDefinitions.push({ kind: 'runFunction', handler })
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				'runFunction'
			>
		>
	}

	setExecutionPolicy(policy: AgentExecutionPolicy) {
		this.executionPolicy = { ...this.executionPolicy, ...policy }
		return this
	}

	/**
	 * Apply a core queue execution profile to the generated agent queue.
	 *
	 * @example
	 * ```ts
	 * agent.setExecutionProfile('longRunning', {
	 *   maxRuntimeMs: 30 * 60_000,
	 * })
	 * ```
	 */
	setExecutionProfile(profile: 'longRunning', options: { maxRuntimeMs: number; strict?: boolean }) {
		if (profile !== 'longRunning') {
			throw new Error(`unsupported agent execution profile "${profile}"`)
		}
		this.executionProfile = {
			name: profile,
			maxRuntimeMs: options.maxRuntimeMs,
			strict: options.strict,
			shutdown: { graceMs: 60_000, onTimeout: 'letLeaseExpire' },
			onLeaseLost: 'abort',
		}
		return this
	}

	/**
	 * Configure how a queued agent run exposes its final result contract.
	 *
	 * Long-running response modes enqueue the agent queue and keep `jobId` and
	 * agent `runId` as separate metadata in the generated definitions.
	 *
	 * @example
	 * ```ts
	 * agent.setResponseMode('accepted', {
	 *   resultPolicy: 'state-and-event',
	 * })
	 * ```
	 */
	setResponseMode(mode: AgentResponseMode, options?: AgentResponseModeOptions) {
		this.responseMode = { mode, options }
		return this
	}

	setSessionPolicy(policy: AgentSessionPolicy) {
		this.sessionPolicy = policy
		return this
	}

	setSandboxPolicy(policy: AgentSandboxPolicy) {
		this.sandboxPolicy = policy
		return this
	}

	exposeAsHttpEndpoint(
		method: SupportedHttpMethod,
		path: string,
		options?: Omit<AgentHttpExposure, 'method' | 'path'>,
	) {
		this.httpExposure = { method, path, ...options }
		if (options?.streamingMode) {
			this.streamingMode = options.streamingMode
		}
		return this
	}

	setStreamingMode(mode: 'stream' | 'aggregate') {
		this.streamingMode = mode
		return this
	}

	makeEndpointPublic() {
		this.httpExposure = {
			...(this.httpExposure ?? { method: 'POST', path: `/${this.agentName}` }),
			public: true,
		}
		return this
	}

	setSuccessEventName(eventName: string) {
		assertNonEmpty(eventName, 'success event name')
		this.successEventName = eventName
		return this
	}

	getManifest(): AgentManifest<S['Models']> {
		return this.createManifest(this.resolveExecution().kind)
	}

	async getDefinition(): Promise<AttachedAgentDefinition<S>> {
		const execution = this.resolveExecution()
		const manifest = this.createManifest(execution.kind)
		const runtime: AgentRuntimeRef<Infer<S['OutputSchema']>> = {}
		const agentDefinition: AgentDefinition<S> = {
			manifest,
			payloadSchema: this.payloadSchema as S['PayloadSchema'],
			parameterSchema: this.parameterSchema as S['ParameterSchema'],
			outputSchema: this.outputSchema as S['OutputSchema'],
			execution: execution as AgentDefinition<S>['execution'],
			runtime,
		}
		const queueName = this.getQueueName()
		const workerName = `${this.agentName}:worker`

		const worker = await new QueueWorkerBuilder(queueName, workerName)
			.setMaxParallelHandlers(this.executionPolicy.maxParallelHandlers ?? defaultExecutionPolicy.maxParallelHandlers)
			.setHandler(async function (this: object, context, message) {
				const output = await getRuntime(agentDefinition, this).executeAggregate({
					appContext: context as unknown as Record<string, unknown>,
					message: message as unknown as Record<string, unknown>,
					payload: message.payload,
					parameter: message.parameter,
				})
				return { status: 'success', output }
			})
			.getDefinition()

		const queueBuilder = new QueueDefinitionBuilder(
			queueName,
			`Queue for ${this.serviceName} ${this.agentName} agent`,
		) as QueueBuilderWithEnterprisePolicy
		if (this.executionProfile) {
			queueBuilder.setExecutionProfile(this.executionProfile.name, {
				maxRuntimeMs: this.executionProfile.maxRuntimeMs,
				strict: this.executionProfile.strict,
			})
		} else {
			queueBuilder.setLifecycleConfig(cleanLifecycleConfig(this.executionPolicy))
		}
		const resultPolicy = this.resolveResultPolicy()
		if (resultPolicy) {
			queueBuilder.setResultPolicy(resultPolicy)
		}
		queueBuilder.addWorkerDefinition(worker)

		if (this.payloadSchema) {
			queueBuilder.addPayloadSchema(this.payloadSchema)
		}
		if (this.parameterSchema) {
			queueBuilder.addParameterSchema(this.parameterSchema)
		}

		const commandBuilder = new CommandDefinitionBuilder<any>(
			this.agentName,
			`Run ${this.description}`,
			this.successEventName,
		)
		if (this.payloadSchema) {
			commandBuilder.addPayloadSchema(this.payloadSchema)
		}
		if (this.parameterSchema) {
			commandBuilder.addParameterSchema(this.parameterSchema)
		}
		if (this.outputSchema) {
			commandBuilder.addOutputSchema(this.outputSchema)
		}
		if (this.responseMode) {
			commandBuilder.canEnqueue(queueName, this.payloadSchema, this.parameterSchema)
		}
		for (const tool of this.commandTools) {
			commandBuilder.canInvoke(
				tool.serviceName,
				tool.serviceVersion,
				tool.commandName,
				tool.outputSchema,
				tool.payloadSchema,
				tool.parameterSchema,
			)
		}
		for (const agent of this.agentInvokes) {
			commandBuilder.canInvoke(
				this.serviceName,
				agent.serviceVersion,
				agent.agentName,
				agent.outputSchema,
				agent.payloadSchema,
				agent.parameterSchema,
			)
		}
		if (this.httpExposure && (this.httpExposure.streamingMode ?? this.streamingMode) === 'aggregate') {
			commandBuilder.exposeAsHttpEndpoint(
				this.httpExposure.method,
				this.httpExposure.path,
				this.httpExposure.requestContentType,
				undefined,
				this.httpExposure.responseContentType,
				undefined,
				this.responseMode ? { mode: 'async' } : undefined,
			)
			if (this.httpExposure.public) {
				commandBuilder.makeEndpointPublic()
			}
		}
		commandBuilder.setCommandFunction(async function (this: object, context, payload, parameter) {
			if (manifest.response) {
				const job = await context.queue.enqueue(queueName, payload, parameter)
				return {
					...job,
					runId: `run:${job.jobId}`,
					status: 'queued',
					...(manifest.response.options?.statusUrl ? { statusUrl: manifest.response.options.statusUrl } : {}),
					...(manifest.response.options?.streamUrl ? { streamUrl: manifest.response.options.streamUrl } : {}),
				}
			}
			return getRuntime(agentDefinition, this).executeAggregate({
				appContext: context as unknown as Record<string, unknown>,
				message: context.message as unknown as Record<string, unknown>,
				payload,
				parameter,
			})
		})

		const streamBuilder = new StreamDefinitionBuilder<any>(`${this.agentName}Stream`, `Stream ${this.description}`)
			.addChunkSchema(agentStreamChunkSchema, false)
			.enableChunkAggregation(false)
		if (this.payloadSchema) {
			streamBuilder.addPayloadSchema(this.payloadSchema)
		}
		if (this.parameterSchema) {
			streamBuilder.addParameterSchema(this.parameterSchema)
		}
		if (this.outputSchema) {
			streamBuilder.addFinalSchema(this.outputSchema)
		}
		for (const tool of this.commandTools) {
			streamBuilder.canInvoke(
				tool.serviceName,
				tool.serviceVersion,
				tool.commandName,
				tool.outputSchema,
				tool.payloadSchema,
				tool.parameterSchema,
			)
		}
		for (const agent of this.agentInvokes) {
			streamBuilder.canInvoke(
				this.serviceName,
				agent.serviceVersion,
				agent.agentName,
				agent.outputSchema,
				agent.payloadSchema,
				agent.parameterSchema,
			)
		}
		if (this.httpExposure && (this.httpExposure.streamingMode ?? this.streamingMode) === 'stream') {
			streamBuilder.exposeAsHttpStreamEndpoint(
				this.httpExposure.method,
				this.httpExposure.path,
				this.httpExposure.requestContentType,
			)
			streamBuilder.setHttpStreamingMode(this.streamingMode)
			if (this.httpExposure.public) {
				streamBuilder.makeEndpointPublic()
			}
		}
		streamBuilder.setStreamFunction(async function (this: object, context, payload, parameter, writer) {
			await getRuntime(agentDefinition, this).executeStream({
				appContext: context as unknown as Record<string, unknown>,
				message: context.message as unknown as Record<string, unknown>,
				payload,
				parameter,
				writer,
			})
		})

		return {
			...agentDefinition,
			queue: withAgentQueueMetadata(
				await queueBuilder.getDefinition(),
				this.responseMode,
			) as AttachedAgentDefinition<S>['queue'],
			worker: worker as AttachedAgentDefinition<S>['worker'],
			command: (await commandBuilder.getDefinition()) as AttachedAgentDefinition<S>['command'],
			stream: (await streamBuilder.getDefinition()) as AttachedAgentDefinition<S>['stream'],
		}
	}

	private resolveExecution(): AgentExecutionDefinition {
		if (this.executionDefinitions.length !== 1) {
			throw new Error('AgentQueueBuilder requires exactly one execution definition before getDefinition()')
		}
		return this.executionDefinitions[0]
	}

	private assertNoExecutionDefinition() {
		if (this.executionDefinitions.length > 0) {
			throw new Error('AgentQueueBuilder execution definition is already set')
		}
	}

	private createManifest(kind: AgentExecutionKind): AgentManifest<S['Models']> {
		const execution = {
			...this.executionPolicy,
			maxAttempts: this.executionPolicy.maxAttempts ?? defaultExecutionPolicy.maxAttempts,
			maxParallelHandlers: this.executionPolicy.maxParallelHandlers ?? defaultExecutionPolicy.maxParallelHandlers,
		}
		const base = {
			serviceName: this.serviceName,
			serviceVersion: this.serviceVersion,
			agentName: this.agentName,
			description: this.description,
			models: this.models,
			session: this.sessionPolicy,
			execution,
			sandbox: this.sandboxPolicy,
			http: this.httpExposure,
			response: this.responseMode
				? {
						mode: this.responseMode.mode,
						options: this.responseMode.options,
						jobId: { source: 'queue-job-id' },
						runId: { source: 'queue-job-id', prefix: 'run:' },
					}
				: undefined,
			streamingMode: this.streamingMode,
			successEventName: this.successEventName,
			allowedCommands: this.commandTools,
			allowedAgents: this.agentInvokes,
			usedSkills: this.skills,
			builtInTools: this.builtInTools,
			executionKind: kind,
		}
		return {
			...base,
			runtimeRevision: createRuntimeRevision(base),
		} as unknown as AgentManifest<S['Models']>
	}

	private getQueueName() {
		return `agent:${this.serviceName}:${this.serviceVersion}:${this.agentName}`
	}

	private resolveResultPolicy(): AgentQueueResultPolicy | undefined {
		if (!this.responseMode) {
			return undefined
		}
		const { mode, options } = this.responseMode
		const defaultEventBase = `${this.serviceName}.${this.agentName}`
		const defaultMode =
			mode === 'status'
				? 'state'
				: mode === 'event'
					? 'event'
					: mode === 'stream' || mode === 'callback'
						? 'state-and-event'
						: undefined
		const configured = options?.resultPolicy
		const basePolicy =
			typeof configured === 'object'
				? configured
				: configured || defaultMode
					? ({ mode: configured ?? defaultMode } as AgentQueueResultPolicy)
					: undefined

		if (!basePolicy || basePolicy.mode === 'none') {
			return basePolicy
		}

		return {
			successEventName: options?.successEventName ?? `${defaultEventBase}.completed`,
			failureEventName: options?.failureEventName ?? `${defaultEventBase}.failed`,
			progressEventName: options?.progressEventName ?? `${defaultEventBase}.progress`,
			emitProgressEvents: mode === 'stream' ? true : undefined,
			ttlMs: options?.ttlMs,
			delivery: options?.delivery,
			...basePolicy,
		}
	}
}

function withAgentQueueMetadata(
	queueDefinition: unknown,
	responseMode?: { mode: AgentResponseMode; options?: AgentResponseModeOptions },
) {
	if (!responseMode || !queueDefinition || typeof queueDefinition !== 'object') {
		return queueDefinition
	}
	return {
		...queueDefinition,
		metadata: {
			...((queueDefinition as { metadata?: Record<string, unknown> }).metadata ?? {}),
			agent: {
				response: {
					mode: responseMode.mode,
					options: responseMode.options,
					jobId: { source: 'queue-job-id' },
					runId: { source: 'queue-job-id', prefix: 'run:' },
				},
			},
		},
	}
}

function getRuntime<Output>(definition: AgentDefinition<any>, owner?: object) {
	const runtime = getBoundAgentRuntime<Output>(owner, definition as AttachedAgentDefinition<any>) ?? definition.runtime.current
	if (!runtime) {
		throw new Error(
			'Attached agent runtime is not initialized. Call service.getInstance(...) before executing the agent.',
		)
	}
	return runtime
}

function assertNonEmpty(value: string, label: string) {
	if (value.trim() === '') {
		throw new Error(`${label} must be a non-empty string`)
	}
}

function createRuntimeRevision(value: unknown) {
	const input = JSON.stringify(value, (_key, item) => (typeof item === 'function' ? '[function]' : item))
	let hash = 0
	for (let index = 0; index < input.length; index += 1) {
		hash = (hash * 31 + input.charCodeAt(index)) >>> 0
	}
	return `rev-${hash.toString(36)}`
}

function cleanLifecycleConfig(policy: AgentExecutionPolicy) {
	return {
		...(policy.leaseTtlMs === undefined ? {} : { visibilityTimeoutMs: policy.leaseTtlMs }),
		...(policy.heartbeatIntervalMs === undefined ? {} : { heartbeatIntervalMs: policy.heartbeatIntervalMs }),
		maxAttempts: policy.maxAttempts ?? defaultExecutionPolicy.maxAttempts,
	}
}
