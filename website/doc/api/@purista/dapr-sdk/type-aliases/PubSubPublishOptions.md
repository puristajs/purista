[**@purista/dapr-sdk v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / PubSubPublishOptions

# Type Alias: PubSubPublishOptions

> **PubSubPublishOptions**: `object`

Defined in: [dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts:16](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts#L16)

## Type declaration

### contentType?

> `optional` **contentType**: `string`

The content type of the message.
This is optional and will be inferred from the payload if not provided.

### metadata?

> `optional` **metadata**: [`KeyValueType`](KeyValueType.md)

Metadata to be passed to the publish operation.
