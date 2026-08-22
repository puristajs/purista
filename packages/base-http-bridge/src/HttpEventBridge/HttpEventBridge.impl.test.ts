import { EventEmitter } from 'node:events'

import type { CommandResponse, EBMessage, EBMessageAddress, HttpExposedServiceMeta } from '@purista/core/adapter'
import { StatusCode, UnhandledError } from '@purista/core/adapter'
import { describe, expect, it, vi } from 'vitest'
import { HttpEventBridge } from './HttpEventBridge.impl.js'

class FakeServer extends EventEmitter {
	closeIdleConnections() {}

	close(cb?: () => void) {
		this.emit('close')
		cb?.()
		return this
	}
}

const createClient = () => ({
	getInternalPathForCommand: (_address: EBMessageAddress) => '/purista/command/test',
	getApiPathForCommand: (_address: EBMessageAddress, _metadata: HttpExposedServiceMeta) => '/api/v1/test',
	getInternalPathForSubscription: (_address: EBMessageAddress) => '/purista/subscription/test',
	invoke: async (_command: unknown, _headers?: Record<string, string>, _ttl?: number): Promise<CommandResponse> =>
		({ payload: { ok: true } }) as never,
	sendEvent: async (_message: EBMessage) => undefined,
	isSidecarAvailable: async () => true,
})

describe('HttpEventBridge lifecycle', () => {
	it('transitions readiness and shutdown flags during start/destroy', async () => {
		const server = new FakeServer()
		const bridge = new HttpEventBridge(
			{
				serve: () => server as never,
			},
			createClient(),
		)

		await bridge.start()

		expect(await bridge.isReady()).toBe(true)
		expect(await bridge.isHealthy()).toBe(true)

		await bridge.destroy()

		expect(await bridge.isReady()).toBe(false)
		expect(await bridge.isHealthy()).toBe(false)
	})

	it('forwards invoke ttl to the sidecar client', async () => {
		const server = new FakeServer()
		const client = createClient()
		const invoke = vi.fn(client.invoke)
		client.invoke = invoke

		const bridge = new HttpEventBridge(
			{
				serve: () => server as never,
			},
			client,
		)

		await bridge.invoke(
			{
				sender: {
					serviceName: 'sender',
					serviceVersion: '1',
					serviceTarget: 'source',
					instanceId: 'sender-instance',
				},
				receiver: {
					serviceName: 'receiver',
					serviceVersion: '1',
					serviceTarget: 'target',
				},
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				payload: { payload: {}, parameter: {} },
				traceId: 'trace-1',
				principalId: 'principal',
				tenantId: 'tenant',
			},
			321,
		)

		expect(invoke).toHaveBeenCalledTimes(1)
		expect(invoke.mock.calls[0]?.[2]).toBe(321)
	})

	it('propagates sidecar invoke timeout errors', async () => {
		const server = new FakeServer()
		const client = createClient()
		client.invoke = async () => {
			throw new UnhandledError(StatusCode.GatewayTimeout, 'sidecar timeout')
		}

		const bridge = new HttpEventBridge(
			{
				serve: () => server as never,
			},
			client,
		)

		await expect(
			bridge.invoke({
				sender: {
					serviceName: 'sender',
					serviceVersion: '1',
					serviceTarget: 'source',
					instanceId: 'sender-instance',
				},
				receiver: {
					serviceName: 'receiver',
					serviceVersion: '1',
					serviceTarget: 'target',
				},
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				payload: { payload: {}, parameter: {} },
				traceId: 'trace-2',
				principalId: 'principal',
				tenantId: 'tenant',
			}),
		).rejects.toMatchObject({ errorCode: StatusCode.GatewayTimeout })
	})
})
