import { createHash } from 'node:crypto'
import type {
	BuiltinToolName,
	AgentDefinition as HarnessAgentDefinition,
	BuilderState as HarnessBuilderState,
	WorkflowDefinition as HarnessWorkflowDefinition,
} from '@purista/harness'
import { z } from 'zod'
import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import { HandledError } from '../core/Error/HandledError.impl.js'
import type { SupportedHttpMethod } from '../core/HttpServer/types/SupportedHttpMethod.js'
import type { PuristaMetricDefinition } from '../core/types/PuristaMetrics.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/index.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/index.js'
import { StreamDefinitionBuilder } from '../StreamDefinitionBuilder/index.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'
import { getBoundAgentRuntime } from './runtime/scopedRuntime.js'

import type {
	AgentDefinition,
	AgentDurabilityPolicy,
	AgentExecutionDefinition,
	AgentExecutionKind,
	AgentExecutionPolicy,
	AgentHandler,
	AgentHarnessDefinition,
	AgentHarnessWorkflowOptions,
	AgentHttpExposure,
	AgentManifest,
	AgentModelBinding,
	AgentModelCapability,
	AgentQueueBuilderTypes,
	AgentQueueResultPolicy,
	AgentResponseMode,
	AgentResponseModeOptions,
	AgentRuntimeRef,
	AgentSandboxPolicy,
	AgentSessionPolicy,
	AgentWorkspacePolicy,
	AllowedAgentDefinition,
	AllowedCommandToolDefinition,
	AnyAgentQueueBuilderTypes,
	AttachedAgentDefinition,
} from './types.js'

const defaultExecutionPolicy = {
	maxAttempts: 3,
	maxParallelHandlers: 1,
}

