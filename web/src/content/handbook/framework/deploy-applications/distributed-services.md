---
title: Compile and run distributed services
description: Create one composition entry point per independently deployed service or worker and connect them through production bridges.
order: 1052
---

Distribute a service only after defining the process boundary: which service
definitions the workload starts, which broker/store resources it owns, which
identity it receives, and which callers depend on it. Each workload uses the
same compile pattern as the monolith but has its own entry point and lifecycle.

## 1. Create one entry point per workload

```ts title="src/runtime/invoice-service.ts"
import { gracefulShutdown, initLogger } from '@purista/core'
import { createEventBridge } from '../eventbridge.js'
import { invoiceV1Service } from '../service/invoice/v1/invoiceV1Service.js'

const logger = initLogger()
const eventBridge = await createEventBridge(logger)
const invoiceService = await invoiceV1Service.getInstance(eventBridge, { logger })
await invoiceService.start()

gracefulShutdown(logger, [invoiceService, eventBridge])
```

```json title="package.json"
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start:invoice": "node --enable-source-maps dist/runtime/invoice-service.js",
    "start:gateway": "node --enable-source-maps dist/runtime/http-gateway.js"
  }
}
```

Build one image when workloads share the same code and dependencies, then
select the entry point per deployment. Build separate images when supply-chain,
native dependency, privilege, or release ownership requires independent
artifacts.

## 2. Replace the in-process bridge

Every process needs a separately constructed and monitored production
EventBridge, registered and started in that adapter's documented order. Queue
workers also need the selected QueueBridge. Use the
[EventBridge selection guide](/handbook/framework/connect-distributed-infrastructure/event-delivery/)
and do not assume that AMQP, NATS, MQTT, and Dapr have identical command,
consumer-failure, or stream capabilities.

The distributed startup contract is:

1. broker/sidecar and required stores are reachable;
2. each service process registers handlers and starts its bridge in the selected adapter's required order;
3. the HTTP gateway starts its bridge, consumes service-definition events, and
   becomes ready only after required routes exist;
4. callers send traffic;
5. shutdown removes intake, drains handlers where supported, then closes the
   bridge.

A producer may start before a consumer only when the selected transport and
definition explicitly provide the durability and late-registration behavior
the business needs. Otherwise coordinate readiness or accept a defined
degraded state.

## 3. Give each workload a narrow identity

Grant only the subjects/queues, stores, secrets, model providers, and telemetry
export paths required by that entry point. The gateway should not receive a
worker's database credential; a worker should not receive the gateway's public
TLS key. Propagate trusted principal and tenant metadata through the transport,
then enforce business authorization in the target service.

## 4. Verify distributed failure, not only success

Run the compiled processes separately and test:

- gateway starts before and after one service registration;
- command timeout and late response behavior;
- consumer crash, redelivery, idempotency, and dead-letter handling;
- broker reconnect and process restart;
- cross-process trace correlation and bounded metric cardinality;
- rolling compatibility between old and new service/message contracts; and
- shutdown while commands, subscriptions, or jobs are in flight.

The in-memory bridge and a single-process test cannot prove these properties.

Next: [deploy the HTTP gateway](/handbook/framework/deploy-applications/http-gateway/).
