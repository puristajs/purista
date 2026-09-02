---
title: Secure and operate
description: Make identity, delivery, telemetry, recovery, and deployment controls part of the service design.
order: 1000
---

Production readiness is not a later infrastructure-only step. The selected bridge, stores, server, and service handlers together define the application's security and recovery behavior.

```mermaid title="Production controls cross the application and service boundary"
flowchart LR
  Edge[HTTP edge or caller] --> Identity[Trusted identity]
  Identity --> Service[Service guard and handler]
  Service --> Resource[Least-privilege resource]
  Service --> Delivery[EventBridge / QueueBridge]
  Service --> Signals[Logs, metrics, traces]
  Delivery --> Recovery[Retry, repair, shutdown]
  Signals --> Recovery
```

Start with the business operation that would cause the most harm if it were
exposed, duplicated, lost, or impossible to diagnose. Then make its identity,
authorization, data boundary, delivery behavior, and operator signal explicit.
The same approach applies to a command, subscription, stream, worker, or
mounted Harness target.

| Concern | Start here |
| --- | --- |
| Identity, authorization, tenant isolation, sensitive data | [Security](/handbook/framework/secure-and-operate/security/) |
| Logs, metrics, traces, and OpenTelemetry | [Observability](/handbook/framework/secure-and-operate/observability/) |
| Retries, timeouts, shutdown, queue recovery | [Reliability](/handbook/framework/secure-and-operate/reliability/) |
| Compile, package, and run a modular or distributed topology | [Deploy applications](/handbook/framework/deploy-applications/) |
| Capacity and latency | [Performance and scaling](/handbook/framework/secure-and-operate/performance-and-scaling/) |
| Symptoms and operator actions | [Troubleshooting and runbooks](/handbook/framework/secure-and-operate/troubleshooting-and-runbooks/) |

## Use this release path

| Before production traffic | What to prove | Canonical owner |
| --- | --- | --- |
| Identity is trusted | An invalid credential is rejected at the transport and a valid identity reaches the service context. | [Authentication and authorization](/handbook/framework/secure-and-operate/security/authentication-and-authorization/) |
| Data stays within its scope | A tenant/principal cannot read or change a neighboring record, queue item, or secret. | [Tenant isolation](/handbook/framework/secure-and-operate/security/tenant-isolation/) |
| A failure has a controlled outcome | Expected business errors are safe; retryable work is idempotent; repair paths are defined. | [Reliability](/handbook/framework/secure-and-operate/reliability/) and [Handle errors across service primitives](/handbook/framework/build-services/handle-service-errors/) |
| An operator can see the path | A controlled request produces safe logs, a trace, and the intended low-cardinality metric. | [Observability](/handbook/framework/secure-and-operate/observability/) |
| Shutdown does not silently abandon work | Intake stops first, services drain within a bounded policy, and unfinished durable work has a recovery path. | [Graceful shutdown](/handbook/framework/secure-and-operate/reliability/graceful-shutdown/) |

The default local adapters are not production controls. Review every selected
external package for identity, encryption, retention, backup, and operational
evidence before deployment. Do not use a successful local command as proof of
broker durability, cloud permissions, secret rotation, ingress policy, or
recovery readiness.
