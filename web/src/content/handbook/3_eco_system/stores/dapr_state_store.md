---
title: Dapr State Store
description: Store runtime state via the Dapr sidecar — Redis, Cosmos DB, DynamoDB, and more without code changes.
order: 302330
---

# Dapr State Store

When running with the [Dapr](https://dapr.io) sidecar, `@purista/dapr-sdk` routes state store operations through Dapr's state management API. The backing store — Redis, Azure Cosmos DB, AWS DynamoDB, PostgreSQL, Cassandra, and [many more](https://docs.dapr.io/reference/components-reference/supported-state-stores/) — is defined as a Dapr component outside your application code.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getState`) | ✅ |
| Write (`setState`) | ✅ |
| Delete (`removeState`) | ✅ |
| Backing store | Any Dapr state component |
| StateStore retention | Conditional: `supportsTtl: true` and a TTL-capable component |
| Infrastructure portability | ✅ (swap component, not code) |

## Install

```bash
npm install @purista/dapr-sdk
```

## Setup

Create a `DaprStateStore` and pass it to the service. Set `supportsTtl: true`
only after verifying that the deployed Dapr component honours `ttlInSeconds`.

```typescript
import { DaprStateStore } from '@purista/dapr-sdk'

const stateStore = new DaprStateStore({
  stateStoreName: 'my-state-store',
  supportsTtl: true,
  clientConfig: {
    daprApiToken: process.env.DAPR_API_TOKEN,
  },
})

const myService = await myV1Service.getInstance(eventBridge, { stateStore })
```

## Dapr component definition

Example using Redis as the backing state store:

```yaml
# components/state-store.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: my-state-store
spec:
  type: state.redis
  version: v1
  metadata:
    - name: redisHost
      value: localhost:6379
    - name: redisPassword
      value: ""
    - name: actorStateStore
      value: "true"
```

Swap `spec.type` to `state.azure.cosmosdb`, `state.dynamodb`, `state.postgresql`, etc. without changing a single line of PURISTA service code.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  await context.states.setState('lastProcessedAt', new Date().toISOString())
  const { lastProcessedAt } = await context.states.getState('lastProcessedAt')
})
```

## Operational tips

- Use [Dapr component scopes](https://docs.dapr.io/operations/components/component-scopes/) to control which services can access which state stores
- When using retention, verify TTL support on the exact deployed Dapr component;
  PURISTA rounds milliseconds up to whole seconds for `ttlInSeconds`
- Dapr handles connection retries to the sidecar; implement graceful startup delays if the sidecar needs extra time to initialize
- Run `dapr dashboard` during development to inspect state store operations and debug state values

## Related

- [State Store overview](../stores.md)
- [Dapr Event Bridge](../eventbridges/dapr.md)
- [Dapr Config Store](./dapr_config_store.md)
- [Dapr Secret Store](./dapr_secret_store.md)
- [Default State Store](./default_state_store.md)
- [StateStore retention](../../2_building-business-logic/stores/state-stores.md#retention)
