import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getEventBridgeMock } from '../../mocks/getEventBridge.mock.js'
import { getLoggerMock } from '../../mocks/getLogger.mock.js'
import { ServiceBuilder } from '../../ServiceBuilder/ServiceBuilder.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'

describe('subscription reliability validation', () => {
	it('rejects strict consumer failure handling when dead-letter routing is unsupported', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
				consumerFailureHandling: {
					boundedRetry: true,
					delayedRetry: true,
					deadLetterTarget: false,
				},
			},
		})
		const logger = getLoggerMock()
		const builder = new ServiceBuilder({
			serviceName: 'SubscriptionService',
			serviceVersion: '1',
			serviceDescription: 'subscription service',
		}).setConfigSchema(z.object({}).default({}))

		builder.addSubscriptionDefinition(
			builder
				.getSubscriptionBuilder('sendWelcomeEmail', 'send welcome email')
				.subscribeToEvent('user.created')
				.addPayloadSchema(z.object({ userId: z.string() }))
				.adviceDurable(true)
				.adviceConsumerFailureHandling({
					maxAttempts: 3,
					retryDelayMs: 100,
				})
				.setSubscriptionFunction(async function () {
					return undefined
				})
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await expect(service.start()).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
		})
	})

	it('allows best-effort consumer failure handling to start on degraded bridges', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
				consumerFailureHandling: {
					boundedRetry: false,
					delayedRetry: false,
					deadLetterTarget: false,
				},
			},
		})
		const logger = getLoggerMock()
		const builder = new ServiceBuilder({
			serviceName: 'SubscriptionService',
			serviceVersion: '1',
			serviceDescription: 'subscription service',
		}).setConfigSchema(z.object({}).default({}))

		builder.addSubscriptionDefinition(
			builder
				.getSubscriptionBuilder('sendWelcomeEmail', 'send welcome email')
				.subscribeToEvent('user.created')
				.addPayloadSchema(z.object({ userId: z.string() }))
				.adviceDurable(true)
				.adviceConsumerFailureHandling({
					mode: 'best-effort',
					maxAttempts: 3,
					retryDelayMs: 100,
				})
				.setSubscriptionFunction(async function () {
					return undefined
				})
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await expect(service.start()).resolves.toBeUndefined()
		await service.destroy()
	})
})
