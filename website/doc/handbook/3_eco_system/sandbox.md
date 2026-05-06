---
title: Sandbox Runtime
description: Sandbox-backed execution in @purista/ai for secure agent and tool workloads
order: 303500
---

# Sandbox

`@purista/ai` provides the sandbox runtime for isolated agent and tool workloads.

Read this page only when your agent needs a real workspace. For many agents, sandbox is unnecessary.

The default PURISTA AI flow stays:

1. define with the builder
2. implement with the handler context
3. create the instance
4. add sandbox only if the agent must execute in an isolated filesystem/runtime

Sandbox adds:

- tenant-aware sandbox lifecycle (`tenantId` + `principalId` from PURISTA message metadata, plus `projectId`)
- optional scope-based sandbox isolation for parallel runs
- command execution and file read/write inside isolated runtimes
- pluggable runtime backends with Docker-compatible and Podman support in `@purista/ai`
- registry reconciliation on service startup

## When To Use

Use sandbox when:

- agents need shell access, but not full host access
- each project/user must run in isolated workspaces
- parallel agents may need either a shared workspace or isolated sandboxes per run
- you want one execution abstraction while switching infra backends
- you need audit-friendly metadata around runtime ownership

Do not use sandbox just because the workload is “AI”.

Use it only when the agent needs:

- shell commands
- repository operations
- skill scripts
- isolated generated files

## Runtime Backends

