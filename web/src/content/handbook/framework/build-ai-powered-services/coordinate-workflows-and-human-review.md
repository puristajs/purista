---
title: Coordinate workflows and human review
description: Attach a Harness workflow to a service boundary, keep local agent delegation explicit, and hand a durable review pause to application-owned records and delivery.
order: 398
---

Use `setHarnessWorkflow` when the service outcome needs several model or tool
steps, bounded delegation, or a durable pause for an external decision. The
Framework still owns the service contract, generated projections, queue delivery,
identity, and composition; Harness owns workflow graph and execution semantics.

```ts title="src/service/support/v1/agent/reviewCase/reviewCaseAgentBuilder.ts"
export const reviewCaseAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('reviewCase', 'Reviews a high-risk support case')
	.addPayloadSchema(reviewCaseInput)
	.addOutputSchema(reviewCaseOutput)
	.addModel('primary', { capabilities: ['object', 'tool_use'] })
	.setHarnessWorkflow(reviewCaseWorkflow, {
		agents: { summarizeCase: summarizeCaseAgent },
	})
	.setDurability({ mode: 'required', runIdPath: ['caseId'] })
```

The optional `agents` map supplies Harness-local definitions to the wrapped
workflow. They execute in the same attached Harness session, sandbox, telemetry,
and durable-workflow boundary. When the workflow omits `delegation`, the current
Framework runtime grants delegation to the names in this map and to its declared
model aliases. Supply an explicit narrow Harness `delegation` policy whenever
that reach must be reviewed rather than inherited from the attachment.

| Builder call | Parameters and constraints | Use it for |
| --- | --- | --- |
| [`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder) | A stable service-local agent name and a human-readable operational description. | Generate the command, stream, queue, and worker projections that keep a workflow at the normal service boundary. The description is not a workflow instruction. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema) | One input schema. | Validate the case facts a caller may provide; trusted identity and reviewer authority belong in context and application records. |
| [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema) | One final result schema. | Keep the workflow's completed or deliberate waiting result stable across generated projections. |
| [`addModel(alias, { capabilities, defaults? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel) | A non-empty alias, required capability list, and optional provider-neutral call defaults. | Declare the model requirement before a workflow or its local agents select it. The composition root supplies the compatible provider and concrete model. |
| [`setHarnessWorkflow(definition, { agents? })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessworkflow) | One provider-neutral Harness workflow definition. `agents` is an optional named map of Harness-local agent definitions available to the workflow. It is mutually exclusive with `setHarnessAgent` and `setRunFunction`. | A service-owned multi-step flow whose model/tool work should retain the generated command, stream, queue, worker, identity, and runtime lifecycle. |
| [`setDurability({ mode: 'required', runIdPath })`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setdurability) | A non-empty stable path through validated payload data; supported only for a Harness workflow. | A review pause or retry must continue the same logical business run. |

The `agents` option does not mount skills, authorize a tool, or choose another
model. It can supply the current runtime's default workflow delegation when the
workflow did not specify one. Declare explicit delegation, tool, and model
limits in the Harness workflow when those permissions require independent
review.

## Put the review record outside the workflow process

| Component | Owns | Must persist or authorize |
| --- | --- | --- |
| Harness workflow | The model/tool flow and a typed external wait | No long-lived reviewer promise. |
| `ai.onSuspended` callback | Safe notification of a suspended attached run | Only service/agent/run/wait identity passed by the Framework. |
| Application review service | Review UI/API, reviewer identity, expiry, decision, and audit record | The durable review record and the trusted resume action. |
| Queue/event delivery | Notification and resume transport | At-least-once delivery, retries, and idempotency. |

Configure the callback only after you have a durable storage and workspace setup
where required. It is invoked when the runtime receives a durable external-wait
signal and turns it into an application-owned successful handoff; without it,
the wait remains a runtime error.

For defining workflows, approvals, delegation budgets, and evaluation of their
behavior, use [orchestrate work in AI Harness](/handbook/harness/orchestrate-work/).

Next: [expose and invoke an attached agent](/handbook/framework/build-ai-powered-services/expose-and-invoke-an-attached-agent/).
