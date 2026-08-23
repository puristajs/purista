# @purista/hono-http-server API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/hono-http-server`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [honoV1Service](#honov1service)

## honoV1Service

**variable.** Built-in Hono HTTP service definition. Source: `hono-http-server/src/service/hono/v1/honoV1Service.ts:29`.

**Verified example**

```ts
const honoService = await honoV1Service.getInstance(eventBridge)
honoService.addPuristaService(ordersV1Service)
await honoService.start()
```

