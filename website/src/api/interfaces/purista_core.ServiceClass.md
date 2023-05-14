[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ServiceClass

# Interface: ServiceClass<ConfigType\>

[@purista/core](../modules/purista_core.md).ServiceClass

The ServiceClass interface

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

## Implemented by

- [`Service`](../classes/purista_core.Service.md)
- [`Service`](../classes/purista_core.Service.md)

## Table of contents

### Properties

- [config](purista_core.ServiceClass.md#config)

### Methods

- [destroy](purista_core.ServiceClass.md#destroy)
- [getTracer](purista_core.ServiceClass.md#gettracer)
- [registerCommand](purista_core.ServiceClass.md#registercommand)
- [registerSubscription](purista_core.ServiceClass.md#registersubscription)
- [start](purista_core.ServiceClass.md#start)
- [startActiveSpan](purista_core.ServiceClass.md#startactivespan)
- [wrapInSpan](purista_core.ServiceClass.md#wrapinspan)

## Properties

### config

• **config**: `ConfigType`

#### Defined in

[core/types/ServiceClass.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L12)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Stop and destroy the current service

#### Returns

`Promise`<`void`\>

#### Defined in

[core/types/ServiceClass.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L17)

___

### getTracer

▸ **getTracer**(): `Tracer`

get the opentelemetry tracer of the service

#### Returns

`Tracer`

#### Defined in

[core/types/ServiceClass.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L54)

___

### registerCommand

▸ **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Registers a new command for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition) | the service command definition |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/types/ServiceClass.ts:60](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L60)

___

### registerSubscription

▸ **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

Registers a new subscription for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition) | the subscription definition |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/types/ServiceClass.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L66)

___

### start

▸ **start**(): `Promise`<`void`\>

Start the service

#### Returns

`Promise`<`void`\>

#### Defined in

[core/types/ServiceClass.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L22)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`<`F`\>

Start a new active opentelemetry span with given options.
A active span will be below the current span in hierarchy

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the span |
| `opts` | `SpanOptions` | the additional span options |
| `context` | `undefined` \| `Context` | the span context |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | the function to be wrapped into the span |

#### Returns

`Promise`<`F`\>

#### Defined in

[core/types/ServiceClass.ts:44](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L44)

___

### wrapInSpan

▸ **wrapInSpan**<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`<`F`\>

Wrap the given function in a opententelemetry span.
The span will be on same hierarchy level as the current span.

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the span |
| `opts` | `SpanOptions` | the additional span options |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | the function to be wrapped in span |
| `context?` | `Context` | the span context |

#### Returns

`Promise`<`F`\>

#### Defined in

[core/types/ServiceClass.ts:33](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L33)
