[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / AmqpBridge

# Class: AmqpBridge

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L72)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:238](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L238)

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

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:25

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`capabilities`](../../core/interfaces/EventBridge.md#capabilities)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`capabilities`](../../core/classes/EventBridgeBaseClass.md#capabilities)

***

### channel?

> `protected` `optional` **channel**: `ConfirmChannel`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L74)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<[`EventBridgeConfig`](../../core/type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config)

***

### connection?

> `protected` `optional` **connection**: `ChannelModel`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L73)

***

### consumerRegistrations

> `protected` **consumerRegistrations**: `object`[] = `[]`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:79](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L79)

#### channel

> **channel**: `ConfirmChannel`

#### tag

> **tag**: `string`

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

### encoder

> `protected` **encoder**: [`Encoder`](../type-aliases/Encoder.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:104](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L104)

***

### encrypter

> `protected` **encrypter**: [`Encrypter`](../type-aliases/Encrypter.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:108](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L108)

***

### healthy

> `protected` **healthy**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L76)

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

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:21

#### Inherited from

`AmqpBridge`.[`logger`](#logger)

***

### name

> **name**: `string`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`name`](../../core/interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`name`](../../core/classes/EventBridgeBaseClass.md#name)

***

### pendingInvocations

> `protected` **pendingInvocations**: [`PendingInvocationRegistry`](../../core/classes/PendingInvocationRegistry.md)\<`unknown`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:90](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L90)

***

### ready

> `protected` **ready**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L77)

***

### replyQueueName?

> `protected` `optional` **replyQueueName**: `string`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L81)

***

### serviceFunctions

> `protected` **serviceFunctions**: `Map`\<`string`, \{ `cb`: (`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>; `channel`: `ConfirmChannel`; \}\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L82)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, \{ `cb`: (`message`) => `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>; `channel`: `ConfirmChannel`; \}\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:96](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L96)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:22

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### addConsumerRegistration()

> `protected` **addConsumerRegistration**(`channel`, `tag`): `void`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:112](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L112)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:132](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L132)

#### Returns

`Promise`\<`ConfirmChannel`\>

***

### deadLetterSubscriptionMessage()

> `protected` **deadLetterSubscriptionMessage**(`channel`, `subscription`, `msg`, `reason`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:207](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L207)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1007](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1007)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:1026](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L1026)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:433](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L433)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:986](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L986)

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

### getConsumerAttempt()

> `protected` **getConsumerAttempt**(`headers`): `number`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:142](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L142)

#### Parameters

##### headers

`unknown`

#### Returns

`number`

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:65

#### Returns

`number`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getInFlightExecutionCount`](../../core/classes/EventBridgeBaseClass.md#getinflightexecutioncount)

***

### getSubscriptionDeadLetterTarget()

> `protected` **getSubscriptionDeadLetterTarget**(`subscription`): `string` \| `undefined`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:161](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L161)

#### Parameters

##### subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

#### Returns

`string` \| `undefined`

***

### getSubscriptionFailureReason()

> `protected` **getSubscriptionFailureReason**(`error`): `string`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:165](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L165)

#### Parameters

##### error

`unknown`

#### Returns

`string`

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:512](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L512)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:285](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L285)

Indicates if the bridge connection and channels are currently healthy.

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:278](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L278)

Indicates if the bridge finished startup and is ready to process traffic.

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isReady`](../../core/interfaces/EventBridge.md#isready)

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`_input`, `_ttl?`): `Promise`\<[`StreamHandle`](../../core/interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:66

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:612](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L612)

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

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:67

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:817](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L817)

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

### removeConsumerRegistrationsForChannel()

> `protected` **removeConsumerRegistrationsForChannel**(`channel`): `void`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:116](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L116)

#### Parameters

##### channel

`ConfirmChannel`

#### Returns

`void`

***

### retrySubscriptionMessage()

> `protected` **retrySubscriptionMessage**(`channel`, `queueName`, `msg`, `nextAttempt`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L183)

#### Parameters

##### channel

`ConfirmChannel`

##### queueName

`string`

##### msg

`ConsumeMessage`

##### nextAttempt

`number`

#### Returns

`Promise`\<`void`\>

***

### runInFlight()

> **runInFlight**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:63

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`runInFlight`](../../core/classes/EventBridgeBaseClass.md#runinflight)

***

### sendToQueueAndConfirm()

> `protected` **sendToQueueAndConfirm**(`channel`, `queueName`, `content`, `options`): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:120](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L120)

#### Parameters

##### channel

`ConfirmChannel`

##### queueName

`string`

##### content

`Buffer`

##### options

`Publish` | `undefined`

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:292](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L292)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:793](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L793)

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

Defined in: core/dist/esm/core/EventBridge/EventBridgeBaseClass.impl.d.ts:68

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:958](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L958)

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
