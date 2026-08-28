---
title: Add skills
description: Mount reviewed procedures and references without turning them into implicit authority.
order: 420
---

A skill is a directory of reviewed files, usually beginning with `SKILL.md`.
Use one when a returns-support agent needs a maintained procedure, not an
implicit instruction pasted into every prompt. Harness mounts the directory
into the sandbox; it does not paste the whole directory into the model prompt.
The agent needs the built-in `read` tool and an explicit skill allowlist to
open it.

```text title="skills/support-methods/SKILL.md"
# Returns support

Read the order before explaining a return. Escalate a damaged-goods claim; do
not issue a refund directly.
```

```ts title="src/harness/returnsSupport.ts"
import { fileURLToPath } from 'node:url'
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

const supportMethodsDirectory = fileURLToPath(new URL('../../skills/support-methods/', import.meta.url))

export const returnsSupportHarness = defineHarness({ name: 'returns-support' })
  .sandbox(inMemorySandbox())
  .models({
    assistant: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object', 'tool_use'] },
  })
  .tools(({ tool }) => ({
    find_order: tool({
      description: 'Return the order status visible to the customer.',
      input: z.object({ orderId: z.string().min(1) }),
      output: z.object({ status: z.enum(['pending', 'shipped', 'delivered']) }),
      handler: async (_ctx, { orderId }) => ({ status: orderId === 'order-42' ? 'delivered' : 'pending' }),
    }),
  }))
  .skills({
    support_methods: { directory: supportMethodsDirectory },
  })
  .agents(({ agent }) => ({
    support: agent({
      model: 'assistant',
      input: z.object({ orderId: z.string() }),
      output: z.object({ answer: z.string() }),
      skills: ['support_methods'],
      builtinTools: ['read'],
      tools: ['find_order'],
      instructions: 'Read the support method before handling a return.',
    }),
  }))
  .build()
```

Skills are available in the core package; no feature dependency is required.
They describe a method, checklist, or reference—not executable authority. Pair
them with a narrow [tool](/handbook/harness/add-capabilities/tools/) when work must change business data.

[`skills`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#skills) is a
registry keyed by the ID that agents place in `skills`. Each
[`SkillDefinition`](/handbook/api/interfaces/_purista_harness.SkillDefinition/)
needs a `directory` containing `SKILL.md`; resolve it from the module so the
location does not depend on the process working directory. Validation is
`strict` by default and `trust` is `trusted` by default. Set `validationMode`
or `trust` only when a reviewed loading policy requires a different behavior.
Missing directories, a missing `SKILL.md`, invalid frontmatter, or a sandbox
without mount support prevent the skill from being used; they do not silently
turn it into prompt text.

| Call or field | What it establishes | When to use it |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the named composition that owns the skill filesystem and session registries. | Its name defaults to `agent-harness`; use it for diagnostics, never as a user, tenant, or authorization value. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | A mountable session filesystem. | Choose a sandbox that actually supports the intended skill mount; it does not grant the skill access by itself. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the `assistant` alias before the agent chooses it. | `object` supports the structured answer; `tool_use` is also required because the normal agent loop exposes the custom `find_order` and built-in `read` tools to the model. |
| [`.tools(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers the application-owned `find_order` capability. | The callback helper is required for a TypeScript handler and keeps its schemas and sandbox context typed. A tool ID cannot duplicate another registered tool, a skill, or a built-in name. |
| [`.skills(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#skills) | The registry of reviewed skill directories. | Register the skill before agents so only known IDs are accepted in `skills`. |
| [`directory`](/handbook/api/interfaces/_purista_harness.SkillDefinition/#directory) | The absolute directory containing `SKILL.md`. | Resolve it from the module, as shown, instead of depending on a deployment working directory. |
| [`validationMode`](/handbook/api/interfaces/_purista_harness.SkillDefinition/#validationmode) | Manifest validation policy; it defaults to `strict`. | Change it only for a reviewed loading policy; invalid content must stay visible. |
| [`trust`](/handbook/api/interfaces/_purista_harness.SkillDefinition/#trust) | Provenance classification; it defaults to `trusted`. | Set it explicitly when the reviewed source is project or user supplied. It never turns a skill into authorization. |
| [`skills` / `builtinTools`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#skills) | Agent allowlist plus the built-in `read` needed to open a mounted skill. | Grant both only to agents that need the procedure. Omit either one to deny that path. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Registers the `support` session entry point after its model, tool, and skill IDs exist. | Use the callback helper to retain those literal allowlists. Unknown skill IDs are rejected at agent registration; unknown model and tool IDs are rejected on build. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the full model, tool, skill, and agent composition. | It catches missing models and shared tool/skill/built-in namespace collisions before a session starts; malformed or unavailable skill files still fail when activation needs them. |

## Review the files like code

- Keep each skill focused and give `SKILL.md` a clear name and description.
- Version and review skill content with the application.
- Treat every instruction in a skill as untrusted for authorization purposes.
- Test that only the intended agent has `read` and the skill binding.
- Do not place secrets in a mounted skill directory.

The deterministic `find_order` tool owns the authorization check in a real
application; the model and skill do not. Test the agent with a scripted model
or deterministic adapter, then evaluate whether it follows the procedure
separately.

Use [agent plugins](/handbook/harness/add-capabilities/agent-plugins/) only when skills and MCP declarations
must arrive as a separately reviewed package.
