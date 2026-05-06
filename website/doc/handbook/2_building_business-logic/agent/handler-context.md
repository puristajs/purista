---
title: Context
description: Implement agent behavior through the handler context after the builder has declared the contract.
order: 203703
---

# Context

The handler is the implementation phase of a PURISTA agent. Once the builder has declared what the agent may do, the handler uses the `context` object to perform that work.

The core principle is:
- The **builder** declares *capability*.
- The **handler** *uses* those capabilities.

## The Example

Assuming the builder has already declared models, skills, and invocations, the handler can access them through a clean, grouped API.

```ts
.setHandler(async (context, payload) => {
  const worker = context.ai.createModelExecutor({
    model: 'openai:primary',
  })

  const faq = context.ai.createToolExecutorFromInvoke(
    context.invoke.tools.invoke.support['1'].lookupFaq,
    {
      id: 'faq',
      description: 'Loads factual support guidance.',
      buildPayload: ({ task }) => ({ question: task.instruction }),
    },
  )

  const plan = await context.plan.generate({
    model: 'openai:primary',
    worker,
    delegates: [faq],
  })

  const { plan: executedPlan, results } = await context.plan.execute(plan)
  const lastTask = executedPlan.tasks.at(-1)
  const answer = lastTask ? String(results[lastTask.id] ?? '') : ''

  return { message: answer };
})
```

## The Context Groups

### 1. `context.input`

Provides access to the invocation input: the payload, parameters, and the raw PURISTA message.

```ts
const sessionId = payload.sessionId ?? context.input.message.id;
```

### 2. `context.memory`

Handles state management for the agent.

- `context.memory.conversation`: Manages the LLM-visible chat history (`addUser`, `addAssistant`).
- `context.memory.run`: Controls the durable workflow state for observability and recovery (`start`, `plan`, `step`, `finishSuccess`). See [Durable Run State](./run-state.md).
- `context.plan`: High-level sequential planning and execution helpers (`generate`, `execute`) built on top of durable run-state.
- `context.memory.session`: Provides low-level access to the underlying session store.

### 3. `context.invoke`

Used to call allowlisted tools (commands) and child agents.

- **Tools**: `context.invoke.tools.invoke.serviceName['version'].commandName(...)`
- **Child Agents**: `context.invoke.agents.runText(...)` or `context.invoke.agents.forward(...)`

You can also use `context.invoke.expose` to create bindings for external runtimes like the Vercel AI SDK.

### 4. `context.ai`

This is the central hub for AI-related functionality.

- **`context.ai.models`**: Access model providers declared in the builder.
  ```ts
  const draft = await context.ai.models['openai:primary'].generateText({ prompt });
  ```
  For public streaming model work, prefer the higher-level helpers:
  ```ts
  const finalText = await context.ai.streamText({
    model: 'openai:primary',
    prompt,
    publishToCurrentStream: { taskId: 'draft-answer' },
  });
  ```
  ```ts
  const finalObject = await context.ai.streamObject({
    model: 'openai:primary',
    prompt,
    schema,
    publishToCurrentStream: { taskId: 'classify' },
  });
  ```
  Declared skills from `useSkills([...])` are injected automatically for `generateText(...)`, `generateObject(...)`, and `streamObject(...)`.
  Capability declarations drive truthful handler typing:
  - text models guarantee `generateText(...)`
  - text-stream models guarantee `streamText(...)` and `generateText(...)`
  - object models guarantee `generateObject(...)`
  - object-stream models guarantee `streamObject(...)`
  - embedding models guarantee `embed(...)`
  - rerank models guarantee `rerank(...)`
  Load deeper reference files explicitly when the handler needs targeted framework knowledge:
  ```ts
  const references = await context.ai.skills.selectReferences({
    skillName: 'purista',
    queries: ['service boundaries builders contracts'],
    relativePathPrefixes: ['references/'],
    limit: 3,
  });
  const result = await context.ai.models['openai:primary'].generateObject({
    prompt,
    schema,
    references,
  });
  ```
  This is the preferred pattern when the agent should always get the umbrella skill but choose deeper reference docs dynamically per task.
- **`context.ai.reply`**: Stream public assistant replies through the current turn.
  ```ts
  const answer = await context.ai.reply.generate({
    model: 'openai:primary',
    prompt,
  });
  ```
  ```ts
  const draft = await context.ai.reply.compose({
    model: 'openai:primary',
    prompt,
  });
  ```
- **`context.ai.embeddings`**: Access embedding models.
  ```ts
  const embedding = await context.ai.embeddings['text-embed-ada'].embed({ value: '...' });
  ```
