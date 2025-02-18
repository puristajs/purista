[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SecretStoreBaseClass

# Class: `abstract` SecretStoreBaseClass\<SecretStoreConfigType\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L20)

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

## Type Parameters

• **SecretStoreConfigType** *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Constructors

### new SecretStoreBaseClass()

> **new SecretStoreBaseClass**\<`SecretStoreConfigType`\>(`name`, `config`): [`SecretStoreBaseClass`](SecretStoreBaseClass.md)\<`SecretStoreConfigType`\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L28)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & SecretStoreConfigType)\[K\] \}

#### Returns

[`SecretStoreBaseClass`](SecretStoreBaseClass.md)\<`SecretStoreConfigType`\>

## Properties

### cache

> **cache**: [`SecretStoreCacheMap`](../type-aliases/SecretStoreCacheMap.md)

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L26)

***

### config

> **config**: \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & SecretStoreConfigType)\[K\] \}\[K\] \}

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L22)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L21)

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L24)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:136](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L136)

#### Returns

`Promise`\<`void`\>

***

### getSecret()

> **getSecret**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L48)

#### Type Parameters

• **SecretNames** *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

***

### getSecretImpl()

> `abstract` `protected` **getSecretImpl**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L43)

#### Type Parameters

• **SecretNames** *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

***

### removeSecret()

> **removeSecret**(`secretName`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:104](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L104)

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

***

### removeSecretImpl()

> `abstract` `protected` **removeSecretImpl**(`_secretName`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:102](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L102)

#### Parameters

##### \_secretName

`string`

#### Returns

`Promise`\<`void`\>

***

### setSecret()

> **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:120](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L120)

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

Defined in: [packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts:118](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L118)

#### Parameters

##### \_secretName

`string`

##### \_secretValue

`string`

#### Returns

`Promise`\<`void`\>
