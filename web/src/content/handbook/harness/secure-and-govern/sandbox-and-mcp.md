---
title: Choose a sandbox and MCP boundary
description: Configure the smallest file, command, or MCP execution boundary that the agent actually needs.
order: 730
---

A sandbox is the session-owned boundary for files and, when an adapter declares
it, commands or processes. It is not authentication, authorization, tenant
isolation, a secret manager, or automatically a container/microVM. Start
files-only; only choose an executor when its platform can make the promised
isolation true.

## One lifecycle, independent of deployment shape

Your agent and service code use one Sandbox contract. Whether an adapter is a
single local process or has its own multi-instance control plane is internal to
that adapter; it must not change business logic or add a second API.

| Operation | Meaning | What must never happen |
| --- | --- | --- |
| `create` | Allocate a previously unseen logical scope | Reuse an old scope as if it were new |
| `attach` | Obtain another client attachment to retained logical compute | Create an empty sandbox when state is missing |
| `restore` | Reopen a run only after a compatible durable workspace checkpoint is bound | Treat a retained process or volume as a checkpoint |
| `session.release()` | Detach this client and invalidate its sandbox handle | Delete retained files or the logical scope |
| `session.close()` | Detach, terminate, then remove the Harness session record | Leave a live sandbox behind after deleting its record |

Harness binds the logical scope to its persisted session identity. Adapters keep
provider references, leases, generations, and cleanup metadata private. If an
existing scope or a required workspace checkpoint is absent, Harness reports
`SandboxStateLostError`; it never silently replaces the sandbox with empty
files. Durable workspace files are the recovery guarantee. Preserving a live
process is only an adapter capability, not a promise made by the common API.
Adapters may stop guest processes on detach; an attachment is not a process
continuity guarantee. A random persisted session instance ID distinguishes
recreated conversations even when their timestamps are identical.

## Choose the smallest capability set

| Option | Files and lifetime | Exec / process capability | Appropriate use | Do not claim |
| --- | --- | --- | --- | --- |
| `inMemorySandbox()` | Ephemeral per session | No exec; no `spawn` | Reviewed files and ordinary TypeScript/HTTP tools | Host, process, or tenant isolation |
| `bashSandbox()` | Ephemeral per session | Optional `just-bash` `exec`; no `spawn` | Trusted development or a tightly controlled transformation | Container/VM isolation or stdio MCP support |
| Local durable execution | Persistent host directory | Files-only by default; optional host exec | A trusted single-host worker with explicit retention | A hardened boundary for untrusted model-directed commands |
| Docker / OrbStack local adapter | Retained Docker volume; local engine only | Guest `exec` and `spawn`; network disabled by default | Trusted local development with a caller-prepared image | Durable-workspace recovery, hostile multi-tenancy, or a production provider |
| Custom isolating adapter | Adapter-defined | Declare only enforced `exec`, `spawn`, mounts, and network controls | Production commands or stdio MCP | Any isolation the platform does not enforce |

`bashSandbox()` needs its peer only when you choose it:

```sh title="Install the bashSandbox peer"
npm install just-bash
```

`@modelcontextprotocol/client` is another opt-in peer. Install it before
declaring an MCP HTTP or stdio tool:

```sh title="Install the MCP client peer"
npm install @modelcontextprotocol/client
```

For a container-backed local executor, follow
[Run a local Docker sandbox](/handbook/harness/secure-and-govern/local-docker-sandbox/).
That separate package uses the normal Docker context, including OrbStack,
without a second API. It retains local files but does not provide committed
durable-workspace recovery or immutable Agent Plugin mounts.

## Start with a files-only tool

The application authorizes and stages a support document before the agent runs.
The tool can read only its session sandbox and receives a filename with a
narrow, non-path schema. The filename check is still not authorization: the
application decides which document can be staged for which principal and
tenant.

This composition fragment defines the sandbox and reviewed tool. Continue the
builder with your model and agent definitions before calling `.build()`.

```ts title="src/claimsReviewBuilder.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

export const claimsReviewBuilder = defineHarness({ name: 'claims-review' })
  .sandbox(inMemorySandbox())
  .tools(({ tool }) => ({
    read_claim_evidence: tool({
      description: 'Read one application-authorized evidence file staged for this claim.',
      input: z.object({ filename: z.string().regex(/^[a-z0-9._-]+$/i) }),
      output: z.object({ text: z.string().max(20_000) }),
      handler: async (ctx, { filename }) => ({
        text: await ctx.sandbox.readText(`/workspace/evidence/${filename}`),
      }),
    }),
  }))
```

