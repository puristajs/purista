[PURISTA API - v1.4.3](../README.md) / [@purista/core](../modules/purista_core.md) / IServiceClass

# Interface: IServiceClass

[@purista/core](../modules/purista_core.md).IServiceClass

## Implemented by

- [`Service`](../classes/purista_core.Service.md)

## Table of contents

### Accessors

- [serviceInfo](purista_core.IServiceClass.md#serviceinfo)

### Methods

- [destroy](purista_core.IServiceClass.md#destroy)
- [sendServiceInfo](purista_core.IServiceClass.md#sendserviceinfo)
- [start](purista_core.IServiceClass.md#start)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[core/src/core/types/ServiceClass.ts:58](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/ServiceClass.ts#L58)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:54](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/ServiceClass.ts#L54)

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `data?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_core.md#infomessagetype) |
| `target?` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Defined in

[core/src/core/types/ServiceClass.ts:59](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/ServiceClass.ts#L59)

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:56](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/ServiceClass.ts#L56)
