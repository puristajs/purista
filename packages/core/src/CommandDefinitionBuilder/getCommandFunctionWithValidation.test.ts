import { createSandbox } from 'sinon'
import { z } from 'zod'

import { HandledError } from '../core/Error/HandledError.impl.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import { Service } from '../core/Service/Service.impl.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { CommandDefinitionBuilder } from './CommandDefinitionBuilder.impl.js'
import { getCommandFunctionWithValidation } from './getCommandFunctionWithValidation.impl.js'

describe('getCommandFunctionWithValidation', () => {
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

	const builder = new CommandDefinitionBuilder('testCommand', 'test command')

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

		const commandFunction = async () => {
			return { success: true }
		}

		const wrapped = getCommandFunctionWithValidation(commandFunction, undefined, parameterSchema, undefined, {})

		const context = builder.getCommandContextMock({
			payload: {},
			parameter: { wrongParam: 'value' },
		})

		await expect(wrapped.call(service, context.mock, {}, { wrongParam: 'value' })).rejects.toThrow(HandledError)

		try {
			await wrapped.call(service, context.mock, {}, { wrongParam: 'value' })
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

		const commandFunction = async () => {
			return { success: true }
		}

		const wrapped = getCommandFunctionWithValidation(commandFunction, payloadSchema, undefined, undefined, {})

		const context = builder.getCommandContextMock({
			payload: { wrongField: 'value' },
			parameter: {},
		})

		await expect(wrapped.call(service, context.mock, { wrongField: 'value' }, {})).rejects.toThrow(HandledError)

		try {
			await wrapped.call(service, context.mock, { wrongField: 'value' }, {})
		} catch (error) {
			expect(error).toBeInstanceOf(HandledError)
			expect((error as HandledError).errorCode).toBe(StatusCode.BadRequest)
			expect((error as HandledError).message).toContain('input validation for payload failed')
		}
	})

	it('returns output if no schema is defined', async () => {
		const expectedOutput = { result: 'success', data: { foo: 'bar' } }

		const commandFunction = async () => {
			return expectedOutput
		}

		const wrapped = getCommandFunctionWithValidation(commandFunction, undefined, undefined, undefined, {})

		const context = builder.getCommandContextMock({
			payload: { any: 'payload' },
			parameter: { any: 'parameter' },
		})

		const result = await wrapped.call(service, context.mock, { any: 'payload' }, { any: 'parameter' })

		expect(result).toStrictEqual(expectedOutput)
	})

	it('throws if output schema validation fails', async () => {
		const outputSchema = z.object({
			result: z.string(),
			count: z.number(),
		})

		const commandFunction = async () => {
			return { wrongField: 'value', anotherWrong: 123 }
		}

		const wrapped = getCommandFunctionWithValidation(commandFunction, undefined, undefined, outputSchema, {})

		const context = builder.getCommandContextMock({
			payload: {},
			parameter: {},
		})

		await expect(wrapped.call(service, context.mock, {}, {})).rejects.toThrow(UnhandledError)

		try {
			await wrapped.call(service, context.mock, {}, {})
		} catch (error) {
			expect(error).toBeInstanceOf(UnhandledError)
			expect((error as UnhandledError).errorCode).toBe(StatusCode.InternalServerError)
			expect((error as UnhandledError).message).toContain('output validation failed')
			expect((error as UnhandledError).data).toHaveProperty('issues')
		}
	})
})
