[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / AmqpBridge

# Class: AmqpBridge

[@purista/amqpbridge](../modules/purista_amqpbridge.md).AmqpBridge

The AMQP event bridge connects to a AMQP broker.

**`Example`**

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

// create and init our eventbridge
  const eventBridge = new AmqpBridge()
  await eventBridge.start()

```

## Hierarchy

- `EventBridgeBaseClass`<[`AmqpBridgeConfig`](../modules/purista_amqpbridge.md#amqpbridgeconfig)\>

  ↳ **`AmqpBridge`**

## Implements

- `EventBridge`

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.AmqpBridge.md#constructor)

### Properties

- [channel](purista_amqpbridge.AmqpBridge.md#channel)
- [config](purista_amqpbridge.AmqpBridge.md#config)
- [connection](purista_amqpbridge.AmqpBridge.md#connection)
- [consumerTags](purista_amqpbridge.AmqpBridge.md#consumertags)
- [defaultCommandTimeout](purista_amqpbridge.AmqpBridge.md#defaultcommandtimeout)
- [encoder](purista_amqpbridge.AmqpBridge.md#encoder)
- [encrypter](purista_amqpbridge.AmqpBridge.md#encrypter)
- [healthy](purista_amqpbridge.AmqpBridge.md#healthy)
- [instanceId](purista_amqpbridge.AmqpBridge.md#instanceid)
- [logger](purista_amqpbridge.AmqpBridge.md#logger)
- [name](purista_amqpbridge.AmqpBridge.md#name)
- [pendingInvocations](purista_amqpbridge.AmqpBridge.md#pendinginvocations)
- [ready](purista_amqpbridge.AmqpBridge.md#ready)
- [replyQueueName](purista_amqpbridge.AmqpBridge.md#replyqueuename)
- [runningSubscriptionCount](purista_amqpbridge.AmqpBridge.md#runningsubscriptioncount)
- [serviceFunctions](purista_amqpbridge.AmqpBridge.md#servicefunctions)
- [subscriptions](purista_amqpbridge.AmqpBridge.md#subscriptions)
- [traceProvider](purista_amqpbridge.AmqpBridge.md#traceprovider)

### Methods

- [decodeContent](purista_amqpbridge.AmqpBridge.md#decodecontent)
- [destroy](purista_amqpbridge.AmqpBridge.md#destroy)
- [emit](purista_amqpbridge.AmqpBridge.md#emit)
- [emitMessage](purista_amqpbridge.AmqpBridge.md#emitmessage)
- [encodeContent](purista_amqpbridge.AmqpBridge.md#encodecontent)
- [getTracer](purista_amqpbridge.AmqpBridge.md#gettracer)
- [invoke](purista_amqpbridge.AmqpBridge.md#invoke)
- [isHealthy](purista_amqpbridge.AmqpBridge.md#ishealthy)
- [isReady](purista_amqpbridge.AmqpBridge.md#isready)
- [off](purista_amqpbridge.AmqpBridge.md#off)
- [on](purista_amqpbridge.AmqpBridge.md#on)
- [registerCommand](purista_amqpbridge.AmqpBridge.md#registercommand)
- [registerSubscription](purista_amqpbridge.AmqpBridge.md#registersubscription)
- [removeAllListeners](purista_amqpbridge.AmqpBridge.md#removealllisteners)
- [start](purista_amqpbridge.AmqpBridge.md#start)
- [startActiveSpan](purista_amqpbridge.AmqpBridge.md#startactivespan)
- [unregisterCommand](purista_amqpbridge.AmqpBridge.md#unregistercommand)
- [unregisterSubscription](purista_amqpbridge.AmqpBridge.md#unregistersubscription)
- [wrapInSpan](purista_amqpbridge.AmqpBridge.md#wrapinspan)

## Constructors

### constructor

• **new AmqpBridge**(`config?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.encoder?` | [`Encoder`](../modules/purista_amqpbridge.md#encoder) | the encoder(s) to be used for AMQP messages **`Default`** ```ts jsonEncoder ``` |
| `config.encrypter?` | [`Encrypter`](../modules/purista_amqpbridge.md#encrypter) | the encrypter(s) to be used for AMQP messages **`Default`** ```ts plain ``` |
| `config.exchangeName?` | `string` | the AMQP exchage name to be used **`Default`** ```ts purista ``` |
| `config.exchangeOptions?` | `AssertExchange` | the AMQP exchange options |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | `LogLevelName` | If no logger instance is given, use this log level |
| `config.logger?` | `Logger` | A logger instance |
| `config.namePrefix?` | `string` | the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request **`Default`** ```ts purista ``` |
| `config.socketOptions?` | `any` | socket options |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.url?` | `string` \| `Connect` | the AMQP broker url **`Default`** ```ts amqp://localhost ``` |

#### Overrides

EventBridgeBaseClass&lt;AmqpBridgeConfig\&gt;.constructor

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:99](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L99)

## Properties

### channel

• `Protected` `Optional` **channel**: `Channel`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:63](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L63)

___

### config

• **config**: `Complete`<{ `defaultCommandTimeout?`: `number` ; `encoder?`: [`Encoder`](../modules/purista_amqpbridge.md#encoder) ; `encrypter?`: [`Encrypter`](../modules/purista_amqpbridge.md#encrypter) ; `exchangeName?`: `string` ; `exchangeOptions?`: `AssertExchange` ; `instanceId?`: `string` ; `logLevel?`: `LogLevelName` ; `logger?`: `Logger` ; `namePrefix?`: `string` ; `socketOptions?`: `any` ; `spanProcessor?`: `SpanProcessor` ; `url?`: `string` \| `Connect`  }\>

#### Inherited from

EventBridgeBaseClass.config

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

___

### connection

• `Protected` `Optional` **connection**: `Connection`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:62](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L62)

___

### consumerTags

• `Protected` **consumerTags**: `string`[] = `[]`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:68](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L68)

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

