[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/infisical-secret-store

# Module: @purista/infisical-secret-store

A secret store for using [Infisical](https://infisical.com/) as storage.

**`Example`**

```typescript
const config = {
  url: 'redis://alice:foobared@awesome.redis.server:6380'
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
- [Secret](purista_infisical_secret_store.md#secret)
- [TokenData](purista_infisical_secret_store.md#tokendata)

## Type Aliases

### ClientConfig

Ƭ **ClientConfig**: `Prettify`<`Required`<`Pick`<`HttpClientConfig`<[`HttpClientConfigCustom`](purista_infisical_secret_store.md#httpclientconfigcustom)\>, ``"bearerToken"``\>\> & `Omit`<`HttpClientConfig`<[`HttpClientConfigCustom`](purista_infisical_secret_store.md#httpclientconfigcustom)\>, ``"bearerToken"``\>\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts#L5)

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

[infisical-secret-store/src/InfisicalClient/types/DecryptInput.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/DecryptInput.ts#L1)

___

### EncryptInput

Ƭ **EncryptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `secret` | `string` |
| `text` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/EncryptInput.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/EncryptInput.ts#L1)

___

### HttpClientConfigCustom

Ƭ **HttpClientConfigCustom**: `Object`

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts#L3)

___

### InfisicalSecretConfig

Ƭ **InfisicalSecretConfig**: [`ClientConfig`](purista_infisical_secret_store.md#clientconfig)

#### Defined in

[infisical-secret-store/src/types.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/types.ts#L3)

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

[infisical-secret-store/src/InfisicalClient/types/Secret.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/Secret.ts#L1)

___

### TokenData

Ƭ **TokenData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `createdAt` | `string` |
| `encryptedKey` | `string` |
| `environment` | `string` |
| `expiresAt` | `Date` |
| `iv` | `string` |
| `lastUsed` | `Date` |
| `name` | `string` |
| `serviceAccount` | `string` |
| `tag` | `string` |
| `updatedAt` | `string` |
| `user` | `string` |
| `workspace` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/types/TokenData.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/TokenData.ts#L1)
