[**@purista/dapr-sdk v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / PubSubSubscriptionOptionsType

# Type Alias: PubSubSubscriptionOptionsType

> **PubSubSubscriptionOptionsType**: `object`

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:22](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L22)

PubSubSubscriptionOptionsType defines the options we can pass while subscribing

## Type declaration

### bulkSubscribe?

> `optional` **bulkSubscribe**: [`BulkSubscribeConfig`](BulkSubscribeConfig.md)

### callback?

> `optional` **callback**: [`TypeDaprPubSubCallback`](TypeDaprPubSubCallback.md)

### deadLetterCallback?

> `optional` **deadLetterCallback**: [`TypeDaprPubSubCallback`](TypeDaprPubSubCallback.md)

### deadLetterTopic?

> `optional` **deadLetterTopic**: `string`

### metadata?

> `optional` **metadata**: [`KeyValueType`](KeyValueType.md)

### route?

> `optional` **route**: `string` \| [`DaprPubSubRouteType`](DaprPubSubRouteType.md)
