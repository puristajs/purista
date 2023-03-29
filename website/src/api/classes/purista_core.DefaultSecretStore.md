[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultSecretStore

# Class: DefaultSecretStore

[@purista/core](../modules/purista_core.md).DefaultSecretStore

The DefaultSecretStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.

For development and testing purpose, you can initiate the store with values.

**`Example`**

```typescript
const store = new DefaultSecretStore({
 config: {
   secretOne: 'my_secret_one_value',
   secretTwo: 'my_secret_two_value',
 }
})
console.log(await store.getSecret('secretOne', 'secretTwo) // outputs: { secretOne: my_secret_one_value, secretTwo: 'my_secret_two_value' }
```
Per default, setting/changing and removal of values are disabled.
You can enable it on instance creation:

**`Example`**

```typescript
const store = new DefaultSecretStore({
 enableGet: true,
 enableRemove: true,
 enableSet: true,
})
```

## Hierarchy

- [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)<[`DefaultSecretStoreConfig`](../modules/purista_core.md#defaultsecretstoreconfig)\>

  ↳ **`DefaultSecretStore`**

## Implements

- [`SecretStore`](../interfaces/purista_core.SecretStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.DefaultSecretStore.md#constructor)

### Properties

- [config](purista_core.DefaultSecretStore.md#config)
- [logger](purista_core.DefaultSecretStore.md#logger)
- [map](purista_core.DefaultSecretStore.md#map)
- [name](purista_core.DefaultSecretStore.md#name)

### Methods

- [destroy](purista_core.DefaultSecretStore.md#destroy)
- [getSecret](purista_core.DefaultSecretStore.md#getsecret)
- [removeSecret](purista_core.DefaultSecretStore.md#removesecret)
- [setSecret](purista_core.DefaultSecretStore.md#setsecret)

## Constructors

### constructor

• **new DefaultSecretStore**(`config?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<[`DefaultSecretStoreConfig`](../modules/purista_core.md#defaultsecretstoreconfig)\> |

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[constructor](purista_core.SecretStoreBaseClass.md#constructor)

#### Defined in

[packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts:35](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L35)

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_core.md#storebaseconfig)<[`DefaultSecretStoreConfig`](../modules/purista_core.md#defaultsecretstoreconfig)\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[config](purista_core.SecretStoreBaseClass.md#config)

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L13)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[logger](purista_core.SecretStoreBaseClass.md#logger)

#### Defined in

[packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:12](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L12)

___

### map

• `Private` **map**: `Map`<`string`, `string`\>

#### Defined in

[packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts:34](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L34)

___

### name

• **name**: `string`

name of store

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[name](../interfaces/purista_core.SecretStore.md#name)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[name](purista_core.SecretStoreBaseClass.md#name)

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

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[destroy](purista_core.SecretStoreBaseClass.md#destroy)

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

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecret](purista_core.SecretStoreBaseClass.md#getsecret)

#### Defined in

[packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts:47](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L47)

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

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecret](purista_core.SecretStoreBaseClass.md#removesecret)

#### Defined in

[packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts:67](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L67)

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

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecret](purista_core.SecretStoreBaseClass.md#setsecret)

#### Defined in

[packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts:59](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L59)
