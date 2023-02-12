[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder<ServiceClassType, MsgType, Payload\>

[@purista/core](../modules/purista_core.md).SubscriptionDefinitionBuilder

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](purista_core.ServiceClass.md) = [`ServiceClass`](purista_core.ServiceClass.md) |
| `MsgType` | extends [`EBMessage`](../modules/purista_core.md#ebmessage) = [`EBMessage`](../modules/purista_core.md#ebmessage) |
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
- [subscriptionDescription](purista_core.SubscriptionDefinitionBuilder.md#subscriptiondescription)
- [subscriptionName](purista_core.SubscriptionDefinitionBuilder.md#subscriptionname)

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

• **new SubscriptionDefinitionBuilder**<`ServiceClassType`, `MsgType`, `Payload`\>(`subscriptionName`, `subscriptionDescription`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](purista_core.ServiceClass.md)<`unknown`, `ServiceClassType`\> = [`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\> |
| `MsgType` | extends [`EBMessage`](../modules/purista_core.md#ebmessage) = [`EBMessage`](../modules/purista_core.md#ebmessage) |
| `Payload` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `subscriptionDescription` | `string` |

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L47)

## Properties

### eventName

• `Private` `Optional` **eventName**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:38](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L38)

___

### fn

• `Private` `Optional` **fn**: [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `any`, `any`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:36](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L36)

___

### instanceId

• `Private` `Optional` **instanceId**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:42](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L42)

___

### messageType

• `Private` **messageType**: `undefined` \| [`EBMessageType`](../enums/purista_core.EBMessageType.md)

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:22](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L22)

___

### principalId

• `Private` `Optional` **principalId**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:40](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L40)

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

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:30](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L30)

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

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L24)

___

### settings

• `Private` **settings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:44](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L44)

___

### subscriptionDescription

• `Private` **subscriptionDescription**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L47)

___

### subscriptionName

• `Private` **subscriptionName**: `string`

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L47)

## Methods

### addMessageType

▸ **addMessageType**(`messageType`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

Adds a filter to match specific message type.

Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.

See  EBMessageType for full available list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageType` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:149](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L149)

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`ServiceClassType`, `MsgType`, `Payload`\>

Returns the final subscription definition which will be passed into the service class.

#### Returns

[`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`ServiceClassType`, `MsgType`, `Payload`\>

SubscriptionDefinition

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:193](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L193)

___

### getFunction

▸ **getFunction**(): [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MsgType`, `Payload`\>

Get the function implementation

#### Returns

[`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MsgType`, `Payload`\>

the function

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:182](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L182)

___

### onlyInstanceId

▸ **onlyInstanceId**(`instanceId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

Filter messages only from instance id

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:67](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L67)

___

### onlyPrincipalId

▸ **onlyPrincipalId**(`principalId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

Filter messages only for principalId

#### Parameters

| Name | Type |
| :------ | :------ |
| `principalId` | `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:77](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L77)

___

### receivedBy

▸ **receivedBy**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

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

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:130](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L130)

___

### sendFrom

▸ **sendFrom**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

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

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:104](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L104)

___

### setDurable

▸ **setDurable**(`durable`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:82](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L82)

___

### setFunction

▸ **setFunction**<`PayloadType`, `MType`\>(`fn`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MType`, `PayloadType`\>

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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |
| `MType` | extends [`EBMessage`](../modules/purista_core.md#ebmessage) = `MsgType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MType`, `PayloadType`\> | the function implementation |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MType`, `PayloadType`\>

SubscriptionDefinitionBuilder

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:171](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L171)

___

### subscribeToEvent

▸ **subscribeToEvent**(`eventName`, `serviceVersion?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

Add a filter to only subscribe to messages with matching event name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | Event name |
| `serviceVersion?` | `string` | the version of the service that produces the event |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MsgType`, `Payload`\>

SubscriptionDefinitionBuilder

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:55](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L55)
