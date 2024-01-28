[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / DefaultSecretStore

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

- [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<[`DefaultSecretStoreConfig`](../modules/purista_core.md#defaultsecretstoreconfig)\>

  ↳ **`DefaultSecretStore`**

## Implements

- [`SecretStore`](../interfaces/purista_core.SecretStore.md)

## Table of contents

### Constructors

- [constructor](purista_core.DefaultSecretStore.md#constructor)

### Properties

- [cache](purista_core.DefaultSecretStore.md#cache)
- [config](purista_core.DefaultSecretStore.md#config)
- [logger](purista_core.DefaultSecretStore.md#logger)
- [map](purista_core.DefaultSecretStore.md#map)
- [name](purista_core.DefaultSecretStore.md#name)

### Methods

- [destroy](purista_core.DefaultSecretStore.md#destroy)
- [getSecret](purista_core.DefaultSecretStore.md#getsecret)
- [getSecretImpl](purista_core.DefaultSecretStore.md#getsecretimpl)
- [removeSecret](purista_core.DefaultSecretStore.md#removesecret)
- [removeSecretImpl](purista_core.DefaultSecretStore.md#removesecretimpl)
- [setSecret](purista_core.DefaultSecretStore.md#setsecret)
- [setSecretImpl](purista_core.DefaultSecretStore.md#setsecretimpl)

## Constructors

### constructor

• **new DefaultSecretStore**(`config?`): [`DefaultSecretStore`](purista_core.DefaultSecretStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Returns

[`DefaultSecretStore`](purista_core.DefaultSecretStore.md)

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[constructor](purista_core.SecretStoreBaseClass.md#constructor)

#### Defined in

[DefaultSecretStore/DefaultSecretStore.impl.ts:38](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L38)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[cache](purista_core.SecretStoreBaseClass.md#cache)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L18)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[config](purista_core.SecretStoreBaseClass.md#config)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L14)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[logger](purista_core.SecretStoreBaseClass.md#logger)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L13)

___

### map

• `Private` **map**: `Map`\<`string`, `string`\>

#### Defined in

[DefaultSecretStore/DefaultSecretStore.impl.ts:37](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L37)

___

### name

• **name**: `string`

name of store

#### Implementation of

[SecretStore](../interfaces/purista_core.SecretStore.md).[name](../interfaces/purista_core.SecretStore.md#name)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[name](purista_core.SecretStoreBaseClass.md#name)

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

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[destroy](purista_core.SecretStoreBaseClass.md#destroy)

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

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecret](purista_core.SecretStoreBaseClass.md#getsecret)

#### Defined in

[DefaultSecretStore/DefaultSecretStore.impl.ts:48](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L48)

___

### getSecretImpl

▸ **getSecretImpl**(`..._secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecretImpl](purista_core.SecretStoreBaseClass.md#getsecretimpl)

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

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecret](purista_core.SecretStoreBaseClass.md#removesecret)

#### Defined in

[DefaultSecretStore/DefaultSecretStore.impl.ts:68](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L68)

___

### removeSecretImpl

▸ **removeSecretImpl**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecretImpl](purista_core.SecretStoreBaseClass.md#removesecretimpl)

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

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecret](purista_core.SecretStoreBaseClass.md#setsecret)

#### Defined in

[DefaultSecretStore/DefaultSecretStore.impl.ts:60](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L60)

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

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecretImpl](purista_core.SecretStoreBaseClass.md#setsecretimpl)

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:113](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L113)
