import type { CustomMessage, EBMessage, Subscription } from '@purista/core/adapter'
import { StatusCode, type UnhandledError } from '@purista/core/adapter'
import type { JetStreamClient, JetStreamSubscription, NatsConnection, Subscription as NatsSubscription } from 'nats'
import { describe, expect, it, vi } from 'vitest'
import { NatsBridge } from './NatsBridge.js'

const getSubscriptionInput = (): Subscription => ({
	subscriber: {
		serviceName: 'User',
		serviceVersion: '1',
		serviceTarget: 'sendWelcomeEmail',
	},
	eventName: 'user.created',
	eventBridgeConfig: {
		autoacknowledge: false,
		durable: false,
		shared: true,
	},
})

describe('NatsBridge registerSubscription', () => {
	it('throws when the bridge is not connected', async () => {
		const bridge = new NatsBridge()

		await expect(bridge.registerSubscription(getSubscriptionInput(), async () => undefined)).rejects.toMatchObject({
			errorCode: StatusCode.ServiceUnavailable,
		} satisfies Partial<UnhandledError>)
	})

	it('stores and unregisters created subscriptions', async () => {
		const bridge = new NatsBridge()
		const unsubscribe = vi.fn()
		const drain = vi.fn().mockResolvedValue(undefined)
		const natsSubscription = { unsubscribe, drain } as unknown as NatsSubscription
		const subscribe = vi.fn().mockReturnValue(natsSubscription)
		bridge.connection = { subscribe } as unknown as NatsConnection
		const subscription = getSubscriptionInput()
		subscription.eventBridgeConfig.autoacknowledge = true

		await bridge.registerSubscription(
			subscription,
			async (_msg: EBMessage): Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined> => {
				return undefined
			},
		)

		const key = `${subscription.subscriber.serviceName}-${subscription.subscriber.serviceVersion},${subscription.subscriber.serviceTarget}`
		expect(bridge.subscriptions.get(key)?.subscription).toBe(natsSubscription)

		await bridge.unregisterSubscription(subscription.subscriber)

		expect(unsubscribe).toHaveBeenCalledTimes(1)
		expect(drain).toHaveBeenCalledTimes(1)
	})

	it('rejects registrations requiring JetStream in strict mode when broker support is unavailable', async () => {
		const bridge = new NatsBridge()
		bridge.connection = { subscribe: vi.fn() } as unknown as NatsConnection
		const subscription = getSubscriptionInput()
		subscription.eventBridgeConfig.durable = true

		await expect(bridge.registerSubscription(subscription, async () => undefined)).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
		} satisfies Partial<UnhandledError>)
	})

	it('uses JetStream consumers for manual-ack subscriptions even without durable backlog', async () => {
		const bridge = new NatsBridge()
		const jetStreamSubscription = {
			unsubscribe: vi.fn(),
			destroy: vi.fn().mockResolvedValue(undefined),
		} as unknown as JetStreamSubscription
		const subscribe = vi.fn().mockResolvedValue(jetStreamSubscription)
		const find = vi
			.fn()
			.mockRejectedValueOnce(new Error('not found'))
			.mockResolvedValue('purista_subscription_user_created')
		const add = vi.fn().mockResolvedValue(undefined)
		bridge.connection = { subscribe: vi.fn() } as unknown as NatsConnection
		bridge.isJetStreamEnabled = true
		bridge.js = { subscribe } as unknown as JetStreamClient
		bridge.jsm = {
			streams: { find, add },
		} as never

		const subscription = getSubscriptionInput()
		subscription.eventBridgeConfig.durable = false
		subscription.eventBridgeConfig.autoacknowledge = false

		await bridge.registerSubscription(subscription, async () => undefined)

		expect(subscribe).toHaveBeenCalledTimes(1)
	})

	it('uses JetStream durable consumers when JetStream is available', async () => {
		const bridge = new NatsBridge()
		const jetStreamSubscription = {
			unsubscribe: vi.fn(),
			destroy: vi.fn().mockResolvedValue(undefined),
		} as unknown as JetStreamSubscription
		const subscribe = vi.fn().mockResolvedValue(jetStreamSubscription)
		const find = vi
			.fn()
			.mockRejectedValueOnce(new Error('not found'))
			.mockResolvedValue('purista_subscription_user_created')
		const add = vi.fn().mockResolvedValue(undefined)
		bridge.connection = { subscribe: vi.fn() } as unknown as NatsConnection
		bridge.isJetStreamEnabled = true
		bridge.js = { subscribe } as unknown as JetStreamClient
		bridge.jsm = {
			streams: { find, add },
		} as never

		const subscription = getSubscriptionInput()
		subscription.eventBridgeConfig.durable = true

		await bridge.registerSubscription(subscription, async () => undefined)

		expect(add).toHaveBeenCalledTimes(1)
		expect(subscribe).toHaveBeenCalledTimes(1)
		const key = `${subscription.subscriber.serviceName}-${subscription.subscriber.serviceVersion},${subscription.subscriber.serviceTarget}`
		expect(bridge.subscriptions.get(key)?.subscription).toBe(jetStreamSubscription)
	})
})
