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
- execution mode and policies
- runtime config schema and defaults
- model aliases and hooks
- declared resources
- allowlisted commands and child agents
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
  .setBeforeGuardHooks({
    requirePrompt: async function requirePrompt(_context, payload) {
      if (!payload.prompt.trim()) {
        throw new Error('prompt is required')
      }
    },
  })
  .persistConversation('user', { maxFrames: 20 })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setSseProtocol('ai-sdk-ui-message')
  .setHandler(async (context, payload) => {
    // implementation goes here
    return { message: '...' }
  })
  .build()
```

## Builder Areas

### 1. Identity and Schemas

Use these first:

- `agentName`
- `agentVersion`
- `addPayloadSchema(...)`
- `addParameterSchema(...)`
- `addOutputSchema(...)`

These make the workload explicit and testable.

### 2. Execution Mode and Policies

#### Execution Mode

Use:

- `setExecutionMode('inline')` for short, immediate work.
- `setExecutionMode('queued')` for long-running, streaming, resumable, or failure-sensitive work.

Queued durable agents should usually also define an execution policy and use `context.memory.run` in the handler.

#### Execution Policy

`setExecutionPolicy` defines how a queued agent behaves:

```ts
.setExecutionPolicy({
  httpBehavior: 'attach-and-stream',
  recovery: 'resume-from-checkpoints',
  scopeFromPayload: ['sessionId'],
})
```

- `httpBehavior`: What happens when an HTTP request hits a running durable agent. `'attach-and-stream'` is common.
- `recovery`: How to handle interruptions. `'resume-from-checkpoints'` is key for durability.
- `scopeFromPayload`: Creates a durable run scope from payload fields, so subsequent calls for the same `sessionId` attach to the same run.

#### Other Policies

- `setAgentPolicy(...)`: Defines agent-wide policies for quality, approvals, and resource usage.
- `setReflectionPolicy(...)`: Configures self-correction loops (draft, critique, refine).
- `setRetryPolicy(...)`: Defines retry behavior for transient failures.

### 3. Runtime Config

Use runtime config for small, host-controlled settings that are not model instances, resources, or request payload.

```ts
.setConfigSchema(
  z.object({
    locale: z.string().min(2).default('en'),
  }),
)
.setDefaultConfig({ locale: 'en' })
```

Typical examples:

- Locale or formatting defaults
- Feature flags for a deployment
- Max step count or retry knobs

Rule:

- The builder declares the config contract with `setConfigSchema`.
- `getInstance(...)` provides concrete config values.
- The handler reads values from `context.runtime.service.config`.

More detail: [Runtime](./runtime.md)

### 4. Models

#### Model Aliases

Use `defineModel(alias, { capabilities })` to declare model aliases.

```ts
.defineModel('openai:primary', { capabilities: ['text', 'stream'] })
.defineModel('openai:classifier', { capabilities: ['json'] })
```

The builder declares aliases, not provider objects. Real providers are bound at instance creation.

#### Model Hooks

Use `prepareCall` or `prepareStep` to dynamically modify model requests. This is useful for adding metadata or changing options based on the agent's state.

```ts
.prepareStep(async ({ step, alias }) => {
  if (alias === 'openai:primary' && step > 1) {
    return {
      aiSdk: {
        temperature: 0.5, // Increase temperature for subsequent steps
      },
    };
  }
})
```

- `prepareCall`: A hook that runs for every model call.
- `prepareStep`: A step-aware hook, useful for iterative refinements.

### 5. Resources

Use `defineResource(...)` for runtime dependencies that should be declared upfront and provided at `getInstance(...)`.

```ts
.defineResource<'supportPolicy', { developerInstruction: string }>()
```

This gives you:

- A typed requirement at instance creation.
- `context.app.resources.supportPolicy` in the handler.

Use resources for domain-specific helpers, runtime policies, or repositories. Do not use them for model providers, queue bridges, skills, or request payload.

### 6. Conversation Persistence

Use `persistConversation` to configure how chat history is stored.

You can use convenient presets:

```ts
// Good for user messages: full content, more history
.persistConversation('user', { maxFrames: 40 })

// Good for agent responses: summarized, less history
.persistConversation('agent', { maxFrames: 20 })
```

Or provide a full configuration object for more control.

### 7. Invocations and Events

#### Commands and Child Agents

Use:

- `canInvoke(serviceName, serviceVersion, commandName)`
- `canInvokeAgent(agentName, agentVersion)`

These declarations enable `context.invoke.tools` and `context.invoke.agents` in the handler and are used by adapters for tool exposure.

#### Custom Events

Declare events the agent can emit with `canEmit(...)`:

```ts
.canEmit(
  'support.agent.completed',
  z.object({ sessionId: z.string(), escalated: z.boolean() }),
)
```

Emit them from the handler:

```ts
await context.output.emit('support.agent.completed', {
  sessionId: payload.sessionId,
  escalated: false,
})
```

For a single, automatic event with the agent's final result, use `setSuccessEventName(...)` instead.

### 8. Guards

Use guard hooks for request policy checks before or after the handler runs.

```ts
.setBeforeGuardHooks({
  requirePrompt: async function requirePrompt(_context, payload) {
    if (!payload.prompt.trim()) {
      throw new Error('prompt is required')
    }
  },
})
```

Good use cases: auth checks, quota management, and input validation.
Bad use cases: business logic, model calls, or command orchestration.

Keep guards short. They are part of the contract, not the workflow.

### 9. Transport

Use `exposeAsHttpEndpoint(...)` to expose the agent via HTTP.

```ts
.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
```

For streaming responses, you can set a specific Server-Sent Events (SSE) protocol with `setSseProtocol(...)`:

```ts
.setSseProtocol('ai-sdk-ui-message')
```

Available protocols include:
- `purista`: The default, raw PURISTA protocol.
- `ai-sdk-ui-message`: Compatible with the Vercel AI SDK UI.
- `ai-sdk-custom`: For use with the Vercel AI SDK's `experimental_streamText`.

Transport exposure is part of the agent's public contract.

## What Should Not Live In The Builder

Do not put these concerns into the builder:

- Model provider instances
- Concrete skill catalogs
- Conversation store instances
- Queue bridge instances
- Sandbox runtime drivers
- Resource implementations
- Runtime config values

Those belong in `getInstance(...)`.

## Decision Rules

- If it's part of the agent's contract, it belongs in the builder.
- If it depends on the environment or infrastructure, it belongs in instance creation.
- If it's business logic, it belongs in the handler.

## Common Mistakes

- Putting runtime dependencies in the builder.
- Thinking `.useSkills([...])` provides skills by itself.
- Forgetting to provide resources declared with `defineResource(...)`.
- Hardcoding environment values instead of using `setConfigSchema(...)`.
- Using `queued` execution without `context.memory.run`.

## Related Guides

- [Quick Start](./getting-started.md)
- [Context](./handler-context.md)
-- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
- [Production-Ready Agents](./production-ready-agents.md)
