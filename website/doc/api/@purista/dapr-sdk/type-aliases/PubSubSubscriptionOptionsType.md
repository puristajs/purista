[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / PubSubSubscriptionOptionsType

# Type Alias: PubSubSubscriptionOptionsType

> **PubSubSubscriptionOptionsType** = `object`

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:22](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L22)

PubSubSubscriptionOptionsType defines the options we can pass while subscribing

## Properties

### bulkSubscribe?

> `optional` **bulkSubscribe?**: [`BulkSubscribeConfig`](BulkSubscribeConfig.md)

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:39](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L39)

***

### callback?

> `optional` **callback?**: [`TypeDaprPubSubCallback`](TypeDaprPubSubCallback.md)

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:33](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L33)

***

### deadLetterCallback?

> `optional` **deadLetterCallback?**: [`TypeDaprPubSubCallback`](TypeDaprPubSubCallback.md)

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:30](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L30)

***

### deadLetterTopic?

> `optional` **deadLetterTopic?**: `string`

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:27](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L27)

***

### metadata?

> `optional` **metadata?**: [`KeyValueType`](KeyValueType.md)

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:24](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L24)

***

### route?

> `optional` **route?**: `string` \| [`DaprPubSubRouteType`](DaprPubSubRouteType.md)

Defined in: [dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts:36](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubSubscriptionOptions.type.ts#L36)
