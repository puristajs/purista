---
title: PURISTA Handbook
description: Learn how to build message-driven, business-aligned TypeScript systems with PURISTA — from first service to production deployment.
order: 0
---

# PURISTA Handbook

PURISTA is a TypeScript framework for building message-driven systems where **services reflect business capabilities**, not technical layers. Define what your business does. Let the framework handle how.

This handbook is a practical learning path. Each section builds on the last, taking you from a blank project to a production-ready system.

```mermaid
flowchart LR
    subgraph A[""]
        direction TB
        q1[Quickstart]
        q2[Concept]
        q3[Principles]
    end
    subgraph B[""]
        direction TB
        b1[Services]
        b2[Commands]
        b3[Subscriptions]
        b4[Streams]
        b5[Queues]
    end
    subgraph C[""]
        direction TB
        c1[Event Bridges]
        c2[Stores]
        c3[HTTP Server]
    end
    subgraph D[""]
        direction TB
        d1[OpenTelemetry]
    end
    subgraph E[""]
        direction TB
        e1[Deploy & Scale]
        e2[Integrations]
    end
    A --> B --> C --> D --> E
```

## Choose your path

Not everyone starts from the same place. Pick the path that matches your situation:

| If you are... | Start here | Then read |
|---|---|---|
| **New to PURISTA** | [Quickstart](./1_quickstart/index.md) | [Concept](./concept.md) → [Building Business Logic](./2_building_business-logic/index.md) |
| **Using an AI coding assistant** | [Quickstart](./1_quickstart/index.md) | [AI Skill](./install-ai-skill.md) for existing projects → [CLI](./cli.md) |
| **Evaluating the framework** | [Concept](./concept.md) | [Principles](./principles.md) → [From Zero to Production](./from-zero-to-production.md) |
| **Migrating an existing app** | [Service Builder](./2_building_business-logic/service/the-service-builder.md) | [Command Builder](./2_building_business-logic/command/the-command-builder.md) → [Event Bridges](./3_eco_system/eventbridges/index.md) |
| **Adding AI agents** | [AI Agents](./2_building_business-logic/ai/index.md) | [Queues](./2_building_business-logic/queue/index.md) → [Streams](./2_building_business-logic/stream/index.md) |
| **Going to production** | [From Zero to Production](./from-zero-to-production.md) | [Deploy & Scale](./5_deploy_and_scale/index.md) → [OpenTelemetry](./4_open_telemetry/index.md) |

---

## Handbook contents

### Getting started

| Page | What you'll learn |
|---|---|
| [Quickstart](./1_quickstart/index.md) | Scaffold a project and build your first service in 10 minutes |
| [Install the PURISTA AI Skill](./install-ai-skill.md) | Understand the generated skill links and install the skill for existing projects |
| [Setup the Project](./1_quickstart/setup-the-purista-project.md) | CLI options, project structure, and initial configuration |
| [Create a Service](./1_quickstart/create-a-service.md) | Generate a service with the CLI and understand the builder pattern |
| [Add a Command](./1_quickstart/add-the-first-command.md) | Define your first request/response operation |
| [Add a Subscription](./1_quickstart/add-the-first-subscription.md) | React to events from other services |

### Core concepts

| Page | What you'll learn |
|---|---|
| [Concept](./concept.md) | The mental model: messages, commands, subscriptions, services, and the event bridge |
| [Principles](./principles.md) | The 8 design principles that guide every PURISTA decision |
| [From Zero to Production](./from-zero-to-production.md) | A 4-phase roadmap from first service to production deployment |
| [CLI](./cli.md) | Scaffold projects, generate artifacts, and manage configuration |

### Building business logic

| Page | What you'll learn |
|---|---|
| [Overview](./2_building_business-logic/index.md) | The builder pattern and how services, commands, subscriptions, streams, and queues fit together |
| [Builders](./2_building_business-logic/builders.md) | Shared configuration and the builder pattern foundation |
| [Schemas & Validation](./2_building_business-logic/schemas.md) | Zod schemas for inputs, outputs, and OpenAPI generation |

#### Services

