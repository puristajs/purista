[**@purista/dapr-sdk v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprEventBridge

# Class: DaprEventBridge

Defined in: [dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:42](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L42)

The DaprEventBridge connects to the Dapr sidecar container.
It provides endpoints for invoking commands, triggering subscriptions and emitting event messages.
The sidecar container invokes commands and subscriptions of the service connected to the event bridge.
A DaprClient (http fetch) is used for communication from the service/event bridge to the sidecar container.

Names for services, commands, subscriptions and events are converted to kebab-case.
If the event bridge is configured to expose REST endpoints defined in command builder, the endpoints are generated as defined in the command builder.

The event bridge is using Hono under the hood. You need to provide a `serve` function.
Depending on your runtime (Node, Bun, Deno) an adapter might be needed.

## See

[Hono website](https://hono.dev)

## Example

```typescript
import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'

const eventBridge = new DaprEventBridge({
   serve,
 })

// start the services first ...

await eventBridge.start()
```

## Extends

- [`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md)\<[`DaprEventBridgeConfig`](../type-aliases/DaprEventBridgeConfig.md)\>

## Implements

- [`EventBridge`](../../core/interfaces/EventBridge.md)

## Constructors

### new DaprEventBridge()

> **new DaprEventBridge**(`config`): [`DaprEventBridge`](DaprEventBridge.md)

Defined in: [dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L45)

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

###### enableHttpCompression?

`boolean`

enable HTTP compression in web server

**Default**

```ts
true
```

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

###### logger?

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

If no logger instance is given, use this log level

###### name?

`string`

name of the bridge

**Default**

```ts
HttpEventBridge
```

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

A OpenTelemetry span processor

###### subscriptionPayloadAsCloudEvent?

`boolean`

subscription invocations are wrapped in CloudEvent

**Link**

https://github.com/cloudevents/spec/tree/v1.0

**Default**

```ts
false
```

#### Returns

[`DaprEventBridge`](DaprEventBridge.md)

#### Overrides

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`constructor`](../../base-http-bridge/classes/HttpEventBridge.md#constructors)

## Properties

### app

> **app**: `Hono`

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:24

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`app`](../../base-http-bridge/classes/HttpEventBridge.md#app)

***

### client

> **client**: [`HttpEventBridgeClient`](../../base-http-bridge/interfaces/HttpEventBridgeClient.md)

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:27

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`client`](../../base-http-bridge/classes/HttpEventBridge.md#client-1)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<\{ `apiPrefix`: `string`; `clientConfig`: [`DaprClientConfig`](../type-aliases/DaprClientConfig.md); `commandPayloadAsCloudEvent`: `boolean`; `defaultCommandTimeout`: `number`; `enableHttpCompression`: `boolean`; `enableRestApiExpose`: `boolean`; `instanceId`: `string`; `logger`: [`Logger`](../../core/classes/Logger.md); `logLevel`: [`LogLevelName`](../../core/type-aliases/LogLevelName.md); `name`: `string`; `pathPrefix`: `string`; `serve`: (`options`) => `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\> \| `Http2Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `Http2SecureServer`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>; `serverHost`: `string`; `serverPort`: `number`; `spanProcessor`: `SpanProcessor`; `subscriptionPayloadAsCloudEvent`: `boolean`; \}\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`config`](../../base-http-bridge/classes/HttpEventBridge.md#config-1)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:17

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`defaultCommandTimeout`](../../core/interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`defaultCommandTimeout`](../../base-http-bridge/classes/HttpEventBridge.md#defaultcommandtimeout)

***

### instanceId

> **instanceId**: `string`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`instanceId`](../../base-http-bridge/classes/HttpEventBridge.md#instanceid)

***

### isShuttingDown

> **isShuttingDown**: `boolean`

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:25

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`isShuttingDown`](../../base-http-bridge/classes/HttpEventBridge.md#isshuttingdown)

***

### isStarted

> **isStarted**: `boolean`

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:26

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`isStarted`](../../base-http-bridge/classes/HttpEventBridge.md#isstarted)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`logger`](../../base-http-bridge/classes/HttpEventBridge.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`name`](../../core/interfaces/EventBridge.md#name)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`name`](../../base-http-bridge/classes/HttpEventBridge.md#name)

***

### server

> **server**: `undefined` \| `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\> \| `Http2Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `Http2SecureServer`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:23

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`server`](../../base-http-bridge/classes/HttpEventBridge.md#server)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`traceProvider`](../../base-http-bridge/classes/HttpEventBridge.md#traceprovider)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:41

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`destroy`](../../core/interfaces/EventBridge.md#destroy)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`destroy`](../../base-http-bridge/classes/HttpEventBridge.md#destroy)

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter`?): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:13

#### Type Parameters

• **K** *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### parameter?

`object`\[`K`\]

#### Returns

`void`

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`emit`](../../base-http-bridge/classes/HttpEventBridge.md#emit)

***

### emitMessage()

> **emitMessage**\<`T`\>(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:30

Emit a message to the eventbridge without awaiting a result

#### Type Parameters

• **T** *extends* [`EBMessage`](../../core/type-aliases/EBMessage.md)

#### Parameters

##### message

`Omit`\<[`EBMessage`](../../core/type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

the message

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`emitMessage`](../../core/interfaces/EventBridge.md#emitmessage)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`emitMessage`](../../base-http-bridge/classes/HttpEventBridge.md#emitmessage)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`getTracer`](../../base-http-bridge/classes/HttpEventBridge.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `ttl`?): `Promise`\<`T`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:31

Call a command of a service and return the result of this command

#### Type Parameters

• **T**

#### Parameters

##### input

`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../../core/enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `unknown`; `payload`: `unknown`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"` \| `"correlationId"` \| `"messageType"`\>

a partial command message

##### ttl?

`number`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`invoke`](../../core/interfaces/EventBridge.md#invoke)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`invoke`](../../base-http-bridge/classes/HttpEventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:37

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`isHealthy`](../../base-http-bridge/classes/HttpEventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:36

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isReady`](../../core/interfaces/EventBridge.md#isready)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`isReady`](../../base-http-bridge/classes/HttpEventBridge.md#isready)

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:12

#### Type Parameters

• **K** *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`off`](../../base-http-bridge/classes/HttpEventBridge.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:11

#### Type Parameters

• **K** *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`on`](../../base-http-bridge/classes/HttpEventBridge.md#on)

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:32

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

the address of the service command (service name, version and command name)

##### cb

(`message`) => `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"instanceId"`\>\> \| `Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"instanceId"`\>\>\>

the function to be called if a matching command arrives

##### metadata

###### expose

`object` & `object`

##### eventBridgeConfig

[`DefinitionEventBridgeConfig`](../../core/type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerCommand`](../../core/interfaces/EventBridge.md#registercommand)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`registerCommand`](../../base-http-bridge/classes/HttpEventBridge.md#registercommand)

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:97](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L97)

Register a new subscription

#### Parameters

##### subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

the subscription definition

##### cb

(`message`) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>

the function to be called if a matching message arrives

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerSubscription`](../../core/interfaces/EventBridge.md#registersubscription)

#### Overrides

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`registerSubscription`](../../base-http-bridge/classes/HttpEventBridge.md#registersubscription)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:14

#### Returns

`void`

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`removeAllListeners`](../../base-http-bridge/classes/HttpEventBridge.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L80)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`start`](../../core/interfaces/EventBridge.md#start)

#### Overrides

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`start`](../../base-http-bridge/classes/HttpEventBridge.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:33

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

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`startActiveSpan`](../../base-http-bridge/classes/HttpEventBridge.md#startactivespan)

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:33

Unregister a service command

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

The address (service name, version and command name) of the command to be de-registered

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterCommand`](../../core/interfaces/EventBridge.md#unregistercommand)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`unregisterCommand`](../../base-http-bridge/classes/HttpEventBridge.md#unregistercommand)

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:35

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterSubscription`](../../core/interfaces/EventBridge.md#unregistersubscription)

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`unregisterSubscription`](../../base-http-bridge/classes/HttpEventBridge.md#unregistersubscription)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context`?): `Promise`\<`F`\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:49

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type Parameters

• **F**

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### fn

(`span`) => `Promise`\<`F`\>

function te be executed in the span

##### context?

`Context`

span context

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md).[`wrapInSpan`](../../base-http-bridge/classes/HttpEventBridge.md#wrapinspan)
