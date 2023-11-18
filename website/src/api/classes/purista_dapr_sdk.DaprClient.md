[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprClient

# Class: DaprClient

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprClient

## Hierarchy

- `HttpClient`\<`EventBridgeConfig`\<[`DaprEventBridgeConfig`](../modules/purista_dapr_sdk.md#dapreventbridgeconfig)\>\>

  ↳ **`DaprClient`**

## Implements

- `HttpEventBridgeClient`

## Table of contents

### Constructors

- [constructor](purista_dapr_sdk.DaprClient.md#constructor)

### Properties

- [baseUrl](purista_dapr_sdk.DaprClient.md#baseurl)
- [config](purista_dapr_sdk.DaprClient.md#config)
- [logger](purista_dapr_sdk.DaprClient.md#logger)
- [name](purista_dapr_sdk.DaprClient.md#name)
- [spanProcessor](purista_dapr_sdk.DaprClient.md#spanprocessor)
- [timeout](purista_dapr_sdk.DaprClient.md#timeout)
- [traceProvider](purista_dapr_sdk.DaprClient.md#traceprovider)

### Methods

- [delete](purista_dapr_sdk.DaprClient.md#delete)
- [get](purista_dapr_sdk.DaprClient.md#get)
- [getApiPathForCommand](purista_dapr_sdk.DaprClient.md#getapipathforcommand)
- [getInternalPathForCommand](purista_dapr_sdk.DaprClient.md#getinternalpathforcommand)
- [getInternalPathForSubscription](purista_dapr_sdk.DaprClient.md#getinternalpathforsubscription)
- [getTracer](purista_dapr_sdk.DaprClient.md#gettracer)
- [invoke](purista_dapr_sdk.DaprClient.md#invoke)
- [isSidecarAvailable](purista_dapr_sdk.DaprClient.md#issidecaravailable)
- [patch](purista_dapr_sdk.DaprClient.md#patch)
- [post](purista_dapr_sdk.DaprClient.md#post)
- [put](purista_dapr_sdk.DaprClient.md#put)
- [sendEvent](purista_dapr_sdk.DaprClient.md#sendevent)
- [setBearerToken](purista_dapr_sdk.DaprClient.md#setbearertoken)
- [startActiveSpan](purista_dapr_sdk.DaprClient.md#startactivespan)

## Constructors

### constructor

• **new DaprClient**(`config`): [`DaprClient`](purista_dapr_sdk.DaprClient.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | - |
| `config.apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` |
| `config.baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `config.basicAuth?` | `Object` | Basic-Auth information |
| `config.basicAuth.password` | `string` | Basic-Auth password |
| `config.basicAuth.username` | `string` | Basic-Auth username |
| `config.bearerToken?` | `string` | Auth-Bearer token |
| `config.clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | - |
| `config.commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `config.defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `config.enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `config.enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `config.logLevel?` | `LogLevelName` | the loglevel if no logger instance is given |
| `config.logger?` | `Logger` | A logger instance |
| `config.name?` | `string` | Name of the client |
| `config.pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message |
| `config.serve` | (`options`: \{ `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `config.serverHost?` | `string` | Host of the server. |
| `config.serverPort?` | `number` | Port of the server. |
| `config.spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `config.subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |

#### Returns

[`DaprClient`](purista_dapr_sdk.DaprClient.md)

#### Inherited from

HttpClient\<EventBridgeConfig\<DaprEventBridgeConfig\>\>.constructor

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:26

## Properties

### baseUrl

• **baseUrl**: `URL`

#### Inherited from

HttpClient.baseUrl

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:22

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` |
| `baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `basicAuth?` | \{ `password`: `string` ; `username`: `string`  } | Basic-Auth information |
| `basicAuth.password` | `string` | Basic-Auth password |
| `basicAuth.username` | `string` | Basic-Auth username |
| `bearerToken?` | `string` | Auth-Bearer token |
| `clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | - |
| `commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |
| `defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints |
| `instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `logLevel?` | `LogLevelName` | the loglevel if no logger instance is given |
| `logger?` | `Logger` | A logger instance |
| `name?` | `string` | Name of the client |
| `pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message |
| `serve` | (`options`: \{ `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `serverHost?` | `string` | Host of the server. |
| `serverPort?` | `number` | Port of the server. |
| `spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |

#### Inherited from

HttpClient.config

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:20

___

### logger

• **logger**: `Logger`

#### Inherited from

HttpClient.logger

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:19

___

### name

• **name**: `string`

#### Inherited from

HttpClient.name

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:18

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

HttpClient.spanProcessor

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:23

___

### timeout

• **timeout**: `number`

#### Inherited from

HttpClient.timeout

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:21

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

HttpClient.traceProvider

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:24

## Methods

### delete

▸ **delete**\<`T`\>(`path`, `options?`, `payload?`): `Promise`\<`T`\>

DELETE request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | `HttpClientRequestOptions` |
| `payload?` | `unknown` |

#### Returns

`Promise`\<`T`\>

#### Inherited from

HttpClient.delete

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:92

___

### get

▸ **get**\<`T`\>(`path`, `options?`): `Promise`\<`T`\>

GET request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`\<`T`\>

#### Inherited from

HttpClient.get

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:64

___

### getApiPathForCommand

▸ **getApiPathForCommand**(`addess`, `metadata`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addess` | `EBMessageAddress` |
| `metadata` | `Object` |
| `metadata.expose` | \{ `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & \{ `http`: \{ `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: \{ `additionalStatusCodes?`: `StatusCode`[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: `QueryParameter`\<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |

#### Returns

`string`

#### Implementation of

HttpEventBridgeClient.getApiPathForCommand

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L31)

___

### getInternalPathForCommand

▸ **getInternalPathForCommand**(`address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

#### Returns

`string`

#### Implementation of

HttpEventBridgeClient.getInternalPathForCommand

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L26)

___

### getInternalPathForSubscription

▸ **getInternalPathForSubscription**(`address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

#### Returns

`string`

#### Implementation of

HttpEventBridgeClient.getInternalPathForSubscription

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L21)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

HttpClient.getTracer

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:32

___

### invoke

▸ **invoke**(`command`, `headers?`, `timeout?`): `Promise`\<`CommandResponse`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `command` | `Object` | - |
| `command.contentEncoding` | `string` | content encoding of message payload |
| `command.contentType` | `string` | content type of message payload |
| `command.correlationId` | `string` | correlation id to know which command response referrs to which command |
| `command.eventName?` | `string` | event name for this message |
| `command.id` | `string` | global unique id of message |
| `command.messageType` | `Command` | - |
| `command.otp?` | `string` | stringified Opentelemetry parent trace id |
| `command.payload` | `Object` | - |
| `command.payload.parameter` | `unknown` | - |
| `command.payload.payload` | `unknown` | - |
| `command.principalId?` | `string` | principal id |
| `command.receiver` | `EBMessageAddress` | - |
| `command.sender` | \{ serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } | - |
| `command.tenantId?` | `string` | principal id |
| `command.timestamp` | `number` | timestamp of message creation time |
| `command.traceId?` | `string` | trace id of message |
| `headers?` | `Record`\<`string`, `string`\> | - |
| `timeout?` | `number` | - |

#### Returns

`Promise`\<`CommandResponse`\>

#### Implementation of

HttpEventBridgeClient.invoke

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:36](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L36)

___

### isSidecarAvailable

▸ **isSidecarAvailable**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

HttpEventBridgeClient.isSidecarAvailable

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L66)

___

### patch

▸ **patch**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

PATCH request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`\<`T`\>

#### Inherited from

HttpClient.patch

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:85

___

### post

▸ **post**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

POST request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`\<`T`\>

#### Inherited from

HttpClient.post

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:71

___

### put

▸ **put**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

PUT request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`\<`T`\>

#### Inherited from

HttpClient.put

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:78

___

### sendEvent

▸ **sendEvent**(`message`, `headers?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `EBMessage` |
| `headers?` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Implementation of

HttpEventBridgeClient.sendEvent

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L51)

___

### setBearerToken

▸ **setBearerToken**(`token`): `void`

Set the bearer token for all following requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `undefined` \| `string` | the bearer token |

#### Returns

`void`

#### Inherited from

HttpClient.setBearerToken

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:47

___

### startActiveSpan

▸ **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Start a child span for opentelemetry tracking

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `context` | `undefined` \| `Context` | optional context |
| `fn` | (`span`: `Span`) => `Promise`\<`F`\> | function to be executed within the span |

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

HttpClient.startActiveSpan

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:41
