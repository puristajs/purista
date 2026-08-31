---
title: Migrate PURISTA 3 to PURISTA 4
description: Update a PURISTA 3.2.4 application to the v4 attached-agent model, durability, sandbox, and failure boundaries.
order: 1110
---

PURISTA 4 keeps the service, command, subscription, stream, queue, and adapter architecture of PURISTA 3. The verified breaking changes from the latest published v3 tag, `v3.2.4`, are concentrated in AI-powered services and their Harness 3 runtime.

This guide compares the published v3.2.4 API with the v4 target. It deliberately omits names that appeared only during v4 development.

## Identify whether the application is affected

| v3.2.4 usage | Required v4 work |
| --- | --- |
| No `AgentQueueBuilder` or `ai` service options | Align package versions, build, and run the normal contract and adapter verification. The agent-specific source changes below do not apply. |
| `.addModel(alias, { model, capabilities })` | Remove the concrete model identifier from the builder declaration. Inject it at service composition. |
| `ai.stateStore`, `ai.runtime`, or `ai.workspaceStore` | Replace the split Harness durability inputs with `ai.storage` and, when files must persist, `ai.workspace`. |
| `.setSandboxPolicy({ enabled, adapter })` | Move the adapter to service-level `ai.sandbox`. Declare only sharing and optional owner derivation on the agent. |
| `@purista/harness` 1.x APIs used directly | Migrate the Harness application to Harness 3 before starting the PURISTA service. |

## 1. Align the Framework and Harness majors

Update the Framework and its official adapters together. PURISTA 4 core integrates with `@purista/harness` 3; do not retain the Harness 1.x version that accompanied v3.2.4.

```sh title="Install the v4 Framework and Harness"
npm install @purista/core@4 @purista/harness@3
```

Add the provider, storage, workspace, or sandbox packages used by the application to the same explicit upgrade. Keep the previous lockfile available for rollback.

If the application builds a Harness directly, complete [the Harness 3 durability migration](/handbook/harness/upgrade-and-migrate/migrate-to-v3/) before wiring it into a PURISTA service. Harness 3 does not automatically upgrade legacy durable tables.

## 2. Separate model requirements from deployment selection

In v3.2.4, the agent builder stored a concrete model identifier in its public definition. In v4, the builder declares only the capability contract. The composition root supplies the provider and concrete model used by that deployment.

```ts title="src/service/support/v1/agent/triageTicketAgentBuilder.ts"
export const triageTicketAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
  .addPayloadSchema(input)
  .addOutputSchema(output)
  .addModel('primary', {
    capabilities: ['object'],
  })
  .setHarnessAgent({
    model: 'primary',
    input,
    output,
    instructions: 'Classify the ticket urgency.',
  })
```

The v4 chain keeps the existing
[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder),
[`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema),
[`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema),
and [`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent)
roles. The changed call is
[`addModel(alias, requirement)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel):
its requirement no longer contains the deployment's concrete model identifier.

Declare the alias before `setHarnessAgent(...)`; the agent definition is then type-checked against the aliases and capabilities already registered by the builder.

```ts title="src/app.ts"
import { openai } from '@purista/harness-openai'

const service = await supportV1Service.getInstance(eventBridge, {
  ai: {
    models: {
      primary: {
        provider: openai({ apiKey: process.env.OPENAI_API_KEY! }),
        model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
      },
    },
  },
})
```

The concrete `model` is required at runtime in v4. Startup fails when an alias is missing or its detected/provided capabilities do not cover the builder declaration.

## 3. Replace split durability with Harness storage

Use one Harness storage adapter for conversations, recoverable runs, checkpoints, leases, and waits. Use a durable workspace only when agent files or snapshots must survive a resumed run.

| v3.2.4 service option | v4 service option | Migration action |
| --- | --- | --- |
| `ai.stateStore` | `ai.storage` | Provision a Harness 3 `HarnessStorage`; migrate application-approved data through an explicit migration. |
| `ai.runtime` | `ai.storage` | Remove the separate runtime. Recovery and external waits belong to Harness storage. |
| `ai.workspaceStore` | `ai.workspace` | Provision a Harness 3 `DurableWorkspace` only for retained files/snapshots. |
| Not available | `ai.onSuspended` | Handle a durable suspension as an application-owned successful delivery when the service must record or route it. |

```ts title="src/app.ts"
import { localDurableExecution } from '@purista/harness'

const local = localDurableExecution({ root: './.harness' })

const service = await supportV1Service.getInstance(eventBridge, {
  ai: {
    models,
    storage: local.storage,
    workspace: local.workspace,
    onSuspended: notice => suspensionStore.record(notice),
  },
})
```

Do not point Harness 3 at copied v1 durability tables. Stop old workers, export only data the application owns and still needs, create the new storage, then import through a reviewed application migration.

## 4. Move sandbox adapters to service composition

The service instance owns the concrete sandbox adapter in v4. An agent declares how its workspace is shared and can derive an explicit owner from validated invocation data.

```ts title="src/service/support/v1/agent/investigateTicketAgentBuilder.ts"
export const investigateTicketAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder('investigateTicket', 'Investigates one support ticket')
  .setSandboxPolicy({
    sharing: 'private',
  })
```

[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder)
still creates the attached-agent projections; only the sandbox declaration and
runtime ownership change in this step.

```ts title="src/app.ts"
const service = await supportV1Service.getInstance(eventBridge, {
  ai: {
    models,
    sandbox: local.sandbox,
    sandboxOptions: {
      defaultPolicy: 'private',
    },
  },
})
```

Remove `enabled` and `adapter` from `setSandboxPolicy(...)`. Adapter selection in an agent definition couples business code to infrastructure and is rejected by the v4 API. For shared workspaces, define named groups and an authorization callback at composition; see [sandbox ownership and sharing](/handbook/framework/build-ai-powered-services/configure-sandbox-ownership-and-sharing/).

## 5. Recheck public failure handling

V4 maps Harness failures into stable PURISTA transport errors without returning provider, owner, workspace, prompt, or tool-input details.

| Harness failure | PURISTA response class |
| --- | --- |
| Configuration or validation | `400 Bad Request` |
| Permission or governance denial | `403 Forbidden` |
| Sandbox conflict or lost state | `409 Conflict` |
| Sandbox quota exceeded | `429 Too Many Requests` |
| Timeout or cancellation | `408 Request Timeout` |
| Other classified Harness failure | `503 Service Unavailable` |
| Unknown failure | `500 Internal Server Error` |

Update callers to branch on the status and stable error projection, not on provider text. Logs and traces may retain approved diagnostic metadata, but public responses use the generic attached-agent failure message.

## 6. Verify before rollout

1. Build with all official PURISTA packages on the v4 major and Harness on v3.
2. Start the service once with every required model alias; verify missing and insufficient capability bindings fail startup.
3. Run deterministic agent-flow tests with fake model, sandbox, governance, and storage adapters.
4. Resume one durable run after a process restart and verify the same run identity and committed step results.
5. Verify private and shared sandbox ownership with an allowed tenant and a denied neighboring tenant.
6. Exercise one classified provider failure and confirm that the public response contains no provider or content detail.
7. Run the selected EventBridge, QueueBridge, store, HTTP, and deployment checks that apply to the application.

Keep the v3 deployment and its storage snapshot immutable until the v4 canary completes. Because the durable storage format is not downgraded automatically, rollback means routing traffic back to the v3 workers and v3 data boundary—not opening v4 storage with v3 code.

Next: [verify and roll back the migration](/handbook/framework/upgrade-and-migrate/verification-and-rollback/).
