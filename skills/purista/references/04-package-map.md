# Package Map

Use this reference when choosing packages or checking dependency boundaries.

## Core Packages
- `packages/core`: builders, service runtime, schemas, messages, stores, event bridge contracts, queue contracts, testing helpers.
- `packages/cli`: project and artifact scaffolding. Use it for app-level services, commands, subscriptions, streams, queues, workers, and agents.
- `packages/hono-http-server`: active HTTP runtime and OpenAPI/SSE surface.
- `packages/base-http-bridge`: base HTTP bridge infrastructure.

## Optional AI Package
- `packages/ai`: optional harness-backed service-agent integration.
- Depends on `@purista/harness`.
- Must not be required by `packages/core`, `packages/hono-http-server`, `packages/cli` runtime, `starter`, or `create-purista` defaults.
- Exports `ServiceBuilder`, `AgentQueueBuilder`, selected agent types, testing helpers under `@purista/ai/testing`, harness contract types, logger/state adapters, and provider-style stream event schemas.

## Bridges
- `packages/amqpbridge`: AMQP event bridge.
- `packages/mqttbridge`: MQTT event bridge.
- `packages/natsbridge`: NATS event bridge.
- `packages/dapr-sdk`: Dapr integration.
- `packages/nats-queue-bridge`: NATS queue bridge.
- `packages/redis-queue-bridge`: Redis queue bridge.

Event bridges and queue bridges are separate package categories. Do not use an event bridge as a queue bridge unless the adapter implements the queue contract.

## Stores
- config stores: `aws-config-store`, `nats-config-store`, `redis-config-store`
- state stores: `nats-state-store`, `redis-state-store`
- secret stores: `aws-secret-store`, `azure-secret-store`, `gcloud-secret-store`, `infisical-secret-store`, `vault-secret-store`

Stores are runtime wiring. Service builders declare needs; service instances receive concrete stores.

## Platform Helpers
- `packages/k8s-sdk`: Kubernetes helper package.
- `starter`: default application template; keep AI-free by default.
- `create-purista`: project generator; keep AI-free by default unless the generated application explicitly requests agents.

## Dependency Rules
- Shared packages may depend on `@purista/core`.
- Transport packages should not depend on `@purista/ai`.
- AI depends on core and harness, not the other way around.
- CLI may generate source that imports `@purista/ai`, but CLI package/runtime code must not require AI to run.
