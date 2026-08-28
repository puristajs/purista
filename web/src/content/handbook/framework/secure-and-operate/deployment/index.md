---
title: Deployment
description: Select a deployment shape from runtime, identity, durability, and operational requirements.
order: 1040
---

Service definitions can remain stable across deployment models. The application
composition changes its adapters, secrets, HTTP surface, health, and shutdown
wiring. Choose the smallest topology that meets the required failure,
isolation, and scaling boundary; a distributed deployment is not an automatic
reliability upgrade.

| Shape | Use when | Required review |
| --- | --- | --- |
| Modular monolith | One deployable is sufficient | Replace local-only stores/secrets, define health and backup |
| Distributed services | Independent scaling/ownership needs a network boundary | Broker guarantees, identity, discovery, telemetry, replay |
| Kubernetes/Dapr | Platform manages workloads or sidecars | Probes, workload identity, network policy, component scopes |
| Serverless/edge | Runtime is short-lived or constrained | Runtime compatibility and no assumed local durable state |

## Move from local to a deployable runtime

1. Replace every local-only default store/bridge with the selected production
   adapter where the business needs durability or shared state. Record the
   required delivery, retention, backup, and replay behavior.
2. Give each workload its own identity and inject configuration/secrets at
   composition time. See [infrastructure permissions](/handbook/framework/secure-and-operate/security/infrastructure-permissions/).
3. Expose a readiness endpoint that returns ready only when the process can
   serve its intended traffic. Make shutdown stop intake before closing bridge,
   services, stores, and listener; see [graceful shutdown](/handbook/framework/secure-and-operate/reliability/graceful-shutdown/).
4. Run contract tests plus integration tests against the selected bridge,
   queue, stores, and identity policy in the target class before release.

| Change only composition | Change service design too |
| --- | --- |
| Event/queue bridge URL and credentials | Delivery/idempotency model for a broker-backed side effect |
| Store and secret-store adapter | Data scope, backup, retention, or migration behavior |
| HTTP listener, health, telemetry exporter | Expected latency/concurrency and resource pool limits |
| Workload identity and network policy | Cross-service contract and ownership boundary |

Next: [chapter overview](/handbook/framework/secure-and-operate/).
