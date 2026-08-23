import { createHash } from 'node:crypto'

import type { AgentManifest } from '../AgentQueueBuilder/types.js'
import type { ScheduleDefinition } from '../core/types/schedule/ScheduleDefinition.js'
import { validationToSchema } from '../zodOpenApi/validationToSchema.js'
import type { FullDefinition } from './types/FullDefinition.js'
import type { FullServiceDefinition } from './types/FullServiceDefinition.js'

/** JSON-safe location for a static architecture diagnostic. @group Architecture */
export type ArchitectureSourceLocation = { pointer?: string; componentId?: string; relationId?: string }
/** Severity used by static architecture diagnostics. @group Architecture */
export type ArchitectureDiagnosticSeverity = 'error' | 'warning' | 'info'
/** Stable static architecture diagnostic with a remediation hint. @group Architecture */
export type ArchitectureDiagnostic = {
	code: string
	severity: ArchitectureDiagnosticSeverity
	message: string
	location?: ArchitectureSourceLocation
	remediation: string
}

/** Kinds of nodes in the provider-neutral PURISTA architecture graph. @group Architecture */
export type ArchitectureComponentKind =
	| 'service'
	| 'command'
	| 'subscription'
	| 'stream'
	| 'event'
	| 'queue'
	| 'queueWorker'
	| 'schedule'
	| 'agent'
/** Schema role on a component or relation. @group Architecture */
export type ArchitectureSchemaRole = 'payload' | 'parameter' | 'result' | 'chunk' | 'final'
/** Reference to a normalized schema in the manifest catalog. @group Architecture */
export type ArchitectureSchemaReference = { id: string; fingerprint: string }
/** Normalized schema catalog entry. JSON Schema is opt-in. @group Architecture */
export type ArchitectureSchema = ArchitectureSchemaReference & {
	dialect: 'json-schema'
	jsonSchema?: Record<string, unknown>
}
/** Role-specific schemas attached to a component or an interaction edge. @group Architecture */
export type ArchitectureContracts = Partial<Record<ArchitectureSchemaRole, ArchitectureSchemaReference>>
/** JSON-safe scalar metadata attached to a graph component. @group Architecture */
export type ArchitectureComponentAttribute = string | number | boolean | readonly string[]
/** A stable node in the architecture graph. @group Architecture */
export type ArchitectureComponent = {
	id: string
	kind: ArchitectureComponentKind
	name: string
	serviceId?: string
	description?: string
	deprecated?: boolean
	contracts?: ArchitectureContracts
	attributes?: Readonly<Record<string, ArchitectureComponentAttribute>>
}
/** Typed relation between two declared architecture components. @group Architecture */
export type ArchitectureRelationKind =
	| 'owns'
	| 'emits'
	| 'respondsWithEvent'
	| 'consumes'
	| 'invokes'
	| 'consumesStream'
	| 'enqueues'
	| 'processes'
	| 'scheduleTarget'
	| 'bindsEventToQueue'
	| 'agentCommandTool'
	| 'agentTool'
/** Resolution state for a relation target in the current static artifact. @group Architecture */
export type ArchitectureRelationResolution = 'resolved' | 'unresolved'
/** A stable, typed architecture graph edge. @group Architecture */
export type ArchitectureRelation = {
	id: string
	kind: ArchitectureRelationKind
	from: string
	to: string
	resolution: ArchitectureRelationResolution
	contracts?: ArchitectureContracts
	attributes?: Readonly<Record<string, ArchitectureComponentAttribute>>
}
/** Complete static architecture contract derived from resolved definitions. @group Architecture */
export type ArchitectureManifest = {
	kind: 'purista.architecture'
	version: '1.0.0'
	definitionVersion?: string
	digest: string
	schemas: readonly ArchitectureSchema[]
	components: readonly ArchitectureComponent[]
	relations: readonly ArchitectureRelation[]
}
/** JSON-safe selected architecture view intended for a human or an LLM. @group Architecture */
export type ArchitectureContext = {
	kind: 'purista.architecture.context'
	version: '1.0.0'
	source: Pick<ArchitectureManifest, 'kind' | 'version' | 'definitionVersion' | 'digest'>
	scope: { selectors: readonly string[]; depth: number; omittedComponentCount: number; omittedRelationCount: number }
	schemas: readonly ArchitectureSchema[]
	components: readonly ArchitectureComponent[]
	relations: readonly ArchitectureRelation[]
	diagnostics: readonly ArchitectureDiagnostic[]
}
/** A deterministic architecture compatibility change. @group Architecture */
export type ArchitectureChange = {
	code:
		| 'PURISTA_ARCH_CONTRACT_COMPONENT_ADDED'
		| 'PURISTA_ARCH_CONTRACT_COMPONENT_REMOVED'
		| 'PURISTA_ARCH_RELATION_REMOVED'
		| 'PURISTA_ARCH_SCHEMA_COMPATIBILITY_UNKNOWN'
	severity: ArchitectureDiagnosticSeverity
	componentId?: string
	relationId?: string
	message: string
	remediation: string
}
/** A pinned artifact used by offline multi-repository composition validation. @group Architecture */
export type ArchitectureCompositionArtifact = { id: string; digest: string }
/** Explicit binding of an unresolved relation to a component in another artifact. @group Architecture */
export type ArchitectureCompositionBinding = { from: string; to: string }
/** Application-owned, provider-neutral composition input. @group Architecture */
export type ArchitectureComposition = {
	kind: 'purista.architecture.composition'
	version: '1.0.0'
	artifacts: readonly ArchitectureCompositionArtifact[]
	bindings: readonly ArchitectureCompositionBinding[]
}
/** Options for creating the canonical architecture contract. @group Architecture */
export type CreateArchitectureManifestOptions = {
	services: FullDefinition | FullServiceDefinition
	schemaMode?: 'fingerprints' | 'full'
}
/** Options for static architecture validation. @group Architecture */
export type ValidateArchitectureManifestOptions = { strict?: boolean }
/** Options for a compact, deterministic architecture context. @group Architecture */
export type CreateArchitectureContextOptions = {
	scope?: readonly string[]
	depth?: number
	schemaMode?: 'fingerprints' | 'referenced'
}

