[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / AmqpBridge

# Class: AmqpBridge

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L92)

The AMQP event bridge connects to a AMQP broker.

## Example

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

// create and init our eventbridge
const config = {
   url: 'amqp://localhost'
}

const eventBridge = new AmqpBridge(config)
await eventBridge.start()

```

## Extends

- [`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md)\<[`AmqpBridgeConfig`](../type-aliases/AmqpBridgeConfig.md)\>

## Implements

- [`EventBridge`](../../core/interfaces/EventBridge.md)

## Constructors

### Constructor

> **new AmqpBridge**(`config?`): `AmqpBridge`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:287](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L287)

#### Parameters

##### config?

###### deadLetterExchangeName?

`string`

optional dead letter exchange name used for durable command/subscription queues

###### deadLetterRoutingKey?

`string`

optional dead letter routing key used for durable command/subscription queues

###### defaultCommandTimeout?

`number`

Overwrite the hardcoded default timeout of command invocations

###### encoder?

[`Encoder`](../type-aliases/Encoder.md)

the encoder(s) to be used for AMQP messages

**Default**

```ts
jsonEncoder
```

###### encrypter?

[`Encrypter`](../type-aliases/Encrypter.md)

the encrypter(s) to be used for AMQP messages

**Default**

```ts
plain
```

###### exchangeName?

`string`

the AMQP exchage name to be used

**Default**

```ts
purista
```

###### exchangeOptions?

`AssertExchange`

the AMQP exchange options

###### instanceId?

`string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

###### logger?

[`Logger`](../../core/classes/Logger.md)

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

###### namePrefix?

`string`

the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request

**Default**

```ts
purista
```

###### prefetch?

`number`

max unacked messages per consumer channel

###### socketOptions?

`unknown`

socket options

###### spanProcessor?

`SpanProcessor`

###### url?

`string` \| `Connect`

the AMQP broker url

**Default**

```ts
amqp://localhost
```

#### Returns

`AmqpBridge`

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`constructor`](../../core/classes/EventBridgeBaseClass.md#constructor)

## Properties

### capabilities

> **capabilities**: [`EventBridgeCapabilities`](../../core/type-aliases/EventBridgeCapabilities.md)

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:26

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`capabilities`](../../core/interfaces/EventBridge.md#capabilities)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`capabilities`](../../core/classes/EventBridgeBaseClass.md#capabilities)

***

### channel?

> `protected` `optional` **channel?**: `ConfirmChannel`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:94](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L94)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<[`EventBridgeConfig`](../../core/type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config)

***

### connection?

> `protected` `optional` **connection?**: `ChannelModel`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L93)

***

### consumerRegistrations

> `protected` **consumerRegistrations**: `object`[] = `[]`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L99)

#### channel

> **channel**: `ConfirmChannel`

#### tag

> **tag**: `string`

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:28

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`defaultCommandTimeout`](../../core/interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`defaultCommandTimeout`](../../core/classes/EventBridgeBaseClass.md#defaultcommandtimeout)

***

### encoder

> `protected` **encoder**: [`Encoder`](../type-aliases/Encoder.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:119](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L119)

***

### encrypter

> `protected` **encrypter**: [`Encrypter`](../type-aliases/Encrypter.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:123](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L123)

***

### healthy

> `protected` **healthy**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:96](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L96)

***

### inFlightExecutions

> `protected` `readonly` **inFlightExecutions**: [`InFlightExecutionTracker`](../../core/classes/InFlightExecutionTracker.md)

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:29

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`inFlightExecutions`](../../core/classes/EventBridgeBaseClass.md#inflightexecutions)

***

### instanceId

> **instanceId**: `string`

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:27

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`instanceId`](../../core/classes/EventBridgeBaseClass.md#instanceid)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:22

#### Inherited from

`AmqpBridge`.[`logger`](#logger)

***

### name

> **name**: `string`

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:25

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`name`](../../core/interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`name`](../../core/classes/EventBridgeBaseClass.md#name)

***

### pausedSubscriptionConsumers

> `protected` **pausedSubscriptionConsumers**: `Map`\<`string`, `PausedSubscriptionState`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:117](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L117)

***

### pendingInvocations

> `protected` **pendingInvocations**: [`PendingInvocationRegistry`](../../core/classes/PendingInvocationRegistry.md)\<`unknown`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:110](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L110)

***

### ready

> `protected` **ready**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:97](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L97)

***

### replyQueueName?

> `protected` `optional` **replyQueueName?**: `string`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L101)

***

### serviceFunctions

> `protected` **serviceFunctions**: `Map`\<`string`, \{ `cb`: (`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>; `channel`: `ConfirmChannel`; \}\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:102](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L102)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, `RegisteredSubscription`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:116](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L116)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### addConsumerRegistration()

