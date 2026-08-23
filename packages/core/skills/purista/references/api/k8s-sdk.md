# @purista/k8s-sdk API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/k8s-sdk`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [addServiceEndpoints](#addserviceendpoints)
- [getHttpServer](#gethttpserver)

## addServiceEndpoints

**function.** Adds HTTP endpoints for all commands that expose HTTP metadata. Source: `addServiceEndpoints.impl.ts:44`.

**Verified example**

```ts
const app = new Hono()
addServiceEndpoints(myService, app, logger)
```

## getHttpServer

**function.** Create a Hono based web server. Source: `getHttpServer.impl.ts:31`.

**Verified example**

```ts
import { serve } from '@hono/node-server'
import { getHttpServer } from '@purista/k8s-sdk'

const app = getHttpServer({ logger, services: [svc], healthFn: async () => true })
serve({ fetch: app.fetch, port: 3000 })
```

