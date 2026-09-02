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
| `targets` | Add business before/after guards and an optional success fact |

Runtime adapters are supplied when creating the service instance:

```ts title="Bind runtime adapters"
const support = await supportV1Service.getInstance(eventBridge, {
  resources: { incidentRepository, rollbackReviewRepository, harnessStorage },
  ai: {
    models: {
      primary: { provider: modelProvider, model: 'provider-model-id' },
    },
    admission: { maxConcurrentRuns: 8 },
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
