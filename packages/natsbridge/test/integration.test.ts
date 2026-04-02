import { emitWarning } from 'node:process'

import type { Service, ServiceInfoType } from '@purista/core'
import { getCommandMessageMock, getCommandSuccessMessageMock, getLoggerMock, ServiceBuilder } from '@purista/core'
import type { StartedNatsContainer } from '@testcontainers/nats'
import { NatsContainer } from '@testcontainers/nats'
import { connect } from 'nats'
import { createSandbox } from 'sinon'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'

import { describeSubscriptionReliabilityContract } from '../../core/test/helpers/subscriptionReliabilityContractSuite.js'
import { NatsBridge } from '../src/index.js'

const EXAMPLE_EVENT = 'exampleEvent'
const NATS_IMAGE = 'nats:2.10-alpine'

const serviceInfo = {
	serviceName: 'TheService',
	serviceVersion: '1',
	serviceDescription: 'test service',
} as const satisfies ServiceInfoType

let container: StartedNatsContainer
let eventbridge: NatsBridge
const sandbox = createSandbox()
const subscriptionStub = sandbox.stub().resolves()
const logger = getLoggerMock(sandbox)
let service: Service
const serviceConfigSchema = z.object({}).default({})
let dockerAvailable = true

describe('@purista/natsbridge', () => {
	beforeAll(async () => {
		try {
			container = await new NatsContainer(NATS_IMAGE).withJetStream().withStartupTimeout(30000).start()
		} catch (err) {
			dockerAvailable = false
			emitWarning(
				`Skipping nats bridge integration tests because Docker is unavailable: ${err instanceof Error ? err.message : String(err)}`,
				'NatsBridge',
			)
			return
		}

		eventbridge = new NatsBridge({
			logger: logger.mock,
			...container.getConnectionOptions(),
		})
		await eventbridge.start()

		const serviceBuilder = new ServiceBuilder(serviceInfo).setConfigSchema(serviceConfigSchema)
		const pingCommandBuilder = serviceBuilder
			.getCommandBuilder('ping', 'provide a dummy command')
			.addPayloadSchema(z.unknown().optional())
			.addParameterSchema(z.object({ required: z.string() }))
			.addOutputSchema(z.object({ ping: z.boolean() }))
			.setCommandFunction(async function () {
				return {
					ping: true,
				}
			})

		serviceBuilder.addCommandDefinition(pingCommandBuilder.getDefinition())

		const subscriptionBuilder = serviceBuilder
			.getSubscriptionBuilder('sendWelcomeEmail', 'send a welcome mail to new registered users')
			.subscribeToEvent(EXAMPLE_EVENT)
			.addPayloadSchema(z.unknown())
			.setSubscriptionFunction(subscriptionStub)

		serviceBuilder.addSubscriptionDefinition(subscriptionBuilder.getDefinition())

		service = await serviceBuilder.getInstance(eventbridge, {
			logger: getLoggerMock(sandbox).mock,
		})
		await service.start()
	}, 30000)

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
			},
			sender: {
				serviceName: service.info.serviceName,
				serviceVersion: service.info.serviceVersion,
				serviceTarget: 'some',
				instanceId: eventbridge.instanceId,
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

		expect(true).toBeTruthy()
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
	describeSubscriptionReliabilityContract('@purista/natsbridge subscription reliability', {
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
					const dlqConnection = await connect(container.getConnectionOptions())
					const next = new Promise<{ payload: unknown; headers?: Record<string, string | undefined> }>(resolve => {
						dlqConnection.subscribe(target, {
							callback: (_error, msg) => {
								if (msg) {
									resolve({
										payload: JSON.parse(new TextDecoder().decode(msg.data)),
										headers: msg.headers
											? {
													'x-purista-dead-letter-attempt': msg.headers.get('x-purista-dead-letter-attempt'),
													'x-purista-dead-letter-reason': msg.headers.get('x-purista-dead-letter-reason'),
												}
											: undefined,
									})
								}
							},
						})
					})

					return {
						next: () => next,
						destroy: async () => {
							await dlqConnection.drain()
							await dlqConnection.close()
						},
					}
				},
			}
		},
	})
})
