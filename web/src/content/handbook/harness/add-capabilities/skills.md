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

```md title="skills/support-methods/SKILL.md"
---
name: support-methods
description: Use when answering return requests for an existing order.
---

# Returns support

Read the order before explaining a return. Escalate a damaged-goods claim; do
not issue a refund directly.
```

```ts title="src/harness/returnsSupport.ts"
import { fileURLToPath } from 'node:url'
import { defineHarness, inMemorySandbox, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

const supportMethodsDirectory = fileURLToPath(new URL('../../skills/support-methods/', import.meta.url))

export function createReturnsSupportHarness(provider: ModelProvider) {
	return defineHarness({ name: 'returns-support' })
		.sandbox(inMemorySandbox())
		.models({
			assistant: { provider, model: 'runtime-selected-model', capabilities: ['object', 'tool_use'] },
		})
		.tool('find_order', {
				description: 'Return the order status visible to the customer.',
				input: z.object({ orderId: z.string().min(1) }),
				output: z.object({ status: z.enum(['pending', 'shipped', 'delivered']) }),
				handler: async (_ctx, { orderId }) => ({ status: orderId === 'order-42' ? 'delivered' : 'pending' }),
		})
		.skills({
			'support-methods': { directory: supportMethodsDirectory },
		})
		.agent('support', {
			model: 'assistant',
			input: z.object({ orderId: z.string() }),
			output: z.object({ answer: z.string() }),
			skills: ['support-methods'],
			builtinTools: ['read'],
			tools: ['find_order'],
			instructions: 'Read the support method before handling a return.',
		})
		.build()
}
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
| [`.tool('find_order', definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tool) | Registers the application-owned `find_order` capability. | It keeps schemas and sandbox context typed. A tool ID cannot duplicate another registered tool, a skill, or a built-in name. |
| [`.skills(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#skills) | The registry of reviewed skill directories. | Register the skill before agents so only known IDs are accepted in `skills`. |
| [`directory`](/handbook/api/interfaces/_purista_harness.SkillDefinition/#directory) | The absolute directory containing `SKILL.md`. | Resolve it from the module, as shown, instead of depending on a deployment working directory. |
| [`validationMode`](/handbook/api/interfaces/_purista_harness.SkillDefinition/#validationmode) | Manifest validation policy; it defaults to `strict`. | Change it only for a reviewed loading policy; invalid content must stay visible. |
| [`trust`](/handbook/api/interfaces/_purista_harness.SkillDefinition/#trust) | Provenance classification; it defaults to `trusted`. | Set it explicitly when the reviewed source is project or user supplied. It never turns a skill into authorization. |
| [`skills` / `builtinTools`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Agent allowlist plus the explicit built-in `read` needed to open a mounted skill. | Skills never enable tools. A default-loop skill agent without `read` fails during agent registration, before model or sandbox I/O. Add `list` or `grep` only when navigation needs them. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Registers the `support` session entry point after its model, tool, and skill IDs exist. | The inline definition retains those literal allowlists. Unknown skill IDs and the missing-skill-`read` combination are rejected immediately; unknown model and custom-tool IDs are rejected on build. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the full model, tool, skill, and agent composition. | It catches missing models and shared tool/skill/built-in namespace collisions before a session starts; malformed or unavailable skill files still fail when activation needs them. |

## Review the files like code

- Keep each skill focused and give `SKILL.md` a clear name and description.
- Pin or version the source and review every changed file before deployment.
- Treat `SKILL.md`, references, assets, and model-readable scripts as untrusted
  instructions for authorization purposes. A malicious instruction can still
  ask the model to misuse an otherwise allowed business tool.
- Treat frontmatter `allowed-tools` as an author hint only. Harness preserves
  it as metadata; it does not grant, deny, or constrain tools.
- Test that only the intended agent has `read`, the skill binding, and any
  separate business-tool allowlist.
- Do not place secrets in a mounted skill directory.

## Know what can execute

Registration and mounting only copy files into the session sandbox. A
`scripts/` file is not run automatically, and declaring a skill never enables
`bash`, `write`, `edit`, a custom TypeScript tool, or MCP. Execution becomes
possible only when the application separately exposes an execution-capable
tool or custom handler.

That separation does not make arbitrary skills safe. Before enabling execution:

| Check | Why it matters |
| --- | --- |
| Review the exact skill version or digest and its transitive instructions | A changed procedure can redirect the model toward an allowed side effect. |
| Keep `builtinTools` to the smallest named set | `read` is sufficient to activate `SKILL.md`; the skill system does not need `bash`, `write`, or `edit`. |
| Authorize inside every business tool | Skill instructions and model choices never prove caller, tenant, or resource authority. |
| Use an isolating sandbox for model-directed execution | `inMemorySandbox()` is a filesystem, not a container or tenant boundary; local command helpers do not provide hostile-code isolation. |
| Deny ambient credentials and network egress | A script or external instruction must not inherit secrets or choose an unreviewed destination. |

For discovered project skills, pass only reviewed roots in
`trustedProjectRoots` and inspect every discovery diagnostic. Prefer explicit
production bindings over broad discovery. A successful frontmatter parse proves
shape, not trustworthiness.

The deterministic `find_order` tool owns the authorization check in a real
application; the model and skill do not. Test the agent with a scripted model
or deterministic adapter, then evaluate whether it follows the procedure
separately.

Use [agent plugins](/handbook/harness/add-capabilities/agent-plugins/) only when skills and MCP declarations
must arrive as a separately reviewed package.
