---
title: Sandbox
description: Multi-tenant sandbox runtime for secure agent and tool execution
order: 303500
---

# Sandbox

`@purista/sandbox` provides isolated execution environments for agent and tool workloads.

It adds:

- tenant-aware sandbox lifecycle (`organizationId`, `projectId`, `userId`)
- command execution and file read/write inside isolated runtimes
- pluggable backends (Docker, Podman, Lima, Tart, Firecracker)
- registry reconciliation on service startup

## When To Use

Use sandbox when:

- agents need shell access, but not full host access
- each project/user must run in isolated workspaces
- you want one execution abstraction while switching infra backends
- you need audit-friendly metadata around runtime ownership

## Runtime Backends

| Backend | Good default for | Platform notes | External docs |
| --- | --- | --- | --- |
| AppleContainerSandboxDriver | local macOS developer setups | Docker-compatible runtimes such as OrbStack/Colima | [OrbStack](https://orbstack.dev/), [Colima](https://github.com/abiosoft/colima) |
| Docker | most teams starting out | widely available, broad ecosystem | [Docker Docs](https://docs.docker.com/) |
| Podman | rootless/container-security setups | daemonless model | [Podman Docs](https://podman.io/docs) |
| Lima | open-source VM approach on macOS | good Apple Silicon path | [Lima Docs](https://lima-vm.io/docs/) |
| Tart | Apple virtualization heavy setups | macOS-focused VM workflows | [Tart Docs](https://tart.run/) |
| Firecracker | high-isolation Linux microVMs | requires Linux + KVM ops maturity | [Firecracker Docs](https://firecracker-microvm.github.io/) |

Related runtimes often used with Docker driver:

- [OrbStack](https://orbstack.dev/)
- [Colima](https://github.com/abiosoft/colima)

## Base Image Guidance

- Default: use `Dockerfile.sandbox` (Debian slim). This is the most compatible option for mixed AI toolchains.
- Optional: use `Dockerfile.sandbox.alpine` when image size/startup speed is more important than compatibility.
- Alpine caveat: some native binaries and glibc-targeted tools may require additional adaptation.

## Quick Start

### 1. Build a sandbox image

Use a hardened image with `bash`, `git`, `gh`, and tooling required by your agents.

```bash
docker build -t purista-sandbox-agent:latest -f packages/sandbox-service/Dockerfile.sandbox .
```

Optional Alpine variant:

```bash
docker build -t purista-sandbox-agent:alpine -f packages/sandbox-service/Dockerfile.sandbox.alpine .
```

### 2. Wire the service into PURISTA

```ts
import { DefaultEventBridge, DefaultStateStore, initLogger } from '@purista/core'
import { DockerSandboxDriver, SandboxRegistry, sandboxServiceBuilder } from '@purista/sandbox'

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

For Apple local development (OrbStack/Colima), use the macOS-focused adapter:

```ts
import { AppleContainerSandboxDriver } from '@purista/sandbox'

const driver = new AppleContainerSandboxDriver({
  imageName: 'purista-sandbox-agent:latest',
  memory: '2g',
})
```

### 3. Use it from your app/agent layer

Typical flow:

1. Create sandbox once per user/project work session
2. Run one or more commands (`executeBash`)
3. Read/write generated artifacts
4. Destroy sandbox on completion or idle timeout

## Configuration Model

You configure two required resources:

- `driver`: runtime implementation (Docker, Podman, Lima, Tart, Firecracker)
- `registry`: metadata persistence (backed by your state store)

The registry is used for:

- ownership checks before command/file execution
- crash/restart recovery via startup reconciliation
- lifecycle cleanup

## Driver Selection Guidance

- Start with **Docker** unless you already have a stronger infra requirement.
- On macOS local dev, prefer **AppleContainerSandboxDriver** (OrbStack/Colima).
- Move to **Podman** when rootless/container hardening is a priority.
- Use **Lima** or **Tart** for Apple-Silicon-heavy VM workflows.
- Use **Firecracker** only when you need microVM-level isolation and can operate Linux/KVM infrastructure.

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
      organizationId: 'org-1',
      projectId: 'project-1',
      userId: 'user-1',
    },
    parameter: {},
  },
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
    },
    parameter: {},
  },
  contentType: 'application/json',
  contentEncoding: 'utf-8',
})
```

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
- **Local filesystem adapter** (`createLocalFilesystemSandboxAdapter`): use for local dev/testing where direct workspace operations are acceptable.

## Create a New Adapter

In sandbox, a runtime adapter is implemented as a `SandboxDriver`.
If you want to support a new backend, implement the `SandboxDriver` interface and inject it into the service resources.

```ts
import type { BashResultSchema, SandboxDriver, SandboxMetadata } from '@purista/sandbox'
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

  public async executeBash(params: { sandboxId: string; command: string; cwd?: string }): Promise<BashResult> {
    // Execute command and return stdout/stderr/exitCode
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  public async readFile(params: { sandboxId: string; path: string }): Promise<string> {
    // Return UTF-8 file content from sandbox workspace
    return ''
  }

  public async writeFiles(params: { sandboxId: string; files: Record<string, string> }): Promise<void> {
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
3. Keep `scanRunningSandboxes()` accurate so restart reconciliation works.

## Use Sandbox In A PURISTA AI Agent

For agent authoring, keep sandbox lifecycle in PURISTA commands and let the model use `just-bash` tools through the Vercel AI SDK loop.
Use `ensureSandbox` as default and derive identity from `context.message` instead of passing user identity in payload.

```ts
import { stepCountIs } from 'ai'
import { AgentBuilder } from '@purista/ai'
import { createBashTool } from 'just-bash'
import { z } from 'zod/v4'

export const codingAgent = new AgentBuilder({
  agentName: 'codingAgent',
  agentVersion: '1',
  description: 'Runs coding tasks in a sandbox',
})
  .addPayloadSchema(
    z.object({
      projectId: z.string(),
      prompt: z.string().min(1),
    }),
  )
  .defineModel('openai:primary', { capabilities: ['text', 'stream'] })
  .canInvoke('Sandbox', '1', 'ensureSandbox')
  .canInvoke('Sandbox', '1', 'executeBash')
  .canInvoke('Sandbox', '1', 'readFile')
  .canInvoke('Sandbox', '1', 'writeFiles')
  .canInvoke('Sandbox', '1', 'destroySandbox')
  .setHandler(async function (context, payload) {
    const model = context.models['openai:primary']
    if (!model?.generateText) {
      throw new Error('Model alias openai:primary is not configured')
    }
    // Sandbox currently keys ownership as organization/project/user.
    // Map tenant/principal from the message context into that owner tuple.
    const sandboxOwner = {
      organizationId: context.message.tenantId ?? 'global',
      projectId: payload.projectId,
      userId: context.message.principalId ?? 'anonymous',
    }

    const ensured = await context.tools.invoke.Sandbox['1'].ensureSandbox(sandboxOwner)

    try {
      const sandbox = {
        executeCommand: async (command: string) =>
          await context.tools.invoke.Sandbox['1'].executeBash({ sandboxId: ensured.sandboxId, command }),
        readFile: async (path: string) =>
          await context.tools.invoke.Sandbox['1'].readFile({ sandboxId: ensured.sandboxId, path }),
        writeFiles: async (files: Array<{ path: string; content: string | Buffer }>) =>
          await context.tools.invoke.Sandbox['1'].writeFiles({
            sandboxId: ensured.sandboxId,
            files: Object.fromEntries(files.map((file) => [file.path, file.content.toString('utf-8')])),
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

      const answer = await model.generateText({
        prompt: payload.prompt,
        onTextDelta: (delta) => {
          if (delta.length > 0) {
            context.stream.sendChunk(delta)
          }
        },
        metadata: {
          aiSdk: {
            tools: bashToolkit.tools,
            stopWhen: stepCountIs(20),
            toolChoice: 'auto',
          },
        },
      })

      context.stream.sendFinal(answer)
      return { message: answer }
    } finally {
      await context.tools.invoke.Sandbox['1'].destroySandbox({ sandboxId: ensured.sandboxId })
    }
  })
  .build()
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
WORKDIR /home/agent/workspace
RUN chown -R agent:agent /home/agent
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
- jumping to Firecracker before Linux/KVM operations are in place
