import { createSandbox } from 'sinon'
import { z } from 'zod'

import { CommandDefinitionBuilder } from '../../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import { getCommandMessageMock, getEventBridgeMock, getLoggerMock } from '../../mocks/index.js'
import { HandledError } from '../Error/HandledError.impl.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { commandTransformInput } from './commandTransformInput.impl.js'
import { Service } from './Service.impl.js'

describe('commandTransformInput', () => {
	const sandbox = createSandbox()

	beforeEach(() => {
		sandbox.reset()
	})

	afterAll(() => {
		sandbox.restore()
	})

	it('throws HandledError if parameter schema validation fails', async () => {
		const logger = getLoggerMock(sandbox).mock
		const eventBridge = getEventBridgeMock(sandbox).mock

		const transformParameterSchema = z.object({
			requiredParam: z.string(),
		})
		const transformInputSchema = z.object({
			someField: z.string(),
		})

		const builder = new CommandDefinitionBuilder('testCommand', 'test command')
			.setTransformInput(transformInputSchema, transformParameterSchema, async function (_context, payload, parameter) {
				return { payload, parameter }
			})
			.setCommandFunction(async function (_context, _payload, _parameter) {
				return { success: true }
			})

		const commandDefinition = await builder.getDefinition()

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'A test service',
			},
			commandDefinitionList: [commandDefinition],
			subscriptionDefinitionList: [],
			logger,
			eventBridge,
			config: {},
		})

		const message = getCommandMessageMock({
			payload: {
				payload: { someField: 'value' },
				parameter: { wrongParam: 'value' },
			},
		})

		await expect(commandTransformInput(service, logger, commandDefinition, message)).rejects.toThrow(HandledError)

		try {
			await commandTransformInput(service, logger, commandDefinition, message)
		} catch (error) {
			expect(error).toBeInstanceOf(HandledError)
			expect((error as HandledError).errorCode).toBe(StatusCode.BadRequest)
		}
	})

	it('throws HandledError if payload schema validation fails', async () => {
		const logger = getLoggerMock(sandbox).mock
		const eventBridge = getEventBridgeMock(sandbox).mock

		const transformParameterSchema = z.object({
			paramOne: z.string(),
		})
		const transformInputSchema = z.object({
			requiredField: z.string(),
			numberField: z.number(),
		})

		const builder = new CommandDefinitionBuilder('testCommand', 'test command')
			.setTransformInput(transformInputSchema, transformParameterSchema, async function (_context, payload, parameter) {
				return { payload, parameter }
			})
			.setCommandFunction(async function (_context, _payload, _parameter) {
				return { success: true }
			})

		const commandDefinition = await builder.getDefinition()

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'A test service',
			},
			commandDefinitionList: [commandDefinition],
			subscriptionDefinitionList: [],
			logger,
			eventBridge,
			config: {},
		})

		const message = getCommandMessageMock({
			payload: {
				payload: { wrongField: 'value' },
				parameter: { paramOne: 'value' },
			},
		})

		await expect(commandTransformInput(service, logger, commandDefinition, message)).rejects.toThrow(HandledError)

		try {
			await commandTransformInput(service, logger, commandDefinition, message)
		} catch (error) {
			expect(error).toBeInstanceOf(HandledError)
			expect((error as HandledError).errorCode).toBe(StatusCode.BadRequest)
		}
	})

	it('throws HandledError if output schema validation fails', async () => {
		const logger = getLoggerMock(sandbox).mock
		const eventBridge = getEventBridgeMock(sandbox).mock

		const transformParameterSchema = z.object({
			paramOne: z.string(),
		})
		const transformInputSchema = z.object({
			someField: z.string(),
		})

		const builder = new CommandDefinitionBuilder('testCommand', 'test command')
			.setTransformInput(
				transformInputSchema,
				transformParameterSchema,
				async function (_context, _payload, _parameter) {
					throw new HandledError(StatusCode.BadRequest, 'Transform function failed')
				},
			)
			.setCommandFunction(async function (_context, _payload, _parameter) {
				return { success: true }
			})

		const commandDefinition = await builder.getDefinition()

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'A test service',
			},
			commandDefinitionList: [commandDefinition],
			subscriptionDefinitionList: [],
			logger,
			eventBridge,
			config: {},
		})

		const message = getCommandMessageMock({
			payload: {
				payload: { someField: 'value' },
				parameter: { paramOne: 'value' },
			},
		})

		await expect(commandTransformInput(service, logger, commandDefinition, message)).rejects.toThrow(HandledError)

		try {
			await commandTransformInput(service, logger, commandDefinition, message)
		} catch (error) {
			expect(error).toBeInstanceOf(HandledError)
			expect((error as HandledError).errorCode).toBe(StatusCode.BadRequest)
			expect((error as HandledError).message).toContain('Transform function failed')
		}
	})

	it('throws UnhandledError if transform function throws a non-error value', async () => {
		const logger = getLoggerMock(sandbox).mock
		const eventBridge = getEventBridgeMock(sandbox).mock

		const transformParameterSchema = z.object({
			paramOne: z.string(),
		})
		const transformInputSchema = z.object({
			someField: z.string(),
		})

		const builder = new CommandDefinitionBuilder('testCommand', 'test command')
			.setTransformInput(transformInputSchema, transformParameterSchema, async function () {
				throw 'non-error'
			})
			.setCommandFunction(async function (_context, _payload, _parameter) {
				return { success: true }
			})

		const commandDefinition = await builder.getDefinition()

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'A test service',
			},
			commandDefinitionList: [commandDefinition],
			subscriptionDefinitionList: [],
			logger,
			eventBridge,
			config: {},
		})

		const message = getCommandMessageMock({
			payload: {
				payload: { someField: 'value' },
				parameter: { paramOne: 'value' },
			},
		})

		await expect(commandTransformInput(service, logger, commandDefinition, message)).rejects.toThrow(UnhandledError)

		try {
			await commandTransformInput(service, logger, commandDefinition, message)
		} catch (error) {
			expect(error).toBeInstanceOf(UnhandledError)
			expect((error as UnhandledError).errorCode).toBe(StatusCode.InternalServerError)
			expect((error as UnhandledError).message).toContain('Unable to transform input')
		}
	})
})
