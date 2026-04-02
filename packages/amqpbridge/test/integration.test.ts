import { emitWarning } from 'node:process'

import type { Service } from '@purista/core'
import { getCommandMessageMock, getCommandSuccessMessageMock, getLoggerMock } from '@purista/core'
import type { ConsumeMessage } from 'amqplib'
import amqplib from 'amqplib'
import { createSandbox } from 'sinon'
import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer } from 'testcontainers'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { theServiceServiceBuilder, theServiceV1Service } from '../../../test/service/theService/v1/index.js'
import { describeSubscriptionReliabilityContract } from '../../core/test/helpers/subscriptionReliabilityContractSuite.js'
import { AmqpBridge } from '../src/index.js'

const AMQP_PORT = 5672
const RABBITMQ_IMAGE = 'rabbitmq:3.13-alpine'
const EXAMPLE_EVENT = 'exampleEvent'

let container: StartedTestContainer
let amqpUrl: string
const sandbox = createSandbox()
const subscriptionStub = sandbox.stub().resolves()
const logger = getLoggerMock(sandbox)
let eventbridge: AmqpBridge
let service: Service
let dockerAvailable = true

describe('@purista/amqpbridge', () => {
	beforeAll(async () => {
		try {
			container = await new GenericContainer(RABBITMQ_IMAGE).withExposedPorts(AMQP_PORT).start()
			amqpUrl = `amqp://127.0.0.1:${container.getMappedPort(AMQP_PORT)}`
		} catch (err) {
			dockerAvailable = false
			emitWarning(
				`Skipping amqp bridge integration tests because Docker is unavailable: ${err instanceof Error ? err.message : String(err)}`,
				'AmqpBridge',
			)
			return
		}

		eventbridge = new AmqpBridge({ logger: logger.mock, url: amqpUrl })
		await eventbridge.start()
		const subscriptionBuilder = theServiceV1Service
			.getSubscriptionBuilder('sendWelcomeEmail', 'send a welcome mail to new registered users')
			.subscribeToEvent(EXAMPLE_EVENT)
			.addPayloadSchema(z.unknown())
			.setSubscriptionFunction(async function (context, payload, parameter) {
				return subscriptionStub(context, payload, parameter)
			})

		theServiceServiceBuilder.addSubscriptionDefinition(subscriptionBuilder.getDefinition())

		service = await theServiceServiceBuilder.getInstance(eventbridge, {
			logger: getLoggerMock(sandbox).mock,
		})
		await service.start()
	})

	afterAll(async () => {
		await service?.destroy()
		await eventbridge?.destroy()
		await container?.stop()
	})

	afterEach(() => {
		sandbox.resetHistory()
	})

	it('can invoke ping command', async () => {
		if (!dockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const command = getCommandMessageMock({
			receiver: {
				serviceName: service.info.serviceName,
				serviceVersion: service.info.serviceVersion,
				serviceTarget: 'ping',
				instanceId: 'a',
			},
			sender: {
				serviceName: service.info.serviceName,
				serviceVersion: service.info.serviceVersion,
				serviceTarget: 'some',
				instanceId: 'a',
			},
			payload: {
				payload: undefined,
				parameter: {
					required: 'yes',
				},
			},
		})
		const result = await eventbridge.invoke(command)

		expect(result).toEqual({
			ping: true,
		})
	})

	it('receives subscriptions', async () => {
		if (!dockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const payload = { example: 'payload' }
		const commandResponse = getCommandSuccessMessageMock(payload, {
			eventName: EXAMPLE_EVENT,
		})

		await eventbridge.emitMessage(commandResponse)
		await new Promise(resolve => setTimeout(resolve, 3000))

		expect(subscriptionStub.called).toBeTruthy()
	})

	it('uses broker delayed retry queues when retryDelayMs is configured', async () => {
		if (!dockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const eventName = `subscription.retry.delay.${Date.now()}`
		const subscriber = {
			serviceName: service.info.serviceName,
			serviceVersion: service.info.serviceVersion,
			serviceTarget: `subscription_retry_delay_${Date.now()}`,
		} as const

		let attempts = 0
		const attemptTimestamps: number[] = []

		await eventbridge.registerSubscription(
			{
				subscriber,
				eventName,
				eventBridgeConfig: {
					durable: true,
					autoacknowledge: false,
					shared: true,
					consumerFailureHandling: {
						maxAttempts: 3,
						retryDelayMs: 600,
						deadLetterTarget: `${eventName}.dead-letter`,
					},
				},
			},
			async () => {
				attempts += 1
				attemptTimestamps.push(Date.now())
				if (attempts < 2) {
					throw new Error('retry once')
				}
				return undefined
			},
		)

		try {
			await eventbridge.emitMessage(
				getCommandSuccessMessageMock(
					{ delayedRetry: true },
					{
						eventName,
					},
				),
			)

			const start = Date.now()
			while (attempts < 2 && Date.now() - start < 6_000) {
				await new Promise(resolve => setTimeout(resolve, 50))
			}

			expect(attempts).toBe(2)
			expect(attemptTimestamps[1] - attemptTimestamps[0]).toBeGreaterThanOrEqual(500)
		} finally {
			await eventbridge.unregisterSubscription(subscriber)
		}
	})

	describeSubscriptionReliabilityContract('@purista/amqpbridge subscription reliability', {
		shouldSkip: () => !dockerAvailable,
		createHarness: async () => {
			return {
				registerSubscription: async options => {
					const subscriber = {
						serviceName: service.info.serviceName,
						serviceVersion: service.info.serviceVersion,
						serviceTarget: `subscription_${options.eventName.replace(/[^a-zA-Z0-9]/g, '_')}`,
					} as const

					await eventbridge.registerSubscription(
						{
							subscriber,
							eventName: options.eventName,
							eventBridgeConfig: {
								durable: true,
								autoacknowledge: false,
								shared: true,
								consumerFailureHandling: {
									maxAttempts: options.maxAttempts,
									retryDelayMs: options.retryDelayMs,
									deadLetterTarget: options.deadLetterTarget,
								},
							},
						},
						async () => {
							await options.handler()
							return undefined
						},
					)

					return {
						unregister: () => eventbridge.unregisterSubscription(subscriber),
					}
				},
				emitEvent: async (eventName, payload) => {
					await eventbridge.emitMessage(
						getCommandSuccessMessageMock(payload, {
							eventName,
						}),
					)
				},
				observeDeadLetter: async target => {
					const connection = await amqplib.connect(amqpUrl)
					const channel = await connection.createChannel()
					await channel.assertQueue(target, { durable: true })

					const next = new Promise<{ payload: unknown; headers?: Record<string, string | undefined> }>(resolve => {
						void channel.consume(target, msg => {
							if (!msg) {
								return
							}
							resolve({
								payload: JSON.parse(msg.content.toString('utf-8')),
								headers: normalizeAmqpHeaders(msg),
							})
							channel.ack(msg)
						})
					})

					return {
						next: () => next,
						destroy: async () => {
							await channel.close()
							await connection.close()
						},
					}
				},
			}
		},
	})
})

const normalizeAmqpHeaders = (msg: ConsumeMessage): Record<string, string | undefined> => {
	const headers = msg.properties.headers ?? {}
	return {
		'x-purista-dead-letter-reason': toHeaderString(headers['x-purista-dead-letter-reason']),
		'x-purista-retry-attempt': toHeaderString(headers['x-purista-retry-attempt']),
	}
}

const toHeaderString = (value: unknown) => {
	if (typeof value === 'string') {
		return value
	}
	if (typeof value === 'number') {
		return String(value)
	}
	if (Buffer.isBuffer(value)) {
		return value.toString('utf-8')
	}
	return undefined
}
