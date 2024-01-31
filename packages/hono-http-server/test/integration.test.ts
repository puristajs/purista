import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import type { EventBridge } from '@purista/core'
import { DefaultEventBridge, getLoggerMock, HttpClient } from '@purista/core'
import type { OpenAPIObject } from 'openapi3-ts/oas31'

import type { HonoServiceClass } from '../src/service/hono/v1/HonoServiceClass.js'
import { honoV1Service } from '../src/service/hono/v1/honoV1Service.js'
import { theServiceV1Service } from './service/theService/v1/index.js'

describe('httpserver integration test', () => {
  let eventBridge: EventBridge
  let server: HonoServiceClass
  let serverInstance: ReturnType<typeof serve>
  const port = 3000
  const client = new HttpClient({
    logger: getLoggerMock().mock,
    baseUrl: `http://127.0.0.1:${port}`,
    defaultHeaders: { 'content-type': 'application/json; charset=utf-8' },
  })

  const content = { some: 'content' }

  const apiMountPath = '/api'

  const config = {
    logger: getLoggerMock().mock,
    serviceConfig: {
      enableDynamicRoutes: true,
      enableHealthz: true,
      apiMountPath,
      openApi: {
        enabled: true,
        info: {
          title: 'backend api',
          description: 'OpenApi definition for server endpoints',
          version: '1.0.0',
        },
      },
    },
  }

  beforeAll(async () => {
    eventBridge = new DefaultEventBridge({ logger: getLoggerMock().mock })
    await eventBridge.start()

    server = honoV1Service.getInstance(eventBridge, config)
    server.app.get('/api', swaggerUI({ url: '/api/openapi.json' }))
    server.setProtectMiddleware(async function (_c, next) {
      await next()
    })
    await server.start()

    serverInstance = serve({
      fetch: server.app.fetch,
      port,
    })

    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  afterAll(async () => {
    await new Promise((resolve, reject) => serverInstance.close((err) => (err ? reject(err) : resolve(undefined))))
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
    const response = await client.get<OpenAPIObject>(apiMountPath + '/openapi.json')
    expect(response.info.description).toEqual(config.serviceConfig.openApi.info.description)
    expect(response.info.title).toEqual(config.serviceConfig.openApi.info.title)
    expect(response.info.version).toEqual(config.serviceConfig.openApi.info.version)
    expect(response.paths?.['/healthz']).toBeDefined()
  })

  describe('with dynamic routes enabled', () => {
    beforeAll(async () => {
      // set up the service
      const theService = theServiceV1Service.getInstance(eventBridge, { logger: getLoggerMock().mock })
      await theService.start()

      await new Promise((resolve) => setTimeout(resolve, 5000))
    })

    it('returns ' + apiMountPath + '/openapi.json', async () => {
      const response = await client.get<OpenAPIObject>(apiMountPath + '/openapi.json')

      expect(response.paths?.['/healthz']).toBeDefined()
      expect(response.paths?.[apiMountPath + '/v1/ping']).toBeDefined()
      expect(response.paths?.[apiMountPath + '/v1/unknown']).toBeUndefined()
      expect(response.paths?.[apiMountPath + '/v1/error']).toBeDefined()
      expect(response.paths?.[apiMountPath + '/v1/post']).toBeDefined()
      expect(response.paths?.[apiMountPath + '/v1/patch']).toBeDefined()
      expect(response.paths?.[apiMountPath + '/v1/put']).toBeDefined()
      expect(response.paths?.[apiMountPath + '/v1/delete']).toBeDefined()
    })

    it('exposes http get endpoint', async () => {
      await expect(client.get(apiMountPath + '/v1/ping', { query: { required: 'my_param' } })).resolves.toEqual({
        ping: true,
      })
    })

    it('returns a error on invalid or missing query parameter', async () => {
      await expect(client.get(apiMountPath + '/v1/ping')).rejects.toEqual(new Error('Bad Request'))
    })

    it('has a 404 handling', async () => {
      await expect(client.get(apiMountPath + '/v1/unknown')).rejects.toEqual(new Error('Not Found'))
    })

    it('returns a error if command returns error', async () => {
      await expect(client.get(apiMountPath + '/v1/error')).rejects.toEqual(new Error('Internal Server Error'))
    })

    it('exposes http post endpoint', async () => {
      await expect(client.post(apiMountPath + '/v1/post', content)).resolves.toEqual({ payload: content })
    })

    it('exposes http patch endpoint', async () => {
      await expect(client.patch(apiMountPath + '/v1/patch', content)).resolves.toEqual({ payload: content })
    })

    it('exposes http put endpoint', async () => {
      await expect(client.put(apiMountPath + '/v1/put', content)).resolves.toEqual({ payload: content })
    })

    it('exposes http delete endpoint', async () => {
      await expect(client.delete(apiMountPath + '/v1/delete')).resolves.toBeUndefined()
    })
  })
})
