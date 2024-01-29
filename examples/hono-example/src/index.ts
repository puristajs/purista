import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { basicAuth } from 'hono/basic-auth'
import { compress } from 'hono/compress'

import { pingV1Service } from './service/ping/v1/index.js'

export const main = async () => {
  // initiate the event bridge as first step
  const eventBridge = new DefaultEventBridge()
  await eventBridge.start()

  // add your service
  const pingService = pingV1Service.getInstance(eventBridge)
  await pingService.start()

  // initiate the webserver service as second step
  const honoService = honoV1Service.getInstance(eventBridge, { serviceConfig: { services: [pingService] } })

  honoService.app.use('*', compress())
  honoService.app.get('/api', swaggerUI({ url: '/api/openapi.json' }))
  honoService.openApi.addSecurityScheme('basicAuth', { type: 'http', scheme: 'basic' })
  honoService.openApi.addServer({ url: 'http://localhost:3000', description: 'the local server' })

  honoService
    .setHonoTypes<{ Variables: { customVar: string } }>()
    .setHealthFunction(async function () {
      this.logger.info('custom health check')
    })
    .setProtectMiddleware(async function (c, next) {
      const auth = basicAuth({ username: 'user', password: 'password' })
      c.set('additionalParameter', { userId: '123' })
      c.set('customVar', 'some custom var value')
      this.logger.debug(c.env.customBind)
      return auth(c, next)
    })

  const _serverInstance = serve({
    fetch: honoService.app.fetch,
    port: 3000,
  })

  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(true)
    }, 10_000),
  )

  // start the webserver
  await honoService.start()

  honoService.app.get('/test', (c) => c.text('ok test'))
}

main()
