[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / SecretStoreBaseClass

# Class: SecretStoreBaseClass<ConfigType\>

[@purista/core](../modules/purista_core.md).SecretStoreBaseClass

Base class for secret store adapters

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`<`string`, `unknown`\> = {} |

## Hierarchy

- **`SecretStoreBaseClass`**

  ↳ [`DefaultSecretStore`](purista_core.DefaultSecretStore.md)

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

• **new SecretStoreBaseClass**<`ConfigType`\>(`name`, `config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config` | { [K in string \| number \| symbol]: (Object & ConfigType)[K] } |

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L17)

## Properties

### config

• **config**: { [K in string \| number \| symbol]: ({ [K in keyof ({ enableGet?: boolean \| undefined; enableSet?: boolean \| undefined; enableRemove?: boolean \| undefined; logger?: Logger \| undefined; logLevel?: LogLevelName \| undefined; } & ConfigType)]: ({ ...; } & ConfigType)[K]; })[K] }

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

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`<`void`\>

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[destroy](../interfaces/purista_core.SecretStore.md#destroy)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:67](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L67)

___

### getSecret

▸ **getSecret**(`..._secretNames`): `Promise`<`Record`<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._secretNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `undefined` \| `string`\>\>

#### Implementation of

SecretStore.getSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L31)

___

### removeSecret

▸ **removeSecret**(`_secretName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

SecretStore.removeSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L43)

___

### setSecret

▸ **setSecret**(`_secretName`, `_secretValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |
| `_secretValue` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

SecretStore.setSecret

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:55](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L55)
