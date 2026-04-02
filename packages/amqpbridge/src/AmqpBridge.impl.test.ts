import {
	getCommandMessageMock,
	getCommandSuccessMessageMock,
	type PendingInvocationRegistry,
	StatusCode,
	type Subscription,
	SubscriptionConsumerControlError,
	UnhandledError,
} from '@purista/core'
import type { Channel } from 'amqplib'
import { describe, expect, it, vi } from 'vitest'

import { AmqpBridge } from './AmqpBridge.impl.js'

type BridgeInternals = {
	serviceFunctions: Map<string, { cb: (message: unknown) => Promise<unknown>; channel: Channel }>
	subscriptions: Map<
		string,
		{
			cb: (message: unknown) => Promise<unknown>
			channel: Channel
			queueName: string
			noAck: boolean
			consumeHandler: (msg: unknown) => Promise<unknown>
			consumerTag?: string
		}
	>
	pausedSubscriptionConsumers: Map<string, { pausedAt: number; reason: string }>
	pendingInvocations: PendingInvocationRegistry<unknown>
	connection?: { createChannel?: () => Promise<unknown>; close?: () => Promise<unknown> }
	channel?: {
		publish?: (...args: unknown[]) => unknown
		cancel?: (tag: string) => Promise<unknown>
		close?: () => Promise<unknown>
	}
	consumerRegistrations: { channel: { cancel: (tag: string) => Promise<unknown> }; tag: string }[]
}

const getBridgeInternals = (bridge: AmqpBridge) => bridge as unknown as BridgeInternals

