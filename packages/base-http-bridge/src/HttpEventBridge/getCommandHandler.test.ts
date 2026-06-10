import type { Span } from '@opentelemetry/api'
import type { DefinitionEventBridgeConfig, EBMessageAddress, HttpExposedServiceMeta } from '@purista/core'
import {
	EBMessageType,
	getCommandMessageMock,
	getCommandSuccessMessageMock,
	getLoggerMock,
	StatusCode,
} from '@purista/core'
import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'

import { getCommandHandler } from './getCommandHandler.impl.js'
import type { IHttpEventBridge } from './types/IHttpEventBridge.js'

const createBridgeMock = (): IHttpEventBridge => {
	const spanMock = {
		setAttribute: vi.fn(),
		recordException: vi.fn(),
		end: vi.fn(),
	} as unknown as Span

	return {
		config: {
			defaultCommandTimeout: 1000,
		},
		logger: getLoggerMock().mock,
		emitMessage: vi.fn().mockResolvedValue(undefined),
		startActiveSpan: vi
			.fn()
			.mockImplementation(async (_name, _options, _context, fn: (span: Span) => Promise<Response>) => fn(spanMock)),
	} as unknown as IHttpEventBridge
}

const address: EBMessageAddress = {
	serviceName: 'service',
	serviceVersion: '1',
	serviceTarget: 'target',
}

const metadata: HttpExposedServiceMeta = {
	expose: {
		http: {
			method: 'POST',
			path: '/command',
			openApi: {
				isSecure: false,
				description: 'test',
				summary: 'test',
			},
		},
	},
}

const eventBridgeConfig: DefinitionEventBridgeConfig = {
	durable: true,
	autoacknowledge: true,
	shared: true,
}

describe('getCommandHandler', () => {
	it('returns a command response envelope for non-empty payloads', async () => {
		const bridge = createBridgeMock()
		const inputMessage = getCommandMessageMock<{ a: number }, { b: number }>({
			payload: { payload: { a: 1 }, parameter: { b: 2 } },
		})

		const cb = vi.fn(async () =>
			getCommandSuccessMessageMock(
				{ ok: true },
				{
					messageType: EBMessageType.CommandSuccessResponse,
				},
				inputMessage,
			),
		)

		const handler = getCommandHandler.call(bridge, address, cb, metadata, eventBridgeConfig)
		const app = new Hono()
		app.post('/command', handler)

		const response = await app.request('http://localhost/command', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(inputMessage),
		})

		expect(response.status).toBe(StatusCode.OK)
		const body = (await response.json()) as { payload?: { ok: boolean }; messageType?: string }
		expect(body.messageType).toBe(EBMessageType.CommandSuccessResponse)
		expect(body.payload).toEqual({ ok: true })
	})

	it('returns no-content for empty payload responses', async () => {
		const bridge = createBridgeMock()
		const inputMessage = getCommandMessageMock()
		const cb = vi.fn(async () => getCommandSuccessMessageMock(undefined, undefined, inputMessage))

		const handler = getCommandHandler.call(bridge, address, cb, metadata, eventBridgeConfig)
		const app = new Hono()
		app.post('/command', handler)

		const response = await app.request('http://localhost/command', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(inputMessage),
		})

		expect(response.status).toBe(StatusCode.NoContent)
	})

	it('returns no-content for null payload responses', async () => {
		const bridge = createBridgeMock()
		const inputMessage = getCommandMessageMock()
		const cb = vi.fn(async () => getCommandSuccessMessageMock(null, undefined, inputMessage))

		const handler = getCommandHandler.call(bridge, address, cb, metadata, eventBridgeConfig)
		const app = new Hono()
		app.post('/command', handler)

		const response = await app.request('http://localhost/command', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(inputMessage),
		})

		expect(response.status).toBe(StatusCode.NoContent)
	})

	it('unwraps structured JSON CloudEvents when configured', async () => {
		const bridge = createBridgeMock()
		const inputMessage = getCommandMessageMock<{ a: number }, { b: number }>({
			payload: { payload: { a: 1 }, parameter: { b: 2 } },
		})
		const cb = vi.fn(async () => getCommandSuccessMessageMock({ ok: true }, undefined, inputMessage))
		const handler = getCommandHandler.call(bridge, address, cb, metadata, eventBridgeConfig, true)
		const app = new Hono()
		app.post('/command', handler)

		const response = await app.request('http://localhost/command', {
			method: 'POST',
			headers: {
				'content-type': 'application/cloudevents+json',
			},
			body: JSON.stringify({
				specversion: '1.0',
				id: 'event-1',
				source: '/test',
				type: 'purista.command',
				data: inputMessage,
			}),
		})

		expect(response.status).toBe(StatusCode.OK)
		expect(cb).toHaveBeenCalledWith(expect.objectContaining({ id: inputMessage.id }))
	})

	it('unwraps binary JSON CloudEvents when configured', async () => {
		const bridge = createBridgeMock()
		const inputMessage = getCommandMessageMock()
		const cb = vi.fn(async () => getCommandSuccessMessageMock({ ok: true }, undefined, inputMessage))
		const handler = getCommandHandler.call(bridge, address, cb, metadata, eventBridgeConfig, true)
		const app = new Hono()
		app.post('/command', handler)

		const response = await app.request('http://localhost/command', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'ce-specversion': '1.0',
				'ce-id': 'event-1',
				'ce-source': '/test',
				'ce-type': 'purista.command',
			},
			body: JSON.stringify(inputMessage),
		})

		expect(response.status).toBe(StatusCode.OK)
		expect(cb).toHaveBeenCalledWith(expect.objectContaining({ id: inputMessage.id }))
	})
})
