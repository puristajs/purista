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

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Driver Selection Guide](./docs/DRIVERS.md)
- [Secure Git Integration](./docs/GIT_AUTH.md)
- [Sandbox Dockerfile](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/Dockerfile.sandbox)
- [Sandbox Alpine Dockerfile](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/Dockerfile.sandbox.alpine)
- [Repository skills (sandbox)](https://github.com/puristajs/purista/blob/master/skills/sandbox/META-SKILL.md)

## Development

- **Build**: `npm run build`
- **Test**: `npm test`
- **Lint**: `npm run lint`

## License

MIT
