[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultEventBridge

# Class: DefaultEventBridge

[@purista/core](../modules/purista_core.md).DefaultEventBridge

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

**`Example`**

```typescript
import { DefaultEventBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// add your services
```

## Hierarchy

- [`EventBridgeBaseClass`](purista_core.EventBridgeBaseClass.md)\<[`DefaultEventBridgeConfig`](../modules/purista_core.md#defaulteventbridgeconfig)\>

  ↳ **`DefaultEventBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

## Table of contents

### Constructors

- [constructor](purista_core.DefaultEventBridge.md#constructor)

### Properties

- [config](purista_core.DefaultEventBridge.md#config)
- [defaultCommandTimeout](purista_core.DefaultEventBridge.md#defaultcommandtimeout)
- [hasStarted](purista_core.DefaultEventBridge.md#hasstarted)
- [healthy](purista_core.DefaultEventBridge.md#healthy)
- [instanceId](purista_core.DefaultEventBridge.md#instanceid)
- [logger](purista_core.DefaultEventBridge.md#logger)
- [name](purista_core.DefaultEventBridge.md#name)
- [pendingInvocations](purista_core.DefaultEventBridge.md#pendinginvocations)
- [readStream](purista_core.DefaultEventBridge.md#readstream)
- [runningSubscriptionCount](purista_core.DefaultEventBridge.md#runningsubscriptioncount)
- [serviceFunctions](purista_core.DefaultEventBridge.md#servicefunctions)
- [subscriptions](purista_core.DefaultEventBridge.md#subscriptions)
- [traceProvider](purista_core.DefaultEventBridge.md#traceprovider)
- [writeStream](purista_core.DefaultEventBridge.md#writestream)

### Methods

- [destroy](purista_core.DefaultEventBridge.md#destroy)
- [emit](purista_core.DefaultEventBridge.md#emit)
- [emitMessage](purista_core.DefaultEventBridge.md#emitmessage)
- [getTracer](purista_core.DefaultEventBridge.md#gettracer)
- [invoke](purista_core.DefaultEventBridge.md#invoke)
- [isHealthy](purista_core.DefaultEventBridge.md#ishealthy)
- [isReady](purista_core.DefaultEventBridge.md#isready)
- [off](purista_core.DefaultEventBridge.md#off)
- [on](purista_core.DefaultEventBridge.md#on)
- [registerCommand](purista_core.DefaultEventBridge.md#registercommand)
- [registerSubscription](purista_core.DefaultEventBridge.md#registersubscription)
- [removeAllListeners](purista_core.DefaultEventBridge.md#removealllisteners)
- [start](purista_core.DefaultEventBridge.md#start)
- [startActiveSpan](purista_core.DefaultEventBridge.md#startactivespan)
- [unregisterCommand](purista_core.DefaultEventBridge.md#unregistercommand)
- [unregisterSubscription](purista_core.DefaultEventBridge.md#unregistersubscription)
- [wrapInSpan](purista_core.DefaultEventBridge.md#wrapinspan)

## Constructors

### constructor

• **new DefaultEventBridge**(`config?`): [`DefaultEventBridge`](purista_core.DefaultEventBridge.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.emitMessagesAsEventBridgeEvents?` | `boolean` | Emit messages which have an event name set as javascript events on the event bridge instance |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | If no logger instance is given, use this log level |
| `config.logWarnOnMessagesWithoutReceiver?` | `boolean` | Log warnings on messages which are emitted, but could not delivered to at least one receiver |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |

#### Returns

[`DefaultEventBridge`](purista_core.DefaultEventBridge.md)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[constructor](purista_core.EventBridgeBaseClass.md#constructor)

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:85](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L85)

## Properties

### config

• **config**: [`Complete`](../modules/purista_core.md#complete)\<\{ `defaultCommandTimeout?`: `number` ; `emitMessagesAsEventBridgeEvents?`: `boolean` ; `instanceId?`: `string` ; `logLevel?`: [`LogLevelName`](../modules/purista_core.md#loglevelname) ; `logWarnOnMessagesWithoutReceiver?`: `boolean` ; `logger?`: [`Logger`](purista_core.Logger.md) ; `spanProcessor?`: `SpanProcessor`  }\>

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[config](purista_core.EventBridgeBaseClass.md#config)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:23](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L23)

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[defaultCommandTimeout](../interfaces/purista_core.EventBridge.md#defaultcommandtimeout)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[defaultCommandTimeout](purista_core.EventBridgeBaseClass.md#defaultcommandtimeout)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L29)

___

### hasStarted

• `Protected` **hasStarted**: `boolean` = `false`

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L82)

___

### healthy

• `Protected` **healthy**: `boolean` = `false`

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:83](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L83)

___

### instanceId

• **instanceId**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[instanceId](../interfaces/purista_core.EventBridge.md#instanceid)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[instanceId](purista_core.EventBridgeBaseClass.md#instanceid)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L27)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[logger](purista_core.EventBridgeBaseClass.md#logger)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L20)

___

### name

• **name**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[name](../interfaces/purista_core.EventBridge.md#name)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[name](purista_core.EventBridgeBaseClass.md#name)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L25)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../modules/purista_core.md#pendiginvocation)\>

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:77](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L77)

___

### readStream

• `Protected` **readStream**: `Readable`

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:65](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L65)

___

### runningSubscriptionCount

• `Protected` **runningSubscriptionCount**: `number` = `0`

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:78](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L78)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`\<`string`, (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  } \| \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\>\>

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L72)

___

### subscriptions

• `Protected` **subscriptions**: `Map`\<`string`, [`SubscriptionStorageEntry`](../modules/purista_core.md#subscriptionstorageentry)\>

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:80](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L80)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[traceProvider](purista_core.EventBridgeBaseClass.md#traceprovider)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L21)

___

### writeStream

• `Protected` **writeStream**: `Writable`

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:64](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L64)

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

[DefaultEventBridge/DefaultEventBridge.impl.ts:385](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L385)

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

[core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### emitMessage

▸ **emitMessage**(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a new message to event bridge to be delivered to receiver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`\<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"correlationId"`` \| ``"id"`` \| ``"timestamp"``\> | EBMessage |

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[emitMessage](../interfaces/purista_core.EventBridge.md#emitmessage)

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:287](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L287)

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

[core/EventBridge/EventBridgeBaseClass.impl.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L70)

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
| `input` | `Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"messageType"`` \| ``"correlationId"`` \| ``"id"`` \| ``"timestamp"``\> | a partial command message |
| `commandTimeout` | `number` | the time to live (timeout) of the invocation |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[invoke](../interfaces/purista_core.EventBridge.md#invoke)

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:328](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L328)

___

### isHealthy

▸ **isHealthy**(): `Promise`\<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isHealthy](../interfaces/purista_core.EventBridge.md#ishealthy)

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:98](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L98)

___

### isReady

▸ **isReady**(): `Promise`\<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isReady](../interfaces/purista_core.EventBridge.md#isready)

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:94](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L94)

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

[core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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

[core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`): `Promise`\<`string`\>

Register a service command and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The service function address |
| `cb` | (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  } \| \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> | the function to call if a matching command message arrives |
| `metadata` | [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase) | - |

#### Returns

`Promise`\<`string`\>

the id of command function queue

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerCommand](../interfaces/purista_core.EventBridge.md#registercommand)

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:242](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L242)

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

[DefaultEventBridge/DefaultEventBridge.impl.ts:267](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L267)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[removeAllListeners](purista_core.EventBridgeBaseClass.md#removealllisteners)

#### Defined in

[core/types/GenericEventEmitter.ts:28](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

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

[DefaultEventBridge/DefaultEventBridge.impl.ts:102](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L102)

___

### startActiveSpan

▸ **startActiveSpan**\<`F`\>(`name`, `opts`, `context?`, `fn`): `Promise`\<`F`\>

Start a child span for opentelemetry tracking

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | name of span |
| `opts` | `SpanOptions` | `undefined` | span options |
| `context` | `undefined` \| `Context` | `undefined` | optional context |
| `fn` | (`span`: `Span`) => `Promise`\<`F`\> | `undefined` | function to be executed within the span |

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[startActiveSpan](purista_core.EventBridgeBaseClass.md#startactivespan)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L82)

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

[DefaultEventBridge/DefaultEventBridge.impl.ts:262](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L262)

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

[DefaultEventBridge/DefaultEventBridge.impl.ts:277](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L277)

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

[core/EventBridge/EventBridgeBaseClass.impl.ts:132](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L132)
