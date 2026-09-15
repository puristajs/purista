import { defineAgent, defineHarness, defineWorkflow, harnessExecutionEventTypesV1 } from '@purista/harness'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { createSandbox } from 'sinon'
import { vi } from 'vitest'
import { z } from 'zod'
import { Service } from '../core/index.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { createHarnessInvocationProxy } from '../HarnessMount/invocation.js'
import { defineHarnessQueueBinding } from '../HarnessMount/queueBinding.js'
import {
	computeHarnessTargetExportDigest,
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
} from '../HarnessMount/remoteTargetContract.js'
import { safeBind } from '../helper/index.js'
import { getCommandMessageMock, getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { getCustomMessageMessageMock } from '../mocks/messages/getCustomMessage.mock.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { createSubscriptionContextMock } from '../testing/createSubscriptionContextMock.js'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl.js'

function generatedRemoteAgent() {
	const inputSchema = { type: 'string' } as const
	const validatedInputSchema = { type: 'string' } as const
	const outputSchema = { type: 'string' } as const
	const source = {
		schemaVersion: 1 as const,
		address: { serviceName: 'RemoteSubscription', serviceVersion: '1', serviceTarget: 'answer' } as const,
		target: {
			targetName: 'answer' as const,
			kind: 'agent' as const,
			inputSchema,
			validatedInputSchema,
			outputSchema,
			updateSchema: false as const,
			interruptSchema: false as const,
			invocation: { aggregate: true as const, stream: true as const, resumableInterrupts: [] as const },
			stream: {
				protocol: 'harness-execution-events-v1' as const,
				eventTypes: harnessExecutionEventTypesV1,
				outputUpdates: [] as const,
			},
			queue: { name: 'remote.subscription.answers' } as const,
		},
		schemas: {
			input: createGeneratedHarnessSchema<string>(inputSchema),
			validatedInput: createGeneratedHarnessSchema<string>(validatedInputSchema),
			output: createGeneratedHarnessSchema<string>(outputSchema),
		},
	}
	return createRemoteHarnessTargetContract({
		...source,
		target: { ...source.target, exportDigest: computeHarnessTargetExportDigest(source) },
	})
}

describe('SubscriptionDefinitionBuilder', () => {
	const sandbox = createSandbox()
	const service = new Service({
		info: {
			serviceName: 'TestService',
			serviceVersion: '1',
			serviceDescription: 'A service',
		},
		commandDefinitionList: [],
		subscriptionDefinitionList: [],
		logger: getLoggerMock(sandbox).mock,
		eventBridge: getEventBridgeMock(sandbox).mock,
		config: {},
	})

	const functionPayloadSchema = z.object({
		foo: z.string(),
		bar: z.number(),
		def: z.string().default('default_value'),
	})
	const functionParameterSchema = z.object({
		paramOne: z.string(),
		paramTwo: z.number(),
		def: z.string().default('default_param'),
	})
	const functionOutputSchema = z.object({
		result: z.object({
			payload: z.object({
				foo: z.string(),
				bar: z.number(),
				other: z.string(),
				def: z.string(),
			}),
			parameter: z.object({
				paramOne: z.string(),
				paramTwo: z.number(),
				def: z.string(),
			}),
		}),
	})
	const transformPayloadSchema = z.string()
	const transformParameterSchema = z.string()
	const transformOutputSchema = z.string()

	const beforeOneStub = sandbox.stub()
	const afterOneStub = sandbox.stub()

	const builder = new SubscriptionDefinitionBuilder('testSubscription', 'a unit test subscription')
		.addPayloadSchema(functionPayloadSchema)
		.addParameterSchema(functionParameterSchema)
		.addOutputSchema('subscriptionEndEmitted', functionOutputSchema)
		.setTransformInput(transformPayloadSchema, transformParameterSchema, async function (context, payload, parameter) {
			void context
			expect(typeof payload).toBe('string')
			expect(typeof parameter).toBe('string')

			const pay: {
				foo: string
				bar: number
			} = JSON.parse(payload)
			const param: {
				paramOne: string
				paramTwo: number
			} = JSON.parse(parameter)

			return {
				payload: pay,
				parameter: param,
			}
		})
		.setTransformOutput(transformOutputSchema, async function (context, payload, parameter) {
			void context
			void parameter
			const p: Readonly<{
				result: {
					payload: {
						foo: string
						bar: number
						def: string
						other: string
					}
					parameter: {
						paramOne: string
						paramTwo: number
					}
				}
			}> = payload

			return JSON.stringify(p)
		})
		.setBeforeGuardHooks({
			beforeOne: async function (context, payload, parameter) {
				void context
				const pay: {
					foo: string
					bar: number
					def: string
				} = payload

				const param: {
					def: string
					paramOne: string
					paramTwo: number
				} = parameter
				beforeOneStub(pay, param)
			},
		})
		.setAfterGuardHooks({
			afterOne: async function (context, fnOutputPayload, input, parameter) {
				void context
				const pay: {
					foo: string
					bar: number
					def: string
				} = input

				const param: {
					def: string
					paramOne: string
					paramTwo: number
				} = parameter

				const fnRes: {
					result: {
						payload: {
							foo: string
							bar: number
							def: string
							other: string
						}
						parameter: {
							def: string
							paramOne: string
							paramTwo: number
						}
					}
				} = fnOutputPayload

				afterOneStub(fnRes, pay, param)
			},
		})
		.canInvoke(
			'OtherService',
			'2',
			'testSubscription',
			functionOutputSchema.merge(z.object({ toBeRemovedInResponse: z.string() })),
			functionPayloadSchema,
			functionParameterSchema,
		)
		.canEmit('some', z.object({ example: z.string() }))
		.setSubscriptionFunction(async function (context, payload, parameter) {
			const result = await context.service.OtherService['2'].testSubscription(payload, parameter)

			context.emit('some', { example: 'test' })

			return result
		})

	const payload = {
		foo: 'foo',
		bar: 1,
	}
	const parameter = {
		paramOne: 'Parameter 1',
		paramTwo: 2,
	}

	beforeEach(() => {
		sandbox.reset()
	})

	afterAll(() => {
		sandbox.restore()
	})

	it('does not throw on subscription function', async () => {
		const subscriptionFunction = safeBind(builder.getSubscriptionFunction(), service)

		const msg = getCommandMessageMock({
			payload: {
				payload,
				parameter,
			},
		})

		const { context, stubs } = createSubscriptionContextMock(builder, {
			message: msg,
			sandbox,
		})
		stubs.service.OtherService[2].testSubscription.callsFake(async (payload: any, parameter: any) => {
			return {
				result: {
					payload: { ...payload, other: 'added by invoke' },
					parameter,
					toBeRemovedInResponse: 'removed by output schema',
				},
			}
		})

		const result = await subscriptionFunction(context, payload, parameter)

		expect(result).toStrictEqual({
			result: {
				payload: { ...payload, other: 'added by invoke', def: 'default_value' },
				parameter: { ...parameter, def: 'default_param' },
			},
		})

		expect(stubs.emit.some.called).toBeTruthy()
	})

	it('executes the plain function without hooks and schema validation', async () => {
		const subscriptionFunction = safeBind(builder.getSubscriptionFunctionPlain(), service)
		const msg = getCommandMessageMock({
			payload: {
				payload,
				parameter,
			},
		})

		const { context, stubs } = createSubscriptionContextMock(builder, {
			message: msg,
			sandbox,
		})
		stubs.service.OtherService[2].testSubscription.callsFake(async (payload: any, parameter: any) => {
			return {
				result: {
					payload: { ...payload, other: 'added by invoke' },
					parameter,
					toBeRemovedInResponse: 'kept in plain mode',
				},
			}
		})

		const result = await subscriptionFunction(
			context,
			{ ...payload, def: 'default_value' },
			{ ...parameter, def: 'default_param' },
		)

		expect(result).toStrictEqual({
			result: {
				payload: { ...payload, other: 'added by invoke', def: 'default_value' },
				parameter: { ...parameter, def: 'default_param' },
				toBeRemovedInResponse: 'kept in plain mode',
			},
		})
		expect(beforeOneStub.callCount).toBe(0)
	})

	it('does not throw on transform input', async () => {
		const fn = builder.getTransformInputFunction()

		if (!fn) {
			expect(fn).toBeDefined()
			return
		}

		const transformFunction = safeBind(fn, service)

		const msg = getCommandMessageMock({
			payload: {
				payload,
				parameter,
			},
		})

		const context = builder.getSubscriptionTransformContextMock({
			message: msg,
			sandbox,
		})

		const result = await transformFunction(context.mock, JSON.stringify(payload), JSON.stringify(parameter))

		expect(result).toStrictEqual({ payload, parameter })
	})

	it('does not throw on transform output', async () => {
		const fn = builder.getTransformOutputFunction()

		if (!fn) {
			expect(fn).toBeDefined()
			return
		}

		const transformFunction = safeBind(fn, service)

		const msg = getCommandMessageMock({
			payload: {
				payload,
				parameter,
			},
		})

		const context = builder.getSubscriptionTransformContextMock({
			message: msg,
			sandbox,
		})

		const result = await transformFunction(
			context.mock,
			{
				result: {
					payload: {
						...payload,
						other: 'added by invoke',
						def: 'default_value',
					},
					parameter: { ...parameter, def: 'default_param' },
				},
			},
			{ ...parameter, def: 'default_param' },
		)

		expect(result).toStrictEqual(
			JSON.stringify({
				result: {
					payload: {
						...payload,
						other: 'added by invoke',
						def: 'default_value',
					},
					parameter: { ...parameter, def: 'default_param' },
				},
			}),
		)
	})

	it('works with without schema', async () => {
		const b = new SubscriptionDefinitionBuilder('testCommand', 'a unit test command')

		b.setSubscriptionFunction(async function (context, payload, parameter) {
			void context
			return { payload, parameter }
		})

		const fn = b.getSubscriptionFunction()

		const theFunction = safeBind(fn, service)

		const msg = getCommandMessageMock({
			payload: {
				payload: '',
				parameter: {},
			},
		})

		const { context } = createSubscriptionContextMock(b, { message: msg, sandbox })

		const result = await theFunction(context, 'y', 'x')

		expect(result).toStrictEqual({
			payload: 'y',
			parameter: 'x',
		})
	})

	it('merges repeated canInvoke calls for the same service and version', async () => {
		const b = new SubscriptionDefinitionBuilder('mergeInvokes', 'merge invokes')
			.addOutputSchema('done', z.object({ ok: z.boolean() }))
			.canInvoke('OtherService', '1', 'first', z.object({ first: z.string() }))
			.canInvoke('OtherService', '1', 'second', z.object({ second: z.string() }))

		b.setSubscriptionFunction(async function (context) {
			void context
			return { ok: true }
		})

		const definition = await b.getDefinition()

		expect(Object.keys(definition.invokes.OtherService[1]).sort()).toStrictEqual(['first', 'second'])
	})

	it('declares local Harness targets by their authentic source and grants enqueue only to a nominal queue reference', async () => {
		const agent = defineAgent('answer', {
			model: 'chat',
			instructions: 'Answer.',
		})
		const workflow = defineWorkflow('summarize', {
			async handler({ input }) {
				return input
			},
		})
		const binding = defineHarnessQueueBinding(
			agent.contract,
			new QueueDefinitionBuilder('support.answer', 'Support answers'),
			new QueueWorkerBuilder('support.answer', 'answer-worker'),
		)
		const builder = new SubscriptionDefinitionBuilder('invokeHarness', 'invoke a mounted Harness target')
			.canInvokeAgent('Support', '1', binding.reference)
			.canInvokeWorkflow('Support', '1', workflow.contract)
			.setSubscriptionFunction(async function (context) {
				const agentRun = context.agent.Support['1'].answer.run('question')
				const agentStream = context.agent.Support['1'].answer.stream('question')
				const agentEnqueue = context.agent.Support['1'].answer.enqueue('question')
				const workflowRun = context.workflow.Support['1'].summarize.run('question')
				const workflowStream = context.workflow.Support['1'].summarize.stream('question')
				void [agentRun, agentStream, agentEnqueue, workflowRun, workflowStream]
				return undefined
			})

		const definition = await builder.getDefinition()
		expect(definition.invokes.Support['1'].answer).toHaveProperty('harnessDeclaration')
		expect(definition.invokes.Support['1'].summarize).toHaveProperty('harnessDeclaration')

		const invoke = vi.fn()
		const proxy = createHarnessInvocationProxy<any>('agent', invoke, vi.fn(), undefined, definition.invokes)
		await expect(proxy.Support['1'].answer.run('question')).rejects.toThrow('binding is incomplete')
		expect(invoke).not.toHaveBeenCalled()

		const enqueue = vi.fn(async () => ({ jobId: 'job-1', queueName: 'support.answer' }))
		const queuedProxy = createHarnessInvocationProxy<any>('agent', vi.fn(), vi.fn(), enqueue, definition.invokes)
		await expect(queuedProxy.Support['1'].answer.enqueue('question')).resolves.toMatchObject({
			jobId: 'job-1',
			queueName: 'support.answer',
			sessionId: expect.any(String),
		})
		expect(enqueue).toHaveBeenCalledWith('support.answer', 'question', expect.any(Object), undefined)

		expect(() =>
			new SubscriptionDefinitionBuilder('copiedHarness', 'reject copied capabilities').canInvokeAgent('Support', '1', {
				...binding.reference,
			} as never),
		).toThrow('exact factory-created binding')

		const direct = new SubscriptionDefinitionBuilder('directHarness', 'direct target').canInvokeAgent(
			'Support',
			'1',
			agent.contract,
		)
		// biome-ignore lint/correctness/noConstantCondition: Compile-only capability proof.
		if (false) {
			direct.setSubscriptionFunction(async function (context) {
				// @ts-expect-error Direct target contracts do not grant enqueue capability.
				await context.agent.Support['1'].answer.enqueue('question')
				return undefined
			})
			new SubscriptionDefinitionBuilder('wrongKind', 'wrong target kind').canInvokeAgent(
				'Support',
				'1',
				// @ts-expect-error Agent declarations cannot accept workflow targets.
				workflow.contract,
			)
		}
	})

	it('derives a generated remote Harness address directly from the hydrated contract', async () => {
		const remote = generatedRemoteAgent()
		const definition = await new SubscriptionDefinitionBuilder('remoteHarness', 'invoke a remote Harness target')
			.canInvokeAgent(remote)
			.setSubscriptionFunction(async function (context) {
				const run = context.agent.RemoteSubscription['1'].answer.run('question')
				const stream = context.agent.RemoteSubscription['1'].answer.stream('question')
				const enqueue = context.agent.RemoteSubscription['1'].answer.enqueue('question')
				void [run, stream, enqueue]
				return undefined
			})
			.getDefinition()

		expect(definition.invokes.RemoteSubscription['1'].answer).toHaveProperty('harnessBinding')
		// biome-ignore lint/correctness/noConstantCondition: Compile-only target-kind proof.
		if (false) {
			new SubscriptionDefinitionBuilder('wrongRemoteKind', 'wrong target kind').canInvokeWorkflow(
				// @ts-expect-error Workflow declarations cannot accept generated agent targets.
				remote,
			)
		}
	})

	it('finalizes local agent and workflow declarations for a real subscription service context', async () => {
		const valueSchema = z.object({ value: z.string() })
		const agent = defineAgent('classify', {
			model: 'chat',
			input: valueSchema,
			output: valueSchema,
			instructions: 'Return the classified value.',
			prompt: input => ({ role: 'user', content: input.value }),
		})
		const workflow = defineWorkflow('echo', {
			input: valueSchema,
			output: valueSchema,
			async handler({ input }) {
				return input
			},
		})
		const harness = defineHarness({ name: 'subscriptionInvocation' }).addAgent(agent).addWorkflow(workflow)
		let resolveCompletion: (value: unknown) => void = () => undefined
		const completion = new Promise<unknown>(resolve => {
			resolveCompletion = resolve
		})
		const builder = new ServiceBuilder({
			serviceName: 'SubscriptionInvocation',
			serviceVersion: '1',
			serviceDescription: 'finalized subscription invocation test',
		})
		const subscription = builder
			.getSubscriptionBuilder('invokeHarness', 'invoke mounted Harness roots')
			.subscribeToEvent('subscription.invoke')
			.addPayloadSchema(valueSchema)
			.canInvokeAgent('SubscriptionInvocation', '1', agent.contract)
			.canInvokeWorkflow('SubscriptionInvocation', '1', workflow.contract)
			.setSubscriptionFunction(async function (context, payload) {
				const agentResult = await context.agent.SubscriptionInvocation['1'].classify.run(payload)
				const stream = await context.workflow.SubscriptionInvocation['1'].echo.stream(payload)
				for await (const _event of stream) {
					// Consume the complete provider-neutral execution stream.
				}
				resolveCompletion({ agentResult, workflowOutcome: await stream.result })
				return undefined
			})
		builder.addSubscriptionDefinition(subscription.getDefinition()).mountHarness(harness)
		const eventBridge = new DefaultEventBridge()
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject(
			objectReply(
				{ value: 'classified' },
				{ usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, finishReason: 'stop' },
			),
		)
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, {
			ai: { models: { chat: { provider, model: 'fake' } } },
		} as never)
		await service.start()
		try {
			await eventBridge.emitMessage(getCustomMessageMessageMock('subscription.invoke', { value: 'source' }) as never)
			await expect(completion).resolves.toMatchObject({
				agentResult: { outcome: { status: 'completed', output: { value: 'classified' } } },
				workflowOutcome: { status: 'completed', output: { value: 'source' } },
			})
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})
