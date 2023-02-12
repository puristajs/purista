[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / [internal](../modules/purista_core.internal.md) / ServiceBaseClass

# Class: ServiceBaseClass

[@purista/core](../modules/purista_core.md).[internal](../modules/purista_core.internal.md).ServiceBaseClass

Class which contains basic functions that are not directly related to

- handling of messages
- handling of commands
- handling of subscriptions

## Hierarchy

- [`GenericEventEmitter`](purista_core.GenericEventEmitter.md)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\>

  ↳ **`ServiceBaseClass`**

  ↳↳ [`ServiceClass`](purista_core.ServiceClass.md)

## Table of contents

### Constructors

- [constructor](purista_core.internal.ServiceBaseClass.md#constructor)

### Properties

- [eventBridge](purista_core.internal.ServiceBaseClass.md#eventbridge)
- [info](purista_core.internal.ServiceBaseClass.md#info)
- [serviceLogger](purista_core.internal.ServiceBaseClass.md#servicelogger)
- [spanProcessor](purista_core.internal.ServiceBaseClass.md#spanprocessor)
- [traceProvider](purista_core.internal.ServiceBaseClass.md#traceprovider)

### Accessors

- [serviceInfo](purista_core.internal.ServiceBaseClass.md#serviceinfo)

### Methods

- [destroy](purista_core.internal.ServiceBaseClass.md#destroy)
- [emit](purista_core.internal.ServiceBaseClass.md#emit)
- [getTracer](purista_core.internal.ServiceBaseClass.md#gettracer)
- [off](purista_core.internal.ServiceBaseClass.md#off)
- [on](purista_core.internal.ServiceBaseClass.md#on)
- [startActiveSpan](purista_core.internal.ServiceBaseClass.md#startactivespan)
- [wrapInSpan](purista_core.internal.ServiceBaseClass.md#wrapinspan)

## Constructors

### constructor

• **new ServiceBaseClass**(`baseLogger`, `info`, `eventBridge`, `spanProcessor?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](purista_core.Logger.md) |
| `info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](purista_core.EventBridge.md) |
| `spanProcessor?` | `SpanProcessor` |

#### Overrides

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[constructor](purista_core.GenericEventEmitter.md#constructor)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:28](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L28)

## Properties

### eventBridge

• **eventBridge**: [`EventBridge`](purista_core.EventBridge.md)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L20)

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:18](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L18)

___

### serviceLogger

• **serviceLogger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:22](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L22)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L24)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:26](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L26)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:72](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L72)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:164](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L164)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | [`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[emit](purista_core.GenericEventEmitter.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:81](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L81)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[off](purista_core.GenericEventEmitter.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L20)

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[on](purista_core.GenericEventEmitter.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context?`, `fn`): `Promise`<`F`\>

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
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | `undefined` | function to be executed within the span |

#### Returns

`Promise`<`F`\>

return value of fn

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:93](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L93)

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

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:142](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L142)
