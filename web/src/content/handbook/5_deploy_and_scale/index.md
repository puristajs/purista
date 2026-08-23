---
title: Deploy & Scale
description: Choose a PURISTA deployment topology and make its infrastructure boundaries explicit.
order: 500000
---

# Deploy & Scale

PURISTA service boundaries do not prescribe deployment boundaries. Start one or
many services in one process when that is useful; split them only when scaling,
ownership, or isolation requires it. The service definition and handler code
stay the same. Bootstrap, transport, stores, and operations change.

## Choose the smallest topology that meets the requirement

| Topology | Use it when | Required infrastructure | Next guide |
|---|---|---|---|
| Local test | You need fast, deterministic feedback. | In-memory bridge and stores in **one process**. | [Monolithic](./monolithic.md) |
| One application process | One artifact and one availability boundary are enough. | A process/container; external stores only when the application needs durable state. | [Monolithic](./monolithic.md) |
| Distributed services | Services need independent release, scale, or fault boundaries. | A shared EventBridge; shared durable stores and queue backend where required. | [Microservice style](./microservice_style/index.md) |
| Kubernetes | You need declarative rollout, replica management, and platform probes. | The distributed-service requirements plus cluster operations. | [Kubernetes](./microservice_style/kubernetes.md) |
| Serverless or edge | The runtime model, not organisation, is the constraint. | Provider-specific invocation and persistence boundaries. | [Serverless / FaaS](./serverless_function_fass.md), [Edge](./edge.md) |

`DefaultEventBridge`, `DefaultQueueBridge`, and default in-memory stores are
process-local. They are excellent for a local test or a one-process app. They
do not connect replicas, containers, or separately started scheduler hosts.

## Production invariants

- Every replica that must exchange messages uses the same external EventBridge.
- State, secrets, configuration, queues, and idempotency records are shared
  whenever more than one process can handle the same work.
- Services are started before HTTP traffic is accepted; stop accepting work
  before destroying services and bridges.
- The composition root owns telemetry. Configure every shared adapter at
  construction and pass the same explicit `logger`, `spanProcessor`, and
  `metrics` values to each service; a service never mutates or configures a
  shared adapter.
- Scheduler hosts are separate deployable processes. See [Scheduling](../6_integrations/enterprise_interoperability/scheduling.md).
- Treat message delivery as at-least-once where a bridge or queue backend says
  so. Make externally visible effects idempotent.

## Before a rollout

1. Export definitions, persist `purista inspect --out` as the build contract,
   then run `purista validate --strict`, `purista doctor`, and
   `purista diff --base <approved-artifact>` in CI. For multiple repositories,
   run `purista compose` with pinned local artifacts from the deployment build.
2. Test the selected bridge, stores, queue backend, and graceful shutdown in an
   environment that resembles production.
3. Configure health/readiness endpoints, structured logs, traces, metrics, and
   alerts for each independently deployed process.
4. Define rollout, retry, retention, backup, and recovery ownership rather than
   relying on framework defaults.

## Related

- [Event Bridges](../3_eco_system/eventbridges/index.md)
- [Stores](../2_building_business-logic/stores/index.md)
- [OpenTelemetry](../4_open_telemetry/index.md)
- [Scheduling](../6_integrations/enterprise_interoperability/scheduling.md)
