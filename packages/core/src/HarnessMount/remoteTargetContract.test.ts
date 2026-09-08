import { harnessExecutionEventTypesV1, type JsonValue, type ModelSchema } from '@purista/harness'
import { describe, expect, expectTypeOf, it } from 'vitest'

import {
	canonicalHarnessJson,
	computeHarnessTargetExportDigest,
	isRemoteHarnessTargetContract,
} from './remoteTargetContract.js'
import { createRemoteHarnessTargetContract } from './types.js'

describe('remote Harness target contracts', () => {
	it('hydrates and freezes one addressed refinement with exact $infer types', () => {
		const inputSchema = generatedSchema<{ question: string }, { question: string }>({
			type: 'object',
			required: ['question'],
			properties: { question: { type: 'string' } },
		})
		const outputSchema = generatedSchema<{ answer: string }, { answer: string }>({
			type: 'object',
			required: ['answer'],
			properties: { answer: { type: 'string' } },
		})
		const source = exportedTarget(inputSchema, outputSchema)
		const contract = createRemoteHarnessTargetContract({
			...source,
			target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
		})

		expectTypeOf(contract.$infer.input).toMatchTypeOf<{ question: string }>()
		expectTypeOf<{ question: string }>().toMatchTypeOf(contract.$infer.input)
		expectTypeOf(contract.$infer.validatedInput).toMatchTypeOf<{ question: string }>()
		expectTypeOf<{ question: string }>().toMatchTypeOf(contract.$infer.validatedInput)
		expectTypeOf(contract.$infer.output).toMatchTypeOf<{ answer: string }>()
		expectTypeOf<{ answer: string }>().toMatchTypeOf(contract.$infer.output)
		expect(contract).toMatchObject({
			kind: 'agent',
			id: 'support',
			address: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'support' },
		})
		expect(Object.keys(contract)).not.toContain('$infer')
		expect(Object.isFrozen(contract)).toBe(true)
		expect(Object.isFrozen(contract.address)).toBe(true)
		expect(isRemoteHarnessTargetContract(contract)).toBe(true)
	})

	it('uses RFC 8785 key ordering and the complete addressed export for the digest', () => {
		const input = generatedSchema<string, string>({ maxLength: 32, type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		const reordered = {
			target: Object.fromEntries(Object.entries(source.target).reverse()),
			address: Object.fromEntries(Object.entries(source.address).reverse()),
			schemaVersion: 1,
		} as typeof source

		expect(computeHarnessTargetExportDigest(source)).toBe(computeHarnessTargetExportDigest(reordered))
		const changed = {
			...source,
			address: { ...source.address, serviceVersion: '2' },
		}
		expect(computeHarnessTargetExportDigest(changed)).not.toBe(computeHarnessTargetExportDigest(source))
	})

	it('matches RFC 8785 number/string vectors and rejects non-JCS values', () => {
		expect(
			canonicalHarnessJson({
				numbers: [Number('333333333.33333329'), 1e30, 4.5, 0.002, 1e-27],
				string: '€$\u000f\nA\'B"\\\\"/',
				literals: [null, true, false],
			}),
		).toBe(
			'{"literals":[null,true,false],"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27],"string":"€$\\u000f\\nA\'B\\"\\\\\\\\\\"/"}',
		)
		expect(() => canonicalHarnessJson(new Date())).toThrow()
		expect(() => canonicalHarnessJson(new Map())).toThrow()
		expect(() => canonicalHarnessJson(Object.assign(Object.create({}), { value: 1 }))).toThrow()
		const sparse = Array(2)
		sparse[1] = 1
		expect(() => canonicalHarnessJson(sparse)).toThrow()
		expect(() => canonicalHarnessJson({ value: String.fromCharCode(0xd800) })).toThrow()
		const hidden = { value: 1 }
		Object.defineProperty(hidden, 'other', { value: 2 })
		expect(() => canonicalHarnessJson(hidden)).toThrow()
		const symbolic = { value: 1, [Symbol('secret')]: 2 }
		expect(() => canonicalHarnessJson(symbolic)).toThrow()
	})

	it.each([
		['invalid digest', 'sha256:not-a-digest'],
		['mismatched digest', `sha256:${'0'.repeat(64)}`],
	] as const)('rejects %s before returning a branded contract', (_label, exportDigest) => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)

		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				target: { ...source.target, exportDigest },
			}),
		).toThrow()
	})

	it('rejects unhydrated or inconsistent generated values', () => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		const digest = computeHarnessTargetExportDigest(source)

		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				target: { ...source.target, inputSchema: { type: 'string' } as unknown as ModelSchema, exportDigest: digest },
			}),
		).toThrow()
		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				address: { ...source.address, serviceTarget: 'other' },
				target: { ...source.target, exportDigest: digest },
			}),
		).toThrow()
		for (const description of [123, '   ']) {
			const candidate = { ...source, target: { ...source.target, description } }
			expect(() =>
				createRemoteHarnessTargetContract({
					...candidate,
					target: {
						...candidate.target,
						exportDigest: computeHarnessTargetExportDigest(candidate as never),
					},
				} as never),
			).toThrow('description')
		}
	})

	it('rejects asymmetric generated schema projections and unknown fields', () => {
		const input = generatedSchema<{ wire: string }, { value: string }>(
			{ type: 'object', required: ['wire'], properties: { wire: { type: 'string' } } },
			{ type: 'object', required: ['value'], properties: { value: { type: 'string' } } },
		)
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		const digest = computeHarnessTargetExportDigest(source)

		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				target: { ...source.target, validatedInputSchema: { type: 'string' }, exportDigest: digest },
			}),
		).toThrow('does not match')
		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				unexpected: true,
				target: { ...source.target, exportDigest: digest },
			} as never),
		).toThrow('Unknown')
		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				address: { ...source.address, unexpected: true },
				target: { ...source.target, exportDigest: digest },
			} as never),
		).toThrow('Unknown')
		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				target: {
					...source.target,
					invocation: { ...source.target.invocation, unexpected: true },
					exportDigest: digest,
				},
			} as never),
		).toThrow('Unknown')
	})

	it('rejects hostile prototypes and property descriptors before reading contract fields', () => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		const digest = computeHarnessTargetExportDigest(source)

		const hiddenAddress = { ...source.address }
		Object.defineProperty(hiddenAddress, 'serviceName', { value: 'Support', enumerable: false })
		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				address: hiddenAddress,
				target: { ...source.target, exportDigest: digest },
			} as never),
		).toThrow('descriptor')

		const target = { ...source.target, exportDigest: digest }
		Object.defineProperty(target, 'kind', {
			enumerable: true,
			get: () => {
				throw new Error('getter executed')
			},
		})
		expect(() => createRemoteHarnessTargetContract({ ...source, target } as never)).toThrow('descriptor')

		let schemaGetterReads = 0
		const accessorSchema = { type: 'string' }
		Object.defineProperty(accessorSchema, '~standard', {
			get: () => {
				schemaGetterReads += 1
				return input['~standard']
			},
		})
		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				target: { ...source.target, inputSchema: accessorSchema as unknown as ModelSchema, exportDigest: digest },
			}),
		).toThrow('not generated')
		expect(schemaGetterReads).toBe(0)

		const invocation = Object.assign(Object.create({}), source.target.invocation)
		expect(() =>
			createRemoteHarnessTargetContract({
				...source,
				target: { ...source.target, invocation, exportDigest: digest },
			} as never),
		).toThrow('prototype')
	})

	it('preserves asymmetric input inference and exact update/interrupt inference', () => {
		const input = generatedSchema<{ wire: string }, { parsed: number }>(
			{ type: 'object', required: ['wire'], properties: { wire: { type: 'string' } } },
			{ type: 'object', required: ['parsed'], properties: { parsed: { type: 'number' } } },
		)
		const output = generatedSchema<never, { answer: string }>({ type: 'object' })
		const base = exportedTarget(input, output)
		const source = {
			...base,
			target: {
				...base.target,
				updateSchema: { type: 'object' },
				interruptSchema: { type: 'object' },
				invocation: { ...base.target.invocation, resumableInterrupts: ['tool-approval'] as const },
				stream: { ...base.target.stream, outputUpdates: ['object-snapshot'] as const },
			},
		}
		const contract = createRemoteHarnessTargetContract({
			...source,
			target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
		})
		expectTypeOf(contract.$infer.input).toMatchTypeOf<{ wire: string }>()
		expectTypeOf<{ wire: string }>().toMatchTypeOf(contract.$infer.input)
		expectTypeOf(contract.$infer.validatedInput).toMatchTypeOf<{ parsed: number }>()
		expectTypeOf<{ parsed: number }>().toMatchTypeOf(contract.$infer.validatedInput)
		expectTypeOf(contract.$infer.output).toMatchTypeOf<{ answer: string }>()
		expectTypeOf<{ answer: string }>().toMatchTypeOf(contract.$infer.output)
		expectTypeOf(contract.updates).toEqualTypeOf<'object-snapshot'>()
		expectTypeOf(contract.interrupts).toEqualTypeOf<readonly ['tool-approval']>()
	})

	it('rejects update and interrupt schema presence inconsistent with advertised modes', () => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		for (const target of [
			{ ...source.target, updateSchema: false },
			{ ...source.target, interruptSchema: { type: 'object' } },
		]) {
			const candidate = { ...source, target }
			expect(() =>
				createRemoteHarnessTargetContract({
					...candidate,
					target: { ...target, exportDigest: computeHarnessTargetExportDigest(candidate) },
				}),
			).toThrow('does not match')
		}
	})

	it('accepts boolean JSON Schemas at generated validated-input, update, and interrupt boundaries', () => {
		const input = generatedSchema<string, string>({ type: 'string' }, true)
		const output = generatedSchema<string, string>({ type: 'string' })
		const base = exportedTarget(input, output)
		const source = {
			...base,
			target: {
				...base.target,
				validatedInputSchema: true,
				updateSchema: true,
				interruptSchema: true,
				invocation: { ...base.target.invocation, resumableInterrupts: ['external-wait'] as const },
			},
		}
		const contract = createRemoteHarnessTargetContract({
			...source,
			target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
		})

		expect(contract.id).toBe('support')
		expect(contract.interrupts).toEqual(['external-wait'])
	})

	it('clones owned address and interruption arrays before freezing', () => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		const address = { ...source.address }
		const resumableInterrupts: ('tool-approval' | 'external-wait')[] = ['tool-approval']
		const withMutableInputs = {
			...source,
			address,
			target: {
				...source.target,
				interruptSchema: { type: 'object' },
				invocation: { ...source.target.invocation, resumableInterrupts },
			},
		}
		const contract = createRemoteHarnessTargetContract({
			...withMutableInputs,
			target: {
				...withMutableInputs.target,
				exportDigest: computeHarnessTargetExportDigest(withMutableInputs),
			},
		})

		expect(Object.isFrozen(address)).toBe(false)
		expect(Object.isFrozen(resumableInterrupts)).toBe(false)
		expect(contract.address).not.toBe(address)
		expect(contract.interrupts).not.toBe(resumableInterrupts)
	})

	it('preserves optional queue metadata in runtime shape and exact inference', () => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const base = exportedTarget(input, output)
		const source = { ...base, target: { ...base.target, queue: { name: 'support-jobs' } as const } }
		const contract = createRemoteHarnessTargetContract({
			...source,
			target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
		})

		expectTypeOf(contract.queue).toEqualTypeOf<Readonly<{ name: 'support-jobs' }>>()
		expect(contract.queue).toEqual({ name: 'support-jobs' })
		expect(Object.isFrozen(contract.queue)).toBe(true)
	})

	it('changes the digest for every addressed public contract family', () => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		const variants = [
			{ ...source, address: { ...source.address, serviceName: 'Other' } },
			{ ...source, target: { ...source.target, description: 'changed' } },
			{ ...source, target: { ...source.target, validatedInputSchema: { type: 'number' } } },
			{ ...source, target: { ...source.target, updateSchema: false } },
			{ ...source, target: { ...source.target, interruptSchema: { type: 'object' } } },
			{
				...source,
				target: {
					...source.target,
					invocation: { ...source.target.invocation, resumableInterrupts: ['external-wait'] },
				},
			},
			{ ...source, target: { ...source.target, stream: { ...source.target.stream, outputUpdates: [] } } },
			{ ...source, target: { ...source.target, queue: { name: 'jobs' } } },
		]
		const original = computeHarnessTargetExportDigest(source)
		expect(variants.map(computeHarnessTargetExportDigest)).not.toContain(original)
	})

	it('does not transfer the private hydration brand through a structural copy', () => {
		const input = generatedSchema<string, string>({ type: 'string' })
		const output = generatedSchema<string, string>({ type: 'string' })
		const source = exportedTarget(input, output)
		const contract = createRemoteHarnessTargetContract({
			...source,
			target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
		})

		expect(isRemoteHarnessTargetContract({ ...contract })).toBe(false)
	})
})

