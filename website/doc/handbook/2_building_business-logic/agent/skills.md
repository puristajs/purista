---
title: Skills
description: Define skills, declare them in the builder, provide them at getInstance(...), and use them from the handler or adapters.
order: 203705
---

# Skills

Skills are reusable instruction bundles.

In PURISTA, skills follow the same lifecycle as the rest of the AI runtime:

1. define the skill
2. declare the allowed skill names in the builder
3. provide the implementations at `getInstance(...)`
4. load them from `context.skills` in the handler
5. optionally pass them to an adapter such as the Vercel AI SDK

That is the important point: skills are part of the PURISTA lifecycle, not an independent magic subsystem.

## A Skill On Disk

PURISTA uses a reusable filesystem convention:

```text
skills/
  spec-elicitation/
    SKILL.md
    references/
    scripts/
    assets/
```

Only `SKILL.md` is required.

Example:

```md
---
name: spec-elicitation
description: Clarify business requirements before architecture or coding starts.
topics:
  - specs
  - discovery
phases:
  - clarification
---

# Spec Elicitation

Ask for:
- users and roles
- core workflows
- constraints and integrations
- non-functional requirements

Do not jump into implementation before the business flow is clear.
```

Optional folders:

- `references/` for deeper material loaded on demand
- `scripts/` for sandbox-backed executable helpers
- `assets/` for templates or static support files

## Step 1: Declare Skill Names In The Builder

The builder defines which skills the agent may use.

```ts
export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
})
  .defineModel('openai:primary', { capabilities: ['text', 'stream'] })
  .defineResource<'supportPolicy', { developerInstruction: string }>()
  .useSkills(['spec-elicitation', 'support-workflow'])
  .setHandler(async (context, payload) => {
    const skills = await context.skills.loadAvailable()
    const prompt = [
      context.resources.supportPolicy.developerInstruction,
      ...skills.map(skill => skill.content),
      payload.prompt,
    ].join('\n\n')

    const answer = await context.models['openai:primary'].generateText({
      prompt,
    })

    return { message: answer }
  })
  .build()
```

What `.useSkills([...])` means:

- these are the only skill names this agent may access
- `context.skills` is scoped to those names
- runtime provisioning must provide those names

What it does not mean:

- auto-load a global skill catalog
- auto-inject PURISTA skills by default
- search outside the declared boundary

## Step 2: Provide Skills At `getInstance(...)`

This is where the builder declaration becomes real.

### Option A: Inline Typed Skills

This is the smallest and clearest setup.

```ts
const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': provider,
  },
  resources: {
    supportPolicy: {
      developerInstruction: 'Clarify missing details before answering.',
    },
  },
  skills: {
    'spec-elicitation': {
      content: 'Clarify missing roles, workflows, and constraints before answering.',
    },
    'support-workflow': {
      content: 'Triage first, gather facts second, answer last.',
      references: {
        'fallbacks.md': 'If facts are missing, say what is missing instead of guessing.',
      },
    },
  },
})
```

Why this is good DX:

- TypeScript keys are constrained by `.useSkills([...])`
- instance creation stays explicit
- no external catalog is required for small setups

### Option B: File-Based Skill Catalogs

For larger or shared catalogs, provide a `SkillResource`.

```ts
import { createLayeredFileSkillResource } from '@purista/ai'

const supportSkills = createLayeredFileSkillResource({
  canonicalRoots: [canonicalRoot],
  overlayRoots: [appRoot],
})

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': provider,
  },
  resources: {
    supportPolicy: {
      developerInstruction: 'Clarify missing details before answering.',
    },
  },
  skills: supportSkills,
})
```

Recommended pattern:

- canonical shared roots first
- app or company overlays second
- make any framework-specific catalog opt-in, not implicit

## Step 3: Use Skills In The Handler

Once the instance is created, the handler can load only its declared skills.

### Common path: load everything declared

```ts
const skills = await context.skills.loadAvailable()
```

Use this when the agent should always see the full declared set.

### Narrow within the declared set

```ts
const skills = await context.skills.search({
  queries: [payload.prompt],
  limit: 1,
})
```

This searches only within the declared names from `.useSkills([...])`.

### Load references when needed

```ts
const references = await context.skills.loadReferences('support-workflow')
```

### Render for prompts

```ts
import { renderSkillDocuments, renderSkillReferences } from '@purista/ai'

const skills = await context.skills.loadAvailable()
const references = await context.skills.loadReferences('support-workflow')

const prompt = [
  renderSkillDocuments('Relevant skills', skills),
  renderSkillReferences('Relevant references', references),
  `Customer request: ${payload.prompt}`,
]
  .filter(Boolean)
  .join('\n\n')
```

## End-To-End Example

Here is the complete skill flow in one place.

### Define the skills

```text
skills/
  spec-elicitation/
    SKILL.md
  support-workflow/
    SKILL.md
    references/
```

### Declare them in the builder

```ts
.useSkills(['spec-elicitation', 'support-workflow'])
```

### Provide them at instance creation

```ts
skills: {
  'spec-elicitation': {
    content: 'Ask for missing requirements first.',
  },
  'support-workflow': {
    content: 'Triage first, then gather support facts, then answer.',
  },
}
```

### Use them in the handler

```ts
const skills = await context.skills.loadAvailable()
const answer = await context.models['openai:primary'].generateText({
  developerInstruction: context.resources.supportPolicy.developerInstruction,
  prompt: [payload.prompt, ...skills.map(skill => skill.content)].join('\n\n'),
})
```

That is the PURISTA story:

- define
- declare
- provide
- use

## Skills With Sandbox

If a skill bundle includes scripts or support files, the sandbox runtime can materialize it into the canonical workspace layout:

```text
/workspace/
  repo/
  skills/
    <skill-name>/
  tmp/
  outputs/
```

Use this when the agent needs:

- executable skill scripts
- templates or support files on disk
- isolated file generation

Do not add sandbox just for plain text skills.

## Skills With A Model Adapter

When a model provider such as `AiSdkProvider` owns the external tool loop, keep the same PURISTA flow:

1. load the skills in the handler
2. pass them to the model request
3. let the provider translate them

```ts
const skills = await context.skills.loadAvailable()
const references = await context.skills.loadReferences('support-workflow')

const answer = await context.models['openai:primary'].generateText({
  developerInstruction: 'Use the support workflow before answering.',
  skills,
  references,
  prompt: payload.prompt,
  bindings: context.expose.tools({
    commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
  }),
})
```

The provider consumes the skills, but it does not replace the PURISTA lifecycle. The concrete provider is bound at `getInstance(...)`, not inside the handler. The handler still only depends on `context.models['alias']`, so swapping adapters later should not require handler changes.

## Decision Rules

- Use inline skills first for small agents and tests.
- Use file-based skill catalogs when you need shared or layered catalogs.
- Use `loadAvailable()` for the default path.
- Use `search(...)` only to narrow within the declared set.
- Use sandbox only when skills need a real workspace.

## Common Mistakes

- Thinking `.useSkills([...])` provides the skills by itself.
- Treating `context.skills` as a global registry.
- Using filesystem catalogs when inline typed skills would be simpler.
- Adding sandbox to agents that only need text skills.

## Related Guides

- [Builder](./agent-builder.md)
- [Context](./handler-context.md)
- [Runtime](./runtime.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
- [Sandbox Runtime](../../3_eco_system/sandbox.md)
