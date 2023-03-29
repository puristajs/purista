[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / [internal](../modules/purista_core.internal.md) / ServiceBaseClass

# Class: ServiceBaseClass

[@purista/core](../modules/purista_core.md).[internal](../modules/purista_core.internal.md).ServiceBaseClass

Class which contains basic functions that are not directly related to

- handling of messages
- handling of commands
- handling of subscriptions

## Hierarchy

- [`GenericEventEmitter`](purista_core.GenericEventEmitter.md)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\>

  ↳ **`ServiceBaseClass`**

  ↳↳ [`Service`](purista_core.Service.md)

## Table of contents

### Constructors

- [constructor](purista_core.internal.ServiceBaseClass.md#constructor)

### Properties

- [configStore](purista_core.internal.ServiceBaseClass.md#configstore)
- [eventBridge](purista_core.internal.ServiceBaseClass.md#eventbridge)
- [info](purista_core.internal.ServiceBaseClass.md#info)
- [logger](purista_core.internal.ServiceBaseClass.md#logger)
- [secretStore](purista_core.internal.ServiceBaseClass.md#secretstore)
- [spanProcessor](purista_core.internal.ServiceBaseClass.md#spanprocessor)
- [stateStore](purista_core.internal.ServiceBaseClass.md#statestore)
- [traceProvider](purista_core.internal.ServiceBaseClass.md#traceprovider)

### Accessors

- [serviceInfo](purista_core.internal.ServiceBaseClass.md#serviceinfo)

### Methods

- [destroy](purista_core.internal.ServiceBaseClass.md#destroy)
- [emit](purista_core.internal.ServiceBaseClass.md#emit)
- [getTracer](purista_core.internal.ServiceBaseClass.md#gettracer)
- [off](purista_core.internal.ServiceBaseClass.md#off)
- [on](purista_core.internal.ServiceBaseClass.md#on)
- [removeAllListeners](purista_core.internal.ServiceBaseClass.md#removealllisteners)
- [startActiveSpan](purista_core.internal.ServiceBaseClass.md#startactivespan)
- [wrapInSpan](purista_core.internal.ServiceBaseClass.md#wrapinspan)

## Constructors

### constructor

• **new ServiceBaseClass**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.configStore` | [`ConfigStore`](../interfaces/purista_core.ConfigStore.md) |
| `options.eventBridge` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) |
| `options.info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |
| `options.logger` | [`Logger`](purista_core.Logger.md) |
| `options.secretStore` | [`SecretStore`](../interfaces/purista_core.SecretStore.md) |
| `options.spanProcessor?` | `SpanProcessor` |
| `options.stateStore` | [`StateStore`](../interfaces/purista_core.StateStore.md) |

#### Overrides

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[constructor](purista_core.GenericEventEmitter.md#constructor)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:38](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L38)

## Properties

### configStore

• **configStore**: [`ConfigStore`](../interfaces/purista_core.ConfigStore.md)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:35](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L35)

___

### eventBridge

• **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:26](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L26)

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L24)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:28](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L28)

___

### secretStore

• **secretStore**: [`SecretStore`](../interfaces/purista_core.SecretStore.md)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:34](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L34)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:30](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L30)

___

### stateStore

• **stateStore**: [`StateStore`](../interfaces/purista_core.StateStore.md)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:36](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L36)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:32](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L32)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:94](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L94)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:191](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L191)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | [`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[emit](purista_core.GenericEventEmitter.md#emit)

#### Defined in

[packages/core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L24)

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

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:103](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L103)

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

[packages/core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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

[packages/core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[removeAllListeners](purista_core.GenericEventEmitter.md#removealllisteners)

#### Defined in

[packages/core/src/core/types/GenericEventEmitter.ts:28](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L28)

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

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:118](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L118)

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

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:168](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L168)
