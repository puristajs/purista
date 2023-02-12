[PURISTA API - v1.4.9](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / ServiceBaseClass

# Class: ServiceBaseClass

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).ServiceBaseClass

Class which contains basic functions that are not directly related to

- handling of messages
- handling of commands
- handling of subscriptions

## Hierarchy

- [`GenericEventEmitter`](purista_httpserver.internal.GenericEventEmitter.md)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\>

  ↳ **`ServiceBaseClass`**

  ↳↳ [`ServiceClass`](purista_httpserver.internal.ServiceClass.md)

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.ServiceBaseClass.md#constructor)

### Properties

- [eventBridge](purista_httpserver.internal.ServiceBaseClass.md#eventbridge)
- [info](purista_httpserver.internal.ServiceBaseClass.md#info)
- [serviceLogger](purista_httpserver.internal.ServiceBaseClass.md#servicelogger)
- [spanProcessor](purista_httpserver.internal.ServiceBaseClass.md#spanprocessor)
- [traceProvider](purista_httpserver.internal.ServiceBaseClass.md#traceprovider)

### Accessors

- [serviceInfo](purista_httpserver.internal.ServiceBaseClass.md#serviceinfo)

### Methods

- [destroy](purista_httpserver.internal.ServiceBaseClass.md#destroy)
- [emit](purista_httpserver.internal.ServiceBaseClass.md#emit)
- [getTracer](purista_httpserver.internal.ServiceBaseClass.md#gettracer)
- [off](purista_httpserver.internal.ServiceBaseClass.md#off)
- [on](purista_httpserver.internal.ServiceBaseClass.md#on)
- [startActiveSpan](purista_httpserver.internal.ServiceBaseClass.md#startactivespan)
- [wrapInSpan](purista_httpserver.internal.ServiceBaseClass.md#wrapinspan)

## Constructors

### constructor

• **new ServiceBaseClass**(`baseLogger`, `info`, `eventBridge`, `spanProcessor?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](purista_httpserver.internal.Logger.md) |
| `info` | [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](purista_httpserver.internal.EventBridge.md) |
| `spanProcessor?` | `SpanProcessor` |

#### Overrides

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[constructor](purista_httpserver.internal.GenericEventEmitter.md#constructor)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:18

## Properties

### eventBridge

• **eventBridge**: [`EventBridge`](purista_httpserver.internal.EventBridge.md)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:14

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:13

___

### serviceLogger

• **serviceLogger**: [`Logger`](purista_httpserver.internal.Logger.md)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:15

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:16

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:17

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:22

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:54

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | [`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[emit](purista_httpserver.internal.GenericEventEmitter.md#emit)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:13

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:28

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[off](purista_httpserver.internal.GenericEventEmitter.md#off)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[on](purista_httpserver.internal.GenericEventEmitter.md#on)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:11

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

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:37

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

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:53
