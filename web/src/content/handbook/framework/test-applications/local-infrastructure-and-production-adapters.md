---
title: Test local infrastructure and production adapters
description: Use local defaults for fast feedback and real adapter integration tests for production guarantees.
order: 930
---

In-memory core defaults are appropriate for unit tests. They do not prove TLS,
identity, broker durability, cloud IAM, sidecar components, Redis persistence,
or external-service failure behavior.

## Give each adapter a protected test target

Install and configure the same optional adapter package used by the deployment,
but point it to a disposable non-production target. Use a run-specific prefix
for keys/subjects/queues and a least-privilege identity limited to that prefix.

| Adapter boundary | Minimal integration proof | Do not infer from a unit test |
| --- | --- | --- |
| EventBridge | Publish and consume one schema-valid event with the deployed authentication mode | Durable subscription/reconnect/ACL behavior |
| QueueBridge | Enqueue, lease, acknowledge, and recover one expired/failed job | Redelivery, delay, DLQ, and idempotency enforcement |
| State/config store | Read/write expected value and reject a neighboring namespace | Persistence, encryption, IAM, or component scope |
| Secret store | Resolve a test secret and deny a neighboring path | Rotation, workload identity, and audit policy |
| HTTP sidecar/server | Authenticated request plus protected endpoint denial | TLS, gateway, ingress, and header propagation |

Maintain a separate integration-test configuration for each production adapter. Provision non-production resources with least-privilege credentials, use unique namespaces/prefixes, and clean up test state. Assert one observable capability per test: a broker round trip, a store read/write, a DLQ record, or a denied credential.

Never point automated tests at a production store or secret backend. Treat
cleanup as verification too: retained queue/DLQ records and test secret values
can become cost, privacy, and replay hazards. Keep immutable environment
selection outside the test process so a typo cannot switch targets.

Next: [chapter overview](/handbook/framework/test-applications/).
