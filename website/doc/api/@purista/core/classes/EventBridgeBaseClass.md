[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeBaseClass

# Class: EventBridgeBaseClass\<ConfigType\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L44)

The base class to be extended by event bridge implementations

## Extended by

- [`DefaultEventBridge`](DefaultEventBridge.md)
- [`AmqpBridge`](../../amqpbridge/classes/AmqpBridge.md)
- [`HttpEventBridge`](../../base-http-bridge/classes/HttpEventBridge.md)
- [`MqttBridge`](../../mqttbridge/classes/MqttBridge.md)
- [`NatsBridge`](../../natsbridge/classes/NatsBridge.md)

## Type Parameters

### ConfigType

`ConfigType`

## Constructors

### Constructor

> **new EventBridgeBaseClass**\<`ConfigType`\>(`name`, `config`): `EventBridgeBaseClass`\<`ConfigType`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L91)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; metrics?: PuristaMetricsRuntimeOptions; metricsRecorder?: PuristaMetricsRecorderInterface; spanProcessor?: SpanProcessor \} & ConfigType)\[K\] \}

#### Returns

`EventBridgeBaseClass`\<`ConfigType`\>

## Properties

### capabilities

> **capabilities**: [`EventBridgeCapabilities`](../type-aliases/EventBridgeCapabilities.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L52)

***

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<[`EventBridgeConfig`](../type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L49)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L89)

***

### inFlightExecutions

> `protected` `readonly` **inFlightExecutions**: [`InFlightExecutionTracker`](InFlightExecutionTracker.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L90)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L87)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L45)

***

### metricsRecorder

> `protected` **metricsRecorder**: [`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L47)

***

### name

> **name**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L51)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L46)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:249](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L249)

#### Returns

`Promise`\<`void`\>

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:263](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L263)

#### Returns

`number`

***

### getInFlightExecutionCounts()

> **getInFlightExecutionCounts**(): [`InFlightExecutionCounts`](../type-aliases/InFlightExecutionCounts.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:267](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L267)

#### Returns

[`InFlightExecutionCounts`](../type-aliases/InFlightExecutionCounts.md)

***

### getPausedSubscriptionConsumers()

> **getPausedSubscriptionConsumers**(): [`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:271](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L271)

#### Returns

[`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:141](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L141)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`_input`, `_ttl?`): `Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:277](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L277)

#### Type Parameters

##### Chunk

`Chunk` = `unknown`

##### Final

`Final` = `unknown`

#### Parameters

##### \_input

`Omit`\<[`StreamOpenRequest`](../type-aliases/StreamOpenRequest.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

##### \_ttl?

`number`

#### Returns

`Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

***

### registerStream()

> **registerStream**(`_address`, `_cb`, `_metadata`, `_eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:284](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L284)

#### Parameters

##### \_address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

##### \_cb

(`message`) => `Promise`\<`void`\>

##### \_metadata

[`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md)

##### \_eventBridgeConfig

[`DefinitionEventBridgeConfig`](../type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`_registrationKey`): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:275](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L275)

#### Parameters

##### \_registrationKey

`string`

#### Returns

`Promise`\<`void`\>

***

### runInFlight()

> **runInFlight**\<`T`\>(`fn`, `kind?`): `Promise`\<`T`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:252](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L252)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

##### kind?

`"stream"` \| `"command"` \| `"subscription"` \| `"generic"`

#### Returns

`Promise`\<`T`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:250](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L250)

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:153](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L153)

Start a child span for opentelemetry tracking

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

`Context` \| `undefined`

optional context

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn

***

### unregisterStream()

> **unregisterStream**(`_address`): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:293](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L293)

#### Parameters

##### \_address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

***

### waitForInFlightDrain()

> **waitForInFlightDrain**(`timeoutMs?`): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:259](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L259)

#### Parameters

##### timeoutMs?

`number` = `...`

#### Returns

`Promise`\<`boolean`\>

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:226](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L226)

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### fn

(`span`) => `Promise`\<`F`\>

function te be executed in the span

##### context?

`Context`

span context

#### Returns

`Promise`\<`F`\>

return value of fn
