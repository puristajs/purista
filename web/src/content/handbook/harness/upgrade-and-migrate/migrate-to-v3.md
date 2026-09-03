---
title: Adopt the Harness 3 clean-break API
description: Migrate Harness 2.1.1 registration, invocation, session cleanup, schemas, adapters, and governance to Harness 3 without compatibility shims.
order: 1310
---

Use this guide to move application source from **Harness 2.1.1** to the
**Harness 3.0 contract**. Start with registration and invocation, then migrate
only the optional adapters and controls your application uses. New applications
should start with [your first agent](/handbook/harness/start/build-the-first-agent/).

The baseline is the [published 2.1.1 source](https://github.com/puristajs/harness/tree/v2.1.1),
verified against npm on 31 August 2026. Check that your intended 3.0 package release
is available before scheduling deployment; a guide describing the target API
is not evidence that the packages have been published. There are no runtime
shims, compatibility aliases, or readers for old durable records.

## Check whether each change affects you

<div class="overflow-x-auto" role="region" aria-label="Migration applicability" tabindex="0">

| Area | You are affected when the existing application… | Current Harness 3 action |
| --- | --- | --- |
| Schemas | Imports or constrains public APIs with Zod types | Keep Zod or use another Standard Schema validator; ensure model-facing schemas also expose JSON Schema. |
| Registration | Uses callback-form `.agents(...)` / `.workflows(...)` | Use direct singular definitions or plural records; existing append and duplicate-rejection semantics remain. |
| Tool inference | Defines an inline native handler inside `.tools(record)` | Prefer `.tool(id, definition)` to infer its input, output and sandbox context; keep `.tools(record)` for pre-typed or MCP catalogs. |
| Invocation and cleanup | Calls `.prompt()`, `session.close()`, or workflow `ctx.log` | Use `.run()`, choose `.release()` versus `.destroy()`, and use `ctx.logger`. |
| Built-in tools | Relies on the omitted `builtinTools` field enabling all built-ins | Add the smallest explicit allowlist; omission now enables none. |
| Text search | Uses JavaScript regular expressions or assumes `grep` results are exhaustive | Use the portable safe-regex subset or literal search, require `sandbox.text_search`, and handle incomplete results. |
| Durability | Uses `.state`, `.runtime`, `.checkpoints`, or `.workspaceStore` | Replace them with `.storage` and optional `.workspace`. |
| Memory | Supplies a `MemoryAdapter` or `sandboxMemory()` | Select a `MemoryEngine` and optional model-backed memory configuration. |
| Sandbox | Implements only `open` and session operations | Add owner registration, administration, termination, and truthful capabilities. |
| MCP | Uses sandboxed stdio with a custom sandbox adapter | Revalidate process ownership and `spawn` against the new sandbox contract; the MCP v2 client/transport requirement is unchanged. |
| Governance | Consumes content-bearing decisions or old approval result fields | Move to typed decision evidence and current approval outcomes. Guardrails are a separate, optional v3 feature. |

</div>

## 1. Upgrade all Harness packages together

Install the intended Harness 3 releases in **your application**, including each
first-party addon it uses, and commit the resulting lockfile. Check every
addon's peer range; do not keep a `2.x` addon beside `@purista/harness@3`.

For an application using only the OpenAI adapter, once the target releases are
available:

```sh title="Install the target API in your application"
npm install --save-exact @purista/harness@3.0.0 @purista/harness-openai@3.0.0
npm ls @purista/harness @purista/harness-openai
```

Add your other installed Harness addons to the same upgrade. Do not install
every adapter or build any of the provided packages from source.

Like 2.1.1, Harness 3 is ESM-only and requires Node.js `>=24.15.0`. Compile
and test the application against the target Harness 3 packages before
replacing a deployed runtime.

After installation, run the application typecheck before changing code. The
removed API errors form the migration work list; do not suppress them with
casts or declaration shims.

## 2. Keep validation provider-neutral

Harness 2.1.1 exposed Zod-shaped public constraints. Harness 3 accepts Standard
Schema validators. Existing Zod 4 application schemas continue to work.

Two positions are model-facing and must also provide Standard JSON Schema:

- a TypeScript tool's input schema;
- a default-loop agent's output schema.

Agent input, custom-handler output, tool output, workflow input/output, and
Guardrail values need Standard Schema validation only. See
[requirements and schema compatibility](/handbook/harness/start/requirements-and-installation/#choose-the-schema-library-your-application-owns)
before migrating ArkType or Valibot definitions.

Verify this step by constructing your configured runtime with
[`builder.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build)
in an application test. This is runtime configuration validation, **not a
package build command**. JSON Schema projection happens there, so an
incompatible model-facing schema fails before the first model request.

## 3. Use one registration grammar

Every registry has a singular and plural form. Singular calls are the normal
path for inline definitions; plural calls compose reusable, already typed
records. Neither form accepts an agent/workflow factory callback.

<div class="overflow-x-auto" role="region" aria-label="Registration methods" tabindex="0">

| Registry | One definition | Reusable record |
| --- | --- | --- |
| Models | `.model(id, definition)` | `.models(record)` |
| Tools | `.tool(id, definition)` | `.tools(record)` |
| Skills | `.skill(id, definition)` | `.skills(record)` |
| Agents | `.agent(id, definition)` | `.agents(record)` |
| Workflows | `.workflow(id, definition)` | `.workflows(record)` |

</div>

Both forms **append**; they do not replace previously registered entries.
Duplicate IDs fail with `HarnessConfigError` and reason `duplicate_definition`.
These behaviors already exist in 2.1.1; singular registration adds an inline
inference path, not new replacement semantics. This does not make foundation adapters
repeatable: `.storage(...)`, `.sandbox(...)`, `.workspace(...)`, `.memory(...)`
and `.governance(...)` each have one owner.

Register models, tools and skills before agents that reference them, then
agents before workflows that delegate to them. This preserves literal IDs,
schema-derived types and capability checks throughout the chain.

### Keep native tool inference inline

Harness 2.1.1 accepted direct tool records. The record form still exists, but
`.tool(id, definition)` is the preferred migration for an inline native handler.
In this fragment, `models` is your configured model registry and `invoiceStore`
is your application-owned, authorized invoice service:

```ts title="src/tools/findInvoice.ts"
import { defineHarness } from '@purista/harness'
import { z } from 'zod'

const harness = defineHarness({ name: 'billing-agent' })
	.models(models)
	.tool('find_invoice', {
		description: 'Find one invoice by its public reference.',
		input: z.object({ invoiceId: z.string().min(1) }),
		output: z.object({ status: z.enum(['open', 'paid']) }),
		handler: async (_ctx, input) => invoiceStore.find(input.invoiceId),
	})
	.build()
```

<div class="overflow-x-auto" role="region" aria-label="Native tool APIs" tabindex="0">

| API | Migration effect |
| --- | --- |
| [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the typed composition root. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Declares aliases before agents or model-backed memory can reference them. |
| [`.tool(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tool) | Captures exact schemas, handler context, and required sandbox capabilities for one inline native tool. |
| [`.tools(record)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers a reusable, pre-typed native or MCP catalog. Do not use it for a one-off inline handler. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates schemas, references, capabilities, and optional control configuration. |

</div>

MCP tool definitions remain an explicit MCP integration boundary: compose a
reusable MCP catalog with `.tools(record)`, rather than wrapping it as a native
TypeScript tool. Follow [Create typed tools](/handbook/harness/add-capabilities/tools/)
for complete handler and failure behavior.

### Remove agent and workflow factory callbacks

For a single agent, the mechanical replacement is below. `builder` is your
composition root after model registration; `input` and `output` are your
existing schemas. Keep the returned builder when continuing composition.

```ts title="Harness 2.1.1 registration fragment"
builder.agents(({ agent }) => ({
	invoice_assistant: agent({
		model: 'assistant', input, output,
		instructions: 'Explain the invoice status.',
	}),
}))
```

```ts title="Harness 3 registration fragment"
builder.agent('invoice_assistant', {
	model: 'assistant', input, output,
	instructions: 'Explain the invoice status.',
})
```

Apply the same change to `.workflows(({ workflow }) => ...)`: use
`.workflow('id', { input, output, handler, ... })` or a pre-typed
`.workflows(record)`. The handler still reads `ctx.input`, and a workflow still
delegates with `ctx.agents.invoice_assistant(ctx.input)`—those context clients
are not session invokers.

Exact APIs: [`.model(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#model),
[`.skill(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#skill),
[`.skills(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#skills),
[`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent),
[`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents),
[`.workflow(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflow),
and [`.workflows(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflows).

Verify registration with an application typecheck and a `.build()` test. Keep
negative type tests for unknown model/tool IDs and invalid handler output;
do not replace lost inference with `any` or type assertions.

## 4. Migrate calls, cleanup, and handler context

<div class="overflow-x-auto" role="region" aria-label="Invocation and cleanup changes" tabindex="0">

| Harness 2.1.1 | Harness 3 | Consequence |
| --- | --- | --- |
| `session.agents.id.prompt(input, options)` | `session.agents.id.run(input, options)` | Handle `RunOutcome`: read `output` after `status === 'completed'`, or persist and resume an `interrupted` run. |
| `session.workflows.id.prompt(input, options)` | `session.workflows.id.run(input, options)` | Apply the same outcome handling in HTTP handlers, queue workers, tests, and application calls. |
| `session.agents.id.stream(...)` / workflow `.stream(...)` | Portable `ExecutionEvent` stream | Consume client-safe execution events and the terminal `run.finished.outcome`; use `.observe(...)` for operational `RunEvent` diagnostics. |
| `session.close()` | `session.destroy()` **only for intentional deletion** | Do not turn a request-finally cleanup into conversation deletion. |
| `session.release()` | Unchanged | Retains persisted history; reacquire with `harness.getSession(...)` before the next use. |
| Workflow `ctx.log` | `ctx.logger` | Agent, tool and workflow handlers use consistent logger naming. |

</div>

For a request that should retain its conversation:

```ts title="src/handlers/explainInvoice.ts"
const session = await harness.getSession(sessionId)
try {
	return await session.agents.invoice_assistant.run(input)
} finally {
	await session.release()
}
```

This is a fragment inside your authenticated application handler; derive
`sessionId` and any identity from trusted application state. Retention is only
as durable as your selected storage and sandbox adapters. Do not call
`harness.shutdown()` after each request: keep one runtime per application
owner (normally one shared runtime per PURISTA service).

[`AgentInvoker`](/handbook/api/interfaces/_purista_harness.AgentInvoker/)
and [`WorkflowInvoker`](/handbook/api/interfaces/_purista_harness.WorkflowInvoker/)
own `.run()` / `.stream()`. [`Session`](/handbook/api/interfaces/_purista_harness.Session/)
owns `.release()` / `.destroy()`. `SandboxSession.close()`, adapter `close()`
and `local.close()` still mean closing their respective handles; do not apply
a global `close` → `destroy` replacement.

Custom agent and workflow handlers now also receive `ctx.telemetry` alongside
`ctx.logger` and `ctx.metrics`. Dynamic instruction callbacks retain their
smaller context; they are not full execution handlers. Update dashboards that
match the workflow invocation span from `harness.session.prompt` to
`harness.session.run`; the agent span remains `harness.session.agent_prompt`.
See [Observe the runtime](/handbook/harness/configure-the-runtime/observability/).

Verify one direct call, one streamed call, retained history after
release/reacquisition, and explicit deletion in a disposable test session.

## 5. Replace implicit built-in access with an allowlist

In 2.1.1, omitting `builtinTools` enabled the full built-in set. In Harness 3,
omission enables no built-in tools.

```ts title="src/agents/workspaceAssistant.ts"
builder.agent('workspace_assistant', {
	model: 'assistant',
	input,
	output,
	instructions: 'Summarize the approved workspace documents.',
	builtinTools: ['read', 'list'],
})
```

The snippet continues a builder with the `assistant` model and the `input` /
`output` schemas already defined; [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent)
registers that one inline definition. Remove `builtinTools: false`; it is now
redundant. A skill-enabled default-loop
agent needs explicit `read` access so the model can open the mounted skill. A
skill never grants `bash` or executes its scripts. See
[Set built-in tool permissions](/handbook/harness/secure-and-govern/tool-permissions/).

Verify the allowed path and one denied path. An omitted tool must be unavailable
before its handler or sandbox operation runs.

### Check existing grep patterns and result handling

Harness 2.1.1 `grep` interpreted patterns with JavaScript `RegExp`. Harness 3
requires the sandbox's `sandbox.text_search` capability and defaults to the
bounded, portable `safe_regex_v1` subset with case-sensitive matching. This is
not full JavaScript regex compatibility: rewrite unsupported lookaround,
backreferences, shorthand classes, or non-ASCII patterns. Use `syntax: 'literal'`
when the request is plain text; safe-regex mode requires `caseSensitive: true`.

Update result consumers for `complete`, `limitReasons`, and per-line
`textTruncated`. An empty or capped result with `complete: false` is not proof
that no further matches exist. Test representative old patterns and at least
one limit-exhaustion case. See
[built-in search permissions and limits](/handbook/harness/secure-and-govern/tool-permissions/).

## 6. Replace split durability with one storage boundary

Harness 2.1.1 split session state, durable runtime, context checkpoints, and
workspace storage. Harness 3 uses one `HarnessStorage` for session/run history,
events, leases, durable steps, and external waits; durable files use a separate
`DurableWorkspace`.

<div class="overflow-x-auto" role="region" aria-label="Durability API changes" tabindex="0">

| Harness 2.1.1 | Harness 3 |
| --- | --- |
| `.state(store)` | `.storage(storage)` |
| `.runtime(runtime)` | Removed; durable execution belongs to `HarnessStorage`. |
| `.checkpoints(store)` and `ctx.checkpoints` | Use `ctx.step(...)` for durable workflow results or application-owned memory/storage for long-lived facts. |
| `.workspaceStore(store)` | `.workspace(workspace)` |
| `stateStoreContract` and separate runtime contracts | `harnessStorageContract` and `durableWorkspaceContract` |

</div>

```ts title="src/runtime/createLocalRuntime.ts"
import { defineHarness, localDurableExecution } from '@purista/harness'

const local = localDurableExecution({ root: './.harness' })

export const harness = defineHarness({ name: 'billing-agent' })
	.storage(local.storage)
	.sandbox(local.sandbox)
	.workspace(local.workspace)
	.models(models)
	.agents(agents)
	.workflows(workflows)
	.build()

export async function stopRuntime(): Promise<void> {
	await harness.shutdown()
	await local.close()
}
```

<div class="overflow-x-auto" role="region" aria-label="Durability builder methods" tabindex="0">

| API | Migration effect |
| --- | --- |
| [`localDurableExecution({ root })`](/handbook/api/functions/_purista_harness.localDurableExecution/) | Returns the matching single-host `{ storage, sandbox, workspace, close }` bundle. It is for local development or one trusted worker. |
| [`.storage(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#storage) | Registers the sole durable execution and session port. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the file and execution adapter and captures its capabilities. |
| [`.workspace(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workspace) | Registers durable file checkpoints independently from session records. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Registers agents after models, tools, and skills so references remain typed. |
| [`.workflows(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflows) | Registers orchestration after agents so delegation is typed. |

</div>

The old SQLite schema is rejected with `sqlite_schema_incompatible`. Do not
point Harness 3 at the 2.1.1 runtime database. Continue with
[adapter and data compatibility](../adapter-and-data-compatibility/).

Here, `models`, `agents` and `workflows` are application-owned, pre-typed
records—not registration callbacks. Inline definitions can instead continue
the builder through `.model(...)`, `.agent(...)` and `.workflow(...)`.

## 7. Select a Harness 3 memory engine

Replace `MemoryAdapter` and `sandboxMemory()` with `MemoryEngine`. The base
package includes a dependency-free in-memory engine. Persistent SQLite,
PostgreSQL, Redis, and NATS engines are separate first-party packages.

```ts title="src/runtime/createMemory.ts"
import { defineHarness, inMemoryMemoryEngine } from '@purista/harness'

const harness = defineHarness({ name: 'billing-agent' }).memory(inMemoryMemoryEngine()).models(models).build()
```

<div class="overflow-x-auto" role="region" aria-label="Memory builder methods" tabindex="0">

| API | Migration effect |
| --- | --- |
| [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the Harness 3 composition root. |
| [`.memory(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#memory) | Registers an engine or engine configuration; model-backed options may reference only aliases already declared. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Declares the non-empty model registry required by the built Harness. Put it before `.memory(...)` when memory configuration references an embedding or summary alias. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Rejects incompatible engine capabilities or model references before use. |

</div>

Use [the memory selection guide](/handbook/harness/manage-context-and-state/memory/)
to choose capabilities, configure embedding or summary models, and plan an
explicit reindex. There is no automatic import from the 2.1.1 sandbox-backed
memory format.

If you used user-scoped memory, migrate the `user` scope to `principal` and
`userId` to `principalId`. Bind optional `tenantId` / `principalId` through
`harness.getSession(id, identity)` using authenticated application values.
Reopening a bound session with a changed or missing identity dimension must
fail; test that rejection before importing retained facts.

## 8. Revalidate sandbox ownership and MCP transport

A Harness 3 `Sandbox` must implement owner registration, administration,
`open`, and `terminate`, plus every operation represented by its capability
list. Run `sandboxContract` against custom adapters and add provider-specific
isolation tests. See [Build a custom sandbox adapter](/handbook/harness/secure-and-govern/custom-sandbox-adapter/).

The sandbox adapter and its guest image are separate choices. For real Linux
commands, the [minimal Alpine image recipe](/handbook/harness/secure-and-govern/local-docker-sandbox/#1-install-and-prepare-the-image)
provides the required Node and GNU utilities for Docker and Kubernetes; it
does not put your application or credentials in the guest. In-memory or
emulated-shell sandboxes do not require Docker.

The optional `@modelcontextprotocol/client` v2 peer, modern stateless
Streamable HTTP, and isolated stdio are **already the 2.1.1 contract**. There
is no SDK-package or legacy-transport migration for an application already on
2.1.1. Re-check authentication, selected tool IDs, sandbox
`spawn` and read-only mounts, and the server protocol version in
[Connect MCP servers](/handbook/harness/add-capabilities/mcp/).

If upgrading from 1.x, first account for the
[published Harness 2 MCP migration](https://github.com/puristajs/harness/blob/v2.1.1/docs/guides/migrating-to-v2.md).
Neither 2.1.1 nor 3 provides legacy HTTP+SSE or an exec-only stdio fallback.

## 9. Migrate governance and choose optional Guardrails

Harness 3 decision records use content-free `DecisionEvidence`; approvals have
bounded `approved`, `rejected`, `cancelled`, `timed_out`, or `failed` outcomes.
Do not read old approver prose, risk-level, message, or reason fields from run
events.

Recreate governance policies through the current typed helpers and test that
denied handlers do not run. The first-party Guardrails package is a new,
optional v3 addition, not a required replacement for a 2.1.1 Guardrails API.
If you adopt it, actions declare an exact phase and return allow, block, or a
phase-valid transform; bind them through the default-loop agent's direct
`guardrails` field.

Default-loop `prepareStep` and `stopWhen` remain available. Custom-handler
agents now reject default-loop controls (`maxSteps`, `prepareStep`, `stopWhen`,
interceptors, and Guardrails). If a 2.1.1 custom handler carried such fields,
remove them and implement the needed control at its actual execution boundary;
do not hide the mismatch with a cast. Use:

- [Govern agent actions](/handbook/harness/secure-and-govern/) for policy,
  approval, and audit migration;
- [Protect content with Guardrails](/handbook/harness/secure-and-govern/guardrails/)
  for action and phase configuration;
- [Test Guardrail enforcement](/handbook/harness/secure-and-govern/test-guardrails/)
  for deterministic deny and transform evidence.

## 10. Run the source migration gate

Before touching production data, run your application's corresponding scripts
(these names assume your application defines them):

```sh title="Verify the Harness 3 source migration"
npm run typecheck
npm test
npm run build
```

Then run focused tests for every selected provider and adapter. Deterministic
model fakes prove application flow; they do not prove live-model answer quality.
Use evaluations for prompt and result quality.

Treat missing methods, rejected duplicate IDs, schema-projection failures and
unavailable tool/capability errors as migration failures, not reasons to disable
validation. Passing TypeScript proves source compatibility; it does not prove
that a live provider supports your model options or that old durable data can
be resumed. Keep the old deployment and data snapshot intact until the
[rollout and rollback checks](../verification-and-rollback/) pass.

Next: [migrate adapters and data](../adapter-and-data-compatibility/).
