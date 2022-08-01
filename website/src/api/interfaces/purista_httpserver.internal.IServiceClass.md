[PURISTA API - v1.4.3](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / IServiceClass

# Interface: IServiceClass

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).IServiceClass

## Implemented by

- [`Service`](../classes/purista_httpserver.internal.Service.md)

## Table of contents

### Accessors

- [serviceInfo](purista_httpserver.internal.IServiceClass.md#serviceinfo)

### Methods

- [destroy](purista_httpserver.internal.IServiceClass.md#destroy)
- [sendServiceInfo](purista_httpserver.internal.IServiceClass.md#sendserviceinfo)
- [start](purista_httpserver.internal.IServiceClass.md#start)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Returns

[`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:49

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:47

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `data?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_httpserver.internal.md#infomessagetype) |
| `target?` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\>\>

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:50

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:48
