---
title: Context
description: The complete toolbox available to an agent handler.
order: 203703
---

# Context

The `context` object passed to an agent handler is your primary gateway to the PURISTA ecosystem. It is more specialized than a standard service context.

## 1. Streaming (context.stream)

Use the streaming helpers to send incremental updates to the client. This is essential for a "responsive" UX.

- `sendChunk(delta)`: Sends a text delta to the client.
- `sendReasoning(text)`: Sends reasoning or "thinking" frames.
- `sendArtifact(input)`: Sends custom structured artifacts (e.g., UI components, code blocks).
- `sendFinal(content, options)`: Sends the final answer and closes the turn.
- `sendError(error)`: Sends a protocol error frame.

```ts
setHandler(async (context, payload) => {
  context.stream.sendReasoning('I am looking up your order...')
  // ... LLM call
  context.stream.sendChunk('Your order #123 is on its way.')
  context.stream.sendFinal('Done.')
})
```

## 2. Models & Providers (context.models)

Typed access to the models you declared in the builder.

- `context.models[alias].generate({ prompt })`: Direct generate text call.
- `context.models[alias].generateJson({ prompt, schema })`: Generate structured JSON.
- `context.models[alias].stream({ prompt })`: Low-level stream handle.

### Helper: generateText
For most use cases, use the exported `generateText` helper which normalizes streaming and reasoning:

```ts
import { generateText } from '@purista/ai'

const answer = await generateText({
  model: context.models['myModel'],
  request: { prompt: payload.prompt },
  onTextDelta: (delta) => context.stream.sendChunk(delta),
  onReasoning: (reasoning) => context.stream.sendReasoning(reasoning)
})
```

## 3. Tool Invocations (context.tools)

Typed access to the commands you allowlisted via `.canInvoke(...)`.

```ts
const result = await context.tools.invoke.ticketing['1'].createTicket({
  reason: 'Broken laptop'
})
```

Note: Tool events (invoked/success/error) are automatically emitted as protocol frames.

## 4. Orchestration (context.agents)

Easily call other agents. All metadata (`tenantId`, `principalId`, `sessionId`) is automatically forwarded.

Declare agent dependencies in the builder first:

```ts
.canInvokeAgent('triageAgent', '1')
```

Then choose the level you need in the handler:

- `context.agents.invoke(...)`: Returns full protocol envelopes.
- `context.agents.invoke.triageAgent['1'].call(...)`: Uses the same typed chained invocation style as regular PURISTA service-to-service agent calls.
- `context.agents.runText(...)`: Simplified helper that returns the final text result.
- `context.agents.forward(...)`: Simplified helper for nested orchestration that forwards the child agent stream into the current stream.
- `context.agents.runObject<T>(...)`: Parses final assistant text as JSON and returns typed object `T`.
- `forwardToCurrentStream`: Optional invocation flag that forwards a child agent's assistant/reasoning/artifact/error frames into the current stream.
- `emitInvocationToolEvents`: Optional invocation flag to suppress synthetic `agent.run` tool telemetry for internal orchestration calls.

Choose them like this:

- `runText(...)`: child agent is an internal classifier, planner, or summarizer
- `runObject<T>(...)`: child agent returns structured JSON in its final assistant message
- `forward(...)`: child agent should be visible to the current end user
- `invoke(...)`: you need raw envelopes or custom stream merging

```ts
const triageResult = await context.agents.runText({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt }
})

const triageJson = await context.agents.runObject<{ urgency: 'low' | 'medium' | 'high' }>({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt }
})

await context.agents.invoke({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
  forwardToCurrentStream: true,
  emitInvocationToolEvents: false,
})

await context.agents.forward({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
})
```

If you want to expose another agent to the model as a tool, keep the same AI SDK `tool(...)` pattern you already use for command-backed tools:

