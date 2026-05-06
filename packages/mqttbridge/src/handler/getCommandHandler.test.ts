import type { Span } from '@opentelemetry/api'
import { EBMessageType, getCommandMessageMock, getCommandSuccessMessageMock, getLoggerMock } from '@purista/core'
import type { IPublishPacket } from 'mqtt'
import { describe, expect, it, vi } from 'vitest'

import type { IMqttBridge } from '../types/IMqttBridge.js'
import { getCommandHandler } from './getCommandHandler.impl.js'

const getSpanMock = () =>
	({
		setAttribute: vi.fn(),
		addEvent: vi.fn(),
		setStatus: vi.fn(),
		recordException: vi.fn(),
		spanContext: vi.fn().mockReturnValue({}),
	}) as unknown as Span

describe('mqtt getCommandHandler', () => {
	it('uses seconds for non-event response message expiry interval', async () => {
		const command = getCommandMessageMock()
		const response = getCommandSuccessMessageMock(undefined, { eventName: undefined }, command)
		const publish = vi.fn()

		const bridge = {
			logger: getLoggerMock().mock,
			instanceId: 'instance-id',
			config: {
				topicPrefix: 'purista',
				shareTopicPrefix: '$share',
				shareTopicName: 'sharedpurista',
				emptyTopicPartString: '__none__',
				qosCommand: 1,
				defaultMessageExpiryInterval: 100,
				defaultCommandTimeout: 1500,
			},
			client: {
				publish,
			},
			startActiveSpan: vi
				.fn()
				.mockImplementation(async (_name, _options, _context, fn: (span: Span) => Promise<void>) => fn(getSpanMock())),
			runInFlight: async <T>(fn: () => Promise<T>) => fn(),
		} as unknown as IMqttBridge

		const handler = getCommandHandler(command.receiver, async () => response, {} as never, {
			autoacknowledge: true,
			durable: true,
			shared: true,
		}).bind(bridge)

		await handler(command, { properties: {} } as IPublishPacket)

		expect(publish).toHaveBeenCalledOnce()
		expect(publish.mock.calls[0]?.[2]).toMatchObject({
			properties: {
				messageExpiryInterval: 2,
			},
		})
	})

	it('returns command error response when command callback throws', async () => {
		const command = getCommandMessageMock()
		const publish = vi.fn()
		const bridge = {
			logger: getLoggerMock().mock,
			instanceId: 'instance-id',
			config: {
				topicPrefix: 'purista',
				shareTopicPrefix: '$share',
				shareTopicName: 'sharedpurista',
				emptyTopicPartString: '__none__',
				qosCommand: 1,
				defaultMessageExpiryInterval: 100,
				defaultCommandTimeout: 1500,
			},
			client: {
				publish,
			},
			startActiveSpan: vi
				.fn()
				.mockImplementation(async (_name, _options, _context, fn: (span: Span) => Promise<void>) => fn(getSpanMock())),
			runInFlight: async <T>(fn: () => Promise<T>) => fn(),
		} as unknown as IMqttBridge

		const handler = getCommandHandler(
			command.receiver,
			async () => {
				throw new Error('boom')
			},
			{} as never,
			{
				autoacknowledge: true,
				durable: true,
				shared: true,
			},
		).bind(bridge)

		await handler(command, { properties: {} } as IPublishPacket)

		expect(publish).toHaveBeenCalledOnce()
		const response = JSON.parse(String(publish.mock.calls[0]?.[1])) as { messageType: string; isHandledError: boolean }
		expect(response.messageType).toBe(EBMessageType.CommandErrorResponse)
		expect(response.isHandledError).toBe(false)
	})
})
