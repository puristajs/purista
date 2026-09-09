import { createHash } from 'node:crypto'

import {
	type AnyHarnessTargetContract,
	type HarnessCatalogView,
	type HarnessDefinition,
	type HarnessInterruptKind,
	type HarnessOutputUpdateKind,
	type HarnessTargetInferenceFor,
	type HarnessTargetRunOutcome,
	harnessExecutionEventTypesV1,
	type JsonValue,
} from '@purista/harness'
import { visitHostedHarnessTargets } from '@purista/harness/integrator'
import Ajv2020 from 'ajv/dist/2020.js'

import { createHarnessTargetRouteBinding } from './dispatcher.js'
import { requireHarnessTargetQueueBinding } from './queueBinding.js'
import { canonicalHarnessJson, computeHarnessTargetExportDigest } from './remoteTargetContract.js'
import type {
	HarnessMountPolicy,
	HarnessTargetJsonSchema,
	MountedHarnessCompletedEvent,
	MountedHarnessTargetPolicyDescriptor,
	MountedHarnessTargetProjection,
	SerializedHarnessTargetExportV1,
} from './types.js'

const receiverProtocolRevision = 'purista.eventbridge-harness-receiver.v1'
const jsonSchemaTarget = Object.freeze({ target: 'draft-2020-12' as const })
const completedOutputValidator = new Ajv2020({
	strict: false,
	addUsedSchema: false,
	validateFormats: false,
	useDefaults: false,
	coerceTypes: false,
	removeAdditional: false,
})

type HostedHarnessDefinitionParameter = Parameters<typeof visitHostedHarnessTargets>[0]
type TargetFromDefinition<Definition> =
	Definition extends Readonly<{ contract: infer Target extends AnyHarnessTargetContract }> ? Target : never
type TargetFromDefinitions<Definitions> =
	Definitions extends Readonly<Record<string, unknown>> ? TargetFromDefinition<Definitions[keyof Definitions]> : never
type TargetFromGraph<Graph> =
	Graph extends Readonly<{ agents: infer Agents; workflows: infer Workflows }>
		? TargetFromDefinitions<Agents> | TargetFromDefinitions<Workflows>
		: never
type ProjectionOptionsFor<Definition, Resources extends Record<string, unknown>> =
	Definition extends HarnessDefinition<infer Catalog, infer _Name, infer _Graph>
		? MountedHarnessProjectionOptions<Catalog, Resources>
		: never
type PublicHarnessTarget<Target extends AnyHarnessTargetContract> =
	Target['$infer'] extends HarnessTargetInferenceFor<
		infer _WireInput extends JsonValue,
		infer _ValidatedInput extends JsonValue,
		infer _Output extends JsonValue,
		infer _Updates extends HarnessOutputUpdateKind,
		infer _Interrupts extends readonly HarnessInterruptKind[]
	>
		? Target
		: never
type ProjectionForTarget<Target> = Target extends AnyHarnessTargetContract
	? MountedHarnessTargetProjection<PublicHarnessTarget<Target>>
	: never
type ProjectionResultFor<Definition> =
	Definition extends HarnessDefinition<infer _Catalog, infer _Name, infer Graph>
		? readonly ProjectionForTarget<TargetFromGraph<Graph>>[]
		: never

/** Inputs for the pure mounted-target projection pass. */
export type MountedHarnessProjectionOptions<
	Catalog extends HarnessCatalogView,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	serviceName: string
	serviceVersion: string
	revision?: string
	policy?: HarnessMountPolicy<Catalog, Resources>
}>

/**
 * Project one authentic Harness graph into immutable Core-owned route metadata.
 *
 * This function is pure: it creates no runtime, receiver, queue, worker, or
 * EventBridge registration. Every projection is staged before the array is
 * returned, so any validation failure exposes no partial result.
 */
export function createMountedHarnessTargetProjections<
	const D,
	Resources extends Record<string, unknown> = Record<string, unknown>,
