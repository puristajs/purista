---
title: Frontend Consumers
description: Build frontend clients for agent streaming, protocol timelines, and persisted conversation restore.
order: 203711
---

# Frontend Consumers

The recommended frontend strategy is:

1. call a streaming endpoint (`POST .../ask/stream`)
2. render envelopes incrementally by `frame.kind`
3. load existing conversation history through a command-owned retrieval endpoint

## Why command-owned conversation restore

Conversation restore should stay in command/service boundaries (not hidden runtime side channels) so you can enforce auth, tenant isolation, and policy checks in your own app logic.

Example route in `examples/ai-basic`:

- `POST /api/v1/support/conversation`

## Stream consumer pattern (dedupe-safe)

Some transports include envelopes in `complete.final.envelopes` as fallback.
To avoid duplicate rendering, only replay final envelopes when no chunk was processed.

```ts
let seenChunk = false

if (parsed.frameType === 'chunk') {
  const envelopes = toEnvelopes(parsed.chunk)
  if (envelopes.length > 0) seenChunk = true
  envelopes.forEach(onEnvelope)
}

if (parsed.frameType === 'complete') {
  if (!seenChunk && parsed.final?.envelopes) {
    parsed.final.envelopes.forEach(onEnvelope)
  }
  onComplete(parsed.final)
}
```

This is the same approach used in:

- `examples/ai-basic/src/frontend/lib/api.ts`

## Envelope rendering strategy

Render by `frame.kind`:

- `message`: chat bubble (partial/final)
- `tool`: compact tool row (`invoked/success/error`) with optional payload preview
- `artifact`: JSON/file widget (for example structured output blocks)
- `telemetry`: token/duration badges
- `error`: inline error state + retry action

For `ai-sdk-ui-message` consumers, also handle typed data parts:

- `data-<artifactId>` (for example `data-voyage-status`) for live status/artifact state
- `data-agent-error` for handled/recoverable agent errors

`message-metadata` may also be present in the same stream for compatibility.  
Prefer `data-*` parts for UI behavior and keep metadata as optional fallback.

## AI SDK UI (`useChat`) mapping

Define explicit schemas for app data parts so stream payloads are type-validated in the browser:

```ts
const { messages } = useChat({
  dataPartSchemas: {
    'voyage-status': voyageStatusSchema,
    'agent-error': voyageAgentErrorSchema,
  },
})
```

Recommended UX:

- render `data-agent-error` inline inside the assistant turn (non-blocking warning)
- keep streaming text rendering active
- reserve terminal stream failure UI for `error` events

## Example endpoints to test quickly

```bash
curl -X POST http://localhost:3000/api/v1/support/ask/stream \
  -H "content-type: application/json" \
  -d '{"prompt":"How can I request a refund for my order?"}'
```

```bash
curl -X POST http://localhost:3000/api/v1/support/conversation \
  -H "content-type: application/json" \
  -d '{"sessionId":"<existing-session-id>"}'
```

Typical conversation response:

```json
{
  "sessionId": "chat-123",
  "conversationId": "conv-123",
  "envelopes": [
    {
      "version": "purista.ai/1.0",
      "conversationId": "conv-123",
      "frame": {
        "kind": "message",
        "content": "How can I request a refund for my order?"
      }
    }
  ]
}
```

## UI integration notes

- Keep one source of truth per conversation (message list + workflow timeline derived from same envelopes).
- Keep protocol parsing isolated in a small data adapter layer.
- Let UI components consume normalized view models (not raw SSE strings).

`examples/ai-basic` demonstrates this with:

- stream chat panel
- workflow timeline panel
- protocol inspector panel
- MCP / A2A showcase tabs

For protocol details and interoperability adapters, see [AI Protocol](./ai-protocol.md) and [Protocol & Streaming](./protocol-and-streaming.md).
