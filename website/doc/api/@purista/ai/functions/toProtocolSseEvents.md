[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toProtocolSseEvents

# Function: toProtocolSseEvents()

> **toProtocolSseEvents**(`envelopes`, `protocol`): `AsyncGenerator`\<[`ProtocolSseEvent`](../type-aliases/ProtocolSseEvent.md)\>

Defined in: [packages/ai/src/protocol/sse.ts:16](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/protocol/sse.ts#L16)

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
