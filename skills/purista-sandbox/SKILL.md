---
name: purista-sandbox
description: Teach untrained models how builder-defined services and agents use PURISTA sandbox adapters and resources for isolated execution with explicit runtime ownership and wiring.
topics: [sandbox, execution, isolation]
phases: [architecture, implementation, simulation]
requires_sandbox: true
---

# PURISTA Sandbox

## When to use this skill
Use this skill when code, shell commands, or skill scripts must run in an isolated workspace instead of directly on the host.

## What this component/package is for
The sandbox runtime inside `@purista/ai` provisions isolated execution environments behind a service boundary and adapter layer.

## Core PURISTA concept
Sandboxing is runtime infrastructure exposed through services, resources, and adapters. Business services and agents should depend on sandbox capabilities explicitly rather than assuming direct host execution.

## Builder lifecycle
1. Decide which service or agent needs isolated execution.
2. Model sandbox access as a resource, service dependency, or explicit runtime adapter.
3. Define commands, queues, or agents that use that sandbox capability.
4. Instantiate the runtime with the concrete sandbox driver or sandbox service wiring.

## Hard rules
- Route execution through the sandbox service or adapter, not direct host shell access.
- Keep ownership deterministic with tenant, project, user, and optional scope.
- Use `scope` when parallel agents for the same user/project must not collide.
- Run startup preflight so missing images or runtimes fail early.

## Decision rules
- Use shared default ownership for persistent per-user workspaces.
- Use isolated scope values for parallel or risky workloads.
- Prefer queue-backed execution when sandbox work is long-running or restart-sensitive.

## Definition pattern
- Keep sandbox capabilities behind resources, adapters, or service commands.
- Do not let arbitrary business handlers shell out directly.

## Implementation pattern
- Use sandbox adapters to seed repo and skill files into isolated workspaces.
- Keep sandbox execution separate from host filesystem assumptions.
- Pair sandbox-heavy flows with queue or run-state support when recovery matters.

## Configuration pattern
- Sandbox driver selection, ownership rules, and runtime diagnostics are configuration and runtime concerns.
- Builders define that sandbox capability is required; bootstrap provides the actual driver or service resource.

## Instantiation / runtime wiring
- A service or agent that needs sandboxing is incomplete until the concrete sandbox runtime is supplied.
- Startup diagnostics should verify image/runtime availability before user traffic hits the capability.

## Verification cues
- The design can name which running service or agent receives sandbox capability and how.
- Scope and ownership are explicit.
- Sandbox tasks that need durability also name queue/runtime state support.

## Common mistakes / anti-patterns
- Running host shell commands directly from handlers.
- Letting multiple users or tasks collide in one shared workspace implicitly.
- Treating sandboxing as prompt text instead of a runtime capability.
- Explaining sandbox execution without showing which service or agent gets the sandbox adapter at runtime.

## How this connects to other PURISTA concepts
Sandboxing composes with resources, queues, agents, skills, observability, and deployment topology.

## Read if needed
- `references/scope-examples.md`
- `packages/ai/src/sandbox/workspaceLayout.ts`
- `packages/ai/src/sandbox/service/Sandbox/v1/SandboxServiceBuilder.ts`
- `packages/ai/src/sandbox/service/Sandbox/v1/SandboxService.ts`
- `specs/20-agents/10-platform-architecture.md`
