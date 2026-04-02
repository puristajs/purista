[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/base-http-bridge](../README.md) / HttpEventBridge

# Class: HttpEventBridge\<CustomConfig\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L69)

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

### CustomConfig

`CustomConfig` *extends* [`HttpEventBridgeConfig`](../type-aliases/HttpEventBridgeConfig.md)

## Implements

- [`EventBridge`](../../core/interfaces/EventBridge.md)

## Constructors

### Constructor

> **new HttpEventBridge**\<`CustomConfig`\>(`config`, `client`): `HttpEventBridge`\<`CustomConfig`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L80)

#### Parameters

##### config

\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; spanProcessor?: SpanProcessor \} & CustomConfig)\[K\] \}

##### client

[`HttpEventBridgeClient`](../interfaces/HttpEventBridgeClient.md)

#### Returns

`HttpEventBridge`\<`CustomConfig`\>

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`constructor`](../../core/classes/EventBridgeBaseClass.md#constructor)

## Properties

### app

> **app**: `Hono`

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L74)

***

### capabilities

> **capabilities**: [`EventBridgeCapabilities`](../../core/type-aliases/EventBridgeCapabilities.md)

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:25

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`capabilities`](../../core/interfaces/EventBridge.md#capabilities)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`capabilities`](../../core/classes/EventBridgeBaseClass.md#capabilities)

***

### client

> **client**: [`HttpEventBridgeClient`](../interfaces/HttpEventBridgeClient.md)

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:78](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L78)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<[`EventBridgeConfig`](../../core/type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:27

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`defaultCommandTimeout`](../../core/interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`defaultCommandTimeout`](../../core/classes/EventBridgeBaseClass.md#defaultcommandtimeout)

***

### inFlightExecutions

> `protected` `readonly` **inFlightExecutions**: [`InFlightExecutionTracker`](../../core/classes/InFlightExecutionTracker.md)

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:28

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`inFlightExecutions`](../../core/classes/EventBridgeBaseClass.md#inflightexecutions)

***

### instanceId

> **instanceId**: `string`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:26

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`instanceId`](../../core/classes/EventBridgeBaseClass.md#instanceid)

***

### isShuttingDown

> **isShuttingDown**: `boolean` = `false`

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:75](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L75)

***

### isStarted

