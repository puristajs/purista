---
title: Migrate Framework and infrastructure adapters
description: Move a service between local and distributed runtime adapters without assuming equal delivery guarantees.
order: 1120
---

Moving from default in-process adapters to Redis, NATS, AMQP, MQTT, or Dapr is an infrastructure migration. The application must be configured and deployed with the new package, external service, credentials, network policy, and recovery procedure.

| Move | Validate before cutover |
| --- | --- |
| Default EventBridge to a broker | Subjects/exchanges, durable subscription semantics, authorization, and redelivery behavior |
| Default QueueBridge to Redis or NATS | Worker idempotency, retry/DLQ operations, and queue retention |
| Local stores to a managed store | Key naming, permissions, availability, backup/restore, and secret rotation |
| Direct adapters to Dapr | Sidecar, components, scopes, workload identity, and component health |

Run both paths only when duplicate processing is safe and explicitly guarded. Otherwise use a planned drain: stop new producers, finish or record in-flight work, switch consumers, then enable producers on the target path.

## Example: move invoice-email jobs to NATS QueueBridge

Keep the job payload and business idempotency key stable while changing the
bridge. First deploy the target bridge and validate its JetStream/ACL/startup
requirements without sending production jobs. Then pause the old producer,
inspect old pending/leased/DLQ work, let safe workers finish or record the work
for a controlled replay, move consumers, and only then enable the target
producer. The delivery record `(tenant, invoice, email type)` prevents a
temporarily overlapping consumer from sending two emails.

Do not copy an old queue message directly into a new adapter unless its schema,
tenant context, retention policy, and idempotency evidence have been reviewed.
Use the target adapter's enqueue API and an audited migration/replay tool so the
new message has correct metadata and observability.

The adapter guides describe the exact enablement and prerequisites: [event delivery](/handbook/framework/connect-distributed-infrastructure/event-delivery/), [queue delivery](/handbook/framework/connect-distributed-infrastructure/queue-delivery/), [stores](/handbook/framework/persist-application-state/), and [Dapr](/handbook/framework/connect-distributed-infrastructure/platform-integrations/dapr/).
