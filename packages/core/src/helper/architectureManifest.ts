import { createHash } from 'node:crypto'

import type { AgentManifest } from '../AgentQueueBuilder/types.js'
import type { ScheduleDefinition } from '../core/types/schedule/ScheduleDefinition.js'
import { validationToSchema } from '../zodOpenApi/validationToSchema.js'
import type { FullDefinition } from './types/FullDefinition.js'
import type { FullServiceDefinition } from './types/FullServiceDefinition.js'

/** JSON-safe architecture source location used by diagnostics. @group Architecture */
export type ArchitectureSourceLocation = {
	pointer: string
}

/** Severity used by static architecture diagnostics. @group Architecture */
export type ArchitectureDiagnosticSeverity = 'error' | 'warning' | 'info'

/** A stable static architecture diagnostic with a remediation hint. @group Architecture */
export type ArchitectureDiagnostic = {
	code: string
	severity: ArchitectureDiagnosticSeverity
	message: string
	location?: ArchitectureSourceLocation
	remediation: string
}

/** A deterministic summary of a declared validation schema. @group Architecture */
export type ArchitectureSchemaSummary = {
	fingerprint: string
	jsonSchema?: Record<string, unknown>
}

/** JSON-safe summary of a command, subscription, stream, or queue worker. @group Architecture */
export type ArchitectureCallable = {
	name: string
	description?: string
	deprecated?: boolean
	eventName?: string
	invokes: readonly string[]
	streamInvokes: readonly string[]
	queueInvokes: readonly string[]
	emits: readonly string[]
	payloadSchema?: ArchitectureSchemaSummary
	parameterSchema?: ArchitectureSchemaSummary
	outputSchema?: ArchitectureSchemaSummary
}

/** JSON-safe summary of a queue declaration. @group Architecture */
export type ArchitectureQueue = {
	name: string
	description: string
	tags: readonly string[]
	deprecated: boolean
	workerNames: readonly string[]
	deadLetterQueueName?: string
	payloadSchema?: ArchitectureSchemaSummary
	parameterSchema?: ArchitectureSchemaSummary
}

/** JSON-safe summary of a queue worker declaration. @group Architecture */
export type ArchitectureQueueWorker = {
	name: string
	queueName: string
	mode: string
	intervalMs?: number
	maxParallelHandlers: number
	invokes: readonly string[]
	streamInvokes: readonly string[]
	queueInvokes: readonly string[]
	emits: readonly string[]
	agents: readonly string[]
}

/** JSON-safe summary of a scheduler declaration. @group Architecture */
export type ArchitectureSchedule = Pick<
	ScheduleDefinition,
	| 'name'
	| 'targetKind'
	| 'targetName'
	| 'expression'
	| 'timezone'
	| 'concurrencyPolicy'
	| 'missedRunPolicy'
	| 'schedulerGroup'
	| 'enabledByDefault'
> & {
	targetServiceName?: string
	targetServiceVersion?: string
}

/** JSON-safe summary of an attached agent declaration. @group Architecture */
export type ArchitectureAgent = {
	name: string
	description: string
	runtimeRevision: string
	modelAliases: readonly string[]
	sessionMode: 'ephemeral' | 'conversation'
	execution: Record<string, number | undefined>
	allowedCommands: readonly string[]
	allowedAgents: readonly string[]
	usedSkills: readonly string[]
}

/** Static architecture for one service version. @group Architecture */
export type ArchitectureService = {
	name: string
	version: string
	description: string
	deprecated: boolean
	commands: readonly ArchitectureCallable[]
	subscriptions: readonly ArchitectureCallable[]
	streams: readonly ArchitectureCallable[]
	queues: readonly ArchitectureQueue[]
	queueWorkers: readonly ArchitectureQueueWorker[]
	schedules: readonly ArchitectureSchedule[]
	eventToQueueBindings: readonly { eventName: string; queueName: string; idempotencyMode: string }[]
	agents: readonly ArchitectureAgent[]
}

