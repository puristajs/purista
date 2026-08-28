---
title: State stores
description: Choose a state-store adapter for service state that must survive restart or be shared across processes.
order: 530
---

State stores persist application-owned values such as an idempotency record, workflow checkpoint, or service state. They are not configuration or secret stores.

| Store | Availability | Use when |
| --- | --- | --- |
| Default in-memory | Included; local/test only | State can be discarded after the process ends |
| Redis | `@purista/redis-state-store` + Redis | Low-latency shared state is sufficient |
| NATS JetStream KV | `@purista/nats-state-store` + JetStream | NATS provides the managed durability boundary |
| Dapr | `@purista/dapr-sdk` + sidecar/component | The platform owns the backing state component |

Every store supports `getState`, `setState`, and `removeState` by default. A
composition root can deliberately disable an operation with `enableGet`,
`enableSet`, or `enableRemove`; an attempted disabled operation fails with an
authorization error. That is a process-level safety switch, not tenant
authorization.

The shared toggle, logger, and cache configuration is explained in
[Configure store operations and secret caching](/handbook/framework/configure-applications/configure-store-operations-and-secret-cache/).
State's core base class does not provide a cache; do not assume a shared
`StoreBaseConfig` field adds one to every state adapter.

Before choosing an adapter, define consistency, retention, backup,
access-control, and recovery requirements; an adapter cannot infer them from a
key name.

## Start with one service-owned record

State stores are deliberately generic. They do not provide a database schema,
cross-key transaction, or tenant authorization automatically. Treat a stored
value as a small, versioned application record and validate it every time it is
read.

```ts title="src/service/billing/v1/state/idempotencyRecord.ts"
import { z } from 'zod'

export const paymentRecordSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['accepted', 'completed']),
})

export const paymentStateKey = (tenantId: string, requestId: string) =>
  `billing:v1:tenant:${tenantId}:payment:${requestId}`
```

Use the same key for duplicate-delivery protection only when the business
operation is also the same. For the key layout, tenant boundary, read/write
race, and migration plan, use [keys, namespaces, isolation, and
consistency](/handbook/framework/persist-application-state/keys-namespaces-isolation-and-consistency/).

| Need | Store design |
| --- | --- |
| Idempotent side effect | A stable request/business key, a validated completion record, and a recovery rule for an incomplete record. |
| Read model/cache | A versioned value with an explicit refresh or invalidation path; do not assume every adapter provides cache eviction. |
| Long-lived domain data | A real database or domain repository, unless the state adapter's consistency and backup contract demonstrably meets the requirement. |
| Shared production state | A durable adapter plus a restart/failover test; the default store cannot prove this. |

## Verify the boundary at two levels

Unit-test the key and value schema with the included default store or a mock.
Then run an adapter integration test that writes a value, starts a new service
instance, and proves the expected read/recovery behavior. The complete
test-and-change sequence is in [test and migrate state](/handbook/framework/persist-application-state/test-and-migrate-state/).

## Choose the next step

| Need | Next guide |
| --- | --- |
| Learn the safe key/value contract before writing a handler | [Keys, namespaces, isolation, and consistency](/handbook/framework/persist-application-state/keys-namespaces-isolation-and-consistency/) |
| Get a local or deterministic test working | [Use the default state store locally](/handbook/framework/persist-application-state/default/) |
| Use a supported durable backend | [Redis](/handbook/framework/persist-application-state/redis/), [NATS JetStream KV](/handbook/framework/persist-application-state/nats-jetstream-kv/), or [Dapr](/handbook/framework/persist-application-state/dapr/) |
| Implement a provider PURISTA does not ship | [Build a custom state store](/handbook/framework/persist-application-state/custom-state-store/) |
| Change a stored record or backing provider safely | [Test and migrate state](/handbook/framework/persist-application-state/test-and-migrate-state/) |
