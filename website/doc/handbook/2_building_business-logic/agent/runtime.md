---
title: Runtime
description: Create running agent instances by binding models, skills, stores, queues, and sandbox runtime at getInstance(...).
order: 203704
---

# Runtime

`AgentBuilder` definitions are inert. They become real workloads only when you
call `getInstance(eventBridge, options)`.

This is the instance-creation phase of the PURISTA lifecycle.

## What Belongs In `getInstance(...)`

Provide concrete runtime dependencies here:

- model providers
- queue bridge
- stores
- resource implementations
- skills
- runtime config values
- pool configuration
- sandbox-backed execution resources

This is where environment and infrastructure meet the builder definition.

## The Common Example

```ts
import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'
import { AiSdkProvider, createLayeredFileSkillResource } from '@purista/ai'

const eventBridge = new DefaultEventBridge()
const queueBridge = new DefaultQueueBridge()

await eventBridge.start()

const supportSkills = createLayeredFileSkillResource({
  canonicalRoots: [new URL('../../skills', import.meta.url).pathname],
  overlayRoots: [new URL('./skills', import.meta.url).pathname],
})

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  queueBridge,
  models: {
    'openai:primary': new AiSdkProvider({
      model: openai('gpt-4o-mini'),
    }),
  },
  conversationStore: conversationStore,
  resources: {
    supportPolicy: {
      developerInstruction: 'Answer concisely and always include next steps.',
    },
  },
  skills: supportSkills,
  config: {
    locale: 'en',
  },
  poolConfig: {
    poolId: 'support',
    maxConcurrencyPerInstance: 4,
  },
})

await supportAgentInstance.start()
```

## Models

The builder declares aliases. `getInstance(...)` binds those aliases to real providers.

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': provider,
  },
})
```

Think about models in two steps:

1. the builder says which aliases exist
2. instance creation says what those aliases really use

That keeps the handler simple, because the handler only needs `context.models['alias']`.

## Skills

`getInstance(...)` is also where you provide the actual skill implementations.

Two common paths:

### Inline typed skills

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': provider,
  },
  skills: {
    'spec-elicitation': {
      content: 'Ask for missing constraints before committing to architecture.',
    },
    'support-workflow': {
      content: 'Triage first, then gather facts, then answer.',
    },
  },
})
```

### File-based skill catalogs

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': provider,
  },
  skills: createLayeredFileSkillResource({
    canonicalRoots: [canonicalRoot],
    overlayRoots: [appRoot],
  }),
})
```

Use inline skills for tests or tiny agents. Use file-based catalogs when you want reusable application skills.

## Runtime config

Use runtime config for small host-controlled values declared earlier with
`setConfigSchema(...)` and optionally `setDefaultConfig(...)`.

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': provider,
  },
  config: {
    locale: 'en',
  },
})
```

Read the resolved values in the handler through:

```ts
context.config.runtime.locale
```

Rule:

- use resources for runtime objects or richer dependencies
- use config for simple validated values

## Queue Bridge

Queued durable agents need a `queueBridge`.

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  queueBridge,
  models: {
    'openai:primary': provider,
  },
})
```

Inline agents do not need one.

Rule:

- if the builder uses `setExecutionMode('queued')`, plan to provide a queue bridge

## Resources and stores

Declare resources in the builder with `defineResource(...)`, then provide the
real implementation at instance creation.

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': provider,
  },
  resources: {
    supportPolicy: {
      developerInstruction: 'Be concise and operational.',
    },
  },
  conversationStore,
})
```

This keeps runtime dependencies explicit. The builder says which resources are
required; the instance says what concrete implementation exists.

## Pools

Use pool config to constrain concurrency.

```ts
poolConfig: {
  poolId: 'support',
  maxConcurrencyPerInstance: 4,
}
```

Use pools when:

- model calls are expensive
- you need fairness across workloads
- queued workers should not run unbounded parallel work

## Sandbox Runtime

If the agent needs a real workspace for:

- shell execution
- repository work
- skill scripts
- generated files

then instance creation is where you provide the sandbox-backed execution resource.

The canonical sandbox layout is:

```text
/workspace/
  repo/
  skills/
  tmp/
  outputs/
```

Rules:

- repo files belong in `/workspace/repo`
- materialized skill bundles belong in `/workspace/skills/<skill-name>`
- scratch data belongs in `/workspace/tmp`
- generated non-repo outputs belong in `/workspace/outputs`

You do not need sandbox for every agent. Add it only when the agent really needs workspace execution.

## Instance Creation Checklist

When `getInstance(...)` feels unclear, ask:

1. Which model aliases must be bound?
2. Is the agent inline or queued?
3. Does it need declared skills, and where do those skills come from?
4. Does it need runtime config values?
5. Does it need stores or resources?
6. Does the chosen model provider need to drive an external tool loop?
7. Does it need a real sandbox workspace?

That checklist covers almost all runtime confusion.

## Common Mistakes

- Expecting `.useSkills([...])` to provide skills by itself.
- Forgetting the queue bridge for queued agents.
- Mixing provider creation into the builder instead of instance creation.
- Forgetting to provide resources declared with `defineResource(...)`.
- Putting object-style runtime dependencies into `config` when they should be resources.
- Introducing sandbox complexity for agents that only need models and commands.

## Related Guides

- [Quick Start](./getting-started.md)
- [Context](./handler-context.md)
- [Builder](./agent-builder.md)
- [Skills](./skills.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
- [Sandbox Runtime](../../3_eco_system/sandbox.md)
