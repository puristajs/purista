import { serve } from '@hono/node-server'
import { DefaultEventBridge, getLoggerMock, HttpClient, StatusCode, UnhandledError } from '@purista/core'
import { createSandbox } from 'sinon'

import { getHttpServer } from '../src/'
import { theServiceV1Service } from './service/theService/v1'

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

  afterEach(() => {
    sandbox.reset()
    sandbox.restore()
  })

  afterAll(async () => {
    await eventBridge.destroy()

    const s = server as any
    if (s.closeAllConnections) {
      await s.closeAllConnections()
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

  afterEach(() => {
    logger.stubs.info.resetHistory()
    logger.stubs.error.resetHistory()
    logger.stubs.warn.resetHistory()
    logger.stubs.debug.resetHistory()
    logger.stubs.fatal.resetHistory()
  })

  it('exposes http get endpoint', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/ping', { query: { required: 'true' } })).resolves.toMatchObject({ ping: true })
  })

  it('returns a error on invalid query parameter', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/ping')).rejects.toStrictEqual(
      new UnhandledError(StatusCode.BadRequest, 'Bad Request'),
    )
  })

  it('has a 404 handling', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/unknown')).rejects.toStrictEqual(
      new UnhandledError(StatusCode.NotFound, 'Not Found'),
    )
  })

  it('returns a error if command returns error', async () => {
    const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })
    await expect(client.get('/api/v1/error')).rejects.toStrictEqual(
      new UnhandledError(StatusCode.InternalServerError, 'Internal Server Error'),
    )
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
    await expect(client.get('healthz')).rejects.toStrictEqual(
      new UnhandledError(StatusCode.ServiceUnavailable, 'Service Unavailable'),
    )
  })

  it.skip('logs uncaughtException', async () => {
    sandbox.stub(process, 'once')

    process.emit('uncaughtException', new UnhandledError(StatusCode.InternalServerError, 'some error'))
    expect(logger.stubs.error.getCall(0).args[1]).toBe('unhandled error: some error')
    // expect(logger.stubs.error.calledWithMatch('unhandled error: some error')).toBeTruthy()
  })
})
