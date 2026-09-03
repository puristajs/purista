---
title: Run a local Docker sandbox
description: Prepare a local Docker or OrbStack image, retain workspace files across attachments, and clean up owned resources.
order: 776
---

Use `@purista/harness-sandbox-docker` when trusted local tools need real Linux
commands or a persistent stdio process. It implements the same `Sandbox`
contract as the built-in adapters and works without the PURISTA Framework or a
model provider. OrbStack uses its normal Docker context; there is no separate
OrbStack adapter.

By the end of the local setup, the adapter opens a prepared image by immutable
ID, writes a workspace file, executes `cat` inside the guest, detaches,
reattaches, and reads the retained file. Complete that direct adapter check
before adding a model or agent.

This is a trusted single-host development adapter. Docker daemon access is host
authority, not a hostile multi-tenant isolation guarantee. For files-only work,
start with [the built-in sandbox](/handbook/harness/secure-and-govern/sandbox-and-mcp/).

## 1. Install and prepare the image

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

### Start with the minimal Alpine recipe

The adapter package includes an
[Alpine-based image recipe and smoke check](https://github.com/puristajs/harness/tree/main/packages/harness-sandbox-docker/image).
It supplies Node.js 24, `/bin/sh`, GNU coreutils, findutils and grep. Bare
Alpine is not sufficient: BusyBox's `find` / `stat` / `grep` do not provide all
the flags this adapter requires, and the Kubernetes adapter also needs Node.

The final image runs as `1000:1000`, prepares `/workspace` and `/skills`, removes
setuid/setgid file bits and omits Git, SSH, npm, Yarn, Corepack, the APK client,
compilers and application files. Removed development tools do not remain in
lower layers of the final image. Build it from the small packaged context:

```sh title="Build and identify the prepared sandbox image"
docker build --pull -t harness-sandbox:local \
  node_modules/@purista/harness-sandbox-docker/image
export SANDBOX_IMAGE="$(docker image inspect harness-sandbox:local --format '{{.Id}}')"
```

This builds **your guest image**, not Harness or any npm package. The build
needs network access to the pinned official Node base and Alpine package
repositories; guest networking remains disabled by the adapter's default.
No public PURISTA container image is implied: you build and own the artifact.

Run the recipe's [restricted smoke check](https://github.com/puristajs/harness/tree/main/packages/harness-sandbox-docker/image#build-and-verify)
to verify read-only-root compatibility, non-root execution and the required
commands independently. Expect `Sandbox image smoke passed`, then complete
the direct adapter check below to verify volume ownership and reattachment.
Missing commands or a non-writable workspace fail preflight; the adapter does
not install tools or repair permissions as root.

The recipe is a starting point, not a coding-agent workstation. For additional
tools, copy it into your application-owned image build and add reviewed
dependencies before final hardening. Alpine uses musl; binaries or native npm
modules requiring glibc need a separately reviewed compatible image. See the
[official Node image variants](https://github.com/nodejs/docker-node#image-variants).

Select your local context with the
Docker CLI, or set the adapter's optional `context`. Remote TCP/SSH contexts
and Windows containers are rejected. The adapter pins the resolved endpoint
and engine identity; switching the default context does not redirect a live
attachment.

### Keep image hardening separate from runtime isolation

The image is compatible with read-only root, but the current Docker adapter
does **not** enable read-only root. It enforces a non-root user, dropped
capabilities, no-new-privileges, resource limits and default-deny networking.
The Kubernetes adapter additionally sets read-only root; its namespace network
policy remains an operator responsibility.

Removing package managers is not an execution or exfiltration barrier: Node
can run code and open sockets, and BusyBox includes networking applets. Never
inject model, Git, registry, SSH-agent or cloud credentials into the guest.
Keep privileged operations in authenticated host-side services. Native
TypeScript tool handlers remain in the Harness host process; only dispatched
sandbox operations execute in the container.

Scan and promote the **final image digest**, retain an SBOM and notices, and
rebuild when dependencies change. The base digest is pinned, but Alpine
packages resolve at build time; this is not a fully reproducible package lock.
`--pull` does not advance the pinned base digest. Review digest updates and
rerun the checks before promotion; see
[Docker's image-maintenance guidance](https://docs.docker.com/build/building/best-practices/).

## 2. Verify files and commands without a model

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

Ordinary applications start with `defineHarness(...)` and register this
adapter through `.sandbox(dockerSandbox(options))`, then add their model,
tool, agent, and workflow definitions. Harness supplies scopes and lifecycle
calls; handlers never manage provider IDs, leases, generations, or topology.
PURISTA applications pass the same adapter through Framework runtime wiring.
Neither the adapter nor Harness imports Framework packages.

## 3. Wire the verified adapter into Harness

After the direct check succeeds, pass the same adapter configuration to the
composition root:

```ts title="src/createLocalToolsHarness.ts"
import { defineHarness } from '@purista/harness'
import { dockerSandbox } from '@purista/harness-sandbox-docker'

export function createLocalToolsBuilder(options: Parameters<typeof dockerSandbox>[0]) {
	return defineHarness({ name: 'local-tools' }).sandbox(dockerSandbox(options))
}
```

Continue this returned builder with the normal `.models(...)`, inline
`.tool(id, definition)` or reusable `.tools(record)`, `.agent(...)`, and
`.build()` stages. Registering the sandbox before tools
makes handler types expose the verified filesystem, bounded text-search, exec,
and spawn capabilities. The Docker adapter does not create or authorize models, tools, or
agents.

[`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/)
creates the composition root. [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox)
registers this adapter and projects only its declared capabilities into later
handler types; it does not provision an image, authorize an owner, or prove the
engine's isolation by itself.

Adapter API reference: [`dockerSandbox(...)`](/handbook/api/functions/_purista_harness-sandbox-docker.dockerSandbox/)
and [`DockerSandboxOptions`](/handbook/api/interfaces/_purista_harness-sandbox-docker.DockerSandboxOptions/).

## 4. Operate cleanup as application business policy

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

<div class="overflow-x-auto" role="region" aria-label="Sandbox operations" tabindex="0">

| Operation | What it does | Important boundary |
| --- | --- | --- |
| `registerOwner({ owner, mode })` | Creates or attaches the immutable owner record before a scope is opened | `attach` requires existing consistent metadata; it never reconstructs missing state |
| `open({ scope, mode, identity?, signal? })` | Opens `create` or `attach` access to one exact scope | `restore` is unsupported; identity and owner/scope checks fail closed |
| `session.read*`, `write`, `list`, `glob` | Access absolute guest paths through the sandbox contract | Paths cannot escape the guest boundary; `/workspace` is the retained volume |
| `session.searchText(...)` / built-in `grep` | Run bounded literal or `safe_regex_v1` matching inside the guest | Contents stay in the guest; fixed limits and explicit completeness prevent an unbounded core-side scan |
| `session.exec(...)`, `spawn(...)` | Runs a guest command under configured CPU, memory, PID, network, user, timeout, and output limits | No host fallback, host mount, arbitrary Docker flag, or implicit network access |
| `SandboxSession.close()` | Detaches this client and stops compute after the final attachment | Retains recorded container/volume state for a later attach |
| `terminate({ scope, reason })` | Removes the exact recorded container and volume and leaves a tombstone | Idempotent for an already terminated scope; never performs a global Docker prune |
| `administration.list(...)` | Returns a bounded, content-free page selected by exact owner, tenant, or principal | Default page size `100`, maximum `1_000`; cursors are selector-bound |
| `administration.purge(...)` | Idempotently deletes a selected owner's resources in bounded batches | Requires an idempotency key and may return `cleanup_pending` |
| `administration.sweep(...)` | Retries bounded resources already eligible for cleanup | It is not an idle-expiry scheduler; the application decides when to run it |

</div>

Shared API reference: [`Sandbox`](/handbook/api/types/_purista_harness.Sandbox/),
[`SandboxSession`](/handbook/api/types/_purista_harness.SandboxSession/), and
[`SandboxAdministration`](/handbook/api/interfaces/_purista_harness.SandboxAdministration/).

## 5. Review defaults and limits

<div class="overflow-x-auto" role="region" aria-label="Docker sandbox defaults" tabindex="0">

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
| `administration.maxCatalogEntries` | `10_000` | Maximum private lifecycle journal entries |
| `administration.selectorRevocationReserve` | `256` | Capacity reserved for owner/tenant/principal revocation and purge progress |
| `administration.maxActiveSandboxes` | `64` | Maximum active sandbox records before creation fails with a quota error |

</div>

Unknown fields are rejected. There is no raw Docker-flag or host-mount escape
hatch. All filesystem paths are absolute guest paths. `/workspace` is the
private retained volume and default command directory; image-layer files
elsewhere are not durable workspace checkpoints.

CLI operations and commands use Harness `toolTimeoutMs`, or 120 seconds when
used independently. `exec` can override `timeoutMs`. stdout and stderr are each
bounded to 10 MiB, including streaming output; overflow fails explicitly.
Binary reads share the base64-encoded output bound. Named volumes have no
portable hard disk quota: monitor the engine's disk use.

## 6. Handle release, recovery, and cleanup

`SandboxSession.close()` invalidates that attachment. The final detach stops
guest compute and releases exclusive ownership while retaining the container,
volume, and metadata. Another adapter can then attach and restart the retained
container. Two independent adapter instances cannot concurrently own one scope;
an ownership conflict fails rather than silently taking over a live owner.

At Harness level, `session.release()` preserves history and files;
`session.destroy()` terminates the sandbox before deleting the conversation.
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

## 7. Test your engine

The package's normal tests run without Docker. Its opt-in `test:docker` suite
uses a caller-provisioned image and disposable owned resources to verify the
shared lifecycle contract, binary files, cancellation, and reattachment.
Historical verification on 2026-08-26 used macOS 26.5.2 arm64 with OrbStack
2.2.3 and Docker CLI/Engine 29.4.0: 20 live checks and the standalone example
passed. The 2026-08-31 minimal-image check passes for both guest UIDs, but the
current full adapter suite has three failures also reproduced with the older
Debian image: negative-request fixture cleanup and streaming-close ownership.
See the [current verification record](https://github.com/puristajs/harness/tree/main/packages/harness-sandbox-docker/image#verification-snapshot-2026-08-31).
The historical run does not make the current live-adapter gate green.
Docker Desktop and Linux Docker Engine remain compatibility targets unless
their own live-suite evidence is recorded; support is not inferred from Docker
CLI compatibility alone.

Continue with [sandbox selection](/handbook/harness/secure-and-govern/sandbox-and-mcp/)
for the shared contract and production isolation requirements. Configure an
MCP transport separately in [Connect MCP tools](/handbook/harness/add-capabilities/mcp/).
