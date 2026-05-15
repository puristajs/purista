[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / PubSubPublishOptions

# Type Alias: PubSubPublishOptions

> **PubSubPublishOptions** = `object`

Defined in: [dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts:16](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts#L16)

## Properties

### contentType?

> `optional` **contentType?**: `string`

Defined in: [dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts:21](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts#L21)

The content type of the message.
This is optional and will be inferred from the payload if not provided.

***

### metadata?

> `optional` **metadata?**: [`KeyValueType`](KeyValueType.md)

Defined in: [dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts:26](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/types/pubsub/PubSubPublishOptions.type.ts#L26)

Metadata to be passed to the publish operation.
