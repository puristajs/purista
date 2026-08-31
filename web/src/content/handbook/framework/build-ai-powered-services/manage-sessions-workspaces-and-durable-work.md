---
title: Manage sessions, workspaces, and durable work
description: Choose session scope and explicitly enable persistent storage, workflow recovery, durable workspace capabilities, and sandbox policy only when the business outcome needs them.
order: 396
---

Queue retry, conversation history, durable workflow execution, and a durable
workspace solve different problems. A queued retry can repeat delivery; it does
not by itself resume a logical workflow or preserve files.

## Choose the smallest required persistence model

| Need | Builder policy | Additional runtime requirement |
| --- | --- | --- |
| Fresh context for each delivery | [`setSessionPolicy({ mode: 'ephemeral' })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsessionpolicy), the default | None beyond `ai.models`. |
| Stable conversation keyed by incoming payload data | [`setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsessionpolicy) | Harness storage if history must survive the process. The path must already resolve to a non-empty string before schema validation. |
| Resume the same logical workflow after retry/re-enqueue | [`setDurability({ mode: 'required', runIdPath: ['caseId'] })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setdurability) | Harness **persistent** `ai.storage`; only `setHarnessWorkflow` is valid. |
| Preserve files/checkpoints with durable execution | [`setWorkspacePolicy({ mode: 'durable', capabilities?, policy? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setworkspacepolicy) | Durability plus `ai.storage` and `ai.workspace` providing all required capabilities. |
| Restrict one shared service-owned sandbox | [`setSandboxPolicy({ sharing?, owner? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsandboxpolicy) | `ai.sandbox` and, where needed, `ai.sandboxOptions`; adapter selection and owner authorization stay at composition. |

## Know the policy options before adding persistence

| Method | Parameters, defaults, and validation | Choose it when |
| --- | --- | --- |
| [`setSessionPolicy(policy)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsessionpolicy) | The default is `{ mode: 'ephemeral' }`. For `{ mode: 'conversation', payloadPath }`, `payloadPath` must be a non-empty path with non-empty segments; it must resolve to a non-empty string at invocation. | A later turn must use the same Harness conversation. Do not use a transport message ID or prompt text as the conversation key. |
| [`setDurability({ mode: 'required', runIdPath })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setdurability) | `mode` must be `required`; every `runIdPath` segment must be non-empty. The builder permits it only with `setHarnessWorkflow`; the raw incoming payload must contain the non-empty key before schema validation. | A retry or a later enqueue must resume one business run, not simply create another delivery. |
| [`setWorkspacePolicy({ mode: 'durable', capabilities?, policy? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setworkspacepolicy) | `mode` must be `durable`; supplied capability names must be non-empty. If omitted, `capabilities` requires `storage.workspace_checkpoint`, `workspace.durable`, `workspace.checkpoint`, `workspace.resume`, and `workspace.cleanup`. `policy` is passed to the workspace adapter, which must reject constraints it cannot honor. | Files/checkpoints must be restored together with a durable workflow. It cannot make an ordinary ephemeral agent durable. |
| [`setSandboxPolicy({ sharing?, owner? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setsandboxpolicy) | `sharing` requests the permitted Harness partition (`inherit`, `private`, or an application-authorized group). `owner` resolves an explicit owner from validated input and trusted identity; it does not authorize that owner. | A tool-enabled agent needs an isolated or deliberately shared sandbox. The application configures the adapter and `authorizeOwner` callback. |

## Configure durable workflow requirements

```ts title="src/service/support/v1/agent/reviewCase/reviewCaseAgentBuilder.ts"
export const reviewCaseAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('reviewCase', 'Reviews one support case')
	.addPayloadSchema(reviewCaseInput)
	.addOutputSchema(reviewCaseOutput)
	.setHarnessWorkflow(reviewCaseWorkflow)
	.setDurability({ mode: 'required', runIdPath: ['caseId'] })
	.setWorkspacePolicy({ mode: 'durable' })
```

[`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder)
creates the service-owned agent and its command, stream, queue, and worker
projections. [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema)
validates the business key used for durable lookup, while
[`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema)
keeps a resumed result on the same public contract. [`setHarnessWorkflow(definition, { agents? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessworkflow)
selects the only execution shape that can use `setDurability`; it is mutually
exclusive with `setHarnessAgent` and `setRunFunction`.

`setDurability` rejects an empty path and the builder rejects durability for a
Harness agent or run function. The runtime then rejects startup when persistent
storage is missing, or when a durable workspace lacks storage, workspace, or a
declared capability. These fail-fast checks deliberately prevent a silent
in-memory fallback.

## Make review suspension application-owned

When a durable Harness workflow pauses for an external wait and `ai.onSuspended`
is configured, the Framework forwards safe suspension metadata (`runId`, service
and agent identity, and wait status) to that callback. Persist the review record,
reviewer identity, expiry, decision, and resumed delivery in your application;
the callback is not a long-lived in-process human-review promise.

`onSuspended` is not a notification-only hook. It is invoked once for a
received suspension and its return value becomes the current attached-agent
invocation result, which is then checked against the agent output schema. Make
the callback enqueue/persist its handoff and return the schema's deliberate
“waiting for review” result. Without an `onSuspended` callback, the external
wait is rethrown as an error. Keep that waiting result in the agent contract;
do not return a queue-enqueue receipt unless that receipt is itself valid agent
output.

Use a stable application-owned business key for `runIdPath`, not prompt text or
a transient queue ID. The runtime hashes it together with service and trusted
tenant/principal scope so separate callers do not share a run accidentally.

The durable workspace adapter owns terminal cleanup. Configure its retention
mode at application composition, then use its authorized administration surface
for scheduled or manual cleanup; an attached-agent policy never implies that a
workspace was deleted.

For session history retention, workspace adapter behavior, sandbox capabilities,
and workflow resume semantics, continue in the [AI Harness handbook](/handbook/harness/understand-the-harness/).

Next: [publish results and react through subscriptions](/handbook/framework/build-ai-powered-services/publish-results-and-react-through-subscriptions/).
