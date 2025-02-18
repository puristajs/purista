[**@purista/dapr-sdk v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprPubSubType

# Type Alias: DaprPubSubType

> **DaprPubSubType**: `object`

Defined in: [dapr-sdk/src/types/pubsub/DaprPubSub.type.ts:22](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/DaprPubSub.type.ts#L22)

DaprPubSubType is the Type used by the Dapr API to interface with its PubSub component

## Type declaration

### bulkSubscribe?

> `optional` **bulkSubscribe**: [`BulkSubscribeConfig`](BulkSubscribeConfig.md)

### deadLetterTopic?

> `optional` **deadLetterTopic**: `string`

### metadata?

> `optional` **metadata**: [`KeyValueType`](KeyValueType.md)

### pubsubname

> **pubsubname**: `string`

### route?

> `optional` **route**: `string`

### routes?

> `optional` **routes**: [`DaprPubSubRouteType`](DaprPubSubRouteType.md)

### topic

> **topic**: `string`
