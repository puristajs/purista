---
title: Packages and feature availability
description: Identify what runs with core defaults and which optional package and external dependency enable each infrastructure capability.
order: 1230
---

`@purista/core` provides the Framework primitives and default local implementations. Production infrastructure adapters are optional packages: installing one makes its adapter code available, but does not provision its broker/store, configure credentials, or wire it into the runtime.

| Capability | Default | Optional packages |
| --- | --- | --- |
| Services, commands, subscriptions, streams, queues/workers | `@purista/core` | — |
| HTTP server | Application-owned adapter | `@purista/hono-http-server` |
| HTTP bridge base contracts | No HTTP bridge implementation is installed | `@purista/base-http-bridge` only when implementing an application-owned HTTP bridge |
| Event delivery | Default EventBridge | `@purista/amqpbridge`, `@purista/natsbridge`, `@purista/mqttbridge`, `@purista/dapr-sdk` |
| Queue delivery | Default QueueBridge | `@purista/redis-queue-bridge`, `@purista/nats-queue-bridge` |
| Configuration store | Default config store | `@purista/redis-config-store`, `@purista/aws-config-store`, `@purista/nats-config-store`, `@purista/dapr-sdk` |
| Secret store | Default secret store | `@purista/aws-secret-store`, `@purista/azure-secret-store`, `@purista/gcloud-secret-store`, `@purista/vault-secret-store`, `@purista/infisical-secret-store`, `@purista/dapr-sdk` |
| State store | Default state store | `@purista/redis-state-store`, `@purista/nats-state-store`, `@purista/dapr-sdk` |
| Kubernetes integration | Application-owned deployment | `@purista/k8s-sdk` |
| AI-powered services | Core includes the provider-neutral Harness runtime dependency | A model/provider adapter, such as `@purista/harness-openai`, plus provider credentials and runtime wiring |

Install an optional adapter in the application that composes it, then follow its dedicated page for external prerequisites and runtime wiring. Do not add every optional dependency to every service: it increases deployment and security scope without enabling a feature by itself.

`@purista/harness` is a dependency of `@purista/core`; application code does
not need to add it merely to define an attached agent. It **does** need the
selected provider/adapter package and its credentials before an agent can make
a real model call. See [Build AI-powered services](/handbook/framework/build-ai-powered-services/)
for the complete enablement and deterministic-testing path.

## Export declared contracts for review

The project-local CLI can export definitions that have already been written by the application. Use these build artifacts for integration review; they do not create a broker, HTTP server, or scheduler.

```bash title="Export AsyncAPI from generated definitions"
npm exec purista export asyncapi \
  --definitions purista.definitions.json \
  --out asyncapi.json
```

The same command family exports `cloudevents-schema`, `runtime-capabilities`, `schedule-manifest`, and `kubernetes-cronjob`. Regenerate an export after changing the corresponding contract and review it in CI. A runtime-capability export describes the configured runtime mode; it is not a blanket production guarantee.

| Need | Guide |
| --- | --- |
| Choose event/queue transport | [Distributed infrastructure](/handbook/framework/connect-distributed-infrastructure/) |
| Choose configuration, secret, or state store | [Application configuration](/handbook/framework/configure-applications/) and [state](/handbook/framework/persist-application-state/) |
| Enable the Hono server | [Hono guide](/handbook/framework/expose-and-consume-services/http-and-rest/hono/) |
| Enable AI models/providers | [Build AI-powered services](/handbook/framework/build-ai-powered-services/) |
