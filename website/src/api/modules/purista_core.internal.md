[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](purista_core.md) / internal

# Namespace: internal

[@purista/core](purista_core.md).internal

## Table of contents

### Service

- [ServiceBaseClass](../classes/purista_core.internal.ServiceBaseClass.md)

### Type Aliases

- [CustomEvents](purista_core.internal.md#customevents)
- [CustomEvents](purista_core.internal.md#customevents-1)
- [EventReceiver](purista_core.internal.md#eventreceiver)
- [InvokeFunction](purista_core.internal.md#invokefunction)

## Type Aliases

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[packages/core/src/core/types/ServiceEvents.ts:87](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/ServiceEvents.ts#L87)

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[packages/core/src/core/EventBridge/types/EventBridgeEvents.ts:26](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L26)

___

### EventReceiver

Ƭ **EventReceiver**<`T`\>: (`parameter`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`parameter`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `T` |

##### Returns

`void`

#### Defined in

[packages/core/src/core/types/GenericEventEmitter.ts:6](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/GenericEventEmitter.ts#L6)

___

### InvokeFunction

Ƭ **InvokeFunction**: <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_core.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\>

#### Type declaration

▸ <`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`address`, `payload`, `parameter`): `Promise`<`InvokeResponseType`\>

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

**`Example`**

```typescript

const address: EBMessageAddress = {
  serviceName: 'name-of-service-to-invoke',
  serviceVersion: '1',
  serviceTarget: 'command-name-to-invoke',
}

const inputPayload = { my: 'input' }
const inputParameter = { search: 'for_me' }

const result = await invoke<MyResultType>(address, inputPayload inputParameter )
```

##### Type parameters

| Name | Type |
| :------ | :------ |
| `InvokeResponseType` | `unknown` |
| `PayloadType` | `unknown` |
| `ParameterType` | `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |
| `payload` | `PayloadType` |
| `parameter` | `ParameterType` |

##### Returns

`Promise`<`InvokeResponseType`\>

#### Defined in

[packages/core/src/core/types/InvokeFunction.ts:21](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/InvokeFunction.ts#L21)
