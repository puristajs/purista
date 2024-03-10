[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/natsbridge](../modules/purista_natsbridge.md) / NatsBridge

# Class: NatsBridge

[@purista/natsbridge](../modules/purista_natsbridge.md).NatsBridge

The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.  

Example usage:

**`Example`**

* ```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```

## Hierarchy

- [`EventBridgeBaseClass`](purista_core.EventBridgeBaseClass.md)\<[`NatsBridgeConfig`](../modules/purista_natsbridge.md#natsbridgeconfig)\>

  ↳ **`NatsBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

## Table of contents

### Constructors

- [constructor](purista_natsbridge.NatsBridge.md#constructor)

### Properties

- [commands](purista_natsbridge.NatsBridge.md#commands)
- [config](purista_natsbridge.NatsBridge.md#config)
- [connection](purista_natsbridge.NatsBridge.md#connection)
- [defaultCommandTimeout](purista_natsbridge.NatsBridge.md#defaultcommandtimeout)
- [instanceId](purista_natsbridge.NatsBridge.md#instanceid)
- [isJetStreamEnabled](purista_natsbridge.NatsBridge.md#isjetstreamenabled)
- [jsm](purista_natsbridge.NatsBridge.md#jsm)
- [logger](purista_natsbridge.NatsBridge.md#logger)
- [name](purista_natsbridge.NatsBridge.md#name)
- [sc](purista_natsbridge.NatsBridge.md#sc)
- [subscriptions](purista_natsbridge.NatsBridge.md#subscriptions)
- [traceProvider](purista_natsbridge.NatsBridge.md#traceprovider)

### Methods

- [destroy](purista_natsbridge.NatsBridge.md#destroy)
- [emit](purista_natsbridge.NatsBridge.md#emit)
- [emitMessage](purista_natsbridge.NatsBridge.md#emitmessage)
- [getTracer](purista_natsbridge.NatsBridge.md#gettracer)
- [invoke](purista_natsbridge.NatsBridge.md#invoke)
- [isHealthy](purista_natsbridge.NatsBridge.md#ishealthy)
- [isReady](purista_natsbridge.NatsBridge.md#isready)
- [off](purista_natsbridge.NatsBridge.md#off)
- [on](purista_natsbridge.NatsBridge.md#on)
- [registerCommand](purista_natsbridge.NatsBridge.md#registercommand)
- [registerSubscription](purista_natsbridge.NatsBridge.md#registersubscription)
- [removeAllListeners](purista_natsbridge.NatsBridge.md#removealllisteners)
- [start](purista_natsbridge.NatsBridge.md#start)
- [startActiveSpan](purista_natsbridge.NatsBridge.md#startactivespan)
- [unregisterCommand](purista_natsbridge.NatsBridge.md#unregistercommand)
- [unregisterSubscription](purista_natsbridge.NatsBridge.md#unregistersubscription)
- [wrapInSpan](purista_natsbridge.NatsBridge.md#wrapinspan)

## Constructors

### constructor

• **new NatsBridge**(`config?`): [`NatsBridge`](purista_natsbridge.NatsBridge.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.commandResponsePublishTwice?` | ``"always"`` \| ``"eventOnly"`` \| ``"eventAndError"`` \| ``"never"`` | Indicates if a command response should be published a second time. If the command response gets published, it will be published to the regular topic pattern. If set to `never`, subscription might not get messages they are expecting because of the timing. If set to `always`, every command response is published. Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached. This might result in a high ressource consumption of the broker. If set to `eventOnly`, only success responses which have a event name set, are published twice. There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time. **`Default`** ```ts eventOnly ``` |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.defaultMessageExpiryInterval?` | `number` | the message expiry interval in seconds **`Default`** ```ts 30 days in seconds ``` |
| `config.emptyTopicPartString?` | `string` | The string which should be used in topics for parts, which are undefined **`Default`** ```ts __none__ ``` |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | If no logger instance is given, use this log level |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.maxMessages?` | `number` | maximum messages to run in parallel per subscription 10 means, each subscription can handle 10 calls at the same time **`Default`** ```ts 10 ``` |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.topicPrefix?` | `string` | the prefix for topic to prevent name collisions **`Default`** ```ts purista ``` |

#### Returns

[`NatsBridge`](purista_natsbridge.NatsBridge.md)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[constructor](purista_core.EventBridgeBaseClass.md#constructor)

#### Defined in

[natsbridge/src/NatsBridge.ts:76](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L76)

## Properties

### commands

• **commands**: `Map`\<`string`, `Subscription`\>

#### Defined in

[natsbridge/src/NatsBridge.ts:71](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L71)

___

### config

• **config**: [`Complete`](../modules/purista_core.md#complete)\<\{ `commandResponsePublishTwice`: ``"always"`` \| ``"eventOnly"`` \| ``"eventAndError"`` \| ``"never"`` ; `defaultCommandTimeout?`: `number` ; `defaultMessageExpiryInterval`: `number` ; `emptyTopicPartString`: `string` ; `instanceId?`: `string` ; `logLevel?`: [`LogLevelName`](../modules/purista_core.md#loglevelname) ; `logger?`: [`Logger`](purista_core.Logger.md) ; `maxMessages`: `number` ; `spanProcessor?`: `SpanProcessor` ; `topicPrefix`: `string`  }\>

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[config](purista_core.EventBridgeBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### connection

• **connection**: `undefined` \| `NatsConnection`

#### Defined in

[natsbridge/src/NatsBridge.ts:65](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L65)

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

### instanceId

• **instanceId**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[instanceId](../interfaces/purista_core.EventBridge.md#instanceid)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[instanceId](purista_core.EventBridgeBaseClass.md#instanceid)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### isJetStreamEnabled

• **isJetStreamEnabled**: `boolean` = `false`

#### Defined in

[natsbridge/src/NatsBridge.ts:67](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L67)

___

### jsm

• **jsm**: `undefined` \| `JetStreamManager`

#### Defined in

[natsbridge/src/NatsBridge.ts:69](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L69)

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

### sc

• **sc**: `Codec`\<`unknown`\>

#### Defined in

[natsbridge/src/NatsBridge.ts:74](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L74)

___

### subscriptions

• **subscriptions**: `Map`\<`string`, `Subscription`\>

#### Defined in

[natsbridge/src/NatsBridge.ts:72](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L72)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[traceProvider](purista_core.EventBridgeBaseClass.md#traceprovider)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

## Methods

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

[natsbridge/src/NatsBridge.ts:388](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L388)

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

[natsbridge/src/NatsBridge.ts:106](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L106)

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

[natsbridge/src/NatsBridge.ts:177](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L177)

___

### isHealthy

▸ **isHealthy**(): `Promise`\<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isHealthy](../interfaces/purista_core.EventBridge.md#ishealthy)

#### Defined in

[natsbridge/src/NatsBridge.ts:102](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L102)

___

### isReady

▸ **isReady**(): `Promise`\<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isReady](../interfaces/purista_core.EventBridge.md#isready)

#### Defined in

[natsbridge/src/NatsBridge.ts:98](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L98)

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `cb` | (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  } \| \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> |
| `metadata` | [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase) |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_core.md#definitioneventbridgeconfig) |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerCommand](../interfaces/purista_core.EventBridge.md#registercommand)

#### Defined in

[natsbridge/src/NatsBridge.ts:318](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L318)

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

[natsbridge/src/NatsBridge.ts:359](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L359)

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

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[start](../interfaces/purista_core.EventBridge.md#start)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[start](purista_core.EventBridgeBaseClass.md#start)

#### Defined in

[natsbridge/src/NatsBridge.ts:85](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L85)

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

[natsbridge/src/NatsBridge.ts:348](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L348)

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

[natsbridge/src/NatsBridge.ts:375](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L375)

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
