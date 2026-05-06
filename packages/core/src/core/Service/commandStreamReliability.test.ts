import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { getEventBridgeMock } from '../../mocks/getEventBridge.mock.js'
import { getLoggerMock } from '../../mocks/getLogger.mock.js'
import { ServiceBuilder } from '../../ServiceBuilder/ServiceBuilder.impl.js'
import { EventBridgeCommandTransport, EventBridgeResponseConfirmationLevel, StatusCode } from '../index.js'

describe('command and stream reliability validation', () => {
	it('rejects commands requiring manual acknowledgement when bridge does not support it', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				manualAckSupported: false,
			},
		})
		const logger = getLoggerMock()
		const builder = new ServiceBuilder({
			serviceName: 'CommandService',
			serviceVersion: '1',
			serviceDescription: 'command service',
		}).setConfigSchema(z.object({}).default({}))

		builder.addCommandDefinition(
			builder
				.getCommandBuilder('process', 'process command')
				.addPayloadSchema(z.object({ value: z.string() }))
				.addOutputSchema(z.object({ ok: z.boolean() }))
				.adviceAutoacknowledgeMessages(false)
				.setCommandFunction(async function () {
					return {
						ok: true,
					}
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

	it('rejects strict manual-ack command handling when bridge cannot provide strict command guarantees', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				manualAckSupported: true,
				commandHandling: {
					transport: EventBridgeCommandTransport.TopicCorrelation,
					pendingInvocationCancellation: true,
					responseConfirmation: EventBridgeResponseConfirmationLevel.ProtocolLevel,
					strictMode: false,
				},
			},
		})
		const logger = getLoggerMock()
		const builder = new ServiceBuilder({
			serviceName: 'CommandService',
			serviceVersion: '1',
			serviceDescription: 'command service',
		}).setConfigSchema(z.object({}).default({}))

		builder.addCommandDefinition(
			builder
				.getCommandBuilder('process', 'process command')
				.addPayloadSchema(z.object({ value: z.string() }))
				.addOutputSchema(z.object({ ok: z.boolean() }))
				.adviceAutoacknowledgeMessages(false)
				.setCommandFunction(async function () {
					return {
						ok: true,
					}
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

	it('rejects stream registration when bridge does not support streams', async () => {
		const eventBridgeMock = getEventBridgeMock({
			capabilities: {
				supportsStreams: false,
			},
		})
		const logger = getLoggerMock()
		const builder = new ServiceBuilder({
			serviceName: 'StreamService',
			serviceVersion: '1',
			serviceDescription: 'stream service',
		}).setConfigSchema(z.object({}).default({}))

		builder.addStreamDefinition(
			builder
				.getStreamBuilder('streamProcess', 'stream process')
				.addPayloadSchema(z.object({ value: z.string() }))
				.setStreamFunction(async function (_context, _payload, _params, writer) {
					await writer.write({ step: 1 })
					await writer.close({ done: true })
				})
				.addChunkSchema(z.object({ step: z.number() }))
				.addFinalSchema(z.object({ done: z.boolean() }))
				.getDefinition(),
		)

		const service = await builder.getInstance(eventBridgeMock.mock, {
			logger: logger.mock,
		})

		await expect(service.start()).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
		})
	})
})