| Page | What you'll learn |
|---|---|
| [Service overview](./2_building_business-logic/service/index.md) | Service structure, metadata, and configuration |
| [Service Builder](./2_building_business-logic/service/the-service-builder.md) | Define service metadata, config, and resources |
| [Add Service Config](./2_building_business-logic/service/add-a-service-config.md) | Environment-specific configuration values |
| [Define Resources](./2_building_business-logic/service/define-resources.md) | Database clients, SDKs, and external API wrappers |
| [Custom Service Class](./2_building_business-logic/service/custom-service-class.md) | Extend the service class for advanced use cases |
| [Unit Test a Service](./2_building_business-logic/service/unit-test-a-service.md) | Test service configuration and custom classes |

#### Commands

| Page | What you'll learn |
|---|---|
| [Command overview](./2_building_business-logic/command/index.md) | Request/response operations and command patterns |
| [Command Builder](./2_building_business-logic/command/the-command-builder.md) | Define payloads, parameters, outputs, transforms, and hooks |
| [Invoke from Command](./2_building_business-logic/command/invoke_command_from_command.md) | Call commands across services |
| [Expose as HTTP Endpoint](./2_building_business-logic/command/exposing-a-command-as-http-endpoint.md) | REST and SSE exposure |
| [Test a Command](./2_building_business-logic/command/test-a-command.md) | Unit test commands with test harnesses |

#### Subscriptions

| Page | What you'll learn |
|---|---|
| [Subscription overview](./2_building_business-logic/subscription/index.md) | Event-driven reactions and subscription patterns |
| [Subscription Builder](./2_building_business-logic/subscription/the-subscription-builder.md) | Filters, schemas, and event handlers |
| [Unit Test a Subscription](./2_building_business-logic/subscription/unit-test-a-subscription.md) | Test subscription handlers in isolation |

#### Streams

| Page | What you'll learn |
|---|---|
| [Stream overview](./2_building_business-logic/stream/index.md) | Real-time, incremental responses |
| [Stream Builder](./2_building_business-logic/stream/the-stream-builder.md) | Multi-frame output and SSE streaming |
| [Test a Stream](./2_building_business-logic/stream/test-a-stream.md) | Validate stream frames and completion |

#### Queues

| Page | What you'll learn |
|---|---|
| [Queue overview](./2_building_business-logic/queue/index.md) | Pull-based async work and worker pools |
| [Queue Builder](./2_building_business-logic/queue/the-queue-builder.md) | Define queue schemas and execution profiles |
| [Queue Worker Builder](./2_building_business-logic/queue/the-queue-worker-builder.md) | Process jobs with heartbeats and retries |
| [Queue HTTP Exposure](./2_building_business-logic/queue/queue-http-exposure.md) | Expose queue endpoints via HTTP |
| [Test a Queue Worker](./2_building_business-logic/queue/test-a-queue-worker.md) | Validate background job logic |

#### AI Agents

| Page | What you'll learn |
|---|---|
| [AI Agents overview](./2_building_business-logic/ai/index.md) | LLM-powered workflows and the harness pattern |
| [Agent Builder](./2_building_business-logic/ai/the-agent-builder.md) | Define agents with model bindings and capabilities |
| [Harness, Agents & Workflows](./2_building_business-logic/ai/harness-agents-and-workflows.md) | Orchestrate multi-step AI workflows |
| [Guardrails for Harness Agents](./2_building_business-logic/ai/guardrails.md) | Add typed, observable safety controls around models and tools |
| [Model Capabilities](./2_building_business-logic/ai/model-capabilities.md) | Capability-based gating for LLM providers |
| [Test an Agent](./2_building_business-logic/ai/test-an-agent.md) | Validate agent behavior with test harnesses |

#### Cross-cutting concerns

| Page | What you'll learn |
|---|---|
| [Custom Events](./2_building_business-logic/custom_events.md) | Emit and consume domain events between services |
| [Error Handling](./2_building_business-logic/error-handling.md) | Typed errors, unhandled errors, and recovery patterns |
| [Logging](./2_building_business-logic/logging.md) | Structured logging with context and correlation IDs |
| [HTTP Client](./2_building_business-logic/fetch_based_http_client.md) | Call external APIs with typed clients |
| [Stores](./2_building_business-logic/stores/index.md) | Config, secret, and state persistence |
| [Config Stores](./2_building_business-logic/stores/config-stores.md) | Environment-specific values |
| [Secret Stores](./2_building_business-logic/stores/secret-stores.md) | Credentials and tokens |
| [State Stores](./2_building_business-logic/stores/state-stores.md) | Business state and sessions |

