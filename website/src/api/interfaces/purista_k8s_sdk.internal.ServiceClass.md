[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / ServiceClass

# Interface: ServiceClass<ConfigType\>

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).ServiceClass

The ServiceClass interface

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

## Implemented by

- [`Service`](../classes/purista_k8s_sdk.internal.Service.md)

## Table of contents

### Properties

- [config](purista_k8s_sdk.internal.ServiceClass.md#config)

### Methods

- [destroy](purista_k8s_sdk.internal.ServiceClass.md#destroy)
- [getTracer](purista_k8s_sdk.internal.ServiceClass.md#gettracer)
- [registerCommand](purista_k8s_sdk.internal.ServiceClass.md#registercommand)
- [registerSubscription](purista_k8s_sdk.internal.ServiceClass.md#registersubscription)
- [start](purista_k8s_sdk.internal.ServiceClass.md#start)
- [startActiveSpan](purista_k8s_sdk.internal.ServiceClass.md#startactivespan)
- [wrapInSpan](purista_k8s_sdk.internal.ServiceClass.md#wrapinspan)

## Properties

### config

• **config**: `ConfigType`

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:10

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Stop and destroy the current service

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:14

___

### getTracer

▸ **getTracer**(): `Tracer`

get the opentelemetry tracer of the service

#### Returns

`Tracer`

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:42

___

### registerCommand

▸ **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Registers a new command for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_k8s_sdk.internal.md#commanddefinition) | the service command definition |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:47

___

### registerSubscription

▸ **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

Registers a new subscription for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_k8s_sdk.internal.md#subscriptiondefinition) | the subscription definition |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:52

___

### start

▸ **start**(): `Promise`<`void`\>

Start the service

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:18

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

packages/core/lib/core/types/ServiceClass.d.ts:38

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

packages/core/lib/core/types/ServiceClass.d.ts:28
