[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ToAiSdkUiMessageOptions

# Type Alias: ToAiSdkUiMessageOptions

> **ToAiSdkUiMessageOptions** = `object`

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:53](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/aiSdkStream.ts#L53)

## Properties

### emitMessageMetadata?

> `optional` **emitMessageMetadata**: `boolean`

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:58](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/aiSdkStream.ts#L58)

When `true` (default), non-message frames are also emitted as `message-metadata`.
Set to `false` when consumers only want explicit mapped data parts.

***

### errorMode?

> `optional` **errorMode**: `"auto"` \| `"error-event"` \| `"data-part"`

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:72](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/aiSdkStream.ts#L72)

Controls how protocol `error` frames are represented in UI-message streams.

- `auto` (default): handled errors become `data-agent-error` parts; unhandled errors emit `error`.
- `error-event`: always emit `error` and terminate stream.
- `data-part`: always emit `data-agent-error` and keep stream lifecycle events.

***

### mapDataParts?

> `optional` **mapDataParts**: [`AiSdkUiDataPartMapper`](AiSdkUiDataPartMapper.md)

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:64](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/aiSdkStream.ts#L64)

Optional mapping hook to emit typed `data-*` parts for application-specific UI state.
This is useful for custom dashboards (status, artifacts, tickets, etc.) while still
using the built-in protocol conversion for text/error lifecycle events.