#### Implementation of

EventBridge.defaultCommandTimeout

#### Inherited from

EventBridgeBaseClass.defaultCommandTimeout

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### encoder

• `Protected` **encoder**: [`Encoder`](../modules/purista_amqpbridge.md#encoder)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:91](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L91)

___

### encrypter

• `Protected` **encrypter**: [`Encrypter`](../modules/purista_amqpbridge.md#encrypter)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:95](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L95)

___

### healthy

• `Protected` **healthy**: `boolean` = `false`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:65](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L65)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

EventBridgeBaseClass.instanceId

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### logger

• **logger**: `Logger`

#### Inherited from

EventBridgeBaseClass.logger

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:11

___

### name

• **name**: `string`

#### Implementation of

EventBridge.name

#### Inherited from

EventBridgeBaseClass.name

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:79](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L79)

___

### ready

• `Protected` **ready**: `boolean` = `false`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L66)

___

### replyQueueName

• `Protected` `Optional` **replyQueueName**: `string`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L70)

___

### runningSubscriptionCount

• `Protected` **runningSubscriptionCount**: `number` = `0`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:81](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L81)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`<`string`, { `cb`: (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `isHandledError`: `boolean` ; `messageType`: `CommandErrorResponse` ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: `StatusCode`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  } \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CommandSuccessResponse` ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }\> ; `channel`: `Channel`  }\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:71](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L71)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, { `cb`: (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CustomMessage` ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CustomMessage` ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"instanceId"`` \| ``"timestamp"``\>\> ; `channel`: `Channel`  }\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:83](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L83)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

EventBridgeBaseClass.traceProvider

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

## Methods

### decodeContent

▸ `Protected` **decodeContent**<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`<`T`\>

Decode buffer into given type

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Buffer` | the input buffer |
| `contentType` | `string` | the content type of buffer content |
| `contentEncoding` | `string` | the encoding type of buffer content |

#### Returns

`Promise`<`T`\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:782](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L782)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.destroy

#### Overrides

EventBridgeBaseClass.destroy

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:797](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L797)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `EventKey`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | { `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`] |

#### Returns

`void`

#### Inherited from

EventBridgeBaseClass.emit

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:13

___

### emitMessage

▸ **emitMessage**<`T`\>(`message`, `contentType?`, `contentEncoding?`): `Promise`<`Readonly`<`EBMessage`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `EBMessage` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `Omit`<`EBMessage`, ``"id"`` \| ``"instanceId"`` \| ``"timestamp"`` \| ``"correlationId"``\> | `undefined` |
| `contentType` | `string` | `'application/json'` |
| `contentEncoding` | `string` | `'utf-8'` |

#### Returns

`Promise`<`Readonly`<`EBMessage`\>\>

#### Implementation of

EventBridge.emitMessage

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:271](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L271)

___

### encodeContent

▸ `Protected` **encodeContent**<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`<`Buffer`\>

Encode given payload to buffer

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `T` |
| `contentType` | `string` |
| `contentEncoding` | `string` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:761](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L761)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

EventBridgeBaseClass.getTracer

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

___

### invoke

▸ **invoke**<`T`\>(`input`, `commandTimeout?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"messageType"`` \| ``"instanceId"`` \| ``"timestamp"`` \| ``"correlationId"``\> |
| `commandTimeout` | `number` |

#### Returns

`Promise`<`T`\>

#### Implementation of

EventBridge.invoke

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:342](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L342)

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isHealthy

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:122](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L122)

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isReady

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:118](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L118)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `EventKey`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

EventBridgeBaseClass.off

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `EventKey`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

EventBridgeBaseClass.on

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`<`string`\>

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `EBMessageAddress` | The service function address |
| `cb` | (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `isHandledError`: `boolean` ; `messageType`: `CommandErrorResponse` ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: `StatusCode`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  } \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CommandSuccessResponse` ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }\> | the function to call if a matching command message arrives |
| `metadata` | `CommandDefinitionMetadataBase` | - |
| `eventBridgeConfig` | `DefinitionEventBridgeConfig` | - |

#### Returns

`Promise`<`string`\>

the id of command function queue

#### Implementation of

EventBridge.registerCommand

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:446](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L446)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | `Subscription` |
| `cb` | (`message`: `EBMessage`) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CustomMessage` ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"instanceId"`` \| ``"timestamp"``\>\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

EventBridge.registerSubscription

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:617](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L617)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

EventBridgeBaseClass.removeAllListeners

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:14

___

### start

▸ **start**(): `Promise`<`void`\>

Connect to RabbitMQ broker, ensure exchange, call back queue

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.start

#### Overrides

EventBridgeBaseClass.start

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:129](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L129)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`<`F`\>

Start a child span for opentelemetry tracking

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `context` | `undefined` \| `Context` | optional context |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | function to be executed within the span |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

EventBridgeBaseClass.startActiveSpan

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:32

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.unregisterCommand

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:598](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L598)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.unregisterSubscription

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:735](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L735)

___

### wrapInSpan

▸ **wrapInSpan**<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`<`F`\>

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | function te be executed in the span |
| `context?` | `Context` | span context |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

EventBridgeBaseClass.wrapInSpan

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:48
