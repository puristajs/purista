# Agent Builder & CLI Integration

## 1. Builder contract

`new AgentBuilder(...)` mirrors `ServiceBuilder` ergonomics but builds standalone agent artifacts:

- `.setDescription`, `.setAgentVersion`, `.useEventBridge`, `.useResource`, `.useSessionStore`, `.useKnowledgeAdapter`, `.persistHistory(options)` – match the builder/config approach already used for services/resources. `.useResource` can point to entries from the ModelResourceRegistry (backed by the Vercel AI SDK) so builders do not reference provider-specific code.
- `.allowTool({ serviceName, serviceVersion, commandName, description? })` – explicit allowlist identical to `.canInvoke`.
- `.setConcurrency({ poolId? })`, `.setRetryPolicy`, `.setTelemetryDefaults`.
- `.addPayloadSchema`, `.addParameterSchema`, `.addOutputSchema`, `.addContextSchema` – schemas stay framework-agnostic (Zod, Ajv, etc.) just like existing builders.
- `.exposeAsHttpEndpoint`, `.addQueryParameters`, `.makeEndpointPublic`, `.setStreamingMode('sse' | 'chunked' | 'buffered')` – identical knobs as command builders so HTTP/OpenAPI generation works automatically.
- `.setHandler(async (context, payload, parameter) => { ... })` – receives a dedicated `AgentHandlerContext` with `logger`, `session`, `knowledge`, `tools`, `resources`, `models`, `stream`, and the underlying PURISTA `serviceContext`. Developers should use `context.stream.sendChunk/sendFinal/sendArtifact/sendError` and not handle protocol envelopes manually.

`builder.build()` returns an `AgentDefinition` exposing `.getInstance(runtimeOptions)` plus schema metadata (fed into OpenAPI, TypeDoc, and managed config publishers).

## 2. Instance lifecycle & invocation

```ts
// src/agents/support/v1/supportAgentBuilder.ts
import { AgentBuilder } from '@purista/ai'
import { extendApi } from '@purista/core'

const supportAgentInputSchema = extendApi(
  z.object({
    sessionId: z.string().uuid().optional(),
    prompt: z.string().min(1),
    responseSchema: z.string().optional(),
  }),
  { title: 'Support Agent Input' },
)

export const supportAgentDefinition = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers FAQs via configured LLM provider',
})
  .persistHistory({ storeName: 'aiConversation', maxFrames: 40 })
  .allowTool({ serviceName: 'support', serviceVersion: '1', commandName: 'createTicket' })
  .addPayloadSchema(supportAgentInputSchema)
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setConcurrency({ poolId: 'support' })
  .setHandler(async function (context, payload) {
    const sessionId = payload.sessionId ?? context.message.id
    context.stream.sendChunk('Thinking...')
    const model = context.models['openai:gpt-4o-mini']
    const response = await model.generate({ prompt: payload.prompt, context: payload.context })
    context.stream.sendFinal(response.output)

    await context.session.save({
      sessionId,
      data: response.updatedHistory,
      updatedAt: Date.now(),
    })

    return { message: response.output }
  })
  .build()
```

```ts
// src/index.ts
const supportAgent = await supportAgentDefinition.getInstance(eventBridge, {
  logger,
  models: { 'openai:gpt-4o-mini': openAiProvider },
  poolConfig: { poolId: 'support', maxWorkers: 4 },
})
await supportAgent.start()
```

Helpers for interacting with agents:

- `invokeAgent({ agentName, agentVersion?, payload, parameter })` – optional helper for scripts/tests/controllers without Purista context. Inside commands/subscriptions/streams, prefer `context.invokeAgent` plus `.canInvokeAgent(...)`.
- `queueAgentRun({ agentName, payload, parameter, queue, delay? })` – packages the call into an async queue job so background workers can call `invokeAgent` later. Retries and visibility timeouts reuse the queue feature from `specs/15-async-queues`.
- `registerAgentSchemas(agentDefinition)` – feeds metadata to documentation/OpenAPI generators so HTTP exposure stays in sync.

## 3. Folder structure inside a Purista application

Applications place agents next to services following the existing naming style:

```
src/
 ├─ services/
 │   └─ support/v1/...
 ├─ agents/
 │   └─ supportAgent/
 │       └─ v1/
 │           ├─ supportAgent.builder.ts
 │           ├─ supportAgent.handler.ts
 │           ├─ supportAgent.http.ts (optional route helpers)
 │           └─ supportAgent.test.ts
 └─ agents.config.ts (optional registry exporting all definitions)
```

`examples/ai-basic` is the canonical comprehensive example and must stay runnable. It demonstrates:
- command invoking agent via `.canInvokeAgent` + `context.invokeAgent`
- support agent using allowlisted tool commands
- support agent delegating to another agent through an allowlisted `agent.run` tool
- subscription invoking the agent after event emission
- HTTP exposure and static frontend using SSE stream frames
- deterministic tests for agent and command flows

## 4. CLI scaffolding

`purista add agent <agentName>` (and `purista add agent <folder> <agentName>` when scoped) performs:

1. Generates `src/agents/<agentName>/<version>/<agentName>.builder.ts` with the handler skeleton (streaming helper, resource wiring, and allowlist placeholders).
2. Adds a Vitest spec under `src/agents/<agentName>/<version>/<agentName>.test.ts` that already starts an in-memory EventBridge, injects a deterministic provider, invokes the agent, and asserts protocol frames.
3. Updates the local registry (e.g., `src/agents/index.ts`) so all agents can be started from `src/index.ts`.
4. Shows how to call agents from existing commands via `.canInvokeAgent` and `context.invokeAgent`.

No dedicated `purista ai build|deploy|evaluate` commands exist. Teams reuse the existing managed-config workflows: `agentDefinition.getManifest()` feeds the same config store used by services/resources, and testing/evaluation lives inside standard unit/integration suites.