const isFullDefinition = (input: FullDefinition | FullServiceDefinition): input is FullDefinition =>
	'services' in input && 'version' in input
const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === 'object' && !Array.isArray(value)
const isStandardSchema = (value: unknown): value is { '~standard': unknown } => isRecord(value) && '~standard' in value
const stableJson = (value: unknown): string => {
	if (value === null || typeof value !== 'object') return JSON.stringify(value)
	if (Array.isArray(value)) return `[${value.map(item => (item === undefined ? 'null' : stableJson(item))).join(',')}]`
	return `{${Object.entries(value as Record<string, unknown>)
		.filter(([, item]) => item !== undefined)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
		.join(',')}}`
}
const digest = (value: unknown) => createHash('sha256').update(stableJson(value)).digest('base64url')
const sortedEntries = <T>(value: Record<string, T> | undefined): [string, T][] =>
	Object.entries(value ?? {}).sort(([a], [b]) => a.localeCompare(b))
const pointer = (value: string) => value.replace(/~/g, '~0').replace(/\//g, '~1')
const serviceId = (name: string, version: string) => `service:${name}/${version}`
const componentId = (
	kind: Exclude<ArchitectureComponentKind, 'service' | 'event'>,
	service: string,
	version: string,
	name: string,
) => `${kind}:${service}/${version}/${name}`
const eventId = (name: string) => `event:${name}`
const relationId = (kind: ArchitectureRelationKind, from: string, to: string) => `${kind}:${from}->${to}`
const componentSort = (a: ArchitectureComponent, b: ArchitectureComponent) => a.id.localeCompare(b.id)
const relationSort = (a: ArchitectureRelation, b: ArchitectureRelation) => a.id.localeCompare(b.id)
const readExpose = (definition: Record<string, unknown>) =>
	isRecord(definition.metadata) && isRecord(definition.metadata.expose) ? definition.metadata.expose : {}
const stableAttributes = (input: Record<string, ArchitectureComponentAttribute | undefined>) => {
	const values = Object.entries(input).filter(([, value]) => value !== undefined) as [
		string,
		ArchitectureComponentAttribute,
	][]
	return values.length === 0 ? undefined : Object.fromEntries(values.sort(([a], [b]) => a.localeCompare(b)))
}
const scheduleAttributes = (schedule: ScheduleDefinition) => {
	const expression =
		schedule.expression.kind === 'cron'
			? { expressionKind: 'cron', cron: schedule.expression.value, expressionTimezone: schedule.expression.timezone }
			: schedule.expression.kind === 'interval'
				? { expressionKind: 'interval', everyMs: schedule.expression.everyMs }
				: {
						expressionKind: 'oneShot',
						runAt:
							schedule.expression.runAt instanceof Date
								? schedule.expression.runAt.toISOString()
								: String(schedule.expression.runAt),
					}
	return stableAttributes({
		...expression,
		timezone: schedule.timezone,
		concurrencyPolicy: schedule.concurrencyPolicy,
		missedRunPolicy: schedule.missedRunPolicy,
		maxCatchUpCount: schedule.maxCatchUpCount,
		jitterWindowMs: schedule.jitterWindowMs,
		idempotencyKey: schedule.idempotencyKey,
		schedulerGroup: schedule.schedulerGroup,
		enabledByDefault: schedule.enabledByDefault,
	})
}
const contracts = (
	values: [ArchitectureSchemaRole, ArchitectureSchemaReference | undefined][],
): ArchitectureContracts | undefined => {
	const result = Object.fromEntries(values.filter(([, value]) => value !== undefined)) as ArchitectureContracts
	return Object.keys(result).length > 0 ? result : undefined
}
const flattenInvokes = (value: unknown) => {
	const result: { service: string; version: string; name: string; contract: Record<string, unknown> }[] = []
	if (!isRecord(value)) return result
	for (const [service, versions] of sortedEntries(value)) {
		if (!isRecord(versions)) continue
		for (const [version, targets] of sortedEntries(versions)) {
			if (!isRecord(targets)) continue
			for (const [name, contract] of sortedEntries(targets))
				result.push({ service, version, name, contract: isRecord(contract) ? contract : {} })
		}
	}
	return result
}
const flattenQueueInvokes = (value: unknown) =>
	sortedEntries(isRecord(value) ? value : {}).map(([name, contract]) => ({
		name,
		contract: isRecord(contract) ? contract : {},
	}))

class SchemaCatalog {
	private readonly entries = new Map<string, ArchitectureSchema>()
	constructor(private readonly mode: 'fingerprints' | 'full') {}
	async add(schema: unknown): Promise<ArchitectureSchemaReference | undefined> {
		if (!schema) return undefined
		const source = isStandardSchema(schema) ? await validationToSchema(schema as never) : schema
		if (!isRecord(source)) return undefined
		const jsonSchema = JSON.parse(stableJson(source)) as Record<string, unknown>
		const fingerprint = digest(jsonSchema)
		const id = `schema:${fingerprint}`
		if (!this.entries.has(id))
			this.entries.set(id, { id, fingerprint, dialect: 'json-schema', ...(this.mode === 'full' ? { jsonSchema } : {}) })
		return { id, fingerprint }
	}
	all() {
		return [...this.entries.values()].sort((a, b) => a.id.localeCompare(b.id))
	}
}

/**
 * Return the content digest of an architecture artifact, excluding its own digest field.
 *
 * @example
 * ```ts
 * const digest = getArchitectureManifestDigest(manifest)
 * ```
 * @group Architecture
 */
export const getArchitectureManifestDigest = (
	manifest: Omit<ArchitectureManifest, 'digest'> | ArchitectureManifest,
) => {
	const { digest: ignored, ...body } = manifest as ArchitectureManifest
	return digest(body)
}

/**
 * Create a complete, sorted, JSON-safe architecture contract from resolved service definitions.
 *
 * @example
 * ```ts
 * const manifest = await createArchitectureManifest({ services: definitions, schemaMode: 'full' })
 * ```
 */
export const createArchitectureManifest = async (
	options: CreateArchitectureManifestOptions,
): Promise<ArchitectureManifest> => {
	const source = isFullDefinition(options.services) ? options.services.services : options.services
	const schemas = new SchemaCatalog(options.schemaMode ?? 'fingerprints')
	const components = new Map<string, ArchitectureComponent>()
	const relations: ArchitectureRelation[] = []
	const addComponent = (component: ArchitectureComponent) =>
		components.set(component.id, components.get(component.id) ?? component)
	const ensureEvent = (name: string) => addComponent({ id: eventId(name), kind: 'event', name })
	const addRelation = (
		kind: ArchitectureRelationKind,
		from: string,
		to: string,
		relationContracts?: ArchitectureContracts,
		attributes?: Record<string, ArchitectureComponentAttribute | undefined>,
	) => {
		relations.push({
			id: relationId(kind, from, to),
			kind,
			from,
			to,
			resolution: 'unresolved',
			...(relationContracts ? { contracts: relationContracts } : {}),
			...(stableAttributes(attributes ?? {}) ? { attributes: stableAttributes(attributes ?? {}) } : {}),
		})
	}
	for (const [serviceName, versions] of sortedEntries(source))
		for (const [serviceVersion, item] of sortedEntries(versions)) {
			const definition = item as Record<string, unknown>
			const owner = serviceId(serviceName, serviceVersion)
			addComponent({
				id: owner,
				kind: 'service',
				name: serviceName,
				description: typeof definition.description === 'string' ? definition.description : undefined,
				deprecated: definition.deprecated === true,
				attributes: { version: serviceVersion },
			})
			const own = (kind: Exclude<ArchitectureComponentKind, 'service' | 'event'>, name: string) =>
				componentId(kind, serviceName, serviceVersion, name)
			const addCallable = async (kind: 'command' | 'subscription' | 'stream', name: string, raw: unknown) => {
				const definition = isRecord(raw) ? raw : {}
				const expose = readExpose(definition)
				const callable = own(kind, name)
				const eventBridgeConfig = isRecord(definition.eventBridgeConfig) ? definition.eventBridgeConfig : {}
				const callableContracts =
					kind === 'stream'
						? contracts([
								['payload', await schemas.add(expose.inputPayload)],
								['parameter', await schemas.add(expose.parameter)],
								['chunk', await schemas.add(expose.chunkPayload)],
								['final', await schemas.add(expose.finalPayload)],
							])
						: contracts([
								['payload', await schemas.add(expose.inputPayload)],
								['parameter', await schemas.add(expose.parameter)],
								['result', await schemas.add(expose.outputPayload)],
							])
				addComponent({
					id: callable,
					kind,
					name,
					serviceId: owner,
					description:
						typeof definition[`${kind}Description`] === 'string'
							? (definition[`${kind}Description`] as string)
							: undefined,
					deprecated: definition.deprecated === true || expose.deprecated === true,
					contracts: callableContracts,
					attributes: stableAttributes({
						durable: eventBridgeConfig.durable === true,
						autoacknowledge: eventBridgeConfig.autoacknowledge === true,
						shared: eventBridgeConfig.shared === true,
						aggregateChunks: kind === 'stream' && definition.aggregateChunks === true,
						chunkValidationEnabled: kind === 'stream' && definition.chunkValidationEnabled === true,
						finalValidationEnabled: kind === 'stream' && definition.finalValidationEnabled === true,
					}),
				})
				addRelation('owns', owner, callable)
				const inputEvent = kind === 'subscription' ? definition.eventName : undefined
				if (typeof inputEvent === 'string') {
					ensureEvent(inputEvent)
					addRelation('consumes', eventId(inputEvent), callable, callableContracts)
				}
				const responseEvent =
					kind === 'command'
						? definition.eventName
						: kind === 'subscription'
							? definition.emitEventName
							: definition.finalEventName
				if (typeof responseEvent === 'string') {
					ensureEvent(responseEvent)
					addRelation(
						'respondsWithEvent',
						callable,
						eventId(responseEvent),
						callableContracts
							? { payload: kind === 'stream' ? callableContracts.final : callableContracts.result }
							: undefined,
					)
				}
				for (const [event, schema] of sortedEntries(definition.emitList as Record<string, unknown>)) {
					ensureEvent(event)
					addRelation('emits', callable, eventId(event), { payload: await schemas.add(schema) })
				}
				for (const target of flattenInvokes(definition.invokes))
					addRelation(
						'invokes',
						callable,
						componentId('command', target.service, target.version, target.name),
						contracts([
							['payload', await schemas.add(target.contract.payloadSchema)],
							['parameter', await schemas.add(target.contract.parameterSchema)],
							['result', await schemas.add(target.contract.outputSchema)],
						]),
					)
				for (const target of flattenInvokes(definition.streamInvokes))
					addRelation(
						'consumesStream',
						callable,
						componentId('stream', target.service, target.version, target.name),
						contracts([
							['payload', await schemas.add(target.contract.payloadSchema)],
							['parameter', await schemas.add(target.contract.parameterSchema)],
							['chunk', await schemas.add(target.contract.chunkSchema)],
							['final', await schemas.add(target.contract.finalSchema)],
						]),
					)
				for (const target of flattenQueueInvokes(definition.queueInvokes))
					addRelation(
						'enqueues',
						callable,
						own('queue', target.name),
						contracts([
							['payload', await schemas.add(target.contract.payloadSchema)],
							['parameter', await schemas.add(target.contract.parameterSchema)],
						]),
					)
			}
			for (const [name, value] of sortedEntries(definition.commands as Record<string, unknown>))
				await addCallable('command', name, value)
			for (const [name, value] of sortedEntries(definition.subscriptions as Record<string, unknown>))
				await addCallable('subscription', name, value)
			for (const [name, value] of sortedEntries(definition.streams as Record<string, unknown>))
				await addCallable('stream', name, value)
			for (const [name, value] of sortedEntries(definition.queues as Record<string, unknown>)) {
				const queue = isRecord(value) ? value : {}
				const id = own('queue', name)
				const queueBridgeConfig = isRecord(queue.queueBridgeConfig) ? queue.queueBridgeConfig : {}
				addComponent({
					id,
					kind: 'queue',
					name,
					serviceId: owner,
					description: typeof queue.description === 'string' ? queue.description : undefined,
					deprecated: queue.deprecated === true,
					contracts: contracts([
						['payload', await schemas.add(queue.payloadSchema)],
						['parameter', await schemas.add(queue.parameterSchema)],
					]),
					attributes: stableAttributes({
						tags: Array.isArray(queue.tags)
							? queue.tags.filter((tag): tag is string => typeof tag === 'string').sort()
							: undefined,
						deadLetterQueueName:
							isRecord(queue.deadLetter) && typeof queue.deadLetter.queueName === 'string'
								? queue.deadLetter.queueName
								: undefined,
						orderingGuarantee:
							typeof queueBridgeConfig.orderingGuarantee === 'string' ? queueBridgeConfig.orderingGuarantee : undefined,
						prefetch: typeof queueBridgeConfig.prefetch === 'number' ? queueBridgeConfig.prefetch : undefined,
					}),
				})
				addRelation('owns', owner, id)
			}
			for (const [name, value] of sortedEntries(definition.queueWorkers as Record<string, unknown>)) {
				const worker = isRecord(value) ? value : {}
				const id = own('queueWorker', name)
				addComponent({
					id,
					kind: 'queueWorker',
					name,
					serviceId: owner,
					attributes: stableAttributes({
						mode: typeof worker.mode === 'string' ? worker.mode : undefined,
						intervalMs: typeof worker.intervalMs === 'number' ? worker.intervalMs : undefined,
						maxParallelHandlers:
							typeof worker.maxParallelHandlers === 'number' ? worker.maxParallelHandlers : undefined,
					}),
				})
				addRelation('owns', owner, id)
				addRelation('processes', id, own('queue', typeof worker.queueName === 'string' ? worker.queueName : ''))
				for (const [event, schema] of sortedEntries(worker.emitList as Record<string, unknown>)) {
					ensureEvent(event)
					addRelation('emits', id, eventId(event), { payload: await schemas.add(schema) })
				}
				for (const target of flattenInvokes(worker.invokes))
					addRelation(
						'invokes',
						id,
						componentId('command', target.service, target.version, target.name),
						contracts([
							['payload', await schemas.add(target.contract.payloadSchema)],
							['parameter', await schemas.add(target.contract.parameterSchema)],
							['result', await schemas.add(target.contract.outputSchema)],
						]),
					)
				for (const target of flattenInvokes(worker.streamInvokes))
					addRelation(
						'consumesStream',
						id,
						componentId('stream', target.service, target.version, target.name),
						contracts([
							['payload', await schemas.add(target.contract.payloadSchema)],
							['parameter', await schemas.add(target.contract.parameterSchema)],
							['chunk', await schemas.add(target.contract.chunkSchema)],
							['final', await schemas.add(target.contract.finalSchema)],
						]),
					)
				for (const target of flattenQueueInvokes(worker.queueInvokes))
					addRelation(
						'enqueues',
						id,
						own('queue', target.name),
						contracts([
							['payload', await schemas.add(target.contract.payloadSchema)],
							['parameter', await schemas.add(target.contract.parameterSchema)],
						]),
					)
			}
			for (const [name, value] of sortedEntries(definition.schedules as Record<string, unknown>)) {
				const schedule = value as ScheduleDefinition
				const id = own('schedule', name)
				const targetService = schedule.targetServiceName ?? serviceName
				const targetVersion = schedule.targetServiceVersion ?? serviceVersion
				const target =
					schedule.targetKind === 'event'
						? eventId(schedule.targetName)
						: componentId(schedule.targetKind, targetService, targetVersion, schedule.targetName)
				if (schedule.targetKind === 'event') ensureEvent(schedule.targetName)
				const scheduleContracts = contracts([
					['payload', await schemas.add(schedule.payloadSchema)],
					['parameter', await schemas.add(schedule.parameterSchema)],
				])
				addComponent({
					id,
					kind: 'schedule',
					name,
					serviceId: owner,
					description: schedule.description,
					contracts: scheduleContracts,
					attributes: scheduleAttributes(schedule),
				})
				addRelation('owns', owner, id)
				addRelation('scheduleTarget', id, target, scheduleContracts)
			}
			for (const binding of Array.isArray(definition.eventToQueueBindings) ? definition.eventToQueueBindings : [])
				if (isRecord(binding) && typeof binding.eventName === 'string' && typeof binding.queueName === 'string') {
					ensureEvent(binding.eventName)
					addRelation('bindsEventToQueue', eventId(binding.eventName), own('queue', binding.queueName), undefined, {
						idempotencyMode: typeof binding.idempotencyMode === 'string' ? binding.idempotencyMode : undefined,
					})
				}
			for (const [name, value] of sortedEntries(definition.agents as Record<string, unknown>)) {
				const agent = value as AgentManifest
				const id = own('agent', name)
				addComponent({
					id,
					kind: 'agent',
					name,
					serviceId: owner,
					description: agent.description,
					attributes: stableAttributes({
						runtimeRevision: agent.runtimeRevision,
						modelAliases: Object.keys(agent.models).sort(),
						sessionMode: agent.session.mode,
						usedSkills: agent.usedSkills.flatMap(skill => skill.names).sort(),
					}),
				})
				addRelation('owns', owner, id)
				for (const tool of agent.allowedCommands)
					addRelation(
						'agentCommandTool',
						id,
						componentId('command', tool.serviceName, tool.serviceVersion, tool.commandName),
					)
				for (const tool of agent.allowedAgents)
					addRelation('agentTool', id, componentId('agent', serviceName, tool.serviceVersion, tool.agentName))
			}
		}
	const values = [...components.values()].sort(componentSort)
	const ids = new Set(values.map(component => component.id))
	const emittingEvents = new Set(
		relations
			.filter(
				relation =>
					relation.kind === 'emits' ||
					relation.kind === 'respondsWithEvent' ||
					(relation.kind === 'scheduleTarget' && relation.to.startsWith('event:')),
			)
			.map(relation => relation.to),
	)
	const resolved = relations
		.map(relation => ({
			...relation,
			resolution: relation.to.startsWith('event:')
				? emittingEvents.has(relation.to)
					? ('resolved' as const)
					: ('unresolved' as const)
				: ids.has(relation.to)
					? ('resolved' as const)
					: ('unresolved' as const),
		}))
		.sort(relationSort)
	const body = {
		kind: 'purista.architecture' as const,
		version: '1.0.0' as const,
		definitionVersion: isFullDefinition(options.services) ? options.services.version : undefined,
		schemas: schemas.all(),
		components: values,
		relations: resolved,
	}
	return { ...body, digest: getArchitectureManifestDigest(body) }
}

const diagnostic = (
	code: string,
	severity: ArchitectureDiagnosticSeverity,
	message: string,
	location: ArchitectureSourceLocation,
	remediation: string,
): ArchitectureDiagnostic => ({ code, severity, message, location, remediation })
const relationLocation = (relation: ArchitectureRelation): ArchitectureSourceLocation => ({
	relationId: relation.id,
	pointer: `/relations/${pointer(relation.id)}`,
})

/**
 * Validate static architecture references without contacting runtime infrastructure.
 *
 * @example
 * ```ts
 * const diagnostics = validateArchitectureManifest(manifest, { strict: true })
 * ```
 * @group Architecture
 */
export const validateArchitectureManifest = (
	manifest: ArchitectureManifest,
	options: ValidateArchitectureManifestOptions = {},
): readonly ArchitectureDiagnostic[] => {
	const diagnostics: ArchitectureDiagnostic[] = []
	for (const relation of manifest.relations) {
		if (relation.kind === 'processes' && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_QUEUE_WORKER_UNKNOWN_QUEUE',
					'error',
					`Queue worker ${relation.from} references unknown queue ${relation.to}.`,
					relationLocation(relation),
					'Declare the queue on the same service or correct queueName.',
				),
			)
		if (relation.kind === 'bindsEventToQueue' && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_EVENT_QUEUE_BINDING_UNKNOWN_QUEUE',
					'error',
					`Event-to-queue binding ${relation.id} references an unknown queue.`,
					relationLocation(relation),
					'Declare the queue on this service or correct queueName.',
				),
			)
		if (relation.kind === 'scheduleTarget' && !relation.to.startsWith('event:') && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_SCHEDULE_TARGET_UNKNOWN',
					'warning',
					`Schedule ${relation.from} targets ${relation.to}, which is absent from the static artifact.`,
					relationLocation(relation),
					'Declare the target locally or resolve it through an architecture composition.',
				),
			)
		if (relation.kind === 'invokes' && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_COMMAND_TARGET_UNKNOWN',
					'warning',
					`Command invocation ${relation.id} targets a command absent from the static artifact.`,
					relationLocation(relation),
					'Declare the target locally or resolve the external command through an architecture composition.',
				),
			)
		if (relation.kind === 'consumesStream' && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_STREAM_TARGET_UNKNOWN',
					'warning',
					`Stream invocation ${relation.id} targets a stream absent from the static artifact.`,
					relationLocation(relation),
					'Declare the target locally or resolve the external stream through an architecture composition.',
				),
			)
		if (relation.kind === 'enqueues' && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_QUEUE_TARGET_UNKNOWN',
					'warning',
					`Queue invocation ${relation.id} targets a queue absent from the static artifact.`,
					relationLocation(relation),
					'Declare the queue locally or resolve the external queue through an architecture composition.',
				),
			)
		if (relation.kind === 'agentCommandTool' && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_AGENT_COMMAND_TOOL_UNKNOWN',
					'warning',
					`Agent tool ${relation.id} references a command absent from the static artifact.`,
					relationLocation(relation),
					'Declare the target command or resolve the external tool in an architecture composition.',
				),
			)
		if (relation.kind === 'agentTool' && relation.resolution === 'unresolved')
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_AGENT_TOOL_UNKNOWN',
					'warning',
					`Agent tool ${relation.id} references an agent absent from the static artifact.`,
					relationLocation(relation),
					'Declare the target agent or resolve the external tool in an architecture composition.',
				),
			)
	}
	for (const component of manifest.components.filter(component => component.kind === 'agent'))
		if (!Array.isArray(component.attributes?.modelAliases) || component.attributes?.modelAliases.length === 0)
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_AGENT_MODEL_MISSING',
					'error',
					`Agent ${component.id} has no declared model binding.`,
					{ componentId: component.id, pointer: `/components/${pointer(component.id)}` },
					'Declare at least one model alias before attaching the agent.',
				),
			)
	return diagnostics
		.map(item => (options.strict && item.severity === 'warning' ? { ...item, severity: 'error' as const } : item))
		.sort((a, b) =>
			`${a.severity}/${a.code}/${a.location?.pointer ?? ''}/${a.message}`.localeCompare(
				`${b.severity}/${b.code}/${b.location?.pointer ?? ''}/${b.message}`,
			),
		)
}

