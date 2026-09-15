import { createHash } from 'node:crypto'

import {
	type AnyHarnessTargetContract,
	type HarnessInterruptKind,
	type HarnessOutputUpdateKind,
	type HarnessTargetContract,
	type HarnessTargetInferenceFor,
	type HarnessTargetKind,
	harnessExecutionEventTypesV1,
	type Infer,
	type InferIn,
	type JsonValue,
	type ModelSchema,
} from '@purista/harness'
import Ajv2020 from 'ajv/dist/2020.js'

import { createHarnessInterruptSchema } from './interruptSchema.js'
import type { HarnessTargetJsonSchema, SerializedHarnessTargetExportV1 } from './targetExport.js'

/** Exact EventBridge address carried by a generated Harness target contract. */
export type HarnessTargetAddress = Readonly<{
	serviceName: string
	serviceVersion: string
	serviceTarget: string
}>

/** Validation-only Standard Schema witness emitted by ClientBuilder. */
export type GeneratedHarnessSchema<Value extends JsonValue> = ModelSchema<Value, Value>

/** Optional native queue metadata carried by one exported Harness root. */
export type HarnessTargetQueueExport = Readonly<{ name: string }>

/** Literal refinement of the raw serialized root export. */
export type RemoteHarnessSerializedTargetV1<
	Kind extends HarnessTargetKind,
	Id extends string,
	Updates extends HarnessOutputUpdateKind,
	Interrupts extends readonly HarnessInterruptKind[],
> = Omit<SerializedHarnessTargetExportV1, 'queue'> &
	Readonly<{
		targetName: Id
		kind: Kind
		invocation: Readonly<{ aggregate: true; stream: true; resumableInterrupts: Interrupts }>
		stream: Readonly<{
			protocol: 'harness-execution-events-v1'
			eventTypes: typeof harnessExecutionEventTypesV1
			outputUpdates: Updates extends 'none' ? readonly [] : readonly [Updates]
		}>
	}>

/** Shared closed source of a generated remote contract and its three witnesses. */
export type RemoteHarnessTargetContractSourceBaseV1 = Readonly<{
	schemaVersion: 1
	address: HarnessTargetAddress
	target: RemoteHarnessSerializedTargetV1<
		HarnessTargetKind,
		string,
		HarnessOutputUpdateKind,
		readonly HarnessInterruptKind[]
	>
	schemas: Readonly<{ input: ModelSchema; validatedInput: ModelSchema; output: ModelSchema }>
}>

/** Generated source for a root without a queue capability. */
export type RemoteHarnessTargetContractSourceV1 = RemoteHarnessTargetContractSourceBaseV1 &
	Readonly<{ target: Readonly<{ queue?: never }> }>

/** Generated source for a root with one explicit queue capability. */
export type QueuedRemoteHarnessTargetContractSourceV1 = RemoteHarnessTargetContractSourceBaseV1 &
	Readonly<{ target: Readonly<{ queue: HarnessTargetQueueExport }> }>

type RemoteHarnessTargetSourceAddressAgreement<S extends RemoteHarnessTargetContractSourceBaseV1> = Readonly<{
	address: S['address'] & Readonly<{ serviceTarget: S['target']['targetName'] }>
}>

type RemoteHarnessTargetAddressFor<S extends RemoteHarnessTargetContractSourceBaseV1> = Readonly<{
	serviceName: S['address']['serviceName']
	serviceVersion: S['address']['serviceVersion']
	serviceTarget: S['target']['targetName']
}>

type RemoteHarnessTargetUpdatesFor<S extends RemoteHarnessTargetContractSourceBaseV1> =
	S['target']['stream']['outputUpdates'] extends readonly []
		? 'none'
		: S['target']['stream']['outputUpdates'] extends readonly [
					infer Update extends Exclude<HarnessOutputUpdateKind, 'none'>,
				]
			? Update
			: never