/** Static, JSON-safe architecture manifest. It never represents live runtime state. @group Architecture */
export type ArchitectureManifest = {
	kind: 'purista.architecture'
	version: '1.0.0'
	definitionVersion?: string
	services: readonly ArchitectureService[]
}

/** Options for creating a static architecture manifest. @group Architecture */
export type CreateArchitectureManifestOptions = {
	services: FullDefinition | FullServiceDefinition
	/** Include normalized JSON Schema alongside fingerprints. Defaults to `false`. */
	includeSchemas?: boolean
}

/** Options for static manifest validation. @group Architecture */
export type ValidateArchitectureManifestOptions = {
	/** Promote warnings to errors without changing their stable codes. */
	strict?: boolean
}

const isFullDefinition = (input: FullDefinition | FullServiceDefinition): input is FullDefinition =>
	'services' in input && 'version' in input

const stableJson = (value: unknown): string => {
	if (value === null || typeof value !== 'object') {
		return JSON.stringify(value)
	}
	if (Array.isArray(value)) {
		return `[${value.map(stableJson).join(',')}]`
	}
	return `{${Object.entries(value as Record<string, unknown>)
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
		.join(',')}}`
}

const sortedKeys = (value: Record<string, unknown> | undefined) =>
	Object.keys(value ?? {}).sort((left, right) => left.localeCompare(right))
const refs = (value: Record<string, unknown> | undefined) => sortedKeys(value)

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === 'object' && !Array.isArray(value)

const isStandardSchema = (value: unknown): value is { '~standard': unknown } => isRecord(value) && '~standard' in value

const schemaSummary = async (
	schema: unknown,
	includeSchema: boolean,
): Promise<ArchitectureSchemaSummary | undefined> => {
	if (!schema) {
		return undefined
	}
	// Service definitions persist exposed schemas as JSON Schema. Raw validators
	// only occur in hand-authored definitions, so convert those at this boundary.
	// Re-converting persisted JSON Schema would incorrectly treat it as a
	// Standard Schema validator and makes machine-readable inspect output noisy.
	const jsonSchema = isStandardSchema(schema) ? await validationToSchema(schema as never) : schema
	if (!isRecord(jsonSchema)) {
		return undefined
	}
	const normalized = JSON.parse(stableJson(jsonSchema)) as Record<string, unknown>
	return {
		fingerprint: createHash('sha256').update(stableJson(normalized)).digest('base64url'),
		...(includeSchema ? { jsonSchema: normalized } : {}),
	}
}

const callable = async (definition: Record<string, any>, includeSchemas: boolean): Promise<ArchitectureCallable> => ({
	name: definition.commandName ?? definition.subscriptionName ?? definition.streamName,
	description: definition.commandDescription ?? definition.subscriptionDescription ?? definition.streamDescription,
	deprecated: definition.deprecated,
	eventName: definition.eventName ?? definition.emitEventName ?? definition.finalEventName,
	invokes: refs(definition.invokes),
	streamInvokes: refs(definition.streamInvokes),
	queueInvokes: refs(definition.queueInvokes),
	emits: refs(definition.emitList),
	payloadSchema: await schemaSummary(definition.metadata?.expose?.inputPayload, includeSchemas),
	parameterSchema: await schemaSummary(definition.metadata?.expose?.inputParameter, includeSchemas),
	outputSchema: await schemaSummary(definition.metadata?.expose?.output, includeSchemas),
})

const agent = (definition: AgentManifest): ArchitectureAgent => ({
	name: definition.agentName,
	description: definition.description,
	runtimeRevision: definition.runtimeRevision,
	modelAliases: Object.keys(definition.models).sort((left, right) => left.localeCompare(right)),
	sessionMode: definition.session.mode,
	execution: {
		leaseTtlMs: definition.execution.leaseTtlMs,
		heartbeatIntervalMs: definition.execution.heartbeatIntervalMs,
		maxAttempts: definition.execution.maxAttempts,
		maxParallelHandlers: definition.execution.maxParallelHandlers,
		timeoutMs: definition.execution.timeoutMs,
	},
	allowedCommands: definition.allowedCommands
		.map(tool => `${tool.serviceName}/${tool.serviceVersion}/${tool.commandName}`)
		.sort((left, right) => left.localeCompare(right)),
	allowedAgents: definition.allowedAgents
		.map(tool => `${tool.serviceVersion}/${tool.agentName}`)
		.sort((left, right) => left.localeCompare(right)),
	usedSkills: definition.usedSkills.flatMap(skill => skill.names).sort((left, right) => left.localeCompare(right)),
})

