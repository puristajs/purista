import type { Infer, InferIn, Logger as PuristaLogger, Schema } from '@purista/core'
import type {
	BuiltinToolName,
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

export type AgentModelCapability = ModelCapability

export type SupportedHttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

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
	provider: ModelProvider
	model?: string
	capabilities?: readonly AgentModelCapability[]
	defaults?: ModelDefaults
	providerOptions?: Record<string, unknown>
} & Partial<Pick<Binding, 'model'>>

export type AgentRuntimeModelBindings<Models extends Record<string, AgentModelBinding>> = {
	[K in keyof Models]: AgentRuntimeModelBinding<Models[K]>
}

export type AgentHandlerModelBindings<Models extends Record<string, AgentModelBinding>> = {
	readonly [K in keyof Models]: ModelHandle<Models[K]>
}

export type AllowedCommandToolDefinition<
	Output extends Schema = Schema,
	Payload extends Schema = Schema,
	Parameter extends Schema = Schema,
> = {
	serviceName: string
	serviceVersion: string
	commandName: string
	outputSchema?: Output
	payloadSchema?: Payload
	parameterSchema?: Parameter
}

export type AllowedAgentDefinition<
	Output extends Schema = Schema,
	Payload extends Schema = Schema,
	Parameter extends Schema = Schema,
> = {
	agentName: string
	serviceVersion: string
	outputSchema?: Output
	payloadSchema?: Payload
	parameterSchema?: Parameter
}

export type AgentExecutionPolicy = {
	leaseTtlMs?: number
	heartbeatIntervalMs?: number
	maxAttempts?: number
	maxParallelHandlers?: number
	timeoutMs?: number
}

export type AgentSessionPolicy = { mode: 'ephemeral' } | { mode: 'conversation'; payloadPath: readonly string[] }

export type AgentSandboxPolicy = {
	enabled?: boolean
	adapter?: unknown
}

export type AgentHttpExposure = {
	method: SupportedHttpMethod
	path: string
	streamingMode?: 'stream' | 'aggregate'
	public?: boolean
	requestContentType?: string
	responseContentType?: string
}

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

export type AgentRunEvent = {
	identity: AgentRunIdentity
	event: RunEvent
}

export type AgentRunResult<Output = unknown> = {
	identity: AgentRunIdentity
	output: Output
	events: AgentRunEvent[]
}

type InferOptionalInput<T> = T extends Schema ? InferIn<T> : unknown
type InferOptionalOutput<T> = T extends Schema ? Infer<T> : unknown

export type CommandToolInvokeMap<Tools extends Record<string, AllowedCommandToolDefinition>> = {
	readonly [K in keyof Tools]: {
		call(
			payload: InferOptionalInput<Tools[K]['payloadSchema']>,
			parameter?: InferOptionalInput<Tools[K]['parameterSchema']>,
		): Promise<InferOptionalOutput<Tools[K]['outputSchema']>>
	}
}

export type AgentInvokeMap<Agents extends Record<string, AllowedAgentDefinition>> = {
	readonly [K in keyof Agents]: {
		run(
			payload: InferOptionalInput<Agents[K]['payloadSchema']>,
			parameter?: InferOptionalInput<Agents[K]['parameterSchema']>,
		): Promise<InferOptionalOutput<Agents[K]['outputSchema']>>
	}
}

export type AgentHandlerContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<string, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<string, never>,
> = {
	payload: Payload
	parameter: Parameter
	identity: AgentRunIdentity
	app: {
		message: unknown
		resources: Resources
		emit: unknown
		service: unknown
		stream: unknown
		queue: unknown
	}
	harness: {
		session: Session<any>
		models: AgentHandlerModelBindings<Models>
		events: {
			emit(event: RunEvent): Promise<void>
		}
	}
	invoke: {
		tools: CommandToolInvokeMap<CommandTools>
		agents: AgentInvokeMap<AgentTools>
	}
	logger: PuristaLogger
	signal: AbortSignal
}

export type AgentHandler<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<string, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<string, never>,
	Output = unknown,
