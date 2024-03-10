[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/aws-config-store

# Module: @purista/aws-config-store

The config store adapter for AWS System Manager.
It will store, retrive, update or remove configs in AWS System Manager.

For performance reasons, and to reduce costs, the config values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached config values via config cacheTtl (in ms).

This will return the cached config if available and if ttl is not exceeded.
If a config value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

**`Example`**

```typescript
const config = {
  region: 'us-east-1'
}

const store = new AWSConfigStore({ config })

await store.setConfig('myConfig', 'value')

let value = await store.getConfig('myConfig')
console.log(value) // outputs: { myConfig: 'value' }

await store.removeConfig('myConfig')

value = await store.getConfig('myConfig')
console.log(value) // outputs: undefined

```

## Table of contents

### Classes

- [AWSConfigStore](../classes/purista_aws_config_store.AWSConfigStore.md)

### Type Aliases

- [AWSConfigStoreConfig](purista_aws_config_store.md#awsconfigstoreconfig)

### Variables

- [puristaVersion](purista_aws_config_store.md#puristaversion)

## Type Aliases

### AWSConfigStoreConfig

Ƭ **AWSConfigStoreConfig**: `Object`

AWS System Manager config

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `client` | `SSMClientConfig` | AWS client options |

#### Defined in

[aws-config-store/src/types.ts:6](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/types.ts#L6)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.10.8"``

#### Defined in

[aws-config-store/src/version.ts:1](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/version.ts#L1)
