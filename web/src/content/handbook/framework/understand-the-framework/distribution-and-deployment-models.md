---
title: Distribution and deployment models
description: Keep service definitions stable while changing the process and infrastructure topology around them.
order: 260
---

The same service definition can run with in-memory defaults in one process or with a broker-backed EventBridge in multiple processes. The application changes its composition; the service keeps its contracts.

| Shape | Good fit | Infrastructure consequence |
| --- | --- | --- |
| Modular monolith | Early product, one deployable, shared operational boundary | In-memory defaults can support local development; production still needs suitable persistence and secrets. |
| Distributed services | Independent scaling or ownership | Choose an EventBridge and service-discovery/HTTP strategy; design for network and duplicate delivery. |
| Kubernetes/Dapr | Platform-managed deployment and sidecars | Wire platform adapters in the composition root and verify health, identity, and policy. |
| Serverless or edge | Short-lived request processing | Verify runtime compatibility and avoid assuming local durable state. |

Do not split services only to follow a diagram. Split when a business boundary, deployment cadence, scaling need, or security boundary requires it.

Next: [reliability and delivery guarantees](/handbook/framework/understand-the-framework/reliability-and-delivery-guarantees/).
