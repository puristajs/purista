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

Then the handler can use the corresponding grouped `context` APIs directly.

```ts
.setHandler(async (context, payload) => {
  const run = await context.memory.run.start({
    title: 'Support response',
    extraScope: { sessionId: payload.sessionId ?? context.input.message.id },
  })

  await context.memory.conversation.addUser(payload.prompt)
  await run.plan([
    { id: 'triage', title: 'Classify urgency' },
    { id: 'faq', title: 'Load FAQ guidance' },
    { id: 'answer', title: 'Write final answer' },
  ])

  const skills = await context.ai.skills.loadAvailable()
  const triage = await context.invoke.agents.runText({
    agentName: 'triageAgent',
    agentVersion: '1',
    payload: { prompt: payload.prompt },
  })
  const faq = await context.invoke.tools.invoke.support['1'].lookupFaq({
    question: payload.prompt,
  })

  const answer = await generateText({
    model: context.ai.models['openai:primary'],
    request: {
      prompt: [
        renderSkillDocuments('Relevant skills', skills),
        `Customer request: ${payload.prompt}`,
        `Triage result: ${triage}`,
        `FAQ answer: ${String(faq.answer ?? '')}`,
      ].filter(Boolean).join('\n\n'),
    },
    onTextDelta: delta => context.io.stream.sendChunk(delta),
  })

  await context.memory.conversation.addAssistant(answer)
  await run.finishSuccess(answer)
  context.io.stream.sendFinal(answer)
  return { message: answer }
})
```

That one handler already shows the main context groups.

## The Context Groups

### 1. `context.input`

Use `context.input` for invocation input:

```ts
const sessionId = payload.sessionId ?? context.input.message.id
```

### 2. `context.memory`

Use `context.memory` for chat history and durable workflow state.

```ts
await context.memory.conversation.addUser(payload.prompt)
const run = await context.memory.run.start({
  title: 'Architecture synthesis',
})
```

Rule:

- `context.memory.conversation` is LLM-visible history
- `context.memory.run` is durable operational state

### 3. `context.invoke`

Use `context.invoke` for allowlisted tools and child agents.

#### Tools

```ts
const faq = await context.invoke.tools.invoke.support['1'].lookupFaq({
  question: payload.prompt,
})
```

#### Child agents

```ts
const triage = await context.invoke.agents.runText({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
})
```

### 4. `context.ai`

Use the model aliases declared in the builder.

```ts
const answer = await context.ai.models['openai:primary'].generate({
  prompt: payload.prompt,
})
```

Or use the higher-level helper:

```ts
import { generateText } from '@purista/ai'

const answer = await generateText({
  model: context.ai.models['openai:primary'],
  request: { prompt: payload.prompt },
  onTextDelta: delta => context.io.stream.sendChunk(delta),
})
```

Use `context.ai.models` when the handler itself owns the reasoning loop.

Skills also live under `context.ai`:

```ts
const skills = await context.ai.skills.loadAvailable()
```

Reflection and policy helpers also live here:

```ts
const quality = context.ai.policy.resolve(payload.qualityProfile)
const reflection = await context.ai.reflect.run({
  name: 'support-answer',
  profile: quality.name,
  draft: async () => 'first draft',
  critique: async () => ({ accepted: true, feedback: [] }),
  accept: ({ critique }) => critique.accepted,
})
```

Resolved quality profiles are operational, not descriptive only. When a profile
declares `execution.maxModelSteps` or `execution.maxToolCalls`, those limits are
enforced by the runtime wrappers.

### 5. `context.io`

Use `context.io.stream` and `context.io.protocol` for transport-facing output.

```ts
context.io.stream.sendChunk('Working...')
context.io.stream.sendFinal('Resolved')
context.io.protocol.emitArtifact({
  artifactId: 'result',
  content: { ok: true },
  final: true,
})
```

### 6. `context.output`

Use `context.output.emit(...)` only for declared PURISTA events that your
application explicitly wants to publish. Agents do not emit custom events by
default.

```ts
await context.output.emit('support.agent.completed', {
  sessionId,
  escalated: false,
})
```

### 7. `context.app`

Use `context.app.resources` and `context.app.manifest` for application-owned configuration and metadata.

```ts
const instruction = context.app.resources.supportPolicy.developerInstruction
```

### 8. `context.runtime`

Use `context.runtime` for low-level runtime helpers and stores when the higher-level APIs are not enough.

Approvals live here:

```ts
await context.runtime.approvals.wait({
  checkpoint: 'publish-response',
  detail: 'Review before sending',
})
```

Approval expiry fails the run by default. If you need to write or inspect the
decision outside the waiting helper, use the exported approval helpers:

```ts
import { getApprovalStateKey, writeApprovalDecision } from '@purista/ai'

const key = getApprovalStateKey('supportAgent', '1', 'publish-response')
await writeApprovalDecision(context.runtime.stores.states, {
  agentName: 'supportAgent',
  agentVersion: '1',
  checkpoint: 'publish-response',
  decision: 'approved',
  decidedBy: 'reviewer-1',
})
```

### 9. `context.invoke.expose`

Use `context.invoke.expose.*` only when adapting to an external tool/runtime loop.

Example:

```ts
const bindings = context.invoke.expose.tools({
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

- Use `context.invoke.tools` for command-backed operations.
- Use `context.invoke.agents` for child-agent orchestration.
- Use `context.ai.skills` for declared instruction bundles.
- Use `context.memory.run` for durable workflow state.
- Use `context.ai.reflect` when a draft/critique/refine loop is worth the cost.
- Use `context.runtime.approvals` only for explicit gated transitions.
- Use `context.ai.models` for provider-owned adapters such as `AiSdkProvider`.
- Use `context.invoke.expose` only when you are crossing into an adapter boundary such as the AI SDK.

## Common Mistakes

- Treating `context.ai.skills` as a global registry instead of a declared per-agent scope.
- Using conversation history to store workflow checkpoints.
- Re-implementing tool exposure manually instead of using `context.invoke.expose`.
- Mixing runtime bootstrapping into the handler.

## Related Guides

- [Builder](./agent-builder.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
- [Durable Run State](./run-state.md)
