[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/gcloud-secret-store](../README.md) / GoogleSecretStoreConfig

# Type Alias: GoogleSecretStoreConfig

> **GoogleSecretStoreConfig** = `object`

Defined in: [gcloud-secret-store/src/types.ts:6](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/types.ts#L6)

Google Secret Manager store config

## Properties

### client?

> `optional` **client**: `ClientOptions`

Defined in: [gcloud-secret-store/src/types.ts:15](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/types.ts#L15)

Google client options

***

### project

> **project**: `string`

Defined in: [gcloud-secret-store/src/types.ts:11](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/types.ts#L11)

The google project id in format of projects/* without ending /secrets

#### Example

```ts
projects/428371962963
```