const schedule = (definition: ScheduleDefinition): ArchitectureSchedule => ({
	name: definition.name,
	targetKind: definition.targetKind,
	targetName: definition.targetName,
	targetServiceName: definition.targetServiceName,
	targetServiceVersion: definition.targetServiceVersion,
	expression: definition.expression,
	timezone: definition.timezone,
	concurrencyPolicy: definition.concurrencyPolicy,
	missedRunPolicy: definition.missedRunPolicy,
	schedulerGroup: definition.schedulerGroup,
	enabledByDefault: definition.enabledByDefault,
})

/**
 * Create a sorted, JSON-safe static architecture manifest from resolved service
 * definitions. It deliberately omits handlers, stores, bridge instances,
 * provider hints, secrets, prompts, and other runtime objects.
 *
 * @example
 * ```ts
 * const manifest = await createArchitectureManifest({
 *   services: definitions,
 *   includeSchemas: false,
 * })
 * ```
 */
export const createArchitectureManifest = async (
	options: CreateArchitectureManifestOptions,
): Promise<ArchitectureManifest> => {
	const source = isFullDefinition(options.services) ? options.services.services : options.services
	const services: ArchitectureService[] = []
	for (const serviceName of sortedKeys(source)) {
		const versions = source[serviceName] ?? {}
		for (const serviceVersion of sortedKeys(versions)) {
			const definition = versions[serviceVersion]
			const queues = await Promise.all(
				sortedKeys(definition.queues).map(async name => {
					const value = definition.queues?.[name] as Record<string, any>
					return {
						name: value.queueName,
						description: value.description,
						tags: [...(value.tags ?? [])].sort((left: string, right: string) => left.localeCompare(right)),
						deprecated: value.deprecated,
						workerNames: (value.workers ?? []).map((worker: { name: string }) => worker.name).sort(),
						deadLetterQueueName: value.deadLetter?.queueName,
						payloadSchema: await schemaSummary(value.payloadSchema, options.includeSchemas ?? false),
						parameterSchema: await schemaSummary(value.parameterSchema, options.includeSchemas ?? false),
					}
				}),
			)
			services.push({
				name: serviceName,
				version: serviceVersion,
				description: definition.description,
				deprecated: definition.deprecated,
				commands: await Promise.all(
					sortedKeys(definition.commands).map(name =>
						callable(definition.commands[name] as any, options.includeSchemas ?? false),
					),
				),
				subscriptions: await Promise.all(
					sortedKeys(definition.subscriptions).map(name =>
						callable(definition.subscriptions[name] as any, options.includeSchemas ?? false),
					),
				),
				streams: await Promise.all(
					sortedKeys(definition.streams).map(name =>
						callable(definition.streams?.[name] as any, options.includeSchemas ?? false),
					),
				),
				queues,
				queueWorkers: sortedKeys(definition.queueWorkers).map(name => {
					const worker = definition.queueWorkers?.[name] as Record<string, any>
					return {
						name: worker.name,
						queueName: worker.queueName,
						mode: worker.mode,
						intervalMs: worker.intervalMs,
						maxParallelHandlers: worker.maxParallelHandlers,
						invokes: refs(worker.invokes),
						streamInvokes: refs(worker.streamInvokes),
						queueInvokes: refs(worker.queueInvokes),
						emits: refs(worker.emitList),
						agents: (worker.agentInvokes ?? []).map((item: { agentName: string }) => item.agentName).sort(),
					}
				}),
				schedules: sortedKeys(definition.schedules).map(name =>
					schedule(definition.schedules?.[name] as ScheduleDefinition),
				),
				eventToQueueBindings: [...(definition.eventToQueueBindings ?? [])]
					.map(binding => ({
						eventName: binding.eventName,
						queueName: binding.queueName,
						idempotencyMode: binding.idempotencyMode,
					}))
					.sort((left, right) =>
						`${left.eventName}/${left.queueName}`.localeCompare(`${right.eventName}/${right.queueName}`),
					),
				agents: sortedKeys(definition.agents).map(name => agent(definition.agents?.[name] as AgentManifest)),
			})
		}
	}
	return {
		kind: 'purista.architecture',
		version: '1.0.0',
		definitionVersion: isFullDefinition(options.services) ? options.services.version : undefined,
		services,
	}
}

