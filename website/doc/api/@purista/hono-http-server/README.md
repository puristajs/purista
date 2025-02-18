**@purista/hono-http-server v1.11.0**

***

[PURISTA API](../../packages.md) / @purista/hono-http-server

# @purista/hono-http-server

The HonoService is a service which exposes commands of services as http endpoints.
All exposed commands must be marked as exposed endpoints in the CommandBuilder.

Under the hood, [Hono](https://hono.dev) is used as basement.

Example usage:

```typescript
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
  const pingService = await pingV1Service.getInstance(eventBridge)
  await pingService.start()

  // initiate the webserver service as second step
  const honoService = await honoV1Service.getInstance(eventBridge, { serviceConfig: { services: [pingService] } })

  honoService.app.use('*', compress())
  honoService.app.get('/api', swaggerUI({ url: '/api/openapi.json' }))
  honoService.openApi.addSecurityScheme('basicAuth', { type: 'http', scheme: 'basic' })
  honoService.openApi.addServer({ url: 'http://localhost:3000', description: 'the local server' })

  honoService.setHealthFunction(async function () {
    this.logger.info('custom health check')
  })

  honoService.setProtectHandler(async function (c, next) {
    const auth = basicAuth({ username: 'user', password: 'password' })
    return auth(c, next)
  })

  // start the webserver service
  await honoService.start()

  // open socket
  const _serverInstance = serve({
    fetch: honoService.app.fetch,
    port: 3000,
  })
}

main()

```

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
