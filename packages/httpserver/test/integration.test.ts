import { DefaultEventBridge, EventBridge, getLoggerMock, HttpClient, Service } from '@purista/core'
import { OpenAPIObject } from 'openapi3-ts'

import { httpServerV1Service } from '../src'
import { getIndexHtml, getJsInit } from '../src/service/httpServer/v1/routes'
import { theServiceV1Service } from './service/theService/v1'

describe('', () => {
  let eventBridge: EventBridge
  let server: Service
  const port = 8083
  const client = new HttpClient({ baseUrl: `http://127.0.0.1:${port}`, logger: getLoggerMock().mock })

  const content = JSON.stringify({ some: 'content' })

  const apiMountPath = '/api'

  const config = {
    logger: getLoggerMock().mock,
    serviceConfig: {
      port,
      host: '127.0.0.1',
      enableHealthz: true,
      enableCors: false,
      enableHelmet: false,
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

    server = httpServerV1Service.getInstance(eventBridge, config)
    await server.start()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  afterAll(async () => {
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
    await expect(client.get(apiMountPath)).resolves.toEqual(getIndexHtml(apiMountPath))
  })

  it('returns /api/initializer.js', async () => {
    await expect(client.get(apiMountPath + '/initializer.js')).resolves.toEqual(getJsInit(apiMountPath))
  })

  it('returns /api/openapi.json', async () => {
    const response = await client.get<OpenAPIObject>(apiMountPath + '/openapi.json')
    expect(response.info.description).toEqual(config.serviceConfig.openApi.info.description)
    expect(response.info.title).toEqual(config.serviceConfig.openApi.info.title)
    expect(response.info.version).toEqual(config.serviceConfig.openApi.info.version)
    expect(response.paths['/healthz']).toBeDefined()
  })

  describe('with services', () => {
    beforeAll(async () => {
      // set up the service
      const theService = theServiceV1Service.getInstance(eventBridge, { logger: getLoggerMock().mock })
      await theService.start()

      await new Promise((resolve) => setTimeout(resolve, 5000))
    })

    it('returns ' + apiMountPath + '/openapi.json', async () => {
      const response = await client.get<OpenAPIObject>(apiMountPath + '/openapi.json')

      expect(response.paths['/healthz']).toBeDefined()
      expect(response.paths[apiMountPath + '/v1/ping']).toBeDefined()
      expect(response.paths[apiMountPath + '/v1/unknown']).toBeUndefined()
      expect(response.paths[apiMountPath + '/v1/error']).toBeDefined()
      expect(response.paths[apiMountPath + '/v1/post']).toBeDefined()
      expect(response.paths[apiMountPath + '/v1/patch']).toBeDefined()
      expect(response.paths[apiMountPath + '/v1/put']).toBeDefined()
      expect(response.paths[apiMountPath + '/v1/delete']).toBeDefined()
    })

    it('exposes http get endpoint', async () => {
      await expect(client.get(apiMountPath + '/v1/ping', { query: { required: 'true' } })).resolves.toEqual({
        ping: true,
      })
    })

    it('returns a error on invalid query parameter', async () => {
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
