---
name: purista-deployment-topologies
description: Choose deployment shapes for PURISTA services, queues, agents, and sandbox-backed workloads without breaking the architectural boundaries.
topics: [deployment, topology, operations]
phases: [architecture, planning]
---

# PURISTA Deployment Topologies

## When to use this skill
Use this skill when the user asks how the designed system should run in development, staging, or production.

## What this component/package is for
This skill helps map PURISTA services, queues, agents, and sandbox components into deployable processes and infrastructure boundaries.

## Hard rules
- Keep deployment topology separate from service boundaries.
- Deploy queue-backed work where queue access, stores, and runtime constraints are satisfied.
- Treat sandbox runtime prerequisites as explicit infrastructure.

## Decision rules
- Separate user-facing HTTP processes from heavy durable workers when load or failure isolation demands it.
- Keep sandbox service near workloads that need code execution.
- Start with a simple topology and split only when concurrency, tenancy, or resource isolation needs it.

## Recommended file/folder structure
```text
config/
apps/
packages/
```

## Common implementation patterns
- One bootstrap entrypoint wires EventBridge, QueueBridge, stores, services, agents, and HTTP.
- Dedicated worker pools for durable agent classes.
- Local development with Docker-compatible sandbox drivers and prebuilt images.

## Common mistakes / anti-patterns
- Designing deployment first and forcing service boundaries to fit it.
- Running every workload in the same process forever.
- Forgetting queue bridges, state stores, or sandbox images in environment setup.

## How this connects to other PURISTA concepts
Deployment depends on services, queue bridges, agents, sandbox, stores, and observability.

## Read if needed
- `website/doc/handbook/3_eco_system/index.md`
- `website/doc/handbook/3_eco_system/sandbox.md`
- `specs/25-voyage/20-code-workspace/00-repository-and-execution-isolation.md`
