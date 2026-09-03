---
title: Infrastructure permissions
description: Give each workload the smallest broker, store, cloud, and sidecar permission set that can operate its intended service.
order: 1014
---

Application identity is part of the adapter configuration. Grant permissions to
the exact AWS parameter/secret path, Azure vault, Google project, Vault mount,
Redis endpoint, NATS subject/bucket, Dapr component, or AMQP exchange/queue
needed by the workload.

## Give each deployed service its own identity

Create a workload identity per application/service boundary and grant only the
verbs it needs. A billing API that publishes `invoice.created` does not need to
subscribe to every invoice subject, read every state key, or administer queues.

| Component | Minimum permission to start from | Verify with a denied case |
| --- | --- | --- |
| Secret store | Read only the named path/version | A nearby secret path cannot be read |
| State/config store | Read/write only its namespace or bucket | Another service or tenant namespace fails |
| Event bridge | Publish/subscription only to declared subjects | A wildcard publish/subscribe is rejected |
| Queue | Enqueue or consume only its named queue | Queue administration and neighboring queues fail |
| HTTP sidecar/gateway | Call only the configured upstreams | An arbitrary internal URL cannot be reached |

Use separate identities and adapter configuration for local, staging, and
production environments. A development credential with broad access is useful
only if it cannot be deployed accidentally; make the production startup fail
closed when its workload identity or required secret is unavailable.

## Make permission failures observable

At deployment, run a small smoke test that connects each configured adapter and
performs its required read, publish, enqueue, or subscription. Record the
adapter name and target in operational logs, but never credentials or complete
sensitive connection strings. Alert on authorization failures separately from
transient network errors so an expired policy is not retried as if it were a
timeout.

Use workload/managed identity where the platform supports it. Test both an allowed operation and a denied neighboring resource. A broad developer credential can hide a production policy error until deployment.

Next: [chapter overview](/handbook/framework/secure-and-operate/security/).
