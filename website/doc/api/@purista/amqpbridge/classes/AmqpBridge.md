[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / AmqpBridge

# Class: AmqpBridge

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L71)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:117](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L117)

#### Parameters

##### config?

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

### channel?

> `protected` `optional` **channel**: `Channel`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L73)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<[`EventBridgeConfig`](../../core/type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L35)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config)

***

### connection?

> `protected` `optional` **connection**: `ChannelModel`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L72)

***

### consumerRegistrations

> `protected` **consumerRegistrations**: `object`[] = `[]`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:78](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L78)

#### channel

> **channel**: `Channel`

#### tag

> **tag**: `string`

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

### encoder

> `protected` **encoder**: [`Encoder`](../type-aliases/Encoder.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L101)

***

### encrypter

> `protected` **encrypter**: [`Encrypter`](../type-aliases/Encrypter.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L105)

***

### healthy

> `protected` **healthy**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:75](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L75)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L39)

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`instanceId`](../../core/classes/EventBridgeBaseClass.md#instanceid)

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

### pendingInvocations

> `protected` **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../../core/type-aliases/PendigInvocation.md)\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L89)

***

### ready

> `protected` **ready**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L76)

***

### replyQueueName?

> `protected` `optional` **replyQueueName**: `string`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L80)

***

### runningSubscriptionCount

> `protected` **runningSubscriptionCount**: `number` = `0`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:91](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L91)

***

### serviceFunctions

> `protected` **serviceFunctions**: `Map`\<`string`, \{ `cb`: (`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>; `channel`: `Channel`; \}\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L81)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, \{ `cb`: (`message`) => `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>; `channel`: `Channel`; \}\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L93)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L33)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### addConsumerRegistration()

> `protected` **addConsumerRegistration**(`channel`, `tag`): `void`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:109](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L109)

#### Parameters

##### channel

`Channel`

##### tag

`string`

#### Returns

`void`

***

### decodeContent()

> `protected` **decodeContent**\<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`\<`T`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:878](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L878)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:897](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L897)

Gracefully stops all consumers, waits for in-flight subscription handlers,
closes AMQP resources and rejects unresolved pending invocations.

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:301](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L301)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:857](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L857)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:380](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L380)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:146](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L146)

Indicates if the bridge connection and channels are currently healthy.

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:139](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L139)

Indicates if the bridge finished startup and is ready to process traffic.

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:513](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L513)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:704](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L704)

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

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/src/core/types/GenericEventEmitter.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L31)

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`removeAllListeners`](../../core/classes/EventBridgeBaseClass.md#removealllisteners)

***

### removeConsumerRegistrationsForChannel()

> `protected` **removeConsumerRegistrationsForChannel**(`channel`): `void`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:113](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L113)

#### Parameters

##### channel

`Channel`

#### Returns

`void`

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:153](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L153)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:679](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L679)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:828](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L828)

Unregisters a subscription consumer and closes its channel.

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
