[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/infisical-secret-store

# Module: @purista/infisical-secret-store

A secret store for using [Infisical](https://infisical.com/) as storage.  

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.  
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).  

This will return the cached secret if available and if ttl is not exceeded.  
If a secret value exceeds the ttl, it does not automatically get removed from cache.  
It will be removed/overwritten on next get request.

**`Example`**

```typescript
const config = {
  bearerToken: 'YOUR_INFISICAL_TOKEN',
  baseUrl: 'https://app.infisical.com'
}

const store = new InfisicalSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Table of contents

### Classes

- [InfisicalClient](../classes/purista_infisical_secret_store.InfisicalClient.md)
- [InfisicalSecretStore](../classes/purista_infisical_secret_store.InfisicalSecretStore.md)

### Type Aliases

- [ClientConfig](purista_infisical_secret_store.md#clientconfig)
- [DecryptInput](purista_infisical_secret_store.md#decryptinput)
- [EncryptInput](purista_infisical_secret_store.md#encryptinput)
- [HttpClientConfigCustom](purista_infisical_secret_store.md#httpclientconfigcustom)
- [InfisicalSecretConfig](purista_infisical_secret_store.md#infisicalsecretconfig)
- [Scope](purista_infisical_secret_store.md#scope)
- [Secret](purista_infisical_secret_store.md#secret)
- [TokenData](purista_infisical_secret_store.md#tokendata)

### Variables

- [puristaVersion](purista_infisical_secret_store.md#puristaversion)

## Type Aliases

### ClientConfig

Ƭ **ClientConfig**: [`Prettify`](purista_core.md#prettify)\<`Required`\<`Pick`\<[`HttpClientConfig`](purista_core.md#httpclientconfig)\<[`HttpClientConfigCustom`](purista_infisical_secret_store.md#httpclientconfigcustom)\>, ``"bearerToken"``\>\> & `Omit`\<[`HttpClientConfig`](purista_core.md#httpclientconfig)\<[`HttpClientConfigCustom`](purista_infisical_secret_store.md#httpclientconfigcustom)\>, ``"bearerToken"``\>\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts:5](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts#L5)

___

### DecryptInput

Ƭ **DecryptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ciphertext` | `string` |
| `iv` | `string` |
| `secret` | `string` |
| `tag` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/DecryptInput.ts:1](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/DecryptInput.ts#L1)

___

### EncryptInput

Ƭ **EncryptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `secret` | `string` |
| `text` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/EncryptInput.ts:1](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/EncryptInput.ts#L1)

___

### HttpClientConfigCustom

Ƭ **HttpClientConfigCustom**: `Object`

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts:3](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts#L3)

___

### InfisicalSecretConfig

Ƭ **InfisicalSecretConfig**: [`ClientConfig`](purista_infisical_secret_store.md#clientconfig)

#### Defined in

[infisical-secret-store/src/types.ts:3](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/types.ts#L3)

___

### Scope

Ƭ **Scope**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `environment` | `string` |
| `secretPath` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/Scope.ts:1](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/Scope.ts#L1)

___

### Secret

Ƭ **Secret**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `createdAt` | `string` |
| `environment` | `string` |
| `secretCommentCiphertext?` | `string` |
| `secretCommentIV?` | `string` |
| `secretCommentTag?` | `string` |
| `secretKeyCiphertext` | `string` |
| `secretKeyIV` | `string` |
| `secretKeyTag` | `string` |
| `secretValueCiphertext` | `string` |
| `secretValueIV` | `string` |
| `secretValueTag` | `string` |
| `type` | ``"shared"`` \| ``"personal"`` |
| `updatedAt` | `string` |
| `user?` | `string` |
| `version` | `number` |
| `workspace` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/Secret.ts:1](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/Secret.ts#L1)

___

### TokenData

Ƭ **TokenData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `createdAt` | `string` |
| `encryptedKey` | `string` |
| `expiresAt` | `Date` |
| `iv` | `string` |
| `lastUsed` | `Date` |
| `name` | `string` |
| `permissions` | `string`[] |
| `scopes` | [`Scope`](purista_infisical_secret_store.md#scope)[] |
| `serviceAccount` | `string` |
| `tag` | `string` |
| `updatedAt` | `string` |
| `user` | \{ `_id`: `string` ; `authMethods`: `string`[] ; `email`: `string` ; `firstName`: `string` ; `lastName`: `string`  } |
| `user._id` | `string` |
| `user.authMethods` | `string`[] |
| `user.email` | `string` |
| `user.firstName` | `string` |
| `user.lastName` | `string` |
| `workspace` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/TokenData.ts:3](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/TokenData.ts#L3)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.10.8"``

#### Defined in

[infisical-secret-store/src/version.ts:1](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/version.ts#L1)
