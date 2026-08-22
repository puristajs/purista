# Package Map

Use this reference when choosing packages or checking dependency boundaries.

## Core Packages
- `packages/core`: builders, service runtime, schemas, messages, stores, event bridge contracts, queue contracts, testing helpers.
- `packages/core`: also owns the trigger-only Scheduler Runtime/Builder, local `DefaultSchedulerProvider`, enterprise export helpers such as AsyncAPI, CloudEvents mapping, provider-neutral schedule manifests, Kubernetes CronJob manifest export, and runtime capability reports. Do not add `@purista/contracts` for this release line.
- `packages/cli`: project and artifact scaffolding. Use it for app-level services, commands, subscriptions, streams, queues, workers, event-only schedules, and agents.
- `packages/hono-http-server`: active HTTP runtime and OpenAPI/SSE surface.
- `packages/base-http-bridge`: base HTTP bridge infrastructure.

## AI Runtime
- `packages/core`: owns native harness-backed service-agent integration.
- Core depends on provider-neutral `@purista/harness`.
- Provider packages such as `@purista/harness-openai` stay app-level dependencies.
- Core exports `ServiceBuilder`, `AgentQueueBuilder`, selected agent types, testing helpers, harness contract types, logger/state adapters, and provider-style stream event schemas.

## Bridges
- `packages/amqpbridge`: AMQP event bridge.
- `packages/mqttbridge`: MQTT event bridge.
- `packages/natsbridge`: NATS event bridge.
- `packages/dapr-sdk`: Dapr integration.
- `packages/nats-queue-bridge`: NATS queue bridge.
- `packages/redis-queue-bridge`: Redis queue bridge.

Redis and NATS queue bridges support strict idempotency for queues. With the same queue and `idempotencyKey`, duplicate enqueue returns the original enqueue result/job id and does not create a second job. `DefaultQueueBridge` stays advisory for local development/tests.

Event bridges and queue bridges are separate package categories. Do not use an event bridge as a queue bridge unless the adapter implements the queue contract.

## Stores
- config stores: `aws-config-store`, `nats-config-store`, `redis-config-store`
- state stores: `nats-state-store`, `redis-state-store`
- secret stores: `aws-secret-store`, `azure-secret-store`, `gcloud-secret-store`, `infisical-secret-store`, `vault-secret-store`

Stores are runtime wiring. Service builders declare needs; service instances receive concrete stores.

## Platform Helpers
- `packages/k8s-sdk`: Kubernetes helper package.
- `packages/redis-scheduler-provider`: Redis `SchedulerProvider` with distributed token leases and bounded durable completion state for replicated scheduler hosts. It owns only Redis coordination, not Core schedule evaluation or message publication. Kubernetes CronJob schedule export lives in core helpers and CLI; it generates manifests for an explicit trigger container/script, not a runtime adapter.
- `starter`: default application template; keep AI-free by default.
- `create-purista`: project generator; keep AI-free by default unless the generated application explicitly requests agents.

## Dependency Rules
- Shared packages may depend on `@purista/core`.
- Transport packages should not depend on provider packages.
- Harness must not import PURISTA packages.
- CLI may generate source that uses core agent builders, but CLI package/runtime code must not require provider packages to run.
