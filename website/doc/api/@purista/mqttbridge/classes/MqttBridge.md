[**@purista/mqttbridge v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / MqttBridge

# Class: MqttBridge

Defined in: [mqttbridge/src/MqttEventBridge.ts:66](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L66)

The MQTT event bridge connects to a MQTT broker.
The broker must support the MQTT 5 protocol version

## Example

```typescript
import { MqttBridge } from '@purista/mqttbridge'

// create and init our eventbridge
const eventBridge = new MqttBridge()
await eventBridge.start()

@group Event bridge

## Extends

- [`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md)\<[`MqttBridgeConfig`](../type-aliases/MqttBridgeConfig.md)\>

## Implements

- [`EventBridge`](../../core/interfaces/EventBridge.md)

## Constructors

### new MqttBridge()

> **new MqttBridge**(`config`?): [`MqttBridge`](MqttBridge.md)

Defined in: [mqttbridge/src/MqttEventBridge.ts:73](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L73)

#### Parameters

##### config?

###### allowRetries?

`boolean`

allow retry of the initial connect

###### defaultCommandTimeout?

`number`

Overwrite the hardcoded default timeout of command invocations

###### defaultMessageExpiryInterval?

`number`

the message expiry interval in seconds

**Default**

```ts

```

###### defaultSessionExpiryInterval?

`number`

**Default**

```ts
0
```

###### emptyTopicPartString?

`string`

The string which should be used in topics for parts, which are undefined

**Default**

```ts
__none__
```

###### instanceId?

`string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

###### logger?

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

If no logger instance is given, use this log level

###### qosCommand?

`QoS`

QOS for command, command responses and command response subscriptions messages

**Default**

```ts
1
```

###### qoSSubscription?

`QoS`

QOS for all subscriptions

**Default**

```ts
1
```

###### shareTopicName?

`string`

the name of the shared topic (similar to pubsub name)

**Default**

```ts
sharedpurista
```

###### shareTopicPrefix?

`string`

the prefix to be used to dynamically create topic names for shared subscriptions

**Default**

```ts
$share
```

###### spanProcessor?

`SpanProcessor`

A OpenTelemetry span processor

###### topicPrefix?

`string`

the prefix for topic to prevent name collisions

**Default**

```ts
purista
```

#### Returns

[`MqttBridge`](MqttBridge.md)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`constructor`](../../core/classes/EventBridgeBaseClass.md#constructors)

## Properties

### client

> **client**: `undefined` \| `MqttClient`

Defined in: [mqttbridge/src/MqttEventBridge.ts:69](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L69)

***

### config

> **config**: [`Complete`](../../core/type-aliases/Complete.md)\<\{ `allowRetries`: `boolean`; `defaultCommandTimeout`: `number`; `defaultMessageExpiryInterval`: `number`; `defaultSessionExpiryInterval`: `number`; `emptyTopicPartString`: `string`; `instanceId`: `string`; `logger`: [`Logger`](../../core/classes/Logger.md); `logLevel`: [`LogLevelName`](../../core/type-aliases/LogLevelName.md); `qosCommand`: `QoS`; `qoSSubscription`: `QoS`; `shareTopicName`: `string`; `shareTopicPrefix`: `string`; `spanProcessor`: `SpanProcessor`; `topicPrefix`: `string`; \}\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`config`](../../core/classes/EventBridgeBaseClass.md#config-1)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:17

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`defaultCommandTimeout`](../../core/interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`defaultCommandTimeout`](../../core/classes/EventBridgeBaseClass.md#defaultcommandtimeout)

***

### instanceId

> **instanceId**: `string`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`instanceId`](../../core/interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`instanceId`](../../core/classes/EventBridgeBaseClass.md#instanceid)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`logger`](../../core/classes/EventBridgeBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`name`](../../core/interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`name`](../../core/classes/EventBridgeBaseClass.md#name-1)

***

### pendingInvocations

> **pendingInvocations**: `Map`\<`string`, [`PendigInvocation`](../../core/type-aliases/PendigInvocation.md)\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:70](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L70)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`traceProvider`](../../core/classes/EventBridgeBaseClass.md#traceprovider)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:385](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L385)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`destroy`](../../core/interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`destroy`](../../core/classes/EventBridgeBaseClass.md#destroy)

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter`?): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:13

