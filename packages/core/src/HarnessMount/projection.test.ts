import {
	defineAgent,
	defineHarness,
	defineTool,
	harnessExecutionEventTypesV1,
	type JsonValue,
	type ModelSchema,
} from '@purista/harness'
import Ajv2020 from 'ajv/dist/2020.js'
import { describe, expect, it } from 'vitest'

import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { createMountedHarnessTargetProjections } from './projection.js'
import { defineHarnessQueueBinding } from './queueBinding.js'
import type { MountedHarnessTargetProjection } from './types.js'

const schemaCalls = { input: 0, validatedInput: 0, output: 0, validateOutput: 0 }
const inputSchema = generatedSchema<{ question: string }, { normalized: string }>(
	{ type: 'object', additionalProperties: false, required: ['question'], properties: { question: { type: 'string' } } },
	{
		type: 'object',
		additionalProperties: false,
		required: ['normalized'],
		properties: { normalized: { type: 'string' } },
	},
	{
		input() {
			schemaCalls.input += 1
		},
		output() {
			schemaCalls.validatedInput += 1
		},
	},
)
const outputSchema = generatedSchema<{ answer: string }, { answer: string }>(
	{ type: 'object', additionalProperties: false, required: ['answer'], properties: { answer: { type: 'string' } } },
	undefined,
	{
		output() {
			schemaCalls.output += 1
		},
		validate() {
			schemaCalls.validateOutput += 1
		},
	},
)
const dependency = defineAgent('lookup', {
	model: 'chat',
	input: generatedSchema<string, string>({ type: 'string' }),
	output: generatedSchema<string, string>({ type: 'string' }),
	instructions: 'Look up facts.',
	prompt: input => ({ role: 'user', content: input }),
})
const root = defineAgent('answer', {
	model: 'chat',
	input: inputSchema,
	output: outputSchema,
	instructions: 'Answer the normalized question.',
	prompt: input => ({ role: 'user', content: input.normalized }),
	subagents: { lookup: dependency },
})
const definition = defineHarness({ name: 'support', revision: 'harness-r1' }).addAgent(root)

