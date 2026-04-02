[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/vault-secret-store](../README.md) / VaultSecretStore

# Class: VaultSecretStore

Defined in: [vault-secret-store/src/VaultSecretStore.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/VaultSecretStore.impl.ts#L32)

The secret store adapter for HashiCorp Vault.
It will store, retrieve, update or remove secrets in HashiCorp Vault.

## Extends

- [`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md)\<[`VaultSecretStoreConfig`](../type-aliases/VaultSecretStoreConfig.md)\>

## Constructors

### Constructor

> **new VaultSecretStore**(`config`): `VaultSecretStore`

Defined in: [vault-secret-store/src/VaultSecretStore.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/VaultSecretStore.impl.ts#L35)

#### Parameters

##### config

###### cacheTtl?

`number`

Cache time to live in ms

###### enableCache?

`boolean`

Enable cache

###### enableGet?

`boolean`

Enable generally get method

###### enableRemove?

`boolean`

Enable generally remove method

###### enableSet?

`boolean`

Enable generally set method

###### endpoint

`string`

Vault HTTP endpoint

**Example**

```ts
'http://localhost:8200'
```

###### logger?

[`Logger`](../../core/classes/Logger.md)

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

###### mount?

`string`

Secret engine mount path

**Default**

```ts
'secret'
```

###### token

`string`

Authentication token

#### Returns

`VaultSecretStore`

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`constructor`](../../core/classes/SecretStoreBaseClass.md#constructor)

## Properties

### cache

> **cache**: [`SecretStoreCacheMap`](../../core/type-aliases/SecretStoreCacheMap.md)

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:23

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`cache`](../../core/classes/SecretStoreBaseClass.md#cache)

***

### client

> **client**: `client`

Defined in: [vault-secret-store/src/VaultSecretStore.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/VaultSecretStore.impl.ts#L33)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:21

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### enableCache?

> `optional` **enableCache**: `boolean`

Enable cache

#### enableGet?

> `optional` **enableGet**: `boolean`

Enable generally get method

#### enableRemove?

> `optional` **enableRemove**: `boolean`

Enable generally remove method

#### enableSet?

> `optional` **enableSet**: `boolean`

Enable generally set method

#### endpoint

> **endpoint**: `string`

Vault HTTP endpoint

##### Example

```ts
'http://localhost:8200'
```

#### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

#### mount?

> `optional` **mount**: `string`

Secret engine mount path

##### Default

```ts
'secret'
```

#### token

> **token**: `string`

Authentication token

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`config`](../../core/classes/SecretStoreBaseClass.md#config)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`logger`](../../core/classes/SecretStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:22

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`name`](../../core/classes/SecretStoreBaseClass.md#name)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:31

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`destroy`](../../core/classes/SecretStoreBaseClass.md#destroy)

***

### getSecret()

> **getSecret**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:26

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`getSecret`](../../core/classes/SecretStoreBaseClass.md#getsecret)

***

### getSecretImpl()

> `protected` **getSecretImpl**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: [vault-secret-store/src/VaultSecretStore.impl.ts:54](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/VaultSecretStore.impl.ts#L54)

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`getSecretImpl`](../../core/classes/SecretStoreBaseClass.md#getsecretimpl)

***

### removeSecret()

> **removeSecret**(`secretName`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:28

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`removeSecret`](../../core/classes/SecretStoreBaseClass.md#removesecret)

***

### removeSecretImpl()

> `protected` **removeSecretImpl**(`secretName`): `Promise`\<`void`\>

Defined in: [vault-secret-store/src/VaultSecretStore.impl.ts:76](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/VaultSecretStore.impl.ts#L76)

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`removeSecretImpl`](../../core/classes/SecretStoreBaseClass.md#removesecretimpl)

***

### setSecret()

> **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:30

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`setSecret`](../../core/classes/SecretStoreBaseClass.md#setsecret)

***

### setSecretImpl()

> `protected` **setSecretImpl**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: [vault-secret-store/src/VaultSecretStore.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/VaultSecretStore.impl.ts#L87)

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`setSecretImpl`](../../core/classes/SecretStoreBaseClass.md#setsecretimpl)
