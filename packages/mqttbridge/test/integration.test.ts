import { join } from 'node:path'
import { emitWarning } from 'node:process'

import type { Service } from '@purista/core/adapter'
import { getCommandMessageMock, getCommandSuccessMessageMock, getLoggerMock, StatusCode } from '@purista/core/adapter'
import { createSandbox } from 'sinon'
import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer } from 'testcontainers'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'

import { theServiceServiceBuilder, theServiceV1Service } from '../../../test/service/theService/v1/index.js'
import { MqttBridge } from '../src/index.js'

const MQTT_PORT = 1883
const MOSQUITTO_IMAGE = 'eclipse-mosquitto:2.0.18'
const EXAMPLE_EVENT = 'exampleEvent'

describe('@purista/mqttbridge', () => {
	let container: StartedTestContainer
	let eventbridge: MqttBridge
	const sandbox = createSandbox()
	const subscriptionStub = sandbox.stub().resolves()
	const logger = getLoggerMock(sandbox)
	let service: Service
	let dockerAvailable = true

	beforeAll(async () => {
		const source = join(__dirname, 'mosquitto.conf')

		try {
			container = await new GenericContainer(MOSQUITTO_IMAGE)
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
		} catch (err) {
			dockerAvailable = false
			emitWarning(
				`Skipping mqtt bridge integration tests because Docker is unavailable: ${err instanceof Error ? err.message : String(err)}`,
				'MqttBridge',
			)
			return
		}

		eventbridge = new MqttBridge({ logger: logger.mock })
		await eventbridge.start()

		const subscriptionBuilder = theServiceV1Service
			.getSubscriptionBuilder('sendWelcomeEmail', 'send a welcome mail to new registered users')
			.subscribeToEvent(EXAMPLE_EVENT)
			.adviceDurable(false)
			.adviceAutoacknowledgeMessage(true)
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

	it('times out delayed command invocations and keeps later command calls healthy', async () => {
		if (!dockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const address = {
			serviceName: service.info.serviceName,
			serviceVersion: service.info.serviceVersion,
			serviceTarget: `delayedCommand_${Date.now()}`,
		} as const

		await eventbridge.registerCommand(
			address,
			async message => {
				await new Promise(resolve => setTimeout(resolve, 150))
				return getCommandSuccessMessageMock({ delayed: true }, undefined, message)
			},
			{} as never,
			{
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		)

		const command = getCommandMessageMock({
			receiver: address,
			sender: {
				serviceName: service.info.serviceName,
				serviceVersion: service.info.serviceVersion,
				serviceTarget: 'timeout-check',
				instanceId: eventbridge.instanceId,
			},
			payload: {
				payload: undefined,
				parameter: {},
			},
		})

		try {
			await expect(eventbridge.invoke(command, 50)).rejects.toMatchObject({ errorCode: StatusCode.GatewayTimeout })
			await new Promise(resolve => setTimeout(resolve, 250))
			await expect(eventbridge.invoke(command, 1_000)).resolves.toEqual({ delayed: true })
		} finally {
			await eventbridge.unregisterCommand(address)
		}
	}, 20_000)

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
})
