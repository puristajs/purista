---
title: Use NATS memory
description: Add JetStream KV memory for persistent multi-instance key/value coordination.
order: 635
---

Use NATS when several workers already share a JetStream deployment and need
durable scoped key/value coordination, not relevance search. This engine never
advertises text, vector, or hybrid search.

## Install and configure

Provision NATS with JetStream enabled, then install the adapter:

```sh title="Install the NATS memory adapter"
npm install @purista/harness-memory-nats
```

```ts title="src/harness/claimsMemory.ts"
import { natsMemoryEngine } from '@purista/harness-memory-nats'

export const claimsMemory = natsMemoryEngine({
  servers: ['nats://nats-a:4222', 'nats://nats-b:4222'],
  replicas: 3,
})
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`natsMemoryEngine(options)`](/handbook/api/functions/_purista_harness-memory-nats.natsMemoryEngine/) | Creates one JetStream-KV memory engine with persistent multi-instance key/value/list/delete/TTL capabilities. | It intentionally does not expose text, vector, or hybrid search. Use it when JetStream coordination is the fit; use a search-capable engine for relevance queries. |
| [`servers`](/handbook/api/interfaces/_purista_harness-memory-nats.NatsMemoryEngineServersOptions/#servers) | Lets the engine create and later drain/close its own NATS connection. `connectionOptions` applies only in this mode. | Choose this normal standalone path. Do not set `connection` at the same time. Connection/opening failure remains explicit; no empty bucket is silently used. |
| [`connection`](/handbook/api/interfaces/_purista_harness-memory-nats.NatsMemoryEngineConnectionOptions/#connection) | Reuses one application-owned NATS connection. | Choose it when the application owns connection lifecycle; the engine never drains or closes it. Do not combine it with `servers` or `connectionOptions`. |
| `bucket`, `createBucket`, `replicas`, `maxEnumeratedKeys` | Select the JetStream bucket (default `purista-harness-memory-v1`), creation behavior (default `true`), new-bucket replication (default `1`), and a hard enumeration limit (default `10_000`). | Existing buckets must already have the compatible v1 layout; do not point production memory at an arbitrary bucket. Increase enumeration only after bounding and monitoring the operational cost. |

Pass `claimsMemory` to `.memory(claimsMemory)` in the complete Harness
definition shown in [SQLite memory](/handbook/harness/manage-context-and-state/memory/sqlite/).
The default bucket is `purista-harness-memory-v1` with file storage and history
`1`. It supports persistent scoped key/value, list, delete, and lazy TTL
visibility—not text, vector, or hybrid search. Subjects use opaque hashes, so
logical keys, tenants, and principals are not written into NATS subjects.

Supply exactly one connection source: `servers` or an application-owned
connection. The adapter never closes an injected connection. An existing bucket
is not recreated; it must retain compatible v1 metadata, file storage, history,
and replica policy. Test JetStream readiness, ACLs, bucket mismatch, bounded
enumeration, cancellation, retention, and recovery. Engine failures intentionally
avoid leaking values, keys, identities, URLs, or credentials.
