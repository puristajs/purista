# Testing, Observability, And Deployment

Use this reference when validating or operating a PURISTA app.

## Testing
Test declared boundaries and runtime wiring:
- command tests should use command context helpers or service instances
- subscription tests should assert consumed event behavior
- stream tests should verify chunks and final payloads
- queue worker tests should cover retry/ack/dead-letter behavior when relevant
- schedule export tests should assert deterministic manifests and unsupported expression failures without a live scheduler or cluster
- strict queue idempotency tests should assert duplicate enqueue returns the original job id and does not create a second job
- agent tests should use core agent testing helpers
- security tests should cover missing tenant/principal metadata, unauthorized access, guard failures, redaction, and least-privilege resources

Avoid tests that only validate raw helper functions while skipping builder metadata and runtime wiring.

## Observability
PURISTA core wraps service, command, stream, subscription, queue, and HTTP execution with logger, OpenTelemetry trace context, and OpenTelemetry Metrics API recording. Package code should preserve those context surfaces.

Metrics guidance:
- core records through the OTel Metrics API and stays SDK/exporter-neutral
- applications own MeterProvider, metric readers, exporters, collectors, and backend setup
- Prometheus is configured outside core through the OTel Collector or an application-owned OTel Prometheus exporter
- custom metrics are declared with `ServiceBuilder.defineMetric(...)` or `AgentQueueBuilder.defineMetric(...)`
- handlers record custom metrics through typed `context.metrics`
- custom metric names must use `app.*`
- avoid high-cardinality or sensitive attributes such as headers, raw URLs, prompts, completions, tokens, user IDs, tenant IDs, and payload data
- prefer stable non-sensitive dimensions and counts; link detailed forensic records through authorized stores/audit systems instead of metric labels

```ts
context.metrics['app.orders.created'].add(1, { channel: 'web' })
context.metrics['app.orders.duration'].record(42, { channel: 'web' })
```

For AI:
- core bridges PURISTA logger into harness logger
- `ai.telemetry` passes harness telemetry options into `@purista/harness`
- harness owns GenAI semantic-convention metrics, model metrics, token metrics, and tool metrics
- PURISTA records only service and agent wrapper metrics around attached agent execution
- stream chunks preserve run identity and provider-style event names

## Logging
Use context logger surfaces instead of ad hoc loggers:
- `context.logger`
- service-level logger
- AI `context.logger`
- harness logger bridge where model/tool runtime is involved

Structured logs should include enough identity for operations without exposing content. Safe examples include service, command, queue, agent, run id, correlation id, trace id, status, retry count, and sanitized error class. Avoid payloads, headers, authorization data, cookies, prompts, completions, attachments, raw provider responses, and secrets.

## Privacy And Audit Verification
Before production, verify:
- guards reject missing or unauthorized `tenantId` and `principalId`
- sensitive data is scoped by tenant in resources, stores, queues, cache keys, and idempotency keys
- logs, spans, metrics, events, queues, streams, and generated OpenAPI examples do not expose secrets or PII
- model calls receive redacted/minimized context and default AI telemetry does not capture prompt/completion content
- audit records identify actor, tenant, operation, resource id, decision, and timestamp without storing confidential content unless policy requires it

## Deployment
Choose topology after architecture:
- event bridge selection follows delivery semantics
- queue bridge selection follows durability semantics
- scheduler selection stays external; Kubernetes CronJob export is manifest generation for an explicit trigger container/script
- HTTP server selection follows exposed contracts
- AI provider selection stays optional app runtime wiring

## Verification
Name the commands used:
- package build
- package tests
- package lint
- dependency-cycle checks for shared packages
- stale-reference scans when removing protocols or optional dependencies
- sensitive-data scans for logs, metrics attributes, spans, events, queue payloads, docs, examples, and AI prompts
- live Redis/NATS idempotency checks where container infrastructure is available
