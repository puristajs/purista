---
title: Migrate Harness adapters and data
description: Recreate v3 adapter bindings and approved data in Harness v4 with explicit namespaces, contracts, and restart checks.
order: 1320
---

Harness v4 does not read v3 runtime records automatically. Treat sessions,
durable runs, memory indexes, workspaces, artifacts, sandbox resources, MCP
registrations, and governance evidence as separate migration boundaries.

| Boundary | v4 action |
| --- | --- |
| Sessions and run history | Create v4 storage and start new sessions; export only application-approved history. |
| Durable workflows and waits | Drain or complete v3 runs; do not resume them in v4. |
| Memory and embeddings | Create a new namespace, re-embed approved records, and verify dimensions and sample searches. |
| Workspaces and artifacts | Scan and import approved files through v4 APIs; do not import checkpoint metadata as business data. |
| Sandbox resources | Recreate owner registrations and capabilities, then verify isolation and termination. |
| MCP servers | Re-register the v4 logical remote name, transport, authentication, and allowed tools. |
| Governance and approvals | Recreate policies and keep content-free audit evidence; never import reviewer prose into run state. |

## Recreate the runtime

~~~ts title="src/runtime/createHarness.ts"
const definition = defineHarness({ name: 'support' })
  .addAgent(agent)
  .addWorkflow(workflow)

const instance = await definition.getInstance({
  model: assistantModel,
  storage: v4Storage,
  memory: v4Memory,
  workspace: v4Workspace,
  sandbox: v4Sandbox,
})
~~~

Keep v4 namespaces separate from the old runtime until the import has passed
count, checksum, tenant/principal isolation, and representative read checks.
The application owns any business-data transformation. Harness does not convert
old checkpoints, messages, or external side effects.

For a provider change, verify the provider's declared model capabilities,
timeouts, cancellation, authentication, rate limits, and redaction behavior.
Run the provider contract suite and a bounded smoke test with synthetic data
before sending traffic.

For storage and memory, test restart after a durable step and external wait,
reacquire a retained session, search an imported record, and delete a session
when requested. For sandbox and MCP, test denied capabilities, owner mismatch,
remote startup failure, cancellation, and cleanup.

Next: [verify rollout and rollback](./verification-and-rollback/).
