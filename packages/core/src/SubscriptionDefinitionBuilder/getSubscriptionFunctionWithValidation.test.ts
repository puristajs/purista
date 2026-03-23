import { createSandbox } from 'sinon'
import { z } from 'zod'

import { HandledError } from '../core/Error/HandledError.impl.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import { Service } from '../core/Service/Service.impl.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { getCommandMessageMock, getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { createSubscriptionContextMock } from '../testing/createSubscriptionContextMock.js'
import { getSubscriptionFunctionWithValidation } from './getSubscriptionFunctionWithValidation.impl.js'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl.js'

describe('getSubscriptionFunctionWithValidation', () => {
	const sandbox = createSandbox()
	const service = new Service({
		info: {
			serviceName: 'TestService',
			serviceVersion: '1',
			serviceDescription: 'A test service',
		},
		commandDefinitionList: [],
		subscriptionDefinitionList: [],
		logger: getLoggerMock(sandbox).mock,
		eventBridge: getEventBridgeMock(sandbox).mock,
		config: {},
	})

	const builder = new SubscriptionDefinitionBuilder('testSubscription', 'test subscription')

	beforeEach(() => {
		sandbox.reset()
	})

	afterAll(() => {
		sandbox.restore()
	})

	it('throws if parameter schema validation fails', async () => {
		const parameterSchema = z.object({
			requiredParam: z.string(),
		})

		const subscriptionFunction = async () => {
			return { success: true }
		}

		const wrapped = getSubscriptionFunctionWithValidation(
			subscriptionFunction,
			undefined,
			parameterSchema,
			undefined,
			{},
		)

		const message = getCommandMessageMock({
			payload: {
				payload: {},
				parameter: { wrongParam: 'value' },
			},
		})

		const { context } = createSubscriptionContextMock(builder, {
			message,
			sandbox,
		})

		await expect(wrapped.call(service, context, {}, { wrongParam: 'value' })).rejects.toThrow(HandledError)

		try {
			await wrapped.call(service, context, {}, { wrongParam: 'value' })
		} catch (error) {
			expect(error).toBeInstanceOf(HandledError)
			expect((error as HandledError).errorCode).toBe(StatusCode.BadRequest)
			expect((error as HandledError).message).toContain('input validation for parameter failed')
		}
	})

	it('throws if input schema validation fails', async () => {
		const payloadSchema = z.object({
			requiredField: z.string(),
			numberField: z.number(),
		})

		const subscriptionFunction = async () => {
			return { success: true }
		}

		const wrapped = getSubscriptionFunctionWithValidation(subscriptionFunction, payloadSchema, undefined, undefined, {})

		const message = getCommandMessageMock({
			payload: {
				payload: { wrongField: 'value' },
				parameter: {},
			},
		})

		const { context } = createSubscriptionContextMock(builder, {
			message,
			sandbox,
		})

		await expect(wrapped.call(service, context, { wrongField: 'value' }, {})).rejects.toThrow(HandledError)

		try {
			await wrapped.call(service, context, { wrongField: 'value' }, {})
		} catch (error) {
			expect(error).toBeInstanceOf(HandledError)
			expect((error as HandledError).errorCode).toBe(StatusCode.BadRequest)
			expect((error as HandledError).message).toContain('input validation for payload failed')
		}
	})

	it('returns output if no schema is defined', async () => {
		const expectedOutput = { result: 'success', data: { foo: 'bar' } }

		const subscriptionFunction = async () => {
			return expectedOutput
		}

		const wrapped = getSubscriptionFunctionWithValidation(subscriptionFunction, undefined, undefined, undefined, {})

		const message = getCommandMessageMock({
			payload: {
				payload: { any: 'payload' },
				parameter: { any: 'parameter' },
			},
		})

		const { context } = createSubscriptionContextMock(builder, {
			message,
			sandbox,
		})

		const result = await wrapped.call(service, context, { any: 'payload' }, { any: 'parameter' })

		expect(result).toStrictEqual(expectedOutput)
	})

	it('throws if output schema validation fails', async () => {
		const outputSchema = z.object({
			result: z.string(),
			count: z.number(),
		})

		const subscriptionFunction = async () => {
			return { wrongField: 'value', anotherWrong: 123 }
		}

		const wrapped = getSubscriptionFunctionWithValidation(subscriptionFunction, undefined, undefined, outputSchema, {})

		const message = getCommandMessageMock({
			payload: {
				payload: {},
				parameter: {},
			},
		})

		const { context } = createSubscriptionContextMock(builder, {
			message,
			sandbox,
		})

		await expect(wrapped.call(service, context, {}, {})).rejects.toThrow(UnhandledError)

		try {
			await wrapped.call(service, context, {}, {})
		} catch (error) {
			expect(error).toBeInstanceOf(UnhandledError)
			expect((error as UnhandledError).errorCode).toBe(StatusCode.InternalServerError)
			expect((error as UnhandledError).message).toContain('output validation failed')
			expect((error as UnhandledError).data).toHaveProperty('issues')
		}
	})
})
