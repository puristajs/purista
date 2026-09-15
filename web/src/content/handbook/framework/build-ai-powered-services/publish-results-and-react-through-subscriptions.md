---
title: Publish results and react through subscriptions
description: Publish a completed target as a fact and emit explicit events for meaningful facts during execution.
order: 397
---

A target policy can publish its successfully completed outcome as an event:

```ts title="Publish a successful target outcome"
const policy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
  agents: {
    analyzeSignals: { successEvent: 'incidentSignalsAnalyzed' },
  },
})

export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, policy)
```

[`defineHarnessPolicy(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineharnesspolicy)
checks that the event is attached to a root in the exact Harness definition.
[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
validates the completed mount before service startup.

Use `successEvent` when the fact is exactly “this target completed.” A normal
PURISTA subscription can react without coupling itself to the caller.

Emit a custom event from a host tool, command, or workflow integration when a
different fact becomes true, such as “review requested” or “transfer
reserved.” Declare it with `canEmit(...)` before calling `context.emit(...)`.

These mechanisms serve different contracts:

- `successEvent` follows a completed target automatically;
- a custom event records an explicit intermediate business fact;
- progress events belong to an execution stream and are not durable business
  facts by default.

Interrupted, failed, and cancelled runs do not produce a success event.
