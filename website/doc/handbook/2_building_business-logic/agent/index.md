---
title: AI Agents
description: Build, publish, and operate AI workloads with the @purista/ai package.
order: 203700
---

# AI Agents in PURISTA

`@purista/ai` lets you add multi-agent orchestration to an existing PURISTA application without touching the core runtime. Agents are defined with the same builder/config patterns you already use for services, started as standalone instances, and invoked through helpers (`invokeAgent`, queues, HTTP bridges) that reuse EventBridge semantics, OpenTelemetry spans, and strict schema validation.

## Scaffold & project layout

Use the CLI to generate a starter agent:

```bash
purista add agent supportAgent
```

The generator creates `src/agents/<agentName>/v<version>/` with a builder, Vitest spec, and documentation comments. Agents live beside services rather than inside them, so code reviews and deployment pipelines treat them like first-class domain components:

```
src/
 ├─ services/...
 └─ agents/
     └─ supportAgent/
         └─ v1/
             ├─ supportAgent.ts
             └─ supportAgent.test.ts
```

## Define an agent

`AgentBuilder.create` mirrors `ServiceBuilder`. You describe metadata, schemas, resources, HTTP exposure, concurrency pools, and the handler logic, then call `.build()` to produce an `AgentDefinition`.

```ts
import { AgentBuilder } from '@purista/ai'
import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

const supportInputSchema = extendApi(
  z.object({
    sessionId: z.string().uuid().optional(),
    prompt: z.string().min(1),
    context: z.string().optional(),
  }),
  { title: 'Support Agent Input' },
)

export const supportAgentDefinition = AgentBuilder.create({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers common support questions',
})
  .addPayloadSchema(supportInputSchema)
  .persistHistory({ storeName: 'aiConversation', maxFrames: 40 })
  .allowTool({ serviceName: 'support', serviceVersion: '1', commandName: 'createTicket' })
  .setConcurrency({ poolId: 'support', maxWorkers: 4 })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setStreamingMode('sse')
  .setHandler(async function (context, payload) {
    const sessionId = payload.sessionId ?? context.message.id

    context.protocol.emitMessage({ content: 'Checking knowledge base…', partial: true })
    const answer = `Reset instructions for "${payload.prompt}" → open the profile page and click "Reset Password".`
    context.protocol.emitMessage({ content: answer, final: true })

    await context.session.save({
      sessionId,
      data: { lastOutput: answer },
      updatedAt: Date.now(),
    })

    return { message: answer }
  })
  .build()
```

- **Explicit tools:** `.allowTool` mirrors `.canInvoke`—agents only see commands that you allowlist.
- **Resources/adapters:** `.persistHistory`, `.useSessionStore`, `.useKnowledgeAdapter`, and `.useResource` reuse the builder/config approach from services. The default adapters are in-memory, but production projects can inject Redis/PGVector/SQL implementations without changing handler code.
- **Concurrency pools:** `.setConcurrency` registers the agent with `PoolManager`, ensuring no more than `maxWorkers` run simultaneously. Pools emit OpenTelemetry gauges so you can alert in Grafana/Prometheus.
- **Streaming HTTP:** `.exposeAsHttpEndpoint` + `.setStreamingMode` automatically generates `/api/v1/agents/<name>` SSE endpoints and OpenAPI entries. Non-streaming APIs can switch to `buffered`.

## Start and invoke an agent

Agents start like services. Call `.getInstance()` to bind runtime dependencies (event bridge, stores, resources) and `.start()` to register on the bridge. Use `invokeAgent` anywhere inside your application—commands, streams, HTTP controllers, queue workers, or tests.

```ts
import { DefaultEventBridge } from '@purista/core'
import { invokeAgent } from '@purista/ai'
import { supportAgentDefinition } from './agents/supportAgent/v1/supportAgent.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const supportAgent = await supportAgentDefinition.getInstance({ eventBridge })
await supportAgent.start()

const envelopes = await invokeAgent({
  eventBridge,
  agentName: supportAgentDefinition.info.agentName,
  agentVersion: supportAgentDefinition.info.agentVersion,
  payload: { prompt: 'How do I reset my password?' },
})

for (const envelope of envelopes) {
  console.log('[agent frame]', envelope.frame.kind, envelope.frame)
}
```

