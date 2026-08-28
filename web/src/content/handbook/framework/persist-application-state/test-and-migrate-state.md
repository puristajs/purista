---
title: Test and migrate state
description: Verify handler logic deterministically, prove a durable adapter separately, and change key or value formats without corrupting delayed work or blocking rollback.
order: 670
---

State tests have two different jobs. A fast handler test proves key selection,
value validation, and recovery logic. A real-adapter test proves the durability,
permissions, and failure characteristics the production environment actually
provides. Do not substitute one for the other.

## Test stateful logic without infrastructure

`DefaultStateStore` is included in `@purista/core`, accepts seeded values, and
is process-local. It is suitable for a deterministic test because no network
or provider timing is involved.

```ts title="test/state/paymentRecord.test.ts"
import { DefaultStateStore } from '@purista/core'
import { expect, it } from 'vitest'

it('keeps a completed payment idempotent', async () => {
  const key = 'billing:v1:tenant:acme:payment:request-42'
  const states = new DefaultStateStore({
    config: { [key]: { paymentId: '7b5dd6ea-229e-49e9-8b23-cfeb21f80bd1', status: 'completed' } },
  })

  expect(await states.getState(key)).toEqual({ [key]: expect.objectContaining({ status: 'completed' }) })
})
```

Test the full service/command with its builder test helper when capability
declarations, events, guards, or runtime context matter. The direct store test
above is intentionally only for the state boundary.

## Prove the selected production boundary

Run an integration test against the same adapter type and security model used
in deployment. It should create a record, create a new store/service instance,
read the record back, and clean it up. Add the provider-specific checks your
workload relies on: denied credentials, a restart/failover, retention/backup,
or an outage and retry path. Use a unique test prefix; never wipe a shared
bucket, Redis database, or Dapr component as test cleanup.

## Change formats and adapters in recoverable steps

| Change | Safer rollout |
| --- | --- |
| Add an optional field | Read both shapes, write the new shape, and retain the old decoder until delayed work has drained. |
| Incompatible value meaning | Introduce a new key version (`billing:v2:...`), dual-read or backfill, verify counts, then retire the old prefix after the rollback window. |
| Move to another provider | Copy a bounded, versioned key set; dual-read with an explicit source-of-truth rule; prove restart recovery and access policy before switching writes. |
| Tighten retention or permissions | Test the exact expiry/denial behavior in the target environment before the policy becomes authoritative. |

Do not perform an unbounded background migration from a handler that also has
customer-facing side effects. Make migration progress observable, rate-limit
it, retain a rollback decision, and never delete the old records until the
recovery window and delayed-message horizon have passed.

Next: return to [persist application state](/handbook/framework/persist-application-state/) to choose an adapter, or use [keys, namespaces, isolation, and consistency](/handbook/framework/persist-application-state/keys-namespaces-isolation-and-consistency/) when designing the next record.
