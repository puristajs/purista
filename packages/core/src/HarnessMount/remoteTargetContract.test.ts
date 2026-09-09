import {
	type HarnessInterruptKind,
	type HarnessTargetInferenceFor,
	type HarnessTargetInput,
	type HarnessTargetOutput,
	type HarnessValidatedTargetInput,
	harnessExecutionEventTypesV1,
	type JsonValue,
} from '@purista/harness'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { createHarnessInterruptSchema } from './interruptSchema.js'
import {
	canonicalHarnessJson,
	computeHarnessTargetExportDigest,
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
	isRemoteHarnessTargetContract,
	requireRemoteHarnessTargetContract,
} from './remoteTargetContract.js'

type Wire = { raw: string }
type Validated = { normalized: number }
type Output = { accepted: boolean }

function sourceForInterrupts<const Interrupts extends readonly HarnessInterruptKind[]>(interrupts: Interrupts) {
	const address = { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'support' } as const
	const target = {
		targetName: 'support',
		kind: 'agent',
		inputSchema: {
			type: 'object',
			properties: { raw: { type: 'string' } },
			required: ['raw'],
			additionalProperties: false,
		},
		validatedInputSchema: {
			type: 'object',
			properties: { normalized: { type: 'number' } },
			required: ['normalized'],
			additionalProperties: false,
		},
		outputSchema: {
			type: 'object',
			properties: { accepted: { type: 'boolean' } },
			required: ['accepted'],
			additionalProperties: false,
		},
		updateSchema: true,
		interruptSchema: createHarnessInterruptSchema(interrupts),
		invocation: { aggregate: true, stream: true, resumableInterrupts: interrupts },
		stream: {
			protocol: 'harness-execution-events-v1',
			eventTypes: harnessExecutionEventTypesV1,
			outputUpdates: ['object-snapshot'],
		},
	} as const
	return {
		schemaVersion: 1 as const,
		address,
		target: { ...target, exportDigest: computeHarnessTargetExportDigest({ address, target }) },
		schemas: {
			input: createGeneratedHarnessSchema<Wire>(target.inputSchema),
			validatedInput: createGeneratedHarnessSchema<Validated>(target.validatedInputSchema),
			output: createGeneratedHarnessSchema<Output>(target.outputSchema),
		},
	}
}

function source() {
	return sourceForInterrupts(['tool-approval'] as const)
}

function queuedSource() {
	const base = source()
	const target = { ...base.target, queue: { name: 'support-jobs' } as const }
	return { ...base, target: { ...target, exportDigest: computeHarnessTargetExportDigest({ ...base, target }) } }
}

describe('generated validation-only schema witnesses', () => {
	it('clones and freezes both identical projections and preserves accepted input identity', async () => {
		const json = {
			type: 'object',
			properties: { value: { type: 'number', default: 1 } },
			required: ['value'],
			additionalProperties: false,
		}
		const schema = createGeneratedHarnessSchema<{ value: number }>(json)
		const standard = schema['~standard']
		const input = standard.jsonSchema.input({ target: 'draft-2020-12' })
		expect(input).toBe(standard.jsonSchema.output({ target: 'draft-2020-12' }))
		expect(input).not.toBe(json)
		expect(Object.isFrozen(input)).toBe(true)
		expect(Object.isFrozen((input as typeof json).properties.value)).toBe(true)
		json.properties.value.type = 'string'
		const value = { value: 2 }
		expect(await standard.validate(value)).toEqual({ value })
		const accepted = await standard.validate(value)
		if (accepted.issues) throw new Error('Expected accepted value')
		expect(accepted.value).toBe(value)
		for (const invalid of [{}, { value: '2' }, { value: 2, extra: true }, { value: Number.NaN }, new Date()]) {
			expect((await standard.validate(invalid)).issues).toBeDefined()
		}
	})

	it('supports boolean schemas and rejects executable, accessor, and malformed JSON', async () => {
		expect(await createGeneratedHarnessSchema<JsonValue>(true)['~standard'].validate(null)).toEqual({ value: null })
		expect((await createGeneratedHarnessSchema<never>(false)['~standard'].validate(null)).issues).toBeDefined()
		const getter = vi.fn(() => 'string')
		const malicious = Object.defineProperty({}, 'type', { get: getter, enumerable: true })
		expect(() => createGeneratedHarnessSchema(malicious)).toThrow()
		expect(getter).not.toHaveBeenCalled()
		expect(() => createGeneratedHarnessSchema({ type: 'invalid' })).toThrow()
	})
})

