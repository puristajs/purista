---
title: The Service Builder
description: Working with the PURISTA service builder
order: 201010
---

# Service builder

The service builder defines service metadata, configuration, resources, and attached command/subscription/stream definitions.

Create a service scaffold with:

```bash
purista add service
```

In most projects, you mainly customize service config/resources and add business artifacts via CLI:

- `purista add command`
- `purista add subscription`
- `purista add stream`

## Service definition

```typescript [myServiceV1ServiceBuilder.ts]
import { ServiceBuilder, ServiceInfoType } from '@purista/core'

export const myServiceInfo = {
  serviceName: 'MyService',
  serviceVersion: '1',
  serviceDescription: 'my service',
} as const satisfies ServiceInfoType

export const myServiceV1ServiceBuilder = new ServiceBuilder(myServiceInfo)
```

## Add command/subscription/stream definitions

Keep definition lists in the service file and spread them into the builder.

```typescript [myServiceV1Service.ts]
import { pingCommandBuilder } from './command/ping/index.js'
import { barSubscriptionBuilder } from './subscription/bar/index.js'
import { userSearchStreamBuilder } from './stream/userSearch/index.js'
import { myServiceV1ServiceBuilder } from './myServiceV1ServiceBuilder'

const commandDefinitions: Parameters<typeof myServiceV1ServiceBuilder['addCommandDefinition']>[0][] = [
  pingCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: Parameters<typeof myServiceV1ServiceBuilder['addSubscriptionDefinition']>[0][] = [
  barSubscriptionBuilder.getDefinition(),
]

const streamDefinitions: Parameters<typeof myServiceV1ServiceBuilder['addStreamDefinition']>[0][] = [
  userSearchStreamBuilder.getDefinition(),
]

export const myServiceV1Service = myServiceV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
  .addStreamDefinition(...streamDefinitions)
```

## Keep generated lists typed

These declarations are required for CLI update operations and for preserving end-to-end type inference.

- Keep constant names: `commandDefinitions`, `subscriptionDefinitions`, `streamDefinitions`.
- Keep typed declarations via `Parameters<typeof builder['add...Definition']>[0][]`.
- Do not replace with untyped arrays (`any[]`, `unknown[]`, or inferred empty arrays).

## Why split builder and service files

Keep the basic service builder (`...ServiceBuilder.ts`) separate from service wiring (`...Service.ts`) to avoid cyclic dependencies. Command/subscription/stream builders are created from the service builder and inherit typed service context from there.

## Create and start an instance

```typescript
const myService = await myServiceV1Service.getInstance(eventBridge)
await myService.start()
```

Use `start()` so definitions are registered at the event bridge and startup hooks can run.
