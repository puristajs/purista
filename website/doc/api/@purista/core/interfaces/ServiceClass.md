[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceClass

# Interface: ServiceClass\<S\>

Defined in: [core/types/ServiceClass.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L13)

The ServiceClass interface

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Properties

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/types/ServiceClass.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L14)

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [core/types/ServiceClass.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L15)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L20)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

***

### getContextFunctions()

> **getContextFunctions**(`logger`): [`ContextBase`](../type-aliases/ContextBase.md)

Defined in: [core/types/ServiceClass.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L78)

#### Parameters

##### logger

[`Logger`](../classes/Logger.md)

#### Returns

[`ContextBase`](../type-aliases/ContextBase.md)

***

### getPausedSubscriptionConsumerState()

> **getPausedSubscriptionConsumerState**(): `Record`\<`string`, \{ `pausedAt`: `number`; `reason`: `string`; \}\>

Defined in: [core/types/ServiceClass.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L80)

#### Returns

`Record`\<`string`, \{ `pausedAt`: `number`; `reason`: `string`; \}\>

***

### getServiceHealth()

> **getServiceHealth**(): `Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

Defined in: [core/types/ServiceClass.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L79)

#### Returns

`Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/types/ServiceClass.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L57)

get the opentelemetry tracer of the service

#### Returns

`Tracer`

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L81)

#### Parameters

##### registrationKey

`string`

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L25)

Start the service

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/types/ServiceClass.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L47)

Start a new active opentelemetry span with given options.
A active span will be below the current span in hierarchy

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

the name of the span

##### opts

`SpanOptions`

the additional span options

##### context

the span context

`Context` | `undefined`

##### fn

(`span`) => `Promise`\<`F`\>

the function to be wrapped into the span

#### Returns

`Promise`\<`F`\>

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/types/ServiceClass.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L36)

Wrap the given function in an OpenTelemetry span.
The span will be on same hierarchy level as the current span.

#### Type Parameters

##### F

`F`

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
