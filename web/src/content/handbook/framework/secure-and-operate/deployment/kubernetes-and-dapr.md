---
title: Deploy to Kubernetes or Dapr
description: Operate PURISTA with explicit probes, graceful termination, workload identity, and platform components.
order: 1041
---

Kubernetes and Dapr change the operating environment, not PURISTA service
contracts. Install the Kubernetes helper only when its small Hono health and
endpoint surface fits your deployment. It does not create a Pod, configure
probes, or grant cloud permissions.

```bash title="Install Kubernetes HTTP helper"
npm install @purista/k8s-sdk @hono/node-server
```

```ts title="src/http.ts"
import { serve } from '@hono/node-server'
import { getHttpServer } from '@purista/k8s-sdk'

const app = getHttpServer({
  logger,
  services: [invoiceService],
  healthFn: () => eventBridge.isHealthy(),
  apiMountPath: '/api',
})

serve({ fetch: app.fetch, port: 3000 })
```

The helper exposes `/healthz` and HTTP-projected commands. Return healthy from
`healthFn` only when the process can serve the traffic this deployment sends to
it. On `SIGTERM`, its health endpoint begins returning `503`; pair that with a
platform termination grace period and the ordered shutdown described in
[graceful shutdown](/handbook/framework/secure-and-operate/reliability/graceful-shutdown/).

| Probe | Answer | Do not use it for |
| --- | --- | --- |
| Readiness | Can this instance accept its intended traffic now? | A remote dependency that would make a restart storm worse |
| Liveness | Is this process permanently stuck? | Every transient broker/store outage |
| Startup | Has a slow first initialization completed? | Continuous dependency health |

Kubernetes still owns scheduling, secrets, workload identity, network policy,
rollout, and backup. Keep the helper's generated HTTP projection behind the
same authentication/authorization policy as other Hono endpoints.

## Use Dapr as an explicit platform dependency

For Dapr, deploy the compatible sidecar and components before the application.
Scope pub/sub, state, configuration, and secret components to the workload and
namespace. Verify sidecar health and component permissions during rollout. A
Dapr package import alone does not add the sidecar to a Pod.

| Verify before serving traffic | Why |
| --- | --- |
| Sidecar can reach its configured component | A local sidecar process does not prove broker/store permission |
| Component is scoped to the application/namespace | Prevents an unrelated workload using it by name |
| Workload identity may read only its secrets and state | Component configuration is not an end-user/data authorization policy |
| `/healthz` and graceful termination work with the sidecar | Rollouts must stop intake before terminating message work |

Keep component YAML, secret/identity policy, and deployed sidecar version under
the platform's change control. Test the same business contract against the
actual component implementation; a mock sidecar cannot prove retention,
redelivery, or ACL behavior.

Next: [chapter overview](/handbook/framework/secure-and-operate/deployment/).
