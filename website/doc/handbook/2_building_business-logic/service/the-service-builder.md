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

## Add custom metrics

Declare application metrics on the service builder.
PURISTA records them through the OpenTelemetry Metrics API, but the application owns the OTel SDK, readers, and exporters.

```typescript [myServiceV1ServiceBuilder.ts]
import { ServiceBuilder, ServiceInfoType } from '@purista/core'
import { z } from 'zod'

const metricAttributes = z.object({
	channel: z.enum(['web', 'api']),
})

export const myServiceV1ServiceBuilder = new ServiceBuilder(myServiceInfo)
	.defineMetric('app.orders.created', {
		kind: 'counter',
		unit: '{order}',
		description: 'Created orders',
		attributes: metricAttributes,
	})
	.defineMetric('app.orders.processing.duration', {
		kind: 'histogram',
		unit: 'ms',
		description: 'Order processing duration',
		attributes: metricAttributes,
	})
```

Handlers use typed metric handles from `context.metrics`.
Counter and up-down-counter metrics use `add`; histogram metrics use `record`.

```typescript
.setCommandFunction(async function (context, payload) {
	const started = Date.now()

	context.metrics['app.orders.created'].add(1, { channel: 'web' })

	try {
		return await createOrder(payload)
	} finally {
		context.metrics['app.orders.processing.duration'].record(Date.now() - started, { channel: 'web' })
	}
})
```

Custom metric names must start with `app.`.
Keep attributes low-cardinality and never record secrets, tokens, request headers, raw URLs, prompts, completions, user IDs, tenant IDs, or payload data.
PURISTA does not expose a raw metric recorder on handler contexts.

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

When metrics are enabled, pass the application-owned OTel provider through runtime options or configure it globally before creating service instances.

```typescript
const myService = await myServiceV1Service.getInstance(eventBridge, {
	metrics: { meter: meterProvider.getMeter('purista.app') },
})
```
