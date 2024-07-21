[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprClient

# Class: DaprClient

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprClient

The HttpEventBridgeClient connects the HTTPEventBridge with the sidecar service.
This client is responsible for the communication to the sidecar service.

## Hierarchy

- [`HttpClient`](purista_core.HttpClient.md)\<[`EventBridgeConfig`](../modules/purista_core.md#eventbridgeconfig)\<[`DaprEventBridgeConfig`](../modules/purista_dapr_sdk.md#dapreventbridgeconfig)\>\>

  ↳ **`DaprClient`**

## Implements

- [`HttpEventBridgeClient`](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md)

## Table of contents

### Constructors

- [constructor](purista_dapr_sdk.DaprClient.md#constructor)

### Properties

- [auth](purista_dapr_sdk.DaprClient.md#auth)
- [baseUrl](purista_dapr_sdk.DaprClient.md#baseurl)
- [config](purista_dapr_sdk.DaprClient.md#config)
- [logger](purista_dapr_sdk.DaprClient.md#logger)
- [name](purista_dapr_sdk.DaprClient.md#name)
- [spanProcessor](purista_dapr_sdk.DaprClient.md#spanprocessor)
- [timeout](purista_dapr_sdk.DaprClient.md#timeout)
- [traceProvider](purista_dapr_sdk.DaprClient.md#traceprovider)

### Methods

- [delete](purista_dapr_sdk.DaprClient.md#delete)
- [execute](purista_dapr_sdk.DaprClient.md#execute)
- [get](purista_dapr_sdk.DaprClient.md#get)
- [getApiPathForCommand](purista_dapr_sdk.DaprClient.md#getapipathforcommand)
- [getInternalPathForCommand](purista_dapr_sdk.DaprClient.md#getinternalpathforcommand)
- [getInternalPathForSubscription](purista_dapr_sdk.DaprClient.md#getinternalpathforsubscription)
- [getTracer](purista_dapr_sdk.DaprClient.md#gettracer)
- [getUrlAndHeader](purista_dapr_sdk.DaprClient.md#geturlandheader)
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
| `config.apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` **`Default`** ```ts /api ``` |
| `config.baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `config.basicAuth?` | `Object` | Basic-Auth information |
| `config.basicAuth.password` | `string` | Basic-Auth password |
| `config.basicAuth.username` | `string` | Basic-Auth username |
| `config.bearerToken?` | `string` | Auth-Bearer token |
| `config.clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | - |
| `config.commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `config.defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `config.enableHttpCompression?` | `boolean` | enable HTTP compression in web server **`Default`** ```ts true ``` |
| `config.enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own resource. |
| `config.enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints **`Default`** ```ts true ``` |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | the loglevel if no logger instance is given |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.name?` | `string` | Name of the client |
| `config.pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message **`Default`** ```ts purista ``` |
| `config.serve` | (`options`: \{ `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> \| `Http2Server` \| `Http2SecureServer` | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `config.serverHost?` | `string` | Host of the server. **`Default`** ```ts 127.0.0.1 ``` |
| `config.serverPort?` | `number` | Port of the server. **`Default`** ```ts 8080 ``` |
| `config.spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `config.subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |
| `config.traceId?` | `string` | Custom trace Id |

#### Returns

[`DaprClient`](purista_dapr_sdk.DaprClient.md)

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[constructor](purista_core.HttpClient.md#constructor)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:28

## Properties

### auth

• `Protected` **auth**: [`AuthCredentials`](../modules/purista_core.md#authcredentials)

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[auth](purista_core.HttpClient.md#auth)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:27

___

### baseUrl

• **baseUrl**: `URL`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[baseUrl](purista_core.HttpClient.md#baseurl)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:24

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` **`Default`** ```ts /api ``` |
| `baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `basicAuth?` | \{ `password`: `string` ; `username`: `string`  } | Basic-Auth information |
| `basicAuth.password` | `string` | Basic-Auth password |
| `basicAuth.username` | `string` | Basic-Auth username |
| `bearerToken?` | `string` | Auth-Bearer token |
| `clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | - |
| `commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |
| `defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `enableHttpCompression?` | `boolean` | enable HTTP compression in web server **`Default`** ```ts true ``` |
| `enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own resource. |
| `enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints **`Default`** ```ts true ``` |
| `instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | the loglevel if no logger instance is given |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `name?` | `string` | Name of the client |
| `pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message **`Default`** ```ts purista ``` |
| `serve` | (`options`: \{ `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> \| `Http2Server` \| `Http2SecureServer` | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `serverHost?` | `string` | Host of the server. **`Default`** ```ts 127.0.0.1 ``` |
| `serverPort?` | `number` | Port of the server. **`Default`** ```ts 8080 ``` |
| `spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |
| `traceId?` | `string` | Custom trace Id |

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[config](purista_core.HttpClient.md#config)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:22

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[logger](purista_core.HttpClient.md#logger)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:21

___

### name

• **name**: `string`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[name](purista_core.HttpClient.md#name)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:20

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[spanProcessor](purista_core.HttpClient.md#spanprocessor)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:25

___

### timeout

• **timeout**: `number`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[timeout](purista_core.HttpClient.md#timeout)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:23

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[traceProvider](purista_core.HttpClient.md#traceprovider)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:26

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |
| `payload?` | `unknown` |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[delete](purista_core.HttpClient.md#delete)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:97

___

### execute

▸ **execute**(`method`, `path`, `options?`, `payload?`): `Promise`\<`any`\>

Helper method

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |
| `payload?` | `unknown` |

#### Returns

`Promise`\<`any`\>

**`Throws`**

UnhandledError

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[execute](purista_core.HttpClient.md#execute)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:62

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[get](purista_core.HttpClient.md#get)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:69

___

### getApiPathForCommand

▸ **getApiPathForCommand**(`addess`, `metadata`): `string`

Generate the url path of the command based on the command builder `exposeAsHttpEndpoint` settings.
This url is a POST endpoint and expects the payload and parameter as defined for exposing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addess` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `metadata` | `Object` |
| `metadata.expose` | \{ `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & \{ `http`: \{ `method`: ``"POST"`` \| ``"GET"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: \{ `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](../modules/purista_core.md#queryparameter)\<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |

#### Returns

`string`

url path of endpoint

#### Implementation of

[HttpEventBridgeClient](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md).[getApiPathForCommand](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md#getapipathforcommand)

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L28)

___

### getInternalPathForCommand

▸ **getInternalPathForCommand**(`address`): `string`

Generate the url path of the command.
This url is a POST endpoint and expects a command message as payload

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`string`

url path of endpoint

#### Implementation of

[HttpEventBridgeClient](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md).[getInternalPathForCommand](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md#getinternalpathforcommand)

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L23)

___

### getInternalPathForSubscription

▸ **getInternalPathForSubscription**(`address`): `string`

Generate the url path of the subscription.
This url is a POST endpoint.
The expected payload is a EBMessage or an CloudEvent with an EBMessage as data depending on config settings

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`string`

url path of endpoint

#### Implementation of

[HttpEventBridgeClient](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md).[getInternalPathForSubscription](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md#getinternalpathforsubscription)

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L18)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[getTracer](purista_core.HttpClient.md#gettracer)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:34

___

### getUrlAndHeader

▸ **getUrlAndHeader**(`path`, `options?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `headers` | `Record`\<`string`, `string`\> |
| `url` | `URL` |

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[getUrlAndHeader](purista_core.HttpClient.md#geturlandheader)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:44

___

### invoke

▸ **invoke**(`command`, `headers?`, `timeout?`): `Promise`\<[`CommandResponse`](../modules/purista_core.md#commandresponse)\>

Invoke a command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `command` | `Object` | Command |
| `command.contentEncoding` | `string` | content encoding of message payload |
| `command.contentType` | `string` | content type of message payload |
| `command.correlationId` | `string` | correlation id to know which command response referrs to which command |
| `command.eventName?` | `string` | event name for this message |
| `command.id` | `string` | global unique id of message |
| `command.messageType` | [`Command`](../enums/purista_core.EBMessageType.md#command) | - |
| `command.otp?` | `string` | stringified Opentelemetry parent trace id |
| `command.payload` | `Object` | - |
| `command.payload.parameter` | `unknown` | - |
| `command.payload.payload` | `unknown` | - |
| `command.principalId?` | `string` | principal id |
| `command.receiver` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | - |
| `command.sender` | `Object` | - |
| `command.sender.instanceId` | `string` | instance id of eventbridge |
| `command.sender.serviceName` | `string` | the name of the service |
| `command.sender.serviceTarget` | `string` | the name of the command or subscription |
| `command.sender.serviceVersion` | `string` | the version of the service |
| `command.tenantId?` | `string` | principal id |
| `command.timestamp` | `number` | timestamp of message creation time |
| `command.traceId?` | `string` | trace id of message |
| `headers?` | `Record`\<`string`, `string`\> | optional HTTP header |
| `timeout?` | `number` | the command timeout |

#### Returns

`Promise`\<[`CommandResponse`](../modules/purista_core.md#commandresponse)\>

#### Implementation of

[HttpEventBridgeClient](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md).[invoke](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md#invoke)

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L33)

___

### isSidecarAvailable

▸ **isSidecarAvailable**(): `Promise`\<`boolean`\>

Checks if the sidecar container is available to be able to send events and invoke commands

#### Returns

`Promise`\<`boolean`\>

boolean

#### Implementation of

[HttpEventBridgeClient](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md).[isSidecarAvailable](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md#issidecaravailable)

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:63](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L63)

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[patch](purista_core.HttpClient.md#patch)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:90

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[post](purista_core.HttpClient.md#post)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:76

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[put](purista_core.HttpClient.md#put)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:83

___

### sendEvent

▸ **sendEvent**(`message`, `headers?`): `Promise`\<`void`\>

Send a EBMessage as event to the underlaying message infrastructure.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) |
| `headers?` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[HttpEventBridgeClient](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md).[sendEvent](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md#sendevent)

#### Defined in

[dapr-sdk/src/DaprClient/DaprClient.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L48)

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

[HttpClient](purista_core.HttpClient.md).[setBearerToken](purista_core.HttpClient.md#setbearertoken)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:52

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

[HttpClient](purista_core.HttpClient.md).[startActiveSpan](purista_core.HttpClient.md#startactivespan)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:43
