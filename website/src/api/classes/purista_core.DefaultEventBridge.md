[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / DefaultEventBridge

# Class: DefaultEventBridge

[@purista/core](../modules/purista_core.md).DefaultEventBridge

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

## Hierarchy

- [`EventBridge`](purista_core.EventBridge.md)

  ↳ **`DefaultEventBridge`**

## Table of contents

### Constructors

- [constructor](purista_core.DefaultEventBridge.md#constructor)

### Properties

- [config](purista_core.DefaultEventBridge.md#config)
- [logger](purista_core.DefaultEventBridge.md#logger)
- [pendingInvocations](purista_core.DefaultEventBridge.md#pendinginvocations)
- [readStream](purista_core.DefaultEventBridge.md#readstream)
- [serviceFunctions](purista_core.DefaultEventBridge.md#servicefunctions)
- [subscriptions](purista_core.DefaultEventBridge.md#subscriptions)
- [traceProvider](purista_core.DefaultEventBridge.md#traceprovider)
- [writeStream](purista_core.DefaultEventBridge.md#writestream)

### Accessors

- [defaultCommandTimeout](purista_core.DefaultEventBridge.md#defaultcommandtimeout)
- [instanceId](purista_core.DefaultEventBridge.md#instanceid)

### Methods

- [emit](purista_core.DefaultEventBridge.md#emit)
- [emitMessage](purista_core.DefaultEventBridge.md#emitmessage)
- [getTracer](purista_core.DefaultEventBridge.md#gettracer)
- [invoke](purista_core.DefaultEventBridge.md#invoke)
- [off](purista_core.DefaultEventBridge.md#off)
- [on](purista_core.DefaultEventBridge.md#on)
- [registerServiceFunction](purista_core.DefaultEventBridge.md#registerservicefunction)
- [registerSubscription](purista_core.DefaultEventBridge.md#registersubscription)
- [start](purista_core.DefaultEventBridge.md#start)
- [startActiveSpan](purista_core.DefaultEventBridge.md#startactivespan)
- [unregisterServiceFunction](purista_core.DefaultEventBridge.md#unregisterservicefunction)
- [unregisterSubscription](purista_core.DefaultEventBridge.md#unregistersubscription)
- [wrapInSpan](purista_core.DefaultEventBridge.md#wrapinspan)

## Constructors

### constructor

• **new DefaultEventBridge**(`baseLogger`, `conf?`, `spanProcessor?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](purista_core.Logger.md) |
| `conf` | [`EventBridgeConfig`](../modules/purista_core.md#eventbridgeconfig) |
| `spanProcessor?` | `SpanProcessor` |

#### Overrides

[EventBridge](purista_core.EventBridge.md).[constructor](purista_core.EventBridge.md#constructor)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:77](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L77)

## Properties

### config

• `Protected` **config**: [`EventBridgeEnsuredDefaults`](../modules/purista_core.md#eventbridgeensureddefaults)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:57](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L57)

___

### logger

• `Protected` **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:56](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L56)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, [`PendigInvocation`](../modules/purista_core.md#pendiginvocation)\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:71](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L71)

___

### readStream

• `Protected` **readStream**: `Readable`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:59](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L59)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`<`string`, (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `Promise`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse) \| [`CommandSuccessResponse`](../modules/purista_core.md#commandsuccessresponse)<`unknown`\>\>\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:66](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L66)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionStorageEntry`](../modules/purista_core.md#subscriptionstorageentry)\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:73](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L73)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:75](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L75)

___

### writeStream

• `Protected` **writeStream**: `Writable`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:58](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L58)

## Accessors

### defaultCommandTimeout

• `get` **defaultCommandTimeout**(): `number`

Get default command time out.
It is the maximum time a command should be responded.

#### Returns

`number`

#### Overrides

EventBridge.defaultCommandTimeout

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:268](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L268)

___

### instanceId

• `get` **instanceId**(): `string`

Get instance id.
The id of current event bridge instance.

#### Returns

`string`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:276](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L276)

## Methods

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | [`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)[`K`] |

#### Returns

`void`

#### Inherited from

[EventBridge](purista_core.EventBridge.md).[emit](purista_core.EventBridge.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### emitMessage

▸ **emitMessage**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a new message to event bridge to be delivered to receiver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | EBMessage |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[emitMessage](purista_core.EventBridge.md#emitmessage)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:317](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L317)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:112](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L112)

___

### invoke

▸ **invoke**<`T`\>(`input`, `_contentType?`, `_contentEncoding?`, `commandTimeout?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `input` | `Omit`<[`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | `undefined` |
| `_contentType` | `string` | `'application/json'` |
| `_contentEncoding` | `string` | `'utf-8'` |
| `commandTimeout` | `number` | `undefined` |

#### Returns

`Promise`<`T`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[invoke](purista_core.EventBridge.md#invoke)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:360](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L360)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridge](purista_core.EventBridge.md).[off](purista_core.EventBridge.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L20)

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridge](purista_core.EventBridge.md).[on](purista_core.EventBridge.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerServiceFunction

▸ **registerServiceFunction**(`address`, `cb`): `Promise`<`string`\>

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The service function address |
| `cb` | (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `Promise`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse) \| [`CommandSuccessResponse`](../modules/purista_core.md#commandsuccessresponse)<`unknown`\>\> | the function to call if a matching command message arrives |

#### Returns

`Promise`<`string`\>

the id of command function queue

#### Overrides

[EventBridge](purista_core.EventBridge.md).[registerServiceFunction](purista_core.EventBridge.md#registerservicefunction)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:286](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L286)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) |
| `cb` | (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage)) => `Promise`<`void`\> |

#### Returns

`Promise`<`string`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[registerSubscription](purista_core.EventBridge.md#registersubscription)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:300](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L300)

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[start](purista_core.EventBridge.md#start)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:172](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L172)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context?`, `fn`): `Promise`<`F`\>

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `opts` | `SpanOptions` | `undefined` |
| `context` | `undefined` \| `Context` | `undefined` |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | `undefined` |

#### Returns

`Promise`<`F`\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:116](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L116)

___

### unregisterServiceFunction

▸ **unregisterServiceFunction**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[unregisterServiceFunction](purista_core.EventBridge.md#unregisterservicefunction)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:295](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L295)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[unregisterSubscription](purista_core.EventBridge.md#unregistersubscription)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:307](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L307)

___

### wrapInSpan

▸ **wrapInSpan**<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`<`F`\>

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `opts` | `SpanOptions` |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> |
| `context?` | `Context` |

#### Returns

`Promise`<`F`\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:150](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L150)
