import type { SerializedHarnessTargetExportV1 } from '../HarnessMount/types.js'
import { puristaVersion } from '../version.js'
import type { FullDefinition } from './types/FullDefinition.js'
import type { FullServiceDefinition } from './types/FullServiceDefinition.js'
import type { MountedHarnessDefinition, MountedHarnessTargetDefinitions } from './types/HarnessServiceDefinition.js'
import type { ServiceDefinitions } from './types/ServiceDefinitions.js'

type ServiceDefinitionProvider = Readonly<{
	getFullServiceDefinition(): Promise<ServiceDefinitions>
}>

/** Immutable projection fields consumed by the service-definition exporter. */
export type MountedHarnessExportProjection = Readonly<{
	visibility: 'root' | 'dependency'
	policy: Readonly<{ queueName: string | null }> | null
	targetExport: Omit<SerializedHarnessTargetExportV1, 'exportDigest'>
	exportDigest: `sha256:${string}`
}>

/** Sanitized composition metadata supplied by the mounted Harness integration. */
export type MountedHarnessCompositionExport = Readonly<{
	name: string
	dependencies: MountedHarnessDefinition['dependencies']
}>

/** Input required to turn stored mounted-target projections into public JSON exports. */
export type MountedHarnessServiceExportInput = MountedHarnessCompositionExport &
	Readonly<{ projections: readonly MountedHarnessExportProjection[] }>

/**
 * Produce the root-only, JSON-safe Harness portion of one service definition.
 *
 * This helper consumes stored projection fields only. It does not inspect a
 * Harness definition, invoke a schema, compute a digest, or retain a target
 * contract. The caller must supply the already-sanitized dependency closure.
 */
export function createMountedHarnessServiceExport(
	input: MountedHarnessServiceExportInput,
): MountedHarnessTargetDefinitions {
	assertNonEmptyString(input.name, 'Harness export name')

	const agents: Record<string, SerializedHarnessTargetExportV1> = {}
	const workflows: Record<string, SerializedHarnessTargetExportV1> = {}
	for (const projection of input.projections) {
		if (projection.visibility !== 'root') continue
		const exported = copyTargetExport(projection.targetExport, projection.exportDigest, validatedQueueName(projection))
		const targets = exported.kind === 'agent' ? agents : workflows
		if (targets[exported.targetName] !== undefined) {
			throw new TypeError(`Harness export contains duplicate root ${exported.kind} "${exported.targetName}".`)
		}
		targets[exported.targetName] = exported
	}

	const rootAgents = Object.keys(agents).sort()
	const rootWorkflows = Object.keys(workflows).sort()
	const rootIds = new Set([...rootAgents, ...rootWorkflows])
	const harness: MountedHarnessDefinition = deepFreeze({
		name: input.name,
		roots: { agents: rootAgents, workflows: rootWorkflows },
		dependencies: {
			tools: sanitizedIds(input.dependencies.tools, 'Harness tool dependency'),
			skills: sanitizedIds(input.dependencies.skills, 'Harness Skill dependency'),
			mcpServers: sanitizedIds(input.dependencies.mcpServers, 'Harness MCP server dependency'),
			agents: sanitizedIds(input.dependencies.agents, 'Harness agent dependency', rootIds),
			workflows: sanitizedIds(input.dependencies.workflows, 'Harness workflow dependency', rootIds),
		},
	})

	return deepFreeze({ agents, workflows, harness })
}

/**
 * Merge service definitions into one big full service definition structure
 * @param existing
 * @param definitionToAdd
 * @returns
 */
