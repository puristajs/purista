---
title: MCP & A2A Expose
description: Expose PURISTA agents through MCP-style and Agent2Agent-style endpoints without leaking runtime internals.
order: 203710
---

# MCP & A2A Expose

Use endpoint adapters when you want external systems to call your agents through protocol-specific shapes.

Keep this boundary rule:

- inside PURISTA: native agent invoke + native AI protocol envelopes
- outside PURISTA: adapter command that maps request/response to the external protocol shape

## Why adapter commands

Adapter commands give you:

- explicit auth/rate-limit boundaries
- stable external contracts without polluting agent handlers
- reuse of `context.invokeAgent...` and existing allowlists/guards/transforms

## Decision matrix: native vs MCP vs A2A

| Target consumer | Recommended contract | Why |
| --- | --- | --- |
| PURISTA command/subscription/stream inside same app | native `context.invokeAgent` + AI envelopes | strongest typing, no extra mapping |
| Custom frontend/backend consuming your SSE stream | native AI envelopes (`frame.kind`) | keeps full tool/telemetry/error fidelity |
| External MCP ecosystem | MCP adapter command (`toMcpReferenceToolResult`) | protocol-compatible boundary without leaking internals |
| External A2A ecosystem | A2A adapter command (`toAgent2AgentReferenceMessage`) | message-oriented interoperability boundary |

## MCP-style expose endpoint

Example route in `examples/ai-basic`:

- `GET /api/v1/support/mcp/tools` returns tool descriptors
- `POST /api/v1/support/mcp/call` invokes the agent and returns MCP-style tool result

### Example MCP HTTP call

Request:

```json
{
  "prompt": "How can I request a refund for my order?",
  "sessionId": "chat-123"
}
```

Response shape:

```json
{
  "content": [
    { "type": "text", "text": "Final answer..." }
  ],
  "metadata": {
    "telemetry": {
      "usage": { "promptTokens": 120, "completionTokens": 90, "totalTokens": 210 },
      "durationMs": 4100
    }
  }
}
```

### Implementation pattern

```ts
export const runSupportMcpCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('runSupportMcp', 'Invokes support agent and returns MCP-style result payload')
  .canInvokeAgent('supportAgent', '1', {
    payloadSchema: runSupportMcpInvokePayloadSchema,
    parameterSchema: runSupportMcpInvokeParameterSchema,
  })
  .exposeAsHttpEndpoint('POST', 'support/mcp/call')
  .setCommandFunction(async function (context, payload) {
    const envelopes = await context.invokeAgent.supportAgent['1']
      .call(
        {
          message: payload.prompt,
          prompt: payload.prompt,
          sessionId: payload.sessionId,
          responseFormat: payload.responseFormat,
          history: [],
          attachments: [],
        },
        { channel: 'command' },
      )
      .final()

    return toMcpReferenceToolResult(agentProtocolEnvelopeSchema.array().parse(envelopes))
  })
```

## Agent2Agent-style expose endpoint

Example route in `examples/ai-basic`:

- `POST /api/v1/support/a2a/call` returns reference Agent2Agent messages

### Example A2A HTTP call

Request:

```json
{
  "prompt": "How can I request a refund for my order?",
  "sessionId": "chat-123"
}
```

Response shape:

```json
{
  "messages": [
    {
      "id": "msg-1",
      "threadId": "conv-1",
      "frameType": "message",
      "sender": { "service": "support", "agent": "runSupportAgentStream" },
      "payload": { "kind": "message", "content": "Checking FAQ..." }
    }
  ]
}
```

### Implementation pattern

```ts
export const runSupportA2aCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('runSupportA2a', 'Invokes support agent and returns Agent2Agent-style messages')
  .canInvokeAgent('supportAgent', '1', {
    payloadSchema: runSupportA2aInvokePayloadSchema,
    parameterSchema: runSupportA2aInvokeParameterSchema,
  })
  .exposeAsHttpEndpoint('POST', 'support/a2a/call')
  .setCommandFunction(async function (context, payload) {
    const envelopes = await context.invokeAgent.supportAgent['1']
      .call(
        {
          message: payload.prompt,
          prompt: payload.prompt,
          sessionId: payload.sessionId,
          responseFormat: payload.responseFormat,
          history: [],
          attachments: [],
        },
        { channel: 'command' },
      )
      .final()

    return {
      messages: agentProtocolEnvelopeSchema.array().parse(envelopes).map(toAgent2AgentReferenceMessage),
    }
  })
```

## Exposure checklist

Before exposing MCP/A2A endpoints:

- keep agent payload schema strict (`addPayloadSchema(...)`)
- restrict callable agents with `canInvokeAgent(...)`
- keep protocol mapping in command layer only
- return normalized errors (handled/unhandled) instead of raw exceptions

## Important note on scope

`toMcpReferenceToolResult` and `toAgent2AgentReferenceMessage` are reference mappings.
They are intended as deterministic adapter helpers, not full official protocol stacks.

For envelope semantics and nesting, see [AI Protocol](./ai-protocol.md).
