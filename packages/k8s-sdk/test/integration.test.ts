import { serve } from '@hono/node-server'
import { DefaultEventBridge, getLoggerMock, HttpClient } from '@purista/core'

import { getHttpServer } from '../src/'
import { theServiceV1Service } from './service/theService/v1'

describe('getHttpServer', () => {
  let logger: ReturnType<typeof getLoggerMock>
  let server: ReturnType<typeof serve>
  let app: ReturnType<typeof getHttpServer>
  let eventBridge: DefaultEventBridge
  const disableEndpointExposing = false

  const port = 8082

  beforeAll(async () => {
    logger = getLoggerMock()

    eventBridge = new DefaultEventBridge({ logger: getLoggerMock().mock })

    // set up the service
    const theService = theServiceV1Service.getInstance(eventBridge, { logger: getLoggerMock().mock })
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

  afterAll(async () => {
    await eventBridge.destroy()
    await server.closeAllConnections()
    await server.close()
  })

  it('returns healthz', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}` })
    await expect(client.get('healthz')).resolves.toEqual({
      status: 200,
      message: 'ok',
    })
  })

  afterEach(() => {
    logger.stubs.info.resetHistory()
    logger.stubs.error.resetHistory()
    logger.stubs.warn.resetHistory()
    logger.stubs.debug.resetHistory()
    logger.stubs.fatal.resetHistory()
  })

  it('exposes http get endpoint', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/ping', { query: { required: 'true' } })).resolves.toEqual({ ping: true })
  })

  it('returns a error on invalid query parameter', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/ping')).rejects.toEqual(new Error('Bad Request'))
  })

  it('has a 404 handling', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/unknown')).rejects.toEqual(new Error('Not Found'))
  })

  it('returns a error if command returns error', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/error')).rejects.toEqual(new Error('Internal Server Error'))
  })

  it('exposes http post endpoint', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    const content = { some: 'content' }
    await expect(client.post('/api/v1/post', content)).resolves.toEqual({ payload: content })
  })

  it('exposes http patch endpoint', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    const content = { some: 'content' }
    await expect(client.patch('/api/v1/patch', content)).resolves.toEqual({ payload: content })
  })

  it('exposes http put endpoint', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    const content = { some: 'content' }
    await expect(client.put('/api/v1/put', content)).resolves.toEqual({ payload: content })
  })

  it('exposes http delete endpoint', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.delete('/api/v1/delete')).resolves.toBeUndefined()
  })

  it('stops accepting requests after SIGTERM ', async () => {
    const mockProcessOnce = jest.spyOn(process, 'once')

    try {
      // Emit the SIGTERM signal to test if the handler is working as expected
      process.emit('SIGTERM')

      const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
      await expect(client.get('healthz')).rejects.toEqual(new Error('Service Unavailable'))
    } finally {
      mockProcessOnce.mockRestore()
    }
  })

  it('logs uncaughtException', async () => {
    const mockProcessOnce = jest.spyOn(process, 'once')

    try {
      process.emit('uncaughtException', new Error('some error'))
      expect(logger.stubs.error.getCall(0).args[1]).toBe('unhandled error: some error')
      // expect(logger.stubs.error.calledWithMatch('unhandled error: some error')).toBeTruthy()
    } finally {
      mockProcessOnce.mockRestore()
    }
  })
})
