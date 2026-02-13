[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/vault-secret-store](../README.md) / VaultSecretStoreConfig

# Type Alias: VaultSecretStoreConfig

> **VaultSecretStoreConfig** = `object`

Defined in: [vault-secret-store/src/types.ts:4](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/types.ts#L4)

HashiCorp Vault store config

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [vault-secret-store/src/types.ts:9](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/types.ts#L9)

Vault HTTP endpoint

#### Example

```ts
'http://localhost:8200'
```

***

### mount?

> `optional` **mount**: `string`

Defined in: [vault-secret-store/src/types.ts:18](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/types.ts#L18)

Secret engine mount path

#### Default

```ts
'secret'
```

***

### token

> **token**: `string`

Defined in: [vault-secret-store/src/types.ts:13](https://github.com/puristajs/purista/blob/master/packages/vault-secret-store/src/types.ts#L13)

Authentication token
