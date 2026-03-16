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

## 6. Knowledge / RAG (context.knowledge)

Typed access to your vector stores or document adapters.

```ts
const docs = await context.knowledge.supportFaq.query(payload.prompt, 3)
```

## 7. Telemetry & Embeddings

- `context.embeddings`: Access to embedding models for manual vectorization.
- `context.rerankers`: Access to reranking models for precision search.
- `context.logger`: Standard PURISTA logger with pre-bound agent metadata.
- `context.emit(...)`: Emit custom domain events.
- `context.secrets` / `context.configs` / `context.states`: Structured store channels (`get*`, `set*`, `remove*`) from service context.
