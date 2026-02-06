import { z } from 'zod/v4'
import { getEventBridgeMock, getLoggerMock } from '../../mocks/index.js'
import { getCustomMessageMessageMock } from '../../mocks/messages/getCustomMessage.mock.js'
import { SubscriptionDefinitionBuilder } from '../../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { ServiceInfoType } from '../types/index.js'
import { Service } from './Service.impl.js'

describe('Service', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'TestService',
		serviceVersion: '1',
		serviceDescription: 'A service for unit tests',
	}

	it('creates a new instance', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock

		const service = new Service({
			logger,
			eventBridge,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			config: {},
		})

		await expect(service.start()).resolves.toBeUndefined()

		await expect(service.destroy()).resolves.toBeUndefined()
	})

	it('validates invokes in subscription after-guard hooks', async () => {
		const logger = getLoggerMock()
		const eventBridge = getEventBridgeMock()
		eventBridge.stubs.invoke.resolves({ ok: true })

		const subscriptionBuilder = new SubscriptionDefinitionBuilder('validateInvoke', 'validate invoke definitions')
			.canInvoke(
				'OtherService',
				'1',
				'otherCommand',
				z.object({ ok: z.boolean() }),
				z.object({ requiredField: z.string() }),
				z.object({}),
			)
			.setAfterGuardHooks({
				invoke: async function (context) {
					// @ts-expect-error intentionally invalid payload shape to verify runtime validation
					await context.service.OtherService[1].otherCommand({ invalid: true }, {})
				},
			})
			.setSubscriptionFunction(async function () {
				return { done: true }
			})

		const subscriptionDefinition = await subscriptionBuilder.getDefinition()
		const service = new Service({
			logger: logger.mock,
			eventBridge: eventBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [subscriptionDefinition],
			config: {},
		})

		await service.registerSubscription(subscriptionDefinition)

		const message = getCustomMessageMessageMock('custom-event', { test: true })

		await expect(service.executeSubscription(message, 'validateInvoke')).rejects.toBeInstanceOf(UnhandledError)
		expect(eventBridge.stubs.invoke.callCount).toBe(0)
	})
})
