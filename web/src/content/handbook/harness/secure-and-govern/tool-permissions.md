---
title: Set tool permissions
description: Allow, deny, or require approval for built-in tools before an agent can mutate files or execute commands.
order: 411
---

Tool selection and permission answer different questions. `tools` and
`builtinTools` decide which capabilities an agent may request. `permissions`
adds a final policy for the built-in tools that can mutate files or execute a
command. Application tools still enforce domain authorization in their own
handlers.

By the end of this guide, an agent can read a workspace and write only below
`/workspace/drafts` after approval. Attempts to write elsewhere are denied
before the sandbox operation starts.

| Layer | Controls | Does not establish |
| --- | --- | --- |
| `tools` / `builtinTools` | Which tools enter this agent's model loop | Caller identity or business entitlement |
| `permissions` | `bash`, `write`, and `edit` allow/deny/approval behavior | Sandbox isolation or egress policy |
| Tool handler | Tenant, principal, resource ownership, transaction, audit | Model safety or provider behavior |
| Sandbox adapter | Filesystem, process, mount, and platform isolation guarantees it implements | Business authorization |

## 1. Start with no mutating tool

Omit `builtinTools` for an agent that only classifies input; no built-ins are
enabled by default. When an agent needs files, prefer the read-only built-ins
first: `read`, `list`,
`glob`, and `grep` are allowed by their built-in permission behavior. Add a
mutating tool only for a concrete outcome.

```ts title="src/createPolicyReviewHarness.ts"
import { defineHarness, inMemorySandbox, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

export function createPolicyReviewHarness(provider: ModelProvider) {
	return defineHarness({ name: 'policy-review' })
		.sandbox(inMemorySandbox())
		.models({
			assistant: {
				provider,
				model: 'runtime-selected-model',
				capabilities: ['object', 'tool_use'],
			},
		})
		.agent('reviewer', {
			model: 'assistant',
			input: z.string().min(1),
			output: z.object({ summary: z.string() }),
			instructions: 'Read the supplied workspace documents and summarize them.',
			builtinTools: ['read', 'list', 'glob', 'grep'],
		})
		.build()
}
```

The read-only baseline uses [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/),
[`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox),
[`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models),
[`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent),
and [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build).

This agent can inspect files exposed by the configured sandbox, but it cannot
write, edit, or run a command.

| Built-in | Capability | Permission behavior |
| --- | --- | --- |
| `read`, `list`, `glob`, `grep` | Inspect files exposed by the sandbox | Read-only built-ins are admitted once explicitly selected |
| `write` | Create or replace a file | Apply `permissions.write` to the path |
| `edit` | Modify an existing file | Apply `permissions.edit` to the path |
| `bash` | Execute a command when the sandbox provides an executor | Apply `permissions.bash` to the command |

Explicit selection is still required for every row. A permission does not add
the built-in to the agent and cannot give the sandbox a capability it does not
implement.

When upgrading code that previously relied on an omitted `builtinTools` field
to expose every built-in tool, replace that implicit access with the smallest
explicit allowlist. `builtinTools: false` still works, but is redundant because
no built-ins is the default.

## 2. Add one mutating capability

`permissions` supports `allow`, `deny`, and `require_approval`. For `bash`,
`write`, and `edit`, a structured policy can also apply `allow` and `deny`
patterns to the command or path. Deny patterns take precedence. A nonempty
allowlist denies targets that do not match.

```ts title="src/createPolicyDraftHarness.ts"
reviewer: agent({
	model: 'assistant',
	input: z.string().min(1),
	output: z.object({ draftPath: z.string() }),
	instructions: 'Write one Markdown draft below /workspace/drafts.',
	builtinTools: ['read', 'write'],
	permissions: {
		write: {
			mode: 'require_approval',
			allow: ['/workspace/drafts/**'],
			deny: ['/workspace/drafts/private/**'],
		},
	},
})
```

| Field | Accepted value | Runtime effect |
| --- | --- | --- |
| `mode` | `allow`, `deny`, `require_approval` | Base decision for the selected built-in tool |
| `allow` | Array of path or command glob patterns | When present and nonempty, the target must match at least one pattern |
| `deny` | Array of path or command glob patterns | A matching target is denied even when an allow pattern also matches |

`*` matches within one path segment; `**` crosses path separators. For
`write` and `edit`, patterns inspect `input.path`. For `bash`, they inspect
`input.command`. `require_approval` returns a durable
`ToolApprovalInterrupt` before the tool runs.

## 3. Provide approval or choose a different mode

The example requires approval, so handle the interrupted outcome and resume it
with authenticated decisions. Follow
[request and resume tool approval](/handbook/harness/secure-and-govern/approval-and-audit/)
for the complete flow.

Use `mode: 'allow'` only when every matching path or command may run without a
separate decision. Use `mode: 'deny'` to keep a selected tool visible but block
its execution. Prefer omitting a tool completely when the agent never needs it.

## 4. Verify allowed and denied targets

Use a scripted model that proposes the selected built-in, then assert:

1. `/workspace/drafts/review.md` returns an approval interrupt and runs only
   after an approved resume;
2. `/workspace/drafts/private/secret.md` is denied even when approved;
3. `/workspace/other.md` is denied because it is outside the nonempty allowlist;
4. rejection, stale or unauthorized resume, expiry, and cancellation do not
   write a file; and
5. the agent cannot call `edit` or `bash` because neither tool was selected.

These tests prove Harness permission flow. Run the selected sandbox adapter's
contract and platform tests separately to prove filesystem or process
isolation.

## Know which control to choose

| Requirement | Use |
| --- | --- |
| One agent must never see a tool | Omit it from `tools` or `builtinTools` |
| A built-in write/edit/bash target needs a simple local rule | `permissions` |
| Several tools need typed predicates, shadow rollout, audit, or exposure rules | [Governance policies](/handbook/harness/secure-and-govern/governance-policies/) |
| Prompt, output, retrieval, or selected tool content needs inspection | [Guardrails](/handbook/harness/secure-and-govern/guardrails/) |
| A side effect needs business authorization | The application tool handler |

Permission rejection prevents the tool handler from running and returns a
normalized tool error to the model loop. It does not undo sibling tool calls
that were already admitted. Test allowed and denied targets, missing approval,
and the selected sandbox adapter separately.

See [`AgentDefinition.permissions`](/handbook/api/types/_purista_harness.AgentDefinition/#signature),
[`PermissionPolicy`](/handbook/api/types/_purista_harness.PermissionPolicy/), and
[request and resume tool approval](/handbook/harness/secure-and-govern/approval-and-audit/).
