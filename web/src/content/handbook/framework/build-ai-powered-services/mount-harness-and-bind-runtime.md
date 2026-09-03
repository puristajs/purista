---
title: Mount Harness and bind the runtime
description: Publish selected targets, bind host tools and business policy, then supply concrete AI runtime adapters at service creation.
order: 393
---

`mountHarness` is synchronous because a Harness definition is already complete
and immutable. It accepts the definition and one mount policy. Call it once per
service; native Harness modules compose every capability behind that lifecycle
boundary.

```ts title="Publish targets and bind host tools"
export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  publish: {
    agents: ['triage_ticket', 'analyze_signals'],
    workflows: ['review_rollback'],
  },
  hostTools: {
    get_incident_snapshot: commandAsHarnessTool('Support', '1', 'getIncidentSnapshot'),
  },
  targets: {
    agents: {
      analyze_signals: {
        beforeGuards: { mayReadIncident },
        successEvent: 'incidentSignalsAnalyzed',
      },
    },
  },
})
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
records this single deployment boundary synchronously. The service creates and
owns the actual Harness runtime only when `getInstance(...)` receives the
required `ai` bindings.

| Field | Purpose |
| --- | --- |
| `publish.agents` / `publish.workflows` | Select targets reachable at the service address |
| `hostTools` | Bind Harness host-tool contracts to commands or typed handlers |
| `targets` | Add business before/after guards, an optional success fact, queue binding, and explicit durable-resume policy |

Guards on a wrapper command or stream do not protect the mounted target's own
EventBridge address. Put object/action/state authorization on
`targets.agents.<id>.beforeGuards` or
`targets.workflows.<id>.beforeGuards` whenever another service may invoke the
published address directly.

Runtime adapters are supplied when creating the service instance:

```ts title="Bind runtime adapters"
const support = await supportV1Service.getInstance(eventBridge, {
  resources: { incidentRepository, rollbackReviewRepository, harnessStorage },
  ai: {
    models: {
      primary: { provider: modelProvider, model: 'provider-model-id' },
    },
    admission: modelAdmission,
    storage: harnessStorage,
    sandbox,
    sandboxBinding,
    workspace,
    telemetry: { contentCaptureMode: 'NO_CONTENT' },
  },
})
```

Only configure adapters the definition needs. Startup validates required model
capabilities, host tools, persistence, and runtime support before accepting
work.

`modelAdmission` implements Harness `ModelAdmission`: `acquire(request)` waits
for or rejects capacity and returns a lease with `release()`. This controls
provider calls. It is not a `{ maxConcurrentRuns }` configuration object. Bind
the target to a PURISTA queue when complete agent invocations must wait durably
before they start.
