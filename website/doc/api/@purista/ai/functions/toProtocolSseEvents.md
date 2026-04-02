[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toProtocolSseEvents

# Function: toProtocolSseEvents()

> **toProtocolSseEvents**(`envelopes`, `protocol`): `AsyncGenerator`\<[`ProtocolSseEvent`](../type-aliases/ProtocolSseEvent.md)\>

Defined in: [packages/ai/src/protocol/sse.ts:16](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/sse.ts#L16)

Converts PURISTA protocol envelopes to protocol-specific SSE events.
This allows endpoint consumers to select an interoperable stream protocol
without app-layer custom adapters.

## Parameters

### envelopes

`object`[]

### protocol

`"ai-sdk-responses"` | `"ai-sdk-ui-message"` | `"ai-sdk-data"` | `"ai-sdk-json-render"` | `"agent2agent"` | `"mcp"`

## Returns

`AsyncGenerator`\<[`ProtocolSseEvent`](../type-aliases/ProtocolSseEvent.md)\>
