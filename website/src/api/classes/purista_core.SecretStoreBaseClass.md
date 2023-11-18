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
- [removeSecret](purista_core.SecretStoreBaseClass.md#removesecret)
- [setSecret](purista_core.SecretStoreBaseClass.md#setsecret)

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

[core/SecretStore/SecretStoreBaseClass.impl.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L19)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L17)

___

### config

• **config**: \{ [K in string \| number \| symbol]: (\{ [K in keyof (\{ enableGet?: boolean \| undefined; enableSet?: boolean \| undefined; enableRemove?: boolean \| undefined; logger?: Logger \| undefined; logLevel?: LogLevelName \| undefined; enableCache?: boolean \| undefined; cacheTtl?: number \| undefined; } & ConfigType)]: (\{ ...; } & ConfigType)[K]; })[K] }

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[name](../interfaces/purista_core.SecretStore.md#name)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[destroy](../interfaces/purista_core.SecretStore.md#destroy)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L70)

___

### getSecret

▸ **getSecret**(`..._secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Implementation of

SecretStore.getSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L34)

___

### removeSecret

▸ **removeSecret**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

SecretStore.removeSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:46](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L46)

___

### setSecret

▸ **setSecret**(`_secretName`, `_secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |
| `_secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

SecretStore.setSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:58](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L58)
