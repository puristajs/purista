---
title: Microservice style
description: Deploy selected PURISTA services independently over shared infrastructure.
order: 503000
---

# Microservice style

Use separate processes or containers when a service needs its own release,
scale, security, or failure boundary. A service is not a microservice merely
because it uses a `ServiceBuilder`; deployment is a deliberate operational
choice.

## Process boundary

Each deployment starts only the service instances it owns and connects them to
the same shared transport:

```ts [src/orders.ts]
import { gracefulShutdown, initLogger } from '@purista/core'
import { NatsBridge } from '@purista/natsbridge'
import { ordersV1Service } from './service/orders/v1/index.js'

const logger = initLogger()
const eventBridge = new NatsBridge({ config: { url: process.env.NATS_URL } })
await eventBridge.start()

const orders = await ordersV1Service.getInstance(eventBridge)
await orders.start()

gracefulShutdown(logger, [eventBridge, orders])
```

The users, payments, and notifications processes use the same transport but
start only their own services. Add a shared queue provider for workers and
shared state/config/secret implementations wherever a handler can run in more
than one process.

## Required distributed-systems decisions

| Concern | Decide explicitly |
|---|---|
| Delivery | Which bridge/queue semantics apply, and which effects need idempotency? |
| Ownership | Which service owns each command, event, schema, and data mutation? |
| State | Which state is local, shared, durable, backed up, and retained? |
| Observability | How are logs, traces, metrics, and correlation IDs collected across processes? |
| Failure | What retries, dead letters, timeouts, and compensations are safe? |
| Rollout | Can old and new contracts coexist during deployment? |

Service meshes can still provide networking, identity, mTLS, and telemetry for
HTTP or sidecar traffic. They do not replace the EventBridge or queue semantics
that carry PURISTA commands and events.

## Scheduler boundary

Do not start a scheduler inside every service replica. Export schedule
definitions and deploy scheduler groups independently. A scheduler publishes a
normal event; the receiving subscription, queue worker, or agent owns business
work and idempotency. See [Scheduling](../../6_integrations/enterprise_interoperability/scheduling.md).

For Kubernetes manifests and operational layout, continue with
[Deploy to Kubernetes](./kubernetes.md).
