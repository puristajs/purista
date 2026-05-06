---
title: Skills
description: Provide reusable skill content at startup and load it from the handler when the agent actually needs it.
order: 203705
---

# Skills

Skills are runtime resources for reusable instructions and references.

The current pattern is:

1. define or load the skill source
2. pass it through `getInstance(..., { ai: { skills } })`
3. load it from `context.ai.skills` inside the handler

## Inline Skills

```ts
const service = await supportV1Service.getInstance(eventBridge, {
  queueBridge,
  ai: {
    model: {
      'openai:primary': provider,
    },
    skills: {
      'support-workflow': {
        content: 'Use factual tool output first, then answer concisely.',
      },
    },
  },
})
```

## File-Based Skills

```ts
import { createLayeredFileSkillResource } from '@purista/ai'

const supportSkills = createLayeredFileSkillResource({
  overlayRoots: [new URL('./skills', import.meta.url).pathname],
})
```

## Handler Usage

```ts
const skills = await context.ai.skills.loadAvailable()
const prompt = [skills.map(skill => skill.content).join('\n\n'), payload.prompt].join('\n\n')
```

Skills remain runtime data. They should not be embedded as hard-coded builder configuration.
