import {
	DefaultEventBridge,
	EBMessageType,
	getEventBridgeMock,
	getLoggerMock,
	HandledError,
	ServiceBuilder,
	StatusCode,
	type StreamFrame,
} from '@purista/core'
import { DefaultChatTransport, type UIMessage, type UIMessageChunk } from 'ai'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { OPENAPI_DEFAULT_INFO } from './honoServiceConfig.js'
import { honoV1Service } from './honoV1Service.js'

class InspectableChatTransport extends DefaultChatTransport<UIMessage> {
	read(stream: ReadableStream<Uint8Array>) {
		return this.processResponseStream(stream)
	}
}

const readOfficialUiMessageChunks = async (response: Response) => {
	const chunks: UIMessageChunk[] = []
	const body = response.body
	if (!body) throw new Error('Expected streaming response body')
	for await (const chunk of new InspectableChatTransport().read(body)) chunks.push(chunk)
	return chunks
}

const transportFrame = (payload: StreamFrame['payload']): StreamFrame => ({
	id: 'frame-1',
	timestamp: 0,
	messageType: EBMessageType.Stream,
	correlationId: 'session-1',
	contentType: 'application/json',
	contentEncoding: 'utf-8',
	sender: { serviceName: 'Test', serviceVersion: '1', serviceTarget: 'stream', instanceId: 'test' },
	receiver: { serviceName: 'Hono', serviceVersion: '1', serviceTarget: 'stream', instanceId: 'hono' },
	payload,
})

const omitOpenApiMetadata = (metadata: any) => {
	const http = { ...metadata.expose.http }
	delete http.openApi
	return {
		...metadata,
		expose: {
			...metadata.expose,
			http,
		},
	}
}

const serviceBuilder = new ServiceBuilder({
	serviceName: 'HttpTestService',
	serviceVersion: '1',
	serviceDescription: 'http test service',
})

const plainTextCommand = serviceBuilder
	.getCommandBuilder('plainText', 'plain text')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return 'plain-text'
	})
	.exposeAsHttpEndpoint('GET', 'plain-text', undefined, undefined, 'text/plain')

const csvCommand = serviceBuilder
	.getCommandBuilder('csv', 'csv')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return 'column\nvalue'
	})
	.exposeAsHttpEndpoint('GET', 'csv', undefined, undefined, 'text/csv')

const asyncCommand = serviceBuilder
	.getCommandBuilder('asyncJob', 'async job')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return {
			jobId: 'job-1',
			queueName: 'jobs',
			scheduledAt: 123,
		}
	})
	.exposeAsHttpEndpoint('POST', 'async-job', undefined, undefined, undefined, undefined, { mode: 'async' })

const echoCommand = serviceBuilder
	.getCommandBuilder('echo', 'echo')
	.makeEndpointPublic()
	.addPayloadSchema(z.object({ message: z.string() }))
	.setCommandFunction(async function (_context, payload) {
		return { payload }
	})
	.exposeAsHttpEndpoint('POST', 'echo')

const queryCommand = serviceBuilder
	.getCommandBuilder('withParam', 'with param')
	.addParameterSchema(z.object({ principalId: z.string().optional() }))
	.enableHttpSecurity(true)
	.setCommandFunction(async function (_context, _payload, parameter) {
		return { principalId: parameter.principalId ?? null }
	})
	.exposeAsHttpEndpoint('GET', 'secure')

const aiMessageStream = serviceBuilder
	.getStreamBuilder('aiMessageStream', 'AI SDK UI Message Stream')
	.makeEndpointPublic()
	.addChunkSchema(z.object({ event: z.string(), data: z.unknown() }))
	.enableChunkAggregation(false)
	.exposeAsHttpStreamEndpoint('POST', 'ai-chat')
	.setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
	.setHttpResponseHeaders({ 'x-vercel-ai-ui-message-stream': 'v1' })
	.setStreamFunction(async function (_context, _payload, _parameter, writer) {
		await writer.close()
	})

const protectedAiMessageStream = serviceBuilder
	.getStreamBuilder('protectedAiMessageStream', 'Protected AI SDK UI Message Stream')
	.addChunkSchema(z.object({ event: z.string(), data: z.unknown() }))
	.enableChunkAggregation(false)
	.enableHttpSecurity(true)
	.exposeAsHttpStreamEndpoint('POST', 'protected-ai-chat')
	.setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
	.setHttpResponseHeaders({ 'x-vercel-ai-ui-message-stream': 'v1' })
	.setStreamFunction(async function (_context, _payload, _parameter, writer) {
		await writer.close()
	})

const getEndpointService = async () => {
	const eventBridge = getEventBridgeMock()
	const endpointBuilder = new ServiceBuilder({
		serviceName: 'HttpEndpointService',
		serviceVersion: '1',
		serviceDescription: 'http endpoint service',
	})
	const endpointCommand = endpointBuilder
		.getCommandBuilder('plainText', 'plain text')
		.makeEndpointPublic()
		.setCommandFunction(async function () {
			return 'plain-text'
		})
		.exposeAsHttpEndpoint('GET', 'plain-text', undefined, undefined, 'text/plain')
	endpointBuilder.addCommandDefinition(endpointCommand.getDefinition())

	return endpointBuilder.getInstance(eventBridge.mock, {
		logger: getLoggerMock().mock,
	})
}

const getOmittedOpenApiEndpointService = async () => {
	const eventBridge = getEventBridgeMock()
	const endpointBuilder = new ServiceBuilder({
		serviceName: 'OmittedOpenApiEndpointService',
		serviceVersion: '1',
		serviceDescription: 'omitted OpenAPI endpoint service',
	})
	const endpointCommand = endpointBuilder
		.getCommandBuilder('protectedByDefault', 'protected by default')
		.setCommandFunction(async function () {
			return 'protected'
		})
		.exposeAsHttpEndpoint('GET', 'protected-by-default')
	const definition = await endpointCommand.getDefinition()
	endpointBuilder.addCommandDefinition({
		...definition,
		metadata: omitOpenApiMetadata(definition.metadata),
	} as any)

	return endpointBuilder.getInstance(eventBridge.mock, {
		logger: getLoggerMock().mock,
	})
}