const matchesScope = (component: ArchitectureComponent, selector: string) =>
	component.id === selector ||
	(selector.startsWith('service:') && (component.serviceId === selector || component.id === selector)) ||
	(() => {
		const [kind, ...name] = selector.split(':')
		return name.length > 0 && component.kind === kind && component.name === name.join(':')
	})()
/**
 * Create a bounded, deterministic subgraph suitable for tool output and LLM context.
 *
 * @example
 * ```ts
 * const context = createArchitectureContext(manifest, {
 *   scope: ['service:orders/1'],
 *   depth: 1,
 *   schemaMode: 'referenced',
 * })
 * ```
 * @group Architecture
 */
export const createArchitectureContext = (
	manifest: ArchitectureManifest,
	options: CreateArchitectureContextOptions = {},
): ArchitectureContext => {
	const selectors = [...(options.scope ?? [])].filter(Boolean).sort()
	const depth = Math.max(0, options.depth ?? 1)
	const diagnostics: ArchitectureDiagnostic[] = []
	const selected = new Set<string>()
	if (selectors.length === 0) for (const component of manifest.components) selected.add(component.id)
	for (const selector of selectors) {
		const matches = manifest.components.filter(component => matchesScope(component, selector))
		if (matches.length === 0)
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_SCOPE_UNKNOWN',
					'warning',
					`Architecture scope ${selector} does not match a component.`,
					{ pointer: `/scope/${pointer(selector)}` },
					'Use an exact component ID, service:<name>/<version>, event:<name>, or kind:<name>.',
				),
			)
		for (const match of matches) selected.add(match.id)
	}
	for (let index = 0; index < depth; index += 1)
		for (const relation of manifest.relations)
			if (selected.has(relation.from) || selected.has(relation.to)) {
				selected.add(relation.from)
				selected.add(relation.to)
			}
	const components = manifest.components.filter(component => selected.has(component.id)).sort(componentSort)
	const relations = manifest.relations
		.filter(relation => selected.has(relation.from) && selected.has(relation.to))
		.sort(relationSort)
	const schemaIds = new Set<string>()
	for (const entry of [
		...components.map(component => component.contracts),
		...relations.map(relation => relation.contracts),
	])
		for (const reference of Object.values(entry ?? {})) if (reference) schemaIds.add(reference.id)
	const schemas = manifest.schemas
		.filter(schema => schemaIds.has(schema.id))
		.map(schema =>
			options.schemaMode === 'referenced'
				? schema
				: ({ id: schema.id, fingerprint: schema.fingerprint, dialect: schema.dialect } satisfies ArchitectureSchema),
		)
		.sort((a, b) => a.id.localeCompare(b.id))
	return {
		kind: 'purista.architecture.context',
		version: '1.0.0',
		source: {
			kind: manifest.kind,
			version: manifest.version,
			definitionVersion: manifest.definitionVersion,
			digest: manifest.digest,
		},
		scope: {
			selectors,
			depth,
			omittedComponentCount: manifest.components.length - components.length,
			omittedRelationCount: manifest.relations.length - relations.length,
		},
		schemas,
		components,
		relations,
		diagnostics: diagnostics.sort((a, b) => a.code.localeCompare(b.code)),
	}
}
/**
 * Render a deterministic Markdown projection of an architecture context.
 *
 * @example
 * ```ts
 * const markdown = renderArchitectureContextMarkdown(context)
 * ```
 * @group Architecture
 */
