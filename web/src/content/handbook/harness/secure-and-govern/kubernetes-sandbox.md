---
title: Run a Kubernetes sandbox
description: Execute tools in restricted pods and optionally recover run files through PVC generations and VolumeSnapshots.
order: 777
---

`@purista/harness-sandbox-kubernetes` is the first-party self-hosted production
adapter. It keeps the public Harness sandbox contract provider-neutral while
using Kubernetes Pods, PVCs, ConfigMaps, and optional VolumeSnapshots behind
that boundary.

## Install and compose once

Prepare a guest image before configuring the adapter. The
[minimal Alpine recipe](/handbook/harness/secure-and-govern/local-docker-sandbox/#start-with-the-minimal-alpine-recipe)
contains the Node.js and GNU grep runtime required here; it is shared with the
Docker adapter, not a different Kubernetes image or a Harness application image.
Build it for your cluster architecture, scan it and publish it to your own
registry. Set `PURISTA_SANDBOX_IMAGE` to the resulting
`registry/repository@sha256:…` manifest digest. A Docker-local `sha256:…` image
ID is not a registry reference. The Docker adapter need not be installed in
your Kubernetes worker; the image build can run in a separate build job.

Pods use UID/GID `65532:65532` and `fsGroup: 65532`, overriding the image's
Docker-oriented `1000:1000` default. The adapter mounts `/workspace`, `/skills`
and `/tmp`; verify that your volume driver supplies the required ownership.
Do not add a privileged entrypoint or a root init container to repair an
unverified storage configuration.

```sh title="Install the Kubernetes Harness sandbox adapter"
npm install @purista/harness@^3 @purista/harness-sandbox-kubernetes@^3
```

```ts title="src/harness/createExecution.ts"
import { kubernetesSandboxRuntime } from '@purista/harness-sandbox-kubernetes'

export const execution = kubernetesSandboxRuntime({
	namespace: process.env.PURISTA_SANDBOX_NAMESPACE!,
	image: process.env.PURISTA_SANDBOX_IMAGE!,
	runtimeId: 'payments-v1',
	serviceAccountName: 'purista-sandbox',
	workspace: {
		snapshotClassName: process.env.PURISTA_VOLUME_SNAPSHOT_CLASS,
	},
})
```

The factory returns `{ sandbox, workspace?, close }`. `workspace` exists only
when `workspace: true` or a workspace options object is supplied. Register the
returned adapters once at the application composition root; agent and workflow
definitions do not inspect Kubernetes or branch by deployment topology.

```ts title="src/harness/createRuntime.ts"
const harness = defineHarness({ name: 'payments' })
	.storage(storage)
	.sandbox(execution.sandbox)
	.workspace(execution.workspace)
	.requires([
		'storage.persistent',
		'workspace.durable',
		'workspace.checkpoint',
		'workspace.resume',
	])
	.models(models)
	.workflows(workflows)
	.build()

await harness.shutdown()
await execution.close()
```

`runtimeId` is part of every control record and provider resource name. Give
each independently administered Harness runtime a stable, distinct value when
it shares a namespace. Replicas of the same application use the same value so
they coordinate the same logical scopes.

## Understand the runtime boundary

<div class="overflow-x-auto" role="region" aria-label="Kubernetes resource ownership" tabindex="0">

| Resource | Purpose | Recovery meaning |
| --- | --- | --- |
| ConfigMap control record | Resource-version compare-and-swap for owners, generations, bindings, and lifecycle. | Fences stale attachments and coordinates replicas; it contains no prompt, file, or checkpoint payload. |
| Pod | Runs commands and filesystem operations as a non-root container. | Replaceable compute; losing it is not itself a committed checkpoint. |
| PVC generation | Holds the active `/workspace` files. | Durable while retained, but only a ready snapshot is a workflow recovery point. |
| `VolumeSnapshot` | Captures a committed workspace checkpoint. | Resume creates a new PVC generation from the selected snapshot and fences the old pod. |

</div>

Bounded text search runs where the data lives. Literal search uses `grep -F`;
safe regular-expression search uses `grep -E` only after Harness validates the
portable `safe_regex_v1` subset. Commands are tokenized and executed without a
host shell, so shell metacharacters are literal arguments rather than an
interpolation path.

## Apply cluster controls

The adapter creates restricted pod specifications: non-root execution,
read-only root filesystem, no privilege escalation, dropped Linux
capabilities, RuntimeDefault seccomp, resource limits, and no automatically
mounted service-account token. The cluster still owns the surrounding policy.

Provision these controls before accepting untrusted work:

- a dedicated sandbox namespace and an unprivileged **guest** service account;
- a separate **host/worker** identity with Role/RoleBinding access only to the
  resource kinds and namespace the adapter operates—never mount that identity
  into guest pods;
- Pod Security admission, ResourceQuota, LimitRange, and default-deny ingress
  and egress NetworkPolicies;
- a reviewed, digest-pinned image containing the required runtime and `grep`;
- a CSI driver and `VolumeSnapshotClass` when durable workspaces are enabled;
- storage encryption, snapshot retention, backup, quota, and orphan cleanup
  policies owned by the platform team.

Do not grant cluster-wide permissions. Do not inject application credentials
into general-purpose sandbox pods. Expose only the network destinations a
reviewed tool needs.

## Choose the low-effort path first

Use `inMemorySandbox()` for files and search in unit tests, or
`localDurableExecution()` for a trusted single host. Switch only the
application composition to this Kubernetes runtime when isolation,
multi-instance execution, or durable workspace recovery becomes necessary.
Agent tools and workflows remain unchanged.

Before production rollout, run the portable sandbox, text-search,
multi-client, and durable-workspace contracts, then add live cluster tests for
RBAC denial, network denial, resource limits, pod loss, snapshot restore,
stale-worker fencing, cancellation, and idempotent cleanup.
