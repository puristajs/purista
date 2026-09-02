---
title: Design keys, isolation, and consistency
description: Make state records safe to find, validate, migrate, and recover without mistaking a key prefix for authorization or a read/write pair for a transaction.
order: 610
---

Before a handler writes state, decide what one record represents, who may read
it, and what happens when two deliveries reach it at once. A state store gives
the handler named values; it does not create a domain schema, tenant boundary,
cross-key transaction, or compare-and-set rule.

## Give each key one business meaning

A readable versioned key makes incident investigation and a later migration
possible. Keep service, version, tenant boundary, record kind, and stable
business identifier separate.

```ts title="src/service/billing/v1/state/paymentRecord.ts"
import { z } from 'zod'

export const paymentRecordSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['accepted', 'completed']),
})

export const paymentRecordKey = (tenantId: string, requestId: string) =>
  `billing:v1:tenant:${tenantId}:payment:${requestId}`
```

Read one or more keys with `context.states.getState`. It always returns an
object keyed by the names requested, including `undefined` for a missing key.
Validate before relying on a stored value:

```ts title="src/service/billing/v1/command/chargePayment/chargePaymentCommandBuilder.ts"
import { HandledError, StatusCode } from '@purista/core'

const tenantId = context.message.tenantId
if (!tenantId) throw new HandledError(StatusCode.Unauthorized, 'Authentication required')

const key = paymentRecordKey(tenantId, payload.requestId)
const stored = await context.states.getState(key)
const existing = paymentRecordSchema.safeParse(stored[key])

if (existing.success && existing.data.status === 'completed') {
  return existing.data
}
```

The key is an operations and collision boundary. It does **not** authenticate a
tenant: derive `tenantId` from the trusted principal/context, authorize the
operation before the lookup, and give the runtime identity only the store and
network access it needs.

## Match the record to the required guarantee

| Requirement | What `context.states` provides | What the application or platform must provide |
| --- | --- | --- |
| One independently recoverable value | Read, replace, and remove by key | Value schema, retention, backup, and recovery decision |
| Duplicate delivery marker | A stable record keyed by the business operation | Idempotent side effect and a recovery rule for `accepted` but unfinished work |
| Atomic counter or compare-and-set | A plain read and a plain write | A provider-native atomic primitive or a database transaction; do not infer atomicity from `getState` followed by `setState` |
| Multi-record domain update | Multiple independent key operations | A transactional repository/outbox when all changes must commit together |
| Short-lived cache/session | A value until removed | Explicit TTL/cleanup mechanism supported and configured by the selected provider |

Keep values small, JSON-compatible, and free of secrets where possible. The
Redis and NATS adapters serialize JSON; the Dapr adapter sends JSON values to
the selected component. None of those facts turn application state into an
encrypted secrets store or a general-purpose database.

## Version before changing a record

Prefer a new key prefix such as `billing:v2:...` when the shape or meaning
changes incompatibly. This permits a controlled dual-read or backfill period
and a targeted rollback. Reusing the old key with an incompatible JSON shape
makes a delayed message or rollback much harder to recover.

Next: choose the [local default store](/handbook/framework/configure-applications/state-stores/default/), a durable adapter, or follow [test and migrate state](/handbook/framework/configure-applications/state-stores/test-and-migrate-state/) for a safe change.