| Backend | Status | Good default for | Platform notes | External docs |
| --- | --- | --- | --- | --- |
| AppleContainerSandboxDriver | supported | local macOS developer setups | Docker-compatible runtimes such as OrbStack/Colima | [OrbStack](https://orbstack.dev/), [Colima](https://github.com/abiosoft/colima) |
| Docker | supported | most teams starting out | widely available, broad ecosystem | [Docker Docs](https://docs.docker.com/) |
| Podman | supported | rootless/container-security setups | daemonless model | [Podman Docs](https://podman.io/docs) |

Related runtimes often used with Docker driver:

- [OrbStack](https://orbstack.dev/)
- [Colima](https://github.com/abiosoft/colima)

Future VM and microVM backends such as Lima, Tart, and Firecracker are intentionally not shipped as in-package drivers anymore. When they are implemented to production quality, they should arrive as dedicated sandbox adapter packages with their own dependency and readiness contracts.

## Base Image Guidance

- Default: use `Dockerfile.sandbox` (Debian slim). This is the most compatible option for mixed AI toolchains.
- Optional: use `Dockerfile.sandbox.alpine` when image size/startup speed is more important than compatibility.
- Alpine caveat: some native binaries and glibc-targeted tools may require additional adaptation.

## Quick Start

The simplest sandbox adoption path is:

1. build a sandbox image
2. start the sandbox service
3. ensure one sandbox for the workload scope
4. execute commands or sync files inside that sandbox

### 1. Build a sandbox image

Use a hardened image with `bash`, `git`, `gh`, and tooling required by your agents.

```bash
npm run sandbox:image:build -w packages/ai
```

Optional Alpine variant:

```bash
docker build -t purista-sandbox-agent:alpine -f packages/ai/Dockerfile.sandbox.alpine .
```

Keep the image startup contract compatible with the PURISTA drivers:

- no custom `ENTRYPOINT`
- `CMD ["tail", "-f", "/dev/null"]`

The drivers start a long-running container first and then execute commands via
`docker exec` / equivalent runtime APIs.

## Canonical Workspace Layout

Sandboxed applications and agents should use one stable filesystem contract so
scripts, skills, and repo operations remain portable across apps:

```text
/workspace/
  repo/
  skills/
    <skill-name>/
  tmp/
  outputs/
```

Semantics:

- `/workspace/repo` is the checked-out or synchronized project repository
- `/workspace/skills/<skill-name>` is the materialized filesystem skill bundle
- `/workspace/tmp` is scratch space for ephemeral work
- `/workspace/outputs` is for generated artifacts that should not live inside the repo tree

This layout is exposed by `@purista/ai` through the workspace layout helper
APIs and should be treated as the canonical default for PURISTA apps.

Why this matters:

- repo files and skills do not collide
- scripts can reliably reference repo and skill roots
- apps can switch between shared and isolated sandboxes without changing paths
- local app code does not need to reinvent its own sandbox layout

### 2. Wire the service into PURISTA

```ts
import { DefaultEventBridge, DefaultStateStore, initLogger } from '@purista/core'
import { DockerSandboxDriver, SandboxRegistry, sandboxServiceBuilder } from '@purista/ai'

const logger = initLogger()
const eventBridge = new DefaultEventBridge()
const stateStore = new DefaultStateStore({ logger })

const driver = new DockerSandboxDriver({
  imageName: 'purista-sandbox-agent:latest',
  memory: '2g',
})
const registry = new SandboxRegistry(stateStore)

const sandboxService = await sandboxServiceBuilder.getInstance(eventBridge, {
  logger,
  stateStore,
  resources: { driver, registry },
})

await eventBridge.start()
await sandboxService.start()
```

For fast local or test setups, you can also use the built-in in-memory registry helper:

```ts
import { createInMemorySandboxRegistry } from '@purista/ai'

const registry = createInMemorySandboxRegistry()
```

For Apple local development (OrbStack/Colima), use the macOS-focused adapter:

```ts
import { AppleContainerSandboxDriver } from '@purista/ai'

const driver = new AppleContainerSandboxDriver({
  imageName: 'purista-sandbox-agent:latest',
  memory: '2g',
})
```

You can preflight the local runtime and image before starting your app:

```ts
import {
  AppleContainerSandboxDriver,
  assertSandboxRuntimeAvailable,
} from '@purista/ai'

const driver = new AppleContainerSandboxDriver({
  imageName: 'purista-sandbox-agent:latest',
})

await assertSandboxRuntimeAvailable(driver)
```

If the runtime is missing or the image is not available locally,
`assertSandboxRuntimeAvailable(...)` throws a typed
`SandboxRuntimeUnavailableError` with diagnostics you can surface in your app.

### 3. Use it from your app/agent layer

Typical flow:

1. Ensure sandbox once per user/project work session or per explicit scope
2. Run one or more commands (`executeBash`)
3. Read/write generated artifacts
4. Destroy sandbox on completion or idle timeout

If you need filesystem skills inside the sandbox, use the framework helper:

```ts
import { seedSandboxSkills } from '@purista/ai'

await seedSandboxSkills({
  adapter,
  skillResource,
})
```

This materializes skill bundles into the canonical `/workspace/skills/<skill-name>/...`
layout without pushing app-specific workspace sync logic into the framework.

If you are wiring this from an AI application, keep the concern split clear:

- builder declares that the agent may use sandbox-backed resources or scripts
- instance creation provides the sandbox runtime dependencies
- handler or adapter triggers the actual work

## Configuration Model

You configure two required resources:

- `driver`: runtime implementation (Docker, Apple container, Podman)
- `registry`: metadata persistence (backed by your state store)

The registry is used for:

- ownership checks before command/file execution
- crash/restart recovery via startup reconciliation
- lifecycle cleanup

Ownership rule:

- `tenantId` from the PURISTA message is treated as `organizationId`
- `principalId` from the PURISTA message is treated as `userId`
- `projectId` stays explicit in the command payload
- `scope` is optional and controls reuse versus isolation

If your app does not always have authenticated message metadata, use stable fallback values such as `"default"` for `tenantId` and `principalId` at the application boundary. That keeps sandbox ownership deterministic without forcing every local or prototype flow to provide auth context.

If `scope` is omitted, the sandbox is shared per:

- `organizationId`
- `projectId`
- `userId`

If `scope` is set, the effective ownership key becomes:

- `organizationId`
- `projectId`
- `userId`
- `scope`

That lets the same user/project run either:

- one shared sandbox for iterative work
- one isolated sandbox per agent run or conversation
- one app-defined custom grouping

Sandbox access commands (`executeBash`, `readFile`, `writeFiles`, `destroySandbox`) require caller identity metadata so the service can enforce ownership.

## Driver Selection Guidance

- Start with **Docker** unless you already have a stronger infra requirement.
- On macOS local dev, prefer **AppleContainerSandboxDriver** (OrbStack/Colima).
- Move to **Podman** when rootless/container hardening is a priority.
- Treat Lima, Tart, and Firecracker as future separate adapter-package work, not as current `@purista/ai` runtime choices.

## Integration Testing

`@purista/ai` ships a real sandbox integration suite for docker-compatible runtimes.

Rules:

- tests detect a usable local runtime instead of assuming Docker is always present
- on macOS, the suite prefers `AppleContainerSandboxDriver`, which also covers OrbStack through the docker-compatible CLI contract
- on other platforms, the suite defaults to `DockerSandboxDriver`
- tests are skipped cleanly when no docker-compatible runtime is available locally
- when the runtime is available but the canonical sandbox image is missing, the suite builds `purista-sandbox-agent:latest` automatically from `packages/ai/Dockerfile.sandbox`
- the live suite also verifies skill-bundle seeding and seeded script execution under `/workspace/skills`

Environment variables for local verification:

```bash
PURISTA_SANDBOX_TEST_RUNTIME=apple-container
PURISTA_SANDBOX_TEST_IMAGE=purista-sandbox-agent:latest
PURISTA_SANDBOX_TEST_SKIP_IMAGE_BUILD=false
```

Supported values for `PURISTA_SANDBOX_TEST_RUNTIME`:

- `apple-container`
- `docker`

Optional build-control variables:

- `PURISTA_SANDBOX_TEST_SKIP_IMAGE_BUILD=true` disables the automatic image build and keeps the old skip-only behavior
- `PURISTA_SANDBOX_TEST_FORCE_IMAGE_BUILD=true` rebuilds the canonical image before the suite continues

Packaging guidance:

- docker-compatible adapters stay in `@purista/ai`
- do not create a separate OrbStack package
- only split adapter packages when a backend introduces real optional npm dependencies or native integration complexity

## Service Operations

The sandbox provides these capabilities:

- create runtime (`createSandbox`)
- ensure runtime (`ensureSandbox`)
- destroy runtime (`destroySandbox`)
- execute command (`executeBash`)
- read file (`readFile`)
- write files (`writeFiles`)

Example invocation pattern (event bridge):

```ts
const created = await eventBridge.invoke({
  sender: { serviceName: 'app', serviceVersion: '1', serviceTarget: 'create', instanceId: '1' },
  receiver: { serviceName: 'Sandbox', serviceVersion: '1', serviceTarget: 'ensureSandbox' },
  payload: {
    payload: {
      projectId: 'project-1',
      scope: { kind: 'agent-run', key: 'run-42' },
    },
    parameter: {},
  },
  tenantId: 'org-1',
  principalId: 'user-1',
  contentType: 'application/json',
  contentEncoding: 'utf-8',
})

const result = await eventBridge.invoke({
  sender: { serviceName: 'app', serviceVersion: '1', serviceTarget: 'exec', instanceId: '1' },
  receiver: { serviceName: 'Sandbox', serviceVersion: '1', serviceTarget: 'executeBash' },
  payload: {
    payload: {
      sandboxId: created.sandboxId,
      command: 'ls -la',
      timeoutMs: 10_000,
    },
    parameter: {},
  },
  tenantId: 'org-1',
  principalId: 'user-1',
  contentType: 'application/json',
  contentEncoding: 'utf-8',
})
```

## Reliability and failure semantics

Sandbox runtime behavior is intentionally explicit:

- `ensureSandbox` uses owner-tuple provisioning locks, so concurrent ensure calls for the same owner/scope do not create duplicate sandboxes.
- `executeBash` supports optional `timeoutMs` and returns deterministic timeout behavior through the sandbox command contract.
- ownership checks remain strict (`tenantId` + `principalId` + payload `projectId`/`scope`).
- write-file transport is binary-safe (`utf-8` or `base64` encoded payloads), while `readFile` remains a text-oriented UTF-8 read path.

Operational defaults:

- use `ensureSandbox` before command/file operations
- pass `timeoutMs` for long-running commands instead of relying on transport timeouts
- use encoded write payloads for non-text artifacts

## Git and GitHub Auth in Sandboxes

When `gitConfig` is provided at creation time, sandbox setup can:

- configure git identity (`user.name`, `user.email`)
- authenticate GitHub CLI (`gh auth login --with-token`)
- configure secure git credential helper via `gh`

Reference:

- [GitHub CLI manual](https://cli.github.com/manual/)

## Adapters

Use adapters based on deployment mode:

- **Service adapter** (`createPuristaSandboxAdapter`): use when sandbox runtime is provided by a running PURISTA service.
- **Unsafe local filesystem adapter** (`createUnsafeLocalFilesystemSandboxAdapter`): use only for local dev/testing where direct host workspace operations are acceptable and real sandbox isolation is not required.

When using the service adapter, always forward `tenantId` and `principalId`, and include `projectId` in sandbox operations. The sandbox service uses the full `{ tenantId, principalId, projectId }` owner tuple for access control.

## Scope patterns

Use these scope variants when the default shared sandbox is not enough:

- `{ kind: 'shared-project-user' }`: explicit shared sandbox for one tenant + project + user
- `{ kind: 'agent-run', key: runId }`: isolated sandbox per logical agent run
- `{ kind: 'conversation', key: conversationId }`: isolated sandbox per conversation thread
- `{ kind: 'runtime-instance', key: instanceId }`: isolated sandbox per runtime process or worker instance
- `{ kind: 'custom', key: 'spec-branch-a' }`: application-defined grouping

Recommendation:

- default to shared project-user sandboxes for iterative developer workflows
- use `agent-run` scope when parallel agents must not touch the same filesystem state
- do not use runtime `instanceId` as the main default isolation key; prefer logical run or conversation ids

## Create a New Adapter

In sandbox, a runtime adapter is implemented as a `SandboxDriver`.
If you want to support a new backend, implement the `SandboxDriver` interface and inject it into the service resources.

```ts
import type { BashResultSchema, SandboxDriver, SandboxFileContent, SandboxMetadata } from '@purista/ai'
import type { z } from 'zod'

type BashResult = z.infer<typeof BashResultSchema>

export class AcmeSandboxDriver implements SandboxDriver {
  public readonly name = 'acme'

  public async createSandbox(params: {
    organizationId: string
    projectId: string
    userId: string
    sandboxId: string
    gitConfig?: { username: string; email: string; token?: string }
  }): Promise<{ sandboxId: string; containerName: string }> {
    // 1) Provision runtime/container/VM in your backend
    // 2) Attach workspace
    // 3) Optionally configure git/gh when gitConfig is set
    return { sandboxId: params.sandboxId, containerName: `acme-${params.sandboxId}` }
  }

  public async destroySandbox(params: { sandboxId: string }): Promise<void> {
    // Remove runtime resources and workspace
  }

  public async executeBash(params: { sandboxId: string; command: string; cwd?: string; timeoutMs?: number }): Promise<BashResult> {
    // Execute command and return stdout/stderr/exitCode
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  public async readFile(params: { sandboxId: string; path: string }): Promise<string> {
    // Return UTF-8 file content from sandbox workspace
    return ''
  }

  public async writeFiles(params: { sandboxId: string; files: Record<string, SandboxFileContent> }): Promise<void> {
    // Persist files in sandbox workspace
  }

  public async scanRunningSandboxes(): Promise<Array<SandboxMetadata>> {
    // Return currently running sandboxes for startup reconciliation
    return []
  }
}
```

After implementing your driver:

1. Instantiate it in bootstrap.
2. Pass it to `sandboxServiceBuilder` as `resources.driver`.
3. Only return sandboxes from `scanRunningSandboxes()` when you can recover the full owner tuple (`organizationId`, `projectId`, `userId`). Incomplete recovery must return `[]` instead of partial metadata.

## Use Sandbox In A PURISTA AI Agent

For agent authoring, keep sandbox lifecycle in PURISTA commands and let the model use `just-bash` tools through the Vercel AI SDK loop.
Use `ensureSandbox` as default and derive identity from `context.message` instead of passing user identity in payload.

```ts
import { stepCountIs } from 'ai'
import { createAgentQueueBuilder } from '@purista/ai'
import { createBashTool } from 'just-bash'
import { z } from 'zod'

export const codingAgent = createAgentQueueBuilder(
  'codingAgent',
  '1',
  'Runs coding tasks in a sandbox',
)
  .addPayloadSchema(
    z.object({
      projectId: z.string(),
      prompt: z.string().min(1),
    }),
  )
  .addModel('openai:primary', { capabilities: ['text', 'stream'] })
  .canInvoke('Sandbox', '1', 'ensureSandbox')
  .canInvoke('Sandbox', '1', 'executeBash')
  .canInvoke('Sandbox', '1', 'readFile')
  .canInvoke('Sandbox', '1', 'writeFiles')
  .canInvoke('Sandbox', '1', 'destroySandbox')
  .setAgentFunction(async function (context, payload) {
    const ensured = await context.invoke.tools.invoke.Sandbox['1'].ensureSandbox({
      projectId: payload.projectId,
    })

    try {
      const sandbox = {
        executeCommand: async (command: string) =>
          await context.invoke.tools.invoke.Sandbox['1'].executeBash({ sandboxId: ensured.sandboxId, command }),
        readFile: async (path: string) =>
          await context.invoke.tools.invoke.Sandbox['1'].readFile({ sandboxId: ensured.sandboxId, path }),
        writeFiles: async (files: Array<{ path: string; content: string | Buffer }>) =>
          await context.invoke.tools.invoke.Sandbox['1'].writeFiles({
            sandboxId: ensured.sandboxId,
            files: Object.fromEntries(
              files.map((file) => [
                file.path,
                typeof file.content === 'string'
                  ? { encoding: 'utf-8' as const, content: file.content }
                  : { encoding: 'base64' as const, content: file.content.toString('base64') },
              ]),
            ),
          }),
      }

      const bashToolkit = await createBashTool({
        sandbox,
        destination: '.',
        extraInstructions: [
          'Work only inside the current project workspace.',
          'Persist file updates via tools when requirements change.',
        ].join('\n'),
      })

      const answer = await context.ai.models['openai:primary'].generate({
        prompt: payload.prompt,
      })

      return { message: answer.output }
    } finally {
      await context.invoke.tools.invoke.Sandbox['1'].destroySandbox({ sandboxId: ensured.sandboxId })
    }
  })
```

Minimal baseline:

- ensure sandbox at the start of the run
- mount `just-bash` on the sandbox adapter
- let AI SDK tool-calling drive bash/read/write
- always destroy sandbox in `finally`

## Hardened Dockerfile (Reference)

The package includes a hardened Debian-based image for agent workloads.

```dockerfile
FROM debian:bookworm-slim
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash curl wget git jq unzip zip tar ca-certificates build-essential \
    python3 python3-pip diffutils patch sed grep gawk findutils rsync \
    procps net-tools hostname nano vim-tiny \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install gh -y \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /bin/bash agent
WORKDIR /workspace
RUN mkdir -p /workspace && chown -R agent:agent /workspace /home/agent
USER agent
ENTRYPOINT ["/bin/bash"]
```

## Typical Implementation Order

1. Choose driver by target environment and security posture.
2. Build/publish sandbox image used by that driver.
3. Instantiate `SandboxRegistry` with your chosen state store.
4. Start sandbox with injected `driver` + `registry`.
5. Integrate from app/agent layer using sandbox commands.
6. Add cleanup policy (idle timeout or explicit teardown).

## Common Pitfalls

- forgetting to destroy sandboxes after use
- using one shared sandbox across multiple users/tenants
- skipping ownership checks in caller workflows
- designing around future VM backends before the dedicated adapter packages exist
