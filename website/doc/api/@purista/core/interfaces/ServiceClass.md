[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceClass

# Interface: ServiceClass\<S\>

Defined in: [core/types/ServiceClass.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L18)

The ServiceClass interface

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`any`, `any`, `any`\> = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`any`, `any`, `any`\>

## Properties

### \_\_serviceClassTypes?

> `readonly` `optional` **\_\_serviceClassTypes?**: `S`

Defined in: [core/types/ServiceClass.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L24)

Type-only anchor used to preserve cascading service builder types.

This property is never read at runtime.

***

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/types/ServiceClass.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L26)

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [core/types/ServiceClass.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L27)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L32)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

***

### getContextFunctions()

> **getContextFunctions**(`logger`): [`ContextBase`](../type-aliases/ContextBase.md)\<`S`\[`"Metrics"`\]\>

Defined in: [core/types/ServiceClass.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L90)

#### Parameters

##### logger

[`Logger`](../classes/Logger.md)

#### Returns

[`ContextBase`](../type-aliases/ContextBase.md)\<`S`\[`"Metrics"`\]\>

***

### getInFlightDiagnostics()

> **getInFlightDiagnostics**(): [`InFlightDiagnostics`](../type-aliases/InFlightDiagnostics.md)

Defined in: [core/types/ServiceClass.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L92)

#### Returns

[`InFlightDiagnostics`](../type-aliases/InFlightDiagnostics.md)

***

### getPausedSubscriptionConsumerState()

> **getPausedSubscriptionConsumerState**(): [`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

Defined in: [core/types/ServiceClass.ts:96](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L96)

#### Returns

[`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

***

### getQueueWorkerPauseState()

> **getQueueWorkerPauseState**(): [`QueueWorkerPauseStateByQueue`](../type-aliases/QueueWorkerPauseStateByQueue.md)

Defined in: [core/types/ServiceClass.ts:93](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L93)

#### Returns

[`QueueWorkerPauseStateByQueue`](../type-aliases/QueueWorkerPauseStateByQueue.md)

***

### getServiceHealth()

> **getServiceHealth**(): `Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

Defined in: [core/types/ServiceClass.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L91)

#### Returns

`Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/types/ServiceClass.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L69)

get the opentelemetry tracer of the service

#### Returns

`Tracer`

***

### pauseQueueWorkers()

> **pauseQueueWorkers**(`queueName`, `reason?`): `void`

Defined in: [core/types/ServiceClass.ts:94](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L94)

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

Defined in: [core/types/ServiceClass.ts:95](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L95)

#### Parameters

##### queueName

`string`

#### Returns

`void`

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:97](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L97)

#### Parameters

##### registrationKey

`string`

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/types/ServiceClass.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L37)

Start the service

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/types/ServiceClass.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L59)

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

`Context` \| `undefined`

the span context

##### fn

(`span`) => `Promise`\<`F`\>

the function to be wrapped into the span

#### Returns

`Promise`\<`F`\>

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/types/ServiceClass.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L48)

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
