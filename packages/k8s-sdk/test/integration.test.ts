import { serve } from '@hono/node-server'
import { DefaultEventBridge, getLoggerMock, HttpClient, StatusCode, UnhandledError } from '@purista/core/adapter'
import { createSandbox } from 'sinon'

import { getHttpServer } from '../src/index.js'
import { theServiceV1Service } from './service/theService/v1/index.js'

describe('getHttpServer', () => {
	let logger: ReturnType<typeof getLoggerMock>
	let server: ReturnType<typeof serve>
	let app: ReturnType<typeof getHttpServer>
	let eventBridge: DefaultEventBridge
	const disableEndpointExposing = false

	const sandbox = createSandbox()

	const port = 8082

	beforeAll(async () => {
		logger = getLoggerMock(sandbox)

		eventBridge = new DefaultEventBridge({ logger: getLoggerMock().mock })
		await eventBridge.start()

		// set up the service
		const theService = await theServiceV1Service.getInstance(eventBridge, { logger: getLoggerMock().mock })
		await theService.start()

		app = getHttpServer({
			healthFn: async () => true,
			services: [theService],
			hostname: 'localhost',
			apiMountPath: '/api',
			disableEndpointExposing,
			logger: logger.mock,
		})

		server = serve({
			fetch: app.fetch,
			port,
		})
	})

	afterEach(() => {
		sandbox.reset()
		sandbox.restore()

		logger.stubs.info.resetHistory()
		logger.stubs.error.resetHistory()
		logger.stubs.warn.resetHistory()
		logger.stubs.debug.resetHistory()
		logger.stubs.fatal.resetHistory()
	})

	afterAll(async () => {
		await eventBridge.destroy()

		if ('closeAllConnections' in server && typeof server.closeAllConnections === 'function') {
			await server.closeAllConnections()
		}

		await server.close()
	})

	it('returns healthz', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}` })

		await expect(client.get('healthz')).resolves.toMatchObject({
			status: 200,
			message: 'ok',
		})
	})

	it('exposes http get endpoint', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		await expect(client.get('/api/v1/ping', { query: { required: 'true' } })).resolves.toMatchObject({ ping: true })
	})

	it('returns a error on invalid query parameter', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		await expect(client.get('/api/v1/ping')).rejects.toThrowError('Bad Request')
	})

	it('has a 404 handling', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		await expect(client.get('/api/v1/unknown')).rejects.toThrowError('Not Found')
	})

	it('returns a error if command returns error', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		await expect(client.get('/api/v1/error')).rejects.toThrowError('Internal Server Error')
	})

	it('exposes http post endpoint', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		const content = { some: 'content' }
		await expect(client.post('/api/v1/post', content)).resolves.toMatchObject({ payload: content })
	})

	it('exposes http patch endpoint', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		const content = { some: 'content' }
		await expect(client.patch('/api/v1/patch', content)).resolves.toMatchObject({ payload: content })
	})

	it('exposes http put endpoint', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		const content = { some: 'content' }
		await expect(client.put('/api/v1/put', content)).resolves.toMatchObject({ payload: content })
	})

	it('exposes http delete endpoint', async () => {
		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		await expect(client.delete('/api/v1/delete')).resolves.toBeUndefined()
	})

	it('stops accepting requests after SIGTERM', async () => {
		sandbox.stub(process, 'once')

		// Emit the SIGTERM signal to test if the handler is working as expected
		process.emit('SIGTERM')

		const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
		await expect(client.get('healthz')).rejects.toThrowError('Service Unavailable')
	})

	it('logs uncaughtException', async () => {
		const error = new UnhandledError(StatusCode.InternalServerError, 'some error')

		process.emit('uncaughtException', error, 'test')

		// Wait a bit for the event to be processed
		await new Promise(resolve => setTimeout(resolve, 10))

		// Find the call that logged the uncaught exception
		const errorCall = logger.stubs.error.getCalls().find(call => {
			const message = call.args[1]
			return typeof message === 'string' && message.includes('unhandled error:')
		})

		expect(errorCall).toBeDefined()
		expect(errorCall?.args[1]).toContain('unhandled error: some error')
	})
})
