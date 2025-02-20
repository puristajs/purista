[**@purista/dapr-sdk v2.0.5**](README.md)

***

[PURISTA API](../../packages.md) / @purista/dapr-sdk

# @purista/dapr-sdk

SDK and helper to run PURISTA services in Kubernetes.

This package provides the Dapr event bridge and adapters for secret, state and config stores provided by Dapr.

Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.

## Example

```typescript
import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'
const eventBridge = new DaprEventBridge({
   spanProcessor,
   logger,
   serve,
 })

const secretStore = new DaprSecretStore({ logger, secretStoreName: 'local-secret-store' })
const stateStore = new DaprStateStore({ logger, stateStoreName: 'local-state-store' })
const configStore = new DaprConfigStore({ logger, configStoreName: 'local-config-store' })

// start the services ...

await eventBridge.start()
```

## Enumerations

- [DaprPubSubStatusEnum](enumerations/DaprPubSubStatusEnum.md)

## Classes

- [DaprClient](classes/DaprClient.md)
- [DaprConfigStore](classes/DaprConfigStore.md)
- [DaprSecretStore](classes/DaprSecretStore.md)
- [DaprStateStore](classes/DaprStateStore.md)

## Type Aliases

- [BulkSubscribeConfig](type-aliases/BulkSubscribeConfig.md)
- [BulkSubscribeOptions](type-aliases/BulkSubscribeOptions.md)
- [BulkSubscribeResponse](type-aliases/BulkSubscribeResponse.md)
- [BulkSubscribeResponseEntry](type-aliases/BulkSubscribeResponseEntry.md)
- [DaprClientConfig](type-aliases/DaprClientConfig.md)
- [DaprConfigStoreConfig](type-aliases/DaprConfigStoreConfig.md)
- [DaprEventBridgeConfig](type-aliases/DaprEventBridgeConfig.md)
- [DaprPubSubRouteType](type-aliases/DaprPubSubRouteType.md)
- [DaprPubSubRuleType](type-aliases/DaprPubSubRuleType.md)
- [DaprPubSubType](type-aliases/DaprPubSubType.md)
- [DaprSecretStoreConfig](type-aliases/DaprSecretStoreConfig.md)
- [DaprStateStoreConfig](type-aliases/DaprStateStoreConfig.md)
- [KeyValueType](type-aliases/KeyValueType.md)
- [PubSubBulkPublishApiResponse](type-aliases/PubSubBulkPublishApiResponse.md)
- [PubSubBulkPublishEntry](type-aliases/PubSubBulkPublishEntry.md)
- [PubSubBulkPublishMessage](type-aliases/PubSubBulkPublishMessage.md)
- [PubSubBulkPublishResponse](type-aliases/PubSubBulkPublishResponse.md)
- [PubSubPublishOptions](type-aliases/PubSubPublishOptions.md)
- [PubSubPublishResponseType](type-aliases/PubSubPublishResponseType.md)
- [PubSubSubscriptionOptionsType](type-aliases/PubSubSubscriptionOptionsType.md)
- [PubSubSubscriptionsType](type-aliases/PubSubSubscriptionsType.md)
- [PubSubSubscriptionTopicRoutesType](type-aliases/PubSubSubscriptionTopicRoutesType.md)
- [PubSubSubscriptionTopicRouteType](type-aliases/PubSubSubscriptionTopicRouteType.md)
- [PubSubSubscriptionTopicType](type-aliases/PubSubSubscriptionTopicType.md)
- [PubSubSubscriptionType](type-aliases/PubSubSubscriptionType.md)
- [TypeDaprPubSubCallback](type-aliases/TypeDaprPubSubCallback.md)

## Variables

- [DAPR\_API\_VERSION](variables/DAPR_API_VERSION.md)
- [DEFAULT\_DAPR\_HOST](variables/DEFAULT_DAPR_HOST.md)
- [DEFAULT\_DAPR\_PORT](variables/DEFAULT_DAPR_PORT.md)
- [puristaVersion](variables/puristaVersion.md)

## Functions

- [configRoute](functions/configRoute.md)
- [getDefaultClientConfig](functions/getDefaultClientConfig.md)
- [getDefaultConfig](functions/getDefaultConfig.md)

## Event bridge

- [DaprEventBridge](classes/DaprEventBridge.md)
