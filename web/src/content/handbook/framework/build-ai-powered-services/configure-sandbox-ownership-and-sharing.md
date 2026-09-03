---
title: Configure sandbox and workspace isolation
description: Declare portable sandbox needs in Harness and bind deployment-specific isolation, workspace, and ownership policy through the service runtime.
order: 3993
---

The Harness definition declares what an agent or workflow needs. The
composition root selects concrete sandbox and workspace adapters and the
deployment policy that may satisfy them.

```ts title="Bind sandbox and workspace adapters"
const service = await supportV1Service.getInstance(eventBridge, {
  resources,
  ai: {
    models,
    sandbox,
    sandboxBinding,
    workspace,
    storage,
  },
})
```

Build the sandbox scope from trusted tenant, principal, session, run, and target
identity. Never accept a host path, container id, network policy, owner id, or
credential from model output.

Use private workspaces by default. Share a workspace only when the application
has a clear owner, retention policy, quota, encryption boundary, cleanup path,
and authorization check. Persisted workspace references and workflow
checkpoints must be resumable together.

Keep transactional business data in a database resource. A sandbox filesystem
is execution state, not the system of record.