>(definition: D, options: ProjectionOptionsFor<D, Resources>): ProjectionResultFor<D>
export function createMountedHarnessTargetProjections(
	definition: HostedHarnessDefinitionParameter,
	options: Readonly<{ serviceName: string; serviceVersion: string; revision?: string; policy?: unknown }>,
): readonly MountedHarnessTargetProjection<AnyHarnessTargetContract>[] {
	assertNonEmpty(options.serviceName, 'serviceName')
	assertNonEmpty(options.serviceVersion, 'serviceVersion')
	if (options.revision !== undefined) assertNonEmpty(options.revision, 'revision')

	const visits: Array<Readonly<{ target: AnyHarnessTargetContract; visibility: 'root' | 'dependency' }>> = []
	visitHostedHarnessTargets(definition, entry => visits.push(entry))
	if (visits.length === 0) throw new TypeError('A mounted Harness must contain at least one executable target.')

	const rootIds = {
		agents: new Set(
			visits.filter(row => row.visibility === 'root' && row.target.kind === 'agent').map(row => row.target.id),
		),
		workflows: new Set(
			visits.filter(row => row.visibility === 'root' && row.target.kind === 'workflow').map(row => row.target.id),
		),
	}
	assertMountPolicy(options.policy, rootIds)
	const mountRevision = options.revision ?? definition.revision ?? options.serviceVersion

	const staged = visits.map(entry => {
		const target = entry.target
		const targetPolicy = entry.visibility === 'root' ? policyFor(options.policy, target) : undefined
		const queueRecord =
			targetPolicy?.queue === undefined ? undefined : requireHarnessTargetQueueBinding(targetPolicy.queue, target)
		const policy = entry.visibility === 'root' ? projectPolicy(targetPolicy, target, queueRecord?.queueName) : null
		const address = deepFreeze({
			serviceName: options.serviceName,
			serviceVersion: options.serviceVersion,
			serviceTarget: target.id,
		})
		const input = projectSchemaDirection(target.input, 'input', `${target.kind}:${target.id}:input`)
		const validatedInput = projectSchemaDirection(target.input, 'output', `${target.kind}:${target.id}:validatedInput`)
		const output = projectSchemaDirection(target.output, 'output', `${target.kind}:${target.id}:output`)
		const update = updateSchema(target.updates)
		const interrupt = interruptSchema(target.interrupts)
		const jsonSchemas = deepFreeze({ input, validatedInput, output, update, interrupt })
		const outputUpdates = target.updates === 'none' ? [] : [target.updates]
		const targetExport = deepFreeze({
			targetName: target.id,
			kind: target.kind,
			...(target.description === undefined ? {} : { description: target.description }),
			inputSchema: input,
			validatedInputSchema: validatedInput,
			outputSchema: output,
			updateSchema: update,
			interruptSchema: interrupt,
			invocation: {
				aggregate: true as const,
				stream: true as const,
				resumableInterrupts: [...target.interrupts],
			},
			stream: {
				protocol: 'harness-execution-events-v1' as const,
				eventTypes: [...harnessExecutionEventTypesV1],
				outputUpdates,
			},
			...(queueRecord === undefined ? {} : { queue: { name: queueRecord.queueName } }),
		}) satisfies Omit<SerializedHarnessTargetExportV1, 'exportDigest'>
		const exportDigest = computeHarnessTargetExportDigest({ address, target: targetExport })
		const routeBindingRevision = digest([
			'purista.harness-target-route-revision.v1',
			{
				address,
				target: targetExport,
				exportDigest,
				visibility: entry.visibility,
				mountRevision,
				policy,
				receiverProtocolRevision,
			},
		])
		const routeBinding = createHarnessTargetRouteBinding({
			target,
			address,
			exportDigest,
			routeBindingRevision,
			visibility: entry.visibility,
		})
		const completedEvent =
			entry.visibility === 'root' && targetPolicy?.successEvent !== undefined
				? createCompletedEvent(targetPolicy.successEvent, output)
				: undefined

		return deepFreeze({
			target,
			standardSchemas: Object.freeze({ input: target.input, output: target.output }),
			visibility: entry.visibility,
			address,
			policy,
			jsonSchemas,
			targetExport,
			exportDigest,
			mountRevision,
			routeBindingRevision,
			routeBinding,
			...(completedEvent === undefined ? {} : { completedEvent }),
		})
	})

	return Object.freeze(staged)
}

