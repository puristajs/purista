---
title: Coordinate workflows and human review
description: Define orchestration in Harness, publish workflows through PURISTA, and expose approval waits as durable application state instead of failures.
order: 398
---

Define multi-step orchestration with the native Harness workflow API. The
workflow may call registered agents, tools, skills, MCP servers, and sandbox
operations while remaining independently runnable outside PURISTA.

Create the module with the project-local CLI when starting from a generated
project:

```bash title="Generate a Harness workflow"
npm run add:workflow -- review-rollback \
  --service support \
  --service-version 1 \
  --description "Coordinate rollback review and execution"
```

The command adds a native module under `src/harness/support/workflow`, a
standalone test, and the published target to the service's existing Harness
mount. It does not create a command, HTTP endpoint, provider, or second Harness
runtime.

Publish it like an agent:

```ts title="Publish a workflow target"
export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  publish: { workflows: ['review_rollback'] },
})
```

A caller declares the address and chooses aggregate or streaming delivery:

```ts title="Declare a workflow invocation"
const reviewCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('reviewRollback', 'Starts or resumes rollback review')
  .canInvokeWorkflow(
		'Support',
		'1',
		'review_rollback',
		supportHarness.contracts.workflows.review_rollback,
  )
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
publishes the selected workflow from the service's one Harness runtime.
[`canInvokeWorkflow(service, version, target, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeworkflow)
declares its versioned EventBridge address and derives both delivery modes from
the portable contract.
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates the caller's independent application contract.

## Approval flow

When a workflow reaches a human decision, Harness returns an interrupted
outcome and can emit a corresponding stream event. The application should:

1. store a review task, action digest, expiry, tenant, and authorized reviewer
   scope in a database;
2. send the interruption to the client as normal structured data;
3. accept approve or reject through protected PURISTA commands;
4. re-check the action, identity, expiry, and current revision;
5. resume the same workflow run idempotently.

The reviewer who submits the decision is often different from the principal
who started the durable run. Opt in to run-owner resume only for that workflow
target, and keep the current reviewer in the mount guard:

```ts title="Authorize a cross-principal durable resume"
export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  publish: { workflows: ['review_rollback'] },
  targets: {
    workflows: {
      review_rollback: {
        durableResume: { identity: 'run-owner' },
        beforeGuards: { reviewAccess: requireReviewWorkflowAccess },
      },
    },
  },
})
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
publishes only the selected workflow and applies this target policy at the
EventBridge boundary.

`durableResume: { identity: 'run-owner' }` restores only the original Harness
run owner after the guard authorizes the current caller. The current caller's
tenant and principal remain in the guard and host-integration context. PURISTA
rejects cross-tenant resume. The stored review record must bind the tenant,
session ID, run ID, wait ID, action digest, revision, expiry, requester, and
reviewer policy before a signal or business effect is accepted.

The option is part of
[`HarnessTargetPolicy`](/handbook/api/types/_purista_core.HarnessTargetPolicy/)
and applies only to the target where it is declared.

Without this explicit policy, Harness applies its normal immutable session
owner check and a different principal cannot resume the run. Do not weaken the
session owner globally or copy the requester's identity into an approval
request.

The HTTP adapter must not throw merely because approval is needed. Standard AI
UI clients can render the tool or approval state and submit the user's decision
through the application endpoint.
