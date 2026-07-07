import type {
	BuiltinToolName,
	DurableRuntime,
	GovernanceConfig,
	Harness,
	AgentDefinition as HarnessAgentDefinition,
	WorkflowDefinition as HarnessWorkflowDefinition,
	ModelAlias,
	ModelCapability,
	ModelDefaults,
	ModelHandle,
	ModelProvider,
	RunEvent,
	Session,
	TelemetryOptions,
} from '@purista/harness'
import type { SupportedHttpMethod } from '../core/HttpServer/types/SupportedHttpMethod.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { Logger as PuristaLogger } from '../core/types/Logger.js'
import type { PuristaMetricContext, PuristaMetricDefinitions } from '../core/types/PuristaMetrics.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'

/** Model capability names supported by `@purista/harness` model bindings. */
export type AgentModelCapability = ModelCapability

/** Execution implementation kind used by an attached agent definition. */
export type AgentExecutionKind = 'harnessAgent' | 'harnessWorkflow' | 'runFunction'

/**
 * Declares a model alias required by an attached PURISTA agent.
 *
 * The provider is supplied at service instantiation time; this declaration is
 * the compile-time and startup contract for handlers and harness setup.
 *
 * @example
 * ```ts
 * builder.addModel('primary', {
 *   model: 'gpt-4.1-mini',
 *   capabilities: ['object', 'tool_use'],
 *   defaults: { temperature: 0.2 },
 * })
 * ```
 */
export type AgentModelBinding<
	Capabilities extends readonly AgentModelCapability[] = readonly AgentModelCapability[],
	Model extends string = string,
> = {
	model: Model
	capabilities: Capabilities
	defaults?: ModelDefaults
}

export type AgentRuntimeModelBinding<Binding extends AgentModelBinding = AgentModelBinding> = {
	/** Provider instance used by the attached agent runtime for this model alias. */
	provider: ModelProvider
	/** Optional runtime model override for the statically declared model id. */
	model?: string
	/** Optional runtime capability override for the statically declared capabilities. */
	capabilities?: readonly AgentModelCapability[]
	/** Default model options applied by the harness provider. */
	defaults?: ModelDefaults
	/** Provider-specific runtime options. */
	providerOptions?: Record<string, unknown>
} & Partial<Pick<Binding, 'model'>>

/** Runtime model bindings keyed by every model alias declared on an agent builder. */
export type AgentRuntimeModelBindings<Models extends Record<string, AgentModelBinding>> = {
	[K in keyof Models]: AgentRuntimeModelBinding<Models[K]>
}

/** Typed model handles exposed to an agent run function. */
export type AgentHandlerModelBindings<Models extends Record<string, AgentModelBinding>> = {
	readonly [K in keyof Models]: ModelHandle<Models[K]>
}

/** Declares one service command that an attached agent may call as a typed tool. */
export type AllowedCommandToolDefinition<
	Output extends Schema = Schema,
	Payload extends Schema = Schema,
	Parameter extends Schema = Schema,
> = {
	/** Target service name. */
	serviceName: string
	/** Target service version. */
	serviceVersion: string
	/** Target command name. */
	commandName: string
	/** Optional schema for the command result. */
	outputSchema?: Output
	/** Optional schema for the command payload. */
	payloadSchema?: Payload
	/** Optional schema for the command parameter. */
	parameterSchema?: Parameter
}

/** Declares one attached agent that this attached agent may call. */
export type AllowedAgentDefinition<
	Output extends Schema = Schema,
	Payload extends Schema = Schema,
	Parameter extends Schema = Schema,
> = {
	/** Target agent command name. */
	agentName: string
	/** Target service version. */
	serviceVersion: string
	/** Optional schema for the child agent result. */
	outputSchema?: Output
	/** Optional schema for the child agent payload. */
	payloadSchema?: Payload
	/** Optional schema for the child agent parameter. */
	parameterSchema?: Parameter
}

