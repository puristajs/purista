[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / EventBridge

# Interface: EventBridge

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).EventBridge

Event bridge interface
The event bridge must implement this interface.

## Implemented by

- [`AmqpBridge`](../classes/purista_amqpbridge.AmqpBridge.md)

## Table of contents

### Properties

- [defaultCommandTimeout](purista_amqpbridge.internal.EventBridge.md#defaultcommandtimeout)
- [name](purista_amqpbridge.internal.EventBridge.md#name)

### Methods

- [destroy](purista_amqpbridge.internal.EventBridge.md#destroy)
- [emitMessage](purista_amqpbridge.internal.EventBridge.md#emitmessage)
- [invoke](purista_amqpbridge.internal.EventBridge.md#invoke)
- [isHealthy](purista_amqpbridge.internal.EventBridge.md#ishealthy)
- [isReady](purista_amqpbridge.internal.EventBridge.md#isready)
- [registerCommand](purista_amqpbridge.internal.EventBridge.md#registercommand)
- [registerSubscription](purista_amqpbridge.internal.EventBridge.md#registersubscription)
- [start](purista_amqpbridge.internal.EventBridge.md#start)
- [unregisterCommand](purista_amqpbridge.internal.EventBridge.md#unregistercommand)
- [unregisterSubscription](purista_amqpbridge.internal.EventBridge.md#unregistersubscription)

## Properties

### defaultCommandTimeout

• `Readonly` **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:13

___

### name

• `Readonly` **name**: `string`

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:9

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down event bridge as gracefully as possible

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:64

___

### emitMessage

▸ **emitMessage**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

Emit a message to the eventbridge without awaiting a result

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | the message |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:22

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
| `input` | `Omit`<[`Command`](../modules/purista_amqpbridge.internal.md#command-1), ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | a partial command message |
| `ttl?` | `number` | the time to live (timeout) of the invocation |

#### Returns

`Promise`<`T`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:30

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:60

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:56

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`<`string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) | the address of the service command (service name, version and command name) |
| `cb` | (`message`: [`Command`](../modules/purista_amqpbridge.internal.md#command-1)) => `Promise`<`Readonly`<`Omit`<[`CommandSuccessResponse`](../modules/purista_amqpbridge.internal.md#commandsuccessresponse-1), ``"instanceId"``\>\> \| `Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_amqpbridge.internal.md#commanderrorresponse-1), ``"instanceId"``\>\>\> | the function to be called if a matching command arrives |
| `metadata` | [`CommandDefinitionMetadataBase`](../modules/purista_amqpbridge.internal.md#commanddefinitionmetadatabase) | - |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_amqpbridge.internal.md#definitioneventbridgeconfig) | - |

#### Returns

`Promise`<`string`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:36

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

Register a new subscription

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_amqpbridge.internal.md#subscription) | the subscription definition |
| `cb` | (`message`: [`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)) => `Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_amqpbridge.internal.md#custommessage-1), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"``\>\> | the function to be called if a matching message arrives |

#### Returns

`Promise`<`string`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:47

___

### start

▸ **start**(): `Promise`<`void`\>

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:17

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`<`void`\>

Unregister a service command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) | The address (service name, version and command name) of the command to be de-registered |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:41

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:52
