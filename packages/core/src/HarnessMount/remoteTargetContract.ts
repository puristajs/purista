import { createHash } from 'node:crypto'

import {
	type HarnessInterruptKind,
	type HarnessOutputUpdateKind,
	type HarnessTargetContract,
	type HarnessTargetKind,
	harnessExecutionEventTypesV1,
	type JsonValue,
	type ModelSchema,
} from '@purista/harness'

const remoteContracts = new WeakSet<object>()
declare const remoteHarnessTargetContractBrand: unique symbol

/** Exact EventBridge address carried by a generated Harness target contract. */
export type HarnessTargetAddress = Readonly<{
	serviceName: string
	serviceVersion: string
	serviceTarget: string
}>

/** JSON Schema augmented by generated code with its exact Standard Schema types. */
export type GeneratedHarnessSchema<Input extends JsonValue, Output extends JsonValue> = ModelSchema<Input, Output>

/** Optional native queue metadata carried by one exported Harness target. */
export type HarnessTargetQueueExport = Readonly<{ name: string }>

/** Closed root export consumed by the generated-contract hydration boundary. */
export type HarnessTargetExport<
	Kind extends HarnessTargetKind,
	Name extends string,
	InputSchema extends ModelSchema,
	OutputSchema extends ModelSchema,
	Updates extends readonly HarnessOutputUpdateKind[],
	Interrupts extends readonly HarnessInterruptKind[],
	Queue extends HarnessTargetQueueExport | undefined = undefined,
> = Readonly<{
	targetName: Name
	kind: Kind
	description?: string
	inputSchema: InputSchema
	validatedInputSchema: object | boolean
	outputSchema: OutputSchema
	updateSchema: object | boolean
	interruptSchema: object | boolean
	invocation: Readonly<{
		aggregate: true
		stream: true
		resumableInterrupts: Interrupts
	}>
	stream: Readonly<{
		protocol: 'harness-execution-events-v1'
		eventTypes: typeof harnessExecutionEventTypesV1
		outputUpdates: Updates
	}>
}> &
	(Queue extends HarnessTargetQueueExport ? Readonly<{ queue: Queue }> : Readonly<{ queue?: never }>)

/** Serialized generated-contract input before its digest is checked. */
export type RemoteHarnessTargetContractSource<
	Kind extends HarnessTargetKind,
	Name extends string,
	InputSchema extends ModelSchema,
	OutputSchema extends ModelSchema,
	Updates extends readonly HarnessOutputUpdateKind[],
	Interrupts extends readonly HarnessInterruptKind[],
	Address extends HarnessTargetAddress,
	Queue extends HarnessTargetQueueExport | undefined = undefined,
> = Readonly<{
	schemaVersion: 1
	address: Address
	target: HarnessTargetExport<Kind, Name, InputSchema, OutputSchema, Updates, Interrupts, Queue>
}>

type UpdateMode<Updates extends readonly HarnessOutputUpdateKind[]> = Updates extends readonly []
	? 'none'
	: Updates extends readonly [infer Update extends Exclude<HarnessOutputUpdateKind, 'none'>]
		? Update
		: never

type HydratedHarnessTargetContract<
	Kind extends HarnessTargetKind,
	Name extends string,
	InputSchema extends ModelSchema,
	OutputSchema extends ModelSchema,
	Updates extends readonly HarnessOutputUpdateKind[],
	Interrupts extends readonly HarnessInterruptKind[],
	Queue extends HarnessTargetQueueExport | undefined,
> = HarnessTargetContract<Kind, Name, InputSchema, OutputSchema, UpdateMode<Updates>, Interrupts> &
	(Queue extends HarnessTargetQueueExport ? Readonly<{ queue: Queue }> : Readonly<{ queue?: never }>)

/** Addressed refinement of the sole Harness-owned target contract. */
export type RemoteHarnessTargetContract<
	Contract extends HarnessTargetContract<
		HarnessTargetKind,
		string,
		ModelSchema,
		ModelSchema,
		HarnessOutputUpdateKind,
		readonly HarnessInterruptKind[]
	>,
	Address extends HarnessTargetAddress,
> = Contract &
	Readonly<{
		address: Address
		exportDigest: `sha256:${string}`
		readonly [remoteHarnessTargetContractBrand]: true
	}>

