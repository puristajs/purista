[**@purista/amqpbridge v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / AmqpBridge

# Class: AmqpBridge

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:67](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L67)

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

### new AmqpBridge()

> **new AmqpBridge**(`config`?): [`AmqpBridge`](AmqpBridge.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L105)

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

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

If no logger instance is given, use this log level

###### namePrefix?

`string`

the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request

**Default**

```ts
purista
```

###### socketOptions?

`any`

socket options

###### spanProcessor?

`SpanProcessor`

A OpenTelemetry span processor

###### url?

`string` \| `Connect`

the AMQP broker url

**Default**

```ts
amqp://localhost
```

#### Returns

[`AmqpBridge`](AmqpBridge.md)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`constructor`](../../core/classes/EventBridgeBaseClass.md#constructors)

## Properties

### channel?

> `protected` `optional` **channel**: `Channel`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L69)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<\{ `defaultCommandTimeout`: `number`; `encoder`: [`Encoder`](../type-aliases/Encoder.md); `encrypter`: [`Encrypter`](../type-aliases/Encrypter.md); `exchangeName`: `string`; `exchangeOptions`: `AssertExchange`; `instanceId`: `string`; `logger`: [`Logger`](../../core/classes/Logger.md); `logLevel`: [`LogLevelName`](../../core/type-aliases/LogLevelName.md); `namePrefix`: `string`; `socketOptions`: `any`; `spanProcessor`: `SpanProcessor`; `url`: `string` \| `Connect`; \}\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config-1)

***

### connection?

> `protected` `optional` **connection**: `Connection`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:68](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L68)

***

### consumerTags

> `protected` **consumerTags**: `string`[] = `[]`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L74)

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

### encoder

> `protected` **encoder**: [`Encoder`](../type-aliases/Encoder.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:97](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L97)

***

### encrypter

> `protected` **encrypter**: [`Encrypter`](../type-aliases/Encrypter.md)

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L101)

***

### healthy

> `protected` **healthy**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L71)

***

### instanceId

> **instanceId**: `string`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`instanceId`](../../core/classes/EventBridgeBaseClass.md#instanceid)

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

### pendingInvocations

> `protected` **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../../core/type-aliases/PendigInvocation.md)\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:85](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L85)

***

### ready

> `protected` **ready**: `boolean` = `false`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L72)

***

### replyQueueName?

> `protected` `optional` **replyQueueName**: `string`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L76)

***

### runningSubscriptionCount

> `protected` **runningSubscriptionCount**: `number` = `0`

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L87)

***

### serviceFunctions

> `protected` **serviceFunctions**: `Map`\<`string`, \{ `cb`: (`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>; `channel`: `Channel`; \}\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L77)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, \{ `cb`: (`message`) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>; `channel`: `Channel`; \}\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L89)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### decodeContent()

> `protected` **decodeContent**\<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`\<`T`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:821](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L821)

Decode buffer into given type

#### Type Parameters

• **T**

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:836](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L836)

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

> **emitMessage**\<`T`\>(`message`, `contentType`, `contentEncoding`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:279](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L279)

Emit a message to the eventbridge without awaiting a result

#### Type Parameters

• **T** *extends* [`EBMessage`](../../core/type-aliases/EBMessage.md)

#### Parameters

##### message

`Omit`\<[`EBMessage`](../../core/type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

the message

##### contentType

`string` = `'application/json'`

##### contentEncoding

`string` = `'utf-8'`

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`emitMessage`](../../core/interfaces/EventBridge.md#emitmessage)

***

### encodeContent()

> `protected` **encodeContent**\<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:800](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L800)

Encode given payload to buffer

#### Type Parameters

• **T**

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

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getTracer`](../../core/classes/EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `commandTimeout`): `Promise`\<`T`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:354](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L354)

Call a command of a service and return the result of this command

#### Type Parameters

• **T**

#### Parameters

##### input

`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../../core/enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `unknown`; `payload`: `unknown`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"` \| `"correlationId"` \| `"messageType"`\>

a partial command message

##### commandTimeout

`number` = `...`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`invoke`](../../core/interfaces/EventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:128](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L128)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:124](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L124)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:472](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L472)

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

The service function address

##### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

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

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:654](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L654)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:135](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L135)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:635](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L635)

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

Defined in: [amqpbridge/src/AmqpBridge.impl.ts:774](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L774)

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
