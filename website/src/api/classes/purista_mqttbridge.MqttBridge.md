[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/mqttbridge](../modules/purista_mqttbridge.md) / MqttBridge

# Class: MqttBridge

[@purista/mqttbridge](../modules/purista_mqttbridge.md).MqttBridge

The MQTT event bridge connects to a MQTT broker.
The broker must support the MQTT 5 protocol version

**`Example`**

```typescript
import { MqttBridge } from '@purista/mqttbridge'

// create and init our eventbridge
const eventBridge = new MqttBridge()
await eventBridge.start()

@group Event bridge

## Hierarchy

- `EventBridgeBaseClass`<[`MqttBridgeConfig`](../modules/purista_mqttbridge.md#mqttbridgeconfig)\>

  ↳ **`MqttBridge`**

## Implements

- `EventBridge`

## Table of contents

### Constructors

- [constructor](purista_mqttbridge.MqttBridge.md#constructor)

### Properties

- [client](purista_mqttbridge.MqttBridge.md#client)
- [config](purista_mqttbridge.MqttBridge.md#config)
- [defaultCommandTimeout](purista_mqttbridge.MqttBridge.md#defaultcommandtimeout)
- [healthy](purista_mqttbridge.MqttBridge.md#healthy)
- [instanceId](purista_mqttbridge.MqttBridge.md#instanceid)
- [logger](purista_mqttbridge.MqttBridge.md#logger)
- [name](purista_mqttbridge.MqttBridge.md#name)
- [pendingInvocations](purista_mqttbridge.MqttBridge.md#pendinginvocations)
- [ready](purista_mqttbridge.MqttBridge.md#ready)
- [router](purista_mqttbridge.MqttBridge.md#router)
- [traceProvider](purista_mqttbridge.MqttBridge.md#traceprovider)

### Methods

- [destroy](purista_mqttbridge.MqttBridge.md#destroy)
- [emit](purista_mqttbridge.MqttBridge.md#emit)
- [emitMessage](purista_mqttbridge.MqttBridge.md#emitmessage)
- [getTracer](purista_mqttbridge.MqttBridge.md#gettracer)
- [invoke](purista_mqttbridge.MqttBridge.md#invoke)
- [isHealthy](purista_mqttbridge.MqttBridge.md#ishealthy)
- [isReady](purista_mqttbridge.MqttBridge.md#isready)
- [off](purista_mqttbridge.MqttBridge.md#off)
- [on](purista_mqttbridge.MqttBridge.md#on)
- [registerCommand](purista_mqttbridge.MqttBridge.md#registercommand)
- [registerSubscription](purista_mqttbridge.MqttBridge.md#registersubscription)
- [removeAllListeners](purista_mqttbridge.MqttBridge.md#removealllisteners)
- [start](purista_mqttbridge.MqttBridge.md#start)
- [startActiveSpan](purista_mqttbridge.MqttBridge.md#startactivespan)
- [unregisterCommand](purista_mqttbridge.MqttBridge.md#unregistercommand)
- [unregisterSubscription](purista_mqttbridge.MqttBridge.md#unregistersubscription)
- [wrapInSpan](purista_mqttbridge.MqttBridge.md#wrapinspan)

## Constructors

### constructor

• **new MqttBridge**(`config?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.allowRetries?` | `boolean` | allow retry of the initial connect |
| `config.commandResponsePublishTwice?` | ``"always"`` \| ``"never"`` \| ``"eventOnly"`` \| ``"eventAndError"`` | Indicates if a command response should be published a second time. If the command response gets published, it will be published to the regular topic pattern. The QOS and expiry will be set to subscription configuration values. If set to `never`, subscription might not get messages they are expecting because of the timing. If set to `always`, every command response is published. Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached. This might result in a high ressource consumption of the broker. If set to `eventOnly`, only success responses which have a event name set, are published twice. There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time. **`Default`** ```ts eventOnly ``` |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.defaultMessageExpiryInterval?` | `number` | the message expiry interval in seconds **`Default`** ```ts ``` |
| `config.defaultSessionExpiryInterval?` | `number` | **`Default`** ```ts 0 ``` |
| `config.emptyTopicPartString?` | `string` | The string which should be used in topics for parts, which are undefined **`Default`** ```ts __none__ ``` |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | `LogLevelName` | If no logger instance is given, use this log level |
| `config.logger?` | `Logger` | A logger instance |
| `config.qoSSubscription?` | `QoS` | QOS for all subscriptions **`Default`** ```ts 1 ``` |
| `config.qosCommand?` | `QoS` | QOS for command, command responses and command response subscriptions messages **`Default`** ```ts 1 ``` |
| `config.shareTopicName?` | `string` | the name of the shared topic (similar to pubsub name) **`Default`** ```ts purista ``` |
| `config.shareTopicPrefix?` | `string` | the prefix to be used to dynamically create topic names for shared subscriptions **`Default`** ```ts $share ``` |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.topicPrefix?` | `string` | the prefix for topic to prevent name collisions **`Default`** ```ts purista ``` |

#### Overrides

EventBridgeBaseClass&lt;MqttBridgeConfig\&gt;.constructor

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:69](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L69)

## Properties

### client

• **client**: [`AsyncClient`](purista_mqttbridge.AsyncClient.md)

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:65](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L65)

___

### config

• **config**: `Complete`<{ `allowRetries?`: `boolean` ; `commandResponsePublishTwice`: ``"always"`` \| ``"never"`` \| ``"eventOnly"`` \| ``"eventAndError"`` ; `defaultCommandTimeout?`: `number` ; `defaultMessageExpiryInterval`: `number` ; `defaultSessionExpiryInterval`: `number` ; `emptyTopicPartString`: `string` ; `instanceId?`: `string` ; `logLevel?`: `LogLevelName` ; `logger?`: `Logger` ; `qoSSubscription`: `QoS` ; `qosCommand`: `QoS` ; `shareTopicName`: `string` ; `shareTopicPrefix`: `string` ; `spanProcessor?`: `SpanProcessor` ; `topicPrefix`: `string`  }\>

#### Inherited from

EventBridgeBaseClass.config

#### Defined in

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

#### Implementation of

EventBridge.defaultCommandTimeout

#### Inherited from

EventBridgeBaseClass.defaultCommandTimeout

#### Defined in

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### healthy

• `Private` **healthy**: `boolean` = `false`

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:63](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L63)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

EventBridgeBaseClass.instanceId

#### Defined in

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### logger

• **logger**: `Logger`

#### Inherited from

EventBridgeBaseClass.logger

#### Defined in

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:11

___

### name

• **name**: `string`

#### Implementation of

EventBridge.name

#### Inherited from

EventBridgeBaseClass.name

#### Defined in

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### pendingInvocations

• **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L66)

___

### ready

• `Private` **ready**: `boolean` = `false`

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:64](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L64)

___

### router

• `Private` **router**: [`TopicRouter`](purista_mqttbridge.TopicRouter.md)

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:67](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L67)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

EventBridgeBaseClass.traceProvider

#### Defined in

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

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

[packages/mqttbridge/src/MqttEventBridge.ts:351](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L351)

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

packages/core/lib/types/core/types/GenericEventEmitter.d.ts:13

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

[packages/mqttbridge/src/MqttEventBridge.ts:129](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L129)

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

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

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

[packages/mqttbridge/src/MqttEventBridge.ts:198](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L198)

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isHealthy

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:194](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L194)

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isReady

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:190](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L190)

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

packages/core/lib/types/core/types/GenericEventEmitter.d.ts:12

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

packages/core/lib/types/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |
| `cb` | (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `isHandledError`: `boolean` ; `messageType`: `CommandErrorResponse` ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: `StatusCode`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  } \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CommandSuccessResponse` ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }\> |
| `metadata` | `CommandDefinitionMetadataBase` |
| `eventBridgeConfig` | `DefinitionEventBridgeConfig` |

#### Returns

`Promise`<`string`\>

#### Implementation of

EventBridge.registerCommand

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:297](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L297)

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

[packages/mqttbridge/src/MqttEventBridge.ts:323](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L323)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

EventBridgeBaseClass.removeAllListeners

#### Defined in

packages/core/lib/types/core/types/GenericEventEmitter.d.ts:14

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

[packages/mqttbridge/src/MqttEventBridge.ts:79](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L79)

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

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:32

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

[packages/mqttbridge/src/MqttEventBridge.ts:317](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L317)

___

### unregisterSubscription

▸ **unregisterSubscription**(`_address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | `EBMessageAddress` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.unregisterSubscription

#### Defined in

[packages/mqttbridge/src/MqttEventBridge.ts:349](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L349)

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

packages/core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:48
