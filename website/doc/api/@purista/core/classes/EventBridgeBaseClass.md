[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeBaseClass

# Class: EventBridgeBaseClass\<ConfigType\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L23)

The base class to be extended by event bridge implementations

## Extends

- [`GenericEventEmitter`](GenericEventEmitter.md)\<[`EventBridgeEvents`](../type-aliases/EventBridgeEvents.md)\>

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L34)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; spanProcessor?: SpanProcessor \} & ConfigType)\[K\] \}

#### Returns

`EventBridgeBaseClass`\<`ConfigType`\>

#### Overrides

[`GenericEventEmitter`](GenericEventEmitter.md).[`constructor`](GenericEventEmitter.md#constructor)

## Properties

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<[`EventBridgeConfig`](../type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L27)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L33)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L31)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L24)

***

### name

> **name**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L29)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L25)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:156](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L156)

#### Returns

`Promise`\<`void`\>

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: [core/types/GenericEventEmitter.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L27)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### parameter?

`object`\[`K`\]

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`emit`](GenericEventEmitter.md#emit)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L71)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L23)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`off`](GenericEventEmitter.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L19)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{\[`key`: `` `adapter-${string}` ``\]: `unknown`;
\[`key`: `` `custom-${string}` ``\]: `unknown`; `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`on`](GenericEventEmitter.md#on)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/types/GenericEventEmitter.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L31)

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`removeAllListeners`](GenericEventEmitter.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:157](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L157)

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L83)

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

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:133](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L133)

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