export const renderArchitectureContextMarkdown = (context: ArchitectureContext) => {
	const lines = [
		'# PURISTA architecture context',
		'',
		`- Manifest digest: \`${context.source.digest}\``,
		`- Definition version: \`${context.source.definitionVersion ?? 'unknown'}\``,
		`- Scope: ${context.scope.selectors.join(', ') || 'complete manifest'}; depth ${context.scope.depth}`,
		`- Omitted: ${context.scope.omittedComponentCount} components, ${context.scope.omittedRelationCount} relations`,
		'',
		'## Components',
	]
	for (const component of context.components) {
		const contract = Object.entries(component.contracts ?? {})
			.map(([role, schema]) => `${role}=${schema.fingerprint}`)
			.join(', ')
		lines.push(
			`- \`${component.id}\` — ${component.kind}${component.description ? `: ${component.description}` : ''}${contract ? ` (${contract})` : ''}`,
		)
	}
	lines.push('', '## Relations')
	for (const relation of context.relations)
		lines.push(`- \`${relation.kind}\`: \`${relation.from}\` → \`${relation.to}\` (${relation.resolution})`)
	if (context.diagnostics.length > 0) {
		lines.push('', '## Context diagnostics')
		for (const item of context.diagnostics) lines.push(`- ${item.severity} \`${item.code}\`: ${item.message}`)
	}
	lines.push(
		'',
		'## Static boundary',
		'',
		'This view contains declarations only. It does not prove runtime health, deployment ownership, or external contract compatibility.',
	)
	return `${lines.join('\n')}\n`
}

