[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / SecretStoreBaseClass

# Class: SecretStoreBaseClass\<SecretStoreConfigType\>

[@purista/core](../modules/purista_core.md).SecretStoreBaseClass

Base class for secret store adapters
The actual store implementation must overwrite the protected methods:

- `getSecretImpl`
- `setSecretImpl`
- `removeSecretImpl`

__DO NOT OVERWRITE__: the regular methods getSecret, setSecret or removeSecret

## Type parameters

| Name | Type |
| :------ | :------ |
| `SecretStoreConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

## Hierarchy

- **`SecretStoreBaseClass`**

  ↳ [`DefaultSecretStore`](purista_core.DefaultSecretStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.SecretStoreBaseClass.md#constructor)

### Properties

- [cache](purista_core.SecretStoreBaseClass.md#cache)
- [config](purista_core.SecretStoreBaseClass.md#config)
- [logger](purista_core.SecretStoreBaseClass.md#logger)
- [name](purista_core.SecretStoreBaseClass.md#name)

### Methods

- [destroy](purista_core.SecretStoreBaseClass.md#destroy)
- [getSecret](purista_core.SecretStoreBaseClass.md#getsecret)
- [getSecretImpl](purista_core.SecretStoreBaseClass.md#getsecretimpl)
- [removeSecret](purista_core.SecretStoreBaseClass.md#removesecret)
- [removeSecretImpl](purista_core.SecretStoreBaseClass.md#removesecretimpl)
- [setSecret](purista_core.SecretStoreBaseClass.md#setsecret)
- [setSecretImpl](purista_core.SecretStoreBaseClass.md#setsecretimpl)

## Constructors

### constructor

• **new SecretStoreBaseClass**\<`SecretStoreConfigType`\>(`name`, `config`): [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<`SecretStoreConfigType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SecretStoreConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | \{ [K in string \| number \| symbol]: (Object & SecretStoreConfigType)[K] } |

#### Returns

[`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<`SecretStoreConfigType`\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:28](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L28)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L26)

___

### config

• **config**: \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: (Object & SecretStoreConfigType)[K] }[K] }

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L22)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L21)

___

### name

• **name**: `string`

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L24)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:136](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L136)

___

### getSecret

▸ **getSecret**\<`SecretNames`\>(`...secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SecretNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `SecretNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:48](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L48)

___

### getSecretImpl

▸ **getSecretImpl**\<`SecretNames`\>(`...secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SecretNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `SecretNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L43)

___

### removeSecret

▸ **removeSecret**(`secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:104](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L104)

___

### removeSecretImpl

▸ **removeSecretImpl**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:102](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L102)

___

### setSecret

▸ **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:120](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L120)

___

### setSecretImpl

▸ **setSecretImpl**(`_secretName`, `_secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |
| `_secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:118](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L118)
