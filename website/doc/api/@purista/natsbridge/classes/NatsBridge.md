[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/natsbridge](../README.md) / NatsBridge

# Class: NatsBridge

Defined in: [natsbridge/src/NatsBridge.ts:114](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L114)

The event bridge supports low-latency core NATS messaging.

When JetStream is available, durable command and subscription registrations use
JetStream consumers. Without JetStream, durable requests fail fast by default
(`durableSubscriptionMode: 'strict'`) instead of silently degrading to
non-durable core NATS semantics.

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

Defined in: [natsbridge/src/NatsBridge.ts:128](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L128)

#### Parameters

##### config?

###### commandResponsePublishTwice?

`"always"` \| `"eventOnly"` \| `"eventAndError"` \| `"never"`

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

###### defaultConsumerFailureHandling?

[`NatsConsumerFailureHandlingDefaults`](../type-aliases/NatsConsumerFailureHandlingDefaults.md)

Default failure handling for JetStream-backed subscription consumers.
Per-subscription consumer failure handling hints override these values.

###### defaultMessageExpiryInterval?

`number`

the message expiry interval in seconds

**Default**

```ts
30 days in seconds
```

###### durableSubscriptionMode?

`"strict"` \| `"best-effort"`

Controls how durable registrations behave when JetStream durability is not implemented.

**Default**

```ts
strict
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

###### jetStreamAckWaitMs?

`number`

JetStream consumer ack wait in milliseconds for command and subscription consumers.
This is a broker-level processing timeout used for redelivery when no ack/nak/term is sent.

**Default**

```ts
30000
```

###### logger?

[`Logger`](../../core/classes/Logger.md)

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

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

### capabilities

> **capabilities**: [`EventBridgeCapabilities`](../../core/type-aliases/EventBridgeCapabilities.md)

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:25

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`capabilities`](../../core/interfaces/EventBridge.md#capabilities)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`capabilities`](../../core/classes/EventBridgeBaseClass.md#capabilities)

***

### commands

> **commands**: `Map`\<`string`, `JetStreamSubscription` \| `Subscription`\>

Defined in: [natsbridge/src/NatsBridge.ts:122](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L122)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<[`EventBridgeConfig`](../../core/type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config)

***

### connection

> **connection**: `NatsConnection` \| `undefined`

Defined in: [natsbridge/src/NatsBridge.ts:115](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L115)

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

### isJetStreamEnabled

> **isJetStreamEnabled**: `boolean` = `false`

Defined in: [natsbridge/src/NatsBridge.ts:117](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L117)

***

### js

> **js**: `JetStreamClient` \| `undefined`

Defined in: [natsbridge/src/NatsBridge.ts:120](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L120)

***

### jsm

> **jsm**: `JetStreamManager` \| `undefined`

Defined in: [natsbridge/src/NatsBridge.ts:119](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L119)

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

### sc

> **sc**: `Codec`\<`unknown`\>

Defined in: [natsbridge/src/NatsBridge.ts:126](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L126)

***

### subscriptions

> **subscriptions**: `Map`\<`string`, `RegisteredSubscription`\>

Defined in: [natsbridge/src/NatsBridge.ts:123](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L123)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:22

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [natsbridge/src/NatsBridge.ts:853](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L853)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`destroy`](../../core/interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`destroy`](../../core/classes/EventBridgeBaseClass.md#destroy)

***

### emitMessage()

> **emitMessage**\<`T`\>(`message`, `contentType?`, `contentEncoding?`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: [natsbridge/src/NatsBridge.ts:520](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L520)

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

Defined in: [natsbridge/src/NatsBridge.ts:841](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L841)

Returns paused subscription consumer states keyed by adapter registration key.

#### Returns

`object`

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`getPausedSubscriptionConsumers`](../../core/interfaces/EventBridge.md#getpausedsubscriptionconsumers)

#### Overrides

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

> **invoke**\<`T`\>(`input`, `commandTimeout?`): `Promise`\<`T`\>

Defined in: [natsbridge/src/NatsBridge.ts:593](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L593)

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

Defined in: [natsbridge/src/NatsBridge.ts:516](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L516)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [natsbridge/src/NatsBridge.ts:512](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L512)

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

Defined in: [natsbridge/src/NatsBridge.ts:735](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L735)

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

Defined in: [natsbridge/src/NatsBridge.ts:791](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L791)

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

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [natsbridge/src/NatsBridge.ts:845](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L845)

Resumes a paused subscription consumer by registration key.

#### Parameters

##### registrationKey

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`resumeSubscriptionConsumer`](../../core/interfaces/EventBridge.md#resumesubscriptionconsumer)

#### Overrides

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

Defined in: [natsbridge/src/NatsBridge.ts:494](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L494)

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

Defined in: [natsbridge/src/NatsBridge.ts:773](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L773)

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

Defined in: [natsbridge/src/NatsBridge.ts:822](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L822)

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