describe('createMountedHarnessTargetProjections', () => {
	it('projects each authentic target once with root-only policy and borrowed identities', async () => {
		resetSchemaCalls()
		const queue = new QueueDefinitionBuilder('support.answer', 'Queue answers')
		const worker = new QueueWorkerBuilder('support.answer', 'answer-worker')
		const queueBinding = defineHarnessQueueBinding(root.contract, queue, worker)
		const before = async function before() {}
		const after = async function after() {}

		const projections = createMountedHarnessTargetProjections(definition, {
			serviceName: 'Support',
			serviceVersion: '1',
			policy: {
				targets: {
					agents: {
						answer: {
							beforeGuards: { authorize: before },
							afterGuards: { audit: after },
							successEvent: 'support.answer.completed',
							queue: queueBinding,
						},
					},
				},
			},
		})

		expect(projections.map(projection => [projection.target.id, projection.visibility])).toEqual([
			['answer', 'root'],
			['lookup', 'dependency'],
		])
		const answer = required(projections.find(projection => projection.target.id === 'answer'))
		const lookup = required(projections.find(projection => projection.target.id === 'lookup'))
		expect(answer.target).toBe(root.contract)
		expect(answer.standardSchemas.input).toBe(root.contract.input)
		expect(answer.standardSchemas.output).toBe(root.contract.output)
		expect(answer.policy).toEqual({
			beforeGuardKeys: ['authorize'],
			afterGuardKeys: ['audit'],
			durableResume: null,
			successEvent: 'support.answer.completed',
			queueName: 'support.answer',
		})
		expect(answer.targetExport.queue).toEqual({ name: 'support.answer' })
		expect(answer.targetExport.stream).toEqual({
			protocol: 'harness-execution-events-v1',
			eventTypes: harnessExecutionEventTypesV1,
			outputUpdates: ['object-snapshot'],
		})
		expect(lookup.target).toBe(dependency.contract)
		expect(lookup.policy).toBeNull()
		expect(lookup.targetExport).not.toHaveProperty('queue')
		expect(lookup).not.toHaveProperty('completedEvent')
		expect(schemaCalls).toEqual({ input: 1, validatedInput: 1, output: 1, validateOutput: 0 })
		expect(Object.isFrozen(root.contract.input)).toBe(false)
		expect(Object.isFrozen(root.contract.output)).toBe(false)
		expect(Object.isFrozen(queue)).toBe(false)
		expect(Object.isFrozen(worker)).toBe(false)
		for (const projection of projections) {
			expect(Object.isFrozen(projection)).toBe(true)
			expect(Object.isFrozen(projection.address)).toBe(true)
			expect(Object.isFrozen(projection.jsonSchemas)).toBe(true)
			expect(Object.isFrozen(projection.targetExport)).toBe(true)
			expect(Object.isFrozen(projection.routeBinding)).toBe(true)
			expect(projection.exportDigest).toMatch(/^sha256:[0-9a-f]{64}$/)
			expect(projection.routeBindingRevision).toMatch(/^sha256:[0-9a-f]{64}$/)
		}
		type ActualTarget = (typeof projections)[number]['target']
		type ExpectedTarget = typeof root.contract | typeof dependency.contract
		type ActualProjection = (typeof projections)[number]
		type ExpectedProjection =
			| MountedHarnessTargetProjection<typeof root.contract>
			| MountedHarnessTargetProjection<typeof dependency.contract>
		const expectedFitsProjection: ExpectedTarget extends ActualTarget ? true : false = true
		const projectionFitsExpected: ActualTarget extends ExpectedTarget ? true : false = true
		const projectionKeepsCorrelation: ActualProjection extends ExpectedProjection ? true : false = true
		expect(expectedFitsProjection).toBe(true)
		expect(projectionFitsExpected).toBe(true)
		expect(projectionKeepsCorrelation).toBe(true)
	})

	it('uses exact schema directions and validates completed outcomes without re-entering the output transform', async () => {
		resetSchemaCalls()
		const [projection] = createMountedHarnessTargetProjections(definition, {
			serviceName: 'Support',
			serviceVersion: '1',
			policy: {
				targets: { agents: { answer: { successEvent: 'support.answer.completed' } } },
			},
		})
		const rootProjection = required(projection)
		const completedEvent = required(rootProjection.completedEvent)
		const completed = Object.freeze({ status: 'completed' as const, runId: 'run-1', output: { answer: 'done' } })

		expect(rootProjection.jsonSchemas).toEqual({
			input: {
				type: 'object',
				additionalProperties: false,
				required: ['question'],
				properties: { question: { type: 'string' } },
			},
			validatedInput: {
				type: 'object',
				additionalProperties: false,
				required: ['normalized'],
				properties: { normalized: { type: 'string' } },
			},
			output: {
				type: 'object',
				additionalProperties: false,
				required: ['answer'],
				properties: { answer: { type: 'string' } },
			},
			update: true,
			interrupt: false,
		})
		const validation = await completedEvent.schema['~standard'].validate(completed)
		expect(validation).toEqual({ value: completed })
		expect(schemaCalls.validateOutput).toBe(0)
		expect(await completedEvent.schema['~standard'].validate({ ...completed, status: 'failed' })).toHaveProperty(
			'issues',
		)
		expect(await completedEvent.schema['~standard'].validate({ ...completed, output: { answer: 42 } })).toHaveProperty(
			'issues',
		)
		expect(schemaCalls.validateOutput).toBe(0)
		expect(completedEvent.jsonSchema).toEqual({
			type: 'object',
			additionalProperties: false,
			required: ['status', 'runId', 'output'],
			properties: {
				status: { const: 'completed' },
				runId: { type: 'string', minLength: 1 },
				output: rootProjection.jsonSchemas.output,
			},
		})
	})

	it('validates full draft-2020-12 completed outputs without defaults or transforms', async () => {
		const advancedOutputJsonSchema: Record<string, unknown> = {
			$id: 'urn:purista:test:advanced-output',
			type: 'object',
			properties: {
				mode: { enum: ['summary', 'detail'] },
				detail: { type: 'string', default: 'must-not-be-applied' },
			},
			required: ['mode'],
			if: { properties: { mode: { const: 'detail' } }, required: ['mode'] },
			unevaluatedProperties: false,
		}
		Object.defineProperty(advancedOutputJsonSchema, 'then', {
			enumerable: true,
			value: { required: ['detail'] },
		})
		const advancedOutput = generatedSchema<
			{ mode: 'summary' | 'detail'; detail?: string },
			{ mode: 'summary' | 'detail'; detail?: string }
		>(advancedOutputJsonSchema)
		const advancedAgent = defineAgent('advanced', {
			model: 'chat',
			input: generatedSchema<string, string>({ type: 'string' }),
			output: advancedOutput,
			instructions: 'Return a summary or detail.',
			prompt: input => ({ role: 'user', content: input }),
		})
		const advancedHarness = defineHarness({ name: 'advanced' }).addAgent(advancedAgent)
		const project = () =>
			createMountedHarnessTargetProjections(advancedHarness, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: { targets: { agents: { advanced: { successEvent: 'advanced.completed' } } } },
			})
		const [projection] = project()
		expect(project).not.toThrow()
		const completedEvent = required(required(projection).completedEvent)
		const missingDetail = { status: 'completed', runId: 'run-advanced', output: { mode: 'detail' } }

		expect(await completedEvent.schema['~standard'].validate(missingDetail)).toHaveProperty('issues')
		expect(missingDetail.output).toEqual({ mode: 'detail' })
		expect(
			await completedEvent.schema['~standard'].validate({
				status: 'completed',
				runId: 'run-advanced',
				output: { mode: 'detail', detail: 'available' },
			}),
		).toHaveProperty('value')
	})

	it('projects the exact reachable tool-approval request schema', () => {
		const lookupTool = defineTool('lookupAccount', {
			description: 'Look up one account.',
			input: generatedSchema<string, string>({ type: 'string' }),
			output: generatedSchema<string, string>({ type: 'string' }),
			async handler(_context, input) {
				return input
			},
		})
		const approvalAgent = defineAgent('approve', {
			model: 'chat',
			input: generatedSchema<string, string>({ type: 'string' }),
			output: generatedSchema<string, string>({ type: 'string' }),
			instructions: 'Ask before looking up an account.',
			prompt: input => ({ role: 'user', content: input }),
			tools: [lookupTool],
			governance: {
				policies: [
					{
						kind: 'native',
						id: 'approvalPolicy',
						rules: [{ id: 'approveLookup', tools: ['lookupAccount'], effect: 'require_approval' }],
					},
				],
			},
		})
		const approvalHarness = defineHarness({ name: 'approval', revision: 'approval-r1' }).addAgent(approvalAgent)
		const [projection] = createMountedHarnessTargetProjections(approvalHarness, {
			serviceName: 'Support',
			serviceVersion: '1',
		})

		const interruptSchema = required(projection).jsonSchemas.interrupt
		expect(interruptSchema).toMatchObject({
			type: 'object',
			properties: {
				requests: {
					type: 'array',
					items: {
						additionalProperties: false,
						required: expect.arrayContaining(['approvalId', 'input', 'demands']),
						properties: {
							input: true,
							demands: { type: 'array', items: expect.any(Object) },
						},
					},
				},
			},
		})
		const validate = new Ajv2020({ strict: false }).compile(interruptSchema)
		const request = {
			approvalId: 'approval1',
			runId: 'run1',
			agentRunId: 'agentRun1',
			agentId: 'approve',
			invocationId: 'invocation1',
			step: 0,
			toolId: 'lookupAccount',
			callId: 'call1',
			input: { accountId: 'account1' },
			demands: [
				{
					decisionId: `decision_${'a'.repeat(64)}`,
					source: { kind: 'policy', id: 'approvalPolicy' },
					phase: 'approval',
				},
			],
		}
		const validInterrupt = {
			type: 'tool-approval',
			id: `approval_batch_${'b'.repeat(64)}`,
			revision: 'c'.repeat(64),
			requests: [request],
		}
		expect(validate(validInterrupt)).toBe(true)
		expect(validate({ ...validInterrupt, requests: [{ ...request, approvalId: '/invalid' }] })).toBe(false)
		expect(validate({ ...validInterrupt, requests: [{ ...request, step: Number.MAX_SAFE_INTEGER + 1 }] })).toBe(false)
		expect(
			validate({
				...validInterrupt,
				requests: [
					{
						...request,
						demands: [{ ...request.demands[0], source: { kind: 'policy', id: 'x'.repeat(129) } }],
					},
				],
			}),
		).toBe(false)
	})

	it('uses fixed canonical digest preimages and changes every route-affecting input', () => {
		const base = required(
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
			})[0],
		)
		const revision = required(
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
				revision: 'mount-r2',
			})[0],
		)
		const address = required(
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '2',
			})[0],
		)
		const policy = required(
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: { targets: { agents: { answer: { successEvent: 'done' } } } },
			})[0],
		)
		const queueBinding = defineHarnessQueueBinding(
			root.contract,
			new QueueDefinitionBuilder('support.answer', 'Queue answers'),
			new QueueWorkerBuilder('support.answer', 'answer-worker'),
		)
		const queued = required(
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: { targets: { agents: { answer: { queue: queueBinding } } } },
			})[0],
		)
		const changedSchemaAgent = defineAgent('answer', {
			model: 'chat',
			input: inputSchema,
			output: generatedSchema<string, string>({ type: 'string' }),
			instructions: 'Return text.',
			prompt: input => ({ role: 'user', content: input.normalized }),
		})
		const changedSchema = required(
			createMountedHarnessTargetProjections(
				defineHarness({ name: 'supportSchema', revision: 'harness-r1' }).addAgent(changedSchemaAgent),
				{ serviceName: 'Support', serviceVersion: '1' },
			)[0],
		)
		const dependencyProjection = required(
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
			}).find(entry => entry.target.id === 'lookup'),
		)
		const rootProjection = required(
			createMountedHarnessTargetProjections(
				defineHarness({ name: 'lookupRoot', revision: 'harness-r1' }).addAgent(dependency),
				{ serviceName: 'Support', serviceVersion: '1' },
			)[0],
		)

		expect(base.mountRevision).toBe('harness-r1')
		expect(revision.mountRevision).toBe('mount-r2')
		expect(base.exportDigest).toBe('sha256:53440e0545c609844ef90e4d0a7ee2f719b5166b815b4b823597e7bd16144e9d')
		expect(base.routeBindingRevision).toBe('sha256:fbc136c9955c7db004e25dca1e0a84817bb6f4a60c497509218eb6e977e5cfc9')
		expect(address.exportDigest).not.toBe(base.exportDigest)
		expect(address.routeBindingRevision).not.toBe(base.routeBindingRevision)
		expect(revision.exportDigest).toBe(base.exportDigest)
		expect(revision.routeBindingRevision).not.toBe(base.routeBindingRevision)
		expect(policy.routeBindingRevision).not.toBe(base.routeBindingRevision)
		expect(queued.exportDigest).not.toBe(base.exportDigest)
		expect(queued.routeBindingRevision).not.toBe(base.routeBindingRevision)
		expect(changedSchema.exportDigest).not.toBe(base.exportDigest)
		expect(changedSchema.routeBindingRevision).not.toBe(base.routeBindingRevision)
		expect(rootProjection.exportDigest).toBe(dependencyProjection.exportDigest)
		expect(rootProjection.routeBindingRevision).not.toBe(dependencyProjection.routeBindingRevision)
	})

	it('rejects empty graphs and copied, reflected, foreign, or mutated queue bindings atomically', () => {
		const empty = defineHarness({ name: 'empty' })
		expect(() =>
			createMountedHarnessTargetProjections(empty, {
				serviceName: 'Support',
				serviceVersion: '1',
			}),
		).toThrow('at least one executable target')

		const binding = defineHarnessQueueBinding(
			root.contract,
			new QueueDefinitionBuilder('support.answer', 'Queue answers'),
			new QueueWorkerBuilder('support.answer', 'answer-worker'),
		)
		const copied = { ...binding }
		const reflected = Object.create(binding) as typeof binding
		const foreign = defineHarnessQueueBinding(
			dependency.contract,
			new QueueDefinitionBuilder('support.lookup', 'Queue lookups'),
			new QueueWorkerBuilder('support.lookup', 'lookup-worker'),
		)
		const substitutedReference = { ...binding, reference: foreign.reference }
		for (const queue of [
			copied,
			reflected,
			foreign,
			substitutedReference,
			{ ...binding, targetContract: dependency.contract },
		]) {
			expect(() =>
				createMountedHarnessTargetProjections(definition, {
					serviceName: 'Support',
					serviceVersion: '1',
					policy: {
						targets: { agents: { answer: { queue: queue as never } } },
					},
				}),
			).toThrow('exact factory-created binding')
		}

		const mutableQueue = new QueueDefinitionBuilder('support.answer', 'Queue answers')
		const mutableWorker = new QueueWorkerBuilder('support.answer', 'answer-worker')
		const mutableBinding = defineHarnessQueueBinding(root.contract, mutableQueue, mutableWorker)
		;(mutableQueue as unknown as { queueName: string }).queueName = 'support.changed'
		expect(() =>
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: { targets: { agents: { answer: { queue: mutableBinding } } } },
			}),
		).toThrow('exact factory-created binding')

		const stableQueue = new QueueDefinitionBuilder('support.answer', 'Queue answers')
		const stableWorker = new QueueWorkerBuilder('support.answer', 'answer-worker')
		const stableBinding = defineHarnessQueueBinding(root.contract, stableQueue, stableWorker)
		const stableProjection = createMountedHarnessTargetProjections(definition, {
			serviceName: 'Support',
			serviceVersion: '1',
			policy: { targets: { agents: { answer: { queue: stableBinding } } } },
		})[0]
		;(stableQueue as unknown as { queueName: string }).queueName = 'support.changed'
		expect(stableProjection?.policy?.queueName).toBe('support.answer')
		expect(stableProjection?.targetExport.queue?.name).toBe('support.answer')
	})

	it('fails atomically on a later invalid schema without invoking accessors', () => {
		let getterCalls = 0
		const hostileSchema: Record<string, unknown> = {}
		Object.defineProperty(hostileSchema, 'type', {
			enumerable: true,
			get() {
				getterCalls += 1
				return 'string'
			},
		})
		const invalidDependency = defineAgent('invalidLookup', {
			model: 'chat',
			input: generatedSchema<string, string>(hostileSchema),
			output: generatedSchema<string, string>({ type: 'string' }),
			instructions: 'Never runs.',
			prompt: input => ({ role: 'user', content: input }),
		})
		const validRoot = defineAgent('validRoot', {
			model: 'chat',
			input: generatedSchema<string, string>({ type: 'string' }),
			output: generatedSchema<string, string>({ type: 'string' }),
			instructions: 'Never runs.',
			prompt: input => ({ role: 'user', content: input }),
			subagents: { invalidLookup: invalidDependency },
		})
		const invalidHarness = defineHarness({ name: 'invalid', revision: 'invalid-r1' }).addAgent(validRoot)

		expect(() =>
			createMountedHarnessTargetProjections(invalidHarness, {
				serviceName: 'Support',
				serviceVersion: '1',
			}),
		).toThrow('JSON Schema projection failed')
		expect(getterCalls).toBe(0)
	})

	it('rejects copied or reflected Harness definitions before projection callbacks', () => {
		for (const foreignDefinition of [{ ...definition }, Object.create(definition)]) {
			resetSchemaCalls()
			expect(() =>
				Reflect.apply(createMountedHarnessTargetProjections, undefined, [
					foreignDefinition,
					{ serviceName: 'Support', serviceVersion: '1' },
				]),
			).toThrow('Hosted Harness definition is invalid')
			expect(schemaCalls).toEqual({ input: 0, validatedInput: 0, output: 0, validateOutput: 0 })
		}
	})

	it('rejects dependency policy at both the type and runtime boundaries', () => {
		const typeAssertion = () =>
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: {
					targets: {
						agents: {
							// @ts-expect-error dependency-only agents cannot receive root policy
							lookup: {},
						},
					},
				},
			})
		expect(typeAssertion).toBeTypeOf('function')
		expect(() =>
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: { targets: { agents: { lookup: {} } } } as never,
			}),
		).toThrow('unknown field')
	})

	it('permits durable resume only for approval-capable guarded roots', () => {
		const lookupTool = defineTool('lookupForReview', {
			description: 'Look up one review record.',
			input: generatedSchema<string, string>({ type: 'string' }),
			output: generatedSchema<string, string>({ type: 'string' }),
			async handler(_context, input) {
				return input
			},
		})
		const reviewAgent = defineAgent('review', {
			model: 'chat',
			input: generatedSchema<string, string>({ type: 'string' }),
			output: generatedSchema<string, string>({ type: 'string' }),
			instructions: 'Review one record.',
			prompt: input => ({ role: 'user', content: input }),
			tools: [lookupTool],
			governance: {
				policies: [
					{
						kind: 'native',
						id: 'reviewPolicy',
						rules: [{ id: 'reviewLookup', tools: ['lookupForReview'], effect: 'require_approval' }],
					},
				],
			},
		})
		const reviewHarness = defineHarness({ name: 'review', revision: 'review-r1' }).addAgent(reviewAgent)
		const beforeGuards = { authorizeReviewer: async () => {} }
		const [projection] = createMountedHarnessTargetProjections(reviewHarness, {
			serviceName: 'Support',
			serviceVersion: '1',
			policy: {
				targets: { agents: { review: { beforeGuards, durableResume: { identity: 'run-owner' } } } },
			},
		})
		expect(projection?.policy?.durableResume).toBe('stored-run-owner')

		const missingGuardTypeAssertion = () =>
			createMountedHarnessTargetProjections(reviewHarness, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: {
					targets: {
						agents: {
							// @ts-expect-error durable resume requires a business before guard
							review: { durableResume: { identity: 'run-owner' } },
						},
					},
				},
			})
		expect(missingGuardTypeAssertion).toBeTypeOf('function')
		expect(() =>
			createMountedHarnessTargetProjections(reviewHarness, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: {
					targets: { agents: { review: { durableResume: { identity: 'run-owner' } } } },
				} as never,
			}),
		).toThrow('requires a root with reachable tool approval and a before guard')

		const unsupportedTypeAssertion = () =>
			createMountedHarnessTargetProjections(definition, {
				serviceName: 'Support',
				serviceVersion: '1',
				policy: {
					targets: {
						agents: {
							// @ts-expect-error a non-interrupting root cannot enable durable resume
							answer: { beforeGuards, durableResume: { identity: 'run-owner' } },
						},
					},
				},
			})
		expect(unsupportedTypeAssertion).toBeTypeOf('function')
	})
})

