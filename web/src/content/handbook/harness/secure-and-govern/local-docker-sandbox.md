---
title: Run a local Docker sandbox
description: Prepare a local Docker or OrbStack image, retain workspace files across attachments, and clean up owned resources.
order: 731
---

Use `@purista/harness-sandbox-docker` when trusted local tools need real Linux
commands or a persistent stdio process. It implements the same `Sandbox`
contract as the built-in adapters and works without the PURISTA Framework or a
model provider. OrbStack uses its normal Docker context; there is no separate
OrbStack adapter.

This is a trusted single-host development adapter. Docker daemon access is host
authority, not a hostile multi-tenant isolation guarantee. For files-only work,
start with [the built-in sandbox](/handbook/harness/secure-and-govern/sandbox-and-mcp/).

## Install and prepare the image

Use Node.js 24.15 or newer, the Docker CLI, and a local Linux-container engine
exposed through a Unix-socket Docker context. Install the adapter in the
application's runtime dependencies:

```sh title="Install the local sandbox package"
npm install @purista/harness @purista/harness-sandbox-docker
```

Provision the image yourself. The adapter never pulls, builds, installs
software, mounts host directories, or falls back to host execution. It requires
an immutable `repository@sha256:…` reference or local `sha256:…` image ID that
is already present. A moving tag such as `node:latest` is rejected.

The image needs `/bin/sh`, `sleep`, `base64`, GNU-compatible `find` and `stat`,
`realpath`, `dirname`, `mkdir`, `rm`, `cat`, and `test`. Prepare `/workspace`
for UID/GID `1000:1000`; prepare `/skills` too if you mount skills there.
The adapter validates tools and permissions before exposing a session.

```dockerfile title="sandbox/Dockerfile"
ARG BASE_IMAGE
FROM ${BASE_IMAGE}
USER 0:0
RUN mkdir -p /workspace /skills && chown 1000:1000 /workspace /skills
USER 1000:1000
WORKDIR /workspace
```

Pass an approved, already-local Debian-based Node image by its repository
digest as `BASE_IMAGE`. The build is an operator action, outside Harness:

```sh title="Build and identify the prepared sandbox image"
docker build --pull=false --network=none \
  --build-arg BASE_IMAGE="$SANDBOX_BASE_IMAGE" \
  -t harness-tools:local sandbox
docker image inspect harness-tools:local --format '{{.Id}}'
```

Set `SANDBOX_IMAGE` to that final image ID. Select your local context with the
Docker CLI, or set the adapter's optional `context`. Remote TCP/SSH contexts
and Windows containers are rejected. The adapter pins the resolved endpoint
and engine identity; switching the default context does not redirect a live
attachment.

## Verify files and commands without a model

