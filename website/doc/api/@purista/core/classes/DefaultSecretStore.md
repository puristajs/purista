[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultSecretStore

# Class: DefaultSecretStore

Defined in: [DefaultSecretStore/DefaultSecretStore.impl.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L38)

The DefaultSecretStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.

For development and testing purpose, you can initiate the store with values.

## Examples

```typescript
const store = new DefaultSecretStore({
 config: {
   secretOne: 'my_secret_one_value',
   secretTwo: 'my_secret_two_value',
 }
})
console.log(await store.getSecret('secretOne', 'secretTwo) // outputs: { secretOne: my_secret_one_value, secretTwo: 'my_secret_two_value' }
```
By default, setting/changing and removal of values are disabled.
You can enable it on instance creation:

```typescript
const store = new DefaultSecretStore({
 enableGet: true,
 enableRemove: true,
 enableSet: true,
})
```

## Extends

- [`SecretStoreBaseClass`](SecretStoreBaseClass.md)\<[`DefaultSecretStoreConfig`](../type-aliases/DefaultSecretStoreConfig.md)\>

## Implements

- [`SecretStore`](../interfaces/SecretStore.md)

## Constructors

### Constructor

> **new DefaultSecretStore**(`config?`): `DefaultSecretStore`

Defined in: [DefaultSecretStore/DefaultSecretStore.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L40)

#### Parameters

##### config?

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

###### logger?

[`Logger`](Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### Returns

`DefaultSecretStore`

#### Overrides

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`constructor`](SecretStoreBaseClass.md#constructor)

## Properties

### cache

> **cache**: [`SecretStoreCacheMap`](../type-aliases/SecretStoreCacheMap.md)

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L29)

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`cache`](SecretStoreBaseClass.md#cache)

***

### config

> **config**: `object`

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L25)

#### Index Signature

\[`key`: `string`\]: `unknown`

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

#### logger?

> `optional` **logger**: [`Logger`](Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`config`](SecretStoreBaseClass.md#config)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L24)

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`logger`](SecretStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L27)

name of store

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`name`](../interfaces/SecretStore.md#name)

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`name`](SecretStoreBaseClass.md#name)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:137](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L137)

disconnects and shuts down the secret store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`destroy`](../interfaces/SecretStore.md#destroy)

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`destroy`](SecretStoreBaseClass.md#destroy)

***

### getSecret()

> **getSecret**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L51)

get a secret

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

#### Param

name of secret

#### Throws

UnhandledError

#### Implementation of

`SecretStore.getSecret`

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`getSecret`](SecretStoreBaseClass.md#getsecret)

***

### getSecretImpl()

> `protected` **getSecretImpl**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: [DefaultSecretStore/DefaultSecretStore.impl.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L50)

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

#### Overrides

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`getSecretImpl`](SecretStoreBaseClass.md#getsecretimpl)

***

### removeSecret()

> **removeSecret**(`secretName`): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L105)

delete a secret

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Param

name of secret

#### Throws

UnhandledError

#### Implementation of

`SecretStore.removeSecret`

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`removeSecret`](SecretStoreBaseClass.md#removesecret)

***

### removeSecretImpl()

> `protected` **removeSecretImpl**(`secretName`): `Promise`\<`void`\>

Defined in: [DefaultSecretStore/DefaultSecretStore.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L65)

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`removeSecretImpl`](SecretStoreBaseClass.md#removesecretimpl)

***

### setSecret()

> **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:121](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L121)

set a secret

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Param

name of secret

#### Param

value of secret

#### Throws

UnhandledError

#### Implementation of

`SecretStore.setSecret`

#### Inherited from

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`setSecret`](SecretStoreBaseClass.md#setsecret)

***

### setSecretImpl()

> `protected` **setSecretImpl**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: [DefaultSecretStore/DefaultSecretStore.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L61)

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](SecretStoreBaseClass.md).[`setSecretImpl`](SecretStoreBaseClass.md#setsecretimpl)
