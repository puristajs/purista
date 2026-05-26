---
title: Structure of a message
description: Message internals for commands, subscriptions, events, and streams
order: 209910
---

# Structure of a message

## Core identifiers

### `traceId`

Trace identifier for one full distributed flow.

### `correlationId`

Correlation identifier for one request/response or one stream session.

### `id`

Unique message id.

### `instanceId`

Unique event bridge instance id (sender side).

### `principalId` and `tenantId`

Optional security/tenant metadata propagated through the flow.

## Shared message fields

| field | required | meaning |
|---|---|---|
| `messageType` | yes | command/response/custom/info/stream |
| `id` | yes | message id |
| `timestamp` | yes | unix time in ms |
| `traceId` | yes | distributed trace id |
| `correlationId` | depends | correlation across request/response or stream session |
| `principalId` | no | identity of the caller, propagated through the flow |
| `tenantId` | no | tenant identifier for multi-tenant systems |
| `sender` | yes | sender address (`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`) |
| `receiver` | depends | target address for directed messages |
| `payload` | depends | message body |
| `otp` | no | OpenTelemetry propagation payload |

## Accessing message fields in handlers

Inside every command and subscription handler the `context` object exposes the message fields you most commonly need:

```typescript
.setCommandFunction(async function (context, payload, parameter) {
  // Identity and tenant context
  const caller = context.message.principalId  // identity of the caller
  const tenant = context.message.tenantId     // tenant identifier

  // Distributed tracing
  const traceId = context.message.traceId         // OTel trace ID
  const correlId = context.message.correlationId  // correlation across calls

  // Structured logger — automatically carries traceId and span context
  context.logger.info('Processing request')

  // Injected resources, secrets, and config
  const db = context.resources.db
  const apiKey = await context.secrets.getSecret('externalApiKey')
  const batchSize = await context.configs.getConfig('batchSize')

  // State store
  const prev = await context.states.getState('lastProcessed')
  await context.states.setState('lastProcessed', new Date().toISOString())

  // Emit a custom event
  await context.emit('OrderProcessed', { orderId: payload.id })

  // Call another service command
  const user = await context.service.UserService[1].getUser({ userId: caller }, {})
})
```

## Stream message model

`messageType: 'stream'` uses frame-oriented payloads:

- `open`: open request with `payload` + `parameter`
- `start`: producer accepted and stream started
- `chunk`: one incremental result item
- `complete`: terminal success (optional final payload)
- `error`: terminal failure
- `cancel`: terminal cancellation
- `heartbeat`: optional keepalive frame

A stream session is keyed by `correlationId`.

## Practical debugging tips

- use `traceId` for end-to-end flow views
- use `correlationId` for one command call or stream session
- inspect sender/receiver address to verify routing correctness
- verify `eventName` for subscription matching and event-driven fan-out