describe('AmqpBridge', () => {
	it('uses configured prefix when unregistering commands', async () => {
		const bridge = new AmqpBridge({ namePrefix: 'tenant-a' })
		const internals = getBridgeInternals(bridge)
		const close = vi.fn().mockResolvedValue(undefined)

		internals.serviceFunctions.set('tenant-a.cmd.Users.1.create', {
			cb: vi.fn(),
			channel: { close } as unknown as Channel,
		})

		await bridge.unregisterCommand({
			serviceName: 'Users',
			serviceVersion: '1',
			serviceTarget: 'create',
		})

		expect(close).toHaveBeenCalledTimes(1)
		expect(internals.serviceFunctions.size).toBe(0)
	})

	it('stores non-shared subscriptions with deterministic key for unregistering', async () => {
		const bridge = new AmqpBridge({ namePrefix: 'tenant-a' })
		const internals = getBridgeInternals(bridge)
		const channel = {
			on: vi.fn(),
			assertQueue: vi.fn().mockResolvedValue({ queue: 'amq.gen-random' }),
			bindQueue: vi.fn().mockResolvedValue(undefined),
			consume: vi.fn().mockResolvedValue({ consumerTag: 'ctag-1' }),
			close: vi.fn().mockResolvedValue(undefined),
		}
		internals.connection = {
			createChannel: vi.fn().mockResolvedValue(channel),
		}
		const subscription: Subscription = {
			subscriber: {
				serviceName: 'Users',
				serviceVersion: '1',
				serviceTarget: 'onCreated',
			},
			eventBridgeConfig: {
				shared: false,
				durable: false,
				autoacknowledge: false,
			},
		}

		const queueKey = await bridge.registerSubscription(subscription, async () => undefined)

		expect(queueKey).toBe('tenant-a.sub.Users.1.onCreated')
		expect(internals.subscriptions.has(queueKey)).toBe(true)

		await bridge.unregisterSubscription({
			serviceName: 'Users',
			serviceVersion: '1',
			serviceTarget: 'onCreated',
		})
		expect(channel.close).toHaveBeenCalledTimes(1)
		expect(internals.subscriptions.size).toBe(0)
	})

	it('rejects invoke immediately and cleans pending invocations when publish throws', async () => {
		const bridge = new AmqpBridge()
		const internals = getBridgeInternals(bridge)
		internals.channel = {
			publish: vi.fn(() => {
				throw new Error('publish failed')
			}),
		}

		const command = getCommandMessageMock({
			receiver: {
				serviceName: 'Users',
				serviceVersion: '1',
				serviceTarget: 'create',
				instanceId: 'receiver-instance',
			},
			sender: {
				serviceName: 'Client',
				serviceVersion: '1',
				serviceTarget: 'api',
				instanceId: 'sender-instance',
			},
			payload: {
				payload: { name: 'Ada' },
				parameter: {},
			},
		})

		const { id, correlationId, messageType, timestamp, ...input } = command
		void id
		void correlationId
		void messageType
		void timestamp

		await expect(bridge.invoke(input, 50)).rejects.toBeInstanceOf(UnhandledError)
		expect(internals.pendingInvocations.size).toBe(0)
	})

	it('throws typed service unavailable error when registering command without connection', async () => {
		const bridge = new AmqpBridge()

		await expect(
			bridge.registerCommand(
				{
					serviceName: 'Users',
					serviceVersion: '1',
					serviceTarget: 'create',
				},
				async () => getCommandSuccessMessageMock({}),
				{} as never,
				{
					autoacknowledge: true,
					durable: true,
					shared: true,
				},
			),
		).rejects.toMatchObject({
			errorCode: StatusCode.ServiceUnavailable,
		})
	})

	it('throws typed service unavailable error when registering subscription without connection', async () => {
		const bridge = new AmqpBridge()

		await expect(
			bridge.registerSubscription(
				{
					subscriber: {
						serviceName: 'Users',
						serviceVersion: '1',
						serviceTarget: 'onCreated',
					},
					eventBridgeConfig: {
						shared: false,
						durable: false,
						autoacknowledge: false,
					},
				},
				async () => undefined,
			),
		).rejects.toMatchObject({
			errorCode: StatusCode.ServiceUnavailable,
		})
	})

	it('rejects pending invocations during destroy', async () => {
		const bridge = new AmqpBridge({ defaultCommandTimeout: 5 })
		const internals = getBridgeInternals(bridge)
		const channel = {
			cancel: vi.fn().mockResolvedValue(undefined),
			close: vi.fn().mockResolvedValue(undefined),
		}
		const connection = {
			close: vi.fn().mockResolvedValue(undefined),
		}

		internals.channel = channel
		internals.connection = connection
		internals.consumerRegistrations = [{ channel, tag: 'ctag-1' }]
		const pendingInvocation = internals.pendingInvocations.register('cid-1', 1_000, 'trace-1')

		await bridge.destroy()

		expect(channel.cancel).toHaveBeenCalledWith('ctag-1')
		await expect(pendingInvocation).rejects.toMatchObject({ errorCode: StatusCode.ServiceUnavailable })
		expect(internals.pendingInvocations.size).toBe(0)
		expect(await bridge.isHealthy()).toBe(false)
		expect(await bridge.isReady()).toBe(false)
	})

	it('uses non-auto-delete durable command queues with manual ack', async () => {
		const bridge = new AmqpBridge({ prefetch: 5 })
		const internals = getBridgeInternals(bridge)
		const channel = {
			on: vi.fn(),
			prefetch: vi.fn().mockResolvedValue(undefined),
			assertQueue: vi.fn().mockResolvedValue({ queue: 'purista.cmd.Users.1.create' }),
			bindQueue: vi.fn().mockResolvedValue(undefined),
			consume: vi.fn().mockResolvedValue({ consumerTag: 'ctag-1' }),
		}
		internals.connection = {
			createChannel: vi.fn().mockResolvedValue(channel),
		}
		vi.spyOn(bridge, 'emitMessage').mockResolvedValue({} as never)

		await bridge.registerCommand(
			{
				serviceName: 'Users',
				serviceVersion: '1',
				serviceTarget: 'create',
			},
			async () => getCommandSuccessMessageMock({}),
			{} as never,
			{
				autoacknowledge: true,
				durable: true,
				shared: true,
			},
		)

		expect(channel.prefetch).toHaveBeenCalledWith(5)
		expect(channel.assertQueue).toHaveBeenCalledWith(
			'purista.cmd.Users.1.create',
			expect.objectContaining({
				durable: true,
				autoDelete: false,
			}),
		)
		expect(channel.consume).toHaveBeenCalledWith(
			'purista.cmd.Users.1.create',
			expect.any(Function),
			expect.objectContaining({ noAck: false }),
		)
	})

	it('retries subscription messages with incremented attempt header via broker delay queue before dead-lettering', async () => {
		const bridge = new AmqpBridge()
		const internals = getBridgeInternals(bridge)
		const consumeHandlers: Array<(msg: unknown) => Promise<void>> = []
		const channel = {
			on: vi.fn(),
			assertQueue: vi.fn().mockResolvedValue({ queue: 'purista.sub.Users.1.onCreated' }),
			bindQueue: vi.fn().mockResolvedValue(undefined),
			consume: vi.fn().mockImplementation(async (_queue, handler) => {
				consumeHandlers.push(handler)
				return { consumerTag: 'ctag-1' }
			}),
			ack: vi.fn(),
			nack: vi.fn(),
			sendToQueue: vi.fn(),
			close: vi.fn().mockResolvedValue(undefined),
		}
		internals.connection = {
			createChannel: vi.fn().mockResolvedValue(channel),
		}

		await bridge.registerSubscription(
			{
				subscriber: {
					serviceName: 'Users',
					serviceVersion: '1',
					serviceTarget: 'onCreated',
				},
				eventBridgeConfig: {
					shared: true,
					durable: true,
					autoacknowledge: false,
					consumerFailureHandling: {
						maxAttempts: 3,
						retryDelayMs: 100,
						deadLetterTarget: 'Users.onCreated.dead-letter',
					},
				},
			},
			async () => {
				throw new Error('boom')
			},
		)

		await consumeHandlers[0]({
			content: Buffer.from(
				JSON.stringify(
					getCommandSuccessMessageMock(
						{},
						{
							eventName: 'user.created',
						},
					),
				),
			),
			properties: {
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				headers: {},
			},
		})
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(channel.assertQueue).toHaveBeenCalledWith(
			'purista.sub.Users.1.onCreated.retry.100',
			expect.objectContaining({
				durable: true,
				arguments: expect.objectContaining({
					'x-message-ttl': 100,
					'x-dead-letter-exchange': '',
					'x-dead-letter-routing-key': 'purista.sub.Users.1.onCreated',
				}),
			}),
		)
		expect(channel.sendToQueue).toHaveBeenCalledWith(
			'purista.sub.Users.1.onCreated.retry.100',
			expect.any(Buffer),
			expect.objectContaining({
				headers: expect.objectContaining({
					'x-purista-retry-attempt': 2,
				}),
			}),
		)
		expect(channel.ack).toHaveBeenCalledTimes(1)
		expect(channel.nack).not.toHaveBeenCalled()
	})

	it('dead-letters subscription messages when the retry budget is exhausted', async () => {
		const bridge = new AmqpBridge()
		const internals = getBridgeInternals(bridge)
		const consumeHandlers: Array<(msg: unknown) => Promise<void>> = []
		const channel = {
			on: vi.fn(),
			assertQueue: vi.fn().mockResolvedValue({ queue: 'purista.sub.Users.1.onCreated' }),
			bindQueue: vi.fn().mockResolvedValue(undefined),
			consume: vi.fn().mockImplementation(async (_queue, handler) => {
				consumeHandlers.push(handler)
				return { consumerTag: 'ctag-1' }
			}),
			ack: vi.fn(),
			nack: vi.fn(),
			sendToQueue: vi.fn(),
			close: vi.fn().mockResolvedValue(undefined),
		}
		internals.connection = {
			createChannel: vi.fn().mockResolvedValue(channel),
		}

		await bridge.registerSubscription(
			{
				subscriber: {
					serviceName: 'Users',
					serviceVersion: '1',
					serviceTarget: 'onCreated',
				},
				eventBridgeConfig: {
					shared: true,
					durable: true,
					autoacknowledge: false,
					consumerFailureHandling: {
						maxAttempts: 2,
						deadLetterTarget: 'Users.onCreated.dead-letter',
					},
				},
			},
			async () => {
				throw new Error('poison')
			},
		)

		await consumeHandlers[0]({
			content: Buffer.from(
				JSON.stringify(
					getCommandSuccessMessageMock(
						{},
						{
							eventName: 'user.created',
						},
					),
				),
			),
			properties: {
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				headers: {
					'x-purista-retry-attempt': 2,
				},
			},
		})
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(channel.sendToQueue).toHaveBeenCalledWith(
			'Users.onCreated.dead-letter',
			expect.any(Buffer),
			expect.objectContaining({
				headers: expect.objectContaining({
					'x-purista-dead-letter-reason': 'poison',
				}),
			}),
		)
		expect(channel.ack).toHaveBeenCalledTimes(1)
	})

	it('drops subscription messages when control outcome is drop', async () => {
		const bridge = new AmqpBridge()
		const internals = getBridgeInternals(bridge)
		const consumeHandlers: Array<(msg: unknown) => Promise<void>> = []
		const channel = {
			on: vi.fn(),
			assertQueue: vi.fn().mockResolvedValue({ queue: 'purista.sub.Users.1.onCreated' }),
			bindQueue: vi.fn().mockResolvedValue(undefined),
			consume: vi.fn().mockImplementation(async (_queue, handler) => {
				consumeHandlers.push(handler)
				return { consumerTag: 'ctag-1' }
			}),
			ack: vi.fn(),
			nack: vi.fn(),
			sendToQueue: vi.fn(),
		}
		internals.connection = {
			createChannel: vi.fn().mockResolvedValue(channel),
		}

		await bridge.registerSubscription(
			{
				subscriber: {
					serviceName: 'Users',
					serviceVersion: '1',
					serviceTarget: 'onCreated',
				},
				eventBridgeConfig: {
					shared: true,
					durable: true,
					autoacknowledge: false,
					consumerFailureHandling: {
						maxAttempts: 2,
						deadLetterTarget: 'Users.onCreated.dead-letter',
					},
				},
			},
			async () => {
				throw new SubscriptionConsumerControlError('drop', 'ignore this event')
			},
		)

		await consumeHandlers[0]({
			content: Buffer.from(
				JSON.stringify(
					getCommandSuccessMessageMock(
						{},
						{
							eventName: 'user.created',
						},
					),
				),
			),
			properties: {
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				headers: {},
			},
		})
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(channel.ack).toHaveBeenCalledTimes(1)
		expect(channel.nack).not.toHaveBeenCalled()
		expect(channel.sendToQueue).not.toHaveBeenCalled()
	})

	it('pauses and resumes subscription consumers for stop-consumer control outcomes', async () => {
		const bridge = new AmqpBridge()
		const internals = getBridgeInternals(bridge)
		const consumeHandlers: Array<(msg: unknown) => Promise<void>> = []
		const channel = {
			on: vi.fn(),
			assertQueue: vi.fn().mockResolvedValue({ queue: 'purista.sub.Users.1.onCreated' }),
			bindQueue: vi.fn().mockResolvedValue(undefined),
			consume: vi.fn().mockImplementation(async (_queue, handler) => {
				consumeHandlers.push(handler)
				return { consumerTag: `ctag-${consumeHandlers.length}` }
			}),
			ack: vi.fn(),
			nack: vi.fn(),
			cancel: vi.fn().mockResolvedValue(undefined),
		}
		internals.connection = {
			createChannel: vi.fn().mockResolvedValue(channel),
		}

		const key = await bridge.registerSubscription(
			{
				subscriber: {
					serviceName: 'Users',
					serviceVersion: '1',
					serviceTarget: 'onCreated',
				},
				eventBridgeConfig: {
					shared: true,
					durable: true,
					autoacknowledge: false,
					consumerFailureHandling: {
						maxAttempts: 2,
						deadLetterTarget: 'Users.onCreated.dead-letter',
					},
				},
			},
			async () => {
				throw new SubscriptionConsumerControlError('stop-consumer', 'poison sequence detected')
			},
		)

		await consumeHandlers[0]({
			content: Buffer.from(
				JSON.stringify(
					getCommandSuccessMessageMock(
						{},
						{
							eventName: 'user.created',
						},
					),
				),
			),
			properties: {
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				headers: {},
			},
		})
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(channel.cancel).toHaveBeenCalledWith('ctag-1')
		expect(internals.pausedSubscriptionConsumers.has(key)).toBe(true)
		expect(bridge.getPausedSubscriptionConsumers()[key]?.reason).toBe('poison sequence detected')

		await bridge.resumeSubscriptionConsumer(key)

		expect(channel.consume).toHaveBeenCalledTimes(2)
		expect(internals.pausedSubscriptionConsumers.has(key)).toBe(false)
	})
})