/** Queue execution policy applied to the generated agent worker and queue. */
export type AgentExecutionPolicy = {
	/** Queue visibility timeout used as the agent lease TTL. */
	leaseTtlMs?: number
	/** Queue heartbeat interval used while an agent run is active. */
	heartbeatIntervalMs?: number
	/** Maximum delivery attempts for a queued agent run. */
	maxAttempts?: number
	/** Maximum number of agent runs handled concurrently by the generated worker. */
	maxParallelHandlers?: number
	/** Optional execution timeout in milliseconds for runtimes that honor it. */
	timeoutMs?: number
}

/** Storage or event side effect used for queued agent run results. */
export type AgentQueueResultPolicyMode = 'none' | 'event' | 'state' | 'state-and-event'

/** Controls how generated queues persist and/or emit agent worker completion metadata. */
export type AgentQueueResultPolicy = {
	/** Result handling mode for the generated queue. */
	mode: AgentQueueResultPolicyMode
	/** Event emitted when an agent run succeeds. */
	successEventName?: string
	/** Event emitted when an agent run fails. */
	failureEventName?: string
	/** Event emitted when an agent run is cancelled. */
	cancelledEventName?: string
	/** Event emitted when an agent run is dead-lettered. */
	deadLetterEventName?: string
	/** Event emitted for progress updates when enabled. */
	progressEventName?: string
	/** Optional result metadata TTL in milliseconds. */
	ttlMs?: number
	/** Emit progress events from queue result metadata when supported. */
	emitProgressEvents?: boolean
	/** Event id strategy used for generated queue result events. */
	eventId?:
		| 'jobIdAndStatus'
		| ((input: { jobId: string; queueName: string; status: string; attempt: number }) => string)
	/** Whether result side effects are required or best effort. */
	delivery?: 'required' | 'best-effort'
}

/** Public response contract exposed by the generated agent command or stream. */
export type AgentResponseMode = 'accepted' | 'status' | 'stream' | 'event'

/** Options for long-running agent response contracts. */
export type AgentResponseModeOptions = {
	/** Queue result handling policy for this response mode. */
	resultPolicy?: AgentQueueResultPolicyMode | AgentQueueResultPolicy
	/** Optional success event override. */
	successEventName?: string
	/** Optional failure event override. */
	failureEventName?: string
	/** Optional progress event override. */
	progressEventName?: string
	/** Optional result metadata TTL in milliseconds. */
	ttlMs?: number
	/** Whether result side effects are required or best effort. */
	delivery?: AgentQueueResultPolicy['delivery']
	/** Status URL returned by accepted/status response modes. */
	statusUrl?: string
	/** Stream URL returned by stream response mode metadata. */
	streamUrl?: string
}

/** Session behavior used by the harness runtime for each agent run. */
export type AgentSessionPolicy = { mode: 'ephemeral' } | { mode: 'conversation'; payloadPath: readonly string[] }

/** Optional sandbox adapter configuration passed through to the agent runtime. */
export type AgentSandboxPolicy = {
	/**
	 * Opt this agent in or out of sandboxing.
	 *
	 * `false` disables the sandbox for this agent even when a shared
	 * `ai.sandbox` is configured. When omitted or `true`, the agent uses
	 * `adapter` if provided, otherwise the shared `ai.sandbox`.
	 */
	enabled?: boolean
	/** Runtime-specific sandbox adapter. Takes precedence over the shared `ai.sandbox`. */
	adapter?: unknown
}

/** Resolves a declared agent skill name to a runtime skill directory. */
export type AgentSkillResolver = (input: {
	name: string
	resourceName?: string
	serviceName: string
	serviceVersion: string
	agentName: string
}) => Promise<{ directory: string } | undefined> | { directory: string } | undefined

