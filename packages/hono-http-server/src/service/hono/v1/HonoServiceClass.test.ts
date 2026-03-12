import { getEventBridgeMock, getLoggerMock, ServiceBuilder, StatusCode } from '@purista/core'
import { HTTPException } from 'hono/http-exception'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod/v4'

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

describe('HonoServiceClass', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	const createServer = async (
		overrides?: Partial<{
			enableHealth: boolean
			enableDynamicRoutes: boolean
			services: unknown[]
		}>,
	) =>
		await honoV1Service.getInstance(getEventBridgeMock().mock, {
			logger: getLoggerMock().mock,
			serviceConfig: {
				enableHealth: overrides?.enableHealth ?? false,
				enableDynamicRoutes: overrides?.enableDynamicRoutes ?? false,
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
		} finally {
			await server.destroy()
		}
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

			const unhandled = await server.app.fetch(new Request('http://localhost/boom'))
			expect(unhandled.status).toBe(500)
		} finally {
			await server.destroy()
		}
	})

	it('throws when openStream is used without stream-capable event bridge', async () => {
		const server = await createServer()
		;(server.eventBridge as { openStream?: unknown }).openStream = undefined

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
		server.setProtectMiddleware(async (c, next) => {
			c.set('additionalParameter', { principalId: 'from-middleware' })
			await next()
		})
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

			const invalidJson = await server.app.fetch(
				new Request('http://localhost/api/v1/echo', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{',
				}),
			)
			expect(invalidJson.status).toBe(400)

			const secured = await server.app.fetch(new Request('http://localhost/api/v1/secure'))
			expect(secured.status).toBe(200)
			await expect(secured.json()).resolves.toEqual({ principalId: 'from-middleware' })
		} finally {
			invokeMock.mockRestore()
			await server.setServiceUnavailable()
			await server.destroy()
		}
	})

	it('exposes prepareDestroy helper', async () => {
		const server = await createServer()
		await server.start()

		const prepare = server.prepareDestroy()
		expect(prepare.name).toContain('prepare shutdown')
		await prepare.destroy.call(server)
		const response = await server.app.fetch(new Request('http://localhost/unknown'))
		expect(response.status).toBe(503)
		await server.destroy()
	})
})
