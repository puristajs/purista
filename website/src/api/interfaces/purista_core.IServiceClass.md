[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / IServiceClass

# Interface: IServiceClass

[@purista/core](../modules/purista_core.md).IServiceClass

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

[core/src/core/types/ServiceClass.ts:55](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L55)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:51](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L51)

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `data?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_core.md#infomessagetype) |
| `target?` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:56](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L56)

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:53](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L53)
