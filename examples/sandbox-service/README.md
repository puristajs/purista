# `@purista/ai` Sandbox Example

This example shows how to wire the canonical sandbox runtime from `@purista/ai` into a PURISTA service runtime and then exercise the real provider and adapter flow.

## Build sandbox image

Use the canonical package build script:

```bash
npm run sandbox:image:build -w packages/ai
```

## Run example

```bash
npm install
npm run start -w examples/sandbox-service
```

The example now:

- detects a docker-compatible runtime (`AppleContainerSandboxDriver` on macOS, `DockerSandboxDriver` elsewhere)
- starts the sandbox service
- ensures one shared sandbox and one scoped sandbox
- demonstrates shared reuse vs scoped isolation
- writes and reads a file through the sandbox adapter
- seeds a synthetic skill bundle into `/workspace/skills`
- executes a seeded skill script inside the sandbox
- executes a command in `/workspace`
- destroys the created sandboxes before exit

Optional environment variables:

```bash
PURISTA_SANDBOX_IMAGE=purista-sandbox-agent:latest npm run start -w examples/sandbox-service
```

The real integration test suite in `packages/ai` uses the same image contract and
will build `purista-sandbox-agent:latest` automatically when a docker-compatible
runtime is available but the image is missing locally.
