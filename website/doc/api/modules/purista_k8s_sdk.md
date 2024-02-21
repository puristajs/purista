[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/k8s-sdk

# Module: @purista/k8s-sdk

SDK and helper to run PURISTA services in Kubernetes.

Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.

**`Example`**

```typescript
import { serve } from '@hono/node-server'
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

import { theServiceV1Service } from './service/theService/v1/index.js'

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
   url: process.env.AMQP_URL,
 })
 await eventBridge.start()

 // set up the service
 const theService = theServiceV1Service.getInstance(eventBridge, {
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
 // optional: you can set the port in the optional parameter of this method
 const server = serve({
   fetch: app.fetch,
 })

 // register shut down methods
 gracefulShutdown(logger, [
   // begin with the event bridge to no longer accept incoming messages
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
     destroy: async () =>
       new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve(undefined)))),
   },
 ])
}

main()

```

## Table of contents

### Type Aliases

- [GetHttpServerConfig](purista_k8s_sdk.md#gethttpserverconfig)

### Variables

- [puristaVersion](purista_k8s_sdk.md#puristaversion)

### Functions

- [addServiceEndpoints](purista_k8s_sdk.md#addserviceendpoints)
- [getHttpServer](purista_k8s_sdk.md#gethttpserver)

## Type Aliases

### GetHttpServerConfig

Ƭ **GetHttpServerConfig**: `Object`

The configuration object for creating the k8s http server

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiMountPath?` | `string` | the api mount path **`Default`** ```ts /api ``` |
| `disableEndpointExposing?` | `boolean` | disables adding of all endpoints for commands which are marked to be exposed as http endpoints |
| `enableHttpCompression?` | `boolean` | enable HTTP compression in web server **`Default`** ```ts true ``` |
| `healthFn` | () => `Promise`\<`boolean`\> | health function to be executed on health check |
| `hostname?` | `string` | hostname used in tracing and logging |
| `logger` | [`Logger`](../classes/purista_core.Logger.md) | a logger instance |
| `services?` | [`Service`](../classes/purista_core.Service.md) \| [`Service`](../classes/purista_core.Service.md)[] | service or array of services which should expose their commands as endpoints if defined |

#### Defined in

[types.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/k8s-sdk/src/types.ts#L6)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.10.8"``

#### Defined in

[version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/k8s-sdk/src/version.ts#L1)

## Functions

### addServiceEndpoints

▸ **addServiceEndpoints**(`services`, `app`, `logger`, `apiMountPath?`): `void`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `services` | `undefined` \| [`Service`](../classes/purista_core.Service.md)\<`unknown`\> \| [`Service`](../classes/purista_core.Service.md)\<`unknown`\>[] | `undefined` | instance of the service to add |
| `app` | `Hono`\<`Env`, `BlankSchema`, ``"/"``\> | `undefined` | - |
| `logger` | [`Logger`](../classes/purista_core.Logger.md) | `undefined` | the logger used for logging the addition |
| `apiMountPath` | `string` | `'/api'` | - |

#### Returns

`void`

**`Default`**

```ts
/api
```

#### Defined in

[addServiceEndpoints.impl.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/k8s-sdk/src/addServiceEndpoints.impl.ts#L27)

___

### getHttpServer

▸ **getHttpServer**(`input`, `name?`): `Hono`\<`Env`, `BlankSchema`, ``"/"``\>

Create a Hono web server.
It adds per default the /healthz endpoint
If services is set in options, all commands, which have defined http endpoints, will also be added as endpoints

The returned server is not started. You need to do it manually.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `input` | [`GetHttpServerConfig`](purista_k8s_sdk.md#gethttpserverconfig) | `undefined` | the config |
| `name` | `string` | `'K8sHttpHelperServer'` | - |

#### Returns

`Hono`\<`Env`, `BlankSchema`, ``"/"``\>

a object with server, router, start and destroy functions and name var

#### Defined in

[getHttpServer.impl.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/k8s-sdk/src/getHttpServer.impl.ts#L21)