> = (context: AgentHandlerContext<Payload, Parameter, Resources, Models, CommandTools, AgentTools>) => Promise<Output>

export type AgentExecutionDefinition<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<string, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<string, never>,
	Output = unknown,
> =
	| { kind: 'harnessAgent'; definition: HarnessAgentDefinition<any, any, any> }
	| { kind: 'harnessWorkflow'; definition: HarnessWorkflowDefinition<any, any, any> }
	| {
			kind: 'runFunction'
			handler: AgentHandler<Payload, Parameter, Resources, Models, CommandTools, AgentTools, Output>
	  }

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
	http?: AgentHttpExposure
	streamingMode: 'stream' | 'aggregate'
	successEventName?: string
	allowedCommands: readonly AllowedCommandToolDefinition[]
	allowedAgents: readonly AllowedAgentDefinition[]
	usedSkills: readonly { names: readonly string[]; resourceName?: string }[]
	builtInTools: readonly BuiltinToolName[] | false | true
}

export type AgentRuntimeRef<Output = unknown> = {
	current?: {
		executeAggregate(input: AgentRuntimeInvocationInput): Promise<Output>
		executeStream(input: AgentRuntimeStreamInvocationInput): Promise<void>
		shutdown(): Promise<void>
	}
}

export type AgentRuntimeInvocationInput = {
	appContext: Record<string, unknown>
	message: Record<string, unknown>
	payload: unknown
	parameter: unknown
	signal?: AbortSignal
}

export type AgentRuntimeStreamInvocationInput = AgentRuntimeInvocationInput & {
	writer: {
		write(chunk: unknown): Promise<void>
		close(final?: unknown): Promise<void>
		fail(error: unknown): Promise<void>
		onCancel(cb: (reason?: string) => void): void
	}
}

export type AgentDefinition<S extends AnyAgentQueueBuilderTypes = AgentQueueBuilderTypes> = {
	manifest: AgentManifest<S['Models']>
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
		Infer<S['OutputSchema']>
	>
	runtime: AgentRuntimeRef<Infer<S['OutputSchema']>>
}

export type AttachedCoreDefinition = {
	[key: string]: unknown
}

export type AttachedAgentDefinition<S extends AnyAgentQueueBuilderTypes = AgentQueueBuilderTypes> =
	AgentDefinition<S> & {
		queue: AttachedCoreDefinition & { queueName: string }
		worker: AttachedCoreDefinition & { name: string; queueName: string }
		command: AttachedCoreDefinition & { commandName: string }
		stream: AttachedCoreDefinition & { streamName: string }
	}

export type AgentQueueBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParameterSchema extends Schema = Schema,
	OutputSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	CommandTools extends Record<string, AllowedCommandToolDefinition> = Record<string, never>,
	AgentTools extends Record<string, AllowedAgentDefinition> = Record<string, never>,
	Execution extends AgentExecutionKind | undefined = undefined,
> = {
	PayloadSchema: PayloadSchema
	ParameterSchema: ParameterSchema
	OutputSchema: OutputSchema
	Resources: Resources
	Models: Models
	CommandTools: CommandTools
	AgentTools: AgentTools
	Execution: Execution
}

export type AnyAgentQueueBuilderTypes = AgentQueueBuilderTypes<
	Schema,
	Schema,
	Schema,
	Record<string, unknown>,
	Record<string, AgentModelBinding>,
	Record<string, AllowedCommandToolDefinition>,
	Record<string, AllowedAgentDefinition>,
	AgentExecutionKind | undefined
>

export type ExtractAgentModels<T> = T extends AttachedAgentDefinition<infer S> ? S['Models'] : Record<string, never>

export type AgentRuntimeOptions<Models extends Record<string, AgentModelBinding>> = {
	models: AgentRuntimeModelBindings<Models>
	stateStore?: unknown
	logger?: PuristaLogger
	sandbox?: unknown
	telemetry?: TelemetryOptions
}

export type ResolvedAgentRuntimeModelBindings<Models extends Record<string, AgentModelBinding>> = {
	[K in keyof Models]: ModelAlias
}

export type AgentHarnessHandle = Harness<any>