/** Runtime binding for a skill declared with `AgentQueueBuilder.useSkills(...)`. */
export type AgentSkillRuntimeBinding =
	| {
			/** Absolute or application-relative directory containing `SKILL.md`. */
			directory: string
			/** Trust level reported to the harness skill catalog. */
			trust?: 'trusted' | 'project' | 'user'
			/** Optional source label used in diagnostics and catalogs. */
			source?: string
	  }
	| {
			/** Lazy resolver for skill directories that depend on service or agent identity. */
			resolver: AgentSkillResolver
			trust?: 'trusted' | 'project' | 'user'
			source?: string
	  }

/** Optional local skill discovery settings for attached agent runtime startup. */
export type AgentSkillDiscoveryOptions = {
	/** Project root used for project-local skill discovery. */
	projectRoot?: string
	includeProjectAgentsDir?: boolean
	includeProjectClientDir?: boolean
	includeUserAgentsDir?: boolean
	includeUserClientDir?: boolean
	includeClaudeCompatDir?: boolean
	includeAncestorProjectDirs?: boolean
	trustedProjectRoots?: readonly string[]
	maxDepth?: number
	maxDirectories?: number
}

/** Runtime skill bindings supplied through `ServiceBuilder.getInstance(..., { ai: { skills } })`. */
export type AgentSkillRuntimeOptions = {
	/** Global skill bindings keyed by skill name. */
	bindings?: Record<string, AgentSkillRuntimeBinding>
	/** Resource-scoped skill bindings keyed by `resourceName`, then skill name. */
	namespaces?: Record<string, Record<string, AgentSkillRuntimeBinding>>
	/** Optional trusted discovery. Use explicit bindings for production where possible. */
	discovery?: false | AgentSkillDiscoveryOptions
}

/** Metadata-only skill catalog entry exposed to attached agent handlers. */
export type AgentSkillCatalogEntry = {
	name: string
	description: string
	location: string
	mountPath: `/skills/${string}`
	resourceName?: string
	compatibility?: string
	trust: 'trusted' | 'project' | 'user'
	source?: string
}

/** Handler helper for resolving declared skill metadata without exposing skill bodies. */
export type AgentSkillContext = {
	catalog: readonly AgentSkillCatalogEntry[]
	/** Returns the metadata-only prompt fragment used by harness-backed agents. */
	systemPromptFragment(): string
	/** Resolve one declared skill by name from the metadata catalog. */
	resolve(name: string): AgentSkillCatalogEntry | undefined
}

/** Internal resolved skill binding passed from PURISTA runtime wiring into `@purista/harness`. */
export type AgentSkillRuntimeResolved = {
	harnessSkills: Record<string, { directory: string; trust?: 'trusted' | 'project' | 'user'; source?: string }>
	catalog: readonly AgentSkillCatalogEntry[]
}

/** Capability required by a durable attached-agent workspace policy. */
export type AgentWorkspaceCapabilityRequirement = string

/** Adapter-neutral durable workspace policy mirrored from `@purista/harness`. */
export type AgentDurableWorkspaceStorePolicy = {
	retention?: Record<string, unknown>
	encryption?: Record<string, unknown>
	quota?: Record<string, unknown>
}

/** Structural durable workspace store accepted until the harness package version is bumped. */
export type AgentDurableWorkspaceStore = {
	readonly capabilities?: readonly string[]
	readonly info?: {
		readonly capabilities?: readonly string[]
	}
}

/** Durable workspace behavior declared by an attached agent manifest. */
export type AgentWorkspacePolicy = {
	mode: 'durable'
	/** Missing runtime/workspace stores fail service startup. Default: `true`. */
	required?: boolean
	/** Harness adapter capabilities required for this policy. */
	capabilities?: readonly AgentWorkspaceCapabilityRequirement[]
	/** Adapter-neutral durable workspace policy forwarded to compatible runtimes. */
	policy?: AgentDurableWorkspaceStorePolicy
	/** Cleanup timing requested by the generated agent runtime. */
	cleanup?: 'on_success' | 'on_terminal' | 'manual'
}

