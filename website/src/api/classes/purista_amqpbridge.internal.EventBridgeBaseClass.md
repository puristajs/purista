[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / EventBridgeBaseClass

# Class: EventBridgeBaseClass<ConfigType\>

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).EventBridgeBaseClass

The base class to be extended by event bridge implementations

## Type parameters

| Name |
| :------ |
| `ConfigType` |

## Hierarchy

- [`GenericEventEmitter`](purista_amqpbridge.internal.GenericEventEmitter.md)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\>

  ↳ **`EventBridgeBaseClass`**

  ↳↳ [`AmqpBridge`](purista_amqpbridge.AmqpBridge.md)

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.internal.EventBridgeBaseClass.md#constructor)

### Properties

- [config](purista_amqpbridge.internal.EventBridgeBaseClass.md#config)
- [defaultCommandTimeout](purista_amqpbridge.internal.EventBridgeBaseClass.md#defaultcommandtimeout)
- [instanceId](purista_amqpbridge.internal.EventBridgeBaseClass.md#instanceid)
- [logger](purista_amqpbridge.internal.EventBridgeBaseClass.md#logger)
- [name](purista_amqpbridge.internal.EventBridgeBaseClass.md#name)
- [traceProvider](purista_amqpbridge.internal.EventBridgeBaseClass.md#traceprovider)

### Methods

- [destroy](purista_amqpbridge.internal.EventBridgeBaseClass.md#destroy)
- [emit](purista_amqpbridge.internal.EventBridgeBaseClass.md#emit)
- [getTracer](purista_amqpbridge.internal.EventBridgeBaseClass.md#gettracer)
- [off](purista_amqpbridge.internal.EventBridgeBaseClass.md#off)
- [on](purista_amqpbridge.internal.EventBridgeBaseClass.md#on)
- [removeAllListeners](purista_amqpbridge.internal.EventBridgeBaseClass.md#removealllisteners)
- [start](purista_amqpbridge.internal.EventBridgeBaseClass.md#start)
- [startActiveSpan](purista_amqpbridge.internal.EventBridgeBaseClass.md#startactivespan)
- [wrapInSpan](purista_amqpbridge.internal.EventBridgeBaseClass.md#wrapinspan)

## Constructors

### constructor

• **new EventBridgeBaseClass**<`ConfigType`\>(`name`, `config`)

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | [`EventBridgeConfig`](../modules/purista_amqpbridge.internal.md#eventbridgeconfig)<[`Complete`](../modules/purista_amqpbridge.internal.md#complete)<`ConfigType`\>\> |

#### Overrides

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[constructor](purista_amqpbridge.internal.GenericEventEmitter.md#constructor)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:17

## Properties

### config

• **config**: [`Complete`](../modules/purista_amqpbridge.internal.md#complete)<[`EventBridgeConfig`](../modules/purista_amqpbridge.internal.md#eventbridgeconfig)<[`Complete`](../modules/purista_amqpbridge.internal.md#complete)<`ConfigType`\>\>\>

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### instanceId

• **instanceId**: `string`

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### logger

• **logger**: [`Logger`](purista_amqpbridge.internal.Logger.md)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:11

___

### name

• **name**: `string`

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:49

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | [`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`] |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[emit](purista_amqpbridge.internal.GenericEventEmitter.md#emit)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:13

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[off](purista_amqpbridge.internal.GenericEventEmitter.md#off)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[on](purista_amqpbridge.internal.GenericEventEmitter.md#on)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:11

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[removeAllListeners](purista_amqpbridge.internal.GenericEventEmitter.md#removealllisteners)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:14

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:50

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

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:32

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

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:48
