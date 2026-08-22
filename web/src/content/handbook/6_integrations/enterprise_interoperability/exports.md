---
title: Exports
description: Generate AsyncAPI, OpenAPI, and runtime capability reports from PURISTA service declarations.
order: 610060
---

# Exports

PURISTA service declarations contain rich metadata: schemas, event names, queue definitions, schedule manifests, and delivery semantics. Generate provider-neutral exports from this metadata for documentation, governance, and integration.

## Export types

| Export | Format | Contains | Primary use |
|---|---|---|---|
| **AsyncAPI** | YAML/JSON | Events, subscriptions, queues, stream channels | Async contract documentation |
| **OpenAPI** | YAML/JSON | HTTP-exposed commands, streams, queue status endpoints | REST API documentation |
| **Runtime capabilities** | JSON | Bridge features, delivery guarantees, limitations | Operational review |
| **Schedule manifest** | JSON | Schedule declarations, target identity, group, and policies | Scheduler configuration |

## Generating exports

Use the project CLI to export checked-in service definitions. The command writes
deterministic JSON and does not start services or connect to infrastructure.

```bash
purista export-asyncapi --definitions purista.definitions.json --out asyncapi.json
purista export-schedule-manifest --definitions purista.definitions.json --out schedules.json
purista export-runtime-capabilities --out runtime-capabilities.json
```

The same Core helpers are available programmatically when a build pipeline needs
to compose exports itself.

## AsyncAPI export

The AsyncAPI document describes your message-driven interface:

```yaml
asyncapi: '2.6.0'
info:
  title: User Service
  version: '1.0.0'
channels:
  user.created:
    subscribe:
      message:
        payload:
          type: object
          properties:
            userId:
              type: string
              format: uuid
```

Use this for:

- Event catalog documentation
- Consumer onboarding
- Schema validation in CI
- Governance reviews

## Runtime capability report

The capability report is intentionally truthful about what your infrastructure provides:

```json
{
  "eventBridge": {
    "type": "DefaultEventBridge",
    "durableSubscriptions": false,
    "manualAck": false,
    "streamSupport": true
  },
  "queueBridge": {
    "type": "RedisQueueBridge",
    "leaseExtension": true,
    "deadLetterQueue": true,
    "idempotencyEnforcement": false
  }
}
```

Review this before production deployment. For example, if `durableSubscriptions` is `false`, you know events may be lost on restart.

## CloudEvents mapping

For integration with external event systems, PURISTA supports CloudEvents mapping:

```typescript
import { toCloudEvent, fromCloudEvent } from '@purista/core'

// Convert PURISTA message to CloudEvent
const cloudEvent = toCloudEvent(puristaMessage)

// Convert CloudEvent to PURISTA message
const puristaMessage = fromCloudEvent(cloudEvent)
```

CloudEvents is an interoperability adapter. It does not replace PURISTA's internal message envelope.

## Provider bindings

Provider-neutral exports are the default. Teams review ownership, schemas, idempotency strategy, and delivery limitations before choosing specific infrastructure:

```mermaid
flowchart LR
    A["PURISTA Services"] -->|export| B["AsyncAPI / OpenAPI"]
    B -->|review| C["Team Review"]
    C -->|bind| D["NATS / AMQP / Gateway"]
```

This ensures business contracts are agreed upon before infrastructure decisions are made.

## Design guidelines

- **Generate exports in CI** — keep documentation in sync with code
- **Version exports with services** — `user-service-v1-asyncapi.yaml`
- **Review runtime capabilities before production** — understand what your bridge promises
- **Use CloudEvents for external integration** — not for internal PURISTA messaging

Next: [Long-running queues](./long-running-queues.md) for durable background work.