/** HTTP projection metadata for the generated agent command or stream. */
export type AgentHttpExposure = {
	/** HTTP method exposed by the generated definition. */
	method: SupportedHttpMethod
	/** HTTP path exposed by the generated definition. */
	path: string
	/** Expose streaming SSE-like chunks or one aggregate JSON response. */
	streamingMode?: 'stream' | 'aggregate'
	/** Marks the HTTP endpoint public by disabling generated security metadata. */
	public?: boolean
	/** Request content type for generated HTTP metadata. */
	requestContentType?: string
	/** Response content type for aggregate HTTP metadata. */
	responseContentType?: string
}

/** Stable run identity propagated through attached agent execution events and results. */
export type AgentRunIdentity = {
	transportMessageId: string
	correlationId?: string
	traceId?: string
	otp?: string
	tenantId?: string
	principalId?: string
	serviceName: string
	serviceVersion: string
	agentName: string
	runtimeRevision: string
	runId: string
	harnessSessionId: string
}

/** Harness run event decorated with PURISTA agent identity metadata. */
export type AgentRunEvent = {
	identity: AgentRunIdentity
	event: RunEvent
}

/** Aggregate result returned by an attached agent runtime. */
export type AgentRunResult<Output = unknown> = {
	identity: AgentRunIdentity
	output: Output
	events: AgentRunEvent[]
}

/** Infers an agent tool input schema when one is declared, otherwise falls back to `unknown`. */
export type InferOptionalInput<T> = [NonNullable<T>] extends [never]
	? unknown
	: NonNullable<T> extends Schema
		? InferIn<NonNullable<T>>
		: unknown

/** Infers an agent tool output schema when one is declared, otherwise falls back to `unknown`. */
export type InferOptionalOutput<T> = [NonNullable<T>] extends [never]
	? unknown
	: NonNullable<T> extends Schema
		? Infer<NonNullable<T>>
		: unknown

/** Typed command tool call map exposed at `context.invoke.tools`. */
export type CommandToolInvokeMap<Tools extends Record<string, AllowedCommandToolDefinition>> = {
	readonly [K in keyof Tools]: {
		call(
			payload: InferOptionalInput<Tools[K]['payloadSchema']>,
			parameter?: InferOptionalInput<Tools[K]['parameterSchema']>,
		): Promise<InferOptionalOutput<Tools[K]['outputSchema']>>
	}
}

/** Typed child-agent invocation map exposed at `context.invoke.agents`. */
export type AgentInvokeMap<Agents extends Record<string, AllowedAgentDefinition>> = {
	readonly [K in keyof Agents]: {
		run(
			payload: InferOptionalInput<Agents[K]['payloadSchema']>,
			parameter?: InferOptionalInput<Agents[K]['parameterSchema']>,
		): Promise<InferOptionalOutput<Agents[K]['outputSchema']>>
	}
}

/** Context passed to an attached agent run function. */
export type AgentHandlerContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<never, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<never, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<never, never>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = {
	/** Validated payload for the agent run. */
	payload: Payload
	/** Validated parameter object for the agent run. */
	parameter: Parameter
	/** Stable agent run identity and trace/correlation metadata. */
	identity: AgentRunIdentity
	/** the original PURISTA message context */
	message: unknown
	/** emit a custom message through the owning PURISTA service */
	emit: unknown
	/** typed PURISTA command invocation proxy when declarations are available */
	service: unknown
	/** typed PURISTA stream invocation proxy when declarations are available */
	stream: unknown
	/** PURISTA queue helpers from the owning handler context */
	queue: unknown
	/**
	 * Provides resources defined on the service builder and supplied during
	 * service instantiation.
	 *
	 * @example
	 * ```ts
	 * const result = await context.resources.repository.findById(context.payload.id)
	 * ```
	 */
	resources: Resources
	/** typed custom metrics declared on the service and this agent builder */
	metrics: PuristaMetricContext<Metrics>
	/** Provider-neutral harness session, model handles, and event bridge. */
	harness: {
		session: Session<any>
		models: AgentHandlerModelBindings<Models>
		skills: AgentSkillContext
		events: {
			emit(event: RunEvent): Promise<void>
		}
	}
	/** Typed command tools and child-agent calls declared on the builder. */
	invoke: {
		tools: CommandToolInvokeMap<CommandTools>
		agents: AgentInvokeMap<AgentTools>
	}
	/** Logger scoped to the owning PURISTA service and agent runtime. */
	logger: PuristaLogger
	/** Abort signal for cooperative cancellation. */
	signal: AbortSignal
}