const defaultWorkspaceCapabilities = [
	'storage.workspace_checkpoint',
	'workspace.durable',
	'workspace.checkpoint',
	'workspace.resume',
	'workspace.cleanup',
] as const

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
 *   .addModel('primary', { capabilities: ['object'] })
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
	private workspacePolicy?: AgentWorkspacePolicy
	private durability?: AgentDurabilityPolicy
	private httpExposure?: AgentHttpExposure
	private endpointPublic = false
	private streamingMode: 'stream' | 'aggregate' = 'stream'
	private successEventName?: string
	private executionProfile?: AgentQueueLongRunningExecutionProfile
	private responseMode?: { mode: AgentResponseMode; options?: AgentResponseModeOptions }
	private executionDefinitions: Array<AgentExecutionDefinition<any, any, any, any, any, any, any>> = []
	private metricDefinitions: Record<string, PuristaMetricDefinition<any>> = {}

	constructor(
		private readonly serviceName: string,
		private readonly serviceVersion: string,
		private readonly agentName: string,
		private readonly description: string,
	) {}

	/**
	 * Declare a custom application metric available only in this agent handler.
	 *
	 * @example
	 * ```ts
	 * agent.defineMetric('app.agent.escalations', {
	 *   kind: 'counter',
	 *   unit: '{escalation}',
	 *   description: 'Escalated agent runs',
	 * })
	 * ```
	 */
	defineMetric<const MetricName extends string, const Definition extends PuristaMetricDefinition<any>>(
		name: MetricName,
		definition: Definition,
	) {
		assertNonEmpty(name, 'metric name')
		this.metricDefinitions[name] = definition
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				S['Execution'],
				S['Metrics'] & { [K in MetricName]: Definition }
			>
		>
	}

	/** Add the payload schema used by the generated queue, command, stream, and agent handler. */
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
				S['Execution'],
				S['Metrics']
			>
		>
	}

	/** Add the parameter schema used by the generated queue, command, stream, and agent handler. */
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
				S['Execution'],
				S['Metrics']
			>
		>
	}

	/** Add the final output schema returned by the agent command or aggregate stream response. */
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
				S['Execution'],
				S['Metrics']
			>
		>
	}

	/**
	 * Declare a model alias that must be bound when the owning service is instantiated.
	 *
	 * @example
	 * ```ts
	 * agent.addModel('primary', {
	 *   capabilities: ['object'],
	 * })
	 * ```
	 */
	addModel<const Alias extends string, const Capabilities extends readonly AgentModelCapability[]>(
		alias: Alias,
		binding: AgentModelBinding<Capabilities>,
	) {
		assertNonEmpty(alias, 'model alias')
		if (!Array.isArray(binding.capabilities) || binding.capabilities.length === 0) {
			throw new Error('model capabilities must contain at least one capability')
		}
		this.models[alias] = binding
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'] & Record<Alias, AgentModelBinding<Capabilities>>,
				S['CommandTools'],
				S['AgentTools'],
				S['Execution'],
				S['Metrics']
			>
		>
	}

	/** Declare named skill references the runtime can load for this agent. */
	useSkills(names: readonly string[], resourceName?: string) {
		if (!Array.isArray(names) || names.length === 0) {
			throw new Error('at least one skill name is required')
		}
		for (const name of names) {
			assertNonEmpty(name, 'skill name')
		}
		if (resourceName !== undefined) {
			assertNonEmpty(resourceName, 'skill resource name')
		}
		this.skills.push({ names, resourceName })
		return this
	}

	/** Restrict or disable harness built-in tools for this agent. */
	useBuiltInTools(namesOrFalse: readonly BuiltinToolName[] | false) {
		if (namesOrFalse !== false && !Array.isArray(namesOrFalse)) {
			throw new Error('built-in tools must be false or an array of tool names')
		}
		this.builtInTools = namesOrFalse
		return this
	}

	/**
	 * Allow the agent handler to call a PURISTA command through `context.invoke.tools`.
	 *
	 * @example
	 * ```ts
	 * agent.canInvoke('billing', '1', 'getInvoice', {
	 *   outputSchema: invoiceSchema,
	 *   payloadSchema: invoiceLookupSchema,
	 * })
	 * ```
	 */
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
		assertNonEmpty(serviceName, 'command tool service name')
		assertNonEmpty(serviceVersion, 'command tool service version')
		assertNonEmpty(commandName, 'command tool name')
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
				S['Execution'],
				S['Metrics']
			>
		>
	}

	/**
	 * Allow this agent to call another attached agent through `context.invoke.agents`.
	 *
	 * @example
	 * ```ts
	 * agent.canInvokeAgent('summarizeTicket', '1', {
	 *   payloadSchema: ticketSchema,
	 *   outputSchema: summarySchema,
	 * })
	 * ```
	 */
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
		assertNonEmpty(agentName, 'agent tool name')
		assertNonEmpty(serviceVersion, 'agent tool service version')
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
				S['Execution'],
				S['Metrics']
			>
		>
	}

	/**
	 * Use one provider-neutral `@purista/harness` agent definition as this
	 * attached agent's execution.
	 *
	 * Pass the inline definition object—the same shape supplied as the second
	 * argument to Harness `agent(id, definition)`—rather than a Harness instance created with
	 * `defineHarness(...).build()`. When the owning service is instantiated,
	 * PURISTA creates and configures the Harness runtime, registers this
	 * definition under the attached agent name, and exposes its generated
	 * command, stream, queue, and worker projections.
	 */
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
				undefined,
				S['Metrics']
			>
		>,
		definition: AgentHarnessDefinition<S['Models']>,
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
				'harnessAgent',
				S['Metrics']
			>
		>
	}

	/**
	 * Use a provider-neutral `@purista/harness` workflow definition as this agent's execution.
	 *
	 * Pass harness-local agent definitions in `options.agents` when the workflow
	 * handler calls `ctx.agents.<name>(...)`. Those agents run inside the same
	 * harness session, sandbox, telemetry setup, and durable workflow boundary as
	 * this attached PURISTA agent.
	 *
	 * @example
	 * ```ts
	 * service
	 *   .getAgentQueueBuilder('incidentReview', 'Reviews one incident')
	 *   .addModel('primary', { capabilities: ['object'] })
	 *   .setHarnessWorkflow(reviewWorkflow, {
	 *     agents: { summarize: summarizeAgent },
	 *   })
	 * ```
	 */
	setHarnessWorkflow<
		Agents extends Record<string, HarnessAgentDefinition<any, any, any>> = Record<string, never>,
		Definition extends HarnessWorkflowDefinition<
			HarnessBuilderState & { agents: Agents },
			any,
			any
		> = HarnessWorkflowDefinition<HarnessBuilderState & { agents: Agents }, any, any>,
	>(
		this: AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				undefined,
				S['Metrics']
			>
		>,
		definition: Definition,
		options: AgentHarnessWorkflowOptions & { agents?: Agents } = {},
	) {
		this.assertNoExecutionDefinition()
		this.executionDefinitions.push({ kind: 'harnessWorkflow', definition, agents: options.agents })
		return this as unknown as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				S['PayloadSchema'],
				S['ParameterSchema'],
				S['OutputSchema'],
				S['Resources'],
				S['Models'],
				S['CommandTools'],
				S['AgentTools'],
				'harnessWorkflow',
				S['Metrics']
			>
		>
	}

	/**
	 * Use a plain async run function as this agent's execution.
	 *
	 * @example
	 * ```ts
	 * agent.setRunFunction(async context => {
	 *   context.metrics['app.agent.runs'].add(1)
	 *   return { answer: `Ticket ${context.payload.ticketId} queued` }
	 * })
	 * ```
	 */
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
				undefined,
				S['Metrics']
			>
		>,
		handler: AgentHandler<
			InferIn<S['PayloadSchema']>,
			InferIn<S['ParameterSchema']>,
			S['Resources'],
			S['Models'],
			S['CommandTools'],
			S['AgentTools'],
			Infer<S['OutputSchema']>,
			S['Metrics']
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
				'runFunction',
				S['Metrics']
			>
		>
	}

	/** Merge queue worker execution policy for the generated agent worker and queue. */
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
		validateResponseMode(mode, options)
		this.responseMode = { mode, options }
		return this
	}

	/** Configure harness session behavior for this attached agent. */
	setSessionPolicy(policy: AgentSessionPolicy) {
		if (policy.mode === 'conversation') {
			if (!Array.isArray(policy.payloadPath) || policy.payloadPath.length === 0) {
				throw new Error('Agent conversation sessions require a non-empty payloadPath')
			}
			for (const segment of policy.payloadPath) {
				assertNonEmpty(segment, 'conversation payloadPath segment')
			}
		} else if (policy.mode !== 'ephemeral') {
			throw new Error(`unsupported agent session mode "${String((policy as { mode?: unknown }).mode)}"`)
		}
		this.sessionPolicy = policy
		return this
	}

	/**
	 * Declare how this agent uses the service-owned Harness sandbox.
	 *
	 * The adapter and owner authorization remain service configuration; an agent
	 * can only request private, inherited, or configured named-group sharing.
	 */
	setSandboxPolicy<const Group extends string = never>(policy: AgentSandboxPolicy<Group>) {
		validateSandboxPolicy(policy)
		this.sandboxPolicy = policy
		return this
	}

	/** Require a durable harness workspace for this attached agent. */
	setWorkspacePolicy(policy: AgentWorkspacePolicy) {
		if (policy.mode !== 'durable') {
			throw new Error(`unsupported agent workspace mode "${String((policy as { mode?: unknown }).mode)}"`)
		}
		if (policy.capabilities) {
			for (const capability of policy.capabilities) {
				assertNonEmpty(capability, 'workspace capability')
			}
		}
		const { capabilities, ...rest } = policy
		this.workspacePolicy = {
			...rest,
			capabilities: capabilities ?? defaultWorkspaceCapabilities,
		}
		return this
	}

	/**
	 * Require recoverable Harness workflow execution with a stable run id read
	 * from the validated payload. Queue retries and later enqueues containing the
	 * same value resume the same logical run.
	 */
	setDurability(policy: AgentDurabilityPolicy) {
		if (
			policy.mode !== 'required' ||
			policy.runIdPath.length === 0 ||
			policy.runIdPath.some(segment => segment.trim() === '')
		) {
			throw new Error('Agent durability requires a non-empty runIdPath')
		}
		this.durability = { mode: 'required', runIdPath: [...policy.runIdPath] }
		return this
	}

	/**
	 * Expose the generated agent command or stream as an HTTP endpoint.
	 *
	 * Use `streamingMode: 'aggregate'` to expose the command projection and
	 * `streamingMode: 'stream'` to expose the stream projection.
	 *
	 * @example
	 * ```ts
	 * agent.exposeAsHttpEndpoint('POST', 'support/triage', {
	 *   streamingMode: 'aggregate',
	 *   responseContentType: 'application/json',
	 * })
	 * ```
	 */
	exposeAsHttpEndpoint(
		method: SupportedHttpMethod,
		path: string,
		options?: Omit<AgentHttpExposure, 'method' | 'path'>,
	) {
		const isPublic = options?.public ?? this.httpExposure?.public ?? this.endpointPublic
		this.httpExposure = { ...this.httpExposure, method, path, ...options, ...(isPublic ? { public: true } : {}) }
		this.endpointPublic = isPublic
		if (options?.streamingMode) {
			this.streamingMode = options.streamingMode
		}
		return this
	}

	/** Choose whether the generated HTTP projection streams chunks or returns an aggregate response. */
	setStreamingMode(mode: 'stream' | 'aggregate') {
		this.streamingMode = mode
		return this
	}

	/** Mark the generated HTTP endpoint public in OpenAPI/security metadata. */
	makeEndpointPublic() {
		this.endpointPublic = true
		if (this.httpExposure) {
			this.httpExposure = { ...this.httpExposure, public: true }
		}
		return this
	}

	/** Set the success event name used by generated command and result policies. */
	setSuccessEventName(eventName: string) {
		assertNonEmpty(eventName, 'success event name')
		this.successEventName = eventName
		return this
	}

	/** Return the provider-neutral manifest for this agent without generating core definitions. */
	getManifest(): AgentManifest<S['Models']> {
		return this.createManifest(this.resolveExecution().kind)
	}

	/** Generate the attached agent and its queue, worker, command, and stream definitions. */
	async getDefinition(): Promise<AttachedAgentDefinition<S>> {
		const execution = this.resolveExecution()
		const manifest = this.createManifest(execution.kind)
		const runtime: AgentRuntimeRef<Infer<S['OutputSchema']>> = {}
		const agentDefinition: AgentDefinition<S> = {
			manifest,
			...(this.sandboxPolicy ? { sandboxPolicy: this.sandboxPolicy } : {}),
			metricDefinitions: { ...this.metricDefinitions },
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
		if (this.durability && kind !== 'harnessWorkflow') {
			throw new Error('Agent durability is supported only for Harness workflow execution')
		}
		if (this.workspacePolicy?.mode === 'durable' && !this.durability) {
			throw new Error("A durable agent workspace requires setDurability({ mode: 'required', runIdPath })")
		}
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
			sandbox: this.sandboxPolicy
				? {
						...(this.sandboxPolicy.sharing ? { sharing: this.sandboxPolicy.sharing } : {}),
						usesExplicitOwner: this.sandboxPolicy.owner !== undefined,
					}
				: undefined,
			workspacePolicy: this.workspacePolicy?.mode === 'durable' ? this.workspacePolicy : undefined,
			durability: this.durability,
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
			runtimeRevision: createRuntimeRevision({
				...base,
				schemas: {
					payload: this.payloadSchema,
					parameter: this.parameterSchema,
					output: this.outputSchema,
				},
			}),
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
			mode === 'status' ? 'state' : mode === 'event' ? 'event' : mode === 'stream' ? 'state-and-event' : undefined
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

function validateSandboxPolicy(policy: AgentSandboxPolicy): void {
	const rawPolicy = policy as Record<string, unknown>
	if ('enabled' in rawPolicy || 'adapter' in rawPolicy) {
		throw new HandledError(
			StatusCode.BadRequest,
			'Agent sandbox policies only support sharing and owner; adapter selection belongs in service ai options',
		)
	}
}

function validateResponseMode(mode: AgentResponseMode, options?: AgentResponseModeOptions): void {
	if (!['accepted', 'status', 'stream', 'event'].includes(mode)) {
		throw new HandledError(StatusCode.BadRequest, `Unsupported agent response mode "${String(mode)}"`)
	}
	if (!options) {
		return
	}
	if (options.statusUrl !== undefined) {
		assertNonEmpty(options.statusUrl, 'status URL')
		if (mode !== 'accepted' && mode !== 'status') {
			throw new HandledError(StatusCode.BadRequest, 'statusUrl is supported only by accepted and status response modes')
		}
	}
	if (options.streamUrl !== undefined) {
		assertNonEmpty(options.streamUrl, 'stream URL')
		if (mode !== 'stream') {
			throw new HandledError(StatusCode.BadRequest, 'streamUrl is supported only by the stream response mode')
		}
	}

	const resultPolicy = options.resultPolicy
	const resultPolicyMode =
		typeof resultPolicy === 'object'
			? resultPolicy.mode
			: (resultPolicy ??
				(mode === 'status' ? 'state' : mode === 'event' ? 'event' : mode === 'stream' ? 'state-and-event' : undefined))
	const eventOptions = [options.successEventName, options.failureEventName, options.progressEventName]
	if (eventOptions.some(value => value !== undefined)) {
		for (const eventName of eventOptions) {
			if (eventName !== undefined) {
				assertNonEmpty(eventName, 'result event name')
			}
		}
		if (resultPolicyMode !== 'event' && resultPolicyMode !== 'state-and-event') {
			throw new HandledError(
				StatusCode.BadRequest,
				'Result event names require an event or state-and-event result policy',
			)
		}
	}
	if (
		(options.ttlMs !== undefined || options.delivery !== undefined) &&
		(!resultPolicyMode || resultPolicyMode === 'none')
	) {
		throw new HandledError(StatusCode.BadRequest, 'Result retention and delivery require a result policy')
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
	const runtime =
		getBoundAgentRuntime<Output>(owner, definition as AttachedAgentDefinition<any>) ?? definition.runtime.current
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
	const digest = createHash('sha256').update(stableStringify(value)).digest('hex')
	return `rev-${digest.slice(0, 16)}`
}

/**
 * Deterministic, cycle-safe JSON serialization used for the runtime revision
 * digest. Keys are sorted so structurally-equal manifests produce identical
 * revisions; functions and circular references are replaced with stable markers
 * so schema internals never throw or leak non-deterministic output.
 */
function stableStringify(value: unknown): string {
	const seen = new WeakSet<object>()
	const normalize = (input: unknown): unknown => {
		if (typeof input === 'function') {
			return '[function]'
		}
		if (input === null || typeof input !== 'object') {
			return input
		}
		if (seen.has(input)) {
			return '[circular]'
		}
		seen.add(input)
		if (Array.isArray(input)) {
			return input.map(normalize)
		}
		const out: Record<string, unknown> = {}
		for (const key of Object.keys(input as Record<string, unknown>).sort()) {
			out[key] = normalize((input as Record<string, unknown>)[key])
		}
		return out
	}
	return JSON.stringify(normalize(value)) ?? ''
}

function cleanLifecycleConfig(policy: AgentExecutionPolicy) {
	return {
		...(policy.leaseTtlMs === undefined ? {} : { visibilityTimeoutMs: policy.leaseTtlMs }),
		...(policy.heartbeatIntervalMs === undefined ? {} : { heartbeatIntervalMs: policy.heartbeatIntervalMs }),
		maxAttempts: policy.maxAttempts ?? defaultExecutionPolicy.maxAttempts,
	}
}
