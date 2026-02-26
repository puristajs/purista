[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultEventBridge

# Class: DefaultEventBridge

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L76)

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

## Example

```typescript
import { DefaultEventBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// add your services
```

## Extends

- [`EventBridgeBaseClass`](EventBridgeBaseClass.md)\<[`DefaultEventBridgeConfig`](../type-aliases/DefaultEventBridgeConfig.md)\>

## Implements

- [`EventBridge`](../interfaces/EventBridge.md)

## Constructors

### Constructor

> **new DefaultEventBridge**(`config?`): `DefaultEventBridge`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L101)

#### Parameters

##### config?

###### defaultCommandTimeout?

`number`

Overwrite the hardcoded default timeout of command invocations

###### emitMessagesAsEventBridgeEvents?

`boolean`

Emit messages which have an event name set as javascript events on the event bridge instance

###### instanceId?

`string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

###### logger?

[`Logger`](Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../type-aliases/LogLevelName.md)

If no logger instance is given, use this log level

###### logWarnOnMessagesWithoutReceiver?

`boolean`

Log warnings on messages which are emitted, but could not delivered to at least one receiver

###### spanProcessor?

`SpanProcessor`

A OpenTelemetry span processor

#### Returns

`DefaultEventBridge`

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`constructor`](EventBridgeBaseClass.md#constructor)

## Properties

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<[`EventBridgeConfig`](../type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L35)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`config`](EventBridgeBaseClass.md#config)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L41)

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`defaultCommandTimeout`](../interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`defaultCommandTimeout`](EventBridgeBaseClass.md#defaultcommandtimeout)

***

### hasStarted

> `protected` **hasStarted**: `boolean` = `false`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:98](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L98)

***

### healthy

> `protected` **healthy**: `boolean` = `false`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L99)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L39)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`instanceId`](../interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`instanceId`](EventBridgeBaseClass.md#instanceid)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L32)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`logger`](EventBridgeBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L37)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`name`](../interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`name`](EventBridgeBaseClass.md#name)

***

### pendingInvocations

> `protected` **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../type-aliases/PendigInvocation.md)\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L92)

***

### pendingStreams

> `protected` **pendingStreams**: `Map`\<`string`, [`PendingStreamInvocation`](../type-aliases/PendingStreamInvocation.md)\<`any`, `any`\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L93)

***

### readStream

> `protected` **readStream**: `Readable`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L78)

***

### runningSubscriptionCount

> `protected` **runningSubscriptionCount**: `number` = `0`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:94](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L94)

***

### serviceFunctions

> `protected` **serviceFunctions**: `Map`\<`string`, (`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L85)

***

### streamFunctions