type GeneratedHarnessInferenceForSource<S extends RemoteHarnessTargetContractSourceBaseV1> = HarnessTargetInferenceFor<
	InferIn<S['schemas']['input']> & JsonValue,
	Infer<S['schemas']['validatedInput']> & JsonValue,
	Infer<S['schemas']['output']> & JsonValue,
	RemoteHarnessTargetUpdatesFor<S>,
	S['target']['invocation']['resumableInterrupts']
>

declare class RemoteHarnessTargetAuthenticity<QueueName extends string | null> {
	private readonly queueName: QueueName
}

/** Addressed nominal refinement of the sole Harness-owned target contract. */
export type RemoteHarnessTargetContract<
	S extends RemoteHarnessTargetContractSourceBaseV1,
	QueueName extends string | null,
> = HarnessTargetContract<
	S['target']['kind'],
	S['target']['targetName'],
	S['schemas']['input'],
	S['schemas']['output'],
	RemoteHarnessTargetUpdatesFor<S>,
	S['target']['invocation']['resumableInterrupts'],
	GeneratedHarnessInferenceForSource<S>
> &
	RemoteHarnessTargetAuthenticity<QueueName> &
	Readonly<{
		address: RemoteHarnessTargetAddressFor<S>
		exportDigest: `sha256:${string}`
	}>

/** Authentic remote root with no enqueue operation. */
export type UnqueuedRemoteHarnessTargetContract<S extends RemoteHarnessTargetContractSourceV1> =
	RemoteHarnessTargetContract<S, null> & Readonly<{ queue?: never }>

/** Authentic remote root whose literal queue name grants an enqueue declaration. */
export type QueuedRemoteHarnessTargetContract<S extends QueuedRemoteHarnessTargetContractSourceV1> =
	RemoteHarnessTargetContract<S, S['target']['queue']['name']> &
		Readonly<{ queue: Readonly<{ name: S['target']['queue']['name'] }> }>

/** Nominal remote capability accepted by declaration and client boundaries. */
export type AnyRemoteHarnessTargetContract = AnyHarnessTargetContract &
	RemoteHarnessTargetAuthenticity<string | null> &
	Readonly<{ address: HarnessTargetAddress; exportDigest: `sha256:${string}` }>

/** Nominal queued remote capability; structural queue metadata cannot satisfy it. */
export type AnyQueuedRemoteHarnessTargetContract = AnyHarnessTargetContract &
	RemoteHarnessTargetAuthenticity<string> &
	Readonly<{ address: HarnessTargetAddress; exportDigest: `sha256:${string}`; queue: HarnessTargetQueueExport }>

type RemoteContractRecord = Readonly<{
	address: HarnessTargetAddress
	targetExport: SerializedHarnessTargetExportV1
	exportDigest: `sha256:${string}`
	queueName: string | null
}>

const remoteContracts = new WeakMap<object, RemoteContractRecord>()
const generatedSchemas = new WeakMap<object, HarnessTargetJsonSchema>()
const generatedValidator = new Ajv2020({
	strict: false,
	addUsedSchema: false,
	validateFormats: false,
	useDefaults: false,
	coerceTypes: false,
	removeAdditional: false,
})

/**
 * Create one validation-only witness from generated JSON Schema.
 *
 * Both projection directions return the same frozen schema. Accepted values
 * retain their identity; no producer transform, coercion, or default is run.
 * @example
 * const wire = createGeneratedHarnessSchema<{ raw: string }>({
 *   type: 'object', properties: { raw: { type: 'string' } }, required: ['raw'],
 * })
 */
export function createGeneratedHarnessSchema<Value extends JsonValue>(
	jsonSchema: HarnessTargetJsonSchema,
): GeneratedHarnessSchema<Value> {
	assertJsonSchema(jsonSchema, 'generated')
	const projection = deepFreeze(JSON.parse(canonicalHarnessJson(jsonSchema)) as HarnessTargetJsonSchema)
	const validate = generatedValidator.compile(projection)
	const schema = Object.freeze({
		'~standard': Object.freeze({
			version: 1 as const,
			vendor: 'purista-generated',
			jsonSchema: Object.freeze({ input: () => projection, output: () => projection }),
			validate: (value: unknown) => {
				try {
					canonicalHarnessJson(value)
				} catch {
					return { issues: [{ message: 'Expected a canonical JSON value.' }] }
				}
				if (!validate(value)) return { issues: [{ message: 'Value does not match its generated Harness schema.' }] }
				return { value: value as Value }
			},
		}),
	})
	// Standard JSON Schema's declarations omit boolean schemas, which JSON Schema and Core support.
	generatedSchemas.set(schema, projection)
	return schema as unknown as GeneratedHarnessSchema<Value>
}

