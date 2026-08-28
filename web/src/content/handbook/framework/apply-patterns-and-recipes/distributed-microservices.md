---
title: Build distributed microservices
description: Split PURISTA services only when independent ownership, scaling, security, or deployment justifies a network boundary.
order: 850
---

Move to separate processes when a real boundary requires it: independent release
cadence, capacity profile, data/tenant boundary, or organizational ownership.
The service contract remains typed; the application changes its EventBridge,
client, store, and deployment wiring.

## Extract one capability by contract

Start with a capability that has a stable event/command contract and clear
operational owner. For example, move invoice email delivery out of billing when
its provider limits, operational hours, or release cadence differ from invoice
creation. Billing emits the versioned `invoice.created` fact; the notification
service owns retries, provider credentials, and its delivery record.

```mermaid title="Bounded invoice delivery extraction"
flowchart LR
  A[Billing command] -->|invoice.created v1| B[Durable EventBridge]
  B --> C[Notification subscription]
  C --> D[Provider resource]
  D --> E[Delivery record]
```

Do not split a service and leave both processes writing the same business
aggregate without a data ownership decision. A remote call is not a
transaction: an ambiguous timeout requires idempotency/reconciliation at the
effect boundary.

## Decide before deployment

| Decision | Example | Owner |
| --- | --- | --- |
| Contract/version | `invoice.created.v1` contains only recipient-independent invoice facts | Producing capability |
| Delivery mode | NATS JetStream durable subscription or AMQP queue configuration | Platform + consuming capability |
| Side-effect deduplication | `(tenantId, invoiceId, emailType)` delivery record | Consuming capability |
| Failure repair | Bounded retry then DLQ inspection/replay | Operational owner |
| Identity/ACL | Billing may publish its subject; notification may consume it | Platform/security owner |
| Observability | Shared trace/correlation and named SLO | Both capability owners |

Before splitting, define:

- broker delivery and consumer failure guarantees;
- idempotency and reconciliation for every external side effect;
- service discovery or exposed HTTP contract;
- identity propagation, tenant isolation, and least-privilege broker/store access;
- telemetry, health, alerting, and replay/dead-letter ownership.

Test at least one cross-process round trip against the selected infrastructure:
allowed and denied ACLs, broker restart/redelivery, duplicate delivery, and a
consumer version rollout. A unit test with an in-memory bridge is necessary but
cannot prove the production topology. See [event delivery](/handbook/framework/connect-distributed-infrastructure/event-delivery/)
and [delivery semantics](/handbook/framework/secure-and-operate/reliability/delivery-semantics/).

Next: [chapter overview](/handbook/framework/apply-patterns-and-recipes/).
