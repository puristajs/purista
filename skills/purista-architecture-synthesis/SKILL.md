---
name: purista-architecture-synthesis
description: Synthesize complete PURISTA architecture documents with subdocuments, service boundaries, workflows, and implementation-ready artifact plans.
topics: [architecture, services, queues, agents, stores]
phases: [architecture]
---

# PURISTA Architecture Synthesis

## When to use this skill
Use this skill when the user wants a concrete architecture package, not just a short narrative summary.

## What this component/package is for
This skill guides the generation of a complete architecture set: overview, service docs, flow docs, state and integration boundaries, and implementation slices.

## Hard rules
- Produce a full artifact set, not only a top-level overview.
- Every referenced subdocument must exist.
- Distinguish synchronous command flows, asynchronous queue flows, and streaming flows.
- Call out missing information instead of silently filling risky gaps.

## Decision rules
- Use one service document per major bounded context.
- Use one flow document per cross-service or long-running workflow.
- Add ADRs only for decisions that materially affect implementation or operations.

## Recommended file/folder structure
```text
architecture/
  index.md
  services/
  flows/
  contracts/
  decisions/
```

Persist canonical architecture truth in markdown only. Derived summaries or status projections may exist, but they must be rebuildable and must never outrank the markdown documents.

## Common implementation patterns
- Start from business capabilities, then map services, contracts, queues, and agents.
- Split durable workflows into queue workers plus run-state checkpoints.
- Keep frontend/UI implications in separate notes so backend structure stays clear.

## Common mistakes / anti-patterns
- Referencing files that were never generated.
- Mixing product summary, detailed design, and sprint planning into one page.
- Letting agent/tool choice drive the service decomposition.

## How this connects to other PURISTA concepts
This skill composes service builder, command/subscription/queue skills, agent runtime, stores, HTTP runtime, sandbox, and observability.

## Read if needed
- `specs/26-voyage-refinement/05-architecture-model.md`
- `specs/25-voyage/50-visualization/00-architecture-and-flow.md`
- `specs/27-voyage-execution/10-implementation-tickets.md`
- `website/doc/handbook/2_building_business-logic/agent/run-state.md`