/** Compute drift detection for one complete raw addressed root export. */
export function computeHarnessTargetExportDigest(
	source: Readonly<{ address: HarnessTargetAddress; target: object }>,
): `sha256:${string}` {
	const target = Object.fromEntries(ownEnumerableEntries(source.target).filter(([key]) => key !== 'exportDigest'))
	return `sha256:${createHash('sha256')
		.update(canonicalHarnessJson(['purista.harness-target-export.v1', { address: source.address, target }]))
		.digest('hex')}`
}

/** Hydrate a generated unqueued root from three authentic validation-only witnesses. */
export function createRemoteHarnessTargetContract<const S extends RemoteHarnessTargetContractSourceV1>(
	source: S & RemoteHarnessTargetSourceAddressAgreement<S>,
): UnqueuedRemoteHarnessTargetContract<S>
/** Hydrate a generated queued root, preserving its exact nominal enqueue capability. */
export function createRemoteHarnessTargetContract<const S extends QueuedRemoteHarnessTargetContractSourceV1>(
	source: S & RemoteHarnessTargetSourceAddressAgreement<S>,
): QueuedRemoteHarnessTargetContract<S>
export function createRemoteHarnessTargetContract(
	source: RemoteHarnessTargetContractSourceV1 | QueuedRemoteHarnessTargetContractSourceV1,
): AnyRemoteHarnessTargetContract {
	assertHydrationSource(source)
	if (source.target.exportDigest !== computeHarnessTargetExportDigest(source)) {
		throw new TypeError('Remote Harness target export digest does not match its addressed contract.')
	}
	const address = deepFreeze(JSON.parse(canonicalHarnessJson(source.address)) as HarnessTargetAddress)
	const target = deepFreeze(JSON.parse(canonicalHarnessJson(source.target)) as SerializedHarnessTargetExportV1)
	const contract = {
		kind: target.kind,
		id: target.targetName,
		...(target.description === undefined ? {} : { description: target.description }),
		input: source.schemas.input,
		output: source.schemas.output,
		executionModes: Object.freeze(['run', 'stream'] as const),
		updates: target.stream.outputUpdates[0] ?? 'none',
		interrupts: target.invocation.resumableInterrupts,
		...(target.queue === undefined ? {} : { queue: target.queue }),
		address,
		exportDigest: target.exportDigest,
	}
	Object.defineProperty(contract, '$infer', { value: Object.freeze({}), enumerable: false })
	Object.freeze(contract)
	remoteContracts.set(
		contract,
		Object.freeze({
			address,
			targetExport: target,
			exportDigest: target.exportDigest,
			queueName: target.queue?.name ?? null,
		}),
	)
	return contract as unknown as AnyRemoteHarnessTargetContract
}

/** Return whether this exact value passed the current process's hydration boundary. */
export function isRemoteHarnessTargetContract(value: unknown): value is AnyRemoteHarnessTargetContract {
	return typeof value === 'object' && value !== null && remoteContracts.has(value)
}

/** @internal Resolve the authentic frozen snapshot before granting any client capability. */
export function requireRemoteHarnessTargetContract(value: unknown): RemoteContractRecord {
	if (!isRemoteHarnessTargetContract(value)) throw new TypeError('Remote Harness target contract is not authentic.')
	const record = remoteContracts.get(value)
	if (!record) throw new TypeError('Remote Harness target contract is not authentic.')
	return record
}

function deepFreeze<T>(value: T): T {
	if (typeof value === 'object' && value !== null) {
		for (const child of Object.values(value)) deepFreeze(child)
		Object.freeze(value)
	}
	return value
}

