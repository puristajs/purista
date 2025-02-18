import { join } from 'node:path'

import type { Service } from '@purista/core'
import { getCommandMessageMock, getCommandSuccessMessageMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'
import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer } from 'testcontainers'
import { z } from 'zod'

import { theServiceServiceBuilder, theServiceV1Service } from '../../../test/service/theService/v1/index.js'
import { MqttBridge } from '../src/index.js'

const MQTT_PORT = 1883
const EXAMPLE_EVENT = 'exampleEvent'

describe('@purista/mqttbridge', () => {
	let container: StartedTestContainer
	let eventbridge: MqttBridge
	const sandbox = createSandbox()
	const subscriptionStub = sandbox.stub().resolves()
	const logger = getLoggerMock(sandbox)
	let service: Service

	beforeAll(async () => {
		const source = join(__dirname, 'mosquitto.conf')

		container = await new GenericContainer('eclipse-mosquitto')
			.withExposedPorts({
				container: MQTT_PORT,
				host: MQTT_PORT,
			})
			.withBindMounts([
				{
					source,
					target: '/mosquitto/config/mosquitto.conf',
				},
			])
			.start()

		eventbridge = new MqttBridge({ logger: logger.mock })
		await eventbridge.start()

		const subscriptionBuilder = theServiceV1Service
			.getSubscriptionBuilder('sendWelcomeEmail', 'send a welcome mail to new registered users')
			.subscribeToEvent(EXAMPLE_EVENT)
			.addPayloadSchema(z.any())
			.setSubscriptionFunction(subscriptionStub)

		theServiceServiceBuilder.addSubscriptionDefinition(subscriptionBuilder.getDefinition())

		service = await theServiceServiceBuilder.getInstance(eventbridge, { logger: getLoggerMock(sandbox).mock })
		await service.start()
	})

	afterAll(async () => {
		await service.destroy()
		await eventbridge.destroy()
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
		const commandResponse = getCommandSuccessMessageMock(payload, { eventName: EXAMPLE_EVENT })

		await eventbridge.emitMessage(commandResponse)

		await new Promise(resolve => setTimeout(resolve, 3000))

		expect(subscriptionStub.called).toBeTruthy()
	})
})
