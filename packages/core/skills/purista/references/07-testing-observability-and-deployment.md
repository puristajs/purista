# Testing, Observability, And Deployment

Use this reference when validating or operating a PURISTA app.

## Contents
- [Testing](#testing)
- [Observability](#observability)
- [Logging](#logging)
- [Privacy and audit verification](#privacy-and-audit-verification)
- [Deployment](#deployment)
- [Verification](#verification)

## Testing

Teach the public Framework helpers beside each primitive. Start from the
generated test and explain arrangement, action, assertion, and what is mocked.

| Boundary | Public helper / setup | Limit |
| --- | --- | --- |
| Command behavior | `createCommandContextMock` and `safeBind(builder.getCommandFunction(), serviceInstance)` | Validates input/output and runs before guards; excludes transforms and after guards |
| Raw handler | `getCommandFunctionPlain` | Excludes schemas and all hooks |
| One hook | Named guard/transform accessor, matching context helper, `safeBind` | Does not run sibling hooks or the complete lifecycle |
| Command runtime | `createCommandTestHarness(serviceBuilder, commandBuilder, options)` | Registers/executes through the service, but does not prove Hono or a real broker |
| Explicit runtime message | `service.registerCommand(definition)`, then `service.executeCommand(getCommandMessageMock(...))` | Runs the command lifecycle; use explicit trusted metadata and check the response discriminator |
| Subscription logic | `createSubscriptionContextMock` and service-bound `getSubscriptionFunction` | No routing, transforms, after guards, or result-event delivery |
| Queue worker | `createQueueWorkerContextMock` and declared resource/client stubs | No real broker lease, retry timing, or persistence proof |
| Stream | Matching stream context/harness helpers | Proves chunks/final/cancellation only at the exercised boundary |
| Application/adapter | Real services with the selected Hono/bridge/store | Proves the actual wiring and only the exercised adapter guarantees |

Supply resource fakes via `resources`; configure their method results and
failures. Store stubs such as `stubs.getState` reject when unconfigured. Return
the keyed-object shape from a state read, not a bare record. Assert arguments,
results, and absent effects on denial. Use Sinon assertions for Sinon stubs,
or the test runner's matcher for its own mock type. Restore/destroy owned
test objects in cleanup.

`createCommandContextMock`'s `message` option overrides payload/parameter,
not trusted identity. The runtime harness `run` also takes only payload and
parameter. For identity cases use `getCommandMessageMock` with explicit
metadata and the service execution path, or an explicit direct context message.
Do not invent helper options or mock away the guard under test.

`createCommandTestHarness` infers the service instance configuration from the
supplied service builder. Pass required configuration, resources, stores, and
bridges through its options. Use an explicit service message when a test needs
trusted caller metadata, because `run` intentionally accepts only payload and
parameter.

Use a few deterministic runtime checks for transforms/after guards and
registration. Do not force every branch through HTTP, nor claim a raw handler
test proves the Framework lifecycle. Keep infrastructure tests and live model
quality evaluations separate from fast service tests.

Test declared boundaries and runtime wiring:
- command tests should use command context helpers or service instances
- subscription tests should assert consumed event behavior
- stream tests should verify chunks and final payloads
- queue worker tests should assert declared `canInvoke`, `canConsumeStream`, `canEnqueue`, `canEmit`, and `canInvokeAgent` dependencies through the queue worker context helpers, plus retry/ack/dead-letter behavior when relevant
- schedule export tests should assert deterministic manifests and unsupported expression failures without a live scheduler or cluster
- strict queue idempotency tests should assert duplicate enqueue returns the original job id and does not create a second job
- native agent and workflow tests should use `@purista/harness/testing`; test
  PURISTA publication, guards, queue bindings, and address-first invocation at
  the Core mount boundary
- durable agent workspace tests should use a fake `DurableWorkspace` and
  assert startup capability validation, retry resume, cleanup, and explicit
  ephemeral fallback behavior
- security tests should cover missing tenant/principal metadata, unauthorized access, guard failures, redaction, and least-privilege resources

Avoid tests that only validate raw helper functions while skipping builder metadata and runtime wiring.

## Observability
PURISTA core wraps service, command, stream, subscription, queue, and HTTP execution with logger, OpenTelemetry trace context, and OpenTelemetry Metrics API recording. Package code should preserve those context surfaces.

Metrics guidance:
- core records through the OTel Metrics API and stays SDK/exporter-neutral
- applications own MeterProvider, metric readers, exporters, collectors, and backend setup
- Prometheus is configured outside core through the OTel Collector or an application-owned OTel Prometheus exporter
- custom metrics are declared with `ServiceBuilder.defineMetric(...)`
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
- harness owns durable workspace operation metrics, workspace bytes, quota, and
  cleanup metrics
- PURISTA records only service and mount wrapper metrics around Harness execution
- PURISTA records only workspace policy validation and fallback wrapper metrics
  around mounted Harness execution
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
- durable workspace selection stays optional app runtime wiring; product
  layers own retention durations, encryption key policy, tenant/project quotas,
  and cleanup scheduling

## Verification
Name the commands used:
- package build
- package tests
- package lint
- dependency-cycle checks for shared packages
- stale-reference scans when removing protocols or optional dependencies
- sensitive-data scans for logs, metrics attributes, spans, events, queue payloads, docs, examples, and AI prompts
- live Redis/NATS idempotency checks where container infrastructure is available
- durable workspace contract checks where a production replay adapter is
  configured
