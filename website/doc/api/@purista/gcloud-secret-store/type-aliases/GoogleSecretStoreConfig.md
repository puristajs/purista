[**@purista/gcloud-secret-store v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/gcloud-secret-store](../README.md) / GoogleSecretStoreConfig

# Type Alias: GoogleSecretStoreConfig

> **GoogleSecretStoreConfig**: `object`

Defined in: [gcloud-secret-store/src/types.ts:6](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/types.ts#L6)

Google Secret Manager store config

## Type declaration

### client?

> `optional` **client**: `ClientOptions`

Google client options

### project

> **project**: `string`

The google project id in format of projects/* without ending /secrets

#### Example

```ts
projects/428371962963
```
