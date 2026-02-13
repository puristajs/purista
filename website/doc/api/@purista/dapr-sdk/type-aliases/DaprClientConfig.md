[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprClientConfig

# Type Alias: DaprClientConfig

> **DaprClientConfig** = `object`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:1](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L1)

## Properties

### appPrefix?

> `optional` **appPrefix**: `string`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:22](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L22)

The prefix to generate the app-ID of other services.

#### Default

`app-`

***

### daprApiToken?

> `optional` **daprApiToken**: `string`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:28](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L28)

API token to authenticate with Dapr.
See https://docs.dapr.io/operations/security/api-token/.

***

### daprApiVersion

> **daprApiVersion**: `string`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:6](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L6)

The Dapr api version

#### Default

```ts
v1.0
```

***

### daprHost?

> `optional` **daprHost**: `string`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:11](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L11)

Host location of the Dapr sidecar.

#### Default

```ts
127.0.0.1
```

***

### daprPort?

> `optional` **daprPort**: `string`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:16](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L16)

Port of the Dapr sidecar.

#### Default

```ts
3500.
```

***

### isKeepAlive?

> `optional` **isKeepAlive**: `boolean`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:34](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L34)

If set to false, the HTTP client will not reuse the same connection for multiple requests.

#### Default

```ts
true
```

***

### pubSubName?

> `optional` **pubSubName**: `string`

Defined in: [dapr-sdk/src/DaprClient/types/DaprClientConfig.ts:40](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprClient/types/DaprClientConfig.ts#L40)

The PubSub to be used for event messages

#### Default

```ts
pubsub
```