- **`context.ai.rerankers`**: Access reranking models.
  ```ts
  const reranked = await context.ai.rerankers['cohere-rerank'].rerank({ query, documents });
  ```
- **`context.ai.skills`**: Load and search skills declared with `useSkills`.
  ```ts
ts
  const skills = await context.ai.skills.loadAvailable();
  ```
  ```ts
  const references = await context.ai.skills.selectReferences({
    skillName: 'purista',
    queries: [payload.prompt],
    relativePathPrefixes: ['references/'],
    limit: 4,
  });
  ```
- **`context.ai.policy`**: Resolve agent policies (e.g., quality profiles) at runtime.
  ```ts
  const quality = context.ai.policy.resolve(payload.qualityProfile);
  ```
- **`context.ai.reflect`**: Run explicit draft-critique-refine loops for self-correction.
  ```ts
  const reflection = await context.ai.reflect.run({ name: 'support-answer', ... });
  ```
- **`context.ai.createModelExecutor(...)` / `createToolExecutorFromInvoke(...)` / `createAgentExecutorFromInvoke(...)`**: Build planner executors from the current typed context. Use a required worker for normal reasoning and optional delegates for specialized handoffs. Treat `createToolExecutorLogic(...)` as an advanced escape hatch rather than the default planner path.

### 5. `context.io`

Handles input/output for streaming and the agent protocol.

- `context.io.stream`: High-level API for sending streaming data to the client (`sendChunk`, `sendFinal`).
- `context.io.protocol`: Low-level API for emitting specific agent protocol frames (`emitMessage`, `emitArtifact`, `emitError`).

### 6. `context.output`

Use `context.output.emit(...)` to publish custom PURISTA events that have been declared in the builder with `canEmit`.

```ts
await context.output.emit('support.agent.completed', { sessionId });
```

### 7. `context.app`

Provides access to application-level configuration and metadata.

- `context.app.resources`: Access resources provided at `getInstance(...)`.
  ```ts
  const instruction = context.app.resources.supportPolicy.developerInstruction;
  ```
- `context.app.manifest`: The agent's full manifest.

### 8. `context.runtime`

Offers low-level access to PURISTA runtime features.

- `context.runtime.stores`: Access to state, secret, and config stores.
- `context.runtime.approvals`: Manage human-in-the-loop approval checkpoints (`wait`, `writeApprovalDecision`).
- `context.runtime.service`: The underlying core service context.

## How To Think About The Handler

Keep the handler focused on orchestration:
- Managing conversation and run state.
- Constructing prompts.
- Calling tools, agents, and models.
- Streaming progress and results.

Avoid putting environment setup or provider construction in the handler. That belongs in `getInstance(...)`.

## Decision Rules

- Use `context.invoke.*` for calling other PURISTA services and agents.
- Use `context.ai.skills` for reusable instruction sets.
- Use `context.ai.reply.compose(...)` for internal draft text that should not stream yet.
- Use `context.ai.reply.generate(...)` for model-generated public assistant replies that should stream on the current turn.
- Use `context.ai.reply.publish(...)` when you already have the final public reply text and only need PURISTA to stream it correctly.
- Use `context.ai.skills.selectReferences(...)` when the agent needs focused sub-documents from a declared umbrella skill.
- Use `context.memory.run` for durable, resumable workflows.
- Use `context.plan.generate(...)` and `context.plan.execute(...)` when one agent should generate and execute a sequential plan autonomously.
- Use `context.ai.reflect` and `context.runtime.approvals` for tasks requiring high quality or human oversight.
- Use `context.invoke.expose` only when adapting to an external tool loop (like the Vercel AI SDK).

## Common Mistakes

- **Mixing Concerns**: Putting runtime bootstrapping (like creating providers) inside the handler.
- **Defensive Capability Checks In Typed Handlers**: If the builder declared `addModel(..., { capabilities: [...] })`, avoid repeating `if (!model.generateObject)` style guards in the handler. Missing capabilities should fail at startup, not leak into implementation code.
- **Global Thinking**: Treating `context.ai.skills` as a global registry instead of a per-agent declared scope.
- **Manual Exposure**: Re-implementing tool exposure manually instead of using `context.invoke.expose`.
- **State Mismanagement**: Using conversation history (`context.memory.conversation`) to store workflow checkpoints, which belong in `context.memory.run`.

## Related Guides
- [Agent Builder](./agent-builder.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [Durable Run State](./run-state.md)
- [Production-Ready Agents](./production-ready-agents.md)
