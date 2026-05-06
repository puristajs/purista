import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getEventBridgeMock } from '../../mocks/getEventBridge.mock.js'
import { getLoggerMock } from '../../mocks/getLogger.mock.js'
import { getCustomMessageMessageMock } from '../../mocks/messages/getCustomMessage.mock.js'
import { ServiceBuilder } from '../../ServiceBuilder/ServiceBuilder.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { SubscriptionConsumerControlError } from '../types/subscription/SubscriptionConsumerControlError.js'

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

	it('maps subscription ack outcome to successful completion', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
				consumerFailureHandling: {
					boundedRetry: true,
					delayedRetry: true,
					deadLetterTarget: true,
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
				.getSubscriptionBuilder('ackOutcome', 'ack outcome')
				.subscribeToEvent('user.created')
				.addPayloadSchema(z.object({ userId: z.string() }))
				.adviceDurable(true)
				.adviceConsumerFailureHandling({
					maxAttempts: 3,
					retryDelayMs: 50,
					deadLetterTarget: 'user.created.dlq',
				})
				.setSubscriptionFunction(async function () {
					return { status: 'ack' } as const
				})
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await service.start()

		const message = getCustomMessageMessageMock('user.created', { userId: 'u-1' })
		await expect(service.executeSubscription(message, 'ackOutcome')).resolves.toBeUndefined()
		await service.destroy()
	})

	it('maps subscription retry outcome to control error for adapters', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
				consumerFailureHandling: {
					boundedRetry: true,
					delayedRetry: true,
					deadLetterTarget: true,
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
				.getSubscriptionBuilder('retryOutcome', 'retry outcome')
				.subscribeToEvent('user.created')
				.addPayloadSchema(z.object({ userId: z.string() }))
				.adviceDurable(true)
				.adviceConsumerFailureHandling({
					maxAttempts: 3,
					retryDelayMs: 50,
					deadLetterTarget: 'user.created.dlq',
				})
				.setSubscriptionFunction(async function () {
					return { status: 'retry', reason: 'transient failure', delayMs: 125 } as const
				})
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await service.start()

		const message = getCustomMessageMessageMock('user.created', { userId: 'u-1' })
		await expect(service.executeSubscription(message, 'retryOutcome')).rejects.toMatchObject({
			name: SubscriptionConsumerControlError.name,
			outcome: 'retry',
			delayMs: 125,
		})
		await service.destroy()
	})

	it('maps subscription drop outcome to control error for adapters', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
				consumerFailureHandling: {
					boundedRetry: true,
					delayedRetry: true,
					deadLetterTarget: true,
					drop: true,
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
				.getSubscriptionBuilder('dropOutcome', 'drop outcome')
				.subscribeToEvent('user.created')
				.addPayloadSchema(z.object({ userId: z.string() }))
				.adviceDurable(true)
				.adviceConsumerFailureHandling({
					maxAttempts: 3,
					retryDelayMs: 50,
					deadLetterTarget: 'user.created.dlq',
				})
				.setSubscriptionFunction(async function () {
					return { status: 'drop', reason: 'irrelevant event' } as const
				})
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await service.start()

		const message = getCustomMessageMessageMock('user.created', { userId: 'u-1' })
		await expect(service.executeSubscription(message, 'dropOutcome')).rejects.toMatchObject({
			name: SubscriptionConsumerControlError.name,
			outcome: 'drop',
		})
		await service.destroy()
	})

	it('rejects subscription stop-consumer outcome in strict mode when bridge lacks support', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
				consumerFailureHandling: {
					boundedRetry: true,
					delayedRetry: true,
					deadLetterTarget: true,
					stopConsumer: false,
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
				.getSubscriptionBuilder('stopConsumerOutcome', 'stop consumer outcome')
				.subscribeToEvent('user.created')
				.addPayloadSchema(z.object({ userId: z.string() }))
				.adviceDurable(true)
				.adviceConsumerFailureHandling({
					mode: 'strict',
					maxAttempts: 3,
					retryDelayMs: 50,
					deadLetterTarget: 'user.created.dlq',
				})
				.setSubscriptionFunction(async function () {
					return { status: 'stop-consumer', reason: 'poison sequence detected' } as const
				})
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await service.start()

		const message = getCustomMessageMessageMock('user.created', { userId: 'u-1' })
		await expect(service.executeSubscription(message, 'stopConsumerOutcome')).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
		})
		await service.destroy()
	})

	it('rejects delayed retry control signal in strict mode if bridge has no delayed retry support', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
				consumerFailureHandling: {
					boundedRetry: true,
					delayedRetry: false,
					deadLetterTarget: true,
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
				.getSubscriptionBuilder('strictDelayedRetry', 'strict delayed retry')
				.subscribeToEvent('user.created')
				.addPayloadSchema(z.object({ userId: z.string() }))
				.adviceDurable(true)
				.adviceConsumerFailureHandling({
					mode: 'strict',
					maxAttempts: 3,
					retryDelayMs: 0,
					deadLetterTarget: 'user.created.dlq',
				})
				.setSubscriptionFunction(async function () {
					return { status: 'retry', delayMs: 200 } as const
				})
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await service.start()

		const message = getCustomMessageMessageMock('user.created', { userId: 'u-1' })
		await expect(service.executeSubscription(message, 'strictDelayedRetry')).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
		})
		await service.destroy()
	})

	it('rejects resumeSubscriptionConsumer when bridge has no pause/resume support', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				consumerFailureHandling: {
					consumerPauseResume: false,
				},
			},
		})
		const logger = getLoggerMock()
		const builder = new ServiceBuilder({
			serviceName: 'SubscriptionService',
			serviceVersion: '1',
			serviceDescription: 'subscription service',
		}).setConfigSchema(z.object({}).default({}))

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await expect(service.resumeSubscriptionConsumer('subscription-key')).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
		})
	})
})
