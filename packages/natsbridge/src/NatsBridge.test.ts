import type { CustomMessage, EBMessage, Subscription } from '@purista/core'
import { StatusCode, type UnhandledError } from '@purista/core'
import type { NatsConnection, Subscription as NatsSubscription } from 'nats'
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

		await bridge.registerSubscription(
			subscription,
			async (_msg: EBMessage): Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined> => {
				return undefined
			},
		)

		const key = `${subscription.subscriber.serviceName}-${subscription.subscriber.serviceVersion},${subscription.subscriber.serviceTarget}`
		expect(bridge.subscriptions.get(key)).toBe(natsSubscription)

		await bridge.unregisterSubscription(subscription.subscriber)

		expect(unsubscribe).toHaveBeenCalledTimes(1)
		expect(drain).toHaveBeenCalledTimes(1)
	})
})
