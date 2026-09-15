---
title: Configure sandbox and workspace isolation
description: Declare portable sandbox needs in Harness and bind deployment-specific isolation, workspace, and ownership policy through the service runtime.
order: 3993
---

The Harness definition declares its sandbox requirement. The composition root
selects the adapter and the deployment policy that may satisfy it. Without a
policy, every root receives a private sandbox partition.

For an agent that needs a named shared partition, declare the group in the
immutable Harness graph:

```ts title="src/service/support/v1/harness/agent/reviewIncident.ts"
export const reviewIncident = defineAgent('reviewIncident', {
  model: 'answering',
  sandbox: { group: 'support-review' },
  // input, output, tools, and instructions
})
```

Then give that declared group runtime consent. The runtime does not repeat the
group name: the compiled graph is the source of truth.

```ts title="Bind sandbox and workspace adapters"
const service = await supportV1Service.getInstance(eventBridge, {
  resources,
  ai: {
    models,
    sandbox: {
      adapter: sandbox,
      policy: {
        sharing: 'declared',
        default: { group: 'support-review' },
        authorizeBorrowedOwner,
      },
    },
    workspace,
    storage,
  },
})
```

Build the sandbox scope from trusted tenant, principal, session, run, and target
identity. Never accept a host path, container id, network policy, owner id, or
credential from model output.

`sharing: 'declared'` permits only groups declared by the Harness graph.
`default` chooses the declared group for roots that do not select one more
specifically.
`authorizeBorrowedOwner` must approve an attempt to attach to an existing
owner; without it, borrowed owners are denied. Use private sandbox scopes by
default. Share a sandbox only when the application has a clear owner,
retention policy, quota, encryption boundary, cleanup path, and authorization
check. Persisted workspace references and workflow
checkpoints must be resumable together.

Keep transactional business data in a database resource. A sandbox filesystem
is execution state, not the system of record.
