[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/base-http-bridge

# Module: @purista/base-http-bridge

## Table of contents

### Classes

- [HttpEventBridge](../classes/purista_base_http_bridge.HttpEventBridge.md)

### Interfaces

- [HttpEventBridgeClient](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md)

### Type Aliases

- [HttpEventBridgeConfig](purista_base_http_bridge.md#httpeventbridgeconfig)
- [RouterFunction](purista_base_http_bridge.md#routerfunction)

### Functions

- [getDefaultHttpEventBridgeConfig](purista_base_http_bridge.md#getdefaulthttpeventbridgeconfig)

## Type Aliases

### HttpEventBridgeConfig

Ƭ **HttpEventBridgeConfig**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` |
| `commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |
| `enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints |
| `name?` | `string` | name of the bridge |
| `pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message |
| `serve` | (`options`: \{ `fetch`: (`request`: `Request`) => `Promise`\<`unknown`\> \| `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server` | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `serverHost?` | `string` | Host of the server. |
| `serverPort?` | `number` | Port of the server. |
| `subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L3)

___

### RouterFunction

Ƭ **RouterFunction**\<`T`\>: (`this`: `T`, `c`: `Context`) => `Promise`\<`Response`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`HttpEventBridge`](../classes/purista_base_http_bridge.HttpEventBridge.md)\<[`HttpEventBridgeConfig`](purista_base_http_bridge.md#httpeventbridgeconfig)\> = [`HttpEventBridge`](../classes/purista_base_http_bridge.HttpEventBridge.md)\<[`HttpEventBridgeConfig`](purista_base_http_bridge.md#httpeventbridgeconfig)\> |

#### Type declaration

▸ (`this`, `c`): `Promise`\<`Response`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `T` |
| `c` | `Context` |

##### Returns

`Promise`\<`Response`\>

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/RouterFunction.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/RouterFunction.ts#L6)

## Functions

### getDefaultHttpEventBridgeConfig

▸ **getDefaultHttpEventBridgeConfig**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` |
| `commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |
| `defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints |
| `instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `logLevel?` | `LogLevelName` | If no logger instance is given, use this log level |
| `logger?` | `Logger` | A logger instance |
| `name?` | `string` | name of the bridge |
| `pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message |
| `serverHost?` | `string` | Host of the server. |
| `serverPort?` | `number` | Port of the server. |
| `spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |

#### Defined in

[base-http-bridge/src/HttpEventBridge/getDefaultHttpEventBridgeConfig.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/getDefaultHttpEventBridgeConfig.impl.ts#L5)
