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
  .adviceConsumerFailureHandling({
    mode: 'strict',
    maxAttempts: 5,
    retryDelayMs: 1000,
    deadLetterTarget: 'billing.userCreated.dead-letter',
  })
  .receiveMessageOnEveryInstance(true)
```

- `adviceDurable(true)` asks the broker to persist messages while subscriber is offline.
- `adviceAutoacknowledgeMessage(false)` prefers ack after successful execution.
- `adviceConsumerFailureHandling(...)` declares bounded retry semantics, strictness, and the dead-letter target that exhausted messages should use.
- `receiveMessageOnEveryInstance(true)` disables shared-consumer mode and fans out to each instance.

Support depends on the selected event bridge/broker.

### Failure handling modes

- `mode: 'strict'` is the recommended default. PURISTA validates the selected event bridge at startup and rejects unsupported retry/DLQ requirements.
- `mode: 'best-effort'` allows adapter-specific degradation when you explicitly accept weaker semantics.
- Exhausted subscription messages are dead-lettered. Set `deadLetterTarget` explicitly when you want a stable operator inbox, or rely on the adapter default suffix when the selected bridge documents one.

### Explicit handler outcomes

Subscription handlers can return explicit control outcomes instead of only throwing exceptions:

```typescript
const builder = myServiceBuilder
  .getSubscriptionBuilder('mySub', '...')
  .setSubscriptionFunction(async function (context, payload) {
    if (payload.temporaryUnavailable) {
      return { status: 'retry', reason: 'temporary downstream outage', delayMs: 5_000 }
    }

    if (payload.invalidData) {
      return { status: 'deadLetter', reason: 'invalid payload for projection' }
    }

    if (payload.ignoreForNow) {
      return { status: 'drop', reason: 'known irrelevant event variant' }
    }

    if (payload.poisonSequenceDetected) {
      return { status: 'stop-consumer', reason: 'manual operator review required' }
    }

    return { status: 'ack' }
  })
```

- `ack` settles the delivery as successful.
- `retry` signals transient failure with optional delay hint.
- `deadLetter` routes immediately to dead-letter handling.
- `drop` acknowledges and discards the current delivery with warning logging.
- `stop-consumer` pauses the affected subscription consumer until explicitly resumed by an operator/runtime call.
- Thrown errors still map through the configured retry/DLQ policy for backward-compatible behavior.

`stop-consumer` support is capability-gated per adapter. In `mode: 'strict'`, unsupported adapters reject this outcome with a startup/runtime validation error instead of silently degrading behavior.

### When to use subscription retries vs queues

Use subscription retry / dead-letter handling for reactive push workloads where the broker should make a bounded number of delivery attempts and then move the message aside for investigation.

Use a queue instead when you need:

- long backoff windows
- controlled replay / re-drive operations
- worker heartbeats / leases
- operator-visible backlog metrics and remediation flows

Queues are the stronger abstraction for workflow-style work. Subscription retries should stay focused on bounded event-consumer hardening.

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

Subscriptions can also consume streams with typed contracts:

```typescript
const builder = myServiceBuilder
  .getSubscriptionBuilder('mySub', '...')
  .canConsumeStream('SearchService', '1', 'searchUsers', chunkSchema, payloadSchema, parameterSchema, finalSchema)
  .setSubscriptionFunction(async function (context, payload, parameter) {
    const handle = await context.stream.SearchService['1'].searchUsers(payload, parameter)
    for await (const frame of handle) {
      if (frame.payload.frameType === 'chunk') {
        // consume chunk
      }
    }
  })
```

## Context

The subscription function context provides:

- `context.message`: original event-bridge message
- `context.logger`: logger with tracing context
- `context.resources`: service resources
- `context.secrets` / `context.configs` / `context.states`: store access
- `context.service`: typed invoke API from `canInvoke`
- `context.stream`: typed stream consume API from `canConsumeStream`
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
