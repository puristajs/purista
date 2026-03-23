[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/natsbridge](../README.md) / NatsBridge

# Class: NatsBridge

Defined in: [natsbridge/src/NatsBridge.ts:69](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L69)

The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.  

Example usage:

## Example

```ts
* ```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```
```

## Extends

- [`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md)\<[`NatsBridgeConfig`](../type-aliases/NatsBridgeConfig.md)\>

## Implements

- [`EventBridge`](../../core/interfaces/EventBridge.md)

## Constructors

### Constructor

> **new NatsBridge**(`config?`): `NatsBridge`

Defined in: [natsbridge/src/NatsBridge.ts:81](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L81)

#### Parameters

##### config?

###### commandResponsePublishTwice?

`"never"` \| `"always"` \| `"eventOnly"` \| `"eventAndError"`

Indicates if a command response should be published a second time.
If the command response gets published, it will be published to the regular topic pattern.

If set to `never`, subscription might not get messages they are expecting because of the timing.

If set to `always`, every command response is published.
Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached.
This might result in a high resource consumption of the broker.

If set to `eventOnly`, only success responses which have a event name set, are published twice.
There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time.

**Default**

```ts
eventOnly
```

###### defaultCommandTimeout?

`number`

Overwrite the hardcoded default timeout of command invocations

###### defaultMessageExpiryInterval?

`number`

the message expiry interval in seconds

**Default**

```ts
30 days in seconds
```

###### emptyTopicPartString?

`string`

The string which should be used in topics for parts, which are undefined

**Default**

```ts
__none__
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

###### maxMessages?

`number`

maximum messages to run in parallel per subscription
10 means, each subscription can handle 10 calls at the same time

**Default**

```ts
10
```

###### spanProcessor?

`SpanProcessor`

A OpenTelemetry span processor

###### topicPrefix?

`string`

the prefix for topic to prevent name collisions

**Default**

```ts
purista
```

#### Returns

`NatsBridge`

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`constructor`](../../core/classes/EventBridgeBaseClass.md#constructor)

## Properties

### commands

> **commands**: `Map`\<`string`, `Subscription`\>

Defined in: [natsbridge/src/NatsBridge.ts:76](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L76)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<[`EventBridgeConfig`](../../core/type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L35)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config)

***

### connection

> **connection**: `NatsConnection` \| `undefined`

Defined in: [natsbridge/src/NatsBridge.ts:70](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L70)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L41)

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`defaultCommandTimeout`](../../core/interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`defaultCommandTimeout`](../../core/classes/EventBridgeBaseClass.md#defaultcommandtimeout)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L39)

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`instanceId`](../../core/classes/EventBridgeBaseClass.md#instanceid)

***

### isJetStreamEnabled

> **isJetStreamEnabled**: `boolean` = `false`

Defined in: [natsbridge/src/NatsBridge.ts:72](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L72)

***

### jsm

> **jsm**: `JetStreamManager` \| `undefined`

Defined in: [natsbridge/src/NatsBridge.ts:74](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L74)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L32)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`logger`](../../core/classes/EventBridgeBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L37)

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`name`](../../core/interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`name`](../../core/classes/EventBridgeBaseClass.md#name)

***

### sc

> **sc**: `Codec`\<`unknown`\>

Defined in: [natsbridge/src/NatsBridge.ts:79](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L79)

***

### subscriptions

> **subscriptions**: `Map`\<`string`, `Subscription`\>

Defined in: [natsbridge/src/NatsBridge.ts:77](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L77)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L33)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [natsbridge/src/NatsBridge.ts:405](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L405)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`destroy`](../../core/interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`destroy`](../../core/classes/EventBridgeBaseClass.md#destroy)

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: [core/src/core/types/GenericEventEmitter.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L27)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; `stream-closed`: \{ `sessionId`: `string`; \} \| `undefined`; `stream-error`: `unknown`; `stream-frame-received`: `unknown`; `stream-frame-sent`: `unknown`; `stream-opened`: \{ `sessionId`: `string`; \} \| `undefined`; \}\>

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

> **emitMessage**\<`T`\>(`message`, `contentType?`, `contentEncoding?`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: [natsbridge/src/NatsBridge.ts:111](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L111)

Emit a message to the eventbridge without awaiting a result

#### Type Parameters

##### T

`T` *extends* [`EBMessage`](../../core/type-aliases/EBMessage.md)

#### Parameters

##### message

`Omit`\<[`EBMessage`](../../core/type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

the message

##### contentType?

`string` = `'application/json'`

##### contentEncoding?

`string` = `'utf-8'`

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`emitMessage`](../../core/interfaces/EventBridge.md#emitmessage)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L79)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getTracer`](../../core/classes/EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `commandTimeout?`): `Promise`\<`T`\>

Defined in: [natsbridge/src/NatsBridge.ts:184](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L184)

Call a command of a service and return the result of this command

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Omit`\<[`Command`](../../core/type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

a partial command message

##### commandTimeout?

`number` = `...`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`invoke`](../../core/interfaces/EventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [natsbridge/src/NatsBridge.ts:107](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L107)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [natsbridge/src/NatsBridge.ts:103](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L103)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isReady`](../../core/interfaces/EventBridge.md#isready)

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/src/core/types/GenericEventEmitter.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L23)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; `stream-closed`: \{ `sessionId`: `string`; \} \| `undefined`; `stream-error`: `unknown`; `stream-frame-received`: `unknown`; `stream-frame-sent`: `unknown`; `stream-opened`: \{ `sessionId`: `string`; \} \| `undefined`; \}\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../../core/type-aliases/EventReceiver.md)\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`off`](../../core/classes/EventBridgeBaseClass.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/src/core/types/GenericEventEmitter.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L19)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; `stream-closed`: \{ `sessionId`: `string`; \} \| `undefined`; `stream-error`: `unknown`; `stream-frame-received`: `unknown`; `stream-frame-sent`: `unknown`; `stream-opened`: \{ `sessionId`: `string`; \} \| `undefined`; \}\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../../core/type-aliases/EventReceiver.md)\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`on`](../../core/classes/EventBridgeBaseClass.md#on)

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`_input`, `_ttl?`): `Promise`\<[`StreamHandle`](../../core/interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:167](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L167)

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

Defined in: [natsbridge/src/NatsBridge.ts:327](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L327)

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

the address of the service command (service name, version and command name)

##### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

the function to be called if a matching command arrives

##### metadata

[`CommandDefinitionMetadataBase`](../../core/type-aliases/CommandDefinitionMetadataBase.md)

##### eventBridgeConfig

[`DefinitionEventBridgeConfig`](../../core/type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerCommand`](../../core/interfaces/EventBridge.md#registercommand)

***

### registerStream()

> **registerStream**(`_address`, `_cb`, `_metadata`, `_eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:174](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L174)

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

Defined in: [natsbridge/src/NatsBridge.ts:368](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L368)

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

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/src/core/types/GenericEventEmitter.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L31)

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`removeAllListeners`](../../core/classes/EventBridgeBaseClass.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [natsbridge/src/NatsBridge.ts:90](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L90)

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

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L91)

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

Defined in: [natsbridge/src/NatsBridge.ts:357](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L357)

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

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L183)

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

Defined in: [natsbridge/src/NatsBridge.ts:392](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L392)

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterSubscription`](../../core/interfaces/EventBridge.md#unregistersubscription)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:141](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L141)

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
