# Sandbox Service Example

This example shows how to wire `@purista/sandbox-service` into a PURISTA service runtime.

## Build sandbox image

Use the package Dockerfile directly:

```bash
docker build -t purista-sandbox-agent:latest -f ../../packages/sandbox-service/Dockerfile.sandbox ../../
```

## Run example

```bash
npm install
npm run start -w examples/sandbox-service
```

The example boots a local in-memory PURISTA runtime and starts the sandbox service using `DockerSandboxDriver`.
