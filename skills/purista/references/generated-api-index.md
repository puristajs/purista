# Generated Agent API Reference

<!-- Generated from the published API catalog; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

This reference covers every published `@purista/*` package and provides TypeDoc-verified examples for the primary application APIs. Use it to select a package and confirm an API pattern rather than guessing. The complete generated public-export inventory is in `generated-api-manifest.json`; it is loaded only when a primary entry does not answer the question. Follow the other skill references for ownership and distributed-system decisions.

## Contents

- [Package selection](#package-selection)
- [Core import boundaries](#core-import-boundaries)
- [Detailed primary APIs](#detailed-primary-apis)
- [Framework and scaffolding](#framework-and-scaffolding)
- [HTTP projection](#http-projection)
- [Event bridges](#event-bridges)
- [Queue and scheduling adapters](#queue-and-scheduling-adapters)
- [Config stores](#config-stores)
- [State stores](#state-stores)
- [Secret stores](#secret-stores)
- [Platform helpers](#platform-helpers)
- [Use this reference safely](#use-this-reference-safely)

## Core Import Boundaries

- `@purista/core`: Application builders, runtime composition, contracts, schemas, and static architecture exports. Key APIs: `ServiceBuilder`, `SchedulerBuilder`, `SchedulerRuntime`.
- `@purista/core/testing`: Test harnesses, context mocks, message mocks, and safeBind. Never use in production wiring. Key APIs: `createCommandTestHarness`, `createSubscriptionContextMock`, `safeBind`.
- `@purista/core/client`: Outbound HttpClient and generated-client ClientBuilder utilities. Key APIs: `ClientBuilder`, `HttpClient`.
- `@purista/core/adapter`: Framework adapter authors extending bridges, stores, transports, or low-level contracts; not ordinary application handlers. Key APIs: `EventBridgeBaseClass`, `ConfigStoreBaseClass`, `StateStoreBaseClass`.

## Package selection

| Package | Use when | Primary validated API |
| --- | --- | --- |
| `@purista/core` | Declaring service-owned contracts, runtime wiring, queues, agents, schedules, and static architecture exports. | `ServiceBuilder`, `CommandDefinitionBuilder`, `SubscriptionDefinitionBuilder`, `StreamDefinitionBuilder`, `QueueDefinitionBuilder`, `QueueWorkerBuilder`, `AgentQueueBuilder`, `SchedulerBuilder`, `SchedulerRuntime`, `DefaultSchedulerProvider`, `createArchitectureManifest`, `validateArchitectureManifest`, `exportServiceDefinitions`, `exportScheduleManifest` |
| `@purista/cli` | Initializing or scaffolding a PURISTA application; application agents use the generated project-local CLI, while package authors use this API only to extend CLI tooling. | `createPuristaCliEngine`, `runPuristaCommand` |
| `@purista/hono-http-server` | Projecting builder-declared commands, streams, and async queue responses through Hono and OpenAPI. | `honoV1Service` |
| `@purista/amqpbridge` | Connecting commands, events, subscriptions, and streams through an AMQP broker. | `AmqpBridge` |
| `@purista/mqttbridge` | Connecting commands, events, subscriptions, and streams through MQTT topics. | `MqttBridge` |
| `@purista/natsbridge` | Connecting commands, events, subscriptions, and streams through NATS. | `NatsBridge` |
| `@purista/dapr-sdk` | Running PURISTA through Dapr building blocks for event transport, state, config, secrets, or service invocation. | `DaprEventBridge`, `DaprConfigStore`, `DaprSecretStore`, `DaprStateStore` |
| `@purista/base-http-bridge` | Building or operating an HTTP EventBridge adapter; application HTTP APIs should use @purista/hono-http-server instead. | `HttpEventBridge` |
| `@purista/nats-queue-bridge` | Running durable queue work on NATS JetStream, including strict idempotency when declared. | `NatsQueueBridge` |
| `@purista/redis-queue-bridge` | Running durable queue work on Redis with strict idempotency when declared. | `RedisQueueBridge` |
| `@purista/redis-scheduler-provider` | Running replicated SchedulerRuntime hosts with Redis-backed distributed occurrence claims; not for business work. | `RedisSchedulerProvider` |
| `@purista/aws-config-store` | Supplying service configuration from AWS Systems Manager Parameter Store. | `AWSConfigStore` |
| `@purista/nats-config-store` | Supplying service configuration from NATS-backed storage. | `NatsConfigStore` |
| `@purista/redis-config-store` | Supplying service configuration from Redis-backed storage. | `RedisConfigStore` |
| `@purista/nats-state-store` | Persisting service state in NATS-backed storage when its declared capabilities meet the requirement. | `NatsStateStore` |
| `@purista/redis-state-store` | Persisting service state in Redis when its declared capabilities meet the requirement. | `RedisStateStore` |
| `@purista/aws-secret-store` | Resolving secrets through AWS Secrets Manager. | `AWSSecretStore` |
| `@purista/azure-secret-store` | Resolving secrets through Azure Key Vault. | `AzureSecretStore` |
| `@purista/gcloud-secret-store` | Resolving secrets through Google Cloud Secret Manager. | `GoogleSecretStore` |
| `@purista/infisical-secret-store` | Resolving secrets through Infisical; use InfisicalClient only when building a custom Infisical integration. | `InfisicalClient`, `InfisicalSecretStore` |
| `@purista/vault-secret-store` | Resolving secrets through HashiCorp Vault. | `VaultSecretStore` |
| `@purista/k8s-sdk` | Integrating builder-declared services with Kubernetes HTTP/server helpers. | `addServiceEndpoints`, `getHttpServer` |

## Framework and scaffolding

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/core` | `ServiceBuilder` | class | Declares one versioned PURISTA business capability. |
| `@purista/core` | `CommandDefinitionBuilder` | class | Declares a typed request/response operation owned by one service. |
| `@purista/core` | `SubscriptionDefinitionBuilder` | class | Declares a bounded, typed reaction to a business event. |
| `@purista/core` | `StreamDefinitionBuilder` | class | Builds a stream definition for incremental output or aggregate stream results. |
| `@purista/core` | `QueueDefinitionBuilder` | class | Builds a durable queue contract for background work. |
| `@purista/core` | `QueueWorkerBuilder` | class | Builds a queue worker definition for one queue. |
| `@purista/core` | `AgentQueueBuilder` | class | Builds an attached PURISTA agent from normal core queue, worker, command, stream definitions, and a provider-neutral agent manifest. |
| `@purista/core` | `SchedulerBuilder` | class | Builder for a standalone Core Scheduler Runtime host. |
| `@purista/core` | `SchedulerRuntime` | class | Core-owned scheduler loop that publishes regular PURISTA custom events. |
| `@purista/core` | `DefaultSchedulerProvider` | class | Process-local SchedulerProvider for development and deterministic tests. |
| `@purista/core` | `createArchitectureManifest` | function | Create a sorted, JSON-safe static architecture manifest from resolved service definitions. |
| `@purista/core` | `validateArchitectureManifest` | function | Validate static architecture references without contacting runtime infrastructure. |
| `@purista/core` | `exportServiceDefinitions` | function | Resolve service builders into the JSON-safe definition inventory used by architecture inspection and interoperability exports. |
| `@purista/core` | `exportScheduleManifest` | function | Export provider-neutral schedule metadata from service definitions. |
| `@purista/cli` | `createPuristaCliEngine` | function | Create a programmatic CLI engine bound to a working directory and prompt adapter. |
| `@purista/cli` | `runPuristaCommand` | function | Resolve and execute a CLI command in one call. |

## HTTP projection

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/hono-http-server` | `honoV1Service` | variable | Built-in Hono HTTP service definition. |

## Event bridges

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/amqpbridge` | `AmqpBridge` | class | EventBridge implementation for AMQP brokers such as RabbitMQ. |
| `@purista/mqttbridge` | `MqttBridge` | class | EventBridge implementation for MQTT 5 brokers. |
| `@purista/natsbridge` | `NatsBridge` | class | EventBridge implementation for NATS core messaging with optional JetStream. |
| `@purista/dapr-sdk` | `DaprEventBridge` | class | Event bridge that connects PURISTA services to the local Dapr sidecar. |
| `@purista/dapr-sdk` | `DaprConfigStore` | class | Config store adapter backed by Dapr configuration components. |
| `@purista/dapr-sdk` | `DaprSecretStore` | class | Secret store adapter backed by a Dapr secret component. |
| `@purista/dapr-sdk` | `DaprStateStore` | class | State store adapter backed by a Dapr state component. |
| `@purista/base-http-bridge` | `HttpEventBridge` | class | Generic HTTP-based event bridge for runtimes that deliver PURISTA messages over HTTP. |

## Queue and scheduling adapters

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/nats-queue-bridge` | `NatsQueueBridge` | class | Strict QueueBridge implementation backed by NATS JetStream streams and KV. |
| `@purista/redis-queue-bridge` | `RedisQueueBridge` | class | Strict QueueBridge implementation backed by Redis data structures. |
| `@purista/redis-scheduler-provider` | `RedisSchedulerProvider` | class | Redis-backed distributed occurrence provider for standalone Scheduler hosts. |

## Config stores

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/aws-config-store` | `AWSConfigStore` | class | Config store backed by AWS Systems Manager Parameter Store. |
| `@purista/nats-config-store` | `NatsConfigStore` | class | Config store backed by a NATS JetStream key-value bucket. |
| `@purista/redis-config-store` | `RedisConfigStore` | class | Config store backed by Redis string keys. |

## State stores

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/nats-state-store` | `NatsStateStore` | class | State store backed by a NATS JetStream key-value bucket. |
| `@purista/redis-state-store` | `RedisStateStore` | class | State store backed by Redis string keys. |

## Secret stores

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/aws-secret-store` | `AWSSecretStore` | class | Secret store backed by AWS Secrets Manager. |
| `@purista/azure-secret-store` | `AzureSecretStore` | class | Secret store backed by Azure Key Vault. |
| `@purista/gcloud-secret-store` | `GoogleSecretStore` | class | Secret store backed by Google Secret Manager. |
| `@purista/infisical-secret-store` | `InfisicalClient` | class | HTTP client for the Infisical API used by `InfisicalSecretStore`. |
| `@purista/infisical-secret-store` | `InfisicalSecretStore` | class | Secret store backed by Infisical. |
| `@purista/vault-secret-store` | `VaultSecretStore` | class | Secret store backed by HashiCorp Vault KV v2. |

## Platform helpers

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/k8s-sdk` | `addServiceEndpoints` | function | Adds HTTP endpoints for all commands that expose HTTP metadata. |
| `@purista/k8s-sdk` | `getHttpServer` | function | Create a Hono based web server. |

## Detailed primary APIs

Read only the package file relevant to the current task. These files contain TypeDoc-derived public method names and verified examples; the index deliberately stays compact.

- [`@purista/core`](api/core.md) — Declaring service-owned contracts, runtime wiring, queues, agents, schedules, and static architecture exports.
- [`@purista/cli`](api/cli.md) — Initializing or scaffolding a PURISTA application; application agents use the generated project-local CLI, while package authors use this API only to extend CLI tooling.
- [`@purista/hono-http-server`](api/hono-http-server.md) — Projecting builder-declared commands, streams, and async queue responses through Hono and OpenAPI.
- [`@purista/amqpbridge`](api/amqpbridge.md) — Connecting commands, events, subscriptions, and streams through an AMQP broker.
- [`@purista/mqttbridge`](api/mqttbridge.md) — Connecting commands, events, subscriptions, and streams through MQTT topics.
- [`@purista/natsbridge`](api/natsbridge.md) — Connecting commands, events, subscriptions, and streams through NATS.
- [`@purista/dapr-sdk`](api/dapr-sdk.md) — Running PURISTA through Dapr building blocks for event transport, state, config, secrets, or service invocation.
- [`@purista/base-http-bridge`](api/base-http-bridge.md) — Building or operating an HTTP EventBridge adapter; application HTTP APIs should use @purista/hono-http-server instead.
- [`@purista/nats-queue-bridge`](api/nats-queue-bridge.md) — Running durable queue work on NATS JetStream, including strict idempotency when declared.
- [`@purista/redis-queue-bridge`](api/redis-queue-bridge.md) — Running durable queue work on Redis with strict idempotency when declared.
- [`@purista/redis-scheduler-provider`](api/redis-scheduler-provider.md) — Running replicated SchedulerRuntime hosts with Redis-backed distributed occurrence claims; not for business work.
- [`@purista/aws-config-store`](api/aws-config-store.md) — Supplying service configuration from AWS Systems Manager Parameter Store.
- [`@purista/nats-config-store`](api/nats-config-store.md) — Supplying service configuration from NATS-backed storage.
- [`@purista/redis-config-store`](api/redis-config-store.md) — Supplying service configuration from Redis-backed storage.
- [`@purista/nats-state-store`](api/nats-state-store.md) — Persisting service state in NATS-backed storage when its declared capabilities meet the requirement.
- [`@purista/redis-state-store`](api/redis-state-store.md) — Persisting service state in Redis when its declared capabilities meet the requirement.
- [`@purista/aws-secret-store`](api/aws-secret-store.md) — Resolving secrets through AWS Secrets Manager.
- [`@purista/azure-secret-store`](api/azure-secret-store.md) — Resolving secrets through Azure Key Vault.
- [`@purista/gcloud-secret-store`](api/gcloud-secret-store.md) — Resolving secrets through Google Cloud Secret Manager.
- [`@purista/infisical-secret-store`](api/infisical-secret-store.md) — Resolving secrets through Infisical; use InfisicalClient only when building a custom Infisical integration.
- [`@purista/vault-secret-store`](api/vault-secret-store.md) — Resolving secrets through HashiCorp Vault.
- [`@purista/k8s-sdk`](api/k8s-sdk.md) — Integrating builder-declared services with Kubernetes HTTP/server helpers.

## Use this reference safely

- Prefer the package and API listed here over a guessed package name or a deep import.
- Application code normally imports from a package root. Low-level bridge or adapter construction is for package authors unless the public handbook explicitly directs it.
- A missing primary entry is a reason to inspect `generated-api-manifest.json`, then the public PURISTA handbook or API docs—never to invent a replacement API.
