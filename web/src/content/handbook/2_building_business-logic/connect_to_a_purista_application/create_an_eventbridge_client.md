---
title: Eventbridge client
description: Invoke PURISTA commands directly through the event bridge — either with a generated typed client or by using the bridge API directly.
order: 210030
---

# Create an eventbridge client

When the calling code already has access to an `EventBridge` instance — because it runs in the same process or in the same message fabric — you can invoke commands and publish events without going through HTTP.

## Two approaches

| Approach | When to use |
|---|---|
| Direct bridge API | Quick scripts, internal tooling, tests |
| Generated typed client | Production code, IDE auto-completion, compile-time safety |

## Direct bridge usage

If you just need to publish an event or invoke a command without generating a client package, use the event bridge directly:

```typescript
// Emit an event to any subscribed service
await eventBridge.emit('OrderService', '1', 'orderPlaced', { orderId: '123' })
```

For command invocations from inside a handler, use `context.service`:

```typescript
.setCommandFunction(async function (context, payload) {
  // Call another service command directly (typed, no HTTP)
  const user = await context.service.UserService[1].getUser({ userId: payload.userId }, {})
  return user
})
```

## Generated typed client

PURISTA can generate a typed EventBridge client directly from exported service definitions.

### When to use it

Use the generated EventBridge client when:

- the caller runs inside a PURISTA service or monolith
- you already have access to an `EventBridge` instance
- you want strongly typed command payloads and parameters without REST transport

### Generate the client

```typescript
import { ClientBuilder } from '@purista/core'

const clientBuilder = new ClientBuilder({
  definitionPath: './definitions',
  outputPath: './dist',
  buildAs: 'both',
  eventBridgeClient: {
    clientName: 'EventBridgeClient',
  },
})

// load exported *.json service definitions
const definitions = await clientBuilder.loadDefinitionFiles()

// clean output folder and generate source
await clientBuilder.cleanDistFolder()
await clientBuilder.generateEventBridgeClient(definitions)
await clientBuilder.createIndex()
await clientBuilder.createPackageJson()
await clientBuilder.build()

clientBuilder.destroy()
```

::: info
Deprecated alias: `generateHEventBridgeClient(...)`.  
Use `generateEventBridgeClient(...)` for all new code.
:::

### Use the generated client

```typescript
import { EventBridgeClient } from '@company/generated-client'

const client = new EventBridgeClient(eventBridge)

// client.[serviceName].v[serviceVersion].[commandName](payload, parameter, options?)
const result = await client.user.v1.signUp(
  { email: 'john@example.com' },
  { source: 'landing-page' },
  { traceId: 'custom-trace-id' },
)
```

`options` maps to invoke metadata:

- `traceId`
- `principalId`
- `tenantId`