/** Compute the drift-detection digest for one complete addressed root export. */
export function computeHarnessTargetExportDigest(
	source: Readonly<{
		address: HarnessTargetAddress
		target: object
	}>,
): `sha256:${string}` {
	const target = ownEnumerableEntries(source.target)
		.filter(([key]) => key !== 'exportDigest')
		.map(([key, value]) => [key, generatedJsonProjection(value)] as const)
	const addressedTargetExport = Object.freeze({
		address: generatedJsonProjection(source.address),
		target: Object.fromEntries(target),
	})
	return `sha256:${createHash('sha256')
		.update(canonicalHarnessJson(['purista.harness-target-export.v1', addressedTargetExport]))
		.digest('hex')}`
}

/**
 * Hydrate one generated, builder-free Harness target contract.
 *
 * The brand is process-local drift evidence. It never grants transport access;
 * a dispatcher still requires an explicit immutable route binding.
 */
export function createRemoteHarnessTargetContract<
	const Kind extends HarnessTargetKind,
	const Name extends string,
	const InputSchema extends ModelSchema,
	const OutputSchema extends ModelSchema,
	const Updates extends readonly HarnessOutputUpdateKind[],
	const Interrupts extends readonly HarnessInterruptKind[],
	const Address extends HarnessTargetAddress,
	const Queue extends HarnessTargetQueueExport | undefined = undefined,
>(
	source: Readonly<{
		schemaVersion: 1
		address: Address
		target: HarnessTargetExport<Kind, Name, InputSchema, OutputSchema, Updates, Interrupts, Queue> &
			Readonly<{ exportDigest: `sha256:${string}` }>
	}>,
): RemoteHarnessTargetContract<
	HydratedHarnessTargetContract<Kind, Name, InputSchema, OutputSchema, Updates, Interrupts, Queue>,
	Address
> {
	assertHydrationSource(source)
	const expectedDigest = computeHarnessTargetExportDigest(source)
	if (source.target.exportDigest !== expectedDigest) {
		throw new TypeError('Remote Harness target export digest does not match its addressed contract.')
	}

	const updates = source.target.stream.outputUpdates.length === 0 ? 'none' : source.target.stream.outputUpdates[0]
	const address = Object.freeze({ ...source.address }) as Address
	const interrupts = Object.freeze([...source.target.invocation.resumableInterrupts]) as unknown as Interrupts
	const contract = {
		kind: source.target.kind,
		id: source.target.targetName,
		...(source.target.description === undefined ? {} : { description: source.target.description }),
		input: source.target.inputSchema,
		output: source.target.outputSchema,
		executionModes: Object.freeze(['run', 'stream'] as const),
		updates,
		interrupts,
		...(source.target.queue === undefined ? {} : { queue: Object.freeze({ ...source.target.queue }) }),
		address,
		exportDigest: source.target.exportDigest,
	}
	Object.defineProperty(contract, '$infer', {
		value: Object.freeze({}),
		enumerable: false,
		writable: false,
		configurable: false,
	})
	Object.freeze(contract)
	remoteContracts.add(contract)
	return contract as unknown as RemoteHarnessTargetContract<
		HydratedHarnessTargetContract<Kind, Name, InputSchema, OutputSchema, Updates, Interrupts, Queue>,
		Address
	>
}

/** Return whether a value retains this module's private hydration identity. */
export function isRemoteHarnessTargetContract(
	value: unknown,
): value is RemoteHarnessTargetContract<
	HarnessTargetContract<
		HarnessTargetKind,
		string,
		ModelSchema,
		ModelSchema,
		HarnessOutputUpdateKind,
		readonly HarnessInterruptKind[]
	>,
	HarnessTargetAddress
> {
	return typeof value === 'object' && value !== null && remoteContracts.has(value)
}

