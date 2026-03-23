---
name: purista-sandbox
description: Run workspace and script execution in isolated PURISTA sandboxes with explicit ownership, scope, and startup diagnostics.
topics: [sandbox, execution, isolation]
phases: [architecture, implementation, simulation]
requires_sandbox: true
---

# PURISTA Sandbox

## When to use this skill
Use this skill when code, shell commands, or skill scripts must run in an isolated workspace instead of directly on the host.

## What this component/package is for
The sandbox runtime inside `@purista/ai` provisions isolated execution environments behind a service boundary and adapter layer.

## Hard rules
- Route execution through the sandbox service or adapter, not direct host shell access.
- Keep ownership deterministic with tenant, project, user, and optional scope.
- Use `scope` when parallel agents for the same user/project must not collide.
- Run startup preflight so missing images or runtimes fail early.

## Decision rules
- Use shared default ownership for persistent per-user workspaces.
- Use scoped sandboxes such as `agent-run` or conversation-level keys for isolated concurrent work.
- Keep executable skill scripts sandbox-backed rather than host-backed.

## Recommended file/folder structure
```text
src/resources/sandboxExecutionResource/
src/application/workspace/
apps/server/Dockerfile.sandbox
```

## Common implementation patterns
- `ensureSandbox` before writing files or executing commands.
- Keep image/runtime diagnostics in startup bootstrap.
- Use a Docker-compatible driver for Docker Desktop, OrbStack, or Colima.

## Common mistakes / anti-patterns
- Assuming a shared sandbox is safe for parallel isolated agent runs.
- Treating `tenantId` and `principalId` as mandatory when the app may need stable defaults.
- Shipping an image that exits immediately instead of staying alive for `docker exec`.

## How this connects to other PURISTA concepts
Sandbox connects agents, skills with scripts, queue-backed long work, resources, and startup diagnostics.

## Read if needed
- `packages/ai/src/sandbox/index.ts`
- `website/doc/handbook/3_eco_system/sandbox.md`
- `packages/ai/src/sandbox/types/SandboxDriver.ts`
- `packages/ai/src/sandbox/service/Sandbox/v1/helper/ownership.ts`
