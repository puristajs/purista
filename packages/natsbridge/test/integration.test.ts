import type { Service, ServiceInfoType } from '@purista/core'
import { getCommandMessageMock, getCommandSuccessMessageMock, getLoggerMock, ServiceBuilder } from '@purista/core'
import type { StartedNatsContainer } from '@testcontainers/nats'
import { NatsContainer } from '@testcontainers/nats'
import { createSandbox } from 'sinon'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'

import { NatsBridge } from '../src/index.js'

const EXAMPLE_EVENT = 'exampleEvent'
const natsTestsEnabled = ['1', 'true'].includes(process.env.PURISTA_NATSBRIDGE_TESTS ?? '')
const describeWithNats = natsTestsEnabled ? describe : describe.skip
const NATS_IMAGE = 'nats:2.10-alpine'
const serviceInfo = {
	serviceName: 'TheService',
	serviceVersion: '1',
	serviceDescription: 'test service',
} as const satisfies ServiceInfoType

describeWithNats('@purista/natsbridge', () => {
	let container: StartedNatsContainer
	let eventbridge: NatsBridge
	const sandbox = createSandbox()
	const subscriptionStub = sandbox.stub().resolves()
	const logger = getLoggerMock(sandbox)
	let service: Service
	const serviceConfigSchema = z.object({}).default({})

	beforeAll(async () => {
		container = await new NatsContainer(NATS_IMAGE).withJetStream().withStartupTimeout(30000).start()

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
		const payload = { example: 'payload' }
		const commandResponse = getCommandSuccessMessageMock(payload, {
			eventName: EXAMPLE_EVENT,
		})

		await eventbridge.emitMessage(commandResponse)

		await new Promise(resolve => setTimeout(resolve, 3000))

		expect(subscriptionStub.called).toBeTruthy()
	})
})
