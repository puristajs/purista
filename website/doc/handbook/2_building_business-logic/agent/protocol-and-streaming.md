---
title: Protocol & Streaming
description: Understand agent protocol frames, emit telemetry, and adapt them for HTTP/SSE or the Vercel AI SDK.
order: 203707
---

# Protocol & Streaming

Every agent invocation returns protocol envelopes. Each envelope contains:

- identity/correlation metadata (`messageId`, `conversationId`, `inReplyTo`, actor info)
- one frame describing what happened (`message`, `tool`, `telemetry`, `artifact`, `error`)

In daily usage you do not build envelopes manually; `context.stream` and runtime helpers do that for you.

## Frame types

| Kind | Purpose |
| --- | --- |
| `message` | Assistant/user text. Supports `partial` streams and `final` completions. |
| `artifact` | Binary or structured payloads (files, images, JSON) emitted incrementally. |
| `telemetry` | Duration, wait time, concurrency pool, provider name, token usage, custom metrics. |
| `tool` | Trace allowlisted tool invocations (invoked/success/error plus arguments/results). |
| `error` | Normalised error payload matching PURISTA handled/unhandled semantics. |

`context.stream.sendX` helpers push message/artifact/error frames for you:

```ts
context.stream.sendChunk('Checking knowledge base…')
context.stream.sendFinal(answer)
```

If you only `return { message: '...' }`, the runtime automatically emits a final `message` frame plus telemetry metadata (duration/token usage/provider when available) so downstream consumers always see a consistent stream.

## HTTP streaming

When you expose an agent as an HTTP endpoint, the bridge forwards frames immediately. Server-Sent Events (SSE) is the recommended mode:

```ts
export const supportAgent = new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .build()
```

SSE is the default streaming mode for exposed agent endpoints. Use `.setStreamingMode(...)` only when you need `chunked` or `buffered`.

### Streaming mode decision guide

| Mode | Best for | Pros | Cons |
| --- | --- | --- | --- |
| `sse` (default) | browser/UI progressive rendering | native event model, simple client consumption | long-lived HTTP connections |
| `chunked` | custom backend consumers | lightweight transport control | client parsing conventions required |
| `buffered` | request/response APIs needing final-only payload | simplest client behavior | no progressive updates |

On the server side you can reuse the helper that turns envelopes into Vercel AI SDK events:

```ts
import { invokeAgent, toAiSdkStreamEvents } from '@purista/ai'

export async function handler(req, res) {
  const envelopes = await invokeAgent({ ... })
  res.setHeader('Content-Type', 'text/event-stream')

  for await (const event of toAiSdkStreamEvents(envelopes)) {
    res.write(`event: ${event.event}\n`)
    res.write(`data: ${JSON.stringify(event.data)}\n\n`)
  }

  res.end()
}
```

`invokeAgent` is streaming-first: it opens an EventBridge stream and collects envelopes from that live session. `.final()` style behavior is collector sugar, not a separate buffering transport.

UI teams using [`ai-sdk-ui`](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) can consume these events directly—no custom adapters required. The helper maps PURISTA frames to AI SDK events (`response.created`, `response.output_text.delta`, `response.completed`, etc.) and forwards telemetry (tokens, duration) as `response.metrics`.

## Background streaming

Queues, WebSockets, or custom transports can opt into the same experience by passing a `stream` responder when invoking the agent:

```ts
await supportAgent.invoke(
  {
    payload: { prompt: 'Summarise ticket 42' },
    stream: {
      onFrame: frame => socket.send(JSON.stringify(frame)),
      onComplete: () => socket.close(),
      onError: err => socket.close(1011, String(err)),
    },
  },
)
```

## Interoperability bridge snippets

`@purista/ai` includes reference interoperability helpers:

```ts
import { toAgent2AgentReferenceMessage, toMcpReferenceToolResult } from '@purista/ai'

const a2aMessages = envelopes.map(env => toAgent2AgentReferenceMessage(env))
const mcpToolResult = toMcpReferenceToolResult(envelopes)
```

Use them as adapter building blocks when exposing Purista agents through other ecosystems.

You never need to populate protocol IDs manually—the runtime copies all required headers (`inReplyTo`, `conversationId`, `sender`) so the stream is valid whether it stays inside PURISTA or is forwarded to third parties.

### Adapter pipeline guidance

Keep protocol conversion at integration boundaries:

```text
Agent handler -> AI envelopes -> adapter (A2A/MCP/UI protocol) -> external client
```

- inside the app: use native PURISTA AI envelopes
- at protocol boundaries: map once with adapter helpers
- in clients: consume mapped protocol without understanding internal runtime details

For the full protocol semantics, message contract, and interoperability guidance, see [AI Protocol](./ai-protocol.md).

## Error handling

- Throw a `HandledError` when the agent can recover or wants to inform the caller about user-facing issues. The runtime emits an `error` frame with `handled: true` and propagates the HTTP status code if the agent is exposed via HTTP.
- Throwing anything else marks the frame as `handled: false`. The runtime still wraps it inside a structured error frame, preserving stack traces inside `details` for debugging.
- Retries and concurrency guarantees happen before frames are emitted, so consumers see idempotent streams even when the agent internally retries a provider call.

### Error handling choices

| Choice | Use when | Result |
| --- | --- | --- |
| throw `HandledError` | expected/business errors | protocol `error` frame with `handled: true` |
| throw unknown/Error | unexpected/system failures | protocol `error` frame with `handled: false` |
| rollback staged conversation (`revertLast`) + throw | model call failed after staging input | avoids duplicated turns on retry |

## Token usage & costs

Telemetry is emitted automatically. The runtime enables AI SDK telemetry by default, forwards trace context, and publishes usage/duration/provider metrics in protocol telemetry frames and the final response metadata.

In addition to token usage, telemetry frames expose pool pressure fields:

- `poolId`
- `maxWorkersPerInstance`
- `activeWorkers`
- `waitingWorkers`
- `waitTimeMs`

Optional host hints can be attached:

- `replicaCountHint`
- `effectiveMaxConcurrencyHint`

`maxWorkersPerInstance` is always per process/instance. Cluster-level throughput is host-controlled and estimated as:

`effectiveMaxConcurrency = replicas * maxWorkersPerInstance`

Warnings and failures are also logged automatically in PURISTA style:

- no payload logging by default
- provider warnings as structured warn logs
- provider failures as structured error logs