function assertHydrationSource(
	source: RemoteHarnessTargetContractSourceV1 | QueuedRemoteHarnessTargetContractSourceV1,
): void {
	assertPlainDataObject(
		source,
		['schemaVersion', 'address', 'target', 'schemas'],
		['schemaVersion', 'address', 'target', 'schemas'],
		'remote Harness target source',
	)
	if (source.schemaVersion !== 1) throw new TypeError('Unsupported remote Harness target schema version.')
	assertSerializedHarnessTargetExport(source.address, source.target)
	assertPlainDataObject(
		source.schemas,
		['input', 'validatedInput', 'output'],
		['input', 'validatedInput', 'output'],
		'remote Harness schema witnesses',
	)
	assertGeneratedSchema(source.schemas.input, 'input', source.target.inputSchema)
	assertGeneratedSchema(source.schemas.validatedInput, 'validated input', source.target.validatedInputSchema)
	assertGeneratedSchema(source.schemas.output, 'output', source.target.outputSchema)
}

/** @internal Validate the closed stored export without resolving schemas or recomputing its digest. */
export function assertSerializedHarnessTargetExport(
	address: HarnessTargetAddress,
	value: unknown,
): asserts value is SerializedHarnessTargetExportV1 {
	assertPlainDataObject(
		address,
		['serviceName', 'serviceVersion', 'serviceTarget'],
		['serviceName', 'serviceVersion', 'serviceTarget'],
		'remote Harness target address',
	)
	for (const [field, value] of Object.entries(address)) {
		if (typeof value !== 'string' || value.trim() === '') {
			throw new TypeError(`Remote Harness target address ${field} must be non-empty.`)
		}
	}
	const target = value as Record<string, unknown>
	assertPlainDataObject(
		target,
		[
			'targetName',
			'kind',
			'description',
			'inputSchema',
			'validatedInputSchema',
			'outputSchema',
			'updateSchema',
			'interruptSchema',
			'invocation',
			'stream',
			'queue',
			'exportDigest',
		],
		[
			'targetName',
			'kind',
			'inputSchema',
			'validatedInputSchema',
			'outputSchema',
			'updateSchema',
			'interruptSchema',
			'invocation',
			'stream',
			'exportDigest',
		],
		'remote Harness target export',
	)
	if (target.targetName !== address.serviceTarget) {
		throw new TypeError('Remote Harness target name does not match its EventBridge address.')
	}
	if (target.kind !== 'agent' && target.kind !== 'workflow') throw new TypeError('Invalid remote Harness target kind.')
	if (
		target.description !== undefined &&
		(typeof target.description !== 'string' || target.description.trim() === '')
	) {
		throw new TypeError('Invalid remote Harness target description.')
	}
	for (const key of ['inputSchema', 'validatedInputSchema', 'outputSchema', 'updateSchema', 'interruptSchema'])
		assertJsonSchema(target[key], key)
	const invocation = target.invocation as Record<string, unknown> | undefined
	if (!invocation) throw new TypeError('Invalid remote Harness target invocation contract.')
	assertPlainDataObject(
		invocation,
		['aggregate', 'stream', 'resumableInterrupts'],
		['aggregate', 'stream', 'resumableInterrupts'],
		'remote Harness invocation contract',
	)
	if (invocation?.aggregate !== true || invocation.stream !== true || !Array.isArray(invocation.resumableInterrupts)) {
		throw new TypeError('Invalid remote Harness target invocation contract.')
	}
	assertPlainDataArray(invocation.resumableInterrupts, 'remote Harness target interruption contract')
	if (new Set(invocation.resumableInterrupts).size !== invocation.resumableInterrupts.length)
		throw new TypeError('Duplicate remote Harness interruption kind.')
	if (!invocation.resumableInterrupts.every(value => value === 'tool-approval' || value === 'external-wait')) {
		throw new TypeError('Invalid remote Harness target interruption contract.')
	}
	const stream = target.stream as Record<string, unknown> | undefined
	if (!stream) throw new TypeError('Invalid remote Harness target stream protocol.')
	assertPlainDataObject(
		stream,
		['protocol', 'eventTypes', 'outputUpdates'],
		['protocol', 'eventTypes', 'outputUpdates'],
		'remote Harness stream contract',
	)
	if (!Array.isArray(stream.eventTypes)) throw new TypeError('Invalid remote Harness target stream protocol.')
	assertPlainDataArray(stream.eventTypes, 'remote Harness event-type contract')
	if (
		stream?.protocol !== 'harness-execution-events-v1' ||
		!sameStringArray(stream.eventTypes, harnessExecutionEventTypesV1)
	) {
		throw new TypeError('Invalid remote Harness target stream protocol.')
	}
	if (!Array.isArray(stream.outputUpdates) || stream.outputUpdates.length > 1) {
		throw new TypeError('Invalid remote Harness target output-update contract.')
	}
	assertPlainDataArray(stream.outputUpdates, 'remote Harness output-update contract')
	if (!stream.outputUpdates.every(value => value === 'text-delta' || value === 'object-snapshot')) {
		throw new TypeError('Invalid remote Harness target output-update contract.')
	}
	const expectedUpdateSchema =
		stream.outputUpdates.length === 0 ? false : stream.outputUpdates[0] === 'text-delta' ? { type: 'string' } : true
	if (canonicalHarnessJson(target.updateSchema) !== canonicalHarnessJson(expectedUpdateSchema)) {
		throw new TypeError('Remote Harness target update schema does not match its output-update modes.')
	}
	const expectedInterruptSchema = createHarnessInterruptSchema(
		invocation.resumableInterrupts as readonly HarnessInterruptKind[],
	)
	if (canonicalHarnessJson(target.interruptSchema) !== canonicalHarnessJson(expectedInterruptSchema)) {
		throw new TypeError('Remote Harness target interrupt schema does not match its resumable interrupts.')
	}
	if (typeof target.exportDigest !== 'string' || !/^sha256:[0-9a-f]{64}$/.test(target.exportDigest)) {
		throw new TypeError('Invalid remote Harness target export digest.')
	}
	if (Object.hasOwn(target, 'queue')) {
		if (typeof target.queue !== 'object' || target.queue === null || Array.isArray(target.queue)) {
			throw new TypeError('Invalid remote Harness target queue contract.')
		}
		assertPlainDataObject(target.queue, ['name'], ['name'], 'remote Harness queue contract')
		if (
			typeof (target.queue as { name?: unknown }).name !== 'string' ||
			(target.queue as { name: string }).name.trim() === ''
		) {
			throw new TypeError('Invalid remote Harness target queue contract.')
		}
	}
}

