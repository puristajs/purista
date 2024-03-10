---
title: Deploy to Kubernetes
description: Deploy your typescript application in a microservice styled way
order: 503010
---

# Deploy to Kubernetes

## Prerequisites

At this point, it is expected, that you are familiar at least with the basics of [Kubernetes](https://kubernetes.io).
There are some good resources to learn, how Node.js programs can be deployed in a Kubernetes cluster:

- [learnk8s - Deploying Node.js apps in a local Kubernetes cluster](https://learnk8s.io/deploying-nodejs-kubernetes)
- [IBM - Node.js in a Kubernetes world](https://developer.ibm.com/articles/nodejs-kubernetes-basics/)

In the flowing example, it is expected:

- you have a mono-repo with one service __TheService__
- typescript is listed `devDependencies` in your package.json
- you have in your tsconfig.json: in `compilerOptions` the `outDir` set to `build`
- you have in your tsconfig.json: `include` set to `["./src/index.ts"]`

::: info

Here, we only focus on technical requirements and basic setup. The example can be found on [GitHub PURISTA examples](https://github.com/puristajs/purista/tree/master/examples/kubernetes).
:::

## Prepare your code

Kubernetes is normally used by microservices, which are providing HTTP endpoints. Also, it is expected, that the service provides _liveness_ and _readiness_ probes over HTTP.
Therefore, we use a small HTTP server here.

We also want to handle shutdown signals properly.

It can be done by using [@purista/k8s-sdk](../../../api/modules/purista_k8s_sdk.md).

::: info
The [@purista/k8s-sdk](../../../api/modules/purista_k8s_sdk.md) package is using [Hono](https://hono.dev) to provide a modern, flexible and lightweight http server.
Because of this, the webserver is able to use the benefits of different runtime environments like [Bun](https://bun.sh).
See [Hono](https://hono.dev)
:::

As you will see, you can optional expose commands as HTTP endpoints. This will allow __integration into existing or other microservices environments__ or __exposing commands as HTTP endpoints for clients__.

Here is a full example, of how the index file might look like, if you want to deploy a service to Kubernetes.
You can adjust this example for your actual requirements.

::: warning Node.js package required
If you use Node.js as runtime, you need to install the additional package `@hono/node-server` with version `1.0.0` or higher!
:::

::: code-tabs#code

@tab:active Node.js

```typescript
// src/index.ts
// For running on Node.js a small additional package is needed:
import { serve } from '@purista/hono-node-server'

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { AmqpBridge } from '@purista/amqpbridge'
import {
  DefaultConfigStore,
  DefaultSecretStore,
  DefaultStateStore,
  getNewInstanceId,
  gracefulShutdown,
  initLogger,
  UnhandledError,
} from '@purista/core'
import { getHttpServer } from '@purista/k8s-sdk'

import { theServiceV1Service } from './service/theService/v1/'

const main = async () => {
  // create a logger
  const logger = initLogger('debug')

  // add listeners to log really unexpected errors
  process.on('uncaughtException', (error, origin) => {
    const err = UnhandledError.fromError(error)
    logger.error({ err, origin }, `unhandled error: ${err.message}`)
  })

  process.on('unhandledRejection', (error, origin) => {
    const err = UnhandledError.fromError(error)
    logger.error({ err, origin }, `unhandled rejection: ${err.message}`)
  })

  // optional: set up opentelemetry if you like to use it
  const exporter = new OTLPTraceExporter({
    url: `http://localhost:14268/api/traces`,
  })
  const spanProcessor = new SimpleSpanProcessor(exporter)

  // optional: set up stores if they are needed for your service
  const secretStore = new DefaultSecretStore({ logger })
  const configStore = new DefaultConfigStore({ logger })
  const stateStore = new DefaultStateStore({ logger })

  // set up the eventbridge and start the event bridge
  const eventBridge = new AmqpBridge({
    spanProcessor,
    instanceId: process.env.HOSTNAME || getNewInstanceId(),
    config: {
      url: process.env.AMQP_URL,
    },
  })
  await eventBridge.start()

  // set up the service
  const theService = await theServiceV1Service.getInstance(eventBridge, {
    spanProcessor,
    configStore,
    secretStore,
    stateStore,
  })
  await theService.start()

  // create http server
  const app = getHttpServer({
    logger,
    // check event bridge health if /healthz endpoint is called
    healthFn: () => eventBridge.isHealthy(),
    // optional: expose the commands if they are defined to have url endpoint
    services: theService,
    // optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]
    // defaults to /api
    apiMountPath: '/api',
  })

  // start the http server
  // defaults to port 3000
  // optional: you can set the `port` in the optional parameter of this method
  // use the `serve` method form the `@purista/hono-node-server` package
  const server = serve({
    fetch: app.fetch,
  })

  // register shut down methods
  gracefulShutdown(logger, [
    // start with the event bridge to no longer accept incoming messages
    eventBridge,
    // optional: shut down the service
    theService,
    // optional: shut down the secret store
    secretStore,
    // optional: shut down the config store
    configStore,
    // optional: shut down the state store
    stateStore,
    {
      name: 'httpserver',
      destroy: async () => {
        server.closeIdleConnections()
        server.close()
      },
    },
  ])
}

main()
```

@tab Bun

```typescript
// src/index.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { AmqpBridge } from '@purista/amqpbridge'
import {
  DefaultConfigStore,
  DefaultSecretStore,
  DefaultStateStore,
  getNewInstanceId,
  gracefulShutdown,
  initLogger,
  UnhandledError,
} from '@purista/core'
import { getHttpServer } from '@purista/k8s-sdk'

import { theServiceV1Service } from './service/theService/v1/'

const main = async () => {
  // create a logger
  const logger = initLogger('debug')

  // add listeners to log really unexpected errors
  process.on('uncaughtException', (error, origin) => {
    const err = UnhandledError.fromError(error)
    logger.error({ err, origin }, `unhandled error: ${err.message}`)
  })

  process.on('unhandledRejection', (error, origin) => {
    const err = UnhandledError.fromError(error)
    logger.error({ err, origin }, `unhandled rejection: ${err.message}`)
  })

  // optional: set up opentelemetry if you like to use it
  const exporter = new OTLPTraceExporter({
    url: `http://localhost:14268/api/traces`,
  })
  const spanProcessor = new SimpleSpanProcessor(exporter)

  // optional: set up stores if they are needed for your service
  const secretStore = new DefaultSecretStore({ logger })
  const configStore = new DefaultConfigStore({ logger })
  const stateStore = new DefaultStateStore({ logger })

  // set up the eventbridge and start the event bridge
  const eventBridge = new AmqpBridge({
    spanProcessor,
    instanceId: process.env.HOSTNAME || getNewInstanceId(),
    config: {
      url: process.env.AMQP_URL,
    },
  })
  await eventBridge.start()

  // set up the service
  const theService = await theServiceV1Service.getInstance(eventBridge, {
    spanProcessor,
    configStore,
    secretStore,
    stateStore,
  })
  await theService.start()

  // create http server
  const app = getHttpServer({
    logger,
    // check event bridge health if /healthz endpoint is called
    healthFn: () => eventBridge.isHealthy(),
    // optional: expose the commands if they are defined to have url endpoint
    services: theService,
    // optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]
    // defaults to /api
    apiMountPath: '/api',
  })

  // start the http server
  // defaults to port 3000
  // optional: you can set the `port` in the optional parameter of this method
  // Use Bun native `serve` method
  const server = Bun.serve({
    fetch: app.fetch,
  })

  // register shut down methods
  gracefulShutdown(logger, [
    // start with the event bridge to no longer accept incoming messages
    eventBridge,
    // optional: shut down the service
    theService,
    // optional: shut down the secret store
    secretStore,
    // optional: shut down the config store
    configStore,
    // optional: shut down the state store
    stateStore,
    {
      name: 'httpserver',
      destroy: async () => {
        server.closeIdleConnections()
        server.close()
      },
    },
  ])
}

main()
```

:::

With this setup, you should be able to build and deploy your app as a container in Kubernetes like any other node-based service.

## Build a docker image

To get a docker image, which then can be deployed, you will need to have done two things:

- compile the typescript code base to plain JavaScript
- create a docker file with minimum resources (no dev dependencies) and compiled JavaScript

Luckily, we can do it in one big step, by using docker's [multi-stage builds](https://docs.docker.com/build/building/multi-stage/)

Place a `Dockerfile` into the root of your repository.
The file looks something like this.

```Dockerfile
FROM node:18-alpine as builder

RUN mkdir -p /app
WORKDIR /app

# should be improved by you depending on your needs
# AVOID TO COPY EVERYTHING FOR REAL PRODUCTION!
# use a .dockerignore file
COPY . .

RUN npm ci

RUN npx tsc
# or you can use esbuild
# RUN npx esbuild ./src/index.ts --bundle --platform=node --outfile=build/src/index.js

FROM node:18-alpine as app

ENV NODE_ENV=production

RUN mkdir -p /app
WORKDIR /app
COPY --chown=node:node --from=builder /app/package.json /app
COPY --chown=node:node --from=builder /app/build /app

RUN npm install --omit=dev

# exposed port must match the one used to start the http server in src/index.ts
EXPOSE 8080
ENTRYPOINT ["node", "index.js"]
```

::: warning
Please adjust this example to your needs.
You should improve it, by only copying needed things.
:::

Now, it's time to build the image.
To do so, run `docker build . -t the-service:v1`, which will create a docker imaged named `TheService` with the tag `v1`.
You can adjust the naming and tagging to your preferred way.

Because the image is currently only available on your local machine, you need to push it to a registry.
Kubernetes will then be able, to pull the image from the registry.
Which registry is used, depends on your project and environment.

Here is a basic __deployment.yaml__ file for Kubernetes.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: theServiceV1
    labels:
        app: theServiceV1
spec:
    replicas: 2
    selector:
        matchLabels:
            app: theServiceV1
    template:
        metadata:
            labels:
                app: theServiceV1
        spec:
            containers:
              - name: theServiceV1
                image: the-service:v1
                imagePullPolicy: IfNotPresent
                args:
                livenessProbe:
                  httpGet:
                    path: /healthz
                    port: 8080
                  initialDelaySeconds: 10
                  periodSeconds: 10

                readinessProbe:
                  httpGet:
                    path: /healthz
                    port: 8080
                  initialDelaySeconds: 5
                  periodSeconds: 10
```

::: warning
Please be aware, that this is just an example for demonstration and local development purpose.
You should adjust it for production, depending on your actual environment.
:::

## That's it?

Well, you might want to define a (Kubernetes) service, which makes Pods accessible to other Pods or users outside the cluster.

But, here we only focus on the PURISTA related stuff, and not go into details of Kubernetes. There are a bunch of good articles, documentations, how-to's, which cover the Kubernetes and infrastructure stuff a way better.

## Add custom endpoints

There might be the need, that you want to add some custom endpoints.
As an example, in [2.1 Service - Advanced](../../2_building_business-logic/advanced/index.md) we add [Prometheus](https://prometheus.io) to our service.  To allow Prometheus to collect the data, we need an additional `/metrics` endpoint.

We can simply extend our file `/src/index.ts`, to provide the endpoint `/metrics`

```typescript

// create http server
const server = getHttpServer({
  logger,
  // check event bridge health if /healthz endpoint is called
  healthFn: () => eventBridge.isHealthy(),
  // optional: expose the commands if they are defined to have url endpoint
  services: theService,
  // optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]
  // defaults to /api
  apiMountPath: '/api',
})

// add the metrics route
server.router.add('GET', '/metrics', async (_request, response) => {
  response.setHeader('content-type', register.contentType)
  response.end(await register.metrics())
})
```

The new endpoint `/metrics` can now be added to the __deployment.yaml__ file for Kubernetes.