#### Type Parameters

• **K** *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### parameter?

`object`\[`K`\]

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`emit`](../../core/classes/EventBridgeBaseClass.md#emit)

***

### emitMessage()

> **emitMessage**\<`T`\>(`message`, `contentType`, `contentEncoding`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:132](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L132)

Emit a message to the eventbridge without awaiting a result

#### Type Parameters

• **T** *extends* [`EBMessage`](../../core/type-aliases/EBMessage.md)

#### Parameters

##### message

`Omit`\<[`EBMessage`](../../core/type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

the message

##### contentType

`string` = `'application/json'`

##### contentEncoding

`string` = `'utf-8'`

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`emitMessage`](../../core/interfaces/EventBridge.md#emitmessage)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`getTracer`](../../core/classes/EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `commandTimeout`): `Promise`\<`T`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:208](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L208)

Call a command of a service and return the result of this command

#### Type Parameters

• **T**

#### Parameters

##### input

`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../../core/enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `unknown`; `payload`: `unknown`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"` \| `"correlationId"` \| `"messageType"`\>

a partial command message

##### commandTimeout

`number` = `...`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`invoke`](../../core/interfaces/EventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:204](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L204)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isHealthy`](../../core/interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:200](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L200)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`isReady`](../../core/interfaces/EventBridge.md#isready)

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:12

#### Type Parameters

• **K** *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`off`](../../core/classes/EventBridgeBaseClass.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:11

#### Type Parameters

• **K** *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<\{ `[key: `custom-${string}`]`: `unknown`;  `[key: `adapter-${string}`]`: `unknown`;  `eventbridge-connected`: `never`; `eventbridge-connection-error`: `unknown`; `eventbridge-disconnected`: `never`; `eventbridge-error`: `unknown`; `eventbridge-reconnecting`: `never`; \}\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<`object`\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`on`](../../core/classes/EventBridgeBaseClass.md#on)

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:328](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L328)

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

the address of the service command (service name, version and command name)

##### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

the function to be called if a matching command arrives

##### metadata

[`CommandDefinitionMetadataBase`](../../core/type-aliases/CommandDefinitionMetadataBase.md)

##### eventBridgeConfig

[`DefinitionEventBridgeConfig`](../../core/type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerCommand`](../../core/interfaces/EventBridge.md#registercommand)

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:357](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L357)

Register a new subscription

#### Parameters

##### subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

the subscription definition

##### cb

(`message`) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>

the function to be called if a matching message arrives

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`registerSubscription`](../../core/interfaces/EventBridge.md#registersubscription)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: core/dist/commonjs/core/types/GenericEventEmitter.d.ts:14

#### Returns

`void`

#### Inherited from

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`removeAllListeners`](../../core/classes/EventBridgeBaseClass.md#removealllisteners)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:82](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L82)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`start`](../../core/interfaces/EventBridge.md#start)

#### Overrides

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`start`](../../core/classes/EventBridgeBaseClass.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:33

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

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`startActiveSpan`](../../core/classes/EventBridgeBaseClass.md#startactivespan)

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:351](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L351)

Unregister a service command

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

The address (service name, version and command name) of the command to be de-registered

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterCommand`](../../core/interfaces/EventBridge.md#unregistercommand)

***

### unregisterSubscription()

> **unregisterSubscription**(`_address`): `Promise`\<`void`\>

Defined in: [mqttbridge/src/MqttEventBridge.ts:383](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/MqttEventBridge.ts#L383)

#### Parameters

##### \_address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../../core/interfaces/EventBridge.md).[`unregisterSubscription`](../../core/interfaces/EventBridge.md#unregistersubscription)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context`?): `Promise`\<`F`\>

Defined in: core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:49

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

[`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md).[`wrapInSpan`](../../core/classes/EventBridgeBaseClass.md#wrapinspan)
