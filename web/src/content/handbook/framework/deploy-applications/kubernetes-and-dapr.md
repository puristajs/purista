---
title: Deploy to Kubernetes or Dapr
description: Operate PURISTA with explicit probes, graceful termination, workload identity, and platform components.
order: 1054
---

Kubernetes and Dapr change the operating environment, not PURISTA service
contracts. Install the Kubernetes helper only when its small Hono health and
endpoint surface fits your deployment. It does not create a Pod, configure
probes, or grant cloud permissions.

```bash title="Install the Kubernetes HTTP helper"
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

On `SIGTERM`, stop readiness/intake before terminating message work. Kubernetes
still owns scheduling, secrets, workload identity, network policy, rollout,
and backup.

For Dapr, deploy compatible sidecars and scoped components before the
application. Package installation alone does not add a sidecar. Verify sidecar
health, component connectivity, workload identity, namespace/application
scope, graceful termination, and the actual component's retention/redelivery
behavior before serving traffic.

Use [Dapr EventBridge configuration](/handbook/framework/connect-distributed-infrastructure/event-delivery/dapr/)
and the store adapter guides for exact application wiring.
