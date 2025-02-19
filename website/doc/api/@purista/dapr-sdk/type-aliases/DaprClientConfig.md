[**@purista/dapr-sdk v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprClientConfig

# Type Alias: DaprClientConfig

> **DaprClientConfig**: `object`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:1](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L1)

## Type declaration

### appPrefix?

> `optional` **appPrefix**: `string`

The prefix to generate the app-ID of other services.

#### Default

`app-`

### daprApiToken?

> `optional` **daprApiToken**: `string`

API token to authenticate with Dapr.
See https://docs.dapr.io/operations/security/api-token/.

### daprApiVersion

> **daprApiVersion**: `string`

The Dapr api version

#### Default

```ts
v1.0
```

### daprHost?

> `optional` **daprHost**: `string`

Host location of the Dapr sidecar.

#### Default

```ts
127.0.0.1
```

### daprPort?

> `optional` **daprPort**: `string`

Port of the Dapr sidecar.

#### Default

```ts
3500.
```

### isKeepAlive?

> `optional` **isKeepAlive**: `boolean`

If set to false, the HTTP client will not reuse the same connection for multiple requests.

#### Default

```ts
true
```

### pubSubName?

> `optional` **pubSubName**: `string`

The PubSub to be used for event messages

#### Default

```ts
pubsub
```
