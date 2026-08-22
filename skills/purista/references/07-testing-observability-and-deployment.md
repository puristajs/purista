# Testing, Observability, And Deployment

Use this reference when validating or operating a PURISTA app.

## Contents

- [Testing](#testing)
- [Observability](#observability)
- [Logging](#logging)
- [Privacy And Audit Verification](#privacy-and-audit-verification)
- [Deployment](#deployment)
- [Verification](#verification)

## Testing
Test declared boundaries and runtime wiring:
- command tests should use command context helpers or service instances
- subscription tests should assert consumed event behavior
- stream tests should verify chunks and final payloads
- queue worker tests should assert declared `canInvoke`, `canConsumeStream`, `canEnqueue`, `canEmit`, and `canInvokeAgent` dependencies through the queue worker context helpers, plus retry/ack/dead-letter behavior when relevant
- scheduler tests should use `SchedulerRuntime`, `DefaultSchedulerProvider`, and an injectable clock to assert five-field cron/DST behavior, occurrence metadata, group filtering, and stable diagnostics. Provider packages must run `assertSchedulerProviderContract(...)`; a durable/distributed provider supplies an independent replica sharing the same test backend. Schedule export tests should still assert deterministic manifests and unsupported Kubernetes expression failures
- generated-project smoke tests should install freshly packed Core and CLI artifacts into a clean temporary app, compile/test it, add a service and an event-only schedule, export definitions/schedules, and run strict static validation. This proves scaffolding and shipped packages agree without using workspace symlinks
- strict queue idempotency tests should assert duplicate enqueue returns the original job id and does not create a second job
- agent tests should use core agent testing helpers
- durable agent workspace tests should use a fake durable workspace store and
  assert startup capability validation, retry resume, cleanup, and explicit
  ephemeral fallback behavior
- security tests should cover missing tenant/principal metadata, unauthorized access, guard failures, redaction, and least-privilege resources

Avoid tests that only validate raw helper functions while skipping builder metadata and runtime wiring.

## Observability
PURISTA core wraps service, command, stream, subscription, queue, and HTTP execution with logger, OpenTelemetry trace context, and OpenTelemetry Metrics API recording. Package code should preserve those context surfaces.

Use one `getInstance(..., { logger, spanProcessor, metrics, metricsRecorder })`
configuration for a service. Opt-in adapters inherit only missing values;
explicit component configuration wins. Core `EventBridgeBaseClass` adapters
inherit logger, metrics, and span processor values when they are passed to
`getInstance(...)` before `eventBridge.start()` or any bridge tracing call.
That first use fixes the bridge telemetry configuration. Do not change a
running bridge, and do not infer inheritance for an adapter that does not
implement `inheritServiceObservability(...)`.

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
- attached agents inherit the service logger when `ai.logger` is absent; an
  explicit `ai.logger` wins
- `ai.telemetry` is an explicit pass-through of Harness telemetry options; do
  not map Core `spanProcessor`, `metrics`, or `metricsRecorder` into it
- harness owns GenAI semantic-convention metrics, model metrics, token metrics, and tool metrics
- harness owns durable workspace operation metrics, workspace bytes, quota, and
  cleanup metrics
- PURISTA records only service and agent wrapper metrics around attached agent execution
- PURISTA records only workspace policy validation and fallback wrapper metrics
  around attached agent execution
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
- model calls receive redacted/minimized context; Harness defaults telemetry
  content capture to `NO_CONTENT` unless the application explicitly opts in
- audit records identify actor, tenant, operation, resource id, decision, and timestamp without storing confidential content unless policy requires it

## Deployment
Choose topology after architecture:
- event bridge selection follows delivery semantics
- queue bridge selection follows durability semantics
- deploy `SchedulerRuntime` separately from business services; use `DefaultSchedulerProvider` only locally. Replicated production hosts use `RedisSchedulerProvider` with `.setStrict().setRequireDistributedClaims()` and a unique Redis `keyPrefix`; Kubernetes CronJob export remains manifest generation for an explicit trigger container/script
- HTTP server selection follows exposed contracts
- AI provider selection stays optional app runtime wiring
- durable workspace store selection stays optional app runtime wiring; product
  layers own retention durations, encryption key policy, tenant/project quotas,
  and cleanup scheduling

## Verification
Name the commands used:
- `npm run release:check` runs the repository release gate and emits one
  machine-readable `PURISTA_RELEASE_EVIDENCE=` JSON record after the checks.
  It records the source revision/dirty state, public package versions, selected
  test counts, check outcomes, canonical knowledge digests, and the digest of
  the configured external authority tree when it is available. Capture the JSON in CI
  or use `npm run release:evidence -- --out /absolute/path/evidence.json` when
  a persisted artifact is required; the default command does not write the
  worktree.
- In a standalone checkout with a separate authority tree, run
  `npm run release:evidence -- --help` for the external-input configuration.
  The required release variant fails when that input is unavailable. A missing
  authority tree is a named limitation, never evidence that release authority
  was verified.
- package build
- package tests
- package lint
- dependency-cycle checks for shared packages
- stale-reference scans when removing protocols or optional dependencies
- sensitive-data scans for logs, metrics attributes, spans, events, queue payloads, docs, examples, and AI prompts
- live Redis/NATS idempotency checks where container infrastructure is available
- durable workspace store contract checks where a production replay adapter is
  configured
