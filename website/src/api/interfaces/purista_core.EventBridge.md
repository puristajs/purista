[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / EventBridge

# Interface: EventBridge

[@purista/core](../modules/purista_core.md).EventBridge

Event bridge interface
The event bridge must implement this interface.

## Implemented by

- [`DefaultEventBridge`](../classes/purista_core.DefaultEventBridge.md)
- [`DefaultEventBridge`](../classes/purista_core.DefaultEventBridge.md)
- [`HttpEventBridge`](../classes/purista_core.HttpEventBridge.md)
- [`HttpEventBridge`](../classes/purista_core.HttpEventBridge.md)

## Table of contents

### Properties

- [defaultCommandTimeout](purista_core.EventBridge.md#defaultcommandtimeout)
- [name](purista_core.EventBridge.md#name)

### Methods

- [destroy](purista_core.EventBridge.md#destroy)
- [emitMessage](purista_core.EventBridge.md#emitmessage)
- [invoke](purista_core.EventBridge.md#invoke)
- [isHealthy](purista_core.EventBridge.md#ishealthy)
- [isReady](purista_core.EventBridge.md#isready)
- [registerCommand](purista_core.EventBridge.md#registercommand)
- [registerSubscription](purista_core.EventBridge.md#registersubscription)
- [start](purista_core.EventBridge.md#start)
- [unregisterCommand](purista_core.EventBridge.md#unregistercommand)
- [unregisterSubscription](purista_core.EventBridge.md#unregistersubscription)

## Properties

### defaultCommandTimeout

• `Readonly` **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Defined in

[core/EventBridge/types/EventBridge.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L24)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[core/EventBridge/types/EventBridge.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L20)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down event bridge as gracefully as possible

#### Returns

`Promise`<`void`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:102](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L102)

___

### emitMessage

▸ **emitMessage**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a message to the eventbridge without awaiting a result

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"instanceId"`` \| ``"correlationId"`` \| ``"timestamp"``\> | the message |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L35)

___

### invoke

▸ **invoke**<`T`\>(`input`, `ttl?`): `Promise`<`T`\>

Call a command of a service and return the result of this command

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"messageType"`` \| ``"instanceId"`` \| ``"correlationId"`` \| ``"timestamp"``\> | a partial command message |
| `ttl?` | `number` | the time to live (timeout) of the invocation |

#### Returns

`Promise`<`T`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:46](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L46)

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`<`boolean`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:97](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L97)

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`<`boolean`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:92](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L92)

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`<`string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | the address of the service command (service name, version and command name) |
| `cb` | (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<`Readonly`<`Omit`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\> \| `Readonly`<`Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\>\> | the function to be called if a matching command arrives |
| `metadata` | [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase) | - |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_core.md#definitioneventbridgeconfig) | - |

#### Returns

`Promise`<`string`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:56](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L56)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

Register a new subscription

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) | the subscription definition |
| `cb` | (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage)) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"instanceId"`` \| ``"timestamp"``\>\> | the function to be called if a matching message arrives |

#### Returns

`Promise`<`string`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:78](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L78)

___

### start

▸ **start**(): `Promise`<`void`\>

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`<`void`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L29)

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`<`void`\>

Unregister a service command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The address (service name, version and command name) of the command to be de-registered |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:71](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L71)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/EventBridge/types/EventBridge.ts:87](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L87)
