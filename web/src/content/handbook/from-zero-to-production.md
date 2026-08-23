---
title: From Zero to Production
description: A pragmatic, four-phase path from your first PURISTA service to a production-ready deployment.
order: 50000
---

# From Zero to Production

This guide is a practical roadmap. Each phase has clear goals, code examples, and a checklist before you move on.

```mermaid
flowchart LR
    p1["**Phase 1**<br/>Foundation"] --> p2["**Phase 2**<br/>Integration"] --> p3["**Phase 3**<br/>Runtime"] --> p4["**Phase 4**<br/>Production"]
    style p1 fill:var(--color-con),stroke:none,color:#fff
    style p2 fill:var(--color-found),stroke:none,color:#fff
    style p3 fill:var(--color-pilot),stroke:none,color:#fff
    style p4 fill:var(--color-con),stroke:none,color:#fff
```

---

## Phase 1: Foundation

**Goal:** A running service with commands, subscriptions, and tests — using only the in-memory event bridge.

### What to build

1. Scaffold a project with `npm create purista@latest`
2. Create a service with at least one command
3. Add one subscription reacting to a command event
4. Define Zod schemas for all inputs and outputs
5. Write unit tests for the service, command, and subscription

### Example: service bootstrap

```typescript [index.ts]
import { DefaultEventBridge } from '@purista/core'
import { userServiceV1Service } from './service/user/v1/userServiceV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const userService = await userServiceV1Service.getInstance(eventBridge)
await userService.start()

console.log('Service is running. Press Ctrl+C to stop.')
```

### Example: first command test

```typescript [userSignUp.test.ts]
import { createCommandTestHarness } from '@purista/core/testing'
import { userV1ServiceBuilder } from './userV1ServiceBuilder.js'
import { userSignUpCommandBuilder } from './userSignUpCommandBuilder.js'

test('creates a user and returns an id', async () => {
  const harness = await createCommandTestHarness(userV1ServiceBuilder, userSignUpCommandBuilder, {
    resources: {
      db: { createUser: async () => 'user-123' },
    },
  })

  const response = await harness.run({
    payload: {
      email: 'test@example.com',
      password: 'secure-password',
    },
    parameter: {},
  })

  expect(response.userId).toBe('user-123')
})
```

### Phase 1 checklist

- [ ] Project scaffolded with `purista.json` configured
- [ ] At least one service with `serviceInfo` typed as `const satisfies ServiceInfoType`
- [ ] Commands have `.addPayloadSchema()` and `.addOutputSchema()`
- [ ] Subscriptions have explicit filters (not broad wildcards)
- [ ] Unit tests pass for all builders using `createCommandTestHarness` (commands) and `createSubscriptionContextMock` (subscriptions)
- [ ] No `any` or `unknown` types in core message paths

### References

- [Quickstart](./1_quickstart/index.md)
- [Service Builder](./2_building_business-logic/service/the-service-builder.md)
- [Command Builder](./2_building_business-logic/command/the-command-builder.md)
- [Subscription Builder](./2_building_business-logic/subscription/the-subscription-builder.md)

---

## Phase 2: Integration-ready logic

**Goal:** Your services can persist state, call external APIs, and expose HTTP endpoints.

### What to add

1. **Config, secret, and state stores** — externalize all mutable state
2. **Resources** — database clients, HTTP clients, SDK wrappers
3. **HTTP exposure** — expose commands via REST or SSE
4. **Invoke relations** — explicitly declare which commands a service can call

### Example: adding stores and resources

```typescript [userServiceV1ServiceBuilder.ts]
import { ServiceBuilder } from '@purista/core'
import { RedisStateStore } from '@purista/redis-state-store'

export const userServiceV1ServiceBuilder = new ServiceBuilder(myServiceInfo)
  .addStateStore(RedisStateStore, { url: process.env.REDIS_URL })
  .setResources(async (config) => ({
    db: createDbClient(config.dbUrl),
    cache: createRedisClient(config.redisUrl),
  }))
```

### Example: exposing a command as HTTP

```typescript [userSignUpCommandBuilder.ts]
export const userSignUpCommandBuilder = userServiceV1ServiceBuilder
  .getCommandBuilder('userSignUp', 'register a new user')
  .addPayloadSchema(inputPayloadSchema)
  .addOutputSchema(outputSchema)
  .exposeAsHttpEndpoint('POST', 'users')
  .setCommandFunction(async function (context, payload) {
    // business logic here
  })
```

### Example: explicit invoke relations

When a command calls another service's command, declare the relationship with `canInvoke` on the calling command builder:

```typescript [userSignUpCommandBuilder.ts]
export const userSignUpCommandBuilder = userServiceV1ServiceBuilder
  .getCommandBuilder('userSignUp', 'register a new user')
  .addPayloadSchema(inputPayloadSchema)
  .addOutputSchema(outputSchema)
  .canInvoke('NotificationService', '1', 'sendEmail', sendEmailOutputSchema, sendEmailInputSchema, sendEmailParamSchema)
  .setCommandFunction(async function (context, payload) {
    // context.service.NotificationService['1'].sendEmail(...) is now typed
    return { userId: 'user-123' }
  })
```

### Phase 2 checklist