describe('remote Harness target contracts', () => {
	it('derives exact asymmetric inference from three witnesses for queued and unqueued overloads', () => {
		const unqueued = createRemoteHarnessTargetContract(source())
		const queued = createRemoteHarnessTargetContract(queuedSource())
		expectTypeOf<HarnessTargetInput<typeof unqueued>>().toEqualTypeOf<Wire & JsonValue>()
		expectTypeOf<HarnessValidatedTargetInput<typeof unqueued>>().toEqualTypeOf<Validated & JsonValue>()
		expectTypeOf<HarnessTargetOutput<typeof unqueued>>().toEqualTypeOf<Output & JsonValue>()
		expectTypeOf(unqueued.$infer).toEqualTypeOf<
			HarnessTargetInferenceFor<
				Wire & JsonValue,
				Validated & JsonValue,
				Output & JsonValue,
				'object-snapshot',
				readonly ['tool-approval']
			>
		>()
		expectTypeOf(queued.$infer).toEqualTypeOf<typeof unqueued.$infer>()
		expectTypeOf(queued.queue.name).toEqualTypeOf<'support-jobs'>()
		expect(unqueued).not.toHaveProperty('queue')
		expect(queued.queue).toEqual({ name: 'support-jobs' })
		expect(Object.isFrozen(queued.queue)).toBe(true)
		expect(Object.isFrozen(queued)).toBe(true)
		expect(Object.isFrozen(queued.$infer)).toBe(true)
		expect(Object.keys(queued)).not.toContain('$infer')
		expect(requireRemoteHarnessTargetContract(queued).queueName).toBe('support-jobs')
		expect(requireRemoteHarnessTargetContract(unqueued).queueName).toBeNull()
	})

	it('rejects spread, structural and reflected copies nominally and at runtime', () => {
		const contract = createRemoteHarnessTargetContract(queuedSource())
		const spread = { ...contract }
		const reflected: unknown = Object.create(
			Object.getPrototypeOf(contract),
			Object.getOwnPropertyDescriptors(contract),
		)
		const requireExact = (_value: typeof contract) => undefined
		// biome-ignore lint/correctness/noConstantCondition: TypeScript-only rejection proofs must not execute.
		if (false) {
			// @ts-expect-error A spread cannot retain the private nominal class field.
			requireExact(spread)
			// @ts-expect-error A queue-shaped value has no target authenticity.
			requireExact({ queue: { name: 'support-jobs' } })
		}
		for (const candidate of [spread, reflected, { queue: contract.queue }, null]) {
			expect(isRemoteHarnessTargetContract(candidate)).toBe(false)
			expect(() => requireRemoteHarnessTargetContract(candidate)).toThrow('authentic')
		}
		expect(isRemoteHarnessTargetContract(contract)).toBe(true)
	})

	it.each(['input', 'validatedInput', 'output'] as const)(
		'rejects non-factory and mismatched %s witnesses without executing user functions',
		key => {
			const base = source()
			const execute = vi.fn(() => {
				throw new Error('executed')
			})
			const forged = {
				'~standard': {
					version: 1,
					vendor: 'purista-generated',
					validate: execute,
					jsonSchema: { input: execute, output: execute },
				},
			}
			for (const witness of [
				forged,
				{ ...base.schemas[key] },
				Object.create(Object.getPrototypeOf(base.schemas[key]), Object.getOwnPropertyDescriptors(base.schemas[key])),
			]) {
				expect(() =>
					createRemoteHarnessTargetContract({ ...base, schemas: { ...base.schemas, [key]: witness } } as never),
				).toThrow('authentic')
			}
			expect(execute).not.toHaveBeenCalled()
			const mismatch = createGeneratedHarnessSchema<number>({ type: 'number' })
			expect(() =>
				createRemoteHarnessTargetContract({ ...base, schemas: { ...base.schemas, [key]: mismatch } }),
			).toThrow('does not match')
		},
	)

	it('rejects stale digest, address, schemas, queue presence and queue name before granting capability', () => {
		const base = queuedSource()
		const { queue: _queue, ...withoutQueue } = base.target
		const candidates = [
			{ ...base, target: { ...base.target, exportDigest: 'sha256:invalid' } },
			{ ...base, target: { ...base.target, exportDigest: `sha256:${'0'.repeat(64)}` } },
			{ ...base, address: { ...base.address, serviceVersion: '2' } },
			{ ...base, address: { ...base.address, serviceTarget: 'other' } },
			{ ...base, target: { ...base.target, inputSchema: { type: 'number' } } },
			{ ...base, target: withoutQueue },
			{ ...base, target: { ...base.target, queue: { name: 'other-jobs' } } },
			{ ...source(), target: { ...source().target, queue: { name: 'injected-jobs' } } },
		]
		for (const candidate of candidates) expect(() => createRemoteHarnessTargetContract(candidate as never)).toThrow()
	})

	it('rejects malformed closed exports even when their digest is recomputed', () => {
		const base = source()
		for (const target of [
			{ ...base.target, unexpected: true },
			{ ...base.target, queue: { name: '' } },
			{ ...base.target, queue: undefined },
			{ ...base.target, kind: 'tool' },
			{ ...base.target, updateSchema: false },
			{ ...base.target, updateSchema: { type: 'string' } },
			{ ...base.target, interruptSchema: false },
			{ ...base.target, stream: { ...base.target.stream, outputUpdates: ['none'] } },
			{
				...base.target,
				invocation: { ...base.target.invocation, resumableInterrupts: ['tool-approval', 'tool-approval'] },
			},
		]) {
			expect(() =>
				createRemoteHarnessTargetContract({
					...base,
					target: { ...target, exportDigest: computeHarnessTargetExportDigest({ ...base, target }) },
				} as never),
			).toThrow()
		}
	})

	it.each([
		['tool approval', ['tool-approval']],
		['external wait', ['external-wait']],
		['the tool approval and external wait union', ['tool-approval', 'external-wait']],
	] as const)('accepts the canonical interrupt schema for %s', (_label, interrupts) => {
		const contract = createRemoteHarnessTargetContract(sourceForInterrupts(interrupts))
		expect(contract.interrupts).toEqual(interrupts)
	})

	it('rejects non-canonical and variant-mismatched interrupt schemas with a recomputed digest', () => {
		const toolApproval = sourceForInterrupts(['tool-approval'] as const)
		const externalWait = sourceForInterrupts(['external-wait'] as const)
		const combined = sourceForInterrupts(['tool-approval', 'external-wait'] as const)
		const reversedCombinedSchema = sourceForInterrupts(['external-wait', 'tool-approval'] as const).target
			.interruptSchema
		const cases = [
			{ source: toolApproval, interruptSchema: { type: 'string' } },
			{ source: toolApproval, interruptSchema: externalWait.target.interruptSchema },
			{ source: externalWait, interruptSchema: toolApproval.target.interruptSchema },
			{ source: combined, interruptSchema: toolApproval.target.interruptSchema },
			{ source: combined, interruptSchema: reversedCombinedSchema },
		]
		for (const testCase of cases) {
			const target = { ...testCase.source.target, interruptSchema: testCase.interruptSchema }
			expect(() =>
				createRemoteHarnessTargetContract({
					...testCase.source,
					target: {
						...target,
						exportDigest: computeHarnessTargetExportDigest({ address: testCase.source.address, target }),
					},
				} as never),
			).toThrow('interrupt schema does not match')
		}
	})

	it('rejects accessors before any source, array or witness getter executes', () => {
		const base = source()
		const getter = vi.fn(() => base.target)
		const hostile = Object.defineProperty({ ...base }, 'target', { get: getter, enumerable: true })
		expect(() => createRemoteHarnessTargetContract(hostile)).toThrow('descriptor')
		const array = ['object-snapshot']
		Object.defineProperty(array, '0', { get: getter, enumerable: true })
		expect(() => canonicalHarnessJson(array)).toThrow()
		expect(getter).not.toHaveBeenCalled()
	})

	it('clones address and raw metadata without freezing caller-owned data', () => {
		const base = source()
		const contract = createRemoteHarnessTargetContract(base)
		expect(contract.address).not.toBe(base.address)
		expect(contract.interrupts).not.toBe(base.target.invocation.resumableInterrupts)
		expect(Object.isFrozen(base.address)).toBe(false)
		expect(Object.isFrozen(contract.address)).toBe(true)
		expect(Object.isFrozen(requireRemoteHarnessTargetContract(contract).targetExport)).toBe(true)
	})

	it('preserves none/empty tuples and rejects incompatible inference and source declarations in TypeScript', () => {
		const base = source()
		const target = {
			...base.target,
			updateSchema: false,
			interruptSchema: false,
			stream: { ...base.target.stream, outputUpdates: [] },
			invocation: { ...base.target.invocation, resumableInterrupts: [] },
		} as const
		const contract = createRemoteHarnessTargetContract({
			...base,
			target: { ...target, exportDigest: computeHarnessTargetExportDigest({ ...base, target }) },
		})
		expectTypeOf(contract.$infer.update).toEqualTypeOf<never>()
		expectTypeOf(contract.$infer.interrupt).toEqualTypeOf<never>()
		// biome-ignore lint/correctness/noConstantCondition: TypeScript-only rejection proofs must not execute.
		if (false) {
			// @ts-expect-error Address must retain the literal serialized target id.
			createRemoteHarnessTargetContract({ ...base, address: { ...base.address, serviceTarget: 'other' } })
			const invalidUpdates = {
				...base,
				target: { ...base.target, stream: { ...base.target.stream, outputUpdates: ['bad'] } },
			} as const
			// @ts-expect-error The serialized update declaration is a literal supported singleton tuple.
			createRemoteHarnessTargetContract(invalidUpdates)
			const invalidInterrupts = {
				...base,
				target: { ...base.target, invocation: { ...base.target.invocation, resumableInterrupts: ['bad'] } },
			} as const
			// @ts-expect-error Unsupported interrupt tuples fail the source boundary.
			createRemoteHarnessTargetContract(invalidInterrupts)
			const checkInference = (_value: typeof contract.$infer) => undefined
			// @ts-expect-error Update and interruption capabilities are invariant.
			checkInference(createRemoteHarnessTargetContract(base).$infer)
		}
	})

	it('canonicalizes the full addressed export and rejects non-JSON data', () => {
		const base = source()
		expect(
			computeHarnessTargetExportDigest({
				address: base.address,
				target: Object.fromEntries(Object.entries(base.target).reverse()),
			}),
		).toBe(base.target.exportDigest)
		for (const invalid of [
			new Date(),
			new Map(),
			Array(2),
			{ value: Number.NaN },
			{ value: String.fromCharCode(0xd800) },
			{ [Symbol('hidden')]: 1 },
		])
			expect(() => canonicalHarnessJson(invalid)).toThrow()
		expect(canonicalHarnessJson({ z: -0, a: 1e30 })).toBe('{"a":1e+30,"z":0}')
	})
})
