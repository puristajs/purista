import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'
import { FakeModelProvider, FakeSandbox } from '@purista/harness/testing'
import { describe, expect, expectTypeOf, it } from 'vitest'

import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { ServiceBuilderTypes } from '../core/types/ServiceBuilderTypes.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { generatedModelSchema, rootCommandRequest } from './harnessMount.test.fixture.js'
import type { HarnessDefinitionMountPolicy, HarnessState, HarnessTypes, MountedHarnessRuntimeConfig } from './types.js'

const wireSchema = {
	type: 'object',
	additionalProperties: false,
	required: ['raw'],
	properties: { raw: { type: 'string' } },
}
const validatedSchema = {
	type: 'object',
	additionalProperties: false,
	required: ['value'],
	properties: { value: { type: 'number' } },
}
const resultSchema = {
	type: 'object',
	additionalProperties: false,
	required: ['label'],
	properties: { label: { type: 'string' } },
}
const typedWorkflow = defineWorkflow('typedEcho', {
	input: generatedModelSchema<{ raw: string }, { value: number }>(wireSchema, validatedSchema, input => ({
		value: Number(input.raw),
	})),
	output: generatedModelSchema<{ label: string }, { label: string }>(resultSchema),
	async handler(context) {
		return { label: `value:${context.input.value}` }
	},
})
const workflowHarness = defineHarness({ name: 'typedWorkflow' }).addWorkflow(typedWorkflow)
const agentHarness = defineHarness({ name: 'typedAgent' }).addAgent(
	defineAgent('answer', {
		model: 'chat',
		instructions: 'Answer the user.',
		input: generatedModelSchema<string, string>({ type: 'string' }),
		output: generatedModelSchema<string, string>({ type: 'string' }),
	}),
)
const sandboxedAgentHarness = defineHarness({ name: 'sandboxedTypedAgent' }).addAgent(
	defineAgent('review', {
		model: 'chat',
		instructions: 'Review the supplied input.',
		sandbox: { group: 'reviewers' },
		input: generatedModelSchema<string, string>({ type: 'string' }),
		output: generatedModelSchema<string, string>({ type: 'string' }),
	}),
)
const serviceInfo = {
	serviceName: 'Harness',
	serviceVersion: '1',
	serviceDescription: 'P4-004 public mount inference',
}

