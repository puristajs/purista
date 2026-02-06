import { getCommandMessageMock, StatusCode, UnhandledError } from '@purista/core'
import type { Channel } from 'amqplib'
import { describe, expect, it, vi } from 'vitest'

import { AmqpBridge } from './AmqpBridge.impl.js'

describe('AmqpBridge', () => {
	it('uses configured prefix when unregistering commands', async () => {
		const bridge = new AmqpBridge({ namePrefix: 'tenant-a' })
		const close = vi.fn().mockResolvedValue(undefined)

		;(bridge as any).serviceFunctions.set('tenant-a.cmd.Users.1.create', {
			cb: vi.fn(),
			channel: { close } as unknown as Channel,
		})

		await bridge.unregisterCommand({
			serviceName: 'Users',
			serviceVersion: '1',
			serviceTarget: 'create',
		})

		expect(close).toHaveBeenCalledTimes(1)
		expect((bridge as any).serviceFunctions.size).toBe(0)
	})

	it('stores non-shared subscriptions with deterministic key for unregistering', async () => {
		const bridge = new AmqpBridge({ namePrefix: 'tenant-a' })
		const channel = {
			on: vi.fn(),
			assertQueue: vi.fn().mockResolvedValue({ queue: 'amq.gen-random' }),
			bindQueue: vi.fn().mockResolvedValue(undefined),
			consume: vi.fn().mockResolvedValue({ consumerTag: 'ctag-1' }),
			close: vi.fn().mockResolvedValue(undefined),
		}
		;(bridge as any).connection = {
			createChannel: vi.fn().mockResolvedValue(channel),
		}

		const queueKey = await bridge.registerSubscription(
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
			} as any,
			async () => undefined,
		)

		expect(queueKey).toBe('tenant-a.sub.Users.1.onCreated')
		expect((bridge as any).subscriptions.has(queueKey)).toBe(true)

		await bridge.unregisterSubscription({
			serviceName: 'Users',
			serviceVersion: '1',
			serviceTarget: 'onCreated',
		})
		expect(channel.close).toHaveBeenCalledTimes(1)
		expect((bridge as any).subscriptions.size).toBe(0)
	})

	it('rejects invoke immediately and cleans pending invocations when publish throws', async () => {
		const bridge = new AmqpBridge()
		;(bridge as any).channel = {
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

		const input = { ...command } as Record<string, unknown>
		delete input.id
		delete input.correlationId
		delete input.messageType
		delete input.timestamp

		await expect(bridge.invoke(input as any, 50)).rejects.toBeInstanceOf(UnhandledError)
		expect((bridge as any).pendingInvocations.size).toBe(0)
	})

	it('rejects pending invocations during destroy', async () => {
		const bridge = new AmqpBridge({ defaultCommandTimeout: 5 })
		const reject = vi.fn()
		const channel = {
			cancel: vi.fn().mockResolvedValue(undefined),
			close: vi.fn().mockResolvedValue(undefined),
		}
		const connection = {
			close: vi.fn().mockResolvedValue(undefined),
		}

		;(bridge as any).channel = channel
		;(bridge as any).connection = connection
		;(bridge as any).consumerRegistrations = [{ channel, tag: 'ctag-1' }]
		;(bridge as any).pendingInvocations.set('cid-1', { resolve: vi.fn(), reject })

		await bridge.destroy()

		expect(channel.cancel).toHaveBeenCalledWith('ctag-1')
		expect(reject).toHaveBeenCalledTimes(1)
		expect(reject).toHaveBeenCalledWith(expect.objectContaining({ errorCode: StatusCode.ServiceUnavailable }))
		expect((bridge as any).pendingInvocations.size).toBe(0)
		expect(await bridge.isHealthy()).toBe(false)
		expect(await bridge.isReady()).toBe(false)
	})
})