const contractFingerprint = (contracts: ArchitectureContracts | undefined) =>
	Object.entries(contracts ?? {})
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([role, reference]) => `${role}:${reference.fingerprint}`)
		.join('|')
/**
 * Compare two static architecture contracts without an unsound schema-evolution guess.
 *
 * @example
 * ```ts
 * const changes = compareArchitectureManifests(baseManifest, candidateManifest, { strict: true })
 * ```
 * @group Architecture
 */
export const compareArchitectureManifests = (
	base: ArchitectureManifest,
	candidate: ArchitectureManifest,
	options: ValidateArchitectureManifestOptions = {},
): readonly ArchitectureChange[] => {
	const changes: ArchitectureChange[] = []
	const candidateComponents = new Map(candidate.components.map(component => [component.id, component]))
	const candidateRelations = new Map(candidate.relations.map(relation => [relation.id, relation]))
	for (const component of base.components) {
		const next = candidateComponents.get(component.id)
		if (!next)
			changes.push({
				code: 'PURISTA_ARCH_CONTRACT_COMPONENT_REMOVED',
				severity: 'error',
				componentId: component.id,
				message: `Component ${component.id} was removed.`,
				remediation: 'Keep the component or publish an explicitly approved breaking-change policy.',
			})
		else if (contractFingerprint(component.contracts) !== contractFingerprint(next.contracts))
			changes.push({
				code: 'PURISTA_ARCH_SCHEMA_COMPATIBILITY_UNKNOWN',
				severity: options.strict ? 'error' : 'warning',
				componentId: component.id,
				message: `Schema contract for ${component.id} changed and cannot be proven compatible conservatively.`,
				remediation:
					'Keep the schema, add a reviewed compatibility policy exception, or publish a deliberate breaking change.',
			})
	}
	for (const component of candidate.components)
		if (!base.components.some(item => item.id === component.id))
			changes.push({
				code: 'PURISTA_ARCH_CONTRACT_COMPONENT_ADDED',
				severity: 'info',
				componentId: component.id,
				message: `Component ${component.id} was added.`,
				remediation: 'Review new consumers and deployment composition before release.',
			})
	for (const relation of base.relations)
		if (!candidateRelations.has(relation.id))
			changes.push({
				code: 'PURISTA_ARCH_RELATION_REMOVED',
				severity: 'error',
				relationId: relation.id,
				message: `Relation ${relation.id} was removed.`,
				remediation: 'Keep the relation or approve the affected contract change explicitly.',
			})
	return changes.sort((a, b) =>
		`${a.severity}/${a.code}/${a.componentId ?? a.relationId ?? ''}`.localeCompare(
			`${b.severity}/${b.code}/${b.componentId ?? b.relationId ?? ''}`,
		),
	)
}

