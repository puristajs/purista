[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / SecretStoreBaseClass

# Class: SecretStoreBaseClass\<ConfigType\>

[@purista/core](../modules/purista_core.md).SecretStoreBaseClass

Base class for secret store adapters

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

## Hierarchy

- **`SecretStoreBaseClass`**

  ↳ [`DefaultSecretStore`](purista_core.DefaultSecretStore.md)

## Implements

- [`SecretStore`](../interfaces/purista_core.SecretStore.md)

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

• **new SecretStoreBaseClass**\<`ConfigType`\>(`name`, `config`): [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<`ConfigType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`\<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | \{ [K in string \| number \| symbol]: (Object & ConfigType)[K] } |

#### Returns

[`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<`ConfigType`\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L20)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L18)

___

### config

• **config**: \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: (Object & ConfigType)[K] }[K] }

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L14)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L13)

___

### name

• **name**: `string`

name of store

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[name](../interfaces/purista_core.SecretStore.md#name)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L16)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[destroy](../interfaces/purista_core.SecretStore.md#destroy)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:135](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L135)

___

### getSecret

▸ **getSecret**(`...secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Implementation of

SecretStore.getSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:41](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L41)

___

### getSecretImpl

▸ **getSecretImpl**(`..._secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L35)

___

### removeSecret

▸ **removeSecret**(`secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

SecretStore.removeSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:99](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L99)

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

[core/SecretStore/SecretStoreBaseClass.impl.ts:93](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L93)

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

#### Implementation of

SecretStore.setSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:119](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L119)

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

[core/SecretStore/SecretStoreBaseClass.impl.ts:113](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L113)
