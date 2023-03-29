[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / ServiceBaseClass

# Class: ServiceBaseClass

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).ServiceBaseClass

Class which contains basic functions that are not directly related to

- handling of messages
- handling of commands
- handling of subscriptions

## Hierarchy

- [`GenericEventEmitter`](purista_k8s_sdk.internal.GenericEventEmitter.md)<[`ServiceEvents`](../modules/purista_k8s_sdk.internal.md#serviceevents)\>

  ↳ **`ServiceBaseClass`**

  ↳↳ [`Service`](purista_k8s_sdk.internal.Service.md)

## Table of contents

### Constructors

- [constructor](purista_k8s_sdk.internal.ServiceBaseClass.md#constructor)

### Properties

- [configStore](purista_k8s_sdk.internal.ServiceBaseClass.md#configstore)
- [eventBridge](purista_k8s_sdk.internal.ServiceBaseClass.md#eventbridge)
- [info](purista_k8s_sdk.internal.ServiceBaseClass.md#info)
- [logger](purista_k8s_sdk.internal.ServiceBaseClass.md#logger)
- [secretStore](purista_k8s_sdk.internal.ServiceBaseClass.md#secretstore)
- [spanProcessor](purista_k8s_sdk.internal.ServiceBaseClass.md#spanprocessor)
- [stateStore](purista_k8s_sdk.internal.ServiceBaseClass.md#statestore)
- [traceProvider](purista_k8s_sdk.internal.ServiceBaseClass.md#traceprovider)

### Accessors

- [serviceInfo](purista_k8s_sdk.internal.ServiceBaseClass.md#serviceinfo)

### Methods

- [destroy](purista_k8s_sdk.internal.ServiceBaseClass.md#destroy)
- [emit](purista_k8s_sdk.internal.ServiceBaseClass.md#emit)
- [getTracer](purista_k8s_sdk.internal.ServiceBaseClass.md#gettracer)
- [off](purista_k8s_sdk.internal.ServiceBaseClass.md#off)
- [on](purista_k8s_sdk.internal.ServiceBaseClass.md#on)
- [removeAllListeners](purista_k8s_sdk.internal.ServiceBaseClass.md#removealllisteners)
- [startActiveSpan](purista_k8s_sdk.internal.ServiceBaseClass.md#startactivespan)
- [wrapInSpan](purista_k8s_sdk.internal.ServiceBaseClass.md#wrapinspan)

## Constructors

### constructor

• **new ServiceBaseClass**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.configStore` | [`ConfigStore`](../interfaces/purista_k8s_sdk.internal.ConfigStore.md) |
| `options.eventBridge` | [`EventBridge`](../interfaces/purista_k8s_sdk.internal.EventBridge.md) |
| `options.info` | [`ServiceInfoType`](../modules/purista_k8s_sdk.internal.md#serviceinfotype) |
| `options.logger` | [`Logger`](purista_k8s_sdk.internal.Logger.md) |
| `options.secretStore` | [`SecretStore`](../interfaces/purista_k8s_sdk.internal.SecretStore.md) |
| `options.spanProcessor?` | `SpanProcessor` |
| `options.stateStore` | [`StateStore`](../interfaces/purista_k8s_sdk.internal.StateStore.md) |

#### Overrides

[GenericEventEmitter](purista_k8s_sdk.internal.GenericEventEmitter.md).[constructor](purista_k8s_sdk.internal.GenericEventEmitter.md#constructor)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:26

## Properties

### configStore

• **configStore**: [`ConfigStore`](../interfaces/purista_k8s_sdk.internal.ConfigStore.md)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:24

___

### eventBridge

• **eventBridge**: [`EventBridge`](../interfaces/purista_k8s_sdk.internal.EventBridge.md)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:19

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_k8s_sdk.internal.md#serviceinfotype)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:18

___

### logger

• **logger**: [`Logger`](purista_k8s_sdk.internal.Logger.md)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:20

___

### secretStore

• **secretStore**: [`SecretStore`](../interfaces/purista_k8s_sdk.internal.SecretStore.md)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:23

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:21

___

### stateStore

• **stateStore**: [`StateStore`](../interfaces/purista_k8s_sdk.internal.StateStore.md)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:25

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:22

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_k8s_sdk.internal.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_k8s_sdk.internal.md#serviceinfotype)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:38

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:70

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_k8s_sdk.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_k8s_sdk.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | [`ServiceEvents`](../modules/purista_k8s_sdk.internal.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_k8s_sdk.internal.GenericEventEmitter.md).[emit](purista_k8s_sdk.internal.GenericEventEmitter.md#emit)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:13

___

### getTracer

▸ **getTracer**(`name?`, `version?`): `Tracer`

Returns open telemetry tracer of this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | `string` |
| `version?` | `string` |

#### Returns

`Tracer`

Tracer

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:44

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_k8s_sdk.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_k8s_sdk.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_k8s_sdk.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_k8s_sdk.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_k8s_sdk.internal.GenericEventEmitter.md).[off](purista_k8s_sdk.internal.GenericEventEmitter.md#off)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_k8s_sdk.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_k8s_sdk.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_k8s_sdk.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_k8s_sdk.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_k8s_sdk.internal.GenericEventEmitter.md).[on](purista_k8s_sdk.internal.GenericEventEmitter.md#on)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:11

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_k8s_sdk.internal.GenericEventEmitter.md).[removeAllListeners](purista_k8s_sdk.internal.GenericEventEmitter.md#removealllisteners)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:14

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

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:53

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

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:69
