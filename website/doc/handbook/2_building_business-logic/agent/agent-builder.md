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
- runtime config schema and defaults
- model aliases
- declared resources
- allowlisted commands
- allowlisted child agents
- declared skills
- guard hooks
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
  .setConfigSchema(
    z.object({
      locale: z.string().min(2).default('en'),
    }),
  )
  .setDefaultConfig({ locale: 'en' })
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
  .defineResource<'supportPolicy', { developerInstruction: string }>()
  .useSkills(['spec-elicitation', 'support-workflow'])
  .canInvoke('support', '1', 'lookupFaq')
  .canInvokeAgent('triageAgent', '1')
  .canEmit(
    'support.agent.completed',
    z.object({
      sessionId: z.string(),
      escalated: z.boolean(),
    }),
  )
  .setBeforeGuardHooks({
    requirePrompt: async function requirePrompt(_context, payload) {
      if (!payload.prompt.trim()) {
        throw new Error('prompt is required')
      }
    },
  })
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

### 3. Runtime config

Use runtime config when the agent needs small host-controlled settings that are
not model instances, not resources, and not request payload.

```ts
.setConfigSchema(
  z.object({
    locale: z.string().min(2).default('en'),
  }),
)
.setDefaultConfig({ locale: 'en' })
```

Typical examples:

- locale or formatting defaults
- feature flags for one deployment
- max step count or retry policy knobs

Rule:

- builder declares the config contract
- `getInstance(...)` provides concrete config values
- handler reads the resolved values from `context.config.runtime`

More detail:

- [Runtime](./runtime.md)

### 4. Models

Use `defineModel(alias, capabilities)` to declare model aliases.

```ts
.defineModel('openai:primary', { capabilities: ['text', 'stream'] })
.defineModel('openai:classifier', { capabilities: ['json'] })
```

The builder should declare aliases, not provider objects. Real providers are bound later at instance creation.

### 5. Resources

Use `defineResource(...)` when the handler needs a runtime dependency that
should be declared up front and provided explicitly at `getInstance(...)`.

```ts
.defineResource<'supportPolicy', { developerInstruction: string }>()
```

That gives you:

- a typed requirement at instance creation
- `context.resources.supportPolicy` in the handler

Use resources for:

- domain-specific helper objects
- runtime policies
- repositories or service clients you own

Do not use resources for:

- model providers
- queue bridges
- skills
- request payload data

### 6. Commands and child agents

Use:

- `canInvoke(serviceName, serviceVersion, commandName)`
- `canInvokeAgent(agentName, agentVersion)`

These declarations feed both:

- direct handler APIs like `context.tools` and `context.agents`
- external runtime binding helpers like `context.expose.tools(...)`

`canEmit(...)` belongs in the same contract area. It declares which custom
PURISTA events the agent may emit from the handler with `context.emit(...)`.

### 7. Skills

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

### 8. Guards

Use guard hooks for request policy checks that should happen before or after the
handler body.

```ts
.setBeforeGuardHooks({
  requirePrompt: async function requirePrompt(_context, payload) {
    if (!payload.prompt.trim()) {
      throw new Error('prompt is required')
    }
  },
})
```

Good guard use cases:

- auth or tenant checks
- quota and rate policy checks
- cheap request validation beyond schema shape
- audit or policy hooks after execution

Bad guard use cases:

- long-running business logic
- model calls
- command orchestration

Keep guards short and deterministic. They are part of the agent contract, not
the handler workflow.

Use normal function syntax for guard hooks so PURISTA can bind `this` the same
way it does for commands, streams, subscriptions, and queue workers.

### 8a. Custom events

Agents can emit normal PURISTA custom events just like commands and streams.

```ts
.canEmit(
  'support.agent.completed',
  z.object({
    sessionId: z.string(),
    escalated: z.boolean(),
  }),
)
```

Then in the handler:

```ts
await context.emit('support.agent.completed', {
  sessionId: payload.sessionId ?? context.message.id,
  escalated: false,
})
```

### 9. Transport

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
- resource implementations
- runtime config values

Those belong in `getInstance(...)`.

## Decision Rules

- If you can explain the setting as part of the agent contract, it belongs in the builder.
- If it depends on environment, infrastructure, or deployment, it belongs in instance creation.
- If it is actual business logic, it belongs in the handler.

## Common Mistakes

- Putting runtime dependency wiring into the builder discussion.
- Thinking `.useSkills([...])` provides skills by itself.
- Putting resource objects into the builder instead of declaring them with `defineResource(...)`.
- Putting environment values into the builder instead of using `setConfigSchema(...)` plus `getInstance(..., { config })`.
- Using queued execution without planning for `context.runState`.
- Jumping to SDK adapters before the agent contract is clear.

## Related Guides

- [Quick Start](./getting-started.md)
- [Context](./handler-context.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