| Call or field | What it declares | Security and runtime boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Begins one named Harness composition root. | The name appears in diagnostics; it does not authorize the agent, create a tenant partition, or choose a sandbox provider. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the files-only, ephemeral core sandbox and carries its capabilities into later tool/agent definitions. | Use it for staged application-authorized files. It has no `exec` or `spawn`; no filesystem adapter makes a filename regular expression into authorization. |
| [`.tools(({ tool }) => ...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers typed custom tool definitions before an agent can name them. The helper preserves each tool ID and schemas in builder inference. | Tools are denied to agents until that agent declares the tool in its own `tools` allowlist. Registering a tool alone does not expose it to a model or HTTP caller. |
| `tool({ description, input, output, handler })` | Declares a model-visible description, schema-validated input/output, and the application handler. | Keep `description` factual and `input` narrow. The handler receives the session sandbox and cancellation context, but it must still enforce the application decision that staged the evidence. |

Keep `builtinTools: false` and the agent's `tools` list empty until a reviewed
use case needs this tool. Do not make `readText()` or filesystem path handling
your access-control mechanism.

## Prefer remote MCP when the service has its own boundary

Use Streamable HTTP MCP for a reviewed remote service that can authenticate,
authorize, rate-limit, and audit each request itself. It needs no local process,
so the files-only sandbox is still a suitable default.

This fragment adds the transport to a builder; model and agent selection remain
application configuration.

```ts title="src/policyLookupBuilder.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'

const policyUrl = process.env.CLAIMS_POLICY_MCP_URL
const policyToken = process.env.CLAIMS_POLICY_MCP_TOKEN
if (!policyUrl || !policyToken) {
  throw new Error('CLAIMS_POLICY_MCP_URL and CLAIMS_POLICY_MCP_TOKEN are required.')
}

export const policyLookupBuilder = defineHarness({ name: 'policy-lookup' })
  .sandbox(inMemorySandbox())
  .tools({
    claim_policy: {
      kind: 'mcp_http',
      description: 'Look up a policy clause for an authorized claim.',
      url: policyUrl,
      auth: { kind: 'bearer', token: policyToken },
      redirect: 'error',
      tool: 'policy.lookup',
    },
  })
```

| Call or field | What it declares | Security and runtime boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Begins one named Harness composition root. | The name appears in diagnostics; it does not authorize the agent, create a tenant partition, or choose a sandbox provider. |
| [`.tools({ claim_policy: ... })`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers a declarative remote MCP tool under the stable Harness tool ID `claim_policy`. | It is still unavailable until an agent explicitly allowlists `claim_policy`. The ID is local; `tool` selects the remote MCP method. |
| `kind: 'mcp_http'` | Uses Streamable HTTP MCP through the optional `@modelcontextprotocol/client` peer. | Install the peer before starting this configuration. This is a remote service boundary, so the MCP server must authenticate and authorize every operation. |
| `url`, `auth`, and `redirect` | Select the endpoint, bearer credential, and redirect policy. | Use HTTPS and short-lived credentials. `redirect: 'error'` rejects redirects rather than forwarding a credential to a different destination. Missing peer, authentication, transport, or protocol failures fail the tool call; they never become an empty policy answer. |
| `tool` | Names the tool exported by that MCP server. | Pin the remote tool name in an integration contract and test protocol/schema cancellation with a fake MCP server before enabling an agent. |

Use HTTPS, short-lived task-scoped credentials, and `redirect: 'error'` for a
credentialed endpoint. The server remains the authority for the principal and
resource; Harness only connects and validates the declared tool boundary.

## Treat stdio MCP as a process boundary

`mcp_stdio` starts and owns one persistent process through a sandbox with
`spawn`. The standard in-memory and bash sandboxes cannot provide this; enabling
host execution in a durable local sandbox also does not turn it into a
production isolation boundary. Use a custom adapter backed by an isolating
platform for untrusted documents, commands, plugins, or multi-tenant traffic.

The following fragment assumes an application-owned isolating adapter; it is
not an import supplied by Harness.

```ts title="src/evidenceExtractionBuilder.ts"
import { defineHarness } from '@purista/harness'
import { createIsolatedSandbox } from './adapters/createIsolatedSandbox.js'

export const evidenceExtractionBuilder = defineHarness({ name: 'evidence-extraction' })
  .sandbox(createIsolatedSandbox()) // adapter declares and enforces sandbox.spawn
  .tools({
    extract_evidence: {
      kind: 'mcp_stdio',
      description: 'Extract text from a reviewed document in the workspace.',
      command: '/opt/claims-mcp/bin/server',
      args: ['--workspace', '/workspace'],
      cwd: '/workspace',
      env: { EXTRACTION_MODE: 'text-only' },
      tool: 'evidence.extract',
    },
  })
```

| Call or field | What it declares | Security and runtime boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the named local composition root for the isolated adapter. | Its name is not an isolation guarantee; the application-owned adapter must enforce that guarantee. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the isolating adapter before the MCP tool needs its `sandbox.spawn` capability. | The fluent capability type prevents a normal tool handler from assuming unsupported operations; production safety still depends on the adapter's platform enforcement. |
| [`.tools(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers the declarative stdio MCP tool under the local `extract_evidence` ID. | Registration is not exposure: a later agent must explicitly allowlist that ID, and only then can the Harness start the reviewed process. |
| `createIsolatedSandbox()` | An application-owned adapter factory; it is not supplied by Harness. | Its implementation must advertise and enforce `sandbox.spawn` plus the resource, mount, identity, and egress controls listed below. Do not use a type assertion to claim those capabilities. |
| `kind: 'mcp_stdio'` | A persistent stdio MCP process started inside the selected sandbox. | It requires the optional MCP client peer and a sandbox that declares `spawn`. In-memory and bash sandboxes are rejected for this shape. |
| `command`, `args`, `cwd`, and `env` | Static deployment-selected process configuration. | Keep them out of model input. Use an absolute reviewed command, a sandbox path for `cwd`, a short allowlist of non-secret environment values, and platform policy for credentials and network egress. |
| `tool` | The one MCP method the Harness tool invokes. | The agent must still explicitly allowlist `extract_evidence`; tool registration does not grant arbitrary MCP discovery or execution. |

The command, image/package, mounts, environment, and destination policy belong
to deployment configuration—not model input. Agent Plugin stdio adds an
immutable reviewed package requirement: use read-only package mounts and keep
mutable data outside that package root.

## Apply sharing and cleanup policy in the application

Sandbox sharing is visible as `inherit`, `private`, or authorized `group`
workflow policy. The default background-child policy is a fresh task-run shared
partition, and history is always private. Whether the adapter starts a local
process, Docker container, or remote instance is intentionally invisible to
business code.

The application authenticates and authorizes owner registration and every
`SandboxAdministration` call. Scope owners may contain exact tenant and
principal dimensions, so offboarding can fence one principal without deleting
an active tenant-shared sandbox used by another principal. Use bounded
inventory, exact selectors, and retryable purge/sweep jobs. A
`cleanup_pending` result is an honest outcome, not a successful deletion.

Keep provider references, ownership identities, pagination cursors, snapshots,
file paths/content, and engine diagnostics out of telemetry and ordinary logs.
If a retained resource or required checkpoint is missing, handle
`SandboxStateLostError`; never create an empty sandbox in its place.

## Define what your production adapter enforces

Before authorizing an exec- or spawn-capable deployment, document and test all
of these controls in the adapter platform:

- Per-run and tenant-scoped workspace roots, retention, secure cleanup, and
  read-only reviewed mounts.
- Unprivileged process identity; pinned image/package provenance; no inherited
  host credentials; task-scoped secret injection.
- Default-deny network egress, DNS/proxy policy, metadata-service protection,
  and a destination allowlist.
- Enforced CPU, memory, PID, disk, and wall-clock limits, plus cancellation and
  idempotent process cleanup.
- Negative tests for host paths, cross-tenant files, forbidden command/egress,
  missing executor, expired credentials, timeout, cancellation, and stale
  workspace data.

Run `sandboxContract(() => createIsolatedSandbox(), { executor: 'available' })`
from `@purista/harness/testing` for the generic adapter contract, then add
platform integration tests for the isolation properties that a generic contract
cannot prove.