```ts
import { tool } from 'ai'
import { z } from 'zod'

const triageTool = tool({
  description: 'Classify urgency for a support request',
  inputSchema: z.object({
    prompt: z.string().min(1).describe('The user request to classify'),
  }),
  execute: async input =>
    await context.agents.runText({
      agentName: 'triageAgent',
      agentVersion: '1',
      payload: input,
    }),
})
```

That keeps agent-backed tools and command-backed tools structurally identical: define `tool(...)`, then call the typed PURISTA context inside `execute`.

## 5. Persistence (context.conversation & context.session)

- `context.conversation`: High-level API for chat history (`addUser`, `addAssistant`, `buildPromptInput`). It respects the `persistConversation` settings from the builder.
- `context.session`: Low-level access to the conversation store (`load`, `save`, `delete`).

```ts
await context.conversation.addUser(payload.prompt)
const messages = await context.conversation.getMessages()
```

## 5.1 Durable Execution State (`context.runState`)

Use `context.runState` for long-running agent execution state such as plans, task lists, checkpoints, locks, and resumable status. It is backed by `context.states`, so it survives beyond the current in-memory instance and can be read again after reconnects or handoffs.

Use it for:

- planner/todo state
- active run locks
- checkpoints for resumed work
- UI-facing execution status

Do not use conversation memory for this. Conversation memory is for LLM context. Run state is operational workflow state.

```ts
const run = await context.runState.start({
  title: 'Architecture synthesis',
  extraScope: { projectId: payload.projectId },
  lock: { key: 'architecture' },
})

await run.plan([
  { id: 'review-spec', title: 'Review specification' },
  { id: 'write-files', title: 'Write architecture artifacts' },
  { id: 'verify', title: 'Verify persisted outputs' },
])

await run.checkpoint('spec-snapshot', { projectId: payload.projectId }, { completed: true })
await run.update({ phase: 'running', status: 'running' })

await run.step('write-files', async () => {
  // write files here
  return 'Architecture artifacts are ready.'
}, { checkpoint: 'write-files-summary' })

await run.finishSuccess('Architecture artifacts are ready.')
```

Every persisted update emits a standard `run-state` artifact. In `ai-sdk-ui-message` mode this becomes a `data-run-state` part for the frontend. That is the contract that lets the UI render live progress and lock the composer while a queued durable agent is active.

## 6. Skills (context.skills)

When your app provides a skill registry resource, agent handlers can use the
shared skill helpers directly from `context.skills`.

The recommended filesystem convention is:

```text
skills/
  skill-name/
    SKILL.md
    references/
    scripts/
    assets/
```

`SKILL.md` is the only required file. Optional frontmatter may provide metadata
such as `name`, `description`, `topics`, and `requires_sandbox`.

```ts
const relevantSkills = await context.skills.search({
  skillNames: ['purista-architecture', 'purista-queues'],
  queries: [payload.prompt, 'architecture', 'queues'],
  limit: 3,
})

const contextBlock = relevantSkills
  .map(skill => `## ${skill.name}\n${skill.content}`)
  .join('\n\n')
```

If no skill resource is configured, `context.skills.*` throws with a clear
runtime error instead of silently inventing behavior.

## 7. Resources for Retrieval, Skills, and External Data

Retrieval and skill loading are application concerns, so they live behind normal resources instead of a special AI-only knowledge API.

```ts
const docs = await context.resources.supportFaq.search({
  query: payload.prompt,
  limit: 3,
})
```

Keep the boundary explicit:

- `context.conversation` for chat history
- `context.runState` for durable execution state
- `context.resources` for retrieval systems, skill registries, vector stores, or document indexes
- `context.tools` when the model should call retrieval through an allowlisted command

## 8. Telemetry & Embeddings

- `context.embeddings`: Access to embedding models for manual vectorization.
- `context.rerankers`: Access to reranking models for precision search.
- `context.logger`: Standard PURISTA logger with pre-bound agent metadata.
- `context.emit(...)`: Emit custom domain events.
- `context.secrets` / `context.configs` / `context.states`: Structured store channels (`get*`, `set*`, `remove*`) from service context.
