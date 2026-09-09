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
export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  targets: {
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
  },
})
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
records the deployment boundary synchronously. Use `targets` only for policy
that belongs at the service address:

- `beforeGuards` and `afterGuards` authorize calls and results;
- `successEvent` publishes a validated business event after completion;
- `queue` gives one target durable delivery;
- `durableResume` defines the identity rule for a resumable workflow.

A command or stream wrapper has its own guard. That guard does not protect a
target that another service calls directly. Put authorization for the target
itself in its `targets` policy.

The service creates the Harness runtime when `getInstance(...)` receives its
concrete adapters:

```ts title="Bind runtime adapters"
const support = await supportV1Service.getInstance(eventBridge, {
  resources: { incidentRepository, rollbackReviewRepository },
  ai: {
    model: { provider: modelProvider, model: 'provider-model-id' },
    admission: modelAdmission,
    storage: harnessStorage,
    sandbox,
    sandboxBinding,
    workspace,
  },
})
```

Use `ai.model` for the primary model required by agents. Add named entries to
`ai.models` only when the definition declares extra model aliases. Configure
only the adapters required by the graph. Startup checks those requirements
before the service accepts work.

`modelAdmission` implements Harness `ModelAdmission`: `acquire(request)` waits
for or rejects capacity and returns a lease with `release()`. It controls active
provider calls in one service instance. Bind a target to a PURISTA queue when
complete invocations need durable admission, retry, or fleet-wide concurrency.
