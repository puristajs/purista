[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceClass

# Interface: ServiceClass\<S\>

Defined in: [packages/core/src/core/types/ServiceClass.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L13)

The ServiceClass interface

## Type Parameters

• **S** *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Properties

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [packages/core/src/core/types/ServiceClass.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L14)

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [packages/core/src/core/types/ServiceClass.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L15)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/ServiceClass.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L20)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [packages/core/src/core/types/ServiceClass.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L57)

get the opentelemetry tracer of the service

#### Returns

`Tracer`

***

### registerCommand()

> **registerCommand**(`commandDefinition`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/ServiceClass.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L63)

Registers a new command for the service

#### Parameters

##### commandDefinition

[`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>

the service command definition

#### Returns

`Promise`\<`void`\>

***

### registerSubscription()

> **registerSubscription**(`subscriptionDefinition`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/ServiceClass.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L71)

Registers a new subscription for the service

#### Parameters

##### subscriptionDefinition

[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>

the subscription definition

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/ServiceClass.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L25)

Start the service

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [packages/core/src/core/types/ServiceClass.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L47)

Start a new active opentelemetry span with given options.
A active span will be below the current span in hierarchy

#### Type Parameters

• **F**

#### Parameters

##### name

`string`

the name of the span

##### opts

`SpanOptions`

the additional span options

##### context

the span context

`undefined` | `Context`

##### fn

(`span`) => `Promise`\<`F`\>

the function to be wrapped into the span

#### Returns

`Promise`\<`F`\>

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context`?): `Promise`\<`F`\>

Defined in: [packages/core/src/core/types/ServiceClass.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L36)

Wrap the given function in a opententelemetry span.
The span will be on same hierarchy level as the current span.

#### Type Parameters

• **F**

#### Parameters

##### name

`string`

the name of the span

##### opts

`SpanOptions`

the additional span options

##### fn

(`span`) => `Promise`\<`F`\>

the function to be wrapped in span

##### context?

`Context`

the span context

#### Returns

`Promise`\<`F`\>
