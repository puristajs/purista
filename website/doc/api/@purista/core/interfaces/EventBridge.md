[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridge

# Interface: EventBridge

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L19)

Event bridge interface
The event bridge must implement this interface.

## Properties

### defaultCommandTimeout

> `readonly` **defaultCommandTimeout**: `number`

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L26)

The default time until when a command invocation automatically returns a time out error

***

### instanceId

> `readonly` **instanceId**: `string`

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L22)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L20)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:99](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L99)

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

***

### emitMessage()

> **emitMessage**(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L37)

Emit a message to the eventbridge without awaiting a result

#### Parameters

##### message

`Omit`\<[`EBMessage`](../type-aliases/EBMessage.md), `"correlationId"` \| `"id"` \| `"timestamp"`\>

the message

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

***

### invoke()

> **invoke**\<`T`\>(`input`, `ttl`?): `Promise`\<`T`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L46)

Call a command of a service and return the result of this command

#### Type Parameters

• **T**

#### Parameters

##### input

`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `unknown`; `payload`: `unknown`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"messageType"` \| `"correlationId"` \| `"id"` \| `"timestamp"`\>

a partial command message

##### ttl?

`number`

the time to live (timeout) of the invocation

#### Returns

`Promise`\<`T`\>

***

### isHealthy()

> **isHealthy**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:94](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L94)

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

***

### isReady()

> **isReady**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L89)

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

***

### registerCommand()

> **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L53)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

the address of the service command (service name, version and command name)

##### cb

(`message`) => `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"instanceId"`\>\> \| `Readonly`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"instanceId"`\>\>\>

the function to be called if a matching command arrives

##### metadata

[`CommandDefinitionMetadataBase`](../type-aliases/CommandDefinitionMetadataBase.md)

##### eventBridgeConfig

[`DefinitionEventBridgeConfig`](../type-aliases/DefinitionEventBridgeConfig.md)

#### Returns

`Promise`\<`string`\>

***

### registerSubscription()

> **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:75](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L75)

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

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L31)

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

***

### unregisterCommand()

> **unregisterCommand**(`address`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:68](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L68)

Unregister a service command

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

The address (service name, version and command name) of the command to be de-registered

#### Returns

`Promise`\<`void`\>

***

### unregisterSubscription()

> **unregisterSubscription**(`address`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/EventBridge/types/EventBridge.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L84)

#### Parameters

##### address

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

#### Returns

`Promise`\<`void`\>
