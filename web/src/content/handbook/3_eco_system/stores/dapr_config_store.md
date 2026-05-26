---
title: Dapr Config Store
description: Use any Dapr-supported config component — Redis, Consul, Azure App Configuration, and more — via the Dapr sidecar.
order: 302140
---

# Dapr Config Store

When running with the [Dapr](https://dapr.io) sidecar, `@purista/dapr-sdk` automatically routes config store operations through Dapr's state management API. You configure the backing store as a Dapr component — PURISTA services need no knowledge of the underlying infrastructure.

This means a single PURISTA codebase can use Redis locally, Consul in staging, and Azure App Configuration in production by swapping the Dapr component definition — no code change required.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getConfig`) | ✅ |
| Write (`setConfig`) | ✅ (opt-in) |
| Delete (`removeConfig`) | ✅ (opt-in) |
| Backing store | Any Dapr state component |
| Infrastructure portability | ✅ (swap component, not code) |

## Install

```bash
npm install @purista/dapr-sdk
```

## Setup

The Dapr SDK replaces the event bridge and automatically wires stores through the sidecar. No separate store constructor is needed — store operations flow through Dapr's HTTP/gRPC API.

```typescript
import { DaprEventBridge } from '@purista/dapr-sdk'

const eventBridge = new DaprEventBridge({
  daprApiToken: process.env.DAPR_API_TOKEN,
  // Store component names must match your Dapr component definitions:
  configStoreName: 'my-config-store',
  secretStoreName: 'my-secret-store',
  stateStoreName: 'my-state-store',
})

const myService = await myV1Service.getInstance(eventBridge)
```

## Dapr component definition

Example using Redis as the backing store for config:

```yaml
# components/config-store.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: my-config-store
spec:
  type: state.redis
  version: v1
  metadata:
    - name: redisHost
      value: localhost:6379
    - name: redisPassword
      value: ""
```

Swap `spec.type` to `state.consul`, `state.azure.tablestorage`, or any other supported Dapr state component without changing PURISTA code.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { apiBaseUrl } = await context.configs.getConfig('apiBaseUrl')

  await context.configs.setConfig('featureFlags', { newCheckout: true })
})
```

## Operational tips

- Use Dapr's [component scopes](https://docs.dapr.io/operations/components/component-scopes/) to restrict which services can access which stores
- Dapr handles retries and circuit-breaking to the sidecar automatically
- Run `dapr dashboard` to inspect component status and store operations in development

## Related

- [Config Store overview](../stores.md)
- [Dapr Event Bridge](../eventbridges/dapr.md)
- [Default Config Store](./default_config_store.md)
- [Redis Config Store](./redis_config_store.md)