#### Exposing endpoints

| Page | What you'll learn |
|---|---|
| [Exposing Commands overview](./2_building_business-logic/exposing_endpoints/index.md) | REST, SSE, and GraphQL exposure patterns |
| [REST API HTTP Endpoints](./2_building_business-logic/exposing_endpoints/rest_api_http_endpoints.md) | Hono-based HTTP server and OpenAPI |
| [GraphQL](./2_building_business-logic/exposing_endpoints/graphql_mutation_and_query.md) | GraphQL adapter for flexible queries |

#### Connecting to PURISTA

| Page | What you'll learn |
|---|---|
| [Connect to PURISTA overview](./2_building_business-logic/connect_to_a_purista_application/index.md) | Build typed clients for external consumers |
| [REST API Client](./2_building_business-logic/connect_to_a_purista_application/create_a_rest_api_client.md) | Generate HTTP clients from definitions |
| [Event Bridge Client](./2_building_business-logic/connect_to_a_purista_application/create_an_eventbridge_client.md) | Message-based clients for same-fabric services |
| [Embedded Client](./2_building_business-logic/connect_to_a_purista_application/embedded_client.md) | In-process clients for monoliths and testing |

#### Advanced

| Page | What you'll learn |
|---|---|
| [Advanced overview](./2_building_business-logic/advanced/index.md) | Internals and production operating patterns |
| [Structure of a Message](./2_building_business-logic/advanced/structure_of_a_message.md) | Message envelope fields and addressing |
| [Queue Internals & Delivery Tuning](./2_building_business-logic/advanced/queues.md) | Leases, heartbeats, retries, and dead-letter queues |
| [Delivery Semantics & Reliability](./2_building_business-logic/advanced/delivery-semantics-and-reliability.md) | At-most-once vs at-least-once and idempotency |

### Ecosystem

| Page | What you'll learn |
|---|---|
| [Ecosystem overview](./3_eco_system/index.md) | Choose transport, persistence, and tooling layers |
| [HTTP Server](./3_eco_system/http_server.md) | Hono-based REST, SSE, and OpenAPI |
| [Stores](./3_eco_system/stores.md) | Store adapter comparison |
| [Tools](./3_eco_system/tools.md) | Official and community tools |

#### Event Bridges

| Page | What you'll learn |
|---|---|
| [Event Bridges overview](./3_eco_system/eventbridges/index.md) | Capability matrix and delivery semantics |
| [Default Event Bridge](./3_eco_system/eventbridges/default_event_bridge.md) | In-memory bridge for local development |
| [AMQP Bridge](./3_eco_system/eventbridges/amqp.md) | RabbitMQ production transport |
| [MQTT Bridge](./3_eco_system/eventbridges/mqtt.md) | IoT and edge messaging |
| [NATS Bridge](./3_eco_system/eventbridges/nats.md) | Low-latency NATS / JetStream transport |
| [Dapr Bridge](./3_eco_system/eventbridges/dapr.md) | Polyglot service-mesh integration |

#### Queue Bridges

| Page | What you'll learn |
|---|---|
| [Queue Bridges overview](./3_eco_system/queue_bridges/index.md) | Pull-based queue adapter comparison |
| [Default Queue Bridge](./3_eco_system/queue_bridges/default_queue_bridge.md) | In-memory queues for development |
| [Redis Queue Bridge](./3_eco_system/queue_bridges/redis_queue_bridge.md) | Production pull-based queues |
| [NATS Queue Bridge](./3_eco_system/queue_bridges/nats_queue_bridge.md) | JetStream-backed queue bridge |

### Observability

| Page | What you'll learn |
|---|---|
| [OpenTelemetry overview](./4_open_telemetry/index.md) | Tracing, metrics, and structured logging |
| [AWS X-Ray](./4_open_telemetry/aws.md) | AWS tracing setup |
| [Azure Monitor](./4_open_telemetry/azure_monitor.md) | Azure Application Insights setup |
| [Google Cloud Trace](./4_open_telemetry/google_cloud_trace.md) | GCP tracing setup |
| [Grafana / Tempo](./4_open_telemetry/grafana.md) | Grafana stack tracing |
| [Jaeger](./4_open_telemetry/jaeger.md) | Jaeger tracing with Docker |
| [SigNoz](./4_open_telemetry/signoz.md) | SigNoz observability platform |
| [Teletrace](./4_open_telemetry/teletrace.md) | Lightweight trace viewer |
| [Uptrace](./4_open_telemetry/uptrace.md) | Uptrace tracing platform |
| [Zipkin](./4_open_telemetry/zipkin.md) | Zipkin tracing with Docker |

