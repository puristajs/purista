[**@purista/dapr-sdk v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprClient

# Class: DaprClient

Defined in: [dapr-sdk/src/DaprClient/DaprClient.impl.ts:17](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L17)

The HttpEventBridgeClient connects the HTTPEventBridge with the sidecar service.
This client is responsible for the communication to the sidecar service.

## Extends

- [`HttpClient`](../../core/classes/HttpClient.md)\<[`EventBridgeConfig`](../../core/type-aliases/EventBridgeConfig.md)\<[`DaprEventBridgeConfig`](../type-aliases/DaprEventBridgeConfig.md)\>\>

## Implements

- [`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md)

## Constructors

### new DaprClient()

> **new DaprClient**(`config`): [`DaprClient`](DaprClient.md)

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:28

#### Parameters

##### config

###### apiPrefix?

`string`

the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion
needs to `enableRestApiExpose` set to `true`

**Default**

```ts
/api
```

###### baseUrl

`string`

the base url to be used

**Example**

```typescript
const config = {
  baseUrl: 'http://localhost/api`
}
// each request will be below http://localhost/api
// get('v1/orders') will call http://localhost/api/v1/orders
```

###### basicAuth?

\{ `password`: `string`; `username`: `string`; \}

Basic-Auth information

###### basicAuth.password

`string`

Basic-Auth password

###### basicAuth.username

`string`

Basic-Auth username

###### bearerToken?

`string`

Auth-Bearer token

###### clientConfig?

[`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

###### commandPayloadAsCloudEvent?

`boolean`

command invocations are wrapped in CloudEvent

**Link**

https://github.com/cloudevents/spec/tree/v1.0

**Default**

```ts
false
```

###### defaultCommandTimeout?

`number`

Overwrite the hardcoded default timeout of command invocations

###### defaultHeaders?

`Record`\<`string`, `string`\>

Add your default headers here
These headers will be part of every request.
They can be overwritten per request option

###### defaultTimeout?

`number`

set global timeout for requests in ms

**Default**

```ts
30000
```

###### enableHttpCompression?

`boolean`

enable HTTP compression in web server

**Default**

```ts
true
```

###### enableOpentelemetry?

`boolean`

enable Opentelemetry tracing.
The client will be handled as own resource.

###### enableRestApiExpose?

`boolean`

expose commands as regular REST endpoints when they are configured as endpoints

**Default**

```ts
true
```

###### instanceId?

`string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

###### isKeepAlive?

`boolean`

If set to false, the HTTP client will not reuse the same connection for multiple requests.
Default is true.

###### logger?

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

the loglevel if no logger instance is given

###### name?

`string`

Name of the client

###### pathPrefix?

`string`

the prefix to be used for exposing commands as endpoints expecting a event bus message

**Default**

```ts
purista
```

###### serve

(`options`) => `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\> \| `Http2Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `Http2SecureServer`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

The serve function is depending on the runtime.

- Bun: `Bun.serve`
- Node.js: `serve` function from additional package `@hono/hono-node-server`
- Deno: `serve` function from package `https://deno.land/std/http/server.ts`

**See**

https://hono.dev

###### serverHost?

`string`

Host of the server.

**Default**

```ts
127.0.0.1
```

###### serverPort?

`number`

Port of the server.

**Default**

```ts
8080
```

###### spanProcessor?

`SpanProcessor`

Opentelemetry span processor

###### subscriptionPayloadAsCloudEvent?

`boolean`

subscription invocations are wrapped in CloudEvent

**Link**

https://github.com/cloudevents/spec/tree/v1.0

**Default**

```ts
false
```

###### traceId?

`string`

Custom trace Id

#### Returns

[`DaprClient`](DaprClient.md)

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`constructor`](../../core/classes/HttpClient.md#constructors)

## Properties

### auth

> `protected` **auth**: [`AuthCredentials`](../../core/type-aliases/AuthCredentials.md)

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:27

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`auth`](../../core/classes/HttpClient.md#auth)

***

### baseUrl

> **baseUrl**: `URL`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:24

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`baseUrl`](../../core/classes/HttpClient.md#baseurl)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:22

#### apiPrefix?

> `optional` **apiPrefix**: `string`

the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion
needs to `enableRestApiExpose` set to `true`

##### Default

```ts
/api
```

#### baseUrl

> **baseUrl**: `string`

the base url to be used

##### Example

```typescript
const config = {
  baseUrl: 'http://localhost/api`
}
// each request will be below http://localhost/api
// get('v1/orders') will call http://localhost/api/v1/orders
```

#### basicAuth?

> `optional` **basicAuth**: `object`

Basic-Auth information

##### basicAuth.password

> **basicAuth.password**: `string`

Basic-Auth password

##### basicAuth.username

> **basicAuth.username**: `string`

Basic-Auth username

#### bearerToken?

> `optional` **bearerToken**: `string`

Auth-Bearer token

#### clientConfig?

> `optional` **clientConfig**: [`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

#### commandPayloadAsCloudEvent?

> `optional` **commandPayloadAsCloudEvent**: `boolean`

command invocations are wrapped in CloudEvent

##### Link

https://github.com/cloudevents/spec/tree/v1.0

##### Default

```ts
false
```

#### defaultCommandTimeout?

> `optional` **defaultCommandTimeout**: `number`

Overwrite the hardcoded default timeout of command invocations

#### defaultHeaders?

> `optional` **defaultHeaders**: `Record`\<`string`, `string`\>

Add your default headers here
These headers will be part of every request.
They can be overwritten per request option

#### defaultTimeout?

> `optional` **defaultTimeout**: `number`

set global timeout for requests in ms

##### Default

```ts
30000
```

#### enableHttpCompression?

> `optional` **enableHttpCompression**: `boolean`

enable HTTP compression in web server

##### Default

```ts
true
```

#### enableOpentelemetry?

> `optional` **enableOpentelemetry**: `boolean`

enable Opentelemetry tracing.
The client will be handled as own resource.

#### enableRestApiExpose?

> `optional` **enableRestApiExpose**: `boolean`

expose commands as regular REST endpoints when they are configured as endpoints

##### Default

```ts
true
```

#### instanceId?

> `optional` **instanceId**: `string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

#### isKeepAlive?

> `optional` **isKeepAlive**: `boolean`

If set to false, the HTTP client will not reuse the same connection for multiple requests.
Default is true.

#### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

the loglevel if no logger instance is given

#### name?

> `optional` **name**: `string`

Name of the client

#### pathPrefix?

> `optional` **pathPrefix**: `string`

the prefix to be used for exposing commands as endpoints expecting a event bus message

##### Default

```ts
purista
```

#### serve()

> **serve**: (`options`) => `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\> \| `Http2Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `Http2SecureServer`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

The serve function is depending on the runtime.

- Bun: `Bun.serve`
- Node.js: `serve` function from additional package `@hono/hono-node-server`
- Deno: `serve` function from package `https://deno.land/std/http/server.ts`

##### Parameters

###### options

###### fetch

(`request`) => `unknown`

###### hostname?

`string`

###### port?

`number`

##### Returns

`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\> \| `Http2Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `Http2SecureServer`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

##### See

https://hono.dev

#### serverHost?

> `optional` **serverHost**: `string`

Host of the server.

##### Default

```ts
127.0.0.1
```

#### serverPort?

> `optional` **serverPort**: `number`

Port of the server.

##### Default

```ts
8080
```

#### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Opentelemetry span processor

#### subscriptionPayloadAsCloudEvent?

> `optional` **subscriptionPayloadAsCloudEvent**: `boolean`

subscription invocations are wrapped in CloudEvent

##### Link

https://github.com/cloudevents/spec/tree/v1.0

##### Default

```ts
false
```

#### traceId?

> `optional` **traceId**: `string`

Custom trace Id

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`config`](../../core/classes/HttpClient.md#config-1)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:21

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`logger`](../../core/classes/HttpClient.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:20

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`name`](../../core/classes/HttpClient.md#name)

***

### spanProcessor

> **spanProcessor**: `undefined` \| `SpanProcessor`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:25

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`spanProcessor`](../../core/classes/HttpClient.md#spanprocessor)

***

### timeout

> **timeout**: `number`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:23

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`timeout`](../../core/classes/HttpClient.md#timeout)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:26

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`traceProvider`](../../core/classes/HttpClient.md#traceprovider)

## Methods

### delete()

> **delete**\<`T`\>(`path`, `options`?, `payload`?): `Promise`\<`T`\>

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:97

DELETE request

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

##### payload?

`unknown`

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`delete`](../../core/classes/HttpClient.md#delete)

***

### execute()

> `protected` **execute**(`method`, `path`, `options`?, `payload`?): `Promise`\<`any`\>

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:62

Helper method

#### Parameters

##### method

`string`

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

##### payload?

`unknown`

#### Returns

`Promise`\<`any`\>

#### Throws

UnhandledError

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`execute`](../../core/classes/HttpClient.md#execute)

***

### get()

> **get**\<`T`\>(`path`, `options`?): `Promise`\<`T`\>

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:69

GET request

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`get`](../../core/classes/HttpClient.md#get)

***

### getApiPathForCommand()

> **getApiPathForCommand**(`addess`, `metadata`): `string`

Defined in: [dapr-sdk/src/DaprClient/DaprClient.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L28)

Generate the url path of the command based on the command builder `exposeAsHttpEndpoint` settings.
This url is a POST endpoint and expects the payload and parameter as defined for exposing.

#### Parameters

##### addess

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

##### metadata

###### expose

`object` & `object`

#### Returns

`string`

url path of endpoint

#### Implementation of

[`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md).[`getApiPathForCommand`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md#getapipathforcommand)

***

### getInternalPathForCommand()

> **getInternalPathForCommand**(`address`): `string`

Defined in: [dapr-sdk/src/DaprClient/DaprClient.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L23)

Generate the url path of the command.
This url is a POST endpoint and expects a command message as payload

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`string`

url path of endpoint

#### Implementation of

[`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md).[`getInternalPathForCommand`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md#getinternalpathforcommand)

***

### getInternalPathForSubscription()

> **getInternalPathForSubscription**(`address`): `string`

Defined in: [dapr-sdk/src/DaprClient/DaprClient.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L18)

Generate the url path of the subscription.
This url is a POST endpoint.
The expected payload is a EBMessage or an CloudEvent with an EBMessage as data depending on config settings

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`string`

url path of endpoint

#### Implementation of

[`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md).[`getInternalPathForSubscription`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md#getinternalpathforsubscription)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:34

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`getTracer`](../../core/classes/HttpClient.md#gettracer)

***

### getUrlAndHeader()

> `protected` **getUrlAndHeader**(`path`, `options`?): `object`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:44

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`object`

##### headers

> **headers**: `Record`\<`string`, `string`\>

##### url

> **url**: `URL`

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`getUrlAndHeader`](../../core/classes/HttpClient.md#geturlandheader)

***

### invoke()

> **invoke**(`command`, `headers`?, `timeout`?): `Promise`\<[`CommandResponse`](../../core/type-aliases/CommandResponse.md)\>

Defined in: [dapr-sdk/src/DaprClient/DaprClient.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L33)

Invoke a command

#### Parameters

##### command

Command

###### contentEncoding

`string`

content encoding of message payload

###### contentType

`string`

content type of message payload

###### correlationId

`string`

correlation id to know which command response referrs to which command

###### eventName?

`string`

event name for this message

###### id

`string`

global unique id of message

###### messageType

[`Command`](../../core/enumerations/EBMessageType.md#command)

###### otp?

`string`

stringified Opentelemetry parent trace id

###### payload

\{ `parameter`: `unknown`; `payload`: `unknown`; \}

###### payload.parameter

`unknown`

###### payload.payload

`unknown`

###### principalId?

`string`

principal id

###### receiver

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

###### sender

\{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}

###### sender.instanceId

`string`

instance id of eventbridge

###### sender.serviceName

`string`

the name of the service

###### sender.serviceTarget

`string`

the name of the command or subscription

###### sender.serviceVersion

`string`

the version of the service

###### tenantId?

`string`

principal id

###### timestamp

`number`

timestamp of message creation time

###### traceId?

`string`

trace id of message

##### headers?

`Record`\<`string`, `string`\>

optional HTTP header

##### timeout?

`number`

the command timeout

#### Returns

`Promise`\<[`CommandResponse`](../../core/type-aliases/CommandResponse.md)\>

#### Implementation of

[`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md).[`invoke`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md#invoke)

***

### isSidecarAvailable()

> **isSidecarAvailable**(): `Promise`\<`boolean`\>

Defined in: [dapr-sdk/src/DaprClient/DaprClient.impl.ts:63](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L63)

Checks if the sidecar container is available to be able to send events and invoke commands

#### Returns

`Promise`\<`boolean`\>

boolean

#### Implementation of

[`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md).[`isSidecarAvailable`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md#issidecaravailable)

***

### patch()

> **patch**\<`T`\>(`path`, `payload`, `options`?): `Promise`\<`T`\>

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:90

PATCH request

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`patch`](../../core/classes/HttpClient.md#patch)

***

### post()

> **post**\<`T`\>(`path`, `payload`, `options`?): `Promise`\<`T`\>

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:76

POST request

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`post`](../../core/classes/HttpClient.md#post)

***

### put()

> **put**\<`T`\>(`path`, `payload`, `options`?): `Promise`\<`T`\>

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:83

PUT request

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`put`](../../core/classes/HttpClient.md#put)

***

### sendEvent()

> **sendEvent**(`message`, `headers`?): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprClient/DaprClient.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/DaprClient.impl.ts#L48)

Send a EBMessage as event to the underlaying message infrastructure.

#### Parameters

##### message

[`EBMessage`](../../core/type-aliases/EBMessage.md)

##### headers?

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md).[`sendEvent`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md#sendevent)

***

### setBearerToken()

> **setBearerToken**(`token`): `void`

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:52

Set the bearer token for all following requests.

#### Parameters

##### token

the bearer token

`undefined` | `string`

#### Returns

`void`

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`setBearerToken`](../../core/classes/HttpClient.md#setbearertoken)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:43

Start a child span for opentelemetry tracking

#### Type Parameters

• **F**

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

optional context

`undefined` | `Context`

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`startActiveSpan`](../../core/classes/HttpClient.md#startactivespan)
