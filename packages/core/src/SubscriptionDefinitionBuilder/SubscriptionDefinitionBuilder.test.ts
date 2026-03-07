import { createSandbox } from 'sinon'
import { z } from 'zod/v4'

import { Service } from '../core/index.js'
import { safeBind } from '../helper/index.js'
import { getCommandMessageMock, getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl.js'

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
			const result = await context.service.OtherService[2].testSubscription(payload, parameter)

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

		const context = builder.getSubscriptionContextMock({
			message: msg,
			sandbox,
		})
		context.stubs.service.OtherService[2].testSubscription.callsFake(async (payload, parameter) => {
			return {
				result: {
					payload: { ...payload, other: 'added by invoke' },
					parameter,
					toBeRemovedInResponse: 'removed by output schema',
				},
			}
		})

		const result = await subscriptionFunction(context.mock, payload, parameter)

		expect(result).toStrictEqual({
			result: {
				payload: { ...payload, other: 'added by invoke', def: 'default_value' },
				parameter: { ...parameter, def: 'default_param' },
			},
		})

		expect(context.stubs.emit.some.called).toBeTruthy()
	})

	it('executes the plain function without hooks and schema validation', async () => {
		const subscriptionFunction = safeBind(builder.getSubscriptionFunctionPlain(), service)
		const msg = getCommandMessageMock({
			payload: {
				payload,
				parameter,
			},
		})

		const context = builder.getSubscriptionContextMock({
			message: msg,
			sandbox,
		})
		context.stubs.service.OtherService[2].testSubscription.callsFake(async (payload, parameter) => {
			return {
				result: {
					payload: { ...payload, other: 'added by invoke' },
					parameter,
					toBeRemovedInResponse: 'kept in plain mode',
				},
			}
		})

		const result = await subscriptionFunction(
			context.mock,
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

	it('can register an agent dependency with payload and parameter schemas', async () => {
		const agentPayloadSchema = z.object({ message: z.string(), topic: z.string() })
		const agentParameterSchema = z.object({ channel: z.enum(['subscription']) })

		const definition = await new SubscriptionDefinitionBuilder('agentSubscription', 'agent subscription test')
			.canInvokeAgent('MyAgent', '1', {
				payloadSchema: agentPayloadSchema,
				parameterSchema: agentParameterSchema,
			})
			.setSubscriptionFunction(async function () {
				return undefined
			})
			.getDefinition()

		expect(definition.agentInvokes).toBeDefined()
		expect(definition.agentInvokes.MyAgent).toBeDefined()
		expect(definition.agentInvokes.MyAgent['1']).toBeDefined()
		// @ts-expect-error
		expect(definition.agentInvokes.MyAgent['1'].payloadSchema).toBe(agentPayloadSchema)
		// @ts-expect-error
		expect(definition.agentInvokes.MyAgent['1'].parameterSchema).toBe(agentParameterSchema)
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

		const context = b.getSubscriptionContextMock({ message: msg, sandbox })

		const result = await theFunction(context.mock, 'y', 'x')

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
})