### Deploy & Scale

| Page | What you'll learn |
|---|---|
| [Deploy & Scale overview](./5_deploy_and_scale/index.md) | Deployment patterns and decision guide |
| [Monolithic](./5_deploy_and_scale/monolithic.md) | Single-process deployment |
| [Edge](./5_deploy_and_scale/edge.md) | Lightweight IoT and edge deployment |
| [Serverless / FaaS](./5_deploy_and_scale/serverless_function_fass.md) | Function-as-a-service deployment |
| [Microservice Style overview](./5_deploy_and_scale/microservice_style/index.md) | Independent service deployment |
| [Kubernetes](./5_deploy_and_scale/microservice_style/kubernetes.md) | K8s deployment helpers |
| [Dapr](./5_deploy_and_scale/microservice_style/dapr.md) | Dapr sidecar deployment |

### Integrations

| Page | What you'll learn |
|---|---|
| [Integrations overview](./6_integrations/index.md) | Temporal and enterprise interoperability |

#### Temporal

| Page | What you'll learn |
|---|---|
| [Temporal & PURISTA overview](./6_integrations/temporal_and_purista/index.md) | Orchestrate PURISTA commands with durable workflows |
| [Why Use Temporal](./6_integrations/temporal_and_purista/why_to_use_temporal_and_purista.md) | When and why to add workflow orchestration |
| [Setup Temporal](./6_integrations/temporal_and_purista/setup_temporal.md) | Install and configure the Temporal server |
| [Connect Temporal with PURISTA](./6_integrations/temporal_and_purista/connect_temporal_with_purista.md) | Wire Temporal activities to PURISTA commands |
| [Connect PURISTA to Temporal](./6_integrations/temporal_and_purista/connect_purista_to_temporal.md) | Signal Temporal workflows from PURISTA subscriptions |
| [OpenTelemetry for Temporal](./6_integrations/temporal_and_purista/add_opentelementry.md) | Trace across both systems |

#### Enterprise Interoperability

| Page | What you'll learn |
|---|---|
| [Enterprise Interoperability overview](./6_integrations/enterprise_interoperability/index.md) | Provider-neutral contracts for enterprise systems |
| [Scheduling](./6_integrations/enterprise_interoperability/scheduling.md) | Declare schedule contracts for external schedulers |
| [Event-to-Queue](./6_integrations/enterprise_interoperability/event-to-queue.md) | Durable handoff from events to pull-based work |
| [Long-running Queues](./6_integrations/enterprise_interoperability/long-running-queues.md) | Lease, heartbeat, and retry for background jobs |
| [Result Events](./6_integrations/enterprise_interoperability/result-events.md) | Publish queue completion as typed events |
| [Async Agent Queues](./6_integrations/enterprise_interoperability/async-agent-queues.md) | Queue lifecycle for AI agent execution |
| [Exports](./6_integrations/enterprise_interoperability/exports.md) | AsyncAPI, OpenAPI, and runtime capability reports |

---

## The PURISTA promise

| Concern | How PURISTA handles it |
|---|---|
| **Business alignment** | Services map to capabilities, not layers. Commands and subscriptions mirror business actions and reactions. |
| **Type safety** | Every input, output, and event is schema-validated. TypeScript inference propagates through the entire call chain. |
| **Observability** | OpenTelemetry traces, structured logs, and metrics are built in — not bolted on. |
| **Deployment freedom** | The same service code runs locally, in containers, or on the edge. Swap message brokers by changing one config line. |
| **Strict separation** | Business logic never knows about HTTP, message brokers, or databases. Infrastructure binds at runtime through adapters. |

## Next step

If you are new here, start with the [Quickstart](./1_quickstart/index.md) to get a working service in under 10 minutes. If you prefer to understand the big picture first, read [Concept](./concept.md) and [Principles](./principles.md) before writing code.
