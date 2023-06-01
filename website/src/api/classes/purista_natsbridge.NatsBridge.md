[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/natsbridge](../modules/purista_natsbridge.md) / NatsBridge

# Class: NatsBridge

[@purista/natsbridge](../modules/purista_natsbridge.md).NatsBridge

The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.  

Example usage:

**`Example`**

```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```

## Hierarchy

- `EventBridgeBaseClass`<[`NatsBridgeConfig`](../modules/purista_natsbridge.md#natsbridgeconfig)\>

  ↳ **`NatsBridge`**

## Implements

- `EventBridge`

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

• **new NatsBridge**(`config?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.commandResponsePublishTwice?` | ``"always"`` \| ``"never"`` \| ``"eventOnly"`` \| ``"eventAndError"`` | Indicates if a command response should be published a second time. If the command response gets published, it will be published to the regular topic pattern. If set to `never`, subscription might not get messages they are expecting because of the timing. If set to `always`, every command response is published. Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached. This might result in a high ressource consumption of the broker. If set to `eventOnly`, only success responses which have a event name set, are published twice. There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time. **`Default`** ```ts eventOnly ``` |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.defaultMessageExpiryInterval?` | `number` | the message expiry interval in seconds **`Default`** ```ts 30 days in seconds ``` |
| `config.emptyTopicPartString?` | `string` | The string which should be used in topics for parts, which are undefined **`Default`** ```ts __none__ ``` |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | `LogLevelName` | If no logger instance is given, use this log level |
| `config.logger?` | `Logger` | A logger instance |
| `config.maxMessages?` | `number` | maximum messages to run in parallel per subscription 10 means, each subscription can handle 10 calls at the same time **`Default`** ```ts 10 ``` |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.topicPrefix?` | `string` | the prefix for topic to prevent name collisions **`Default`** ```ts purista ``` |

#### Overrides

EventBridgeBaseClass&lt;NatsBridgeConfig\&gt;.constructor

#### Defined in

[natsbridge/src/NatsBridge.ts:81](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L81)

## Properties

### commands

• **commands**: `Map`<`string`, `Subscription`\>

#### Defined in

[natsbridge/src/NatsBridge.ts:76](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L76)

___

### config

• **config**: `Complete`<{ `commandResponsePublishTwice`: ``"always"`` \| ``"never"`` \| ``"eventOnly"`` \| ``"eventAndError"`` ; `defaultCommandTimeout?`: `number` ; `defaultMessageExpiryInterval`: `number` ; `emptyTopicPartString`: `string` ; `instanceId?`: `string` ; `logLevel?`: `LogLevelName` ; `logger?`: `Logger` ; `maxMessages`: `number` ; `spanProcessor?`: `SpanProcessor` ; `topicPrefix`: `string`  }\>

#### Inherited from

EventBridgeBaseClass.config

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

___

### connection

• **connection**: `undefined` \| `NatsConnection`

#### Defined in

[natsbridge/src/NatsBridge.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L70)

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

### instanceId

• **instanceId**: `string`

#### Implementation of

EventBridge.instanceId

#### Inherited from

EventBridgeBaseClass.instanceId

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### isJetStreamEnabled

• **isJetStreamEnabled**: `boolean` = `false`

#### Defined in

[natsbridge/src/NatsBridge.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L72)

___

### jsm

• **jsm**: `undefined` \| `JetStreamManager`

#### Defined in

[natsbridge/src/NatsBridge.ts:74](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L74)

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

### sc

• **sc**: `Codec`<`unknown`\>

#### Defined in

[natsbridge/src/NatsBridge.ts:79](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L79)

___

### subscriptions

• **subscriptions**: `Map`<`string`, `Subscription`\>

#### Defined in

[natsbridge/src/NatsBridge.ts:77](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L77)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

EventBridgeBaseClass.traceProvider

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.destroy

#### Overrides

EventBridgeBaseClass.destroy

#### Defined in

[natsbridge/src/NatsBridge.ts:388](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L388)

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
| `message` | `Omit`<`EBMessage`, ``"id"`` \| ``"timestamp"`` \| ``"correlationId"``\> | `undefined` |
| `contentType` | `string` | `'application/json'` |
| `contentEncoding` | `string` | `'utf-8'` |

#### Returns

`Promise`<`Readonly`<`EBMessage`\>\>

#### Implementation of

EventBridge.emitMessage

#### Defined in

[natsbridge/src/NatsBridge.ts:111](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L111)

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
| `input` | `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"correlationId"``\> |
| `commandTimeout` | `number` |

#### Returns

`Promise`<`T`\>

#### Implementation of

EventBridge.invoke

#### Defined in

[natsbridge/src/NatsBridge.ts:178](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L178)

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isHealthy

#### Defined in

[natsbridge/src/NatsBridge.ts:107](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L107)

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isReady

#### Defined in

[natsbridge/src/NatsBridge.ts:103](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L103)

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |
| `cb` | (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: `CommandErrorResponse` ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: `StatusCode`  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  } \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: `CommandSuccessResponse` ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> |
| `metadata` | `CommandDefinitionMetadataBase` |
| `eventBridgeConfig` | `DefinitionEventBridgeConfig` |

#### Returns

`Promise`<`string`\>

#### Implementation of

EventBridge.registerCommand

#### Defined in

[natsbridge/src/NatsBridge.ts:318](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L318)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | `Subscription` |
| `cb` | (`message`: `EBMessage`) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: `CustomMessage` ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: `EBMessageAddress` ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

EventBridge.registerSubscription

#### Defined in

[natsbridge/src/NatsBridge.ts:359](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L359)

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

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.start

#### Overrides

EventBridgeBaseClass.start

#### Defined in

[natsbridge/src/NatsBridge.ts:90](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L90)

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

[natsbridge/src/NatsBridge.ts:348](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L348)

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

[natsbridge/src/NatsBridge.ts:375](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/NatsBridge.ts#L375)

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
