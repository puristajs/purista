[**@purista/dapr-sdk v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / getDefaultConfig

# Function: getDefaultConfig()

> **getDefaultConfig**(): `object`

Defined in: [dapr-sdk/src/DaprEventBridge/getDefaultConfig.impl.ts:3](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/getDefaultConfig.impl.ts#L3)

## Returns

`object`

### apiPrefix

> **apiPrefix**: `string` = `'api'`

### clientConfig

> **clientConfig**: `object`

#### clientConfig.appPrefix

> **clientConfig.appPrefix**: `string` = `'app-'`

#### clientConfig.daprApiToken

> **clientConfig.daprApiToken**: `undefined` = `undefined`

#### clientConfig.daprApiVersion

> **clientConfig.daprApiVersion**: `string` = `DAPR_API_VERSION`

#### clientConfig.daprHost

> **clientConfig.daprHost**: `string`

#### clientConfig.daprPort

> **clientConfig.daprPort**: `string`

#### clientConfig.isKeepAlive

> **clientConfig.isKeepAlive**: `boolean` = `true`

#### clientConfig.pubSubName

> **clientConfig.pubSubName**: `string` = `'pubsub'`

### commandPayloadAsCloudEvent

> **commandPayloadAsCloudEvent**: `boolean` = `false`

### enableRestApiExpose

> **enableRestApiExpose**: `boolean` = `true`

### name

> **name**: `string` = `'DaprEventBridge'`

### pathPrefix

> **pathPrefix**: `string` = `'purista'`

### serverHost

> **serverHost**: `string`

### serverPort

> **serverPort**: `number`

### subscriptionPayloadAsCloudEvent

> **subscriptionPayloadAsCloudEvent**: `boolean` = `true`
