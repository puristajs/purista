---
title: Publish results and react through subscriptions
description: Publish a completed mounted target as a fact, and emit explicit events only for meaningful facts that happen during execution.
order: 397
---

A mount target can publish its successfully completed terminal outcome as an
event:

```ts title="Publish a successful target outcome"
export const supportV1Service = supportV1ServiceBuilder.mountHarness(incidentHarness, {
  publish: { agents: ['analyze_signals'] },
  targets: {
    agents: {
      analyze_signals: { successEvent: 'incidentSignalsAnalyzed' },
    },
  },
})
```

Use this when the fact is exactly “this target finished successfully.” A normal
PURISTA subscription can react without coupling itself to the caller.

Emit a custom event from a host tool, command, or workflow integration when a
different fact becomes true during execution, such as “review requested” or
“transfer reserved.” Declare it with `canEmit(...)` before calling
`context.emit(...)`.

These mechanisms are intentionally different:

- `successEvent` follows the completed target automatically;
- a custom event records an explicit intermediate business fact;
- progress events belong to the execution stream and are not durable business
  facts by default.

Do not publish interrupted, failed, or cancelled runs as successful facts.