/** Run function shape accepted by `AgentQueueBuilder.setRunFunction(...)`. */
export type AgentHandler<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<never, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<never, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<never, never>,
	Output = unknown,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = (
	context: AgentHandlerContext<Payload, Parameter, Resources, Models, CommandTools, AgentTools, Metrics>,
) => Promise<Output>

/** Harness-local agents registered together with a wrapped harness workflow. */
export type AgentHarnessWorkflowOptions = {
	/**
	 * Harness agent definitions available to the wrapped workflow through
	 * `ctx.agents`. These agents run inside the same harness session, sandbox,
	 * state store, telemetry setup, and durable workflow boundary as the parent
	 * attached agent execution.
	 */
	agents?: Record<string, HarnessAgentDefinition<any, any, any>>
}

/** Internal execution definition selected by exactly one agent execution setter. */
export type AgentExecutionDefinition<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<never, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<never, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<never, never>,
	Output = unknown,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> =
	| { kind: 'harnessAgent'; definition: HarnessAgentDefinition<any, any, any> }
	| {
			kind: 'harnessWorkflow'
			definition: HarnessWorkflowDefinition<any, any, any>
			agents?: Record<string, HarnessAgentDefinition<any, any, any>>
	  }
	| {
			kind: 'runFunction'
			handler: AgentHandler<Payload, Parameter, Resources, Models, CommandTools, AgentTools, Output, Metrics>
	  }

/** Provider-neutral manifest describing an attached PURISTA agent. */
export type AgentManifest<Models extends Record<string, AgentModelBinding> = Record<string, AgentModelBinding>> = {
	serviceName: string
	serviceVersion: string
	agentName: string
	description: string
	runtimeRevision: string
	models: Models
	session: AgentSessionPolicy
	execution: Required<Pick<AgentExecutionPolicy, 'maxAttempts' | 'maxParallelHandlers'>> &
		Omit<AgentExecutionPolicy, 'maxAttempts' | 'maxParallelHandlers'>
	sandbox?: AgentSandboxPolicy
	workspacePolicy?: AgentWorkspacePolicy
	http?: AgentHttpExposure
	response?: {
		mode: AgentResponseMode
		options?: AgentResponseModeOptions
		jobId: { source: 'queue-job-id' }
		runId: { source: 'queue-job-id'; prefix: 'run:' }
	}
	streamingMode: 'stream' | 'aggregate'
	successEventName?: string
	allowedCommands: readonly AllowedCommandToolDefinition[]
	allowedAgents: readonly AllowedAgentDefinition[]
	usedSkills: readonly { names: readonly string[]; resourceName?: string }[]
	builtInTools: readonly BuiltinToolName[] | false | true
}

/** Mutable runtime reference bound when the owning service instance is created. */
export type AgentRuntimeRef<Output = unknown> = {
	current?: {
		executeAggregate(input: AgentRuntimeInvocationInput): Promise<Output>
		executeStream(input: AgentRuntimeStreamInvocationInput): Promise<void>
		shutdown(): Promise<void>
	}
}

/** Aggregate invocation input passed from generated PURISTA definitions into the agent runtime. */
export type AgentRuntimeInvocationInput = {
	appContext: Record<string, unknown>
	message: Record<string, unknown>
	payload: unknown
	parameter: unknown
	signal?: AbortSignal
}