describe('HonoServiceClass', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	const createServer = async (
		overrides?: Partial<{
			enableHealth: boolean
			enableDynamicRoutes: boolean
			autoRegisterServicesFromConfig: boolean
			maxRequestBodyBytes: number
			services: unknown[]
		}>,
	) =>
		await honoV1Service.getInstance(getEventBridgeMock().mock, {
			logger: getLoggerMock().mock,
			serviceConfig: {
				enableHealth: overrides?.enableHealth ?? false,
				enableDynamicRoutes: overrides?.enableDynamicRoutes ?? false,
				autoRegisterServicesFromConfig: overrides?.autoRegisterServicesFromConfig ?? false,
				maxRequestBodyBytes: overrides?.maxRequestBodyBytes,
				apiMountPath: '/api',
				services: (overrides?.services ?? []) as any,
			},
		})

	it('returns 503 when service is unavailable even if health endpoint is disabled', async () => {
		const server = await createServer()
		await server.start()
		await server.setServiceUnavailable()

		try {
			const response = await server.app.fetch(new Request('http://localhost/unknown'))
			expect(response.status).toBe(503)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			await expect(response.json()).resolves.toMatchObject({
				title: 'Service Unavailable',
				status: 503,
			})
		} finally {
			await server.destroy()
		}
	})

	it('publishes OpenAPI with the default configuration', async () => {
		const server = await honoV1Service.getInstance(getEventBridgeMock().mock, {
			logger: getLoggerMock().mock,
			serviceConfig: {},
		})
		expect(server.config.openApi).toMatchObject({ enabled: true, info: OPENAPI_DEFAULT_INFO })
		await server.start()

		try {
			const response = await server.app.fetch(new Request('http://localhost/api/openapi.json'))
			expect(response.status).toBe(200)
			await expect(response.json()).resolves.toMatchObject({
				openapi: '3.1.0',
				info: OPENAPI_DEFAULT_INFO,
			})
		} finally {
			await server.destroy()
		}
	})

	it('does not auto-register configured services unless explicitly enabled', async () => {
		const endpointService = await getEndpointService()

		const server = await createServer({
			services: [endpointService],
			autoRegisterServicesFromConfig: false,
		})
		const invokeMock = vi.spyOn(server, 'invoke').mockResolvedValue('plain-text')
		await server.start()

		try {
			const response = await server.app.fetch(new Request('http://localhost/api/v1/plain-text'))
			expect(response.status).toBe(404)
		} finally {
			invokeMock.mockRestore()
			await server.destroy()
		}
	})

	it('auto-registers configured services only when explicitly enabled', async () => {
		const endpointService = await getEndpointService()

		const server = await createServer({
			services: [endpointService],
			autoRegisterServicesFromConfig: true,
		})
		const invokeMock = vi.spyOn(server, 'invoke').mockResolvedValue('plain-text')
		await server.start()

		try {
			const response = await server.app.fetch(new Request('http://localhost/api/v1/plain-text'))
			expect(response.status).toBe(200)
			expect(response.headers.get('content-type')).toContain('text/plain')
			expect(await response.text()).toBe('plain-text')
		} finally {
			invokeMock.mockRestore()
			await server.destroy()
		}
	})

	it('health endpoint does not depend on event bridge health state', async () => {
		const eventBridge = getEventBridgeMock()
		const server = await honoV1Service.getInstance(eventBridge.mock, {
			logger: getLoggerMock().mock,
			serviceConfig: {
				enableHealth: true,
				enableDynamicRoutes: false,
				autoRegisterServicesFromConfig: false,
				apiMountPath: '/api',
				services: [],
			},
		})
		const healthFunction = vi.fn(async function (this: typeof server) {
			expect(this).toBe(server)
		})
		server.setHealthFunction(healthFunction)
		await server.start()
		eventBridge.stubs.isHealthy.resolves(false)

		try {
			const response = await server.app.fetch(new Request('http://localhost/healthz'))
			expect(response.status).toBe(200)
			expect(healthFunction).toHaveBeenCalledTimes(1)
			await expect(response.json()).resolves.toMatchObject({
				status: 200,
				message: 'OK',
			})
		} finally {
			await server.destroy()
		}
	})

	it('rejects registerService calls after start', async () => {
		const endpointService = {
			serviceInfo: {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceDescription: 'http test service',
			},
			commandDefinitionList: [await plainTextCommand.getDefinition()],
			streamDefinitionList: [],
		}
		const server = await createServer()
		await server.start()

		try {
			expect(() => server.registerService(endpointService as any)).toThrowError(/must be called before start/i)
		} finally {
			await server.destroy()
		}
	})

	it('rejects duplicate method+path endpoint registrations', async () => {
		const server = await createServer()
		const plainTextDefinition = await plainTextCommand.getDefinition()

		server.addEndpoint(plainTextDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'plainText',
		})

		expect(() =>
			server.addEndpoint(plainTextDefinition.metadata as any, {
				serviceName: 'AnotherService',
				serviceVersion: '1',
				serviceTarget: 'anotherPlainText',
			}),
		).toThrowError(/already registered/i)
	})

	it('accepts duplicate method+path registrations for the same logical service target', async () => {
		const server = await createServer()
		const plainTextDefinition = await plainTextCommand.getDefinition()

		expect(() =>
			server.addEndpoint(plainTextDefinition.metadata as any, {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceTarget: 'plainText',
				instanceId: 'instance-a',
			}),
		).not.toThrow()

		expect(() =>
			server.addEndpoint(plainTextDefinition.metadata as any, {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceTarget: 'plainText',
				instanceId: 'instance-b',
			}),
		).not.toThrow()
	})

	it('fails start when a protected command or stream has no protect middleware', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const queryDefinition = await queryCommand.getDefinition()
		const streamDefinition = await protectedAiMessageStream.getDefinition()
		server.addEndpoint(queryDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'withParam',
		})
		server.addEndpoint(streamDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'protectedAiMessageStream',
		})

		await expect(server.start()).rejects.toThrow(/protected HTTP endpoints require.*protect middleware/i)
		expect(server.isStarted).toBe(false)
		await server.destroy()
	})

	it('treats omitted command and stream OpenAPI metadata as protected during registration and startup', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const queryDefinition = await queryCommand.getDefinition()
		const streamDefinition = await protectedAiMessageStream.getDefinition()
		server.addEndpoint(omitOpenApiMetadata(queryDefinition.metadata), {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'withParam',
		})
		server.addEndpoint(omitOpenApiMetadata(streamDefinition.metadata), {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'protectedAiMessageStream',
		})
		const invokeMock = vi.spyOn(server, 'invoke')
		const openStreamMock = vi.spyOn(server, 'openStream')

		await expect(server.start()).rejects.toThrow(/protected HTTP endpoints require.*protect middleware/i)
		expect(server.isStarted).toBe(false)
		const commandResponse = await server.app.fetch(new Request('http://localhost/api/v1/secure'))
		const streamResponse = await server.app.fetch(
			new Request('http://localhost/api/v1/protected-ai-chat', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: '{}',
			}),
		)
		expect(commandResponse.status).toBe(StatusCode.InternalServerError)
		expect(streamResponse.status).toBe(StatusCode.InternalServerError)
		expect(invokeMock).not.toHaveBeenCalled()
		expect(openStreamMock).not.toHaveBeenCalled()
		await server.destroy()
	})

	it('fails startup before auto-registering an omitted-OpenAPI protected endpoint without middleware', async () => {
		const endpointService = await getOmittedOpenApiEndpointService()
		const server = await createServer({
			services: [endpointService],
			autoRegisterServicesFromConfig: true,
		})
		const invokeMock = vi.spyOn(server, 'invoke')

		await expect(server.start()).rejects.toThrow(/protected HTTP endpoints require.*protect middleware/i)
		expect(server.isStarted).toBe(false)
		expect(invokeMock).not.toHaveBeenCalled()
		await server.destroy()
	})

	it('rejects late omitted-OpenAPI protected registration before publishing a route or dispatching', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const queryDefinition = await queryCommand.getDefinition()
		const invokeMock = vi.spyOn(server, 'invoke')
		await server.start()

		try {
			expect(() =>
				server.addEndpoint(omitOpenApiMetadata(queryDefinition.metadata), {
					serviceName: 'HttpTestService',
					serviceVersion: '1',
					serviceTarget: 'withParam',
				}),
			).toThrow(/protected HTTP endpoints require.*protect middleware/i)
			const streamDefinition = await protectedAiMessageStream.getDefinition()
			expect(() =>
				server.addEndpoint(omitOpenApiMetadata(streamDefinition.metadata), {
					serviceName: 'HttpTestService',
					serviceVersion: '1',
					serviceTarget: 'protectedAiMessageStream',
				}),
			).toThrow(/protected HTTP endpoints require.*protect middleware/i)
			const response = await server.app.fetch(new Request('http://localhost/api/v1/secure'))
			expect(response.status).toBe(StatusCode.NotFound)
			const streamResponse = await server.app.fetch(
				new Request('http://localhost/api/v1/protected-ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{}',
				}),
			)
			expect(streamResponse.status).toBe(StatusCode.NotFound)
			expect(server.openApi.getSpec().paths?.['/api/v1/secure']).toBeUndefined()
			expect(server.openApi.getSpec().paths?.['/api/v1/protected-ai-chat']).toBeUndefined()
			expect(invokeMock).not.toHaveBeenCalled()
		} finally {
			invokeMock.mockRestore()
			await server.destroy()
		}
	})

	it('protects and documents omitted OpenAPI metadata when middleware is configured after registration', async () => {
		const server = await honoV1Service.getInstance(getEventBridgeMock().mock, {
			logger: getLoggerMock().mock,
			serviceConfig: {
				enableHealth: false,
				enableDynamicRoutes: true,
				autoRegisterServicesFromConfig: false,
				apiMountPath: '/api',
				services: [],
				openApi: {
					openapi: '3.1.0',
					enabled: true,
					info: OPENAPI_DEFAULT_INFO,
					components: {
						securitySchemes: {
							bearerAuth: { type: 'http', scheme: 'bearer' },
						},
					},
				},
			},
		})
		const queryDefinition = await queryCommand.getDefinition()
		server.addEndpoint(omitOpenApiMetadata(queryDefinition.metadata), {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'withParam',
		})
		const protectMiddleware = vi.fn(async (c, next) => {
			c.set('principalId', 'trusted-principal')
			c.set('tenantId', 'trusted-tenant')
			await next()
		})
		server.setProtectMiddleware(protectMiddleware)
		const invokeMock = vi.spyOn(server, 'invoke').mockResolvedValue({ ok: true })
		await server.start()

		try {
			const response = await server.app.fetch(new Request('http://localhost/api/v1/secure'))
			expect(response.status).toBe(StatusCode.OK)
			expect(protectMiddleware).toHaveBeenCalledOnce()
			expect(invokeMock).toHaveBeenCalledWith(
				expect.objectContaining({ principalId: 'trusted-principal', tenantId: 'trusted-tenant' }),
				'get:/api/v1/secure',
			)

			const operation = (server.openApi.getSpec().paths?.['/api/v1/secure'] as any)?.get
			expect(operation).toMatchObject({
				security: [{ bearerAuth: [] }],
				'x-purista-endpoint-security': 'protected-with-security-scheme',
			})
			expect(operation.responses).toHaveProperty(String(StatusCode.Unauthorized))
		} finally {
			invokeMock.mockRestore()
			await server.destroy()
		}
	})

	it('resolves protect middleware at request time and forwards only trusted identity', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const queryDefinition = await queryCommand.getDefinition()
		server.addEndpoint(queryDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'withParam',
		})

		const protectMiddleware = vi.fn(async (c, next) => {
			c.set('principalId', 'trusted-principal')
			c.set('tenantId', 'trusted-tenant')
			await next()
		})
		server.setProtectMiddleware(protectMiddleware)
		const invokeMock = vi
			.spyOn(server, 'invoke')
			.mockRejectedValue(new HandledError(StatusCode.Forbidden, 'The target guard denied this business action'))
		await server.start()

		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/secure?principalId=forged&tenantId=forged'),
			)
			expect(response.status).toBe(StatusCode.Forbidden)
			expect(protectMiddleware).toHaveBeenCalledOnce()
			expect(invokeMock).toHaveBeenCalledWith(
				expect.objectContaining({
					principalId: 'trusted-principal',
					tenantId: 'trusted-tenant',
					payload: expect.objectContaining({
						parameter: expect.objectContaining({ principalId: 'forged', tenantId: 'forged' }),
					}),
				}),
				'get:/api/v1/secure',
			)
			await expect(response.json()).resolves.toMatchObject({
				status: StatusCode.Forbidden,
				detail: 'The target guard denied this business action',
			})
		} finally {
			invokeMock.mockRestore()
			await server.destroy()
		}
	})

	it('maps a protect middleware HandledError through the configured Hono error handler', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const queryDefinition = await queryCommand.getDefinition()
		server.addEndpoint(queryDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'withParam',
		})
		server.setProtectMiddleware(async () => {
			throw new HandledError(StatusCode.Unauthorized, 'The access token is invalid or expired')
		})
		const invokeMock = vi.spyOn(server, 'invoke')
		await server.start()

		try {
			const response = await server.app.fetch(new Request('http://localhost/api/v1/secure'))
			expect(response.status).toBe(StatusCode.Unauthorized)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			await expect(response.json()).resolves.toMatchObject({
				status: StatusCode.Unauthorized,
				detail: 'The access token is invalid or expired',
			})
			expect(invokeMock).not.toHaveBeenCalled()
		} finally {
			invokeMock.mockRestore()
			await server.destroy()
		}
	})

	it('forwards protect middleware identity to an omitted-OpenAPI protected stream request', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const streamDefinition = await protectedAiMessageStream.getDefinition()
		server.addEndpoint(omitOpenApiMetadata(streamDefinition.metadata), {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'protectedAiMessageStream',
		})
		server.setProtectMiddleware(async (c, next) => {
			c.set('principalId', 'trusted-principal')
			c.set('tenantId', 'trusted-tenant')
			await next()
		})
		const openStream = vi.spyOn(server, 'openStream').mockResolvedValue({
			sessionId: 'session-1',
			cancel: vi.fn(async () => undefined),
			async *[Symbol.asyncIterator]() {
				yield { payload: { frameType: 'complete', final: null } }
			},
		} as any)
		await server.start()

		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/protected-ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ principalId: 'forged', tenantId: 'forged' }),
				}),
			)
			expect(response.status).toBe(StatusCode.OK)
			expect(openStream).toHaveBeenCalledWith(
				expect.objectContaining({
					principalId: 'trusted-principal',
					tenantId: 'trusted-tenant',
					payload: {
						payload: { principalId: 'forged', tenantId: 'forged' },
						parameter: {},
					},
				}),
				'post:/api/v1/protected-ai-chat',
				300000,
			)
		} finally {
			openStream.mockRestore()
			await server.destroy()
		}
	})

	it('maps HTTPException and generic errors via app.onError', async () => {
		const server = await createServer()
		server.app.get('/handled-error', () => {
			throw new HandledError(StatusCode.Unauthorized, 'A valid access token is required')
		})
		server.app.get('/http-error', () => {
			throw new HTTPException(418, { message: 'teapot' })
		})
		server.app.get('/boom', () => {
			throw new Error('boom')
		})
		await server.start()

		try {
			const handledError = await server.app.fetch(new Request('http://localhost/handled-error'))
			expect(handledError.status).toBe(401)
			expect(handledError.headers.get('content-type')).toContain('application/problem+json')
			await expect(handledError.json()).resolves.toMatchObject({
				title: 'Unauthorized',
				status: 401,
				detail: 'A valid access token is required',
			})

			const httpError = await server.app.fetch(new Request('http://localhost/http-error'))
			expect(httpError.status).toBe(418)
			expect(httpError.headers.get('content-type')).toContain('application/problem+json')
			await expect(httpError.json()).resolves.toMatchObject({
				title: 'Im A Teapot',
				status: 418,
				detail: 'teapot',
			})

			const unhandled = await server.app.fetch(new Request('http://localhost/boom'))
			expect(unhandled.status).toBe(500)
			expect(unhandled.headers.get('content-type')).toContain('application/problem+json')
			await expect(unhandled.json()).resolves.toMatchObject({
				title: 'Internal Server Error',
				status: 500,
				detail: 'Internal Server Error',
			})
		} finally {
			await server.destroy()
		}
	})

	it('returns markdown problem details when the client prefers text/markdown', async () => {
		const server = await createServer()
		await server.start()

		try {
			const response = await server.app.fetch(
				new Request('http://localhost/unknown', {
					headers: { accept: 'text/markdown' },
				}),
			)
			expect(response.status).toBe(404)
			expect(response.headers.get('content-type')).toContain('text/markdown')
			await expect(response.text()).resolves.toContain('# Not Found')
		} finally {
			await server.destroy()
		}
	})

	it('uses configured problem type base URI in HTTP problem responses', async () => {
		const server = await honoV1Service.getInstance(getEventBridgeMock().mock, {
			logger: getLoggerMock().mock,
			serviceConfig: {
				enableHealth: false,
				enableDynamicRoutes: false,
				apiMountPath: '/api',
				services: [],
				problemDetails: {
					typeBaseUri: 'https://api.example.com/problems',
				},
			},
		})
		await server.start()

		try {
			const response = await server.app.fetch(new Request('http://localhost/unknown'))
			expect(response.status).toBe(404)
			await expect(response.json()).resolves.toMatchObject({
				type: 'https://api.example.com/problems/not-found',
				title: 'Not Found',
				status: 404,
			})
		} finally {
			await server.destroy()
		}
	})

	it('throws when openStream is used without stream-capable event bridge', async () => {
		const server = await createServer()
		;(server as unknown as { eventBridge: { openStream?: unknown } }).eventBridge.openStream = undefined

		await expect(
			server.openStream(
				{
					receiver: {
						serviceName: 'Target',
						serviceVersion: '1',
						serviceTarget: 'run',
					},
					payload: { payload: {}, parameter: {} },
				} as any,
				'GET:/api/test',
			),
		).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
		})

		await server.destroy()
	})

	it('covers plain-text, async, bad-content-type, invalid-json and protect middleware branches', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const protectMiddleware = vi.fn(async function (this: typeof server, c, next) {
			expect(this).toBe(server)
			c.set('additionalParameter', { principalId: 'from-middleware' })
			await next()
		})
		server.setProtectMiddleware(protectMiddleware)
		const plainTextDefinition = await plainTextCommand.getDefinition()
		const asyncDefinition = await asyncCommand.getDefinition()
		const echoDefinition = await echoCommand.getDefinition()
		const queryDefinition = await queryCommand.getDefinition()
		const csvDefinition = await csvCommand.getDefinition()

		server.addEndpoint(plainTextDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'plainText',
		})
		server.addEndpoint(asyncDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'asyncJob',
		})
		server.addEndpoint(echoDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'echo',
		})
		server.addEndpoint(queryDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'withParam',
		})
		server.addEndpoint(csvDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'csv',
		})

		const invokeMock = vi.spyOn(server, 'invoke').mockImplementation(async (input: any) => {
			if (input.receiver.serviceTarget === 'plainText') {
				return 'plain-text'
			}
			if (input.receiver.serviceTarget === 'asyncJob') {
				return {
					jobId: 'job-1',
					queueName: 'jobs',
					scheduledAt: 123,
				}
			}
			if (input.receiver.serviceTarget === 'echo') {
				return { payload: input.payload.payload }
			}
			if (input.receiver.serviceTarget === 'withParam') {
				return { principalId: input.payload.parameter.principalId ?? null }
			}
			if (input.receiver.serviceTarget === 'csv') {
				return 'column\nvalue'
			}
			throw new Error('unexpected target')
		})

		await server.start()

		try {
			const plain = await server.app.fetch(new Request('http://localhost/api/v1/plain-text'))
			expect(plain.status).toBe(200)
			expect(await plain.text()).toBe('plain-text')

			const csv = await server.app.fetch(new Request('http://localhost/api/v1/csv'))
			expect(csv.status).toBe(200)
			expect(csv.headers.get('content-type')).toContain('text/csv; charset=utf-8')
			expect(await csv.text()).toBe('column\nvalue')

			const asyncResult = await server.app.fetch(
				new Request('http://localhost/api/v1/async-job', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({}),
				}),
			)
			expect(asyncResult.status).toBe(202)
			await expect(asyncResult.json()).resolves.toEqual({
				jobId: 'job-1',
				queue: 'jobs',
				queueName: 'jobs',
				status: 'queued',
				scheduledAt: 123,
			})

			const badContentType = await server.app.fetch(
				new Request('http://localhost/api/v1/echo', {
					method: 'POST',
					headers: { 'content-type': 'text/plain' },
					body: 'oops',
				}),
			)
			expect(badContentType.status).toBe(400)
			expect(badContentType.headers.get('content-type')).toContain('application/problem+json')
			await expect(badContentType.json()).resolves.toMatchObject({
				title: 'Bad Request',
				status: 400,
			})

			const invalidJson = await server.app.fetch(
				new Request('http://localhost/api/v1/echo', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{',
				}),
			)
			expect(invalidJson.status).toBe(400)
			expect(invalidJson.headers.get('content-type')).toContain('application/problem+json')
			await expect(invalidJson.json()).resolves.toMatchObject({
				title: 'Bad Request',
				status: 400,
			})

			const secured = await server.app.fetch(new Request('http://localhost/api/v1/secure'))
			expect(secured.status).toBe(200)
			expect(protectMiddleware).toHaveBeenCalled()
			await expect(secured.json()).resolves.toEqual({ principalId: 'from-middleware' })
		} finally {
			invokeMock.mockRestore()
			await server.setServiceUnavailable()
			await server.destroy()
		}
	})

	it('limits declared and streamed request bodies before parsing', async () => {
		const server = await createServer({ enableDynamicRoutes: true, maxRequestBodyBytes: 16 })
		const echoDefinition = await echoCommand.getDefinition()
		server.addEndpoint(echoDefinition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'echo',
		})
		const invokeMock = vi.spyOn(server, 'invoke').mockResolvedValue({ payload: { message: 'x' } })
		await server.start()

		try {
			const declaredOversize = await server.app.fetch(
				new Request('http://localhost/api/v1/echo', {
					method: 'POST',
					headers: {
						'content-length': '17',
						'content-type': 'application/json',
					},
					body: '{}',
				}),
			)
			expect(declaredOversize.status).toBe(StatusCode.PayloadTooLarge)
			expect(declaredOversize.headers.get('content-type')).toContain('application/problem+json')
			await expect(declaredOversize.json()).resolves.toMatchObject({
				title: 'Payload Too Large',
				status: StatusCode.PayloadTooLarge,
			})

			const encoder = new TextEncoder()
			const streamedBody = new ReadableStream<Uint8Array>({
				start(controller) {
					controller.enqueue(encoder.encode('{"message":"'))
					controller.enqueue(encoder.encode('oversized"}'))
					controller.close()
				},
			})
			const streamedOversize = await server.app.fetch(
				new Request('http://localhost/api/v1/echo', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: streamedBody,
					duplex: 'half',
				} as RequestInit),
			)
			expect(streamedOversize.status).toBe(StatusCode.PayloadTooLarge)
			expect(invokeMock).not.toHaveBeenCalled()
		} finally {
			invokeMock.mockRestore()
			await server.destroy()
		}
	})

	it('applies protocol response headers and emits official data-only SSE exactly once', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const definition = await aiMessageStream.getDefinition()
		server.addEndpoint(definition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'aiMessageStream',
		})
		const openStream = vi.spyOn(server, 'openStream').mockResolvedValue({
			sessionId: 'session-1',
			cancel: vi.fn(async () => undefined),
			async *[Symbol.asyncIterator]() {
				yield {
					payload: {
						frameType: 'chunk',
						chunk: { event: 'data', data: { type: 'start', messageId: 'assistant-1' } },
					},
				}
				yield { payload: { frameType: 'chunk', chunk: { event: 'data', data: { type: 'start-step' } } } }
				yield {
					payload: { frameType: 'chunk', chunk: { event: 'data', data: { type: 'text-start', id: 'answer' } } },
				}
				yield {
					payload: {
						frameType: 'chunk',
						chunk: { event: 'data', data: { type: 'text-delta', id: 'answer', delta: 'hello' } },
					},
				}
				yield {
					payload: { frameType: 'chunk', chunk: { event: 'data', data: { type: 'text-end', id: 'answer' } } },
				}
				yield { payload: { frameType: 'chunk', chunk: { event: 'data', data: { type: 'finish-step' } } } }
				yield {
					payload: {
						frameType: 'chunk',
						chunk: { event: 'data', data: { type: 'finish', finishReason: 'stop' } },
					},
				}
				yield { payload: { frameType: 'chunk', chunk: { event: 'data', data: '[DONE]' } } }
				yield { payload: { frameType: 'complete', final: null } }
			},
		} as any)
		await server.start()

		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{}',
				}),
			)
			expect(response.status).toBe(StatusCode.OK)
			expect(response.headers.get('x-vercel-ai-ui-message-stream')).toBe('v1')
			const officialChunks = await readOfficialUiMessageChunks(response.clone())
			const body = await response.text()
			expect(body).toContain('data: {"type":"text-delta","id":"answer","delta":"hello"}\n\n')
			expect(body).not.toContain('event: data')
			expect(body.match(/data: \[DONE\]/g)).toHaveLength(1)
			expect(officialChunks.map(chunk => chunk.type)).toEqual([
				'start',
				'start-step',
				'text-start',
				'text-delta',
				'text-end',
				'finish-step',
				'finish',
			])
		} finally {
			openStream.mockRestore()
			await server.destroy()
		}
	})

	it.each([true, false])('maps a real EventBridge pre-start error through Hono (handled: %s)', async handled => {
		const bridge = new DefaultEventBridge({ logger: getLoggerMock().mock })
		await bridge.start()
		const server = await honoV1Service.getInstance(bridge, {
			logger: getLoggerMock().mock,
			serviceConfig: { enableHealth: false, enableDynamicRoutes: true, apiMountPath: '/api' },
		})
		const definition = await protectedAiMessageStream.getDefinition()
		const address = { serviceName: 'HttpTestService', serviceVersion: '1', serviceTarget: 'protectedAiMessageStream' }
		const receiver = vi.fn(async (message: Parameters<Parameters<typeof bridge.registerStream>[1]>[0]) => {
			if (message.payload.frameType !== 'open') return
			expect(message.principalId).toBe('trusted-principal')
			expect(message.tenantId).toBe('trusted-tenant')
			const errorFrame: StreamFrame = {
				...message,
				sender: { ...address, instanceId: bridge.instanceId },
				receiver: message.sender,
				payload: {
					frameType: 'error',
					sequence: 0,
					error: {
						status: handled ? StatusCode.Forbidden : StatusCode.InternalServerError,
						message: handled ? 'Safe guard denial' : 'PRIVATE_PRE_START_DIAGNOSTIC',
						isHandledError: handled,
						data: { reason: handled ? 'review' : 'PRIVATE_PRE_START_DATA' },
					},
				},
			}
			await bridge.emitMessage(errorFrame)
		})
		await bridge.registerStream(address, receiver, definition.metadata)
		server.addEndpoint(definition.metadata, address)
		server.setProtectMiddleware(async (c, next) => {
			c.set('principalId', 'trusted-principal')
			c.set('tenantId', 'trusted-tenant')
			await next()
		})
		await server.start()
		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/protected-ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{}',
				}),
			)
			const responseBody = await response.text()
			expect(response.status).toBe(handled ? StatusCode.Forbidden : StatusCode.InternalServerError)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			expect(response.headers.get('x-vercel-ai-ui-message-stream')).toBeNull()
			const problem = JSON.parse(responseBody)
			expect(problem).toMatchObject({ detail: handled ? 'Safe guard denial' : 'Internal Server Error' })
			if (handled) expect(problem).toHaveProperty('details', { reason: 'review' })
			else expect(JSON.stringify(problem)).not.toContain('PRIVATE_PRE_START')
			expect(receiver).toHaveBeenCalledOnce()
		} finally {
			await server.destroy()
			await bridge.unregisterStream(address)
			await bridge.destroy()
		}
	})

	it('maps a real pending EventBridge startup timeout to a safe HTTP 504', async () => {
		const bridge = new DefaultEventBridge({ logger: getLoggerMock().mock })
		await bridge.start()
		const server = await honoV1Service.getInstance(bridge, {
			logger: getLoggerMock().mock,
			serviceConfig: {
				enableHealth: false,
				enableDynamicRoutes: true,
				apiMountPath: '/api',
				streamRequestTimeoutMs: 20,
			},
		})
		const definition = await aiMessageStream.getDefinition()
		const address = { serviceName: 'HttpTestService', serviceVersion: '1', serviceTarget: 'aiMessageStream' }
		await bridge.registerStream(address, async () => {}, definition.metadata)
		server.addEndpoint(definition.metadata, address)
		const openStream = server.openStream.bind(server)
		const cancel = vi.fn<() => Promise<void>>()
		vi.spyOn(server, 'openStream').mockImplementation(async (...args) => {
			const handle = await openStream(...args)
			cancel.mockImplementation(() => handle.cancel('startup timeout'))
			return { ...handle, cancel }
		})
		await server.start()
		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{}',
				}),
			)
			expect(response.status).toBe(StatusCode.GatewayTimeout)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			const problem = await response.json()
			expect(problem).toMatchObject({ status: StatusCode.GatewayTimeout, detail: 'Gateway Timeout' })
			expect(problem).not.toHaveProperty('details')
			expect(cancel).toHaveBeenCalledOnce()
		} finally {
			await server.destroy()
			await bridge.unregisterStream(address)
			await bridge.destroy()
		}
	})

	it.each(['error', 'rejection', 'timeout'] as const)(
		'cleans up pre-start %s exactly once after control frames',
		async kind => {
			const server = await createServer({ enableDynamicRoutes: true })
			server.config.streamRequestTimeoutMs = 20
			const definition = await aiMessageStream.getDefinition()
			server.addEndpoint(definition.metadata, {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceTarget: 'aiMessageStream',
			})

			const next = vi
				.fn<() => Promise<IteratorResult<StreamFrame>>>()
				.mockResolvedValueOnce({ done: false, value: transportFrame({ frameType: 'heartbeat', sequence: 0 }) })
			if (kind === 'error')
				next
					.mockResolvedValueOnce({
						done: false,
						value: transportFrame({
							frameType: 'error',
							sequence: 1,
							error: {
								status: StatusCode.Forbidden,
								message: 'Safe denial',
								isHandledError: true,
								data: { reason: 'review' },
							},
						}),
					})
					.mockResolvedValue({ done: true, value: undefined })
			else if (kind === 'rejection')
				next.mockRejectedValue(
					Object.assign(new Error('PRIVATE_ITERATOR_START_FAILURE'), { status: 504, errorCode: 504 }),
				)
			else next.mockImplementation(() => new Promise(() => {}))
			const cancel = vi.fn(async () => undefined)
			const iteratorReturn = vi.fn(async () => ({ done: true as const, value: undefined }))
			vi.spyOn(server, 'openStream').mockResolvedValue({
				sessionId: 'session-1',
				cancel,
				[Symbol.asyncIterator]: () => ({ next, return: iteratorReturn }),
			})
			await server.start()
			const onError = vi.fn((error: Error, c: Parameters<Parameters<typeof server.app.onError>[0]>[1]) => {
				const status = error instanceof HandledError ? error.errorCode : StatusCode.InternalServerError
				return c.json(
					{ message: error.message, data: error instanceof HandledError ? error.data : undefined },
					status as ContentfulStatusCode,
				)
			})
			server.app.onError(onError)
			try {
				const response = await server.app.fetch(
					new Request('http://localhost/api/v1/ai-chat', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: '{}',
					}),
				)
				expect(response.status).toBe(
					kind === 'error'
						? StatusCode.Forbidden
						: kind === 'timeout'
							? StatusCode.GatewayTimeout
							: StatusCode.InternalServerError,
				)
				expect(onError).toHaveBeenCalledOnce()
				const body = await response.text()
				expect(body).not.toContain('PRIVATE_')
				if (kind === 'error') expect(JSON.parse(body)).toEqual({ message: 'Safe denial', data: { reason: 'review' } })
				expect(cancel).toHaveBeenCalledOnce()
				expect(iteratorReturn).toHaveBeenCalledOnce()
				expect(next).toHaveBeenCalledTimes(2)
			} finally {
				await server.destroy()
			}
		},
	)

	it.each(['chunk', 'complete', 'cancel', 'done', 'start'] as const)(
		'preserves immediate %s at the response boundary',
		async kind => {
			const server = await createServer({ enableDynamicRoutes: true })
			server.config.streamRequestTimeoutMs = 30
			const definition = await aiMessageStream.getDefinition()
			server.addEndpoint(definition.metadata, {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceTarget: 'aiMessageStream',
			})
			const next = vi.fn<() => Promise<IteratorResult<StreamFrame>>>().mockResolvedValueOnce(
				kind === 'done'
					? { done: true, value: undefined }
					: {
							done: false,
							value: transportFrame({
								frameType: kind,
								sequence: 0,
								...(kind === 'chunk' ? { chunk: { event: 'data', data: { type: 'start', messageId: 'first' } } } : {}),
								...(kind === 'cancel' ? { reason: 'cancelled before data' } : {}),
							}),
						},
			)
			if (kind === 'start') next.mockImplementation(() => new Promise(() => {}))
			else next.mockResolvedValue({ done: true, value: undefined })
			const cancel = vi.fn(async () => undefined)
			const iteratorReturn = vi.fn(async () => ({ done: true as const, value: undefined }))
			vi.spyOn(server, 'openStream').mockResolvedValue({
				sessionId: 'session-1',
				cancel,
				[Symbol.asyncIterator]: () => ({ next, return: iteratorReturn }),
			})
			await server.start()
			try {
				const response = await server.app.fetch(
					new Request('http://localhost/api/v1/ai-chat', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: '{}',
					}),
				)
				expect(response.status).toBe(StatusCode.OK)
				if (kind === 'start') {
					await response.body?.cancel('cancel after start')
					expect(cancel).toHaveBeenCalledOnce()
					expect(iteratorReturn).toHaveBeenCalledOnce()
				} else {
					const body = await response.text()
					expect(body.match(/data: \[DONE\]/g)).toHaveLength(1)
					if (kind === 'chunk') expect(body).toContain('data: {"type":"start","messageId":"first"}\n\n')
					else if (kind === 'cancel')
						expect(body).toContain('data: {"type":"abort","reason":"cancelled before data"}\n\n')
					else expect(body).toBe('data: [DONE]\n\n')
					if (kind === 'done') expect(next).toHaveBeenCalledOnce()
				}
			} finally {
				await server.destroy()
			}
		},
	)

	it('returns a handled stream-open failure before committing SSE headers', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const definition = await aiMessageStream.getDefinition()
		server.addEndpoint(definition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'aiMessageStream',
		})
		const openStream = vi
			.spyOn(server, 'openStream')
			.mockRejectedValue(new HandledError(StatusCode.TooManyRequests, 'Model admission denied'))
		await server.start()

		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{}',
				}),
			)
			expect(response.status).toBe(StatusCode.TooManyRequests)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			expect(response.headers.get('x-vercel-ai-ui-message-stream')).toBeNull()
			await expect(response.json()).resolves.toMatchObject({
				status: StatusCode.TooManyRequests,
				detail: 'Model admission denied',
			})
		} finally {
			openStream.mockRestore()
			await server.destroy()
		}
	})

	it.each([
		[
			'error',
			{ status: 500, message: 'Safe stream failure', isHandledError: true },
			{ type: 'error', errorText: 'Safe stream failure' },
		],
		[
			'error',
			{ status: 500, message: 'PRIVATE_UNHANDLED_STREAM_DIAGNOSTIC', isHandledError: false },
			{ type: 'error', errorText: 'Internal Server Error' },
		],
		['cancel', undefined, { type: 'abort', reason: 'request cancelled' }],
	] as const)(
		'keeps post-start %s terminal transport inside AI SDK data records',
		async (frameType, error, expected) => {
			const server = await createServer({ enableDynamicRoutes: true })
			const definition = await aiMessageStream.getDefinition()
			server.addEndpoint(definition.metadata as any, {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceTarget: 'aiMessageStream',
			})
			const openStream = vi.spyOn(server, 'openStream').mockResolvedValue({
				sessionId: 'session-1',
				cancel: vi.fn(async () => undefined),
				async *[Symbol.asyncIterator]() {
					yield {
						payload: {
							frameType: 'chunk',
							chunk: { event: 'data', data: { type: 'start', messageId: 'assistant-1' } },
						},
					}
					yield { payload: { frameType, error, reason: 'request cancelled' } }
				},
			} as any)
			await server.start()

			try {
				const response = await server.app.fetch(
					new Request('http://localhost/api/v1/ai-chat', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: '{}',
					}),
				)
				const officialChunks = await readOfficialUiMessageChunks(response.clone())
				const body = await response.text()
				expect(officialChunks).toContainEqual(expected)
				expect(body).not.toContain('event: error')
				if (error?.isHandledError === false) expect(body).not.toContain(error.message)
				expect(body.match(/data: \[DONE\]/g)).toHaveLength(1)
			} finally {
				openStream.mockRestore()
				await server.destroy()
			}
		},
	)

	it.each([
		['handled', new HandledError(StatusCode.Forbidden, 'Safe policy denial'), 'Safe policy denial'],
		['unknown', new Error('PRIVATE_ITERATOR_DIAGNOSTIC'), 'Internal Server Error'],
	] as const)(
		'maps %s iterator failures and releases the upstream stream exactly once',
		async (_kind, failure, errorText) => {
			const server = await createServer({ enableDynamicRoutes: true })
			const definition = await aiMessageStream.getDefinition()
			server.addEndpoint(definition.metadata as any, {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceTarget: 'aiMessageStream',
			})
			const cancel = vi.fn(async () => undefined)
			const iteratorReturn = vi.fn(async () => ({ done: true as const, value: undefined }))
			let readCount = 0
			const iterator = {
				next: vi.fn(async () => {
					if (readCount++ === 0) {
						return {
							done: false as const,
							value: {
								payload: {
									frameType: 'chunk',
									chunk: { event: 'data', data: { type: 'start', messageId: 'assistant-1' } },
								},
							},
						}
					}
					throw failure
				}),
				return: iteratorReturn,
			}
			const openStream = vi.spyOn(server, 'openStream').mockResolvedValue({
				sessionId: 'session-1',
				cancel,
				[Symbol.asyncIterator]() {
					return iterator
				},
			} as any)
			await server.start()

			try {
				const response = await server.app.fetch(
					new Request('http://localhost/api/v1/ai-chat', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: '{}',
					}),
				)
				const officialChunks = await readOfficialUiMessageChunks(response.clone())
				const body = await response.text()
				expect(officialChunks).toContainEqual({ type: 'error', errorText })
				if (_kind === 'unknown') expect(body).not.toContain(failure.message)
				expect(body.match(/data: \[DONE\]/g)).toHaveLength(1)
				expect(cancel).toHaveBeenCalledOnce()
				expect(cancel).toHaveBeenCalledWith('HTTP response stream failed')
				expect(iteratorReturn).toHaveBeenCalledOnce()
			} finally {
				openStream.mockRestore()
				await server.destroy()
			}
		},
	)

	it.each(['control', 'data', 'done'] as const)(
		'stops without another pull or terminal write when a pending read resolves with %s after consumer cancellation',
		async outcome => {
			const server = await createServer({ enableDynamicRoutes: true })
			const definition = await aiMessageStream.getDefinition()
			server.addEndpoint(definition.metadata as any, {
				serviceName: 'HttpTestService',
				serviceVersion: '1',
				serviceTarget: 'aiMessageStream',
			})
			const cancel = vi.fn(async () => undefined)
			const iteratorReturn = vi.fn(async () => ({ done: true as const, value: undefined }))
			let resolvePendingRead: ((result: IteratorResult<any>) => void) | undefined
			const next = vi
				.fn()
				.mockResolvedValueOnce({
					done: false as const,
					value: {
						payload: {
							frameType: 'chunk',
							chunk: { event: 'data', data: { type: 'start', messageId: 'assistant-1' } },
						},
					},
				})
				.mockImplementationOnce(
					() =>
						new Promise<IteratorResult<any>>(resolve => {
							resolvePendingRead = resolve
						}),
				)
				.mockResolvedValue({ done: true as const, value: undefined })
			const iterator = { next, return: iteratorReturn }
			const openStream = vi.spyOn(server, 'openStream').mockResolvedValue({
				sessionId: 'session-1',
				cancel,
				[Symbol.asyncIterator]() {
					return iterator
				},
			} as any)
			const encodeSpy = vi.spyOn(TextEncoder.prototype, 'encode')
			await server.start()

			try {
				const response = await server.app.fetch(
					new Request('http://localhost/api/v1/ai-chat', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: '{}',
					}),
				)
				const reader = response.body?.getReader()
				if (!reader) throw new Error('Expected response stream reader')
				await reader.read()
				await vi.waitFor(() => expect(next).toHaveBeenCalledTimes(2))
				const writesBeforeCancel = encodeSpy.mock.calls.length
				const cancellation = reader.cancel('browser disconnected')
				const pendingResult =
					outcome === 'done'
						? ({ done: true as const, value: undefined } satisfies IteratorResult<any>)
						: ({
								done: false as const,
								value:
									outcome === 'control'
										? { payload: { frameType: 'heartbeat' } }
										: {
												payload: {
													frameType: 'chunk',
													chunk: { event: 'data', data: { type: 'text-delta', id: 'late', delta: 'late' } },
												},
											},
							} satisfies IteratorResult<any>)
				resolvePendingRead?.(pendingResult)
				await cancellation
				await vi.waitFor(() => {
					expect(cancel).toHaveBeenCalledOnce()
					expect(iteratorReturn).toHaveBeenCalledOnce()
				})
				await Promise.resolve()
				expect(next).toHaveBeenCalledTimes(2)
				expect(encodeSpy).toHaveBeenCalledTimes(writesBeforeCancel)
			} finally {
				encodeSpy.mockRestore()
				openStream.mockRestore()
				await server.destroy()
			}
		},
	)

	it('cancels and releases the upstream iterator when the response consumer disconnects', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const definition = await aiMessageStream.getDefinition()
		server.addEndpoint(definition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'aiMessageStream',
		})
		let rejectPendingRead: ((reason?: unknown) => void) | undefined
		const cancel = vi.fn(async () => {
			rejectPendingRead?.(new Error('upstream cancelled'))
		})
		const iteratorReturn = vi.fn(async () => ({ done: true as const, value: undefined }))
		let readCount = 0
		const iterator = {
			next: vi.fn(() => {
				if (readCount++ === 0) {
					return Promise.resolve({
						done: false as const,
						value: {
							payload: {
								frameType: 'chunk',
								chunk: { event: 'data', data: { type: 'start', messageId: 'assistant-1' } },
							},
						},
					})
				}
				return new Promise<IteratorResult<never>>((_resolve, reject) => {
					rejectPendingRead = reject
				})
			}),
			return: iteratorReturn,
		}
		const openStream = vi.spyOn(server, 'openStream').mockResolvedValue({
			sessionId: 'session-1',
			cancel,
			[Symbol.asyncIterator]() {
				return iterator
			},
		} as any)
		await server.start()

		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{}',
				}),
			)
			const reader = response.body?.getReader()
			if (!reader) throw new Error('Expected response stream reader')
			await reader.read()
			await reader.cancel('browser disconnected')
			expect(cancel).toHaveBeenCalledOnce()
			expect(cancel).toHaveBeenCalledWith('browser disconnected')
			expect(iteratorReturn).toHaveBeenCalledOnce()
		} finally {
			openStream.mockRestore()
			await server.destroy()
		}
	})

	it('passes approval interruption records through the official AI SDK reader unchanged', async () => {
		const server = await createServer({ enableDynamicRoutes: true })
		const definition = await aiMessageStream.getDefinition()
		server.addEndpoint(definition.metadata as any, {
			serviceName: 'HttpTestService',
			serviceVersion: '1',
			serviceTarget: 'aiMessageStream',
		})
		const approvalDescriptor = {
			protocol: 'purista-harness/tool-approval',
			version: 1,
			rootRunId: 'run-1',
			agentRunId: 'run-1',
			sessionId: 'session-1',
			interruptId: 'interrupt-1',
			revision: 'revision-1',
			eventId: 'event-1',
			approvalIds: ['approval-1'],
		}
		const records = [
			{ type: 'start', messageId: 'assistant-1' },
			{ type: 'tool-input-available', toolCallId: 'call-1', toolName: 'refund', input: { id: 'tx-1' }, dynamic: true },
			{ type: 'tool-approval-request', approvalId: 'approval-1', toolCallId: 'call-1', approvalDescriptor },
			{ type: 'finish', finishReason: 'tool-calls' },
		] satisfies UIMessageChunk[]
		const openStream = vi.spyOn(server, 'openStream').mockResolvedValue({
			sessionId: 'session-1',
			cancel: vi.fn(async () => undefined),
			async *[Symbol.asyncIterator]() {
				for (const data of records) yield { payload: { frameType: 'chunk', chunk: { event: 'data', data } } }
				yield { payload: { frameType: 'chunk', chunk: { event: 'data', data: '[DONE]' } } }
				yield { payload: { frameType: 'complete', final: null } }
			},
		} as any)
		await server.start()

		try {
			const response = await server.app.fetch(
				new Request('http://localhost/api/v1/ai-chat', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{}',
				}),
			)
			await expect(readOfficialUiMessageChunks(response)).resolves.toEqual(records)
		} finally {
			openStream.mockRestore()
			await server.destroy()
		}
	})

	it('exposes prepareDestroy helper', async () => {
		const server = await createServer()
		await server.start()

		const prepare = server.prepareDestroy()
		expect(prepare.name).toContain('prepare shutdown')
		await prepare.destroy()
		const response = await server.app.fetch(new Request('http://localhost/unknown'))
		expect(response.status).toBe(503)
		await server.destroy()
	})
})
