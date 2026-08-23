import type { CustomMessage, EBMessage, EBMessageAddress, Subscription } from '@purista/core/adapter'
import { StatusCode } from '@purista/core/adapter'
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
	it('throws service unavailable for registerCommand when not connected', async () => {
		const bridge = new MqttBridge()

		const address: EBMessageAddress = {
			serviceName: 'User',
			serviceVersion: '1',
			serviceTarget: 'create',
		}

		await expect(
			bridge.registerCommand(address, async () => ({}) as never, {} as never, {
				autoacknowledge: true,
				durable: true,
				shared: true,
			}),
		).rejects.toMatchObject({ errorCode: StatusCode.ServiceUnavailable })
	})

	it('throws service unavailable for unregisterCommand when not connected', async () => {
		const bridge = new MqttBridge()
		const address: EBMessageAddress = {
			serviceName: 'User',
			serviceVersion: '1',
			serviceTarget: 'create',
		}

		await expect(bridge.unregisterCommand(address)).rejects.toMatchObject({
			errorCode: StatusCode.ServiceUnavailable,
		})
	})

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

	it('throws service unavailable for emitMessage when not connected', async () => {
		const bridge = new MqttBridge()

		await expect(
			bridge.emitMessage({
				messageType: 'custom',
				traceId: 'trace',
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				sender: {
					serviceName: 'Sender',
					serviceVersion: '1',
					serviceTarget: 'source',
				},
				receiver: {
					serviceName: 'Receiver',
					serviceVersion: '1',
					serviceTarget: 'target',
				},
				payload: {},
				otp: '{}',
			} as never),
		).rejects.toMatchObject({
			errorCode: StatusCode.ServiceUnavailable,
		})
	})
})
