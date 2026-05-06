[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceClass

# Interface: ServiceClass\<S\>

Defined in: [core/types/ServiceClass.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L18)

The ServiceClass interface

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Properties

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/types/ServiceClass.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L19)

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [core/types/ServiceClass.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L20)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L25)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

***

### getContextFunctions()

> **getContextFunctions**(`logger`): [`ContextBase`](../type-aliases/ContextBase.md)

Defined in: [core/types/ServiceClass.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L83)

#### Parameters

##### logger

[`Logger`](../classes/Logger.md)

#### Returns

[`ContextBase`](../type-aliases/ContextBase.md)

***

### getInFlightDiagnostics()

> **getInFlightDiagnostics**(): [`InFlightDiagnostics`](../type-aliases/InFlightDiagnostics.md)

Defined in: [core/types/ServiceClass.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L85)

#### Returns

[`InFlightDiagnostics`](../type-aliases/InFlightDiagnostics.md)

***

### getPausedSubscriptionConsumerState()

> **getPausedSubscriptionConsumerState**(): [`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

Defined in: [core/types/ServiceClass.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L89)

#### Returns

[`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

***

### getQueueWorkerPauseState()

> **getQueueWorkerPauseState**(): [`QueueWorkerPauseStateByQueue`](../type-aliases/QueueWorkerPauseStateByQueue.md)

Defined in: [core/types/ServiceClass.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L86)

#### Returns

[`QueueWorkerPauseStateByQueue`](../type-aliases/QueueWorkerPauseStateByQueue.md)

***

### getServiceHealth()

> **getServiceHealth**(): `Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

Defined in: [core/types/ServiceClass.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L84)

#### Returns

`Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/types/ServiceClass.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L62)

get the opentelemetry tracer of the service

#### Returns

`Tracer`

***

### pauseQueueWorkers()

> **pauseQueueWorkers**(`queueName`, `reason?`): `void`

Defined in: [core/types/ServiceClass.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L87)

#### Parameters

##### queueName

`string`

##### reason?

`string`

#### Returns

`void`

***

### resumeQueueWorkers()

> **resumeQueueWorkers**(`queueName`): `void`

Defined in: [core/types/ServiceClass.ts:88](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L88)

#### Parameters

##### queueName

`string`

#### Returns

`void`

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L90)

#### Parameters

##### registrationKey

`string`

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L30)

Start the service

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/types/ServiceClass.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L52)

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

Defined in: [core/types/ServiceClass.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L41)

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
