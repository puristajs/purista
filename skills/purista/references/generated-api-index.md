# Generated Agent API Reference

<!-- Generated from the published API catalog; do not edit manually. -->
<!-- typedoc-digest: 416ce2d9d8b6a834 -->

This reference covers every published `@purista/*` package. Use it in an installed skill to select the package and primary API for an application. It intentionally omits framework implementation paths, internal helpers, and release tooling. Follow the other skill references for ownership and distributed-system decisions.

## Contents

- [Package selection](#package-selection)
- [Framework and scaffolding](#framework-and-scaffolding)
- [HTTP projection](#http-projection)
- [Event bridges](#event-bridges)
- [Queue and scheduling adapters](#queue-and-scheduling-adapters)
- [Config stores](#config-stores)
- [State stores](#state-stores)
- [Secret stores](#secret-stores)
- [Platform helpers](#platform-helpers)
- [Use this reference safely](#use-this-reference-safely)

## Package selection

| Package | Use when | Primary validated API |
| --- | --- | --- |
| `@purista/core` | Declaring service-owned contracts, runtime wiring, queues, agents, schedules, static architecture exports, and testing helpers. | `ServiceBuilder`, `CommandDefinitionBuilder`, `SubscriptionDefinitionBuilder`, `StreamDefinitionBuilder`, `QueueDefinitionBuilder`, `QueueWorkerBuilder`, `AgentQueueBuilder`, `SchedulerBuilder`, `SchedulerRuntime`, `DefaultSchedulerProvider`, `createArchitectureManifest`, `validateArchitectureManifest`, `exportServiceDefinitions`, `exportScheduleManifest`, `ServiceObservabilityContext` |
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
| `@purista/core` | `ServiceBuilder` | class | Declares one versioned PURISTA business capability. Start here after the owning domain, invariants, and boundary contracts are clear. Add commands, subscriptions, streams, queues, schedules, and agents to this builder; provide bridges, stores, resources, telemetry, and optional AI runtime bindings only when calling `getInstance(...)` in application bootstrap code. |
| `@purista/core` | `CommandDefinitionBuilder` | class | Declares a typed request/response operation owned by one service. Use a command when the caller needs an immediate validated result. Keep the business handler behind declared schemas, guards, and capabilities; expose HTTP from this definition only after the command contract is complete. |
| `@purista/core` | `SubscriptionDefinitionBuilder` | class | Declares a bounded, typed reaction to a business event. Use a subscription for decoupled event handling that can finish promptly and be idempotent. For slow, retry-heavy, or operator-replayable work, let this subscription enqueue a queue job instead of performing the work directly. |
| `@purista/core` | `StreamDefinitionBuilder` | class | Builds a stream definition for incremental output or aggregate stream results. Streams can emit typed chunks, optionally aggregate chunks into a final payload, expose server-sent HTTP streams, invoke commands, consume other streams, enqueue queues, and emit custom events. |
| `@purista/core` | `QueueDefinitionBuilder` | class | Builds a durable queue contract for background work. Queue definitions describe schemas, retry/lease behavior, result side effects, worker bindings, and optional schedules. Runtime queue semantics are provided by the configured queue bridge. |
| `@purista/core` | `QueueWorkerBuilder` | class | Builds a queue worker definition for one queue. A worker owns execution behavior for queued jobs. The queue definition owns durability and lifecycle policy; this builder owns handler concurrency, worker mode, and guard hooks. |
| `@purista/core` | `AgentQueueBuilder` | class | Builds an attached PURISTA agent from normal core queue, worker, command, stream definitions, and a provider-neutral agent manifest. |
| `@purista/core` | `SchedulerBuilder` | class | Builder for a standalone Core Scheduler Runtime host. It consumes manifest declarations and infrastructure bindings only; it does not instantiate application ServiceBuilder instances or business handlers. |
| `@purista/core` | `SchedulerRuntime` | class | Core-owned scheduler loop that publishes regular PURISTA custom events. This runtime never loads business services or handlers. It can be hosted in a small standalone process with an EventBridge and a SchedulerProvider. Prefer `SchedulerBuilder` for application code so required scheduler bindings are explicit and validated before the runtime starts. |
| `@purista/core` | `DefaultSchedulerProvider` | class | Process-local SchedulerProvider for development and deterministic tests. State is lost on restart and claims are not shared with other processes. Do not use this provider to claim distributed or durable scheduling guarantees. |
| `@purista/core` | `createArchitectureManifest` | function | Create a sorted, JSON-safe static architecture manifest from resolved service definitions. It deliberately omits handlers, stores, bridge instances, provider hints, secrets, prompts, and other runtime objects. |
| `@purista/core` | `validateArchitectureManifest` | function | Validate static architecture references without contacting runtime infrastructure. Strict mode promotes warnings to errors. |
| `@purista/core` | `exportServiceDefinitions` | function | Resolve service builders into the JSON-safe definition inventory used by architecture inspection and interoperability exports. Keep this in an application composition module that imports builders only; it must not instantiate service runtime dependencies or handlers. |
| `@purista/core` | `exportScheduleManifest` | function | Export provider-neutral schedule metadata from service definitions. |
| `@purista/core` | `ServiceObservabilityContext` | type | Immutable observability values resolved for one service instance. `ServiceBuilder.getInstance(...)` creates this context once, then adapters may inherit values only before they start. `sources` records whether each effective value came from an explicit component setting, service wiring, or a safe framework default. It never contains telemetry payloads, exporters, credentials, prompts, or runtime provider instances. |
| `@purista/cli` | `createPuristaCliEngine` | function | Create a programmatic CLI engine bound to a working directory and prompt adapter. |
| `@purista/cli` | `runPuristaCommand` | function | Resolve and execute a CLI command in one call. |

## HTTP projection

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/hono-http-server` | `honoV1Service` | variable | Built-in Hono HTTP service definition. Create an instance with `honoV1Service.getInstance(eventBridge, ...)`, then register PURISTA services before starting and passing `honoService.app.fetch` to a Hono runtime adapter. |

## Event bridges

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/amqpbridge` | `AmqpBridge` | class | EventBridge implementation for AMQP brokers such as RabbitMQ. The bridge uses a headers exchange, confirm channels, durable queues when requested by command/subscription definitions, and a private reply queue for command responses. In strict capability terms it supports durable command and subscription consumers, broker-confirmed command publishing, bounded subscription retry, and dead-letter routing when configured. It does not support event streams. Payloads are encoded and encrypted through configured content-type and content-encoding handlers. The default `plainEncrypter` is a no-op; avoid publishing secrets or unnecessary personal data unless a real encryption handler and broker controls are in place. |
| `@purista/mqttbridge` | `MqttBridge` | class | EventBridge implementation for MQTT 5 brokers. The broker must support MQTT protocol version 5 because the bridge uses user properties, subscription identifiers, message expiry, and correlation data. Delivery follows MQTT QoS semantics and is best-effort for PURISTA capabilities: commands and subscriptions are not durable, there is no broker-managed retry or dead-letter handling, and subscription control signals are logged but cannot be enforced by the bridge. Payloads are JSON strings. Keep messages minimal and avoid secrets or unnecessary personal data unless the broker connection and persistence are protected outside the bridge. |
| `@purista/natsbridge` | `NatsBridge` | class | EventBridge implementation for NATS core messaging with optional JetStream. Core NATS is used for low-latency request/reply and event publication. JetStream is required for durable command/subscription registrations, manual acknowledgements, bounded subscription retry, delayed retry, pause/resume, and bridge-managed dead-letter publishing. In strict mode, registrations that require those guarantees fail fast when JetStream is not available. In best-effort mode, the bridge warns and falls back to core NATS semantics. Payloads are serialized with NATS `JSONCodec`; headers carry metadata and OpenTelemetry context where supported. Avoid publishing secrets or unnecessary personal data unless broker storage, transport, and backups are protected for that data. |
| `@purista/dapr-sdk` | `DaprEventBridge` | class | Event bridge that connects PURISTA services to the local Dapr sidecar. It hosts the HTTP endpoints Dapr calls for command invocation and Pub/Sub subscription delivery, publishes events through the Dapr Pub/Sub API, and invokes commands in other services through Dapr service invocation. Names for services, commands, subscriptions and events are converted to kebab-case. If the event bridge is configured to expose REST endpoints defined in command builder, the endpoints are generated as defined in the command builder. The event bridge uses Hono under the hood. You need to provide a `serve` function. Depending on your runtime (Node, Bun, Deno) an adapter might be needed. The Dapr sidecar must be running and reachable through `DAPR_HOST` and `DAPR_HTTP_PORT` or the matching `clientConfig` values. |
| `@purista/dapr-sdk` | `DaprConfigStore` | class | Config store adapter backed by Dapr configuration components. Reads values through the local Dapr sidecar. Dapr's configuration API is read here; mutation methods throw `NotImplemented`. |
| `@purista/dapr-sdk` | `DaprSecretStore` | class | Secret store adapter backed by a Dapr secret component. The adapter fetches secrets through the local sidecar. Creating, changing and removing secrets is not supported by this implementation. |
| `@purista/dapr-sdk` | `DaprStateStore` | class | State store adapter backed by a Dapr state component. Reads, writes and removes JSON state values through the local Dapr sidecar. A finite retention policy is available only when `supportsTtl: true` and the configured Dapr component honours `ttlInSeconds` metadata. |
| `@purista/base-http-bridge` | `HttpEventBridge` | class | Generic HTTP-based event bridge for runtimes that deliver PURISTA messages over HTTP. In environments like Dapr or Knative, communication is commonly handled by sidecar containers or platform routers. This bridge exposes internal POST endpoints for commands and subscriptions, optionally exposes command REST projections, and uses the configured HttpEventBridgeClient for calls back to the sidecar or platform HTTP API. In these cases, it is expected, that the current instance is a HTTP server, which provides REST endpoints for commands and subscriptions. The communication from the current instance to the sidecar is also done via REST endpoints. HTTP calls from the sidecar to the current instance might be done via CloudEvent schema, which wraps the payload into a defined structure. The HttpEventBridge can be configured to respect this, and to extract the information from CloudEvents. To use the HttpEventBridge, you will need following peer-dependencies installed: - hono - trouter |

## Queue and scheduling adapters

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/nats-queue-bridge` | `NatsQueueBridge` | class | Strict QueueBridge implementation backed by NATS JetStream streams and KV. The bridge requires JetStream at startup and exposes strict queue capabilities: delayed delivery, FIFO delivery per queue subject, inspectable dead-letter streams, lease inspection, and idempotent enqueue. It does not claim exactly-once execution; workers must keep side effects idempotent because leased jobs can be retried after failures or lease expiry. Payloads are persisted through NATS `JSONCodec`. Do not enqueue secrets, tokens, or unnecessary personal data unless your broker storage and backups are protected appropriately. |
| `@purista/redis-queue-bridge` | `RedisQueueBridge` | class | Strict QueueBridge implementation backed by Redis data structures. The bridge uses Redis lists for pending/processing jobs, sorted sets for scheduled delivery and lease expiry, hashes for message and lease metadata, and a Redis list for dead-letter entries. It supports delayed delivery, FIFO leasing, inspectable dead letters, lease inspection, and idempotent enqueue. It does not provide exactly-once execution; workers must make side effects idempotent because jobs can be retried after failures or recovered from expired leases. Messages are stored as JSON in Redis. Do not place secrets, tokens, or unnecessary personal data in queue payloads unless your Redis deployment and persistence are protected for that data. |
| `@purista/redis-scheduler-provider` | `RedisSchedulerProvider` | class | Redis-backed distributed occurrence provider for standalone Scheduler hosts. The provider stores the most recently completed UTC timestamp per schedule and gives active publishers a token-checked Redis lease. This keeps durable state bounded by the number of schedules, prevents concurrent publication by replicas, and supports failover after lease expiry. It provides at-least-once trigger delivery only: a process crash between EventBridge publication and durable completion may produce a duplicate trigger after the lease expires. |

## Config stores

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/aws-config-store` | `AWSConfigStore` | class | Config store backed by AWS Systems Manager Parameter Store. Values are read and written as string parameters. The inherited store cache is enabled by default to reduce AWS calls; set `enableCache` to `false` to always read from SSM, or set `cacheTtl` in milliseconds to limit how long cached entries are reused. Expired cache entries are refreshed on the next read. Use tenant-aware and environment-aware parameter names, for example `/tenants/acme/prod/payments/public-api-url`. Do not store secrets here; use a secret store for passwords, tokens, and credentials. AWS credentials and region are resolved by the AWS SDK from `client` options, environment variables, shared config files, or the runtime role. |
| `@purista/nats-config-store` | `NatsConfigStore` | class | Config store backed by a NATS JetStream key-value bucket. JetStream must be enabled on the NATS server. Values are encoded with the NATS `JSONCodec`, so stored values must be JSON-compatible. This store keeps only the NATS connection and KV bucket handle in memory; values are read from the bucket for each operation. The default bucket is `purista-config-store`. Use tenant-aware keys such as `tenant.acme.prod.payments.public-api-url`, and configure NATS credentials via connection options or your runtime environment. |
| `@purista/redis-config-store` | `RedisConfigStore` | class | Config store backed by Redis string keys. Config values are serialized with `JSON.stringify` before writing and parsed with `JSON.parse` on read. This store does not add a local in-memory cache; Redis is the source of truth for each operation. Use tenant-aware key prefixes to avoid collisions, for example `tenant:acme:prod:payments:public-api-url`. Keep secrets out of config values and use TLS/authenticated Redis endpoints in shared environments. The Redis connection is opened lazily on the first operation and closed by `destroy()`. |

## State stores

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/nats-state-store` | `NatsStateStore` | class | State store backed by a NATS JetStream key-value bucket. JetStream must be enabled on the NATS server. Values are encoded with the NATS `JSONCodec`, so stored values must be JSON-compatible. This store keeps only the NATS connection and KV bucket handle in memory; values are read from the bucket for each operation. NATS KV bucket max age is not a per-key sliding expiry guarantee, so this adapter rejects finite StateStore retention policies. The default bucket is `purista-state-store`. Use tenant-aware keys such as `tenant.acme.prod.cart.session-123`. State can contain sensitive data, so keep payloads minimal and configure NATS authentication/TLS in shared environments. |
| `@purista/redis-state-store` | `RedisStateStore` | class | State store backed by Redis string keys. State values are serialized with `JSON.stringify` before writing and parsed with `JSON.parse` on read. This store does not add a local in-memory cache; Redis is the source of truth for each operation. Use tenant-aware key prefixes to avoid collisions, for example `tenant:acme:prod:cart:session-123`. State can contain sensitive data, so use data minimization, short retention where possible, and TLS/authenticated Redis endpoints in shared environments. The Redis connection is opened lazily on the first operation and closed by `destroy()`. |

## Secret stores

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/aws-secret-store` | `AWSSecretStore` | class | Secret store backed by AWS Secrets Manager. Secret values are cached in memory after the first read to reduce network calls and AWS charges. Set `enableCache` to `false` for every read to hit AWS, or set `cacheTtl` in milliseconds to bound cache reuse. Expired cache entries are refreshed on the next read. Use stable, tenant-aware names such as `tenants/acme/prod/payments/stripe-api-key`. Never log values returned by this store and avoid putting real secrets in examples, tests, or traces. AWS credentials and region are resolved by the AWS SDK from `client` options, environment variables, shared config files, or the runtime role. |
| `@purista/azure-secret-store` | `AzureSecretStore` | class | Secret store backed by Azure Key Vault. Secret values are cached in memory after the first read to reduce Key Vault calls. Set `enableCache` to `false` to always read from Azure, or set `cacheTtl` in milliseconds to bound cache reuse. Expired entries are refreshed on the next read. The store uses `DefaultAzureCredential`, so credentials should come from managed identity, workload identity, Azure CLI login, or environment variables supported by `@azure/identity`. Use Key Vault-compatible names that encode tenant and environment, for example `acme-prod-payments-api-token`. Never log returned secret values. |
| `@purista/gcloud-secret-store` | `GoogleSecretStore` | class | Secret store backed by Google Secret Manager. Secret values are cached in memory after the first read to reduce Google Cloud API calls. Set `enableCache` to `false` to always read from Google Secret Manager, or set `cacheTtl` in milliseconds to bound cache reuse. Expired entries are refreshed on the next read. Credentials are resolved by the Google Cloud client from `client` options, Application Default Credentials, workload identity, or the runtime service account. Do not embed service account keys in source code. Use Google Secret Manager-compatible secret ids that encode tenant and environment, for example `acme-prod-payments-api-token`. Never log returned secret values. |
| `@purista/infisical-secret-store` | `InfisicalClient` | class | HTTP client for the Infisical API used by `InfisicalSecretStore`. The client derives the project encryption key from the configured service token and decrypts secret values before returning them. Treat the bearer token, token data, project key, encrypted payloads, and decrypted values as secrets. Most applications should use `InfisicalSecretStore` instead of this lower-level client so PURISTA store permissions and caching are applied consistently. |
| `@purista/infisical-secret-store` | `InfisicalSecretStore` | class | Secret store backed by Infisical. Secret values are cached in memory after the first read to reduce Infisical API calls. Set `enableCache` to `false` to always read from Infisical, or set `cacheTtl` in milliseconds to bound cache reuse. Expired entries are refreshed on the next read. The underlying client uses an Infisical service token. Keep the bearer token in runtime secret management and never log token data, project keys, or secret values. Secret names should match your Infisical path strategy and include tenant/environment context when a project is shared, for example `ACME_PROD_PAYMENTS_API_TOKEN`. |
| `@purista/vault-secret-store` | `VaultSecretStore` | class | Secret store backed by HashiCorp Vault KV v2. Secret values are cached in memory after the first read. Set `enableCache` to `false` to always read from Vault, or set `cacheTtl` in milliseconds to bound cache reuse. Expired entries are refreshed on the next read. Values are written under `{mount}/data/{secretName}` using the field name `value`, and removals delete `{mount}/metadata/{secretName}`. Use tenant-aware names such as `tenants/acme/prod/payments/api-token`. Never log returned secret values or Vault tokens. |

## Platform helpers

| Package | API | Kind | Purpose |
| --- | --- | --- | --- |
| `@purista/k8s-sdk` | `addServiceEndpoints` | function | Adds HTTP endpoints for all commands that expose HTTP metadata. This helper registers the routes on the provided Hono application and connects them with the corresponding service commands. It exposes commands only; streams, queues and agents must be surfaced through their own declared command/stream contracts. |
| `@purista/k8s-sdk` | `getHttpServer` | function | Create a Hono based web server. The server exposes a `/healthz` endpoint and, if configured, adds all HTTP enabled command routes from the given services. It does not start a listener; use the returned app with the Hono adapter appropriate for the container. The returned `Hono` instance is not started automatically. |

## Use this reference safely

- Prefer the package and API listed here over a guessed package name or a deep import.
- Application code normally imports from a package root. Low-level bridge or adapter construction is for package authors unless the public handbook explicitly directs it.
- A missing entry is a reason to consult the public PURISTA handbook or package API docs, never to invent a replacement API.
