import type { Span } from '@opentelemetry/api'
import { EBMessageType, getCommandErrorMessageMock, getCommandMessageMock, getLoggerMock } from '@purista/core'
import type { Msg } from 'nats'
import { JSONCodec } from 'nats'
import { describe, expect, it, vi } from 'vitest'

import type { INatsBridge } from '../types/INatsBridge.js'
import { getCommandHandler } from './getCommandHandler.impl.js'

const getSpanMock = () =>
	({
		setAttribute: vi.fn(),
		addEvent: vi.fn(),
		setStatus: vi.fn(),
		recordException: vi.fn(),
		spanContext: vi.fn().mockReturnValue({}),
	}) as unknown as Span

describe('nats getCommandHandler', () => {
	it('publishes command error responses as event when commandResponsePublishTwice is eventAndError', async () => {
		const sc = JSONCodec()
		const command = getCommandMessageMock()
		const response = getCommandErrorMessageMock(undefined, undefined, command)

		const publish = vi.fn()
		const respond = vi.fn()
		const bridge = {
			sc,
			instanceId: 'instance-id',
			logger: getLoggerMock().mock,
			connection: {
				info: { headers: false },
				publish,
			},
			config: {
				topicPrefix: 'purista',
				emptyTopicPartString: '__none__',
				commandResponsePublishTwice: 'eventAndError',
			},
			startActiveSpan: vi
				.fn()
				.mockImplementation(async (_name, _options, _context, fn: (span: Span) => Promise<void>) => fn(getSpanMock())),
			runInFlight: async <T>(fn: () => Promise<T>) => fn(),
		} as unknown as INatsBridge

		const handler = getCommandHandler(command.receiver, async () => response, {} as never, {
			autoacknowledge: true,
			durable: true,
			shared: true,
		}).bind(bridge)

		const msg = {
			data: sc.encode(command),
			respond,
		} as unknown as Msg

		await handler(null, msg)

		expect(respond).toHaveBeenCalledOnce()
		expect(publish).toHaveBeenCalledOnce()
	})

	it('does not publish second time when commandResponsePublishTwice is eventOnly and response has no event', async () => {
		const sc = JSONCodec()
		const command = getCommandMessageMock()
		const response = getCommandErrorMessageMock(undefined, { eventName: undefined }, command)

		const publish = vi.fn()
		const respond = vi.fn()
		const bridge = {
			sc,
			instanceId: 'instance-id',
			logger: getLoggerMock().mock,
			connection: {
				info: { headers: false },
				publish,
			},
			config: {
				topicPrefix: 'purista',
				emptyTopicPartString: '__none__',
				commandResponsePublishTwice: 'eventOnly',
			},
			startActiveSpan: vi
				.fn()
				.mockImplementation(async (_name, _options, _context, fn: (span: Span) => Promise<void>) => fn(getSpanMock())),
			runInFlight: async <T>(fn: () => Promise<T>) => fn(),
		} as unknown as INatsBridge

		const handler = getCommandHandler(command.receiver, async () => response, {} as never, {
			autoacknowledge: true,
			durable: true,
			shared: true,
		}).bind(bridge)

		const msg = {
			data: sc.encode(command),
			respond,
		} as unknown as Msg

		await handler(null, msg)

		expect(respond).toHaveBeenCalledOnce()
		expect(publish).not.toHaveBeenCalled()
	})

	it('returns command error response when command callback throws', async () => {
		const sc = JSONCodec()
		const command = getCommandMessageMock()
		const respond = vi.fn()
		const publish = vi.fn()
		const bridge = {
			sc,
			instanceId: 'instance-id',
			logger: getLoggerMock().mock,
			connection: {
				info: { headers: false },
				publish,
			},
			config: {
				topicPrefix: 'purista',
				emptyTopicPartString: '__none__',
				commandResponsePublishTwice: 'never',
			},
			startActiveSpan: vi
				.fn()
				.mockImplementation(async (_name, _options, _context, fn: (span: Span) => Promise<void>) => fn(getSpanMock())),
			runInFlight: async <T>(fn: () => Promise<T>) => fn(),
		} as unknown as INatsBridge

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

		const msg = {
			data: sc.encode(command),
			respond,
		} as unknown as Msg

		await handler(null, msg)

		expect(respond).toHaveBeenCalledOnce()
		const response = sc.decode(respond.mock.calls[0]?.[0])
		expect(response.messageType).toBe(EBMessageType.CommandErrorResponse)
		expect(response.isHandledError).toBe(false)
		expect(publish).not.toHaveBeenCalled()
	})
})
