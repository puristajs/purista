---
title: Observability
description: Use structured logs, OpenTelemetry traces, and low-cardinality metrics to operate message-driven services safely.
order: 1020
---

PURISTA instruments service, bridge, queue, and HTTP work through OpenTelemetry-friendly tracing and metrics surfaces. The application owns exporters, backends, sampling, retention, and sensitive-data policy.

| Signal | Use it to answer | Keep out |
| --- | --- | --- |
| Structured logs | What failed and which component acted? | Credentials, raw payloads, headers, customer content |
| Traces | Which command/event/queue path caused latency or failure? | Sensitive message bodies and unrestricted identifiers |
| Metrics | Is a queue growing, are retries rising, is latency degrading? | High-cardinality tenant/user/request labels |

Start with [OpenTelemetry](/handbook/framework/secure-and-operate/observability/opentelemetry/), then [choose and transition a backend](/handbook/framework/secure-and-operate/observability/backend-guides/). Use the selected backend's official deployment guidance for collector, endpoint, identity, and retention configuration.

Use [structured logging](/handbook/framework/secure-and-operate/observability/logging/)
for the application logger, safe field design, and correlation with traces.
