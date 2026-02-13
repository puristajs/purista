[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SecretStoreBaseClass

# Abstract Class: SecretStoreBaseClass\<SecretStoreConfigType\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L23)

Base class for secret store adapters
The actual store implementation must overwrite the protected methods:

- `getSecretImpl`
- `setSecretImpl`
- `removeSecretImpl`

__DO NOT OVERWRITE__: the regular methods getSecret, setSecret or removeSecret

## Extended by

- [`DefaultSecretStore`](DefaultSecretStore.md)
- [`AWSSecretStore`](../../aws-secret-store/classes/AWSSecretStore.md)
- [`AzureSecretStore`](../../azure-secret-store/classes/AzureSecretStore.md)
- [`DaprSecretStore`](../../dapr-sdk/classes/DaprSecretStore.md)
- [`GoogleSecretStore`](../../gcloud-secret-store/classes/GoogleSecretStore.md)
- [`InfisicalSecretStore`](../../infisical-secret-store/classes/InfisicalSecretStore.md)
- [`VaultSecretStore`](../../vault-secret-store/classes/VaultSecretStore.md)

## Type Parameters

### SecretStoreConfigType

`SecretStoreConfigType` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Constructors

### Constructor

> **new SecretStoreBaseClass**\<`SecretStoreConfigType`\>(`name`, `config`): `SecretStoreBaseClass`\<`SecretStoreConfigType`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L31)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & SecretStoreConfigType)\[K\] \}

#### Returns

`SecretStoreBaseClass`\<`SecretStoreConfigType`\>

## Properties

### cache

> **cache**: [`SecretStoreCacheMap`](../type-aliases/SecretStoreCacheMap.md)

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L29)

***

### config

> **config**: \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & SecretStoreConfigType)\[K\] \}\[K\] \}

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L25)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L24)

***

### name

> **name**: `string`

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L27)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:137](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L137)

#### Returns

`Promise`\<`void`\>

***

### getSecret()

> **getSecret**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L51)

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

***

### getSecretImpl()

> `abstract` `protected` **getSecretImpl**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L46)

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

***

### removeSecret()

> **removeSecret**(`secretName`): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L105)

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

***

### removeSecretImpl()

> `abstract` `protected` **removeSecretImpl**(`_secretName`): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:103](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L103)

#### Parameters

##### \_secretName

`string`

#### Returns

`Promise`\<`void`\>

***

### setSecret()

> **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:121](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L121)

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

***

### setSecretImpl()

> `abstract` `protected` **setSecretImpl**(`_secretName`, `_secretValue`): `Promise`\<`void`\>

Defined in: [core/SecretStore/SecretStoreBaseClass.impl.ts:119](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L119)

#### Parameters

##### \_secretName

`string`

##### \_secretValue

`string`

#### Returns

`Promise`\<`void`\>
