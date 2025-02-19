[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeBaseClass

# Class: EventBridgeBaseClass\<ConfigType\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L19)

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

• **ConfigType**

## Constructors

### new EventBridgeBaseClass()

> **new EventBridgeBaseClass**\<`ConfigType`\>(`name`, `config`): [`EventBridgeBaseClass`](EventBridgeBaseClass.md)\<`ConfigType`\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L30)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; spanProcessor?: SpanProcessor \} & ConfigType)\[K\] \}

#### Returns

[`EventBridgeBaseClass`](EventBridgeBaseClass.md)\<`ConfigType`\>

#### Overrides

[`GenericEventEmitter`](GenericEventEmitter.md).[`constructor`](GenericEventEmitter.md#constructors)

## Properties

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<\{ \[K in string \| number \| symbol\]: (\{ defaultCommandTimeout?: number; instanceId?: string; logger?: Logger; logLevel?: LogLevelName; spanProcessor?: SpanProcessor \} & ConfigType)\[K\] \}\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L23)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L29)

***

### instanceId

> **instanceId**: `string`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L27)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L20)

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L25)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L21)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:155](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L155)

#### Returns

`Promise`\<`void`\>

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter`?): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

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

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:70](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L70)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

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

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

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

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`removeAllListeners`](GenericEventEmitter.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:156](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L156)

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L82)

Start a child span for opentelemetry tracking

#### Type Parameters

• **F**

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

optional context

`undefined` | `Context`

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context`?): `Promise`\<`F`\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:132](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L132)

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type Parameters

• **F**

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
