[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/sandbox

# @purista/sandbox

A professional, multi-tenant sandboxing provider built for the **PURISTA** framework. It enables secure, isolated execution environments for autonomous agents and human users.

## Features

- **Multi-tenancy**: Native support for Organizations, Projects, and Users.
- **Pluggable Drivers**:
  - `AppleContainerSandboxDriver`: macOS-focused local dev driver for Docker-compatible runtimes (OrbStack/Colima).
  - `DockerSandboxDriver`: Works with Docker Desktop, **OrbStack**, and **Colima**.
  - `PodmanSandboxDriver`: Secure, daemonless, and rootless containers.
  - `LimaSandboxDriver`: Experimental open-source native Apple Silicon virtualization (no restart reconciliation).
  - `TartSandboxDriver`: Experimental Apple virtualization backend (no restart reconciliation).
  - `FirecrackerSandboxDriver`: Experimental Linux microVM backend with incomplete execution/file operations.
- **Secure Authentication**: Automated GitHub CLI (`gh`) and Git authentication using secure piping (no tokens in logs).
- **Resilient Registry**: State-store based registry with automatic recovery from container labels on service startup.
- **AI-Agent Ready**: Pre-built hardened Docker image with `node`, `git`, `gh`, `jq`, and essential build tools.

## Installation

```bash
npm install @purista/sandbox
```

## Quick Start

### 1. Build the Sandbox Image (for Docker/Podman)

```bash
docker build -t purista-sandbox-agent:latest -f Dockerfile.sandbox .
```

Optional Alpine variant (smaller image, stricter compatibility constraints):

```bash
docker build -t purista-sandbox-agent:alpine -f Dockerfile.sandbox.alpine .
```

### 2. Configure the Service

```typescript
import {
  createInMemorySandboxRegistry,
  DockerSandboxDriver,
  sandboxServiceBuilder,
} from '@purista/sandbox'

const driver = new DockerSandboxDriver({
  imageName: 'purista-sandbox-agent:latest',
  memory: '2g'
})

const registry = createInMemorySandboxRegistry()

// In your PURISTA setup, inject resources at service instantiation:
const sandboxService = await sandboxServiceBuilder.getInstance(eventBridge, {
  resources: {
    driver,
    registry,
  },
})
```

Sandbox ownership is derived from the PURISTA message:

- `tenantId` -> `organizationId`
- `principalId` -> `userId`
- `projectId` stays in the command payload

Callers should forward `tenantId` and `principalId` on sandbox commands when available.
For local or unauthenticated app flows, you can intentionally fall back to stable defaults such as `"default"` so owner scoping remains deterministic.

For Apple local development (OrbStack/Colima), you can also use:

```typescript
import { AppleContainerSandboxDriver } from '@purista/sandbox'
```

## Documentation

- [Architecture Overview](../../_media/ARCHITECTURE.md)
- [Driver Selection Guide](../../_media/DRIVERS.md)
- [Secure Git Integration](../../_media/GIT_AUTH.md)
- [Sandbox Dockerfile](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/Dockerfile.sandbox)
- [Sandbox Alpine Dockerfile](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/Dockerfile.sandbox.alpine)
- [Repository skills (sandbox)](https://github.com/puristajs/purista/blob/master/skills/sandbox/META-SKILL.md)

## Development

- **Build**: `npm run build`
- **Test**: `npm test`
- **Lint**: `npm run lint`

## License

MIT

## Classes

- [FirecrackerSandboxDriver](classes/FirecrackerSandboxDriver.md)
- [LimaSandboxDriver](classes/LimaSandboxDriver.md)
- [PodmanSandboxDriver](classes/PodmanSandboxDriver.md)
- [SandboxRuntimeUnavailableError](classes/SandboxRuntimeUnavailableError.md)
- [SandboxService](classes/SandboxService.md)
- [TartSandboxDriver](classes/TartSandboxDriver.md)

## Interfaces

- [DockerSandboxDriverConfig](interfaces/DockerSandboxDriverConfig.md)
- [FirecrackerSandboxDriverConfig](interfaces/FirecrackerSandboxDriverConfig.md)
- [LimaSandboxDriverConfig](interfaces/LimaSandboxDriverConfig.md)
- [PodmanSandboxDriverConfig](interfaces/PodmanSandboxDriverConfig.md)
- [TartSandboxDriverConfig](interfaces/TartSandboxDriverConfig.md)

## Type Aliases

- [AppleContainerSandboxDriverConfig](type-aliases/AppleContainerSandboxDriverConfig.md)
- [FilesystemSandboxAdapter](type-aliases/FilesystemSandboxAdapter.md)
- [SandboxAdapter](type-aliases/SandboxAdapter.md)
- [SandboxAdapterIdentity](type-aliases/SandboxAdapterIdentity.md)
- [SandboxMetadata](type-aliases/SandboxMetadata.md)
- [SandboxOwner](type-aliases/SandboxOwner.md)
- [SandboxRuntimeDiagnostics](type-aliases/SandboxRuntimeDiagnostics.md)
- [SandboxScope](type-aliases/SandboxScope.md)
- [SandboxServiceConfig](type-aliases/SandboxServiceConfig.md)

## Variables

- [sandboxServiceBuilder](variables/sandboxServiceBuilder.md)

## Functions

- [assertSandboxRuntimeAvailable](functions/assertSandboxRuntimeAvailable.md)
- [createInMemorySandboxRegistry](functions/createInMemorySandboxRegistry.md)
- [createLocalFilesystemSandboxAdapter](functions/createLocalFilesystemSandboxAdapter.md)
- [createPuristaSandboxAdapter](functions/createPuristaSandboxAdapter.md)
- [getSandboxRuntimeDiagnostics](functions/getSandboxRuntimeDiagnostics.md)

## Drivers

- [AppleContainerSandboxDriver](classes/AppleContainerSandboxDriver.md)
- [DockerSandboxDriver](classes/DockerSandboxDriver.md)
- [SandboxDriver](interfaces/SandboxDriver.md)

## Resources

- [SandboxRegistry](classes/SandboxRegistry.md)

## Schemas

- [BashResultSchema](variables/BashResultSchema.md)
- [SandboxMetadataSchema](variables/SandboxMetadataSchema.md)
- [SandboxOwnerSchema](variables/SandboxOwnerSchema.md)
- [SandboxPayloadSchema](variables/SandboxPayloadSchema.md)
- [SandboxScopeSchema](variables/SandboxScopeSchema.md)
- [SandboxServiceConfigSchema](variables/SandboxServiceConfigSchema.md)
