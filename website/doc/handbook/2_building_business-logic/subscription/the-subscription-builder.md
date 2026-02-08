---
title: The Subscription Builder
description: How to use the subscription builder to create a new subscription for a service
order: 203010
---

# The subscription builder

A subscription reacts to messages/events from the event bridge and can optionally emit a new event.

Use the subscription builder from your service builder:

```typescript
const mySubscriptionBuilder = myServiceBuilder.getSubscriptionBuilder(
  'subscriptionName',
  'some subscription description'
)
```

## Typical setup

```typescript
import { z } from 'zod'

const inputPayloadSchema = z.object({
  id: z.string(),
})

const inputParameterSchema = z.object({
  source: z.string().optional(),
})

const outputSchema = z.object({
  done: z.boolean(),
})

const mySubscriptionBuilder = myServiceBuilder
  .getSubscriptionBuilder('userCreatedProjection', 'projects user-created events')
  .addPayloadSchema(inputPayloadSchema)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema('userProjected', outputSchema)
  .setSubscriptionFunction(async function (context, payload, parameter) {
    context.logger.info({ payload, parameter }, 'projecting user')
    return { done: true }
  })
```

`addOutputSchema(eventName, schema)` is optional.
If set, a returned value is validated and emitted as a custom event using `eventName`.

## Message filters

Subscriptions should be as specific as possible.
The builder supports multiple filters:

```typescript
import { EBMessageType } from '@purista/core'

const builder = myServiceBuilder
  .getSubscriptionBuilder('onlyUserCreated', 'react on specific event')
  .subscribeToEvent('userCreated', '1')
  .filterSentFrom('UserService', '1', 'createUser', undefined)
  .filterReceivedBy(undefined, undefined, undefined, undefined)
  .filterForMessageType(EBMessageType.CommandSuccessResponse)
  .filterPrincipalId('my-principal')
  .filterTenantId('my-tenant')
```

Use only the filters you need. Over-filtering can prevent subscriptions from matching messages.

## Delivery behavior hints

You can advise broker behavior for this subscription:

```typescript
const builder = myServiceBuilder
  .getSubscriptionBuilder('mySub', '...')
  .adviceDurable(true)
  .adviceAutoacknowledgeMessage(false)
  .receiveMessageOnEveryInstance(true)
```

- `adviceDurable(true)` asks the broker to persist messages while subscriber is offline.
- `adviceAutoacknowledgeMessage(false)` prefers ack after successful execution.
- `receiveMessageOnEveryInstance(true)` disables shared-consumer mode and fans out to each instance.

Support depends on the selected event bridge/broker.

## Invoke and emit from subscriptions

Subscriptions can invoke commands and emit custom events with full type support.

```typescript
const invokeResultSchema = z.object({ ok: z.boolean() })
const invokePayloadSchema = z.object({ id: z.string() })

const builder = myServiceBuilder
  .getSubscriptionBuilder('mySub', '...')
  .canInvoke('AuditService', '1', 'writeAudit', invokeResultSchema, invokePayloadSchema)
  .canEmit('auditWritten', z.object({ id: z.string() }))
  .setSubscriptionFunction(async function (context, payload) {
    await context.service.AuditService['1'].writeAudit({ id: payload.id }, {})
    context.emit('auditWritten', { id: payload.id })
  })
```

## Context

The subscription function context provides:

- `context.message`: original event-bridge message
- `context.logger`: logger with tracing context
- `context.resources`: service resources
- `context.secrets` / `context.configs` / `context.states`: store access
- `context.service`: typed invoke API from `canInvoke`
- `context.emit`: typed custom event API from `canEmit`

## Guards and transformers

Subscriptions support the same transformer and guard concepts as commands:

- `setTransformInput(...)`
- `setTransformOutput(...)`
- `setBeforeGuardHooks(...)`
- `setAfterGuardHooks(...)`

Details and execution order are the same as in:
[Transformer & Guards](../command/the-command-builder.md).

## Important

Use `function` and not arrow functions for builder hooks/functions to preserve `this` binding:

```typescript
// good
async function (context, payload, parameter) {}

// bad
async (context, payload, parameter) => {}
```
