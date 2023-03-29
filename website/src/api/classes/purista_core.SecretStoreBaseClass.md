[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / SecretStoreBaseClass

# Class: SecretStoreBaseClass<ConfigType\>

[@purista/core](../modules/purista_core.md).SecretStoreBaseClass

Base class for secret store adapters

## Type parameters

| Name |
| :------ |
| `ConfigType` |

## Hierarchy

- **`SecretStoreBaseClass`**

  ↳ [`DefaultSecretStore`](purista_core.DefaultSecretStore.md)

## Implements

- [`SecretStore`](../interfaces/purista_core.SecretStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.SecretStoreBaseClass.md#constructor)

### Properties

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

• **new SecretStoreBaseClass**<`ConfigType`\>(`name`, `config?`)

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config?` | [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<`ConfigType`\> |

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:17](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L17)

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<`ConfigType`\>

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L12)

___

### name

• **name**: `string`

name of store

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[name](../interfaces/purista_core.SecretStore.md#name)

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:15](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L15)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`<`void`\>

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[destroy](../interfaces/purista_core.SecretStore.md#destroy)

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:64](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L64)

___

### getSecret

▸ **getSecret**(`...secretNames`): `Promise`<`Record`<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `undefined` \| `string`\>\>

#### Implementation of

SecretStore.getSecret

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:32](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L32)

___

### removeSecret

▸ **removeSecret**(`secretName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

SecretStore.removeSecret

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:43](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L43)

___

### setSecret

▸ **setSecret**(`secretName`, `secretValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

SecretStore.setSecret

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:54](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L54)
