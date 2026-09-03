---
title: Services and boundaries
description: Use versioned services to keep business ownership, dependencies, and change boundaries explicit.
order: 220
---

A PURISTA service is a versioned container for related business behavior. An `incident` service can create, classify, and close incidents; a separate `notification` service can react to incident events without being imported by it.

## What belongs in a service

- Commands, subscriptions, streams, queues, and agents that serve one business capability.
- Schemas and service configuration that define that capability's contract.
- Explicit resources such as a repository or an external client.

The application, not the service, owns credentials and concrete infrastructure adapters. Pass those through service instance options at startup.

```ts title="src/index.ts"
import { DefaultEventBridge } from '@purista/core'
import { createIncidentRepository } from './resource/createIncidentRepository.js'
import { incidentV1Service } from './service/incident/v1/incidentV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()
const incidentRepository = createIncidentRepository()

const incidentService = await incidentV1Service.getInstance(eventBridge, {
  resources: { incidentRepository },
})
await incidentService.start()
```

## Version deliberately

Create a new service version when a contract change cannot be safely consumed by existing callers. Do not change an event or command schema in place merely because every local consumer currently compiles; remote or delayed messages can outlive one deployment.

## Do and do not

| Do | Do not | Why |
| --- | --- | --- |
| Keep a service aligned to a business capability | Group everything that uses the same database | Storage is a dependency, not an ownership boundary. |
| Define resources at the composition boundary | Read process environment variables from every handler | Central wiring is testable and keeps secrets out of business logic. |
| Version breaking contracts | Reuse a version for incompatible payloads | Consumers need a stable message contract. |

When a service needs a different operational lifecycle, data owner, or release
cadence, that is evidence to consider extraction—not merely that another
handler exists. Keep the boundary local until the distributed trade-offs are
justified; see [modular monolith](/handbook/framework/deploy-applications/modular-monolith/)
and [distributed services](/handbook/framework/deploy-applications/distributed-services/).

Next: [messages, schemas, and contracts](/handbook/framework/understand-the-framework/messages-schemas-and-contracts/).
