---
title: Coordinate workflows and human review
description: Define orchestration in Harness, publish workflows through PURISTA, and expose approval waits as durable application state instead of failures.
order: 398
---

Define multi-step orchestration with the native Harness workflow API. The
workflow may call registered agents, tools, skills, MCP servers, and sandbox
operations while remaining independently runnable outside PURISTA.

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

The HTTP adapter must not throw merely because approval is needed. Standard AI
UI clients can render the tool or approval state and submit the user's decision
through the application endpoint.