const diagnostic = (
	code: string,
	severity: ArchitectureDiagnosticSeverity,
	message: string,
	pointer: string,
	remediation: string,
): ArchitectureDiagnostic => ({ code, severity, message, location: { pointer }, remediation })

/**
 * Validate static architecture references without contacting runtime
 * infrastructure. Strict mode promotes warnings to errors.
 *
 * @example
 * ```ts
 * const diagnostics = validateArchitectureManifest(manifest, { strict: true })
 * if (diagnostics.some(item => item.severity === 'error')) process.exitCode = 1
 * ```
 */
export const validateArchitectureManifest = (
	manifest: ArchitectureManifest,
	options: ValidateArchitectureManifestOptions = {},
): readonly ArchitectureDiagnostic[] => {
	const diagnostics: ArchitectureDiagnostic[] = []
	const commandKeys = new Set(
		manifest.services.flatMap(service =>
			service.commands.map(command => `${service.name}/${service.version}/${command.name}`),
		),
	)
	for (const service of manifest.services) {
		const pointer = `/services/${service.name}/${service.version}`
		const queues = new Set(service.queues.map(queue => queue.name))
		for (const worker of service.queueWorkers) {
			if (!queues.has(worker.queueName)) {
				diagnostics.push(
					diagnostic(
						'PURISTA_ARCH_QUEUE_WORKER_UNKNOWN_QUEUE',
						'error',
						`Queue worker ${worker.name} references unknown queue ${worker.queueName}`,
						`${pointer}/queueWorkers/${worker.name}`,
						'Declare the queue on this service or correct queueName.',
					),
				)
			}
		}
		for (const binding of service.eventToQueueBindings) {
			if (!queues.has(binding.queueName)) {
				diagnostics.push(
					diagnostic(
						'PURISTA_ARCH_EVENT_QUEUE_BINDING_UNKNOWN_QUEUE',
						'error',
						`Event-to-queue binding for ${binding.eventName} references unknown queue ${binding.queueName}`,
						`${pointer}/eventToQueueBindings/${binding.eventName}`,
						'Declare the queue on this service or correct queueName.',
					),
				)
			}
		}
		for (const item of service.agents) {
			if (item.modelAliases.length === 0) {
				diagnostics.push(
					diagnostic(
						'PURISTA_ARCH_AGENT_MODEL_MISSING',
						'error',
						`Agent ${item.name} has no declared model binding`,
						`${pointer}/agents/${item.name}`,
						'Declare at least one model alias before attaching the agent.',
					),
				)
			}
			for (const tool of item.allowedCommands) {
				if (!commandKeys.has(tool)) {
					diagnostics.push(
						diagnostic(
							'PURISTA_ARCH_AGENT_COMMAND_TOOL_UNKNOWN',
							'warning',
							`Agent ${item.name} declares command tool ${tool}, which is absent from the static manifest`,
							`${pointer}/agents/${item.name}`,
							'Declare the target command in the manifest or remove the tool declaration.',
						),
					)
				}
			}
		}
	}
	return diagnostics
		.map(item => (options.strict && item.severity === 'warning' ? { ...item, severity: 'error' as const } : item))
		.sort((left, right) =>
			`${left.severity}/${left.code}/${left.location?.pointer ?? ''}/${left.message}`.localeCompare(
				`${right.severity}/${right.code}/${right.location?.pointer ?? ''}/${right.message}`,
			),
		)
}
