---
title: Connect distributed infrastructure
description: Select the EventBridge, QueueBridge, HTTP server, and platform integration that matches the deployment boundary.
order: 700
---

Infrastructure adapters change delivery guarantees and operational ownership without changing a service's business definition. Choose them from requirements for distribution, durability, recovery, identity, and observability.

```mermaid title="Application composition keeps business definitions separate from infrastructure"
flowchart LR
  App[Application composition root] --> Event[EventBridge]
  App --> Queue[QueueBridge]
  App --> Stores[State, config, and secret stores]
  App --> Edge[HTTP / ingress process]
  Event --> Service[Versioned PURISTA service]
  Queue --> Service
  Stores --> Service
  Edge -->|invokes through EventBridge| Service
```

A service builder declares the command, event, stream, queue, and resource
contracts. The composition root chooses the implementation that carries or
persists those contracts. That lets a modular monolith and a distributed
deployment reuse the same service definition, but it does **not** make their
failure, identity, availability, or recovery behavior identical.

| Need | Capability |
| --- | --- |
| Commands/events across processes | [Event delivery](/handbook/framework/connect-distributed-infrastructure/event-delivery/) |
| Durable background jobs | [Queue delivery](/handbook/framework/connect-distributed-infrastructure/queue-delivery/) |
| HTTP command projections | [Expose services with Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/) |
| Platform sidecars | [Run with Dapr](/handbook/framework/connect-distributed-infrastructure/platform-integrations/dapr/) |
| Kubernetes health probes and command projection | [Run with Kubernetes](/handbook/framework/connect-distributed-infrastructure/platform-integrations/kubernetes/) |

## Move from local to a production adapter deliberately

| Step | What changes | Evidence before moving on |
| --- | --- | --- |
| 1. Choose the boundary | Decide whether commands/events cross processes, jobs must outlive a request, or a platform sidecar owns integration. | The selected bridge/store capability matches the business promise. |
| 2. Install and provision | Add the optional first-party package, then provision the broker, queue, sidecar, namespace, or managed service. | The package can import and the external target is reachable with the intended workload identity. |
| 3. Wire the composition | Construct the adapter once and pass it to the EventBridge, service, store, or HTTP composition that owns it. | A service starts with the intended adapter rather than a core in-memory default. |
| 4. Verify the real boundary | Run one protected round trip, job lease, store operation, or endpoint discovery path. | Logs/traces show the selected process and adapter; a denied neighboring target also fails. |
| 5. Operate and recover | Define health, shutdown, retention, retry, dead-letter, backup, and credential-rotation procedures. | The team can safely diagnose and repair a failed delivery without relying on a redeploy. |

Installing an adapter package is only step 2. It does not select the adapter,
provision its external service, grant a policy, or change a running service.
The focused EventBridge, QueueBridge, and store adapter pages list their own
capabilities, prerequisites, configuration, and recovery limits.

In-memory core defaults are useful for a first project. They are not silent
fallbacks when an explicitly selected external adapter cannot connect: treat
unavailable brokers, sidecars, and credentials as deployment failures.

## Keep delivery layers distinct

An EventBridge carries commands, events, subscriptions, and supported streams.
A QueueBridge owns accepted background jobs, leases, and job recovery. HTTP is
a projection that invokes service contracts through the EventBridge; it is not
a replacement queue or broker. Choose [state, configuration, and secret
stores](/handbook/framework/configure-applications/) separately—none of the
bridges automatically provides durable application state or secret management.

Next, choose [Event delivery](/handbook/framework/connect-distributed-infrastructure/event-delivery/)
for service-to-service messages, [Queue delivery](/handbook/framework/connect-distributed-infrastructure/queue-delivery/)
for durable work, or [HTTP and REST](/handbook/framework/expose-and-consume-services/http-and-rest/)
for an external API boundary.
