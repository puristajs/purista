[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeBaseClass

# Class: EventBridgeBaseClass\<ConfigType\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L32)

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L62)

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L39)

***

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<[`EventBridgeConfig`](../type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L36)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L60)

***

### inFlightExecutions

> `protected` `readonly` **inFlightExecutions**: [`InFlightExecutionTracker`](InFlightExecutionTracker.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L61)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L58)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L33)

***

### name

> **name**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L38)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L34)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L183)

#### Returns

`Promise`\<`void`\>

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:194](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L194)

#### Returns

`number`

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:98](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L98)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`_input`, `_ttl?`): `Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:198](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L198)

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:205](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L205)

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

> **runInFlight**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:186](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L186)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:184](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L184)

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:110](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L110)

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:214](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L214)

#### Parameters

##### \_address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

***

### waitForInFlightDrain()

> **waitForInFlightDrain**(`timeoutMs?`): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:190](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L190)

#### Parameters

##### timeoutMs?

`number` = `...`

#### Returns

`Promise`\<`boolean`\>

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:160](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L160)

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
