[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceClass

# Interface: ServiceClass\<S\>

Defined in: [core/types/ServiceClass.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L12)

The ServiceClass interface

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Properties

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/types/ServiceClass.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L13)

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [core/types/ServiceClass.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L14)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L19)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

***

### getContextFunctions()

> **getContextFunctions**(`logger`): [`ContextBase`](../type-aliases/ContextBase.md)

Defined in: [core/types/ServiceClass.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L77)

Registers a new subscription for the service

#### Parameters

##### logger

[`Logger`](../classes/Logger.md)

#### Returns

[`ContextBase`](../type-aliases/ContextBase.md)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/types/ServiceClass.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L56)

get the opentelemetry tracer of the service

#### Returns

`Tracer`

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L24)

Start the service

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/types/ServiceClass.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L46)

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

Defined in: [core/types/ServiceClass.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L35)

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
