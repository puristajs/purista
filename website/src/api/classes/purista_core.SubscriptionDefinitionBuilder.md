[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder<ServiceClassType, MessageType, Payload\>

[@purista/core](../modules/purista_core.md).SubscriptionDefinitionBuilder

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](purista_core.ServiceClass.md) |
| `MessageType` | [`EBMessage`](../modules/purista_core.md#ebmessage) |
| `Payload` | `unknown` |

## Table of contents

### Constructors

- [constructor](purista_core.SubscriptionDefinitionBuilder.md#constructor)

### Properties

- [eventName](purista_core.SubscriptionDefinitionBuilder.md#eventname)
- [fn](purista_core.SubscriptionDefinitionBuilder.md#fn)
- [instanceId](purista_core.SubscriptionDefinitionBuilder.md#instanceid)
- [messageType](purista_core.SubscriptionDefinitionBuilder.md#messagetype)
- [principalId](purista_core.SubscriptionDefinitionBuilder.md#principalid)
- [receiver](purista_core.SubscriptionDefinitionBuilder.md#receiver)
- [sender](purista_core.SubscriptionDefinitionBuilder.md#sender)
- [settings](purista_core.SubscriptionDefinitionBuilder.md#settings)

### Methods

- [addMessageType](purista_core.SubscriptionDefinitionBuilder.md#addmessagetype)
- [getDefinition](purista_core.SubscriptionDefinitionBuilder.md#getdefinition)
- [getFunction](purista_core.SubscriptionDefinitionBuilder.md#getfunction)
- [onlyInstanceId](purista_core.SubscriptionDefinitionBuilder.md#onlyinstanceid)
- [onlyPrincipalId](purista_core.SubscriptionDefinitionBuilder.md#onlyprincipalid)
- [receivedBy](purista_core.SubscriptionDefinitionBuilder.md#receivedby)
- [sendFrom](purista_core.SubscriptionDefinitionBuilder.md#sendfrom)
- [setDurable](purista_core.SubscriptionDefinitionBuilder.md#setdurable)
- [setFunction](purista_core.SubscriptionDefinitionBuilder.md#setfunction)
- [subscribeToEvent](purista_core.SubscriptionDefinitionBuilder.md#subscribetoevent)

## Constructors

### constructor

• **new SubscriptionDefinitionBuilder**<`ServiceClassType`, `MessageType`, `Payload`\>(`subscriptionName`, `subscriptionDescription`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\> |
| `MessageType` | [`EBMessage`](../modules/purista_core.md#ebmessage) |
| `Payload` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `subscriptionDescription` | `string` |

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L47)

## Properties

### eventName

• `Private` `Optional` **eventName**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:38](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L38)

___

### fn

• `Private` `Optional` **fn**: [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:36](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L36)

___

### instanceId

• `Private` `Optional` **instanceId**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:42](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L42)

___

### messageType

• `Private` **messageType**: `undefined` \| [`EBMessageType`](../enums/purista_core.EBMessageType.md)

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:22](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L22)

___

### principalId

• `Private` `Optional` **principalId**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:40](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L40)

___

### receiver

• `Private` `Optional` **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:30](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L30)

___

### sender

• `Private` `Optional` **sender**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:24](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L24)

___

### settings

• `Private` **settings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:44](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L44)

## Methods

### addMessageType

▸ **addMessageType**(`messageType`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

Adds a filter to match specific message type.

Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.

See  EBMessageType for full available list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageType` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:146](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L146)

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`ServiceClassType`, `MessageType`, `Payload`\>

Returns the final subscription definition which will be passed into the service class.

#### Returns

[`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`ServiceClassType`, `MessageType`, `Payload`\>

SubscriptionDefinition

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:188](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L188)

___

### getFunction

▸ **getFunction**(): [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessageType`, `Payload`\>

Get the function implementation

#### Returns

[`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessageType`, `Payload`\>

the function

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:177](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L177)

___

### onlyInstanceId

▸ **onlyInstanceId**(`instanceId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

Filter messages only from instance id

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:64](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L64)

___

### onlyPrincipalId

▸ **onlyPrincipalId**(`principalId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

Filter messages only for principalId

#### Parameters

| Name | Type |
| :------ | :------ |
| `principalId` | `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:74](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L74)

___

### receivedBy

▸ **receivedBy**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

Add filter to only match messages received by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send to function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
receivedBy('UserService', undefined, 'testFunction')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `undefined` \| `string` |
| `serviceVersion` | `undefined` \| `string` |
| `serviceTarget` | `undefined` \| `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:127](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L127)

___

### sendFrom

▸ **sendFrom**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

Add filter to only match messages send by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send from function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
sendFrom('UserService', undefined, 'testFunction')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `undefined` \| `string` |
| `serviceVersion` | `undefined` \| `string` |
| `serviceTarget` | `undefined` \| `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:101](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L101)

___

### setDurable

▸ **setDurable**(`durable`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:79](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L79)

___

### setFunction

▸ **setFunction**(`fn`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Anonymous functions do not have access to the `this` scope.

**`Example`**

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessageType`, `Payload`\> | the function implementation |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

SubscriptionDefinitionBuilder

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:168](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L168)

___

### subscribeToEvent

▸ **subscribeToEvent**(`eventName`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

Add a filter to only subscribe to messages with matching event name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | Event name |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageType`, `Payload`\>

SubscriptionDefinitionBuilder

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:54](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L54)
