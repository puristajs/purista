[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / @purista/k8s-sdk

# Module: @purista/k8s-sdk

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

[packages/k8s-sdk/src/types.ts:8](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/k8s-sdk/src/types.ts#L8)

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

[packages/k8s-sdk/src/getHttpServer.impl.ts:10](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/k8s-sdk/src/getHttpServer.impl.ts#L10)

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

[packages/k8s-sdk/src/addServiceEndpoints.impl.ts:30](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/k8s-sdk/src/addServiceEndpoints.impl.ts#L30)

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

[packages/k8s-sdk/src/getHttpServer.impl.ts:26](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/k8s-sdk/src/getHttpServer.impl.ts#L26)
