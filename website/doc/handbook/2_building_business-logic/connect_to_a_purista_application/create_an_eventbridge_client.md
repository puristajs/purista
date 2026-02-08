---
title: Eventbridge client
description: Export the service definitions to share them and to use them for building connectors or visualizations
order: 210030
---

# Create an eventbridge client

PURISTA can generate a typed EventBridge client directly from exported service definitions.

The generated client calls `eventBridge.invoke(...)` instead of HTTP endpoints.

## When to use it

Use the generated EventBridge client when:

- the caller runs inside a PURISTA service
- you already have access to an `EventBridge` instance
- you want strongly typed command payloads and parameters without REST transport

## Generate the client

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

## Use the generated client

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