type RuntimeTargetPolicy = Readonly<{
	beforeGuards?: Readonly<Record<string, unknown>>
	afterGuards?: Readonly<Record<string, unknown>>
	successEvent?: string
	queue?: unknown
	durableResume?: Readonly<{ identity: 'run-owner' }>
}>

function policyFor(policy: unknown, target: AnyHarnessTargetContract): RuntimeTargetPolicy | undefined {
	if (policy === undefined) return undefined
	const targets = dataProperty(policy as object, 'targets')
	if (targets === undefined) return undefined
	const group = dataProperty(targets as object, target.kind === 'agent' ? 'agents' : 'workflows')
	if (group === undefined) return undefined
	return dataProperty(group as object, target.id) as RuntimeTargetPolicy | undefined
}

function projectPolicy(
	policy: RuntimeTargetPolicy | undefined,
	target: AnyHarnessTargetContract,
	queueName: string | undefined,
): MountedHarnessTargetPolicyDescriptor {
	const beforeGuardKeys = Object.keys(policy?.beforeGuards ?? {}).sort()
	const afterGuardKeys = Object.keys(policy?.afterGuards ?? {}).sort()
	if (policy?.durableResume !== undefined) {
		if (!target.interrupts.includes('tool-approval') || beforeGuardKeys.length === 0) {
			throw new TypeError('Stored-run-owner resume requires a root with reachable tool approval and a before guard.')
		}
	}
	return deepFreeze({
		beforeGuardKeys,
		afterGuardKeys,
		durableResume: policy?.durableResume === undefined ? null : 'stored-run-owner',
		successEvent: policy?.successEvent ?? null,
		queueName: queueName ?? null,
	})
}

function assertMountPolicy(
	policy: unknown,
	rootIds: Readonly<{ agents: ReadonlySet<string>; workflows: ReadonlySet<string> }>,
): void {
	if (policy === undefined) return
	assertPlainRecord(policy, ['targets'], 'Harness mount policy')
	const targets = dataProperty(policy, 'targets')
	if (targets === undefined) return
	assertPlainRecord(targets, ['agents', 'workflows'], 'Harness mount target policy')
	for (const kind of ['agents', 'workflows'] as const) {
		const group = dataProperty(targets, kind)
		if (group === undefined) continue
		assertPlainRecord(group, [...rootIds[kind]], `Harness ${kind} policy`)
		for (const id of Object.keys(group)) assertTargetPolicy(dataProperty(group, id), `${kind}.${id}`)
	}
}

function assertTargetPolicy(value: unknown, path: string): void {
	assertPlainRecord(
		value,
		['beforeGuards', 'afterGuards', 'successEvent', 'queue', 'durableResume'],
		`Harness policy ${path}`,
	)
	for (const key of ['beforeGuards', 'afterGuards'] as const) {
		const guards = dataProperty(value, key)
		if (guards === undefined) continue
		assertPlainStringRecord(guards, `Harness policy ${path}.${key}`)
		for (const name of Object.keys(guards)) {
			if (name.trim() === '' || typeof dataProperty(guards, name) !== 'function') {
				throw new TypeError(`Harness policy ${path}.${key} must contain named functions.`)
			}
		}
	}
	const successEvent = dataProperty(value, 'successEvent')
	if (successEvent !== undefined) assertNonEmpty(successEvent, `${path}.successEvent`)
	const durableResume = dataProperty(value, 'durableResume')
	if (durableResume !== undefined) {
		assertPlainRecord(durableResume, ['identity'], `${path}.durableResume`)
		if (dataProperty(durableResume, 'identity') !== 'run-owner') throw new TypeError('Unknown durable resume policy.')
	}
}

function projectSchemaDirection(
	schema: AnyHarnessTargetContract['input'] | AnyHarnessTargetContract['output'],
	direction: 'input' | 'output',
	label: string,
): HarnessTargetJsonSchema {
	try {
		const standard = schema['~standard']
		const converter = standard.jsonSchema?.[direction]
		if (typeof converter !== 'function') throw new TypeError('JSON Schema conversion is unavailable.')
		return cloneJsonSchema(converter(jsonSchemaTarget), label)
	} catch (error) {
		throw new TypeError(`Harness ${label} JSON Schema projection failed.`, { cause: error })
	}
}

