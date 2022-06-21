[PURISTA API](../README.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder<ServiceClassType, MessageTypes\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](Service.md) |
| `MessageTypes` | [`EBMessage`](../README.md#ebmessage) |

## Table of contents

### Constructors

- [constructor](SubscriptionDefinitionBuilder.md#constructor)

### Properties

- [messageTypes](SubscriptionDefinitionBuilder.md#messagetypes)
- [receiver](SubscriptionDefinitionBuilder.md#receiver)
- [sender](SubscriptionDefinitionBuilder.md#sender)

### Methods

- [addMessageTypes](SubscriptionDefinitionBuilder.md#addmessagetypes)
- [getDefinition](SubscriptionDefinitionBuilder.md#getdefinition)
- [receivedBy](SubscriptionDefinitionBuilder.md#receivedby)
- [sendFrom](SubscriptionDefinitionBuilder.md#sendfrom)

## Constructors

### constructor

• **new SubscriptionDefinitionBuilder**<`ServiceClassType`, `MessageTypes`\>(`subscriptionName`, `subscriptionDescription`, `fn`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](Service.md)<`ServiceClassType`\> |
| `MessageTypes` | [`EBMessage`](../README.md#ebmessage) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `subscriptionDescription` | `string` |
| `fn` | [`SubscriptionCallback`](../README.md#subscriptioncallback)<`ServiceClassType`, `MessageTypes`\> |

#### Defined in

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:19

## Properties

### messageTypes

• `Private` **messageTypes**: `undefined` \| [`EBMessageType`](../enums/EBMessageType.md)[]

#### Defined in

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:4

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

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:12

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

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:6

## Methods

### addMessageTypes

▸ **addMessageTypes**(...`messageTypes`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...messageTypes` | [`EBMessageType`](../enums/EBMessageType.md)[] |

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Defined in

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:43

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../README.md#subscriptiondefinition)<`MessageTypes`\>

#### Returns

[`SubscriptionDefinition`](../README.md#subscriptiondefinition)<`MessageTypes`\>

#### Defined in

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:53

___

### receivedBy

▸ **receivedBy**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `undefined` \| `string` |
| `serviceVersion` | `undefined` \| `string` |
| `serviceTarget` | `undefined` \| `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Defined in

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:34

___

### sendFrom

▸ **sendFrom**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `undefined` \| `string` |
| `serviceVersion` | `undefined` \| `string` |
| `serviceTarget` | `undefined` \| `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Defined in

packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts:25