function assertGeneratedSchema(value: unknown, label: string, declared: unknown): void {
	const projection = typeof value === 'object' && value !== null ? generatedSchemas.get(value) : undefined
	if (projection === undefined) throw new TypeError(`Remote Harness target ${label} witness is not authentic.`)
	if (canonicalHarnessJson(projection) !== canonicalHarnessJson(declared)) {
		throw new TypeError(`Remote Harness target ${label} schema does not match its generated witness.`)
	}
}

function assertJsonSchema(value: unknown, label: string): void {
	if (typeof value !== 'boolean' && (typeof value !== 'object' || value === null || Array.isArray(value))) {
		throw new TypeError(`Remote Harness target ${label} schema is invalid.`)
	}
	canonicalHarnessJson(value)
}

function sameStringArray(value: unknown, expected: readonly string[]): boolean {
	return (
		Array.isArray(value) && value.length === expected.length && value.every((entry, index) => entry === expected[index])
	)
}

function ownEnumerableEntries(value: object): [string, unknown][] {
	return Object.keys(value).map(key => {
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		if (descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')) {
			throw new TypeError('Generated Harness schemas must contain enumerable data properties only.')
		}
		return [key, descriptor.value]
	})
}

/** RFC 8785 canonical JSON used by Harness transport drift and equality checks. */
export function canonicalHarnessJson(value: unknown, seen = new Set<object>()): string {
	if (value === null || typeof value === 'boolean') return JSON.stringify(value)
	if (typeof value === 'string') {
		assertScalarString(value)
		return JSON.stringify(value)
	}
	if (typeof value === 'number') {
		if (!Number.isFinite(value)) throw new TypeError('Canonical Harness contract values must be finite JSON numbers.')
		return JSON.stringify(value)
	}
	if (typeof value !== 'object') throw new TypeError('Canonical Harness contract values must be JSON.')
	if (seen.has(value)) throw new TypeError('Canonical Harness contract values must not be cyclic.')
	if (Object.getOwnPropertySymbols(value).length > 0) {
		throw new TypeError('Canonical Harness contract values must not contain symbol properties.')
	}
	seen.add(value)
	try {
		if (Array.isArray(value)) {
			assertPlainDataArray(value, 'canonical Harness contract')
			if (Object.getPrototypeOf(value) !== Array.prototype) {
				throw new TypeError('Canonical Harness contract arrays must use the built-in array prototype.')
			}
			const keys = Object.keys(value)
			if (keys.length !== value.length || keys.some((key, index) => key !== String(index))) {
				throw new TypeError('Canonical Harness contract arrays must be dense and property-free.')
			}
			return `[${value.map(entry => canonicalHarnessJson(entry, seen)).join(',')}]`
		}
		const prototype = Object.getPrototypeOf(value)
		if (prototype !== Object.prototype && prototype !== null) {
			throw new TypeError('Canonical Harness contract objects must be plain JSON objects.')
		}
		for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(value))) {
			if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
				throw new TypeError('Canonical Harness contract objects must contain enumerable data properties only.')
			}
		}
		return `{${Object.keys(value)
			.sort()
			.map(key => {
				assertScalarString(key)
				return `${JSON.stringify(key)}:${canonicalHarnessJson((value as Record<string, unknown>)[key], seen)}`
			})
			.join(',')}}`
	} finally {
		seen.delete(value)
	}
}

