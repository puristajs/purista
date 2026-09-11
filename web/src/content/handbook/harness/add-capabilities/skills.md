---
title: Add skills
description: Mount reviewed instruction files without confusing a skill with authorization or tools.
order: 420
---

A skill is reviewed instruction material and supporting files. It never grants
a tool, sandbox, credential, or business permission.

```ts title="src/harness/skills/returnsSupport.ts"
import { builtInTools, defineAgent, defineHarness, defineSkill } from '@purista/harness'

const returns = defineSkill('returns-support', {
  directory: new URL('./returns-support/', import.meta.url),
})
const support = defineAgent('support', {
  model: 'answering',
  skills: [returns],
  tools: [builtInTools.read],
  instructions: 'Use the reviewed returns skill when it applies.',
})
export const definition = defineHarness({ name: 'support' }).addAgent(support)
```
Review the directory as supply-chain input. Mounting a skill is inert until the
agent explicitly allows it, and `builtInTools.read` is still required when the model must
read skill files. Keep source trust, credentials, egress, sandbox policy, and
business authorization separate.
