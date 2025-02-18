[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ContentType

# Type Alias: ContentType

> **ContentType**: `"application/json"` \| `"application/javascript"` \| `"text/csv"` \| `"text/css"` \| `"text/html"` \| `"text/javascript"` \| `"text/markdown"` \| `"text/plain"` \| `"text/xml"` \| `string`

Defined in: [packages/core/src/core/types/ContentType.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContentType.ts#L6)

List of content types for message payloads.
If the content type is other than `application/json`, the message payload must be a string.
It is up to the implementation to extract the content type from the original message and to convert or transform data.
