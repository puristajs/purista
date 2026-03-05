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

## MCP-style expose endpoint

Example route in `examples/ai-basic`:

- `GET /api/v1/support/mcp/tools` returns tool descriptors
- `POST /api/v1/support/mcp/call` invokes the agent and returns MCP-style tool result

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
