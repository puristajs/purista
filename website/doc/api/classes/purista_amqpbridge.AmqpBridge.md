[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / AmqpBridge

# Class: AmqpBridge

[@purista/amqpbridge](../modules/purista_amqpbridge.md).AmqpBridge

The AMQP event bridge connects to a AMQP broker.

**`Example`**

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

// create and init our eventbridge
const config = {
   url: 'amqp://localhost'
}

const eventBridge = new AmqpBridge(config)
await eventBridge.start()

```

## Hierarchy

- [`EventBridgeBaseClass`](purista_core.EventBridgeBaseClass.md)\<[`AmqpBridgeConfig`](../modules/purista_amqpbridge.md#amqpbridgeconfig)\>

  ↳ **`AmqpBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

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

• **new AmqpBridge**(`config?`): [`AmqpBridge`](purista_amqpbridge.AmqpBridge.md)

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
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | If no logger instance is given, use this log level |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.namePrefix?` | `string` | the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request **`Default`** ```ts purista ``` |
| `config.socketOptions?` | `any` | socket options |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.url?` | `string` \| `Connect` | the AMQP broker url **`Default`** ```ts amqp://localhost ``` |

#### Returns

[`AmqpBridge`](purista_amqpbridge.AmqpBridge.md)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[constructor](purista_core.EventBridgeBaseClass.md#constructor)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:105](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L105)

## Properties

### channel

• `Protected` `Optional` **channel**: `Channel`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:69](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L69)

___

### config

• **config**: [`Complete`](../modules/purista_core.md#complete)\<\{ `defaultCommandTimeout?`: `number` ; `encoder?`: [`Encoder`](../modules/purista_amqpbridge.md#encoder) ; `encrypter?`: [`Encrypter`](../modules/purista_amqpbridge.md#encrypter) ; `exchangeName?`: `string` ; `exchangeOptions?`: `AssertExchange` ; `instanceId?`: `string` ; `logLevel?`: [`LogLevelName`](../modules/purista_core.md#loglevelname) ; `logger?`: [`Logger`](purista_core.Logger.md) ; `namePrefix?`: `string` ; `socketOptions?`: `any` ; `spanProcessor?`: `SpanProcessor` ; `url?`: `string` \| `Connect`  }\>

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[config](purista_core.EventBridgeBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### connection

• `Protected` `Optional` **connection**: `Connection`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:68](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L68)

___

### consumerTags

• `Protected` **consumerTags**: `string`[] = `[]`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:74](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L74)

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[defaultCommandTimeout](../interfaces/purista_core.EventBridge.md#defaultcommandtimeout)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[defaultCommandTimeout](purista_core.EventBridgeBaseClass.md#defaultcommandtimeout)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:17

___

### encoder

• `Protected` **encoder**: [`Encoder`](../modules/purista_amqpbridge.md#encoder)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:97](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L97)

___

### encrypter

• `Protected` **encrypter**: [`Encrypter`](../modules/purista_amqpbridge.md#encrypter)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:101](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L101)

___

### healthy

• `Protected` **healthy**: `boolean` = `false`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:71](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L71)

___

### instanceId

• **instanceId**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[instanceId](../interfaces/purista_core.EventBridge.md#instanceid)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[instanceId](purista_core.EventBridgeBaseClass.md#instanceid)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[logger](purista_core.EventBridgeBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

___

### name

• **name**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[name](../interfaces/purista_core.EventBridge.md#name)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[name](purista_core.EventBridgeBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../modules/purista_core.md#pendiginvocation)\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:85](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L85)

___

### ready

• `Protected` **ready**: `boolean` = `false`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L72)

___

### replyQueueName

• `Protected` `Optional` **replyQueueName**: `string`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:76](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L76)

___

### runningSubscriptionCount

• `Protected` **runningSubscriptionCount**: `number` = `0`

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:87](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L87)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`\<`string`, \{ `cb`: (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  } \| \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> ; `channel`: `Channel`  }\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:77](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L77)

___

### subscriptions

• `Protected` **subscriptions**: `Map`\<`string`, \{ `cb`: (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\> ; `channel`: `Channel`  }\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:89](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L89)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[traceProvider](purista_core.EventBridgeBaseClass.md#traceprovider)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

## Methods

### decodeContent

▸ **decodeContent**\<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`\<`T`\>

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

`Promise`\<`T`\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:821](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L821)

___

### destroy

▸ **destroy**(): `Promise`\<`void`\>

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[destroy](../interfaces/purista_core.EventBridge.md#destroy)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[destroy](purista_core.EventBridgeBaseClass.md#destroy)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:836](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L836)

___

### emit

▸ **emit**\<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | \{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`] |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[emit](purista_core.EventBridgeBaseClass.md#emit)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:13

___

### emitMessage

▸ **emitMessage**\<`T`\>(`message`, `contentType?`, `contentEncoding?`): `Promise`\<`Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a message to the eventbridge without awaiting a result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EBMessage`](../modules/purista_core.md#ebmessage) |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `Omit`\<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"correlationId"``\> | `undefined` | the message |
| `contentType` | `string` | `'application/json'` | - |
| `contentEncoding` | `string` | `'utf-8'` | - |

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[emitMessage](../interfaces/purista_core.EventBridge.md#emitmessage)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:279](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L279)

___

### encodeContent

▸ **encodeContent**\<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`\<`Buffer`\>

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

`Promise`\<`Buffer`\>

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:800](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L800)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[getTracer](purista_core.EventBridgeBaseClass.md#gettracer)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

___

### invoke

▸ **invoke**\<`T`\>(`input`, `commandTimeout?`): `Promise`\<`T`\>

Call a command of a service and return the result of this command

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"`` \| ``"correlationId"`` \| ``"messageType"``\> | a partial command message |
| `commandTimeout` | `number` | the time to live (timeout) of the invocation |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[invoke](../interfaces/purista_core.EventBridge.md#invoke)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:354](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L354)

___

### isHealthy

▸ **isHealthy**(): `Promise`\<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isHealthy](../interfaces/purista_core.EventBridge.md#ishealthy)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:128](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L128)

___

### isReady

▸ **isReady**(): `Promise`\<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isReady](../interfaces/purista_core.EventBridge.md#isready)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:124](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L124)

___

### off

▸ **off**\<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[off](purista_core.EventBridgeBaseClass.md#off)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**\<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[on](purista_core.EventBridgeBaseClass.md#on)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The service function address |
| `cb` | (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  } \| \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> | the function to call if a matching command message arrives |
| `metadata` | [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase) | - |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_core.md#definitioneventbridgeconfig) | - |

#### Returns

`Promise`\<`string`\>

the id of command function queue

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerCommand](../interfaces/purista_core.EventBridge.md#registercommand)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:472](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L472)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Register a new subscription

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) | the subscription definition |
| `cb` | (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage)) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\> | the function to be called if a matching message arrives |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerSubscription](../interfaces/purista_core.EventBridge.md#registersubscription)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:654](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L654)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[removeAllListeners](purista_core.EventBridgeBaseClass.md#removealllisteners)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:14

___

### start

▸ **start**(): `Promise`\<`void`\>

Connect to RabbitMQ broker, ensure exchange, call back queue

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[start](../interfaces/purista_core.EventBridge.md#start)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[start](purista_core.EventBridgeBaseClass.md#start)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:135](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L135)

___

### startActiveSpan

▸ **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

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
| `fn` | (`span`: `Span`) => `Promise`\<`F`\> | function to be executed within the span |

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[startActiveSpan](purista_core.EventBridgeBaseClass.md#startactivespan)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:33

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`\<`void`\>

Unregister a service command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The address (service name, version and command name) of the command to be de-registered |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterCommand](../interfaces/purista_core.EventBridge.md#unregistercommand)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:635](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L635)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterSubscription](../interfaces/purista_core.EventBridge.md#unregistersubscription)

#### Defined in

[amqpbridge/src/AmqpBridge.impl.ts:774](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/AmqpBridge.impl.ts#L774)

___

### wrapInSpan

▸ **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

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
| `fn` | (`span`: `Span`) => `Promise`\<`F`\> | function te be executed in the span |
| `context?` | `Context` | span context |

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[wrapInSpan](purista_core.EventBridgeBaseClass.md#wrapinspan)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:49
