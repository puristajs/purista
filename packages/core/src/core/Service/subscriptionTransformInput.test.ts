import { createSandbox } from 'sinon'
import { z } from 'zod/v4'

import { getCommandMessageMock, getEventBridgeMock, getLoggerMock } from '../../mocks/index.js'
import { SubscriptionDefinitionBuilder } from '../../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.js'
import { HandledError } from '../Error/HandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { Service } from './Service.impl.js'
import { subscriptionTransformInput } from './subscriptionTransformInput.impl.js'

describe('subscriptionTransformInput', () => {
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

		const builder = new SubscriptionDefinitionBuilder('testSubscription', 'test subscription')
			.setTransformInput(
				transformInputSchema,
				transformParameterSchema,
				async function (_context, payload, parameter) {
					return { payload, parameter }
				},
			)
			.setSubscriptionFunction(async function (_context, _payload, _parameter) {
				// Subscription function
			})

		const subscriptionDefinition = await builder.getDefinition()

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'A test service',
			},
			commandDefinitionList: [],
			subscriptionDefinitionList: [subscriptionDefinition],
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

		await expect(subscriptionTransformInput(service, logger, subscriptionDefinition, message)).rejects.toThrow(
			HandledError,
		)

		try {
			await subscriptionTransformInput(service, logger, subscriptionDefinition, message)
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

		const builder = new SubscriptionDefinitionBuilder('testSubscription', 'test subscription')
			.setTransformInput(
				transformInputSchema,
				transformParameterSchema,
				async function (_context, payload, parameter) {
					return { payload, parameter }
				},
			)
			.setSubscriptionFunction(async function (_context, _payload, _parameter) {
				// Subscription function
			})

		const subscriptionDefinition = await builder.getDefinition()

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'A test service',
			},
			commandDefinitionList: [],
			subscriptionDefinitionList: [subscriptionDefinition],
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

		await expect(subscriptionTransformInput(service, logger, subscriptionDefinition, message)).rejects.toThrow(
			HandledError,
		)

		try {
			await subscriptionTransformInput(service, logger, subscriptionDefinition, message)
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

		const builder = new SubscriptionDefinitionBuilder('testSubscription', 'test subscription')
			.setTransformInput(
				transformInputSchema,
				transformParameterSchema,
				async function (_context, _payload, _parameter) {
					throw new HandledError(StatusCode.BadRequest, 'Transform function failed')
				},
			)
			.setSubscriptionFunction(async function (_context, _payload, _parameter) {
				// Subscription function
			})

		const subscriptionDefinition = await builder.getDefinition()

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'A test service',
			},
			commandDefinitionList: [],
			subscriptionDefinitionList: [subscriptionDefinition],
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

		await expect(subscriptionTransformInput(service, logger, subscriptionDefinition, message)).rejects.toThrow(
			HandledError,
		)

		try {
			await subscriptionTransformInput(service, logger, subscriptionDefinition, message)
		} catch (error) {
			expect(error).toBeInstanceOf(HandledError)
			expect((error as HandledError).errorCode).toBe(StatusCode.BadRequest)
			expect((error as HandledError).message).toContain('Transform function failed')
		}
	})
})
