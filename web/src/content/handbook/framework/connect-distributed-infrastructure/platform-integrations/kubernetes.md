---
title: Run with Kubernetes
description: Add the Kubernetes HTTP helper for health probes and selected command endpoints.
order: 741
---

```bash title="Install Kubernetes HTTP helper for Node"
npm install @purista/k8s-sdk @hono/node-server
```

`getHttpServer(...)` creates a Hono-oriented helper with `/healthz`; by default
it also attempts to register HTTP-exposed commands from the supplied services.
The application supplies the logger and a health function that returns `true`
only when the process can serve traffic.

```ts title="src/index.ts"
import { getHttpServer } from '@purista/k8s-sdk'

const app = getHttpServer({
  logger,
  healthFn: async () => true,
  services: incidentService,
})
```

Replace the trivial health function with checks that reflect the service's actual readiness policy. Do not make a liveness probe depend on a remote dependency that can create cascading restarts; use readiness for dependencies needed to serve traffic. Configure workload identity, network policies, resource limits, graceful termination, and secrets in Kubernetes rather than in the helper.

## Choose helper options deliberately

| Option | Default | Effect and choice |
| --- | --- | --- |
| `healthFn` | Required | Produces `200` when it resolves `true`, `500` when it resolves `false`, and an error response when it throws. Keep it small and free of unsafe diagnostics. |
| `services` | None | One service or array from which the helper attempts command endpoint registration. Services must already be instantiated; the helper does not start them. |
| `apiMountPath` | `/api` | Prefix for generated command routes. Use a stable path when the helper is the public HTTP boundary. |
| `disableEndpointExposing` | `false` | Skips all automatic command registration. Use it for probe-only apps or application-owned routes. |
| `enableHttpCompression` | `true` | Installs Hono compression middleware. Disable only when an upstream layer owns compression or its policy forbids it. |
| `hostname` | `process.env.HOSTNAME` | Adds the host value to helper logging and tracing. Set it only when the runtime’s hostname is not the intended workload identity. |

The helper installs process-level one-shot `SIGTERM` plus
`uncaughtException`/`unhandledRejection` logging handlers and makes `/healthz`
return `503` after `SIGTERM`. Construct it once at the process composition
root, not once per service or route.

> **Current limitation:** `addServiceEndpoints(...)` stops scanning all
> supplied definitions when it encounters the first command without HTTP
> metadata. In a mixed service, do not rely on this helper to expose later
> commands. Use the full [Hono service](/handbook/framework/expose-and-consume-services/http-and-rest/hono/)
> for a complete HTTP projection, or ensure the supplied definitions are
> limited to the supported shape until this implementation is repaired.

The helper returns a Hono app; it does not start a listener. Add the listener package appropriate to the runtime (for Node, `@hono/node-server`) and pass `app.fetch` to it.

Next: [Kubernetes and Dapr deployment](/handbook/framework/secure-and-operate/deployment/kubernetes-and-dapr/) and [Expose services with Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/).