> **isStarted**: `boolean` = `false`

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L76)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:21

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`logger`](../../core/classes/EventBridgeBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`name`](../../core/interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`name`](../../core/classes/EventBridgeBaseClass.md#name)

***

### server

> **server**: `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\> \| `Http2Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `Http2SecureServer`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\> \| `undefined`

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L73)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:22

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:402](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L402)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`destroy`](../../core/interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`destroy`](../../core/classes/EventBridgeBaseClass.md#destroy)

***

### emitMessage()

> **emitMessage**\<`T`\>(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:188](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L188)

Emit a message to the eventbridge without awaiting a result

#### Type Parameters

##### T

`T` *extends* [`EBMessage`](../../core/type-aliases/EBMessage.md)

#### Parameters

##### message

`Omit`\<[`EBMessage`](../../core/type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

the message

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`emitMessage`](../../core/interfaces/EventBridge.md#emitmessage)

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:65

Number of currently running handlers across all work kinds.

#### Returns

`number`

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`getInFlightExecutionCount`](../../core/interfaces/EventBridge.md#getinflightexecutioncount)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getInFlightExecutionCount`](../../core/classes/EventBridgeBaseClass.md#getinflightexecutioncount)

***

### getInFlightExecutionCounts()

> **getInFlightExecutionCounts**(): `object`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:66

Number of currently running handlers grouped by work kind.

#### Returns

`object`

##### command

> **command**: `number`

##### generic

> **generic**: `number`

##### stream

> **stream**: `number`

##### subscription

> **subscription**: `number`

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`getInFlightExecutionCounts`](../../core/interfaces/EventBridge.md#getinflightexecutioncounts)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getInFlightExecutionCounts`](../../core/classes/EventBridgeBaseClass.md#getinflightexecutioncounts)

***

### getPausedSubscriptionConsumers()

> **getPausedSubscriptionConsumers**(): `object`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:72

Returns paused subscription consumer states keyed by adapter registration key.

#### Returns

`object`

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`getPausedSubscriptionConsumers`](../../core/interfaces/EventBridge.md#getpausedsubscriptionconsumers)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getPausedSubscriptionConsumers`](../../core/classes/EventBridgeBaseClass.md#getpausedsubscriptionconsumers)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:35

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getTracer`](../../core/classes/EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `ttl?`): `Promise`\<`T`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:243](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L243)

Call a command of a service and return the result of this command

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Omit`\<[`Command`](../../core/type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

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

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:392](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L392)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:388](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L388)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isReady`](../../core/interfaces/EventBridge.md#isready)

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`_input`, `_ttl?`): `Promise`\<[`StreamHandle`](../../core/interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:74

Open a stream invocation.
The returned handle can be consumed via async iteration and can be cancelled by caller.

#### Type Parameters

##### Chunk

`Chunk` = `unknown`

##### Final

`Final` = `unknown`

#### Parameters

##### \_input

`Omit`\<[`StreamOpenRequest`](../../core/type-aliases/StreamOpenRequest.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

##### \_ttl?

`number`

#### Returns

`Promise`\<[`StreamHandle`](../../core/interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`openStream`](../../core/interfaces/EventBridge.md#openstream)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`openStream`](../../core/classes/EventBridgeBaseClass.md#openstream)

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:299](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L299)

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

the address of the service command (service name, version and command name)

##### cb

(`message`) => `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| `Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\>\>

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

### registerStream()

> **registerStream**(`_address`, `_cb`, `_metadata`, `_eventBridgeConfig`): `Promise`\<`string`\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:75

Register a service stream.

#### Parameters

##### \_address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

##### \_cb

(`message`) => `Promise`\<`void`\>

##### \_metadata

[`StreamDefinitionMetadataBase`](../../core/type-aliases/StreamDefinitionMetadataBase.md)

##### \_eventBridgeConfig

[`DefinitionEventBridgeConfig`](../../core/type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerStream`](../../core/interfaces/EventBridge.md#registerstream)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`registerStream`](../../core/classes/EventBridgeBaseClass.md#registerstream)

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:362](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L362)

Register a new subscription

#### Parameters

##### subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

the subscription definition

##### cb

(`message`) => `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

the function to be called if a matching message arrives

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerSubscription`](../../core/interfaces/EventBridge.md#registersubscription)

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`_registrationKey`): `Promise`\<`void`\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:73

Resumes a paused subscription consumer by registration key.

#### Parameters

##### \_registrationKey

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`resumeSubscriptionConsumer`](../../core/interfaces/EventBridge.md#resumesubscriptionconsumer)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`resumeSubscriptionConsumer`](../../core/classes/EventBridgeBaseClass.md#resumesubscriptionconsumer)

***

### runInFlight()

> **runInFlight**\<`T`\>(`fn`, `kind?`): `Promise`\<`T`\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:63

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

##### kind?

`"command"` | `"subscription"` | `"stream"` | `"generic"`

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`runInFlight`](../../core/classes/EventBridgeBaseClass.md#runinflight)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:128](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L128)

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

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:44

Start a child span for opentelemetry tracking

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

optional context

`Context` | `undefined`

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

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:358](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L358)

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

### unregisterStream()

> **unregisterStream**(`_address`): `Promise`\<`void`\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:76

Unregister a service stream

#### Parameters

##### \_address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterStream`](../../core/interfaces/EventBridge.md#unregisterstream)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`unregisterStream`](../../core/classes/EventBridgeBaseClass.md#unregisterstream)

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:384](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L384)

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterSubscription`](../../core/interfaces/EventBridge.md#unregistersubscription)

***

### waitForInFlightDrain()

> **waitForInFlightDrain**(`timeoutMs?`): `Promise`\<`boolean`\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:64

#### Parameters

##### timeoutMs?

`number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`waitForInFlightDrain`](../../core/classes/EventBridgeBaseClass.md#waitforinflightdrain)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:60

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type Parameters

##### F

`F`

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
