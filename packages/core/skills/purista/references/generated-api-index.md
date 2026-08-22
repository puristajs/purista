# Generated Agent API Reference

<!-- Generated from the published API catalog; do not edit manually. -->
<!-- typedoc-digest: d1739221189c7d32 -->

This reference covers every published `@purista/*` package. Use it in an installed skill to select the package and primary API for an application. It intentionally omits framework implementation paths, internal helpers, and release tooling. Follow the other skill references for ownership and distributed-system decisions.

## Contents

- [Package selection](#package-selection)
- [Core import boundaries](#core-import-boundaries)
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
| `@purista/core` | Declaring service-owned contracts, runtime wiring, queues, agents, schedules, and static architecture exports. | `ServiceBuilder`, `CommandDefinitionBuilder`, `SubscriptionDefinitionBuilder`, `StreamDefinitionBuilder`, `QueueDefinitionBuilder`, `QueueWorkerBuilder`, `AgentQueueBuilder`, `SchedulerBuilder`, `SchedulerRuntime`, `DefaultSchedulerProvider`, `createArchitectureManifest`, `validateArchitectureManifest`, `exportServiceDefinitions`, `exportScheduleManifest`, `ServiceObservabilityContext` |
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
| `@purista/core` | `ServiceObservabilityContext` | type | Immutable observability values resolved for one service instance. |
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

## Use this reference safely

- Prefer the package and API listed here over a guessed package name or a deep import.
- Application code normally imports from a package root. Low-level bridge or adapter construction is for package authors unless the public handbook explicitly directs it.
- A missing entry is a reason to consult the public PURISTA handbook or package API docs, never to invent a replacement API.
