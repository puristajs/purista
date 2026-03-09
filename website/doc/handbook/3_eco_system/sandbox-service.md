---
title: Sandbox Service
description: Multi-tenant sandbox runtime for secure agent and tool execution
order: 303500
---

# Sandbox Service

`@purista/sandbox-service` provides isolated execution environments for agent and tool workloads.

It adds:

- tenant-aware sandbox lifecycle (`organizationId`, `projectId`, `userId`)
- command execution and file read/write inside isolated runtimes
- pluggable backends (Docker, Podman, Lima, Tart, Firecracker)
- registry reconciliation on service startup

## When To Use

Use sandbox service when:

- agents need shell access, but not full host access
- each project/user must run in isolated workspaces
- you want one execution abstraction while switching infra backends
- you need audit-friendly metadata around runtime ownership

## Runtime Backends

| Backend | Good default for | Platform notes | External docs |
| --- | --- | --- | --- |
| Docker | most teams starting out | widely available, broad ecosystem | [Docker Docs](https://docs.docker.com/) |
| Podman | rootless/container-security setups | daemonless model | [Podman Docs](https://podman.io/docs) |
| Lima | open-source VM approach on macOS | good Apple Silicon path | [Lima Docs](https://lima-vm.io/docs/) |
| Tart | Apple virtualization heavy setups | macOS-focused VM workflows | [Tart Docs](https://tart.run/) |
| Firecracker | high-isolation Linux microVMs | requires Linux + KVM ops maturity | [Firecracker Docs](https://firecracker-microvm.github.io/) |

Related runtimes often used with Docker driver:

- [OrbStack](https://orbstack.dev/)
- [Colima](https://github.com/abiosoft/colima)

## Quick Start

### 1. Build a sandbox image

Use a hardened image with `bash`, `git`, `gh`, and tooling required by your agents.

```bash
docker build -t purista-sandbox-agent:latest -f packages/sandbox-service/Dockerfile.sandbox .
```

### 2. Wire the service into PURISTA

```ts
import { DefaultEventBridge, DefaultStateStore, initLogger } from '@purista/core'
import { DockerSandboxDriver, SandboxRegistry, sandboxServiceBuilder } from '@purista/sandbox-service'

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
- Move to **Podman** when rootless/container hardening is a priority.
- Use **Lima** or **Tart** for Apple-Silicon-heavy VM workflows.
- Use **Firecracker** only when you need microVM-level isolation and can operate Linux/KVM infrastructure.

## Service Operations

The sandbox service provides these capabilities:

- create runtime (`createSandbox`)
- destroy runtime (`destroySandbox`)
- execute command (`executeBash`)
- read file (`readFile`)
- write files (`writeFiles`)

Example invocation pattern (event bridge):

```ts
const created = await eventBridge.invoke({
  sender: { serviceName: 'app', serviceVersion: '1', serviceTarget: 'create', instanceId: '1' },
  receiver: { serviceName: 'Sandbox', serviceVersion: '1', serviceTarget: 'createSandbox' },
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
4. Start sandbox service with injected `driver` + `registry`.
5. Integrate from app/agent layer using sandbox commands.
6. Add cleanup policy (idle timeout or explicit teardown).

## Common Pitfalls

- forgetting to destroy sandboxes after use
- using one shared sandbox across multiple users/tenants
- skipping ownership checks in caller workflows
- jumping to Firecracker before Linux/KVM operations are in place
