[@purista/core](../README.md) / [Exports](../modules.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder<ServiceClassType, MessageTypes\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](Service.md) |
| `MessageTypes` | [`EBMessage`](../modules.md#ebmessage) |

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
| `MessageTypes` | [`EBMessage`](../modules.md#ebmessage) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `subscriptionDescription` | `string` |
| `fn` | [`SubscriptionCallback`](../modules.md#subscriptioncallback)<`ServiceClassType`, `MessageTypes`\> |

#### Defined in

[src/helper/SubscriptionDefinitionBuilder.impl.ts:19](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L19)

## Properties

### messageTypes

• `Private` **messageTypes**: `undefined` \| [`EBMessageType`](../enums/EBMessageType.md)[]

#### Defined in

[src/helper/SubscriptionDefinitionBuilder.impl.ts:4](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L4)

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

[src/helper/SubscriptionDefinitionBuilder.impl.ts:12](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L12)

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

[src/helper/SubscriptionDefinitionBuilder.impl.ts:6](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L6)

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

[src/helper/SubscriptionDefinitionBuilder.impl.ts:43](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L43)

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<`MessageTypes`\>

#### Returns

[`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<`MessageTypes`\>

#### Defined in

[src/helper/SubscriptionDefinitionBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L53)

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

[src/helper/SubscriptionDefinitionBuilder.impl.ts:34](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L34)

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

[src/helper/SubscriptionDefinitionBuilder.impl.ts:25](https://github.com/sebastianwessel/purista/blob/40390cf/src/helper/SubscriptionDefinitionBuilder.impl.ts#L25)
