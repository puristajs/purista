---
title: Run a Kubernetes sandbox
description: Bind a Kubernetes sandbox only after cluster isolation, workload identity, quotas, and workspace recovery are configured.
order: 744
---

Install `@purista/harness-sandbox-kubernetes` and provision namespace RBAC,
restricted images, quotas, network policy, and PVC/CSI support as required.

```ts title="Kubernetes Sandbox example 1"
const { sandbox, workspace } = kubernetesSandbox({ namespace: 'harness-support' })
const definition = defineHarness({ name: 'support' }).addWorkflow(workflow)
const harness = await definition.getInstance({ model: primaryModel, sandbox, workspace, storage })
```
The package does not grant cluster authority or make snapshots durable by
itself. Verify owner isolation, pod cleanup, cancellation, PVC binding,
checkpoint restore, missing state, and least-privilege credentials.
