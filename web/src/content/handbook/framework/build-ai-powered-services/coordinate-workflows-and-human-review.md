---
title: Coordinate workflows and human review
description: Define workflows directly, mount them through PURISTA, and expose approval waits as durable application state.
order: 398
---

A Harness workflow coordinates agents and tools without creating another HTTP
endpoint or runtime. Generate its service-owned files with the project CLI:

```bash title="Generate a Harness workflow"
npm run add:workflow -- review-rollback \
  --service support \
  --service-version 1 \
  --description "Coordinate rollback review and execution"
```

The definition lives below
`src/service/support/v1/harness/workflow/reviewRollback/`. Add the direct
definition to the service's Harness graph:

```ts title="Define and add a workflow"
export const reviewRollbackWorkflow = defineWorkflow('reviewRollback', {
  description: 'Coordinate rollback review and execution',
  input: reviewRollbackInputSchema,
  output: reviewRollbackOutputSchema,
  async handler(context) {
    const input = context.input
    // Call declared agents and tools, and return or interrupt.
  },
})

export const supportHarness = defineHarness({ name: 'support' })
  .addAgent(triageTicketAgent)
  .addWorkflow(reviewRollbackWorkflow)
```

Every added workflow is addressable after the service mounts this graph. A
caller imports the workflow definition and declares its address:

```ts title="Declare a workflow invocation"
const reviewCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('reviewRollback', 'Starts or resumes rollback review')
  .canInvokeWorkflow(supportV1ServiceBuilder.harnessTarget(reviewRollbackWorkflow.contract))
  .setCommandFunction(async function (context, input) {
    return context.workflow.Support['1'][reviewRollbackWorkflow.contract.id].run(input)
  })
```

[`harnessTarget(contract)`](/handbook/api/classes/_purista_core.ServiceBuilder/#harnesstarget)
binds the contract to this service address before composition.
[`canInvokeWorkflow(target)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeworkflow)
adds this workflow's typed run and stream clients to the command context.

The call returns `{ sessionId, outcome }`. An interrupted outcome is normal
application data. It is not an HTTP 500.

## Approval flow

When a workflow needs a person to decide, the application should:

1. store the review task, action digest, expiry, tenant, and reviewer policy;
2. send the interruption to the client as structured data;
3. accept approve or reject through a protected PURISTA command;
4. check the action, identity, expiry, and current revision again;
5. resume the same session and run.

The reviewer may differ from the principal who started the run. Enable that
case only for the workflow that needs it:

```ts title="Authorize a cross-principal durable resume"
const policy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
  workflows: {
    reviewRollback: {
      durableResume: { identity: 'run-owner' },
      beforeGuards: { reviewAccess: requireReviewWorkflowAccess },
    },
  },
})

export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, policy)
```

[`defineHarnessPolicy(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineharnesspolicy)
keeps the guard input and service resources typed.
[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
applies
the durable-resume and guard policy at the workflow address.

The guard authorizes the current caller. `run-owner` restores the original run
owner only after that check. Cross-tenant resume remains rejected. Store the
tenant, session ID, run ID, wait ID, action digest, revision, expiry, requester,
and reviewer policy before accepting a signal or business effect.