- [ ] Config stores for environment-specific values
- [ ] Secret stores for API keys, DB passwords
- [ ] State stores for business state (not in-memory)
- [ ] Resources declared in service builder
- [ ] At least one command exposed via `.exposeAsHttpEndpoint()`
- [ ] `canInvoke` declarations for cross-service calls
- [ ] Error handling tested for external service failures

### References

- [Stores](./2_building_business-logic/stores/index.md)
- [Exposing Endpoints](./2_building_business-logic/exposing_endpoints/index.md)
- [HTTP Client](./2_building_business-logic/fetch_based_http_client.md)

---

## Phase 3: Runtime architecture

**Goal:** Choose the infrastructure that matches your delivery and scaling requirements.

### Decisions to make

| Decision | Options | When to choose |
|---|---|---|
| **Event bridge** | Default, AMQP, MQTT, NATS, Dapr | See [Event Bridges](./3_eco_system/eventbridges/index.md) comparison matrix |
| **Queue bridge** | Default (in-memory), Redis, NATS JetStream | Use Redis/NATS for production pull-based workloads |
| **Deployment model** | Monolith, microservice, edge, serverless | See [Deploy & Scale](./5_deploy_and_scale/index.md) |
| **HTTP server** | Hono (built-in), custom | Hono is recommended for most projects |

### Example: switching to AMQP

```typescript [eventbridge.ts]
import { AmqpBridge } from '@purista/amqpbridge'

export const eventBridge = new AmqpBridge({
  url: process.env.AMQP_URL,
  exchangeName: 'purista',
})
```

Your service code does not change. Only the bootstrap file changes.

### Example: graceful shutdown

```typescript [index.ts]
import { gracefulShutdown } from '@purista/core'

gracefulShutdown(logger, [eventBridge, userService, emailService])
```

### Phase 3 checklist

- [ ] Event bridge chosen and configured for target environment
- [ ] Queue bridge configured if using pull-based workloads
- [ ] Deployment model documented (monolith vs. microservice vs. serverless)
- [ ] Graceful shutdown and startup ordering implemented
- [ ] Health checks configured
- [ ] Integration tests run against real broker/store setup

### References

- [Event Bridges](./3_eco_system/eventbridges/index.md)
- [Queue Bridges](./3_eco_system/queue_bridges/index.md)
- [Deploy & Scale](./5_deploy_and_scale/index.md)

---

## Phase 4: Production readiness

**Goal:** The system is observable, secure, and resilient.

### What to enable

1. **OpenTelemetry** — traces, metrics, and structured logs
2. **Authentication / authorization** — protect HTTP endpoints
3. **Error handling** — validate timeout behavior, stream cancellation, retry policies
4. **Integration tests** — test against real infrastructure in staging
5. **Stream consumer verification** — ensure SSE consumers handle reconnection

### Example: enabling OpenTelemetry

```typescript [tracing.ts]
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

const spanProcessor = new SimpleSpanProcessor(
  new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces' })
)

const runtimeObservability = { spanProcessor }
const eventBridge = new DefaultEventBridge(runtimeObservability)
const myService = await myV1Service.getInstance(eventBridge, {
  ...runtimeObservability,
})
await eventBridge.start()
```

PURISTA automatically creates spans for every message. No instrumentation in your business logic.

### Example: endpoint protection

```typescript [userSignUpCommandBuilder.ts]
export const userSignUpCommandBuilder = userServiceV1ServiceBuilder
  .getCommandBuilder('userSignUp', 'register a new user')
  .exposeAsHttpEndpoint('POST', 'users')
  .makeEndpointSecured()
```

### Phase 4 checklist

- [ ] OpenTelemetry exporter configured and verified
- [ ] Auth middleware applied to protected endpoints
- [ ] Error handling tested: happy path, failure path, timeout, cancellation
- [ ] Retry policies defined (not relying on defaults)
- [ ] Stream reconnection tested
- [ ] Integration tests pass against staging infrastructure
- [ ] Observability dashboards reviewed for expected traces
- [ ] Runtime config documented

### References

- [OpenTelemetry](./4_open_telemetry/index.md)
- [Error Handling](./2_building_business-logic/error-handling.md)
- [Deploy & Scale](./5_deploy_and_scale/index.md)

---

## Pre-launch checklist

Before going live, verify:

| Area | Check |
|---|---|
| **Schemas** | All inputs and outputs have explicit Zod schemas |
| **Types** | No `any` / `unknown` in core message paths |
| **Tests** | Unit tests cover happy path, failure path, and cancellation |
| **Docs** | Streaming and event-bridge behavior matches implementation |
| **Config** | Runtime config is documented and version-controlled |
| **Observability** | Traces, logs, and metrics are visible in your dashboard |
| **Security** | Secrets are in secret stores, not env vars or code |
| **Shutdown** | Graceful shutdown behavior verified |

## Summary

| Phase | Time estimate | Key deliverable |
|---|---|---|
| 1. Foundation | Hours | Running service with tests |
| 2. Integration | 1–2 days | HTTP endpoints, stores, resources |
| 3. Runtime | 1–2 days | Broker chosen, deployment model defined |
| 4. Production | 2–3 days | Observability, auth, integration tests |

Next: start with the [Quickstart](./1_quickstart/index.md) to build your foundation.
