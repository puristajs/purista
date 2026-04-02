[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridge

# Interface: EventBridge

Defined in: [core/EventBridge/types/EventBridge.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L22)

Event bridge interface
The event bridge must implement this interface.

## Properties

### capabilities

> `readonly` **capabilities**: [`EventBridgeCapabilities`](../type-aliases/EventBridgeCapabilities.md)

Defined in: [core/EventBridge/types/EventBridge.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L24)

***

### defaultCommandTimeout

> `readonly` **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/types/EventBridge.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L30)

The default time until when a command invocation automatically returns a time out error

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [core/EventBridge/types/EventBridge.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L26)

***

### name

> `readonly` **name**: `string`

Defined in: [core/EventBridge/types/EventBridge.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L23)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:125](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L125)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

***

### emitMessage()

> **emitMessage**(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [core/EventBridge/types/EventBridge.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L41)

Emit a message to the eventbridge without awaiting a result

#### Parameters

##### message

`Omit`\<[`EBMessage`](../type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

the message

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

***

### getInFlightExecutionCount()

> **getInFlightExecutionCount**(): `number`

Defined in: [core/EventBridge/types/EventBridge.ts:130](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L130)

Number of currently running handlers across all work kinds.

#### Returns

`number`

***

### getInFlightExecutionCounts()

> **getInFlightExecutionCounts**(): `Record`\<`"command"` \| `"subscription"` \| `"stream"` \| `"generic"`, `number`\>

Defined in: [core/EventBridge/types/EventBridge.ts:135](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L135)

Number of currently running handlers grouped by work kind.

#### Returns

`Record`\<`"command"` \| `"subscription"` \| `"stream"` \| `"generic"`, `number`\>

***

### getPausedSubscriptionConsumers()

> **getPausedSubscriptionConsumers**(): `Record`\<`string`, \{ `pausedAt`: `number`; `reason`: `string`; \}\>

Defined in: [core/EventBridge/types/EventBridge.ts:140](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L140)

Returns paused subscription consumer states keyed by adapter registration key.

#### Returns

`Record`\<`string`, \{ `pausedAt`: `number`; `reason`: `string`; \}\>

***

### invoke()

> **invoke**\<`T`\>(`input`, `ttl?`): `Promise`\<`T`\>

Defined in: [core/EventBridge/types/EventBridge.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L48)

Call a command of a service and return the result of this command

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Omit`\<[`Command`](../type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"`\>

a partial command message

##### ttl?

`number`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/types/EventBridge.ts:120](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L120)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/types/EventBridge.ts:115](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L115)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`input`, `ttl?`): `Promise`\<[`StreamHandle`](StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [core/EventBridge/types/EventBridge.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L54)

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

##### ttl?

`number`

#### Returns

`Promise`\<[`StreamHandle`](StreamHandle.md)\<`Chunk`, `Final`\>\>

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [core/EventBridge/types/EventBridge.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L64)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

the address of the service command (service name, version and command name)

##### cb

(`message`) => `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| `Readonly`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp?`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\>\>

the function to be called if a matching command arrives

##### metadata

[`CommandDefinitionMetadataBase`](../type-aliases/CommandDefinitionMetadataBase.md)

##### eventBridgeConfig

[`DefinitionEventBridgeConfig`](../type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

***

### registerStream()

> **registerStream**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [core/EventBridge/types/EventBridge.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L78)

Register a service stream.

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

##### cb

(`message`) => `Promise`\<`void`\>

##### metadata

[`StreamDefinitionMetadataBase`](../type-aliases/StreamDefinitionMetadataBase.md)

##### eventBridgeConfig

[`DefinitionEventBridgeConfig`](../type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [core/EventBridge/types/EventBridge.ts:101](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L101)

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

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:145](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L145)

Resumes a paused subscription consumer by registration key.

#### Parameters

##### registrationKey

`string`

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L35)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L89)

Unregister a service command

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

The address (service name, version and command name) of the command to be de-registered

#### Returns

`Promise`\<`void`\>

***

### unregisterStream()

> **unregisterStream**(`address`): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:94](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L94)

Unregister a service stream

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:110](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L110)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>
