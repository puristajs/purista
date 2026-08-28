import { getEventBridgeMock, getLoggerMock, ServiceBuilder, StatusCode } from '@purista/core'
import { HTTPException } from 'hono/http-exception'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { OPENAPI_DEFAULT_INFO } from './honoServiceConfig.js'
import { honoV1Service } from './honoV1Service.js'

const serviceBuilder = new ServiceBuilder({
	serviceName: 'HttpTestService',
	serviceVersion: '1',
	serviceDescription: 'http test service',
})

const plainTextCommand = serviceBuilder
	.getCommandBuilder('plainText', 'plain text')
	.setCommandFunction(async function () {
		return 'plain-text'
	})
	.exposeAsHttpEndpoint('GET', 'plain-text', undefined, undefined, 'text/plain')

const asyncCommand = serviceBuilder
	.getCommandBuilder('asyncJob', 'async job')
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

const getEndpointService = async () => {
	const eventBridge = getEventBridgeMock()
	const endpointBuilder = new ServiceBuilder({
		serviceName: 'HttpEndpointService',
		serviceVersion: '1',
		serviceDescription: 'http endpoint service',
	})
	const endpointCommand = endpointBuilder
		.getCommandBuilder('plainText', 'plain text')
		.setCommandFunction(async function () {
			return 'plain-text'
		})
		.exposeAsHttpEndpoint('GET', 'plain-text', undefined, undefined, 'text/plain')
	endpointBuilder.addCommandDefinition(endpointCommand.getDefinition())

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

	it('maps HTTPException and generic errors via app.onError', async () => {
		const server = await createServer()
		server.app.get('/http-error', () => {
			throw new HTTPException(418, { message: 'teapot' })
		})
		server.app.get('/boom', () => {
			throw new Error('boom')
		})
		await server.start()

		try {
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
			throw new Error('unexpected target')
		})

		await server.start()

		try {
			const plain = await server.app.fetch(new Request('http://localhost/api/v1/plain-text'))
			expect(plain.status).toBe(200)
			expect(await plain.text()).toBe('plain-text')

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