describe('P4-004 public Harness mount inference', () => {
	it('mounts a concrete workflow and preserves validated guard input and completed outcome types', async () => {
		const observations: string[] = []
		const policy = {
			targets: {
				workflows: {
					typedEcho: {
						beforeGuards: {
							validate(context, input) {
								expectTypeOf(input).not.toBeAny()
								expectTypeOf(input).toExtend<{ value: number }>()
								expectTypeOf<{ value: number }>().toExtend<typeof input>()
								expectTypeOf(context.resources.suffix).toEqualTypeOf<string>()
								observations.push(`before:${input.value}:${context.resources.suffix}`)
							},
						},
						afterGuards: {
							audit(_context, outcome) {
								if (outcome.status === 'completed') {
									expectTypeOf(outcome.output).not.toBeAny()
									expectTypeOf(outcome.output).toExtend<{ label: string }>()
									expectTypeOf<{ label: string }>().toExtend<typeof outcome.output>()
									observations.push(`after:${outcome.output.label}`)
								}
							},
						},
					},
				},
			},
		} satisfies HarnessDefinitionMountPolicy<typeof workflowHarness, { suffix: string }>
		const builder = new ServiceBuilder(serviceInfo)
			.defineResource<'suffix', string>()
			.mountHarness(workflowHarness, policy)
		expectTypeOf<HarnessState<typeof workflowHarness>['contracts']['workflows']['typedEcho']>().toEqualTypeOf<
			typeof typedWorkflow.contract
		>()
		expectTypeOf<HarnessTypes<typeof workflowHarness>>().toEqualTypeOf<typeof workflowHarness.$infer>()
		type MountedState = ServiceBuilderTypes<
			EmptyObject,
			EmptyObject,
			EmptyObject,
			never,
			EmptyObject,
			readonly [typeof workflowHarness]
		>
		expectTypeOf<MountedState['Harnesses']>().toEqualTypeOf<readonly [typeof workflowHarness]>()

		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, { ai: {}, resources: { suffix: 'checked' } })
		try {
			await service.start()
			await expect(
				eventBridge.invoke(
					rootCommandRequest({ raw: '42' }, { definition: workflowHarness, policy, targetName: 'typedEcho' }),
				),
			).resolves.toMatchObject({ outcome: { status: 'completed', output: { label: 'value:42' } } })
			expect(observations).toEqual(['before:42:checked', 'after:value:42'])
		} finally {
			await service.destroy()
			// Drain registration and lifecycle events before the bridge closes its streams.
			await new Promise<void>(resolve => setImmediate(resolve))
			await eventBridge.destroy()
		}
	})

	it('infers inline policy callbacks and rejects a second mount and foreign definitions', () => {
		const mounted = new ServiceBuilder(serviceInfo).mountHarness(workflowHarness, {
			targets: {
				workflows: {
					typedEcho: {
						beforeGuards: {
							validate(_context, input) {
								expectTypeOf(input).not.toBeAny()
								expectTypeOf(input).toExtend<{ value: number }>()
								expectTypeOf<{ value: number }>().toExtend<typeof input>()
							},
						},
						afterGuards: {
							audit(_context, outcome) {
								if (outcome.status === 'completed') {
									expectTypeOf(outcome.output).not.toBeAny()
									expectTypeOf(outcome.output).toExtend<{ label: string }>()
									expectTypeOf<{ label: string }>().toExtend<typeof outcome.output>()
								}
							},
						},
					},
				},
			},
		})
		expect(() => {
			// @ts-expect-error A service can mount only one native Harness definition.
			mounted.mountHarness(workflowHarness)
		}).toThrow('Only one Harness definition')
		expect(() => {
			// @ts-expect-error A structural imitation has no authentic Harness definition brand.
			new ServiceBuilder(serviceInfo).mountHarness({ kind: 'harness', name: 'foreign' })
		}).toThrow('Hosted Harness definition is invalid')
	})

	it('requires the exact model binding for a direct agent at getInstance', async () => {
		const builder = new ServiceBuilder(serviceInfo).mountHarness(agentHarness)
		const eventBridge = new DefaultEventBridge()
		const provider = new FakeModelProvider()
		const config = { models: { chat: { provider, model: 'fake' } } } satisfies MountedHarnessRuntimeConfig<
			typeof agentHarness
		>
		const assertRejectedConfigs = () => {
			// @ts-expect-error A mounted agent requires the runtime options argument.
			void builder.getInstance(eventBridge)
			// @ts-expect-error A mounted agent requires the ai object.
			void builder.getInstance(eventBridge, {})
			// @ts-expect-error The agent requires its declared chat model binding.
			void builder.getInstance(eventBridge, { ai: {} })
			// @ts-expect-error Model bindings are always keyed by their explicit aliases.
			void builder.getInstance(eventBridge, { ai: { model: config.models.chat } })
			// @ts-expect-error The exact binding map rejects an undeclared model alias.
			void builder.getInstance(eventBridge, { ai: { models: { chat: config.models.chat, other: config.models.chat } } })
			// @ts-expect-error A workflow without a model requirement rejects model bindings.
			void new ServiceBuilder(serviceInfo).mountHarness(workflowHarness).getInstance(eventBridge, { ai: config })
		}
		void assertRejectedConfigs
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, { ai: config })
		try {
			await service.start()
		} finally {
			await service.destroy()
			// This test starts and stops without an invocation to drain registration events.
			await new Promise<void>(resolve => setImmediate(resolve))
			await eventBridge.destroy()
		}
	})

	it('projects a declared sandbox group as one nested adapter and policy binding', async () => {
		const builder = new ServiceBuilder(serviceInfo).mountHarness(sandboxedAgentHarness)
		const eventBridge = new DefaultEventBridge()
		const provider = new FakeModelProvider()
		const adapter = new FakeSandbox()
		const config = {
			models: { chat: { provider, model: 'fake' } },
			sandbox: {
				adapter,
				policy: {
					sharing: 'declared',
					default: { group: 'reviewers' },
					authorizeBorrowedOwner: async () => true,
				},
			},
		} satisfies MountedHarnessRuntimeConfig<typeof sandboxedAgentHarness>
		const assertRejectedConfigs = () => {
			// @ts-expect-error The adapter is nested below ai.sandbox.
			void builder.getInstance(eventBridge, { ai: { models: config.models, sandbox: adapter } })
			// @ts-expect-error A graph-declared group requires explicit deployment consent.
			void builder.getInstance(eventBridge, { ai: { models: config.models, sandbox: { adapter } } })
			void builder.getInstance(eventBridge, {
				ai: {
					models: config.models,
					sandbox: { adapter, policy: { sharing: 'declared' } },
					// @ts-expect-error Legacy sandboxBinding is no longer a runtime configuration field.
					sandboxBinding: { groups: ['reviewers'] },
				},
			})
			void builder.getInstance(eventBridge, {
				ai: {
					models: config.models,
					sandbox: {
						adapter,
						policy: {
							sharing: 'declared',
							// @ts-expect-error Runtime group approval comes from the compiled graph, not a duplicated list.
							groups: ['reviewers'],
						},
					},
				},
			})
		}
		void assertRejectedConfigs

		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, { ai: config })
		try {
			await service.start()
		} finally {
			await service.destroy()
			await new Promise<void>(resolve => setImmediate(resolve))
			await eventBridge.destroy()
		}
	})
})
