---
title: Publish results and react through subscriptions
description: Publish a completed target as a fact and emit explicit events for meaningful facts during execution.
order: 397
---

A target policy can publish its successfully completed outcome as an event:

```ts title="Publish a successful target outcome"
export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  targets: {
    agents: {
      analyzeSignals: { successEvent: 'incidentSignalsAnalyzed' },
    },
  },
})
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
validates the target and its success-event policy before service startup.

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