function assertHydrationSource(
	source: Readonly<{ schemaVersion: 1; address: HarnessTargetAddress; target: object }>,
): void {
	assertPlainDataObject(
		source,
		['schemaVersion', 'address', 'target'],
		['schemaVersion', 'address', 'target'],
		'remote Harness target source',
	)
	if (source.schemaVersion !== 1) throw new TypeError('Unsupported remote Harness target schema version.')
	assertPlainDataObject(
		source.address,
		['serviceName', 'serviceVersion', 'serviceTarget'],
		['serviceName', 'serviceVersion', 'serviceTarget'],
		'remote Harness target address',
	)
	for (const [field, value] of Object.entries(source.address)) {
		if (typeof value !== 'string' || value.trim() === '') {
			throw new TypeError(`Remote Harness target address ${field} must be non-empty.`)
		}
	}
	const target = source.target as Record<string, unknown>
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
	if (target.targetName !== source.address.serviceTarget) {
		throw new TypeError('Remote Harness target name does not match its EventBridge address.')
	}
	if (target.kind !== 'agent' && target.kind !== 'workflow') throw new TypeError('Invalid remote Harness target kind.')
	if (
		target.description !== undefined &&
		(typeof target.description !== 'string' || target.description.trim() === '')
	) {
		throw new TypeError('Invalid remote Harness target description.')
	}
	assertGeneratedSchema(target.inputSchema, 'input', 'input', target.inputSchema)
	assertGeneratedSchema(target.inputSchema, 'input', 'output', target.validatedInputSchema)
	assertGeneratedSchema(target.outputSchema, 'output', 'output', target.outputSchema)
	assertJsonSchema(target.validatedInputSchema, 'validated input')
	assertJsonSchema(target.updateSchema, 'update')
	assertJsonSchema(target.interruptSchema, 'interrupt')
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
	if ((stream.outputUpdates.length === 0) !== (target.updateSchema === false)) {
		throw new TypeError('Remote Harness target update schema does not match its output-update modes.')
	}
	if ((invocation.resumableInterrupts.length === 0) !== (target.interruptSchema === false)) {
		throw new TypeError('Remote Harness target interrupt schema does not match its resumable interrupts.')
	}
	if (typeof target.exportDigest !== 'string' || !/^sha256:[0-9a-f]{64}$/.test(target.exportDigest)) {
		throw new TypeError('Invalid remote Harness target export digest.')
	}
	if (target.queue !== undefined) {
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

function assertGeneratedSchema(
	value: unknown,
	label: string,
	direction: 'input' | 'output',
	declared: unknown,
): asserts value is ModelSchema {
	if (typeof value !== 'object' || value === null || !Object.hasOwn(value, '~standard')) {
		throw new TypeError(`Remote Harness target ${label} schema is not generated.`)
	}
	canonicalHarnessJson(generatedJsonProjection(value))
	const standardDescriptor = Object.getOwnPropertyDescriptor(value, '~standard')
	if (!standardDescriptor || !Object.hasOwn(standardDescriptor, 'value')) {
		throw new TypeError(`Remote Harness target ${label} schema is not generated.`)
	}
	const standard = standardDescriptor.value
	if (typeof standard !== 'object' || standard === null) {
		throw new TypeError(`Remote Harness target ${label} schema is not generated.`)
	}
	const version = ownDataValue(standard, 'version')
	const vendor = ownDataValue(standard, 'vendor')
	const validate = ownDataValue(standard, 'validate')
	const jsonSchema = ownDataValue(standard, 'jsonSchema')
	const projection =
		typeof jsonSchema === 'object' && jsonSchema !== null ? ownDataValue(jsonSchema, direction) : undefined
	if (
		version !== 1 ||
		typeof vendor !== 'string' ||
		typeof validate !== 'function' ||
		typeof projection !== 'function'
	) {
		throw new TypeError(`Remote Harness target ${label} schema is not generated.`)
	}
	let projected: unknown
	try {
		projected = projection.call(jsonSchema, { target: 'draft-2020-12' })
	} catch {
		throw new TypeError(`Remote Harness target ${label} schema projection failed.`)
	}
	if (canonicalHarnessJson(projected) !== canonicalHarnessJson(generatedJsonProjection(declared))) {
		throw new TypeError(`Remote Harness target ${label} schema does not match its generated projection.`)
	}
}

function ownDataValue(value: object, key: PropertyKey): unknown {
	const descriptor = Object.getOwnPropertyDescriptor(value, key)
	return descriptor && Object.hasOwn(descriptor, 'value') ? descriptor.value : undefined
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

function generatedJsonProjection(value: unknown, seen = new Map<object, unknown>()): unknown {
	if (typeof value !== 'object' || value === null) return value
	const known = seen.get(value)
	if (known !== undefined) return known
	if (Array.isArray(value)) {
		assertPlainDataArray(value, 'generated Harness schema')
		const result: unknown[] = []
		seen.set(value, result)
		for (let index = 0; index < value.length; index += 1) {
			result.push(generatedJsonProjection(Object.getOwnPropertyDescriptor(value, String(index))?.value, seen))
		}
		return result
	}
	const result: Record<string, unknown> = Object.create(null)
	seen.set(value, result)
	for (const key of Reflect.ownKeys(value)) {
		if (key === '~standard') continue
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		if (typeof key !== 'string' || descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')) {
			throw new TypeError('Generated Harness schemas must contain enumerable data properties only.')
		}
	}
	for (const [key, entry] of ownEnumerableEntries(value)) result[key] = generatedJsonProjection(entry, seen)
	return result
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
