# Agent Builder & CLI Integration

## 1. Builder contract

`AgentBuilder.create` mirrors `ServiceBuilder` ergonomics but builds standalone agent artifacts:

- `.setDescription`, `.setAgentVersion`, `.useEventBridge`, `.useResource`, `.useSessionStore`, `.useKnowledgeAdapter`, `.persistHistory(options)` – match the builder/config approach already used for services/resources. `.useResource` can point to entries from the ModelResourceRegistry (backed by the Vercel AI SDK) so builders do not reference provider-specific code.
- `.allowTool({ serviceName, serviceVersion, commandName, description? })` – explicit allowlist identical to `.canInvoke`.
- `.setConcurrency({ maxWorkers, poolId? })`, `.setRetryPolicy`, `.setTelemetryDefaults`.
- `.addPayloadSchema`, `.addParameterSchema`, `.addOutputSchema`, `.addContextSchema` – schemas stay framework-agnostic (Zod, Ajv, etc.) just like existing builders.
- `.exposeAsHttpEndpoint`, `.addQueryParameters`, `.makeEndpointPublic`, `.setStreamingMode('sse' | 'chunked' | 'buffered')` – identical knobs as command builders so HTTP/OpenAPI generation works automatically.
- `.setHandler(async (context, payload, parameter) => { ... })` – receives a dedicated `AgentHandlerContext` with `logger`, `stores.session`, `knowledge`, `protocol`, `tools`, `resources`, `stream`, and the underlying PURISTA `serviceContext`. Developers never touch protocol envelopes directly; helpers emit frames automatically.

`builder.build()` returns an `AgentDefinition` exposing `.getInstance(runtimeOptions)` plus schema metadata (fed into OpenAPI, TypeDoc, and managed config publishers).

## 2. Instance lifecycle & invocation

```ts
// src/agents/support/v1/supportAgentBuilder.ts
import { AgentBuilder, invokeAgent } from '@purista/ai'
import { extendApi } from '@purista/core'

const supportAgentInputSchema = extendApi(
  z.object({
    sessionId: z.string().uuid().optional(),
    prompt: z.string().min(1),
    responseSchema: z.string().optional(),
  }),
  { title: 'Support Agent Input' },
)

export const supportAgentDefinition = AgentBuilder.create({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers FAQs via configured LLM provider',
})
  .persistHistory({ storeName: 'aiConversation', maxFrames: 40 })
  .allowTool({ serviceName: 'support', serviceVersion: '1', commandName: 'createTicket' })
  .addPayloadSchema(supportAgentInputSchema)
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setConcurrency({ maxWorkers: 4 })
  .setHandler(async function (context, payload) {
    const sessionId = payload.sessionId ?? context.message.id
    const history = await context.session.load(sessionId)

    // helper keeps protocol bookkeeping hidden
    context.protocol.emitMessage({ content: 'Thinking...' })

    const response = await context.resources.llm.generate({
      conversation: history,
      prompt: payload.prompt,
      tools: context.tools.list(),
    })

    for await (const chunk of response.stream ?? []) {
      context.protocol.emitMessage({ content: chunk, partial: true })
    }

    context.protocol.emitMessage({ content: response.final, summary: response.summary })
    context.protocol.emitTelemetry(response.metrics)

    await context.session.save({
      sessionId,
      data: response.updatedHistory,
      updatedAt: Date.now(),
    })

    return { result: response.final }
  })
  .build()
```

```ts
// src/index.ts
const supportAgent = supportAgentDefinition.getInstance({
  eventBridge,
  logger,
  spanProcessor,
  sessionStore,
  knowledgeAdapters,
  resources: { llm: openAiProvider },
})
await supportAgent.start()
```

Helpers for interacting with agents:

- `invokeAgent({ agentName, agentVersion?, payload, parameter })` – synchronous/streaming execution for commands, HTTP controllers, tests, and queue workers. It reuses the EventBridge invoke semantics and automatically buffers/streams protocol frames as needed.
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

`purista/examples/ai-basic` is replaced with a canonical example that follows this structure (logger usage, managed config wiring, invoke helpers) so developers can copy the pattern directly.

## 4. CLI scaffolding

`purista add agent <agentName>` (and `purista add agent <folder> <agentName>` when scoped) performs:

1. Generates `src/agents/<agentName>/<version>/<agentName>.builder.ts` with the handler skeleton (streaming helper, resource wiring, and allowlist placeholders).
2. Adds a Vitest spec under `src/agents/<agentName>/<version>/<agentName>.test.ts` using the in-memory adapters + echo provider.
3. Updates the local registry (e.g., `src/agents/index.ts`) so all agents can be started from `src/index.ts`.
4. Shows how to call `invokeAgent` from an existing command or HTTP endpoint without embedding agent logic inside commands.

No dedicated `purista ai build|deploy|evaluate` commands exist. Teams reuse the existing managed-config workflows: `agentDefinition.getManifest()` feeds the same config store used by services/resources, and testing/evaluation lives inside standard unit/integration suites.
