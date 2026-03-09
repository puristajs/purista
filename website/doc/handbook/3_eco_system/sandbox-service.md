---
title: Sandbox Service
description: Multi-tenant sandbox runtime for secure agent and tool execution
order: 303500
---

# Sandbox Service

`@purista/sandbox-service` provides a reusable multi-tenant runtime for isolated command execution, file I/O, and agent tooling.

Use it when you need:

- sandboxed code execution per project/user
- strict ownership tracking by organization, project, and user
- driver-based portability (Docker, Podman, Lima, Tart, Firecracker)
- integration with AI tool layers through adapters

## Start Here

- Package API docs: [@purista/sandbox-service](https://github.com/puristajs/purista/blob/master/website/doc/api/@purista/sandbox-service/README.md)
- Package README: [packages/sandbox-service/README.md](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/README.md)
- Architecture: [packages/sandbox-service/docs/ARCHITECTURE.md](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/docs/ARCHITECTURE.md)
- Driver guide: [packages/sandbox-service/docs/DRIVERS.md](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/docs/DRIVERS.md)
- Git auth model: [packages/sandbox-service/docs/GIT_AUTH.md](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/docs/GIT_AUTH.md)

## How It Works

The service exposes commands to:

- create/destroy sandboxes
- execute shell commands
- read/write files
- reconcile runtime state on service startup

At startup, it reconciles running sandboxes into the registry automatically via service lifecycle, not via subscriptions.

## Quick Start

### 1. Build a sandbox image

Use the provided hardened Dockerfile:

- [packages/sandbox-service/Dockerfile.sandbox](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/Dockerfile.sandbox)

```bash
docker build -t purista-sandbox-agent:latest -f packages/sandbox-service/Dockerfile.sandbox .
```

### 2. Configure and start the service

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

Runnable example:

- [examples/sandbox-service/README.md](https://github.com/puristajs/purista/blob/master/examples/sandbox-service/README.md)

## Configuration Model

You provide two core resources:

- `driver`: implementation of `SandboxDriver`
- `registry`: `SandboxRegistry` backed by a `StateStore`

`SandboxRegistry` source:

- [src/resources/SandboxRegistry.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/resources/SandboxRegistry.ts)

## Driver Options and Tradeoffs

| Driver | Best for | Key config | Notes |
| --- | --- | --- | --- |
| `DockerSandboxDriver` | default local/dev and broad compatibility | `imageName`, `memory`, `cpus`, `networkDisabled` | Works with Docker Desktop, OrbStack, Colima |
| `PodmanSandboxDriver` | rootless/container-security focused setups | `imageName`, `memory`, `cpus`, `networkDisabled` | Good daemonless option |
| `LimaSandboxDriver` | open-source VM runtime on Apple Silicon | `template`, `memory`, `cpus`, `useVz` | Uses `limactl`; good Mac-focused option |
| `TartSandboxDriver` | native Apple virtualization workflows | `baseImage`, `memory`, `cpus`, `display` | Specialized; useful when Tart is already standard |
| `FirecrackerSandboxDriver` | Linux microVM strategy | `firecrackerBinary`, `kernelImagePath`, `rootfsImagePath`, `workspaceDir` | Advanced path; requires Linux/KVM and deeper infra setup |

Driver implementations:

- [DockerSandboxDriver.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts)
- [PodmanSandboxDriver.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts)
- [LimaSandboxDriver.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts)
- [TartSandboxDriver.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/driver/TartSandboxDriver/TartSandboxDriver.ts)
- [FirecrackerSandboxDriver.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts)

## Adapters (How to Consume the Service)

Two adapters are available depending on your integration strategy.

| Adapter | Purpose | Use when |
| --- | --- | --- |
| `createPuristaSandboxAdapter` | Talks to sandbox service through event bridge commands | You run sandbox as a PURISTA service and want remote sandbox I/O/exec |
| `createLocalFilesystemSandboxAdapter` | Local filesystem + bash adapter rooted at one project path | You need local dev/testing tooling without provisioning a sandbox runtime |

Adapter sources:

- [createPuristaSandboxAdapter.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts)
- [createLocalFilesystemSandboxAdapter.ts](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts)

## Command Surface

The service exposes these operations:

- `createSandbox` (`POST sandbox`)
- `destroySandbox`
- `executeBash` (`POST sandbox/:sandboxId/bash`)
- `readFile`
- `writeFiles`

Command schemas and builders:

- [createSandbox](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/service/Sandbox/v1/command/createSandbox/createSandboxCommandBuilder.ts)
- [executeBash](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/service/Sandbox/v1/command/executeBash/executeBashCommandBuilder.ts)
- [readFile](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/service/Sandbox/v1/command/readFile/readFileCommandBuilder.ts)
- [writeFiles](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/service/Sandbox/v1/command/writeFiles/writeFilesCommandBuilder.ts)
- [destroySandbox](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/src/service/Sandbox/v1/command/destroySandbox/destroySandboxCommandBuilder.ts)

## Security and Identity

If `gitConfig` is provided at sandbox creation:

- git identity is configured inside the sandbox
- GitHub CLI auth can be initialized via token
- credential helper is configured to avoid storing raw token in `.gitconfig`

Details:

- [GIT_AUTH.md](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/docs/GIT_AUTH.md)

## Recommended Rollout Path

1. Start with `DockerSandboxDriver`.
2. Validate registry reconciliation and cleanup behavior.
3. Add command and file operation limits in your own calling layer.
4. Move to Podman/Lima/Tart/Firecracker only when your infra standards require it.