> `protected` **addConsumerRegistration**(`channel`, `tag`): `void`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:127](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L127)

#### Parameters

##### channel

`ConfirmChannel`

##### tag

`string`

#### Returns

`void`

***

### createPublishingChannel()

> `protected` **createPublishingChannel**(): `Promise`\<`ConfirmChannel`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:153](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L153)

#### Returns

`Promise`\<`ConfirmChannel`\>

***

### deadLetterSubscriptionMessage()

> `protected` **deadLetterSubscriptionMessage**(`channel`, `subscription`, `msg`, `reason`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:256](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L256)

#### Parameters

##### channel

`ConfirmChannel`

##### subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

##### msg

`ConsumeMessage`

##### reason

`string`

#### Returns

`Promise`\<`void`\>

***

### decodeContent()

> `protected` **decodeContent**\<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`\<`T`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1264](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1264)

Decode buffer into given type

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Buffer`

the input buffer

##### contentType

`string`

the content type of buffer content

##### contentEncoding

`string`

the encoding type of buffer content

#### Returns

`Promise`\<`T`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1283](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1283)

Gracefully stops all consumers, waits for in-flight subscription handlers,
closes AMQP resources and rejects unresolved pending invocations.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`destroy`](../../core/interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`destroy`](../../core/classes/EventBridgeBaseClass.md#destroy)

***

### emitMessage()

> **emitMessage**\<`T`\>(`message`, `contentType?`, `contentEncoding?`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:498](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L498)

Emits a message via AMQP headers exchange.
The message is encoded and encrypted according to configured codecs.

#### Type Parameters

##### T

`T` *extends* [`EBMessage`](../../core/type-aliases/EBMessage.md)

#### Parameters

##### message

`Omit`\<[`EBMessage`](../../core/type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

##### contentType?

`string` = `'application/json'`

##### contentEncoding?

`string` = `'utf-8'`

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`emitMessage`](../../core/interfaces/EventBridge.md#emitmessage)

***

### encodeContent()

> `protected` **encodeContent**\<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1243](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1243)

Encode given payload to buffer

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`T`

##### contentType

`string`

##### contentEncoding

`string`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### ensureSubscriptionRetryQueue()

> `protected` **ensureSubscriptionRetryQueue**(`channel`, `sourceQueueName`, `retryQueueName`, `retryDelayMs`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:240](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L240)

#### Parameters

##### channel

`ConfirmChannel`

##### sourceQueueName

`string`

##### retryQueueName

`string`

##### retryDelayMs

`number`

#### Returns

`Promise`\<`void`\>

***

### getConsumerAttempt()

> `protected` **getConsumerAttempt**(`headers`): `number`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:163](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L163)

#### Parameters

##### headers

`unknown`

#### Returns

`number`

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:66

Number of currently running handlers across all work kinds.

#### Returns

`number`

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`getInFlightExecutionCount`](../../core/interfaces/EventBridge.md#getinflightexecutioncount)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getInFlightExecutionCount`](../../core/classes/EventBridgeBaseClass.md#getinflightexecutioncount)

***

### getInFlightExecutionCounts()

> **getInFlightExecutionCounts**(): [`InFlightExecutionCounts`](../../core/type-aliases/InFlightExecutionCounts.md)

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:67

Number of currently running handlers grouped by work kind.

#### Returns

[`InFlightExecutionCounts`](../../core/type-aliases/InFlightExecutionCounts.md)

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`getInFlightExecutionCounts`](../../core/interfaces/EventBridge.md#getinflightexecutioncounts)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getInFlightExecutionCounts`](../../core/classes/EventBridgeBaseClass.md#getinflightexecutioncounts)

***

### getPausedSubscriptionConsumers()

> **getPausedSubscriptionConsumers**(): `object`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1211](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1211)

Returns paused subscription consumer states keyed by adapter registration key.

#### Returns

`object`

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`getPausedSubscriptionConsumers`](../../core/interfaces/EventBridge.md#getpausedsubscriptionconsumers)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getPausedSubscriptionConsumers`](../../core/classes/EventBridgeBaseClass.md#getpausedsubscriptionconsumers)

***

### getSubscriptionDeadLetterTarget()

> `protected` **getSubscriptionDeadLetterTarget**(`subscription`): `string` \| `undefined`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:182](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L182)