function assertExactKeys(value: object, allowed: readonly string[], label: string): void {
	const allowedKeys = new Set(allowed)
	for (const key of Reflect.ownKeys(value)) {
		if (typeof key !== 'string' || !allowedKeys.has(key)) throw new TypeError(`Unknown ${label} field.`)
	}
}

function assertRequiredKeys(value: object, required: readonly string[], label: string): void {
	if (required.some(key => !Object.hasOwn(value, key))) throw new TypeError(`Missing ${label} field.`)
}

function assertPlainDataObject(
	value: unknown,
	allowed: readonly string[],
	required: readonly string[],
	label: string,
): asserts value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new TypeError(`Invalid ${label}.`)
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) throw new TypeError(`Invalid ${label} prototype.`)
	assertExactKeys(value, allowed, label)
	assertRequiredKeys(value, required, label)
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		if (descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')) {
			throw new TypeError(`Invalid ${label} property descriptor.`)
		}
	}
}

function assertPlainDataArray(value: readonly unknown[], label: string): void {
	if (
		Object.getPrototypeOf(value) !== Array.prototype ||
		Reflect.ownKeys(value).some(key => {
			if (key === 'length') return false
			if (typeof key !== 'string' || !/^(0|[1-9]\d*)$/.test(key)) return true
			const descriptor = Object.getOwnPropertyDescriptor(value, key)
			return descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')
		}) ||
		Object.keys(value).length !== value.length
	)
		throw new TypeError(`Invalid ${label} array.`)
}

function assertScalarString(value: string): void {
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index)
		if (code >= 0xd800 && code <= 0xdbff) {
			const next = value.charCodeAt(index + 1)
			if (!(next >= 0xdc00 && next <= 0xdfff)) throw new TypeError('Canonical Harness JSON contains invalid Unicode.')
			index += 1
		} else if (code >= 0xdc00 && code <= 0xdfff) {
			throw new TypeError('Canonical Harness JSON contains invalid Unicode.')
		}
	}
}
