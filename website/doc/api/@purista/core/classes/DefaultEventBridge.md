[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultEventBridge

# Class: DefaultEventBridge

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L73)

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

### Constructor

> **new DefaultEventBridge**(`config?`): `DefaultEventBridge`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:104](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L104)

#### Parameters

##### config?

###### defaultCommandTimeout?

`number`

Overwrite the hardcoded default timeout of command invocations

###### instanceId?

`string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

###### logger?

[`Logger`](Logger.md)

###### logLevel?

[`LogLevelName`](../type-aliases/LogLevelName.md)

###### logWarnOnMessagesWithoutReceiver?

`boolean`

Log warnings on messages which are emitted, but could not delivered to at least one receiver

###### spanProcessor?

`SpanProcessor`

#### Returns

`DefaultEventBridge`

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`constructor`](EventBridgeBaseClass.md#constructor)

## Properties

### capabilities

> **capabilities**: [`EventBridgeCapabilities`](../type-aliases/EventBridgeCapabilities.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L48)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`capabilities`](../interfaces/EventBridge.md#capabilities)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`capabilities`](EventBridgeBaseClass.md#capabilities)

***

### config

> **config**: [`Complete`](../type-aliases/Complete.md)\<[`EventBridgeConfig`](../type-aliases/EventBridgeConfig.md)\<`ConfigType`\>\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L45)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`config`](EventBridgeBaseClass.md#config)

***

### defaultCommandTimeout

> **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L85)

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`defaultCommandTimeout`](../interfaces/EventBridge.md#defaultcommandtimeout)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`defaultCommandTimeout`](EventBridgeBaseClass.md#defaultcommandtimeout)

***

### hasStarted

> `protected` **hasStarted**: `boolean` = `false`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L101)

***

### healthy

> `protected` **healthy**: `boolean` = `false`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:102](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L102)

***

### inFlightExecutions

> `protected` `readonly` **inFlightExecutions**: [`InFlightExecutionTracker`](InFlightExecutionTracker.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L86)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`inFlightExecutions`](EventBridgeBaseClass.md#inflightexecutions)

***

### instanceId

> **instanceId**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L83)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`instanceId`](../interfaces/EventBridge.md#instanceid)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`instanceId`](EventBridgeBaseClass.md#instanceid)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L42)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`logger`](EventBridgeBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L47)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`name`](../interfaces/EventBridge.md#name)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`name`](EventBridgeBaseClass.md#name)

***

### pendingInvocations

> `protected` **pendingInvocations**: [`PendingInvocationRegistry`](PendingInvocationRegistry.md)\<`unknown`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:88](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L88)

***

### pendingStreams

> `protected` **pendingStreams**: [`PendingStreamRegistry`](PendingStreamRegistry.md)\<`any`, `any`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L93)

***

### readStream

> `protected` **readStream**: `Readable`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:75](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L75)

***

### serviceFunctions

> `protected` **serviceFunctions**: `Map`\<`string`, (`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L82)

***

### streamFunctions

> `protected` **streamFunctions**: `Map`\<`string`, (`message`) => `Promise`\<`void`\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L87)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionStorageEntry`](../type-aliases/SubscriptionStorageEntry.md)\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L99)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L43)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`traceProvider`](EventBridgeBaseClass.md#traceprovider)

***

### writeStream

> `protected` **writeStream**: `Writable`

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L74)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:583](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L583)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`destroy`](../interfaces/EventBridge.md#destroy)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`destroy`](EventBridgeBaseClass.md#destroy)

***

### emitMessage()

> **emitMessage**(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:440](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L440)

Emit a new message to event bridge to be delivered to receiver

#### Parameters

##### message

`Omit`\<[`EBMessage`](../type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

EBMessage

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`emitMessage`](../interfaces/EventBridge.md#emitmessage)

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:222](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L222)

Number of currently running handlers across all work kinds.

#### Returns

`number`

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`getInFlightExecutionCount`](../interfaces/EventBridge.md#getinflightexecutioncount)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`getInFlightExecutionCount`](EventBridgeBaseClass.md#getinflightexecutioncount)

***

### getInFlightExecutionCounts()

> **getInFlightExecutionCounts**(): [`InFlightExecutionCounts`](../type-aliases/InFlightExecutionCounts.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:226](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L226)

Number of currently running handlers grouped by work kind.

#### Returns

[`InFlightExecutionCounts`](../type-aliases/InFlightExecutionCounts.md)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`getInFlightExecutionCounts`](../interfaces/EventBridge.md#getinflightexecutioncounts)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`getInFlightExecutionCounts`](EventBridgeBaseClass.md#getinflightexecutioncounts)

***

### getPausedSubscriptionConsumers()

> **getPausedSubscriptionConsumers**(): [`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:230](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L230)