function exportedTarget<Input extends ModelSchema, Output extends ModelSchema>(input: Input, output: Output) {
	return {
		schemaVersion: 1 as const,
		address: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'support' } as const,
		target: {
			targetName: 'support' as const,
			kind: 'agent' as const,
			inputSchema: input,
			validatedInputSchema: input['~standard'].jsonSchema.output({ target: 'draft-2020-12' }),
			outputSchema: output,
			updateSchema: { type: 'string' },
			interruptSchema: false as const,
			invocation: { aggregate: true as const, stream: true as const, resumableInterrupts: [] as const },
			stream: {
				protocol: 'harness-execution-events-v1' as const,
				eventTypes: harnessExecutionEventTypesV1,
				outputUpdates: ['text-delta'] as const,
			},
		},
	}
}

function generatedSchema<Input extends JsonValue, Output extends JsonValue>(
	inputJsonSchema: Readonly<Record<string, unknown>>,
	outputJsonSchema: Readonly<Record<string, unknown>> | boolean = inputJsonSchema,
): ModelSchema<Input, Output> {
	const schema = { ...inputJsonSchema }
	Object.defineProperty(schema, '~standard', {
		enumerable: false,
		value: Object.freeze({
			version: 1,
			vendor: 'purista-generated',
			validate: (value: unknown) => ({ value }),
			types: undefined as unknown as { input: Input; output: Output },
			jsonSchema: Object.freeze({
				input: () => inputJsonSchema,
				output: () => outputJsonSchema,
			}),
		}),
	})
	return Object.freeze(schema) as unknown as ModelSchema<Input, Output>
}
