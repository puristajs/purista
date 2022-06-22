[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder<ServiceClassType, MessageTypes\>

[@purista/core](../modules/purista_core.md).SubscriptionDefinitionBuilder

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](purista_core.Service.md) |
| `MessageTypes` | [`EBMessage`](../modules/purista_core.md#ebmessage) |

## Table of contents

### Constructors

- [constructor](purista_core.SubscriptionDefinitionBuilder.md#constructor)

### Properties

- [messageTypes](purista_core.SubscriptionDefinitionBuilder.md#messagetypes)
- [receiver](purista_core.SubscriptionDefinitionBuilder.md#receiver)
- [sender](purista_core.SubscriptionDefinitionBuilder.md#sender)

### Methods

- [addMessageTypes](purista_core.SubscriptionDefinitionBuilder.md#addmessagetypes)
- [getDefinition](purista_core.SubscriptionDefinitionBuilder.md#getdefinition)
- [receivedBy](purista_core.SubscriptionDefinitionBuilder.md#receivedby)
- [sendFrom](purista_core.SubscriptionDefinitionBuilder.md#sendfrom)

## Constructors

### constructor

• **new SubscriptionDefinitionBuilder**<`ServiceClassType`, `MessageTypes`\>(`subscriptionName`, `subscriptionDescription`, `fn`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](purista_core.Service.md)<`ServiceClassType`\> |
| `MessageTypes` | [`EBMessage`](../modules/purista_core.md#ebmessage) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `subscriptionDescription` | `string` |
| `fn` | [`SubscriptionCallback`](../modules/purista_core.md#subscriptioncallback)<`ServiceClassType`, `MessageTypes`\> |

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:19](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L19)

## Properties

### messageTypes

• `Private` **messageTypes**: `undefined` \| [`EBMessageType`](../enums/purista_core.EBMessageType.md)[]

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:4](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L4)

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

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:12](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L12)

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

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:6](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L6)

## Methods

### addMessageTypes

▸ **addMessageTypes**(...`messageTypes`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...messageTypes` | [`EBMessageType`](../enums/purista_core.EBMessageType.md)[] |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:43](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L43)

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`MessageTypes`\>

#### Returns

[`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`MessageTypes`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L53)

___

### receivedBy

▸ **receivedBy**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `undefined` \| `string` |
| `serviceVersion` | `undefined` \| `string` |
| `serviceTarget` | `undefined` \| `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:34](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L34)

___

### sendFrom

▸ **sendFrom**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `undefined` \| `string` |
| `serviceVersion` | `undefined` \| `string` |
| `serviceTarget` | `undefined` \| `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessageTypes`\>

#### Defined in

[core/src/helper/SubscriptionDefinitionBuilder.impl.ts:25](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/SubscriptionDefinitionBuilder.impl.ts#L25)
