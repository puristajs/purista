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

- [`EventBridgeBaseClass`](purista_core.EventBridgeBaseClass.md)\<[`MqttBridgeConfig`](../modules/purista_mqttbridge.md#mqttbridgeconfig)\>

  ↳ **`MqttBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

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

• **new MqttBridge**(`config?`): [`MqttBridge`](purista_mqttbridge.MqttBridge.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.allowRetries?` | `boolean` | allow retry of the initial connect |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.defaultMessageExpiryInterval?` | `number` | the message expiry interval in seconds **`Default`** ```ts ``` |
| `config.defaultSessionExpiryInterval?` | `number` | **`Default`** ```ts 0 ``` |
| `config.emptyTopicPartString?` | `string` | The string which should be used in topics for parts, which are undefined **`Default`** ```ts __none__ ``` |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | If no logger instance is given, use this log level |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.qoSSubscription?` | `QoS` | QOS for all subscriptions **`Default`** ```ts 1 ``` |
| `config.qosCommand?` | `QoS` | QOS for command, command responses and command response subscriptions messages **`Default`** ```ts 1 ``` |
| `config.shareTopicName?` | `string` | the name of the shared topic (similar to pubsub name) **`Default`** ```ts sharedpurista ``` |
| `config.shareTopicPrefix?` | `string` | the prefix to be used to dynamically create topic names for shared subscriptions **`Default`** ```ts $share ``` |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.topicPrefix?` | `string` | the prefix for topic to prevent name collisions **`Default`** ```ts purista ``` |

#### Returns

[`MqttBridge`](purista_mqttbridge.MqttBridge.md)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[constructor](purista_core.EventBridgeBaseClass.md#constructor)

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:73](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L73)

## Properties

### client

• **client**: `undefined` \| `default`

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:69](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L69)

___

### config

• **config**: [`Complete`](../modules/purista_core.md#complete)\<\{ `allowRetries?`: `boolean` ; `defaultCommandTimeout?`: `number` ; `defaultMessageExpiryInterval`: `number` ; `defaultSessionExpiryInterval`: `number` ; `emptyTopicPartString`: `string` ; `instanceId?`: `string` ; `logLevel?`: [`LogLevelName`](../modules/purista_core.md#loglevelname) ; `logger?`: [`Logger`](purista_core.Logger.md) ; `qoSSubscription`: `QoS` ; `qosCommand`: `QoS` ; `shareTopicName`: `string` ; `shareTopicPrefix`: `string` ; `spanProcessor?`: `SpanProcessor` ; `topicPrefix`: `string`  }\>

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[config](purista_core.EventBridgeBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

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

### healthy

• `Private` **healthy**: `boolean` = `false`

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:67](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L67)

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

• **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../modules/purista_core.md#pendiginvocation)\>

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:70](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L70)

___

### ready

• `Private` **ready**: `boolean` = `false`

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:68](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L68)

___

### router

• `Private` **router**: [`TopicRouter`](purista_mqttbridge.TopicRouter.md)

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:71](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L71)

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

[mqttbridge/src/MqttEventBridge.ts:383](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L383)

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

[mqttbridge/src/MqttEventBridge.ts:130](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L130)

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

[mqttbridge/src/MqttEventBridge.ts:206](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L206)

___

### isHealthy

▸ **isHealthy**(): `Promise`\<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isHealthy](../interfaces/purista_core.EventBridge.md#ishealthy)

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:202](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L202)

___

### isReady

▸ **isReady**(): `Promise`\<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isReady](../interfaces/purista_core.EventBridge.md#isready)

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:198](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L198)

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

[mqttbridge/src/MqttEventBridge.ts:326](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L326)

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

[mqttbridge/src/MqttEventBridge.ts:355](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L355)

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

[mqttbridge/src/MqttEventBridge.ts:82](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L82)

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

[mqttbridge/src/MqttEventBridge.ts:349](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L349)

___

### unregisterSubscription

▸ **unregisterSubscription**(`_address`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterSubscription](../interfaces/purista_core.EventBridge.md#unregistersubscription)

#### Defined in

[mqttbridge/src/MqttEventBridge.ts:381](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L381)

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