Returns paused subscription consumer states keyed by adapter registration key.

#### Returns

[`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`getPausedSubscriptionConsumers`](../interfaces/EventBridge.md#getpausedsubscriptionconsumers)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`getPausedSubscriptionConsumers`](EventBridgeBaseClass.md#getpausedsubscriptionconsumers)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:123](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L123)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`getTracer`](EventBridgeBaseClass.md#gettracer)

***

### invoke()

> **invoke**\<`T`\>(`input`, `commandTimeout?`): `Promise`\<`T`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:477](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L477)

Call a command of a service and return the result of this command

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Omit`\<[`Command`](../type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

a partial command message

##### commandTimeout?

`number` = `...`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`invoke`](../interfaces/EventBridge.md#invoke)

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:151](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L151)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`isHealthy`](../interfaces/EventBridge.md#ishealthy)

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:147](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L147)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`isReady`](../interfaces/EventBridge.md#isready)

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`input`, `commandTimeout?`): `Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:519](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L519)

Open a stream invocation.
The returned handle can be consumed via async iteration and can be cancelled by caller.

#### Type Parameters

##### Chunk

`Chunk` = `unknown`

##### Final

`Final` = `unknown`

#### Parameters

##### input

`Omit`\<[`StreamOpenRequest`](../type-aliases/StreamOpenRequest.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

##### commandTimeout?

`number` = `...`

#### Returns

`Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`openStream`](../interfaces/EventBridge.md#openstream)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`openStream`](EventBridgeBaseClass.md#openstream)

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`): `Promise`\<`string`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:364](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L364)

Register a service command and ensure that there is a queue for all incoming command requests.

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

The service function address

##### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

the function to call if a matching command message arrives

##### metadata

[`CommandDefinitionMetadataBase`](../type-aliases/CommandDefinitionMetadataBase.md)

#### Returns

`Promise`\<`string`\>

the id of command function queue

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerCommand`](../interfaces/EventBridge.md#registercommand)

***

### registerStream()

> **registerStream**(`address`, `cb`, `metadata`): `Promise`\<`string`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:384](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L384)

Register a service stream.

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

##### cb

(`message`) => `Promise`\<`void`\>

##### metadata

[`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerStream`](../interfaces/EventBridge.md#registerstream)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`registerStream`](EventBridgeBaseClass.md#registerstream)

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:418](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L418)

Register a new subscription

#### Parameters

##### subscription

[`Subscription`](../type-aliases/Subscription.md)

the subscription definition

##### cb

(`message`) => `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

the function to be called if a matching message arrives

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`registerSubscription`](../interfaces/EventBridge.md#registersubscription)

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`_registrationKey`): `Promise`\<`void`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:234](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L234)

Resumes a paused subscription consumer by registration key.

#### Parameters

##### \_registrationKey

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`resumeSubscriptionConsumer`](../interfaces/EventBridge.md#resumesubscriptionconsumer)

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`resumeSubscriptionConsumer`](EventBridgeBaseClass.md#resumesubscriptionconsumer)

***

### runInFlight()

> **runInFlight**\<`T`\>(`fn`, `kind?`): `Promise`\<`T`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:211](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L211)

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

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`runInFlight`](EventBridgeBaseClass.md#runinflight)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:155](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L155)

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

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:135](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L135)

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

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`startActiveSpan`](EventBridgeBaseClass.md#startactivespan)

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:404](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L404)

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

### unregisterStream()

> **unregisterStream**(`address`): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:411](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L411)

Unregister a service stream

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`unregisterStream`](../interfaces/EventBridge.md#unregisterstream)

#### Overrides

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`unregisterStream`](EventBridgeBaseClass.md#unregisterstream)

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [DefaultEventBridge/DefaultEventBridge.impl.ts:428](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L428)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EventBridge`](../interfaces/EventBridge.md).[`unregisterSubscription`](../interfaces/EventBridge.md#unregistersubscription)

***

### waitForInFlightDrain()

> **waitForInFlightDrain**(`timeoutMs?`): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:218](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L218)

#### Parameters

##### timeoutMs?

`number` = `...`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`waitForInFlightDrain`](EventBridgeBaseClass.md#waitforinflightdrain)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/EventBridge/EventBridgeBaseClass.impl.ts:185](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L185)

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

#### Inherited from

[`EventBridgeBaseClass`](EventBridgeBaseClass.md).[`wrapInSpan`](EventBridgeBaseClass.md#wrapinspan)
