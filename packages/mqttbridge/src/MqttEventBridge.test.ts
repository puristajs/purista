import type { CustomMessage, EBMessage, EBMessageAddress, Subscription } from '@purista/core'
import { StatusCode } from '@purista/core'
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
	it('uses a Harness root invocation id as the command transport correlation', async () => {
		const bridge = new MqttBridge()
		let sent: { correlationId?: string } | undefined
		const publishAsync = vi.fn(async (_topic, payload, options) => {
			sent = JSON.parse(String(payload)) as { correlationId?: string }
			const correlationId = options?.properties?.correlationData?.toString()
			if (correlationId) {
				void bridge.pendingInvocations.resolve(correlationId, { ok: true })
			}
		})
		bridge.client = { publishAsync } as unknown as MqttClient

		await expect(
			bridge.invoke({
				sender: { serviceName: 'Client', serviceVersion: '1', serviceTarget: 'api', instanceId: 'client-1' },
				receiver: { serviceName: 'Users', serviceVersion: '1', serviceTarget: 'create' },
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				payload: { payload: { name: 'Ada' }, parameter: {} },
				traceId: 'trace-1',
				harness: {
					contract: { schemaVersion: 1, exportDigest: `sha256:${'a'.repeat(64)}` },
					root: { invocationId: 'harness-root-invocation', sessionId: 'harness-session' },
				},
			} as never),
		).resolves.toEqual({ ok: true })

		expect(sent?.correlationId).toBe('harness-root-invocation')
		expect(publishAsync.mock.calls[0]?.[2]?.properties?.correlationData?.toString()).toBe('harness-root-invocation')
	})

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
