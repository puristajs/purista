---
title: Compile and run a modular monolith
description: Compile one application entry point that starts the bridge, services, workers, and HTTP projection in a verified order.
order: 1051
---

A modular monolith keeps PURISTA service boundaries but deploys them as one
process. It is the normal first production topology when independent scaling or
release is not yet required.

## 1. Keep one explicit composition root

```ts title="src/index.ts"
import { gracefulShutdown, initLogger, type Service } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { getHttpServer } from './http.js'
import { invoiceV1Service } from './service/invoice/v1/invoiceV1Service.js'
import { notificationV1Service } from './service/notification/v1/notificationV1Service.js'

const logger = initLogger()
const eventBridge = await getEventBridge(logger)

const services: Service[] = []
for (const builder of [invoiceV1Service, notificationV1Service]) {
  const service = await builder.getInstance(eventBridge, { logger })
  await service.start()
  services.push(service)
}

const { honoService, serverInstance } = await getHttpServer({ eventBridge, services, logger })

gracefulShutdown(logger, [
  honoService.prepareDestroy(),
  eventBridge,
  ...services,
  {
    name: `${honoService.serviceInfo.serviceName} ${honoService.serviceInfo.serviceVersion} close socket`,
    destroy: () => new Promise<void>((resolve, reject) => {
      serverInstance.close(error => error ? reject(error) : resolve())
    }),
  },
  honoService,
])
```

The order matters: adapters start first, service instances register their
definitions next, and the public listener becomes ready last.
`honoService.prepareDestroy()` marks the HTTP service unavailable before the
remaining entries are destroyed. The separate socket entry is required because
the Node HTTP listener belongs to the application, while `honoService` owns the
Hono routes and PURISTA lifecycle. Close both during shutdown.

## 2. Compile the generated ESM project

The starter already writes ESM imports with `.js` extensions and compiles
`src` to `dist`. Add production scripts rather than running `tsx` in the
container:

```json title="package.json"
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start:prod": "node --enable-source-maps dist/index.js"
  }
}
```

```bash title="Build and run the production entry point"
npm ci
npm test
npm run build
npm run start:prod
```

This is compilation, not a single-file bundle. It preserves normal Node module
resolution and native/optional package boundaries. If your platform requires a
bundle, configure its bundler deliberately and keep native addons, dynamic
provider loading, skill directories, and package assets external when the
selected packages require them.

## 3. Build the runtime image from the compiled output

Use a multi-stage image so TypeScript and test tooling do not enter the runtime
layer.

```dockerfile title="Dockerfile"
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm test && npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "--enable-source-maps", "dist/index.js"]
```

Copy additional runtime assets explicitly: mounted Harness skills, provisioned
local models, certificates, or migration files are not embedded by TypeScript.
Do not bake provider keys or production configuration into the image.

## 4. Verify the process boundary

The deployment is ready only when the HTTP listener and every service-required
adapter/registration are ready. Exercise one authenticated command, one event
subscription, one queued job when present, and one orderly termination. Verify
traces and metrics are flushed, and that a local-only in-memory bridge/store is
intentional for this single process rather than an accidental production
default.

Next: [deploy the HTTP gateway](/handbook/framework/deploy-applications/http-gateway/).