function generatedSchema<Input extends JsonValue, Output extends JsonValue>(
	inputJsonSchema: Readonly<Record<string, unknown>>,
	outputJsonSchema: Readonly<Record<string, unknown>> | undefined = inputJsonSchema,
	hooks: Readonly<{
		input?: () => void
		output?: () => void
		validate?: () => void
	}> = {},
): ModelSchema<Input, Output> {
	const schema = { marker: 'borrowed' }
	Object.defineProperty(schema, '~standard', {
		enumerable: false,
		value: Object.freeze({
			version: 1,
			vendor: 'projection-fixture',
			validate(value: unknown) {
				hooks.validate?.()
				return { value: value as Output }
			},
			types: undefined as unknown as { input: Input; output: Output },
			jsonSchema: Object.freeze({
				input() {
					hooks.input?.()
					return inputJsonSchema
				},
				output() {
					hooks.output?.()
					return outputJsonSchema ?? inputJsonSchema
				},
			}),
		}),
	})
	return schema as unknown as ModelSchema<Input, Output>
}

function resetSchemaCalls(): void {
	schemaCalls.input = 0
	schemaCalls.validatedInput = 0
	schemaCalls.output = 0
	schemaCalls.validateOutput = 0
}

function required<Value>(value: Value | undefined): Value {
	if (value === undefined) throw new Error('Expected fixture value.')
	return value
}
