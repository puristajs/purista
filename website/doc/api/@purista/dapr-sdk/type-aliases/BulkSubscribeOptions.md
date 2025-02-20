[**@purista/dapr-sdk v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / BulkSubscribeOptions

# Type Alias: BulkSubscribeOptions

> **BulkSubscribeOptions**: `object`

Defined in: [dapr-sdk/src/types/pubsub/BulkSubscribeOptions.type.ts:20](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/BulkSubscribeOptions.type.ts#L20)

BulkSubscribeOptions enlists the options for bulk subscribe

## Type declaration

### maxAwaitDurationMs?

> `optional` **maxAwaitDurationMs**: `number`

### maxMessagesCount?

> `optional` **maxMessagesCount**: `number`

### metadata?

> `optional` **metadata**: [`KeyValueType`](KeyValueType.md)

### route?

> `optional` **route**: `string` \| [`DaprPubSubRouteType`](DaprPubSubRouteType.md)
