[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeBaseClass

# Class: EventBridgeBaseClass\<ConfigType\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L37)

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L80)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; spanProcessor?: SpanProcessor \} & ConfigType)\[K\] \}

#### Returns

`EventBridgeBaseClass`\<`ConfigType`\>

## Properties

### capabilities

> **capabilities**: [`EventBridgeCapabilities`](../type-aliases/EventBridgeCapabilities.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L44)

***

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<[`EventBridgeConfig`](../type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L41)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L78)

***

### inFlightExecutions

> `protected` `readonly` **inFlightExecutions**: [`InFlightExecutionTracker`](InFlightExecutionTracker.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L79)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L76)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L38)

***

### name

> **name**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L43)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L39)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:201](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L201)

#### Returns

`Promise`\<`void`\>

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:215](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L215)

#### Returns

`number`

***

### getInFlightExecutionCounts()

> **getInFlightExecutionCounts**(): `InFlightExecutionCounts`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:219](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L219)

#### Returns

`InFlightExecutionCounts`

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:116](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L116)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`_input`, `_ttl?`): `Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:223](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L223)

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:230](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L230)

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

### runInFlight()

> **runInFlight**\<`T`\>(`fn`, `kind?`): `Promise`\<`T`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:204](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L204)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

##### kind?

`"stream"` | `"command"` | `"subscription"` | `"generic"`

#### Returns

`Promise`\<`T`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:202](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L202)

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:128](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L128)

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

optional context

`Context` | `undefined`

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn

***

### unregisterStream()

> **unregisterStream**(`_address`): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:239](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L239)

#### Parameters

##### \_address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

***

### waitForInFlightDrain()

> **waitForInFlightDrain**(`timeoutMs?`): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:211](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L211)

#### Parameters

##### timeoutMs?

`number` = `...`

#### Returns

`Promise`\<`boolean`\>

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:178](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L178)

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
