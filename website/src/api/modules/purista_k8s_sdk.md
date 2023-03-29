[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / @purista/k8s-sdk

# Module: @purista/k8s-sdk

SDK and helper to run PURISTA services in Kubernetes.

Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.

**`Example`**

```typescript
// src/index.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import {
  DefaultConfigStore,
  DefaultEventBridge,
  DefaultSecretStore,
  DefaultStateStore,
  gracefulShutdown,
  initLogger,
} from '@purista/core'
import { getHttpServer } from '@purista/k8s-sdk'

import { theServiceV1Service } from './service/theService/v1/'

const main = async () => {
  // create a logger
  const logger = initLogger()

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
  const eventBridge = new DefaultEventBridge({}, { spanProcessor })
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
    // stop the http server
    server,
  ])

  // start the http server
  // defaults to port 8080
  // optional: you can set the port in the optional parameter of this method
  await server.start()
}

main()
```

## Table of contents

### Namespaces

- [internal](purista_k8s_sdk.internal.md)

### Type Aliases

- [GetHttpServerConfig](purista_k8s_sdk.md#gethttpserverconfig)
- [RouterFunction](purista_k8s_sdk.md#routerfunction)

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
| `apiMountPath?` | `string` | the api mount path **`Default`** /api |
| `healthFn` | () => `Promise`<`boolean`\> | health function to be executed on health check |
| `httpServerOptions?` | `ServerOptions` | node http module server options |
| `logger` | [`Logger`](../classes/purista_k8s_sdk.internal.Logger.md) | a logger instance |
| `services?` | [`Service`](../classes/purista_k8s_sdk.internal.Service.md) \| [`Service`](../classes/purista_k8s_sdk.internal.Service.md)[] | service or array of services which should expose their commands as endpoints if defined |

#### Defined in

[packages/k8s-sdk/src/types.ts:8](https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/types.ts#L8)

___

### RouterFunction

Ƭ **RouterFunction**: (`request`: `IncomingMessage`, `response`: `ServerResponse`, `parameter`: `Record`<`string`, `unknown`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`request`, `response`, `parameter`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `IncomingMessage` |
| `response` | `ServerResponse` |
| `parameter` | `Record`<`string`, `unknown`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[packages/k8s-sdk/src/getHttpServer.impl.ts:10](https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/getHttpServer.impl.ts#L10)

## Functions

### addServiceEndpoints

▸ **addServiceEndpoints**(`services`, `router`, `logger`, `apiMountPath?`): `void`

**`Default`**

/api

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `services` | `undefined` \| [`Service`](../classes/purista_k8s_sdk.internal.Service.md)<`unknown`\> \| [`Service`](../classes/purista_k8s_sdk.internal.Service.md)<`unknown`\>[] | `undefined` | instance of the service to add |
| `router` | `default`<`Function`\> | `undefined` | the TRouter instance |
| `logger` | [`Logger`](../classes/purista_k8s_sdk.internal.Logger.md) | `undefined` | the logger used for logging the addition |
| `apiMountPath` | `string` | `'/api'` |  |

#### Returns

`void`

#### Defined in

[packages/k8s-sdk/src/addServiceEndpoints.impl.ts:30](https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/addServiceEndpoints.impl.ts#L30)

___

### getHttpServer

▸ **getHttpServer**(`input`, `name?`): `Object`

Create a basic http web server.
It adds per default the /healthz endpoint
If services is set in options, all commands, which have defined http endpoints, will also be added as endpoints

The returned server is not started. You need to do it manually.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `input` | [`GetHttpServerConfig`](purista_k8s_sdk.md#gethttpserverconfig) | `undefined` | the config |
| `name` | `string` | `'K8sHttpHelperServer'` | - |

#### Returns

`Object`

a object with server, router, start and destroy functions and name var

| Name | Type |
| :------ | :------ |
| `destroy` | () => `Promise`<`void`\> |
| `name` | `string` |
| `router` | `default`<[`RouterFunction`](purista_k8s_sdk.md#routerfunction)\> |
| `server` | `Server`<typeof `IncomingMessage`, typeof `ServerResponse`\> |
| `start` | (`port`: `number`) => `Promise`<`void`\> |

#### Defined in

[packages/k8s-sdk/src/getHttpServer.impl.ts:26](https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/getHttpServer.impl.ts#L26)
