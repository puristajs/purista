[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultEventBridge

# Class: DefaultEventBridge

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L63)

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

## Example

```typescript
import { DefaultEventBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// add your services
```

## Extends

- [`EventBridgeBaseClass`](EventBridgeBaseClass.md)\<[`DefaultEventBridgeConfig`](../type-aliases/DefaultEventBridgeConfig.md)\>

## Implements

- [`EventBridge`](../interfaces/EventBridge.md)

## Constructors

### new DefaultEventBridge()

> **new DefaultEventBridge**(`config`?): [`DefaultEventBridge`](DefaultEventBridge.md)

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L85)

#### Parameters

##### config?

###### defaultCommandTimeout?

`number`

Overwrite the hardcoded default timeout of command invocations

###### emitMessagesAsEventBridgeEvents?

`boolean`

Emit messages which have an event name set as javascript events on the event bridge instance

###### instanceId?

`string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

###### logger?

[`Logger`](Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../type-aliases/LogLevelName.md)

If no logger instance is given, use this log level

###### logWarnOnMessagesWithoutReceiver?

`boolean`

Log warnings on messages which are emitted, but could not delivered to at least one receiver

###### spanProcessor?

`SpanProcessor`

A OpenTelemetry span processor

#### Returns

[`DefaultEventBridge`](DefaultEventBridge.md)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`constructor`](EventBridgeBaseClass.md#constructors)

## Properties

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<\{ `defaultCommandTimeout`: `number`; `emitMessagesAsEventBridgeEvents`: `boolean`; `instanceId`: `string`; `logger`: [`Logger`](Logger.md); `logLevel`: [`LogLevelName`](../type-aliases/LogLevelName.md); `logWarnOnMessagesWithoutReceiver`: `boolean`; `spanProcessor`: `SpanProcessor`; \}\>

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L23)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`config`](EventBridgeBaseClass.md#config-1)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L29)

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`defaultCommandTimeout`](../interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`defaultCommandTimeout`](EventBridgeBaseClass.md#defaultcommandtimeout)

***

### hasStarted

> `protected` **hasStarted**: `boolean` = `false`

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L82)

***

### healthy

> `protected` **healthy**: `boolean` = `false`

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L83)

***

### instanceId

> **instanceId**: `string`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L27)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`instanceId`](../interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`instanceId`](EventBridgeBaseClass.md#instanceid)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L20)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`logger`](EventBridgeBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L25)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`name`](../interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`name`](EventBridgeBaseClass.md#name-1)

***

### pendingInvocations

> `protected` **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../type-aliases/PendigInvocation.md)\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L77)

***

### readStream

> `protected` **readStream**: `Readable`

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L65)

***

### runningSubscriptionCount

> `protected` **runningSubscriptionCount**: `number` = `0`

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L78)

***

### serviceFunctions

> `protected` **serviceFunctions**: `Map`\<`string`, (`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L72)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionStorageEntry`](../type-aliases/SubscriptionStorageEntry.md)\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L80)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L21)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`traceProvider`](EventBridgeBaseClass.md#traceprovider)

***

### writeStream

> `protected` **writeStream**: `Writable`

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L64)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:385](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L385)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`destroy`](../interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`destroy`](EventBridgeBaseClass.md#destroy)

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

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`emit`](EventBridgeBaseClass.md#emit)

***

### emitMessage()

> **emitMessage**(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:287](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L287)

Emit a new message to event bridge to be delivered to receiver

#### Parameters

##### message

`Omit`\<[`EBMessage`](../type-aliases/EBMessage.md), `"correlationId"` \| `"id"` \| `"timestamp"`\>

EBMessage

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`emitMessage`](../interfaces/EventBridge.md#emitmessage)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts:70](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L70)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`getTracer`](EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `commandTimeout`): `Promise`\<`T`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:328](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L328)

Call a command of a service and return the result of this command

#### Type Parameters

• **T**

#### Parameters

##### input

`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `unknown`; `payload`: `unknown`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"messageType"` \| `"correlationId"` \| `"id"` \| `"timestamp"`\>

a partial command message

##### commandTimeout

`number` = `...`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`invoke`](../interfaces/EventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:98](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L98)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`isHealthy`](../interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:94](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L94)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`isReady`](../interfaces/EventBridge.md#isready)

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

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`off`](EventBridgeBaseClass.md#off)

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

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`on`](EventBridgeBaseClass.md#on)

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`): `Promise`\<`string`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:242](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L242)

Register a service command and ensure that there is a queue for all incoming command requests.

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

The service function address

##### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

the function to call if a matching command message arrives

##### metadata

[`CommandDefinitionMetadataBase`](../type-aliases/CommandDefinitionMetadataBase.md)

#### Returns

`Promise`\<`string`\>

the id of command function queue

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerCommand`](../interfaces/EventBridge.md#registercommand)

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:267](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L267)

Register a new subscription

#### Parameters

##### subscription

[`Subscription`](../type-aliases/Subscription.md)

the subscription definition

##### cb

(`message`) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>

the function to be called if a matching message arrives

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerSubscription`](../interfaces/EventBridge.md#registersubscription)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`removeAllListeners`](EventBridgeBaseClass.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:102](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L102)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`start`](../interfaces/EventBridge.md#start)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`start`](EventBridgeBaseClass.md#start)

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

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`startActiveSpan`](EventBridgeBaseClass.md#startactivespan)

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:262](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L262)

Unregister a service command

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

The address (service name, version and command name) of the command to be de-registered

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`unregisterCommand`](../interfaces/EventBridge.md#unregistercommand)

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts:277](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L277)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`unregisterSubscription`](../interfaces/EventBridge.md#unregistersubscription)

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

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`wrapInSpan`](EventBridgeBaseClass.md#wrapinspan)
