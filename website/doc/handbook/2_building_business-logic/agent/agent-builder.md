---
title: Builder
description: Define the agent contract with AgentBuilder before you think about runtime wiring or SDK adapters.
order: 203702
---

# Builder

`AgentBuilder` is the definition phase of a PURISTA agent.

Use it to declare:

- the agent identity
- payload and output schemas
- execution mode
- model aliases
- allowlisted commands
- allowlisted child agents
- declared skills
- transport exposure

Do not use it to provide concrete runtime dependencies. That belongs in `getInstance(...)`.

## The Right Mental Model

The builder should answer only this question:

> What is this agent allowed to do?

It should not answer:

- which real provider instance is used
- where skills come from
- which queue bridge is active
- whether a sandbox image exists

Those are runtime concerns.

## A Good Builder Definition

```ts
import { AgentBuilder } from '@purista/ai'
import { z } from 'zod'

export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Queued durable support assistant',
})
  .setExecutionMode('queued')
  .setExecutionPolicy({
    httpBehavior: 'attach-and-stream',
    recovery: 'resume-from-checkpoints',
    scopeFromPayload: ['sessionId'],
  })
  .addPayloadSchema(
    z.object({
      prompt: z.string().min(1),
      sessionId: z.string().optional(),
    }),
  )
  .defineModel('openai:primary', { capabilities: ['text', 'stream'] })
  .useSkills(['spec-elicitation', 'support-workflow'])
  .canInvoke('support', '1', 'lookupFaq')
  .canInvokeAgent('triageAgent', '1')
  .persistConversation('user', { maxFrames: 20 })
  .persistConversation('agent', { maxFrames: 20 })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setSseProtocol('ai-sdk-ui-message')
  .setHandler(async (context, payload) => {
    // implementation goes here
    return { message: '...' }
  })
  .build()
```

## Builder Areas

### 1. Identity and schemas

Use these first:

- `agentName`
- `agentVersion`
- `addPayloadSchema(...)`
- `addParameterSchema(...)`
- `addOutputSchema(...)`

These make the workload explicit and testable.

### 2. Execution mode

Use:

- `setExecutionMode('inline')`
- `setExecutionMode('queued')`

Rule:

- `inline` for short, immediate work
- `queued` for long-running, streaming, resumable, or failure-sensitive work

Queued durable agents should usually also define:

- `setExecutionPolicy(...)`
- `context.runState` usage in the handler

### 3. Models

Use `defineModel(alias, capabilities)` to declare model aliases.

```ts
.defineModel('openai:primary', { capabilities: ['text', 'stream'] })
.defineModel('openai:classifier', { capabilities: ['json'] })
```

The builder should declare aliases, not provider objects. Real providers are bound later at instance creation.

### 4. Commands and child agents

Use:

- `canInvoke(serviceName, serviceVersion, commandName)`
- `canInvokeAgent(agentName, agentVersion)`

These declarations feed both:

- direct handler APIs like `context.tools` and `context.agents`
- external runtime binding helpers like `context.expose.tools(...)`

### 5. Skills

Use:

```ts
.useSkills(['spec-elicitation', 'support-workflow'])
```

This means:

- the agent may only access these skill names
- the runtime must provide implementations for those names
- `context.skills` is scoped to that declared set

It does not mean:

- automatically load a global catalog
- automatically inject PURISTA’s own skills
- search arbitrary skills outside the declared boundary

### 6. Transport

Use:

- `exposeAsHttpEndpoint(...)`
- `setSseProtocol(...)`

These are still builder concerns because transport exposure is part of the public contract of the workload.

## What Should Not Live In The Builder

Do not put these concerns into the builder:

- model provider instances
- concrete skill catalogs
- conversation store instances
- queue bridge instances
- sandbox runtime drivers

Those belong in `getInstance(...)`.

## Decision Rules

- If you can explain the setting as part of the agent contract, it belongs in the builder.
- If it depends on environment, infrastructure, or deployment, it belongs in instance creation.
- If it is actual business logic, it belongs in the handler.

## Common Mistakes

- Putting runtime dependency wiring into the builder discussion.
- Thinking `.useSkills([...])` provides skills by itself.
- Using queued execution without planning for `context.runState`.
- Jumping to SDK adapters before the agent contract is clear.

## Related Guides

- [Quick Start](./getting-started.md)
- [Context](./handler-context.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
