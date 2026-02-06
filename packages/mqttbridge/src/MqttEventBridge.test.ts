import type { CustomMessage, EBMessage, Subscription } from '@purista/core'
import type { MqttClient } from 'mqtt'
import { describe, expect, it, vi } from 'vitest'
import { MqttBridge } from './MqttEventBridge.js'

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

describe('MqttBridge subscription lifecycle', () => {
	it('unregisters registered subscription topics', async () => {
		const bridge = new MqttBridge()
		const subscribeAsync = vi.fn().mockResolvedValue(undefined)
		const unsubscribeAsync = vi.fn().mockResolvedValue(undefined)
		bridge.client = { subscribeAsync, unsubscribeAsync } as unknown as MqttClient

		const routerRemove = vi.fn()
		;(bridge as unknown as { router: { remove: (topic: string) => void } }).router.remove = routerRemove

		const subscription = getSubscriptionInput()
		const registeredTopic = await bridge.registerSubscription(
			subscription,
			async (_msg: EBMessage): Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined> => {
				return undefined
			},
		)

		await bridge.unregisterSubscription(subscription.subscriber)

		expect(subscribeAsync).toHaveBeenCalledTimes(1)
		expect(unsubscribeAsync).toHaveBeenCalledWith(registeredTopic)
		expect(routerRemove).toHaveBeenCalledWith(registeredTopic)
	})

	it('does nothing for unknown subscription addresses', async () => {
		const bridge = new MqttBridge()
		const unsubscribeAsync = vi.fn().mockResolvedValue(undefined)
		bridge.client = { unsubscribeAsync } as unknown as MqttClient

		await bridge.unregisterSubscription({
			serviceName: 'Unknown',
			serviceVersion: '1',
			serviceTarget: 'missing',
		})

		expect(unsubscribeAsync).not.toHaveBeenCalled()
	})
})
