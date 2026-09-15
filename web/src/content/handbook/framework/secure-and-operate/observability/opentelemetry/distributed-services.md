---
title: Configure OpenTelemetry for distributed services
description: Give each independently deployed service, worker, and Hono process its own telemetry composition and prove trace continuity across the selected transport and collector.
order: 10213
---

In a distributed deployment, telemetry configuration is process-local. Every
business-service process, worker process, and independently deployed Hono
process creates its own logger, exporter-backed span processor, Meter provider,
EventBridge/QueueBridge, and service instances.

```mermaid title="Each process owns telemetry composition; transport carries the request path"
flowchart LR
  H[Hono process: processor plus meter] --> E[EventBridge transport]
  E --> S[Business service: processor plus meter]
  S --> Q[QueueBridge]
  Q --> W[Worker process: processor plus meter]
  H --> C[Collector]
  S --> C
  W --> C
```

Use the [one-service setup](/handbook/framework/secure-and-operate/observability/opentelemetry/one-service/)
inside each process. Give every deployment stable resource identity through its
service name/version and platform environment/deployment attributes; do not use
container IDs, request IDs, tenants, or principals as metric labels.

## Verify continuity and failure behavior

1. Start service processes before dependent projections that discover endpoint
   definitions through the EventBridge; verify readiness for every process.
2. Send one controlled HTTP request that invokes a command and one queued job.
3. In the collector, inspect the cross-process path and confirm the expected
   bridge/service/queue spans are correlated by the selected transport.
4. Stop one collector endpoint or exporter in a non-production environment.
   Business traffic must retain its bounded timeout/retry behavior rather than
   retrying forever because telemetry is unavailable.

The Framework cannot manufacture cross-process trace continuity when a selected
bridge or external component does not propagate the required trace context.
Test that boundary with the actual adapter and collector. See [connect distributed
infrastructure](/handbook/framework/connect-distributed-infrastructure/) and
[HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).

Next: [choose an OpenTelemetry backend](/handbook/framework/secure-and-operate/observability/backend-guides/).