#### Parameters

##### subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

#### Returns

`string` \| `undefined`

***

### getSubscriptionFailureReason()

> `protected` **getSubscriptionFailureReason**(`error`): `string`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:186](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L186)

#### Parameters

##### error

`unknown`

#### Returns

`string`

***

### getSubscriptionRetryQueueName()

> `protected` **getSubscriptionRetryQueueName**(`queueName`, `retryDelayMs`): `string`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:236](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L236)

#### Parameters

##### queueName

`string`

##### retryDelayMs

`number`

#### Returns

`string`

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:36

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getTracer`](../../core/classes/EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `commandTimeout?`): `Promise`\<`T`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:577](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L577)

Invokes a remote command and waits for a matching command response.
The call is rejected with timeout if no response is received in time.

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Omit`\<[`Command`](../../core/type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

##### commandTimeout?

`number` = `...`

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`invoke`](../../core/interfaces/EventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:350](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L350)

Indicates if the bridge connection and channels are currently healthy.

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:343](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L343)

Indicates if the bridge finished startup and is ready to process traffic.

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isReady`](../../core/interfaces/EventBridge.md#isready)

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`_input`, `_ttl?`): `Promise`\<[`StreamHandle`](../../core/interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:70

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:678](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L678)

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

The service function address

##### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

the function to call if a matching command message arrives

##### metadata

[`CommandDefinitionMetadataBase`](../../core/type-aliases/CommandDefinitionMetadataBase.md)

##### eventBridgeConfig

[`DefinitionEventBridgeConfig`](../../core/type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

the id of command function queue

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerCommand`](../../core/interfaces/EventBridge.md#registercommand)

***

### registerStream()

> **registerStream**(`_address`, `_cb`, `_metadata`, `_eventBridgeConfig`): `Promise`\<`string`\>

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:71

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:932](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L932)

Registers a subscription consumer and returns its stable subscription key.

#### Parameters

##### subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

##### cb

(`message`) => `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerSubscription`](../../core/interfaces/EventBridge.md#registersubscription)

***

### removeConsumerRegistration()

> `protected` **removeConsumerRegistration**(`channel`, `tag`): `void`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:135](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L135)

#### Parameters

##### channel

`ConfirmChannel`

##### tag

`string`

#### Returns

`void`

***

### removeConsumerRegistrationsForChannel()

> `protected` **removeConsumerRegistrationsForChannel**(`channel`): `void`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:131](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L131)

#### Parameters

##### channel

`ConfirmChannel`

#### Returns

`void`

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1215](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1215)

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

### retrySubscriptionMessage()

> `protected` **retrySubscriptionMessage**(`channel`, `queueName`, `msg`, `nextAttempt`, `retryDelayMs`, `durable`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:204](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L204)

#### Parameters

##### channel

`ConfirmChannel`

##### queueName

`string`

##### msg

`ConsumeMessage`

##### nextAttempt

`number`

##### retryDelayMs

`number`

##### durable

`boolean`

#### Returns

`Promise`\<`void`\>

***

### runInFlight()

> **runInFlight**\<`T`\>(`fn`, `kind?`): `Promise`\<`T`\>

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:64

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

##### kind?

`"command"` \| `"subscription"` \| `"stream"` \| `"generic"`

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`runInFlight`](../../core/classes/EventBridgeBaseClass.md#runinflight)

***

### sendToQueueAndConfirm()

> `protected` **sendToQueueAndConfirm**(`channel`, `queueName`, `content`, `options`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:141](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L141)

#### Parameters

##### channel

`ConfirmChannel`

##### queueName

`string`

##### content

`Buffer`

##### options

`Publish` \| `undefined`

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:357](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L357)

Connect to RabbitMQ broker, ensure exchange, call back queue

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`start`](../../core/interfaces/EventBridge.md#start)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`start`](../../core/classes/EventBridgeBaseClass.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:45

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

`Context` \| `undefined`

optional context

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:908](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L908)

Unregisters a command consumer and closes the dedicated command channel.

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterCommand`](../../core/interfaces/EventBridge.md#unregistercommand)

***

### unregisterStream()

> **unregisterStream**(`_address`): `Promise`\<`void`\>

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:72

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1189](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1189)

Unregisters a subscription consumer and closes its channel.

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

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:65

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

Defined in: core/dist/core/EventBridge/EventBridgeBaseClass.impl.d.ts:61

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
