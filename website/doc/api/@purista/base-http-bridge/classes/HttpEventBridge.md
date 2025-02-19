[**@purista/base-http-bridge v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/base-http-bridge](../README.md) / HttpEventBridge

# Class: HttpEventBridge\<CustomConfig\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L65)

The HTTP event bridge is a generic event bridge.
In environments like Dapr or Knative, the communication is done via sidecar containers and via HTTP.

In these cases, it is expected, that the current instance is a HTTP server, which provides REST endpoints for commands and subscriptions.
The communication from the current instance to the sidecar is also done via REST endpoints.

HTTP calls from the sidecar to the current instance might be done via CloudEvent schema, which wraps the payload into a defined structure.
The HttpEventBridge can be configured to respect this, and to extract the information from CloudEvents.

To use the HttpEventBridge, you will need following peer-dependencies installed:

- hono
- trouter

## Extends

- [`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md)\<`CustomConfig`\>

## Extended by

- [`DaprEventBridge`](../../dapr-sdk/classes/DaprEventBridge.md)

## Type Parameters

• **CustomConfig** *extends* [`HttpEventBridgeConfig`](../type-aliases/HttpEventBridgeConfig.md)

## Implements

- [`EventBridge`](../../core/interfaces/EventBridge.md)

## Constructors

### new HttpEventBridge()

> **new HttpEventBridge**\<`CustomConfig`\>(`config`, `client`): [`HttpEventBridge`](HttpEventBridge.md)\<`CustomConfig`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L76)

#### Parameters

##### config

\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; spanProcessor?: SpanProcessor \} & CustomConfig)\[K\] \}

##### client

[`HttpEventBridgeClient`](../interfaces/HttpEventBridgeClient.md)

#### Returns

[`HttpEventBridge`](HttpEventBridge.md)\<`CustomConfig`\>

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`constructor`](../../core/classes/EventBridgeBaseClass.md#constructors)

## Properties

### app

> **app**: `Hono`

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:70](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L70)

***

### client

> **client**: [`HttpEventBridgeClient`](../interfaces/HttpEventBridgeClient.md)

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L74)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; spanProcessor?: SpanProcessor \} & CustomConfig)\[K\] \}\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config-1)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:17

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`defaultCommandTimeout`](../../core/interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`defaultCommandTimeout`](../../core/classes/EventBridgeBaseClass.md#defaultcommandtimeout)

***

### instanceId

> **instanceId**: `string`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`instanceId`](../../core/classes/EventBridgeBaseClass.md#instanceid)

***

### isShuttingDown

> **isShuttingDown**: `boolean` = `false`

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L71)

***

### isStarted

> **isStarted**: `boolean` = `false`

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L72)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`logger`](../../core/classes/EventBridgeBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`name`](../../core/interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`name`](../../core/classes/EventBridgeBaseClass.md#name-1)

***

### server

> **server**: `undefined` \| `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\> \| `Http2Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `Http2SecureServer`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L69)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:355](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L355)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`destroy`](../../core/interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`destroy`](../../core/classes/EventBridgeBaseClass.md#destroy)

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

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`emit`](../../core/classes/EventBridgeBaseClass.md#emit)

***

### emitMessage()

> **emitMessage**\<`T`\>(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:148](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L148)

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

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getTracer`](../../core/classes/EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `ttl`?): `Promise`\<`T`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:208](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L208)

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

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:345](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L345)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:341](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L341)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isReady`](../../core/interfaces/EventBridge.md#isready)

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

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`off`](../../core/classes/EventBridgeBaseClass.md#off)

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

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`on`](../../core/classes/EventBridgeBaseClass.md#on)

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:262](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L262)

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

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:316](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L316)

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

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:14

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`removeAllListeners`](../../core/classes/EventBridgeBaseClass.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:90](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L90)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`start`](../../core/interfaces/EventBridge.md#start)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`start`](../../core/classes/EventBridgeBaseClass.md#start)

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

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`startActiveSpan`](../../core/classes/EventBridgeBaseClass.md#startactivespan)

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:312](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L312)

Unregister a service command

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

The address (service name, version and command name) of the command to be de-registered

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterCommand`](../../core/interfaces/EventBridge.md#unregistercommand)

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:337](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L337)

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterSubscription`](../../core/interfaces/EventBridge.md#unregistersubscription)

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

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`wrapInSpan`](../../core/classes/EventBridgeBaseClass.md#wrapinspan)
