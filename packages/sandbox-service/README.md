# @purista/sandbox-service

A professional, multi-tenant sandboxing provider built for the **PURISTA** framework. It enables secure, isolated execution environments for autonomous agents and human users.

## Features

- **Multi-tenancy**: Native support for Organizations, Projects, and Users.
- **Pluggable Drivers**:
  - `DockerSandboxDriver`: Works with Docker Desktop, **OrbStack**, and **Colima**.
  - `PodmanSandboxDriver`: Secure, daemonless, and rootless containers.
  - `LimaSandboxDriver`: **Open-source** native Apple Silicon virtualization (via `vz`).
  - `TartSandboxDriver`: OCI-compatible native macOS/Linux VMs for Apple Silicon.
  - `FirecrackerSandboxDriver`: Production-grade AWS Firecracker MicroVMs.
- **Secure Authentication**: Automated GitHub CLI (`gh`) and Git authentication using secure piping (no tokens in logs).
- **Resilient Registry**: State-store based registry with automatic recovery from container labels on service startup.
- **AI-Agent Ready**: Pre-built hardened Docker image with `node`, `git`, `gh`, `jq`, and essential build tools.

## Installation

```bash
npm install @purista/sandbox-service
```

## Quick Start

### 1. Build the Sandbox Image (for Docker/Podman)

```bash
docker build -t purista-sandbox-agent:latest -f Dockerfile.sandbox .
```

### 2. Configure the Service

```typescript
import { sandboxServiceBuilder, DockerSandboxDriver } from '@purista/sandbox-service'

const driver = new DockerSandboxDriver({
  imageName: 'purista-sandbox-agent:latest',
  memory: '2g'
})

// In your PURISTA setup, inject resources at service instantiation:
const sandboxService = await sandboxServiceBuilder.getInstance(eventBridge, {
  resources: {
    driver,
  },
})
```

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Driver Selection Guide](./docs/DRIVERS.md)
- [Secure Git Integration](./docs/GIT_AUTH.md)
- [Sandbox Dockerfile](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/Dockerfile.sandbox)
- [Repository skills (sandbox)](https://github.com/puristajs/purista/blob/master/skills/sandbox-service/META-SKILL.md)

## Development

- **Build**: `npm run build`
- **Test**: `npm test`
- **Lint**: `npm run lint`

## License

MIT
