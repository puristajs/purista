---
title: Deploy and observe AI-powered services
description: Bind production adapters, control concurrency, and observe mounted Harness execution without changing the portable definition.
order: 3994
---

Production topology is a composition-root choice. The same Harness definition
and service mount can run with local adapters in development and durable,
replicated adapters in production.

Provide the concrete model provider, Harness storage, workspace, sandbox,
admission controller, artifact store, logger, and telemetry configuration
required by the definition. Use separate service-owned adapter instances unless
an adapter explicitly supports shared lifecycle.

For load control:

- set Harness admission limits for active runs in each instance;
- place a PURISTA queue before long or retryable work;
- configure worker concurrency for provider quota and fleet size;
- use provider retry metadata and `toHarnessQueueRetry(...)` for deferred retry;
- make side-effecting host tools idempotent.

Trace the path from incoming command or stream through EventBridge, the mounted
target, model calls, tools, and terminal outcome. Keep conversation ids distinct
from traces. Record low-cardinality status, latency, token, queue, interruption,
and tool metrics. Do not put prompts, customer content, credentials, or raw
model output in metric attributes.

Readiness should fail when a required adapter or capability is missing. Health
checks should test dependencies needed to accept work without issuing model
requests merely to prove the process is alive.
