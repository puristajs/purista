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
  // Start a durable run for observability and recovery
  const run = await context.memory.run.start({
    title: 'Support Response',
    extraScope: { sessionId: payload.sessionId },
  });

  // Add user message to conversation history
  await context.memory.conversation.addUser(payload.prompt);
  await run.plan([
    { id: 'triage', title: 'Classify urgency' },
    { id: 'faq', title: 'Load FAQ guidance' },
    { id: 'answer', title: 'Write final answer' },
  ]);

  // Use allowlisted tools and agents
  const triage = await context.invoke.agents.runText({
    agentName: 'triageAgent',
    agentVersion: '1',
    payload: { prompt: payload.prompt },
  });

  const faq = await context.invoke.tools.invoke.support['1'].lookupFaq({
    question: payload.prompt,
  });

  // Use declared skills and models
  const skills = await context.ai.skills.loadAvailable();
  const answer = await context.ai.reply.generate({
    model: 'openai:primary',
    prompt: `...`,
  });

  // Persist the response and finalize the run
  await context.memory.conversation.addAssistant(answer);
  await run.finishSuccess(answer);

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
  Declared skills from `useSkills([...])` are injected automatically for `generateText(...)`, `generateJson(...)`, and `streamObject(...)`.
  Load deeper reference files explicitly when the handler needs targeted framework knowledge:
  ```ts
  const references = await context.ai.skills.selectReferences({
    skillName: 'purista',
    queries: ['service boundaries builders contracts'],
    relativePathPrefixes: ['references/'],
    limit: 3,
  });
  const result = await context.ai.models['openai:primary'].generateJson({
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
- Use `context.ai.reflect` and `context.runtime.approvals` for tasks requiring high quality or human oversight.
- Use `context.invoke.expose` only when adapting to an external tool loop (like the Vercel AI SDK).

## Common Mistakes

- **Mixing Concerns**: Putting runtime bootstrapping (like creating providers) inside the handler.
- **Global Thinking**: Treating `context.ai.skills` as a global registry instead of a per-agent declared scope.
- **Manual Exposure**: Re-implementing tool exposure manually instead of using `context.invoke.expose`.
- **State Mismanagement**: Using conversation history (`context.memory.conversation`) to store workflow checkpoints, which belong in `context.memory.run`.

## Related Guides
- [Agent Builder](./agent-builder.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [Durable Run State](./run-state.md)
- [Production-Ready Agents](./production-ready-agents.md)
