---
title: Mount Harness and bind the runtime
description: Mount one Harness definition, apply target policy, and supply the runtime adapters that its graph needs.
order: 393
---

`mountHarness` connects one complete Harness definition to a service. Call it
once for a service version. Every agent and workflow added to that definition
becomes an addressable root. Tools, skills, and other nested dependencies stay
inside the Harness graph.

```ts title="Mount targets with business policy"
const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
  agents: {
    analyzeSignals: {
      beforeGuards: { mayReadIncident },
      successEvent: 'incidentSignalsAnalyzed',
    },
  },
  workflows: {
    reviewRollback: {
      beforeGuards: { mayReviewRollback },
      durableResume: { identity: 'run-owner' },
    },
  },
})

export const supportV1Service = supportV1ServiceBuilder.mountHarness(
  supportHarness,
  supportHarnessPolicy,
)
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
records the deployment boundary synchronously. Use the `agents` and
`workflows` maps only for policy
that belongs at the service address:

- `beforeGuards` and `afterGuards` authorize calls and results;
- `successEvent` publishes a validated business event after completion;
- `queue` gives one target durable delivery;
- `durableResume` defines the identity rule for a resumable workflow.

A command or stream wrapper has its own guard. That guard does not protect a
target that another service calls directly. Put authorization for the target
itself in its `agents` or `workflows` policy.

The service creates the Harness runtime when `getInstance(...)` receives its
concrete adapters:

```ts title="Bind runtime adapters"
const support = await supportV1Service.getInstance(eventBridge, {
  resources: { incidentRepository, rollbackReviewRepository },
  ai: {
    models: { answering: { provider: modelProvider, model: 'provider-model-id' } },
    concurrency: {
      runs: runConcurrency,
      modelCalls: modelCallConcurrency,
    },
    storage: harnessStorage,
    sandbox: {
      adapter: sandbox,
    },
    workspace,
  },
})
```

Every agent declares a user-chosen purpose alias. Bind every alias under the
exact matching `ai.models` key; Harness reserves no alias. Configure only the
adapters required by the graph. Startup checks those requirements before the
service accepts work.

`sandbox.adapter` supplies the execution infrastructure. Omit `policy` for the
safe private default. Configure it only when a definition declares a named
shared group or a deployment permits borrowing an owner.

`concurrency.runs` limits complete root execution trees.
`concurrency.modelCalls` limits provider operations and can apply provider or
model-specific limits. Both are runtime ports. Bind a target to a
PURISTA queue when complete invocations need durable delivery, retry, or
fleet-wide scheduling.
