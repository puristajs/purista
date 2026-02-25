[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridge

# Interface: EventBridge

Defined in: [core/EventBridge/types/EventBridge.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L21)

Event bridge interface
The event bridge must implement this interface.

## Properties

### defaultCommandTimeout

> `readonly` **defaultCommandTimeout**: `number`

Defined in: [core/EventBridge/types/EventBridge.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L28)

The default time until when a command invocation automatically returns a time out error

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [core/EventBridge/types/EventBridge.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L24)

***

### name

> `readonly` **name**: `string`

Defined in: [core/EventBridge/types/EventBridge.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L22)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:123](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L123)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

***

### emitMessage()

> **emitMessage**(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [core/EventBridge/types/EventBridge.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L39)

Emit a message to the eventbridge without awaiting a result

#### Parameters

##### message

`Omit`\<[`EBMessage`](../type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

the message

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

***

### invoke()

> **invoke**\<`T`\>(`input`, `ttl?`): `Promise`\<`T`\>

Defined in: [core/EventBridge/types/EventBridge.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L46)

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

Defined in: [core/EventBridge/types/EventBridge.ts:118](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L118)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [core/EventBridge/types/EventBridge.ts:113](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L113)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

***

### openStream()

> **openStream**\<`Chunk`, `Final`\>(`input`, `ttl?`): `Promise`\<[`StreamHandle`](StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [core/EventBridge/types/EventBridge.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L52)

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

Defined in: [core/EventBridge/types/EventBridge.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L62)

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

Defined in: [core/EventBridge/types/EventBridge.ts:76](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L76)

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

Defined in: [core/EventBridge/types/EventBridge.ts:99](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L99)

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

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L33)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L87)

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

Defined in: [core/EventBridge/types/EventBridge.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L92)

Unregister a service stream

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [core/EventBridge/types/EventBridge.ts:108](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L108)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>
