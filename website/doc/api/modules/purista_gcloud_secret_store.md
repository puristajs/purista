[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/gcloud-secret-store

# Module: @purista/gcloud-secret-store

The secret store adapter for Google Secret Manager.
It will store, retrive, update or remove secrets in Google Secret Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

**`Example`**

```typescript
const config = {
  projectId: 'project/MY_GOOGLE_PROJECT_ID'
}

const store = new GoogleSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Table of contents

### Classes

- [GoogleSecretStore](../classes/purista_gcloud_secret_store.GoogleSecretStore.md)

### Type Aliases

- [GoogleSecretStoreConfig](purista_gcloud_secret_store.md#googlesecretstoreconfig)

### Variables

- [puristaVersion](purista_gcloud_secret_store.md#puristaversion)

## Type Aliases

### GoogleSecretStoreConfig

Ƭ **GoogleSecretStoreConfig**: `Object`

Google Secret Manager store config

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `client?` | `ClientOptions` | Google client options |
| `project` | `string` | The google project id in format of projects/* without ending /secrets **`Example`** ```ts projects/428371962963 ``` |

#### Defined in

[gcloud-secret-store/src/types.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/gcloud-secret-store/src/types.ts#L6)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.10.6"``

#### Defined in

[gcloud-secret-store/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/gcloud-secret-store/src/version.ts#L1)