function updateSchema(update: AnyHarnessTargetContract['updates']): HarnessTargetJsonSchema {
	if (update === 'none') return false
	if (update === 'text-delta') return deepFreeze({ type: 'string' })
	if (update === 'object-snapshot') return true
	throw new TypeError('Unknown Harness output update kind.')
}

function interruptSchema(interrupts: readonly HarnessInterruptKind[]): HarnessTargetJsonSchema {
	if (interrupts.length === 0) return false
	const variants = interrupts.map(kind =>
		kind === 'tool-approval' ? toolApprovalInterruptSchema() : externalWaitInterruptSchema(),
	)
	const only = variants[0]
	return variants.length === 1 && only !== undefined ? only : deepFreeze({ oneOf: variants })
}

function toolApprovalInterruptSchema(): HarnessTargetJsonSchema {
	return deepFreeze({
		type: 'object',
		additionalProperties: false,
		required: ['type', 'id', 'revision', 'requests'],
		properties: {
			type: { const: 'tool-approval' },
			id: { type: 'string', pattern: '^approval_batch_[0-9a-f]{64}$' },
			revision: { type: 'string', pattern: '^[0-9a-f]{64}$' },
			requests: {
				type: 'array',
				minItems: 1,
				items: {
					type: 'object',
					additionalProperties: false,
					required: [
						'approvalId',
						'runId',
						'agentRunId',
						'agentId',
						'invocationId',
						'step',
						'toolId',
						'callId',
						'input',
						'demands',
					],
					properties: {
						approvalId: identifierSchema(),
						runId: identifierSchema(),
						agentRunId: identifierSchema(),
						parentRunId: identifierSchema(),
						parentInvocationId: identifierSchema(),
						agentId: identifierSchema(),
						workflowId: identifierSchema(),
						invocationId: identifierSchema(),
						step: { type: 'integer', minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
						toolId: identifierSchema(),
						callId: identifierSchema(),
						input: true,
						demands: { type: 'array', items: decisionEvidenceSchema() },
					},
				},
			},
		},
	})
}

function identifierSchema(): Readonly<Record<string, unknown>> {
	return { type: 'string', pattern: '^[A-Za-z0-9][A-Za-z0-9_.:-]{0,255}$' }
}

function configurationIdentifierSchema(): Readonly<Record<string, unknown>> {
	return { type: 'string', minLength: 1, maxLength: 128, pattern: '^[^\\p{Cc}]+$' }
}

function decisionEvidenceSchema(): Readonly<Record<string, unknown>> {
	return {
		type: 'object',
		additionalProperties: false,
		required: ['decisionId', 'source', 'phase'],
		properties: {
			decisionId: { type: 'string', pattern: '^decision_[0-9a-f]{64}$' },
			source: {
				type: 'object',
				additionalProperties: false,
				required: ['kind', 'id'],
				properties: {
					kind: { enum: ['permission', 'policy', 'exposure', 'interceptor', 'guardrail'] },
					id: configurationIdentifierSchema(),
					version: configurationIdentifierSchema(),
					ruleId: configurationIdentifierSchema(),
				},
			},
			phase: {
				enum: [
					'input',
					'before_model',
					'after_model',
					'output',
					'tool_input',
					'permission',
					'policy',
					'approval',
					'tool_output',
					'exposure',
					'retrieval',
				],
			},
			reasonCode: { type: 'string', pattern: '^[a-z][a-z0-9_]{0,63}$' },
		},
	}
}

function externalWaitInterruptSchema(): HarnessTargetJsonSchema {
	const externalWaitIdentifier = { type: 'string', minLength: 1, maxLength: 200, pattern: '^[A-Za-z0-9_.:@/-]+$' }
	const timestamp = {
		type: 'string',
		pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$',
	}
	return deepFreeze({
		type: 'object',
		additionalProperties: false,
		required: ['type', 'id', 'revision', 'kind', 'schemaVersion', 'definitionVersion', 'deadline'],
		properties: {
			type: { const: 'external-wait' },
			id: externalWaitIdentifier,
			revision: timestamp,
			kind: externalWaitIdentifier,
			schemaVersion: externalWaitIdentifier,
			definitionVersion: externalWaitIdentifier,
			deadline: timestamp,
		},
	})
}

function createCompletedEvent<C extends AnyHarnessTargetContract>(
	name: string,
	outputSchema: HarnessTargetJsonSchema,
): MountedHarnessCompletedEvent<C> {
	let outputValidator: ReturnType<typeof completedOutputValidator.compile>
	try {
		outputValidator = completedOutputValidator.compile(outputSchema)
	} catch (error) {
		throw new TypeError('Harness completed-event output JSON Schema compilation failed.', { cause: error })
	}
	const jsonSchema = deepFreeze({
		type: 'object',
		additionalProperties: false,
		required: ['status', 'runId', 'output'],
		properties: {
			status: { const: 'completed' },
			runId: { type: 'string', minLength: 1 },
			output: outputSchema,
		},
	})
	const schema = Object.freeze({
		'~standard': Object.freeze({
			version: 1 as const,
			vendor: 'purista',
			types: undefined as never,
			validate(value: unknown) {
				try {
					assertCompletedOutcome(value)
					if (!outputValidator(value.output)) throw new TypeError('Harness completed outcome output is invalid.')
					return { value: value as Extract<HarnessTargetRunOutcome<C>, { status: 'completed' }> }
				} catch (error) {
					return { issues: [{ message: error instanceof Error ? error.message : 'Invalid completed outcome.' }] }
				}
			},
		}),
	}) as MountedHarnessCompletedEvent<C>['schema']
	return deepFreeze({ name, schema, jsonSchema })
}

function assertCompletedOutcome(value: unknown): asserts value is Readonly<{
	status: 'completed'
	runId: string
	output: JsonValue
}> {
	assertPlainRecord(value, ['status', 'runId', 'output'], 'completed Harness outcome', true)
	if (dataProperty(value, 'status') !== 'completed') throw new TypeError('Expected a completed Harness outcome.')
	assertNonEmpty(dataProperty(value, 'runId'), 'completed Harness outcome runId')
	canonicalHarnessJson(dataProperty(value, 'output'))
}

function cloneJsonSchema(value: unknown, label: string): HarnessTargetJsonSchema {
	if (typeof value !== 'boolean' && (typeof value !== 'object' || value === null || Array.isArray(value))) {
		throw new TypeError(`Harness ${label} JSON Schema must be an object or boolean.`)
	}
	return deepFreeze(JSON.parse(canonicalHarnessJson(value)) as HarnessTargetJsonSchema)
}

function digest(value: unknown): `sha256:${string}` {
	return `sha256:${createHash('sha256').update(canonicalHarnessJson(value)).digest('hex')}`
}

function assertPlainRecord(
	value: unknown,
	allowed: readonly string[],
	label: string,
	exact = false,
): asserts value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		throw new TypeError(`${label} must be a plain object.`)
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) throw new TypeError(`${label} must be a plain object.`)
	const allowedKeys = new Set(allowed)
	const keys = Reflect.ownKeys(value)
	for (const key of keys) {
		if (typeof key !== 'string' || !allowedKeys.has(key)) throw new TypeError(`${label} contains an unknown field.`)
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		if (descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')) {
			throw new TypeError(`${label} must contain enumerable data properties only.`)
		}
	}
	if (exact && (keys.length !== allowed.length || allowed.some(key => !Object.hasOwn(value, key)))) {
		throw new TypeError(`${label} must contain exactly ${allowed.join(', ')}.`)
	}
}

function assertPlainStringRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		throw new TypeError(`${label} must be a plain object.`)
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) throw new TypeError(`${label} must be a plain object.`)
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		if (typeof key !== 'string' || descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')) {
			throw new TypeError(`${label} must contain enumerable string data properties only.`)
		}
	}
}

function dataProperty(value: object, key: string): unknown {
	const descriptor = Object.getOwnPropertyDescriptor(value, key)
	return descriptor && Object.hasOwn(descriptor, 'value') ? descriptor.value : undefined
}

function assertNonEmpty(value: unknown, label: string): asserts value is string {
	if (typeof value !== 'string' || value.trim() === '' || /\p{Cc}/u.test(value)) {
		throw new TypeError(`Harness ${label} must be a non-empty string.`)
	}
}

function deepFreeze<T>(value: T): T {
	if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
		for (const child of Object.values(value)) deepFreeze(child)
		Object.freeze(value)
	}
	return value
}