/**
 * Validate explicitly pinned architecture artifacts and cross-artifact relation bindings offline.
 *
 * @example
 * ```ts
 * const diagnostics = validateArchitectureComposition(composition, artifacts, { strict: true })
 * ```
 * @group Architecture
 */
export const validateArchitectureComposition = (
	composition: ArchitectureComposition,
	artifacts: Readonly<Record<string, ArchitectureManifest>>,
	options: ValidateArchitectureManifestOptions = {},
): readonly ArchitectureDiagnostic[] => {
	const diagnostics: ArchitectureDiagnostic[] = []
	const components = new Map<string, ArchitectureComponent>()
	const unresolved = new Map<string, ArchitectureRelation>()
	for (const artifact of composition.artifacts) {
		const manifest = artifacts[artifact.id]
		if (!manifest) {
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_COMPOSITION_ARTIFACT_MISSING',
					'error',
					`Composition artifact ${artifact.id} was not supplied.`,
					{ pointer: `/artifacts/${pointer(artifact.id)}` },
					'Supply the pinned local artifact before validating composition.',
				),
			)
			continue
		}
		if (manifest.digest !== artifact.digest)
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_COMPOSITION_ARTIFACT_DIGEST_MISMATCH',
					'error',
					`Composition artifact ${artifact.id} does not match its pinned digest.`,
					{ pointer: `/artifacts/${pointer(artifact.id)}` },
					'Update the pin through reviewed deployment change control.',
				),
			)
		for (const component of manifest.components) components.set(component.id, component)
		for (const relation of manifest.relations.filter(item => item.resolution === 'unresolved'))
			unresolved.set(relation.id, relation)
	}
	for (const binding of composition.bindings) {
		const source = unresolved.get(binding.from)
		const target = components.get(binding.to)
		if (!source)
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_COMPOSITION_BINDING_SOURCE_UNKNOWN',
					'error',
					`Composition binding source ${binding.from} is not an unresolved artifact relation.`,
					{ pointer: `/bindings/${pointer(binding.from)}` },
					'Bind an unresolved relation emitted by a supplied artifact.',
				),
			)
		if (!target)
			diagnostics.push(
				diagnostic(
					'PURISTA_ARCH_COMPOSITION_BINDING_TARGET_UNKNOWN',
					'error',
					`Composition binding target ${binding.to} is absent from supplied artifacts.`,
					{ pointer: `/bindings/${pointer(binding.to)}` },
					'Supply the target artifact and pin its digest.',
				),
			)
		if (source && target && contractFingerprint(source.contracts) && contractFingerprint(target.contracts)) {
			const sourceContracts = contractFingerprint(source.contracts)
			const targetContracts = contractFingerprint(target.contracts)
			if (sourceContracts !== targetContracts)
				diagnostics.push(
					diagnostic(
						'PURISTA_ARCH_COMPOSITION_SCHEMA_COMPATIBILITY_UNKNOWN',
						'warning',
						`Composition binding ${binding.from} → ${binding.to} has different schema fingerprints and cannot be proven compatible conservatively.`,
						{ pointer: `/bindings/${pointer(binding.from)}`, relationId: source.id, componentId: target.id },
						'Use matching contracts, or approve an explicit compatibility policy after reviewing the full schemas.',
					),
				)
		}
	}
	return diagnostics
		.map(item => (options.strict && item.severity === 'warning' ? { ...item, severity: 'error' as const } : item))
		.sort((a, b) =>
			`${a.severity}/${a.code}/${a.location?.pointer ?? ''}`.localeCompare(
				`${b.severity}/${b.code}/${b.location?.pointer ?? ''}`,
			),
		)
}
