---
name: purista-deployment-topologies
description: Teach untrained models how builder-defined PURISTA services, queues, agents, and sandbox workloads map to deployable runtime processes and infrastructure.
topics: [deployment, topology, operations]
phases: [architecture, planning]
---

# PURISTA Deployment Topologies

## When to use this skill
Use this skill when the user asks how the designed system should run in development, staging, or production.

## What this component/package is for
This skill maps builder-defined services, queues, agents, and sandbox components into deployable processes and infrastructure boundaries.

## Core PURISTA concept
Deployment topology comes after builder design. Services, queues, agents, and runtimes are defined first; topology decides which processes host which runtime instances and bridges.

## Builder lifecycle
1. Define service, queue, worker, agent, and transport boundaries.
2. Identify runtime dependencies for each instance.
3. Group compatible instances into deployable processes.
4. Separate them only when concurrency, isolation, or operational concerns require it.

## Hard rules
- Keep deployment topology separate from service boundaries.
- Deploy queue-backed work where queue access, stores, and runtime constraints are satisfied.
- Treat sandbox runtime prerequisites as explicit infrastructure.

## Decision rules
- Separate user-facing HTTP processes from heavy durable workers when load or failure isolation demands it.
- Keep sandbox service near workloads that need code execution.
- Start with a simple topology and split only when concurrency, tenancy, or resource isolation needs it.

## Definition pattern
- Builder definitions should stay topology-neutral.
- Topology plans should refer back to the service or agent instances they host.

## Implementation pattern
- Group runtime instances by traffic shape, durability needs, and operational prerequisites.
- Keep queue workers, HTTP servers, and heavy sandbox workloads split when they would otherwise interfere.

## Configuration pattern
- Environment-specific bridge endpoints, store locations, and runtime limits are deployment config, not builder logic.

## Instantiation / runtime wiring
- A topology is complete only when it can say which process instantiates which services or agents and with what bridges, stores, and resources.

## Verification cues
- Each deployed process can list the service or agent instances it hosts.
- Queue-backed work, HTTP exposure, and sandbox runtime needs are explicit.
- No topology decision silently changes the underlying builder-defined business boundary.

## Common mistakes / anti-patterns
- Letting process layout redefine service boundaries.
- Mixing heavy durable workers into latency-sensitive HTTP processes without justification.
- Forgetting sandbox or queue prerequisites in production planning.
- Explaining topology without identifying the concrete runtime instances being deployed.

## How this connects to other PURISTA concepts
Deployment topology composes service builders, HTTP runtime, queue bridges, agents, sandbox runtime, stores, and observability.

## Read if needed
- `specs/20-agents/10-platform-architecture.md`
- `specs/15-async-queues/20-recommended-design-v1.md`
- `specs/25-voyage/70-backend/00-backend-architecture.md`
- `packages/httpserver`
- `packages/ai/src/sandbox`