export const mergeServiceDefinition = <T extends FullServiceDefinition>(
	existing: FullServiceDefinition,
	definitionToAdd: ServiceDefinitions,
): T => {
	const commands = definitionToAdd.commands.reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.commandName]: definition,
		}
	}, {})

	const subscriptions = definitionToAdd.subscriptions.reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.subscriptionName]: definition,
		}
	}, {})
	const streams = (definitionToAdd.streams ?? []).reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.streamName]: definition,
		}
	}, {})
	const queues = (definitionToAdd.queues ?? []).reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.queueName]: definition,
		}
	}, {})
	const queueWorkers = (definitionToAdd.queueWorkers ?? []).reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.name]: definition,
		}
	}, {})
	const commandSchedules = definitionToAdd.commands.flatMap(definition => definition.schedules ?? [])
	const queueSchedules = (definitionToAdd.queues ?? []).flatMap(definition => definition.schedules ?? [])
	const schedules = [...(definitionToAdd.schedules ?? []), ...commandSchedules, ...queueSchedules].reduce(
		(current, definition) => {
			return {
				// biome-ignore lint/performance/noAccumulatingSpread: small map construction
				...current,
				[definition.name]: {
					...definition,
					targetServiceName: definition.targetServiceName ?? definitionToAdd.serviceName,
					targetServiceVersion: definition.targetServiceVersion ?? definitionToAdd.serviceVersion,
				},
			}
		},
		{},
	)

	const ret = { ...existing }
	const currentServiceName = ret[definitionToAdd.serviceName] ?? {}
	const currentVersion = currentServiceName[definitionToAdd.serviceVersion]

	ret[definitionToAdd.serviceName] = {
		...currentServiceName,
		[definitionToAdd.serviceVersion]: {
			description: currentVersion?.description ?? definitionToAdd.serviceDescription,
			deprecated: currentVersion?.deprecated ?? definitionToAdd.deprecated,
			commands: { ...commands, ...currentVersion?.commands },
			subscriptions: { ...subscriptions, ...currentVersion?.subscriptions },
			streams: { ...streams, ...currentVersion?.streams },
			queues: { ...queues, ...currentVersion?.queues },
			queueWorkers: { ...queueWorkers, ...currentVersion?.queueWorkers },
			schedules: { ...schedules, ...currentVersion?.schedules },
			eventToQueueBindings: [
				...(definitionToAdd.eventToQueueBindings ?? []),
				...(currentVersion?.eventToQueueBindings ?? []),
			],
			...(definitionToAdd.agents === undefined && currentVersion?.agents === undefined
				? {}
				: { agents: { ...definitionToAdd.agents, ...currentVersion?.agents } }),
			...(definitionToAdd.workflows === undefined && currentVersion?.workflows === undefined
				? {}
				: { workflows: { ...definitionToAdd.workflows, ...currentVersion?.workflows } }),
			...(definitionToAdd.harness === undefined && currentVersion?.harness === undefined
				? {}
				: { harness: currentVersion?.harness ?? definitionToAdd.harness }),
		},
	}

	return ret as T
}

function copyTargetExport(
	target: Omit<SerializedHarnessTargetExportV1, 'exportDigest'>,
	exportDigest: `sha256:${string}`,
	queueName: string | null,
): SerializedHarnessTargetExportV1 {
	assertNonEmptyString(target.targetName, 'Harness target name')
	if (target.kind !== 'agent' && target.kind !== 'workflow')
		throw new TypeError('Harness target export has an invalid kind.')
	if (!exportDigest.startsWith('sha256:')) throw new TypeError('Harness target export has an invalid digest.')

	return deepFreeze({
		targetName: target.targetName,
		kind: target.kind,
		...(target.description === undefined ? {} : { description: target.description }),
		inputSchema: cloneJson(target.inputSchema),
		validatedInputSchema: cloneJson(target.validatedInputSchema),
		outputSchema: cloneJson(target.outputSchema),
		updateSchema: cloneJson(target.updateSchema),
		interruptSchema: cloneJson(target.interruptSchema),
		invocation: {
			aggregate: target.invocation.aggregate,
			stream: target.invocation.stream,
			resumableInterrupts: [...target.invocation.resumableInterrupts],
		},
		stream: {
			protocol: target.stream.protocol,
			eventTypes: [...target.stream.eventTypes],
			outputUpdates: [...target.stream.outputUpdates],
		},
		...(queueName === null ? {} : { queue: { name: queueName } }),
		exportDigest,
	})
}

function validatedQueueName(projection: MountedHarnessExportProjection): string | null {
	if (projection.policy === null) throw new TypeError('Harness root export is missing its projection policy.')
	const queueName = projection.policy.queueName
	if (queueName === null) {
		if (projection.targetExport.queue !== undefined)
			throw new TypeError('Harness target export contains queue metadata without an authenticated queue binding.')
		return null
	}
	assertNonEmptyString(queueName, 'Harness queue name')
	if (projection.targetExport.queue?.name !== queueName)
		throw new TypeError('Harness target export queue metadata does not match its authenticated queue binding.')
	return queueName
}

function sanitizedIds(values: readonly string[], label: string, excluded = new Set<string>()): string[] {
	const result = new Set<string>()
	for (const value of values) {
		assertNonEmptyString(value, label)
		if (!excluded.has(value)) result.add(value)
	}
	return [...result].sort()
}

function cloneJson<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T
}

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
	if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${label} must be a non-empty string.`)
}

function deepFreeze<T>(value: T): T {
	if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
		Object.freeze(value)
		for (const child of Object.values(value)) deepFreeze(child)
	}
	return value
}

/**
 * Exports the service definitions.
 * Includes the information about commands and subscriptions.
 *
 * The output can be saved as JSON string in a file.
 *
 * @param serviceBuilders
 * @returns
 */
export const exportServiceDefinitions = async (
	serviceBuilders: readonly ServiceDefinitionProvider[],
): Promise<FullDefinition> => {
	const serviceDefinitions = await Promise.all(serviceBuilders.map(builder => builder.getFullServiceDefinition()))

	return {
		version: puristaVersion,
		services: serviceDefinitions.reduce((def, current) => mergeServiceDefinition(def, current), {}),
	}
}