This complete direct-adapter example writes a file, reads it through a guest
command, detaches, and verifies it through a new client. It prints `retained`.
Use a stable private `root` for an application that must reattach after restart.
The maintained [local example](https://github.com/puristajs/harness/tree/main/examples/local-docker-sandbox)
also handles temporary-root cleanup and failure reporting.

```ts title="src/checkSandbox.ts"
import { resolve } from 'node:path'
import { dockerSandbox } from '@purista/harness-sandbox-docker'
import type { SandboxScope } from '@purista/harness'

const image = process.env.SANDBOX_IMAGE
if (!image) {
  throw new Error('SANDBOX_IMAGE must identify the prepared local sandbox image.')
}

const options = { root: resolve('.sandbox-state'), image }
const scope: SandboxScope = {
  owner: {
    namespace: 'local-tools',
    id: 'file-check',
    instanceId: '01JQ7Z9Q69STZ33MGH6V5ASR7J',
  },
  partition: { kind: 'shared' },
  lifetime: 'session',
}
const sandbox = dockerSandbox(options)
try {
  await sandbox.registerOwner({ owner: scope.owner, mode: 'create' })
  const first = await sandbox.open({ scope, mode: 'create' })
  try {
    await first.session.write('/workspace/check.txt', 'retained')
    const result = await first.session.exec('cat /workspace/check.txt')
    if (result.exitCode !== 0) throw new Error('Guest command failed')
  } finally {
    await first.session.close()
  }
  const nextSandbox = dockerSandbox(options)
  await nextSandbox.registerOwner({ owner: scope.owner, mode: 'attach' })
  const next = await nextSandbox.open({ scope, mode: 'attach' })
  try {
    console.log(await next.session.readText('/workspace/check.txt'))
  } finally {
    await next.session.close()
  }
} finally {
  await sandbox.terminate({ scope, reason: 'manual' })
}
```

Ordinary applications register this adapter with
`defineHarness(...).sandbox(dockerSandbox(options))`, then add their model,
tool, agent, and workflow definitions. Harness supplies scopes and lifecycle
calls; handlers never manage provider IDs, leases, generations, or topology.
PURISTA applications pass the same adapter through Framework runtime wiring.
Neither the adapter nor Harness imports Framework packages.

## Operate cleanup as application business policy

The adapter provides exact lifecycle state; the application owns the decision
to create an owner, retain it, or delete it. Authenticate and authorize every
`SandboxAdministration` action before invoking it. Use exact tenant/principal
selectors for offboarding, bounded `list` pages for inventory, and idempotent
`purge`/`sweep` retries for cleanup. Do not expose provider references, owner
identities, cursors, snapshots, or engine diagnostics in service logs or
telemetry.

Principal offboarding fences that principal immediately, including a live
attachment. It does not destroy a tenant-owned shared sandbox that another
authorized tenant principal still uses. A cleanup response may be
`cleanup_pending` with `retryAfterMs`; keep private adapter state and retry
instead of deleting metadata or creating an empty replacement.

## Defaults and limits

| Option | Default | Effect |
| --- | --- | --- |
| `root`, `image` | Required | Private lifecycle metadata and immutable, pre-provisioned image |
| `context` | Current Docker context, resolved once | Local engine selection |
| `user` | `1000:1000` | Non-root guest UID/GID |
| `network` | `none` | `bridge` explicitly enables networking, not a destination allowlist |
| `resources.cpus` | `1` | CPU limit |
| `resources.memoryMb` | `512` | Memory limit |
| `resources.pids` | `128` | Process limit |
| `resources.tmpfsMb` | `64` | Temporary filesystem limit |

Unknown fields are rejected. There is no raw Docker-flag or host-mount escape
hatch. All filesystem paths are absolute guest paths. `/workspace` is the
private retained volume and default command directory; image-layer files
elsewhere are not durable workspace checkpoints.

CLI operations and commands use Harness `toolTimeoutMs`, or 120 seconds when
used independently. `exec` can override `timeoutMs`. stdout and stderr are each
bounded to 10 MiB, including streaming output; overflow fails explicitly.
Binary reads share the base64-encoded output bound. Named volumes have no
portable hard disk quota: monitor the engine's disk use.

## Release, recovery, and cleanup

`SandboxSession.close()` invalidates that attachment. The final detach stops
guest compute and releases exclusive ownership while retaining the container,
volume, and metadata. Another adapter can then attach and restart the retained
container. Two independent adapter instances cannot concurrently own one scope;
an ownership conflict fails rather than silently taking over a live owner.

At Harness level, `session.release()` preserves history and files;
`session.close()` terminates the sandbox before deleting the conversation.
Explicit termination removes only the recorded, labeled container and volume
and keeps a tombstone. There is no global prune, idle expiry, or cleanup daemon.

Timeout, cancellation, and process cleanup may stop the whole owned container
to ensure guest processes have stopped. Other attachments to that scope may
also lose their processes. Reattach to use retained files; live-process
preservation is not advertised. Retry failed cleanup after the engine recovers;
do not delete lifecycle metadata as a repair.

Missing metadata, a missing container, or a missing volume raises
`SandboxStateLostError`. Engine outages raise an operational error and do not
authorize empty replacement. `restore` is unsupported: retained volumes are
not committed `DurableWorkspace` checkpoints, and the adapter does not advertise
workspace binding, snapshots, hibernation, or read-only Agent Plugin mounts.
For compute-loss recovery, choose a compatible sandbox/workspace pair from
[durable workspace guidance](/handbook/harness/manage-context-and-state/durable-workspaces/).

Lifecycle telemetry contains operation, outcome, duration, and normalized error
types—not commands, paths, provider references, identities, or output. Keep
host inspection restricted to trusted operators. Disabling the adapter does
not delete retained resources.

## Test your engine

The package's normal tests run without Docker. Its opt-in `test:docker` suite
uses a caller-provisioned image and disposable owned resources to verify the
shared lifecycle contract, binary files, cancellation, and reattachment.
The verified target is macOS 26.5.2 arm64 with OrbStack 2.2.3 and Docker
CLI/Engine 29.4.0: 20 live checks and the standalone example passed.
Docker Desktop and Linux Docker Engine remain compatibility targets unless
their own live-suite evidence is recorded; support is not inferred from Docker
CLI compatibility alone.

Continue with [sandbox selection and MCP](/handbook/harness/secure-and-govern/sandbox-and-mcp/)
for the shared contract and production isolation requirements.
