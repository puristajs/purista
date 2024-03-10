[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/aws-secret-store

# Module: @purista/aws-secret-store

The secret store adapter for AWS Secret Manager.
It will store, retrive, update or remove secrets in AWS Secret Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

**`Example`**

```typescript
const config = {
  region: 'us-east-1'
}

const store = new AWSSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Table of contents

### Classes

- [AWSSecretStore](../classes/purista_aws_secret_store.AWSSecretStore.md)

### Type Aliases

- [AWSSecretStoreConfig](purista_aws_secret_store.md#awssecretstoreconfig)

### Variables

- [puristaVersion](purista_aws_secret_store.md#puristaversion)

## Type Aliases

### AWSSecretStoreConfig

Ƭ **AWSSecretStoreConfig**: `Object`

AWS Secret Manager store config

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `client` | `SecretsManagerClientConfigType` | AWS client options |

#### Defined in

[aws-secret-store/src/types.ts:6](https://github.com/puristajs/purista/blob/master/packages/aws-secret-store/src/types.ts#L6)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.10.8"``

#### Defined in

[aws-secret-store/src/version.ts:1](https://github.com/puristajs/purista/blob/master/packages/aws-secret-store/src/version.ts#L1)
