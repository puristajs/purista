# Package Map

Use this reference when choosing packages or checking dependency boundaries.

## Canonical Package Inventory

`generated-api-index.md` is the deterministic, manifest-checked inventory. It lists every published `@purista/*` package, its selection rule, and verified primary APIs. Read it before choosing an adapter; do not invent a package from an old example or assumed naming scheme.

### Framework and HTTP

- `@purista/core`: application builders, service runtime, schemas, message/store/event/queue contracts, architecture exports, and the trigger-only Scheduler Runtime/Builder. `DefaultSchedulerProvider` is local/test only. Do not add `@purista/contracts` for this release line.
- `@purista/core/testing`: test harnesses, context/message mocks, and `safeBind`. Tests may import builders from this one explicit test subpath; production code must not.
- `@purista/core/client`: `HttpClient` for outbound HTTP calls and `ClientBuilder` for generated clients from exported service definitions.
- `@purista/core/adapter`: low-level bridge, store, transport, serialization, and base-class APIs. Use only when authoring a framework adapter; ordinary application code must not import it.
- `@purista/cli`: project and artifact scaffolding. Applications use the generated project-local CLI for services, commands, subscriptions, streams, queues, workers, event-only schedules, and agents.
- `@purista/hono-http-server`: active application HTTP/OpenAPI/SSE projection.
- `@purista/base-http-bridge`: adapter-author infrastructure for HTTP/sidecar EventBridges; application HTTP APIs use Hono.

## AI Runtime
- `@purista/core`: owns native harness-backed service-agent integration.
- Core depends on provider-neutral `@purista/harness`.
- Provider packages such as `@purista/harness-openai` stay app-level dependencies.
- Core exports `ServiceBuilder`, `AgentQueueBuilder`, selected agent types, testing helpers, harness contract types, logger/state adapters, and provider-style stream event schemas.

## Transport and Scheduling

- Event bridges: `@purista/amqpbridge`, `@purista/mqttbridge`, `@purista/natsbridge`, and `@purista/dapr-sdk` connect commands, events, subscriptions, and streams to their respective transports.
- Queue bridges: `@purista/nats-queue-bridge` and `@purista/redis-queue-bridge` run durable background work. Redis and NATS support strict idempotency: the same queue/idempotency key returns the original job id.
- Scheduler provider: `@purista/redis-scheduler-provider` coordinates replicated `SchedulerRuntime` hosts with distributed occurrence claims. It owns coordination only, never schedule evaluation or business work.

Event bridges and queue bridges are separate package categories. Do not use an event bridge as a queue bridge unless the adapter implements the queue contract. `DefaultQueueBridge` stays advisory for local development/tests.

## Stores and Platform Helpers

- Config stores: `@purista/aws-config-store`, `@purista/nats-config-store`, `@purista/redis-config-store`, and `@purista/dapr-sdk` (`DaprConfigStore`).
- State stores: `@purista/nats-state-store`, `@purista/redis-state-store`, and `@purista/dapr-sdk` (`DaprStateStore`).
- Secret stores: `@purista/aws-secret-store`, `@purista/azure-secret-store`, `@purista/gcloud-secret-store`, `@purista/infisical-secret-store`, `@purista/vault-secret-store`, and `@purista/dapr-sdk` (`DaprSecretStore`).
- Platform helper: `@purista/k8s-sdk` integrates declared services with Kubernetes HTTP/server helpers. Core and CLI export Kubernetes CronJob manifests for an explicit scheduler trigger container/script; this is not a scheduler runtime adapter.

Stores are runtime wiring. Service builders declare needs; service instances receive concrete stores.

`starter` is the default application template and `create-purista` is the project generator; both remain AI-free unless the generated application explicitly requests agents.

## Dependency Rules
- Shared packages may depend on `@purista/core`.
- Transport packages should not depend on provider packages.
- Harness must not import PURISTA packages.
- CLI may generate source that uses core agent builders, but CLI package/runtime code must not require provider packages to run.
