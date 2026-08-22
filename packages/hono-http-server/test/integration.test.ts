import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import type { EventBridge } from '@purista/core/adapter'
import { DefaultEventBridge, getLoggerMock, HttpClient } from '@purista/core/adapter'
import type { OpenAPIObject } from 'openapi3-ts/oas31'

import type { HonoServiceClass } from '../src/service/hono/v1/HonoServiceClass.js'
import type { HonoServiceV1ConfigPartial } from '../src/service/hono/v1/honoServiceConfig.js'
import { honoV1Service } from '../src/service/hono/v1/honoV1Service.js'
import { theServiceV1Service } from './service/theService/v1/index.js'

describe('httpserver integration test', () => {
	let eventBridge: EventBridge
	let server: HonoServiceClass
	let serverInstance: ReturnType<typeof serve>
	let port: number
	let client: HttpClient

	const content = { some: 'content' }

	const apiMountPath = '/api'

	const serviceConfig = {
		enableDynamicRoutes: true,
		enableHealth: true,
		apiMountPath,
		openApi: {
			enabled: true,
			info: {
				title: 'backend api',
				description: 'OpenApi definition for server endpoints',
				version: '1.0.0',
			},
		},
	} satisfies HonoServiceV1ConfigPartial

	const config = {
		logger: getLoggerMock().mock,
		serviceConfig,
	}

	beforeAll(async () => {
		eventBridge = new DefaultEventBridge({ logger: getLoggerMock().mock })
		await eventBridge.start()

		server = await honoV1Service.getInstance(eventBridge, config)
		server.app.get('/api', swaggerUI({ url: '/api/openapi.json' }))
		server.setProtectMiddleware(async function (_c, next) {
			await next()
		})
		await server.start()

		serverInstance = serve({
			fetch: server.app.fetch,
			port: 0,
		})

		const address = serverInstance.address()
		if (typeof address === 'object' && address) {
			port = address.port
		} else {
			throw new Error('Unable to determine hono server port')
		}

		client = new HttpClient({
			logger: getLoggerMock().mock,
			baseUrl: `http://127.0.0.1:${port}`,
			defaultHeaders: { 'content-type': 'application/json; charset=utf-8' },
		})

		await new Promise(resolve => setTimeout(resolve, 0))
	})

	afterAll(async () => {
		await new Promise((resolve, reject) => serverInstance.close(err => (err ? reject(err) : resolve(undefined))))
		await server.destroy()
		await eventBridge.destroy()
	})

	it('returns healthz', async () => {
		await expect(client.get('/healthz')).resolves.toEqual({
			status: 200,
			message: 'OK',
		})
	})

	it('returns /api', async () => {
		await expect(client.get(apiMountPath)).resolves.toBeDefined()
	})

	it('returns /api/openapi.json', async () => {
		const response = await client.get<OpenAPIObject>(`${apiMountPath}/openapi.json`)
		expect(response.info.description).toEqual(config.serviceConfig.openApi.info.description)
		expect(response.info.title).toEqual(config.serviceConfig.openApi.info.title)
		expect(response.info.version).toEqual(config.serviceConfig.openApi.info.version)
		expect(response.paths?.['/healthz']).toBeDefined()
	})

	describe('with dynamic routes enabled', () => {
		beforeAll(async () => {
			// set up the service
			const theService = await theServiceV1Service.getInstance(eventBridge, {
				logger: getLoggerMock().mock,
			})
			await theService.start()

			await new Promise(resolve => setTimeout(resolve, 5000))
		})

		it(`returns ${apiMountPath}/openapi.json`, async () => {
			const response = await client.get<OpenAPIObject>(`${apiMountPath}/openapi.json`)

			expect(response.paths?.['/healthz']).toBeDefined()
			expect(response.paths?.[`${apiMountPath}/v1/ping`]).toBeDefined()
			expect(response.paths?.[`${apiMountPath}/v1/unknown`]).toBeUndefined()
			expect(response.paths?.[`${apiMountPath}/v1/error`]).toBeDefined()
			expect(response.paths?.[`${apiMountPath}/v1/post`]).toBeDefined()
			expect(response.paths?.[`${apiMountPath}/v1/patch`]).toBeDefined()
			expect(response.paths?.[`${apiMountPath}/v1/put`]).toBeDefined()
			expect(response.paths?.[`${apiMountPath}/v1/delete`]).toBeDefined()
		})

		it('exposes http get endpoint', async () => {
			await expect(client.get(`${apiMountPath}/v1/ping`, { query: { required: 'my_param' } })).resolves.toEqual({
				ping: true,
			})
		})

		it('returns a error on invalid or missing query parameter', async () => {
			await expect(client.get(`${apiMountPath}/v1/ping`)).rejects.toThrowError('Bad Request')
		})

		it('has a 404 handling', async () => {
			await expect(client.get(`${apiMountPath}/v1/unknown`)).rejects.toThrowError('Not Found')
		})

		it('returns a error if command returns error', async () => {
			await expect(client.get(`${apiMountPath}/v1/error`)).rejects.toThrowError('Internal Server Error')
		})

		it('exposes http post endpoint', async () => {
			await expect(client.post(`${apiMountPath}/v1/post`, content)).resolves.toEqual({ payload: content })
		})

		it('exposes http patch endpoint', async () => {
			await expect(client.patch(`${apiMountPath}/v1/patch`, content)).resolves.toEqual({ payload: content })
		})

		it('exposes http put endpoint', async () => {
			await expect(client.put(`${apiMountPath}/v1/put`, content)).resolves.toEqual({ payload: content })
		})

		it('exposes http delete endpoint', async () => {
			await expect(client.delete(`${apiMountPath}/v1/delete`)).resolves.toBeUndefined()
		})

		it('returns aggregate stream endpoint using the declared final schema', async () => {
			const result = await client.get<{ message?: string; events?: Array<{ type?: string }> }>(
				`${apiMountPath}/v1/aggregate-success`,
			)
			expect(result?.message).toBe('aggregate ok')
			expect(result?.events?.[0]?.type).toBe('message')
		})

		it('maps aggregate stream transport errors to 500', async () => {
			await expect(client.get(`${apiMountPath}/v1/aggregate-error`)).rejects.toThrowError('Internal Server Error')
		})

		it('returns RFC 9457 JSON and negotiated markdown for HTTP errors', async () => {
			const jsonResponse = await fetch(`http://127.0.0.1:${port}${apiMountPath}/v1/unknown`)
			expect(jsonResponse.status).toBe(404)
			expect(jsonResponse.headers.get('content-type')).toContain('application/problem+json')
			await expect(jsonResponse.json()).resolves.toMatchObject({
				title: 'Not Found',
				status: 404,
				detail: 'Route not found',
			})

			const markdownResponse = await fetch(`http://127.0.0.1:${port}${apiMountPath}/v1/unknown`, {
				headers: { accept: 'text/markdown' },
			})
			expect(markdownResponse.status).toBe(404)
			expect(markdownResponse.headers.get('content-type')).toContain('text/markdown')
			await expect(markdownResponse.text()).resolves.toContain('# Not Found')
		})

		it('documents aggregate stream endpoint as application/json', async () => {
			const openApi = await client.get<OpenAPIObject>(`${apiMountPath}/openapi.json`)
			const endpoint = openApi.paths?.[`${apiMountPath}/v1/aggregate-success`]
			const getOp = endpoint?.get
			const okResponse = getOp?.responses?.['200']
			const responseContent =
				okResponse && typeof okResponse === 'object' && 'content' in okResponse
					? (okResponse.content as any)
					: undefined
			expect(responseContent?.['application/json']).toBeDefined()
			expect(responseContent?.['text/event-stream']).toBeUndefined()
			const pingEndpoint = openApi.paths?.[`${apiMountPath}/v1/ping`]
			const pingGetOp = pingEndpoint?.get
			const errorResponse = pingGetOp?.responses?.['400']
			const errorContent =
				errorResponse && typeof errorResponse === 'object' && 'content' in errorResponse
					? (errorResponse.content as any)
					: undefined
			expect(errorContent?.['application/problem+json']).toBeDefined()
			expect(errorContent?.['text/markdown']).toBeDefined()
		})
	})
})
