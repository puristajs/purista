---
title: Protocol & Streaming
description: Understand agent protocol frames, emit telemetry, and adapt them for HTTP/SSE or the Vercel AI SDK.
order: 203705
---

# Protocol & Streaming

Agents communicate through the `agent_protocol_concept` format defined in `specs/agent_protocol_concept`. Every invocation returns an array of envelopes, each containing metadata copied from the PURISTA message (`id`, `correlationId`, `inReplyTo`) and a frame describing what happened.

## Frame types

| Kind | Purpose |
| --- | --- |
| `message` | Assistant/user text. Supports `partial` streams and `final` completions. |
| `artifact` | Binary or structured payloads (files, images, JSON) emitted incrementally. |
| `telemetry` | Duration, wait time, concurrency pool, provider name, token usage, custom metrics. |
| `toolEvent` | Trace allowlisted tool invocations (invoked/success/error plus arguments/results). |
| `error` | Normalised error payload matching PURISTA handled/unhandled semantics. |

`context.protocol.emitX` helpers push these frames for you:

```ts
context.protocol.emitMessage({ content: 'Checking knowledge base…', partial: true })
context.protocol.emitMessage({ content: answer, final: true })
context.protocol.emitTelemetry({
  provider: context.models['openai:gpt-4o-mini'].name,
  durationMs: Date.now() - started,
  usage: {
    promptTokens: tokens?.prompt,
    completionTokens: tokens?.completion,
    totalTokens: (tokens?.prompt ?? 0) + (tokens?.completion ?? 0),
  },
})
```

If you only `return { message: '...' }`, the runtime automatically emits a `message` + `telemetry` frame so downstream consumers always see a consistent stream.

## HTTP streaming

When you expose an agent as an HTTP endpoint, the bridge forwards frames immediately. Server-Sent Events (SSE) is the recommended mode:

```ts
export const supportAgentDefinition = new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setStreamingMode('sse')
  .build()
```

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

You never need to populate protocol IDs manually—the runtime copies all required headers (`inReplyTo`, `conversationId`, `sender`) so the stream is valid whether it stays inside PURISTA or is forwarded to third parties.

## Error handling

- Throw a `HandledError` when the agent can recover or wants to inform the caller about user-facing issues. The runtime emits an `error` frame with `handled: true` and propagates the HTTP status code if the agent is exposed via HTTP.
- Throwing anything else marks the frame as `handled: false`. The runtime still wraps it inside a structured error frame, preserving stack traces inside `details` for debugging.
- Retries and concurrency guarantees happen before frames are emitted, so consumers see idempotent streams even when the agent internally retries a provider call.

## Token usage & costs

`AgentBuilder` automatically emits telemetry. You can override or enrich it by calling `context.protocol.emitTelemetry()` after the provider returns. Populate `usage.promptTokens`, `usage.completionTokens`, and `usage.totalTokens` to unlock Grafana/Prometheus dashboards and keep external alerting informed about throughput.