/** Streaming invocation input passed from generated PURISTA stream definitions into the agent runtime. */
export type AgentRuntimeStreamInvocationInput = AgentRuntimeInvocationInput & {
	writer: {
		write(chunk: unknown): Promise<void>
		close(final?: unknown): Promise<void>
		fail(error: unknown): Promise<void>
		onCancel(cb: (reason?: string) => void): void
	}
}

/** Attached agent definition before expansion into service definitions. */
export type AgentDefinition<S extends AnyAgentQueueBuilderTypes = AgentQueueBuilderTypes> = {
	manifest: AgentManifest<S['Models']>
	/** Agent-local metric definitions registered on the owning service at `addAgentDefinition(...)`. */
	metricDefinitions: PuristaMetricDefinitions
	payloadSchema?: S['PayloadSchema']
	parameterSchema?: S['ParameterSchema']
	outputSchema?: S['OutputSchema']
	execution: AgentExecutionDefinition<
		InferIn<S['PayloadSchema']>,
		InferIn<S['ParameterSchema']>,
		S['Resources'],
		S['Models'],
		S['CommandTools'],
		S['AgentTools'],
		Infer<S['OutputSchema']>,
		S['Metrics']
	>
	runtime: AgentRuntimeRef<Infer<S['OutputSchema']>>
}

/** Core definition metadata attached to generated queue, worker, command, and stream artifacts. */
export type AttachedCoreDefinition = {
	[key: string]: unknown
}

/** Agent plus the generated queue, worker, command, and stream definitions added to a service. */
export type AttachedAgentDefinition<S extends AnyAgentQueueBuilderTypes = AgentQueueBuilderTypes> =
	AgentDefinition<S> & {
		queue: AttachedCoreDefinition & { queueName: string }
		worker: AttachedCoreDefinition & { name: string; queueName: string }
		command: AttachedCoreDefinition & { commandName: string }
		stream: AttachedCoreDefinition & { streamName: string }
	}

/** Type accumulator used by `AgentQueueBuilder` to preserve typed schemas, tools, models, and metrics. */
export type AgentQueueBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParameterSchema extends Schema = Schema,
	OutputSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<never, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<never, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<never, never>,
	Execution extends AgentExecutionKind | undefined = undefined,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = {
	PayloadSchema: PayloadSchema
	ParameterSchema: ParameterSchema
	OutputSchema: OutputSchema
	Resources: Resources
	Models: Models
	CommandTools: CommandTools
	AgentTools: AgentTools
	Execution: Execution
	Metrics: Metrics
}

/** Broad agent builder type used where any attached agent definition is accepted. */
export type AnyAgentQueueBuilderTypes = AgentQueueBuilderTypes<
	Schema,
	Schema,
	Schema,
	Record<string, unknown>,
	Record<string, AgentModelBinding>,
	Record<string, AllowedCommandToolDefinition>,
	Record<string, AllowedAgentDefinition>,
	AgentExecutionKind | undefined,
	PuristaMetricDefinitions
>

/** Extracts the statically declared model alias map from an attached agent definition. */
export type ExtractAgentModels<T> = T extends AttachedAgentDefinition<infer S> ? S['Models'] : Record<never, never>

/** Runtime options required to initialize attached agents for a service instance. */
export type AgentRuntimeOptions<Models extends Record<string, AgentModelBinding>> = {
	models: AgentRuntimeModelBindings<Models>
	runtime?: DurableRuntime
	workspaceStore?: AgentDurableWorkspaceStore
	skills?: AgentSkillRuntimeOptions
	stateStore?: unknown
	logger?: PuristaLogger
	sandbox?: unknown
	telemetry?: TelemetryOptions
	governance?: GovernanceConfig<any>
}

/** Resolved harness model aliases keyed by the statically declared model map. */
export type ResolvedAgentRuntimeModelBindings<Models extends Record<string, AgentModelBinding>> = {
	[K in keyof Models]: ModelAlias
}

/** Opaque `@purista/harness` handle used by attached agent runtimes. */
export type AgentHarnessHandle = Harness<any>