> `protected` **streamFunctions**: `Map`\<`string`, (`message`) => `Promise`\<`void`\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L90)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionStorageEntry`](../type-aliases/SubscriptionStorageEntry.md)\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:96](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L96)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L33)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`traceProvider`](EventBridgeBaseClass.md#traceprovider)

***

### writeStream

> `protected` **writeStream**: `Writable`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L77)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:682](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L682)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`destroy`](../interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`destroy`](EventBridgeBaseClass.md#destroy)

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: [core/types/GenericEventEmitter.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L27)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; `stream-closed`: \{ `sessionId`: `string`; \} \| `undefined`; `stream-error`: `unknown`; `stream-frame-received`: `unknown`; `stream-frame-sent`: `unknown`; `stream-opened`: \{ `sessionId`: `string`; \} \| `undefined`; \}\>

#### Parameters

##### eventName

`K`

##### parameter?

`object`\[`K`\]

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`emit`](EventBridgeBaseClass.md#emit)

***

### emitMessage()

> **emitMessage**(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:384](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L384)

Emit a new message to event bridge to be delivered to receiver

#### Parameters

##### message

`Omit`\<[`EBMessage`](../type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

EBMessage

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`emitMessage`](../interfaces/EventBridge.md#emitmessage)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L79)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`getTracer`](EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `commandTimeout?`): `Promise`\<`T`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:429](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L429)

Call a command of a service and return the result of this command

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Omit`\<[`Command`](../type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

a partial command message

##### commandTimeout?

`number` = `...`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`invoke`](../interfaces/EventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:114](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L114)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`isHealthy`](../interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:110](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L110)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`isReady`](../interfaces/EventBridge.md#isready)

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L23)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; `stream-closed`: \{ `sessionId`: `string`; \} \| `undefined`; `stream-error`: `unknown`; `stream-frame-received`: `unknown`; `stream-frame-sent`: `unknown`; `stream-opened`: \{ `sessionId`: `string`; \} \| `undefined`; \}\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../type-aliases/EventReceiver.md)\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`off`](EventBridgeBaseClass.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L19)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; `stream-closed`: \{ `sessionId`: `string`; \} \| `undefined`; `stream-error`: `unknown`; `stream-frame-received`: `unknown`; `stream-frame-sent`: `unknown`; `stream-opened`: \{ `sessionId`: `string`; \} \| `undefined`; \}\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../type-aliases/EventReceiver.md)\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`on`](EventBridgeBaseClass.md#on)

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`input`, `commandTimeout?`): `Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:499](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L499)

Open a stream invocation.
The returned handle can be consumed via async iteration and can be cancelled by caller.

#### Type Parameters

##### Chunk

`Chunk` = `unknown`

##### Final

`Final` = `unknown`

#### Parameters

##### input

`Omit`\<[`StreamOpenRequest`](../type-aliases/StreamOpenRequest.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

##### commandTimeout?

`number` = `...`

#### Returns

`Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`openStream`](../interfaces/EventBridge.md#openstream)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`openStream`](EventBridgeBaseClass.md#openstream)

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`): `Promise`\<`string`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:308](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L308)

Register a service command and ensure that there is a queue for all incoming command requests.

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

The service function address

##### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

the function to call if a matching command message arrives

##### metadata

[`CommandDefinitionMetadataBase`](../type-aliases/CommandDefinitionMetadataBase.md)

#### Returns

`Promise`\<`string`\>

the id of command function queue

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerCommand`](../interfaces/EventBridge.md#registercommand)

***

### registerStream()

> **registerStream**(`address`, `cb`, `metadata`): `Promise`\<`string`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:328](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L328)

Register a service stream.

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

##### cb

(`message`) => `Promise`\<`void`\>

##### metadata

[`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerStream`](../interfaces/EventBridge.md#registerstream)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`registerStream`](EventBridgeBaseClass.md#registerstream)

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:362](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L362)

Register a new subscription

#### Parameters

##### subscription

[`Subscription`](../type-aliases/Subscription.md)

the subscription definition

##### cb

(`message`) => `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

the function to be called if a matching message arrives

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerSubscription`](../interfaces/EventBridge.md#registersubscription)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/types/GenericEventEmitter.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L31)

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`removeAllListeners`](EventBridgeBaseClass.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:118](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L118)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`start`](../interfaces/EventBridge.md#start)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`start`](EventBridgeBaseClass.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L91)

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

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`startActiveSpan`](EventBridgeBaseClass.md#startactivespan)

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:348](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L348)

Unregister a service command

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

The address (service name, version and command name) of the command to be de-registered

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`unregisterCommand`](../interfaces/EventBridge.md#unregistercommand)

***

### unregisterStream()

> **unregisterStream**(`address`): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:355](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L355)

Unregister a service stream

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`unregisterStream`](../interfaces/EventBridge.md#unregisterstream)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`unregisterStream`](EventBridgeBaseClass.md#unregisterstream)

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:372](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L372)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`unregisterSubscription`](../interfaces/EventBridge.md#unregistersubscription)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:141](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L141)

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

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`wrapInSpan`](EventBridgeBaseClass.md#wrapinspan)
