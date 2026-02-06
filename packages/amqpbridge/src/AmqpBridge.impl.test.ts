import {
	getCommandMessageMock,
	type PendigInvocation,
	StatusCode,
	type Subscription,
	UnhandledError,
} from '@purista/core'
import type { Channel } from 'amqplib'
import { describe, expect, it, vi } from 'vitest'

import { AmqpBridge } from './AmqpBridge.impl.js'

type BridgeInternals = {
	serviceFunctions: Map<string, { cb: (message: unknown) => Promise<unknown>; channel: Channel }>
	subscriptions: Map<string, { cb: (message: unknown) => Promise<unknown>; channel: Channel }>
	pendingInvocations: Map<string, PendigInvocation>
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

		const queueKey = await bridge.registerSubscription(
			subscription,
			async () => undefined,
		)

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

	it('rejects pending invocations during destroy', async () => {
		const bridge = new AmqpBridge({ defaultCommandTimeout: 5 })
		const internals = getBridgeInternals(bridge)
		const reject = vi.fn()
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
		internals.pendingInvocations.set('cid-1', { resolve: vi.fn(), reject })

		await bridge.destroy()

		expect(channel.cancel).toHaveBeenCalledWith('ctag-1')
		expect(reject).toHaveBeenCalledTimes(1)
		expect(reject).toHaveBeenCalledWith(expect.objectContaining({ errorCode: StatusCode.ServiceUnavailable }))
		expect(internals.pendingInvocations.size).toBe(0)
		expect(await bridge.isHealthy()).toBe(false)
		expect(await bridge.isReady()).toBe(false)
	})
})
