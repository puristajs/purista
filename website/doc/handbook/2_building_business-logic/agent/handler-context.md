---
title: Context
description: Implement agent behavior through the handler context after the builder has declared the contract.
order: 203703
---

# Context

The handler is the implementation phase of a PURISTA agent.

Once the builder has declared what the agent may do, the handler uses `context`
to perform that work.

The important shift is:

- the builder declares capability
- the handler uses those capabilities

## The Example

Assume the builder already declared:

- `.defineModel('openai:primary')`
- `.useSkills(['spec-elicitation', 'support-workflow'])`
- `.canInvoke('support', '1', 'lookupFaq')`
- `.canInvokeAgent('triageAgent', '1')`

Then the handler can use the corresponding `context` APIs directly.

```ts
.setHandler(async (context, payload) => {
  const run = await context.runState.start({
    title: 'Support response',
    extraScope: { sessionId: payload.sessionId ?? context.message.id },
  })

  await context.conversation.addUser(payload.prompt)
  await run.plan([
    { id: 'triage', title: 'Classify urgency' },
    { id: 'faq', title: 'Load FAQ guidance' },
    { id: 'answer', title: 'Write final answer' },
  ])

  const skills = await context.skills.loadAvailable()
  const triage = await context.agents.runText({
    agentName: 'triageAgent',
    agentVersion: '1',
    payload: { prompt: payload.prompt },
  })
  const faq = await context.tools.invoke.support['1'].lookupFaq({
    question: payload.prompt,
  })

  const answer = await generateText({
    model: context.models['openai:primary'],
    request: {
      prompt: [
        renderSkillDocuments('Relevant skills', skills),
        `Customer request: ${payload.prompt}`,
        `Triage result: ${triage}`,
        `FAQ answer: ${String(faq.answer ?? '')}`,
      ].filter(Boolean).join('\n\n'),
    },
    onTextDelta: delta => context.stream.sendChunk(delta),
  })

  await context.conversation.addAssistant(answer)
  await run.finishSuccess(answer)
  context.stream.sendFinal(answer)
  return { message: answer }
})
```

That one handler already shows the main context groups.

## The Context Groups

### 1. `context.models`

Use the model aliases declared in the builder.

```ts
const answer = await context.models['openai:primary'].generate({
  prompt: payload.prompt,
})
```

Or use the higher-level helper:

```ts
import { generateText } from '@purista/ai'

const answer = await generateText({
  model: context.models['openai:primary'],
  request: { prompt: payload.prompt },
  onTextDelta: delta => context.stream.sendChunk(delta),
})
```

Use `context.models` when the handler itself owns the reasoning loop.

### 2. `context.tools`

Use commands that were allowlisted with `.canInvoke(...)`.

```ts
const faq = await context.tools.invoke.support['1'].lookupFaq({
  question: payload.prompt,
})
```

This is the normal handler path for command-backed tool usage.

### 3. `context.agents`

Use child agents that were allowlisted with `.canInvokeAgent(...)`.

Common helpers:

- `runText(...)`
- `runObject<T>(...)`
- `forward(...)`
- `invoke(...)`

Example:

```ts
const triage = await context.agents.runText({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
})
```

Use:

- `runText(...)` when only the final text matters
- `runObject<T>(...)` when the child returns JSON in its final message
- `forward(...)` when the child stream should be visible to the current user
- `invoke(...)` when you need raw envelopes or full control

### 4. `context.skills`

Use only the skills declared by `.useSkills([...])`.

Common path:

```ts
const skills = await context.skills.loadAvailable()
```

Narrow within the declared set:

```ts
const skills = await context.skills.search({
  queries: [payload.prompt],
  limit: 1,
})
```

Load references when needed:

```ts
const references = await context.skills.loadReferences('support-workflow')
```

Rule:

- builder declares allowed names
- instance creation provides the real skill implementations
- handler loads and uses them

### 5. `context.stream`

Use streaming helpers to keep the client responsive.

- `sendChunk(...)`
- `sendReasoning(...)`
- `sendArtifact(...)`
- `sendFinal(...)`
- `sendError(...)`

For most agents:

- stream deltas during long generation
- send the final answer once

### 6. `context.conversation`

Use conversation history for LLM-visible chat state.

```ts
await context.conversation.addUser(payload.prompt)
await context.conversation.addAssistant(answer)
```

This is for chat memory, not for operational workflow state.

### 7. `context.runState`

Use run state for durable execution:

- plans
- tasks
- checkpoints
- statuses
- locks

Example:

```ts
const run = await context.runState.start({
  title: 'Architecture synthesis',
  extraScope: { projectId: payload.projectId },
})

await run.plan([
  { id: 'review', title: 'Review inputs' },
  { id: 'write', title: 'Write outputs' },
  { id: 'verify', title: 'Verify outputs' },
])
```

Rule:

- `context.conversation` is for LLM-visible history
- `context.runState` is for durable operational state

### 8. `context.expose`

Use `context.expose.*` only when adapting to an external tool/runtime loop.

Example:

```ts
const bindings = context.expose.tools({
  commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
  agents: [{ agentName: 'triageAgent', agentVersion: '1', name: 'triageEscalation', resultMode: 'text' }],
})
```

This is the bridge from PURISTA declarations to SDK adapters. It is not the normal direct handler path.

## How To Think About The Handler

Keep the handler focused on:

- orchestration
- prompt construction
- command and child-agent calls
- durable progress updates
- streaming

Do not bury environment bootstrapping or provider construction in the handler.

## Decision Rules

- Use `context.tools` for command-backed operations.
- Use `context.agents` for child-agent orchestration.
- Use `context.skills` for declared instruction bundles.
- Use `context.runState` for durable long-running workflow state.
- Use `context.models` for provider-owned adapters such as `AiSdkProvider`.
- Use `context.expose` only when you are crossing into an adapter boundary such as the AI SDK.

## Common Mistakes

- Treating `context.skills` as a global registry instead of a declared per-agent scope.
- Using conversation history to store workflow checkpoints.
- Re-implementing tool exposure manually instead of using `context.expose`.
- Mixing runtime bootstrapping into the handler.

## Related Guides

- [Builder](./agent-builder.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
- [Durable Run State](./run-state.md)
