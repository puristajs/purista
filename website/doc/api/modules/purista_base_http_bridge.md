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

### Variables

- [puristaVersion](purista_base_http_bridge.md#puristaversion)

### Functions

- [getDefaultHttpEventBridgeConfig](purista_base_http_bridge.md#getdefaulthttpeventbridgeconfig)

## Type Aliases

### HttpEventBridgeConfig

Ƭ **HttpEventBridgeConfig**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` **`Default`** ```ts /api ``` |
| `commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |
| `enableHttpCompression?` | `boolean` | enable HTTP compression in web server **`Default`** ```ts true ``` |
| `enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints **`Default`** ```ts true ``` |
| `name?` | `string` | name of the bridge **`Default`** ```ts HttpEventBridge ``` |
| `pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message **`Default`** ```ts purista ``` |
| `serve` | (`options`: \{ `fetch`: (`request`: `Request`) => `Promise`\<`unknown`\> \| `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server` \| `Http2Server` \| `Http2SecureServer` | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `serverHost?` | `string` | Host of the server. **`Default`** ```ts 127.0.0.1 ``` |
| `serverPort?` | `number` | Port of the server. **`Default`** ```ts 8080 ``` |
| `subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L4)

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

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.9.1"``

#### Defined in

[base-http-bridge/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/version.ts#L1)

## Functions

### getDefaultHttpEventBridgeConfig

▸ **getDefaultHttpEventBridgeConfig**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` **`Default`** ```ts /api ``` |
| `commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |
| `defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `enableHttpCompression?` | `boolean` | enable HTTP compression in web server **`Default`** ```ts true ``` |
| `enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints **`Default`** ```ts true ``` |
| `instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `logLevel?` | [`LogLevelName`](purista_core.md#loglevelname) | If no logger instance is given, use this log level |
| `logger?` | [`Logger`](../classes/purista_core.Logger.md) | A logger instance |
| `name?` | `string` | name of the bridge **`Default`** ```ts HttpEventBridge ``` |
| `pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message **`Default`** ```ts purista ``` |
| `serverHost?` | `string` | Host of the server. **`Default`** ```ts 127.0.0.1 ``` |
| `serverPort?` | `number` | Port of the server. **`Default`** ```ts 8080 ``` |
| `spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |

#### Defined in

[base-http-bridge/src/HttpEventBridge/getDefaultHttpEventBridgeConfig.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/getDefaultHttpEventBridgeConfig.impl.ts#L5)
