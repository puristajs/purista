# Agent Builder Integration (Draft)

Goal: integrate agent runs into Purista using familiar builder ergonomics without forcing users into a separate framework.

## How agents map to Purista primitives

Recommended mapping:
- An agent is a service component that can be invoked via commands.
- Long-running agents emit lifecycle events and optionally stream output.

So the integration should support:
- `command` to start agent run (request-response returning `runId`), and
- `stream` to follow run events and model output, and
- `subscription` to trigger agent runs from events.

## New builder: AgentDefinitionBuilder (draft)

An agent is not just a function; it has configuration, policies, tools, memory, and providers.

```ts
agentBuilder
  .setProvider(openAiProvider({ ... }))
  .setMemory(redisMemory({ ... }))
  .registerTool('search', toolSchema, handler)
  .setPolicy(policy)
  .setPlanner(planner)
  .setExecutor(executor)
```

## ServiceBuilder integration (ergonomic)

Draft:

```ts
serviceBuilder.addAgent('supportAgent', 'Customer support assistant', agentDef => {
  agentDef.setProvider(...)
  agentDef.registerTool(...)
})
```

## Typing strategy

The key to DX is typed tools and typed structured outputs:

- tool input schema -> `InferIn<TSchema>`
- tool output schema -> `Infer<TSchema>`
- model response schema -> `Infer<TSchema>` (validated)

Rules:
- All public APIs must be generic over schema types.
- Provider adapters must not return `unknown` in user space; they should return `string` or `zod-validated` structures.

## Streaming integration

Agent runs benefit from streaming for:
- token output
- step status
- tool call events
- usage metrics

So the agent runtime should emit typed stream frames, for example:
- `AgentRunStarted`
- `AgentStepPlanned`
- `ToolCallRequested`
- `ToolCallSucceeded`
- `ModelToken`
- `AgentRunCompleted`

## Observability integration points

Agent builder should require:
- logger
- tracer
- cost/usage sink (optional)

And expose hooks:
- `onBeforeModelCall`
- `onAfterModelCall`
- `onToolError`