`invokeAgent` reuses EventBridge semantics: tracing, retries, principal/tenant propagation, streaming vs buffered responses, and protocol validation. If you prefer to embed an agent call inside a service command, use the same helper or wire the `AgentInstance.invoke()` method.

## Managed config & manifests

Agents publish manifests to the managed config store via the same workflow described in [Add a Service Config](../service/add-a-service-config.md). `publishAgentManifest` (from `@purista/ai`) serializes the definition and writes it to `ai.manifest.<agentName>.<version>`. CI pipelines typically run this command during release builds so orchestrators/workers can load the latest manifest.

## Optional runtime services & queues

The `@purista/ai` package also ships reference services that you can deploy as-is or customize:

- **AI Orchestrator Service** (`AIOrchestratorService`) offers commands such as `planWorkload` and `enqueueRun` to validate/persist manifests and schedule background jobs.
- **AI Worker Service** (`AIWorkerService`) provides the `aiWorkloads` queue definition plus a worker handler that loads manifests, enforces pools, hydrates session/knowledge adapters, and executes runs via `AgentExecutor`.

These services are opt-in—they live in the same package as the builders so projects can wire their own orchestration pipelines or run agents inline without ever touching the worker.

## Model providers & registry

`ModelResourceRegistry` keeps a catalog of model providers that agents can reference from their manifests. The package exports a singleton `defaultModelResourceRegistry` which already contains the `EchoProvider`. Register an `AiSdkProvider` during bootstrap to gain access to every model supported by the [Vercel AI SDK](https://ai-sdk.dev/docs/introduction):

```ts
import { defaultModelResourceRegistry, AiSdkProvider } from '@purista/ai'
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })

defaultModelResourceRegistry.register(
  'openai:gpt-4o-mini',
  new AiSdkProvider({
    model: openai('gpt-4o-mini'),
    systemPrompt: 'You are a product support specialist.',
    defaults: { temperature: 0.2 },
  }),
)
```

Queue workers and orchestrator services use the default registry, so once a provider is registered the `manifest.modelResource.resourceName` value resolves automatically. Background runs can also pass provider-specific overrides via the new `metadata` field on `enqueueRun` / `aiWorkloads` payloads (e.g., change temperature or max tokens for a single job).

## Streaming responses to UI clients

All agent invocations emit protocol envelopes. When exposing an HTTP endpoint you can forward them verbatim (SSE/chunked). For projects that already rely on the AI SDK stream protocol (e.g., [ai-sdk-ui](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)), use the `toAiSdkStreamEvents` helper:

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

This keeps the PURISTA protocol as the source of truth while letting modern UI kits consume familiar stream events without additional adapters.

## Protocol, telemetry, and tools

- **Protocol helpers:** `context.protocol.emitMessage/emitArtifact/emitTelemetry/emitError` wrap the agent protocol defined in `specs/agent_protocol_concept`. Frames automatically reuse PURISTA message IDs (`inReplyTo`, `conversationId`) so HTTP/SSE bridges, queues, and UI clients consume a consistent stream.
- **Tool events:** When `context.tools.invoke` calls an allowlisted command, tool frames are emitted automatically (invoked/success/error + inputs/outputs).
- **Streaming:** Agent commands, HTTP endpoints, and `invokeAgent` all emit protocol frames. Consumers that only need the final payload can wait for the `message.final` frame; UIs can render partial updates incrementally.
- **MCP & external systems:** Optional helpers such as `exposeAgentAsMCP` and `defineMCPToolResource` are part of `@purista/ai`, so you can bridge agents to Model Context Protocol clients or expose PURISTA commands as MCP tools without adding another dependency.

## Evaluation & testing

`@purista/ai` provides lightweight evaluation helpers (`createEvaluationResult`, `diffEvaluationResults`, `validateDataset`) for building reproducible ground-truth suites. Outputs are JSON so CI can diff accuracy/latency/token metrics across models or prompt revisions. Each scaffolded agent also includes a Vitest spec to validate manifest fields locally.

## Example project

`examples/ai-basic` demonstrates the full flow: it boots a `DefaultEventBridge`, starts the `supportAgent` definition, invokes it via `invokeAgent`, and logs the emitted protocol envelopes. Use it as a reference skeleton when adding your first agents to a real project.
