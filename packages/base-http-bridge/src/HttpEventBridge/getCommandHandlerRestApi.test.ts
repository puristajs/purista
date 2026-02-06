import type { Span } from '@opentelemetry/api'
import type {
	Command,
	CommandSuccessResponse,
	DefinitionEventBridgeConfig,
	EBMessageAddress,
	HttpExposedServiceMeta,
} from '@purista/core'
import { EBMessageType, getLoggerMock, StatusCode } from '@purista/core'
import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'

import { getCommandHandlerRestApi } from './getCommandHandlerRestApi.impl.js'
import type { IHttpEventBridge } from './types/IHttpEventBridge.js'

const createBridgeMock = (): IHttpEventBridge => {
	const spanMock = {
		setAttribute: vi.fn(),
		setStatus: vi.fn(),
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

const eventBridgeConfig: DefinitionEventBridgeConfig = {
	durable: true,
	autoacknowledge: true,
	shared: true,
}

describe('getCommandHandlerRestApi', () => {
	it('parses query and route params and returns proper json body', async () => {
		const bridge = createBridgeMock()

		const metadata: HttpExposedServiceMeta = {
			expose: {
				http: {
					method: 'GET',
					path: '/v1/:id',
					openApi: {
						isSecure: false,
						description: 'test',
						summary: 'test',
						query: [{ name: 'required' as never, required: true }],
					},
				},
			},
		}

		const cb = vi.fn(async (message: Command) => {
			return {
				messageType: EBMessageType.CommandSuccessResponse,
				payload: {
					ok: true,
					parameter: message.payload.parameter,
				},
			} as Readonly<Omit<CommandSuccessResponse, 'instanceId'>>
		})

		const handler = getCommandHandlerRestApi.call(bridge, address, cb, metadata, eventBridgeConfig)
		const app = new Hono()
		app.get('/v1/:id', handler)

		const response = await app.request('http://localhost/v1/abc?required=value')

		expect(response.status).toBe(StatusCode.OK)
		expect(response.headers.get('content-type')).toContain('application/json')
		await expect(response.json()).resolves.toEqual({
			ok: true,
			parameter: {
				required: 'value',
				id: 'abc',
			},
		})
	})

	it('returns bad request for invalid json payload on json endpoints', async () => {
		const bridge = createBridgeMock()

		const metadata: HttpExposedServiceMeta = {
			expose: {
				contentTypeRequest: 'application/json',
				http: {
					method: 'POST',
					path: '/v1/test',
					openApi: {
						isSecure: false,
						description: 'test',
						summary: 'test',
					},
				},
			},
		}

		const cb = vi.fn()

		const handler = getCommandHandlerRestApi.call(bridge, address, cb, metadata, eventBridgeConfig)
		const app = new Hono()
		app.post('/v1/test', handler)

		const response = await app.request('http://localhost/v1/test', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: '{"broken-json"',
		})

		expect(response.status).toBe(StatusCode.BadRequest)
		const body = (await response.json()) as { message?: string }
		expect(body.message).toBeDefined()
		expect(cb).not.toHaveBeenCalled()
	})

	it('returns no-content for null response payload', async () => {
		const bridge = createBridgeMock()

		const metadata: HttpExposedServiceMeta = {
			expose: {
				http: {
					method: 'GET',
					path: '/v1/null',
					openApi: {
						isSecure: false,
						description: 'test',
						summary: 'test',
					},
				},
			},
		}

		const cb = vi.fn(async () => {
			return {
				messageType: EBMessageType.CommandSuccessResponse,
				payload: null,
			} as Readonly<Omit<CommandSuccessResponse, 'instanceId'>>
		})

		const handler = getCommandHandlerRestApi.call(bridge, address, cb, metadata, eventBridgeConfig)
		const app = new Hono()
		app.get('/v1/null', handler)

		const response = await app.request('http://localhost/v1/null')
		expect(response.status).toBe(StatusCode.NoContent)
	})
})
