---
name: purista-implementation-planning
description: Break approved PURISTA architecture into implementation slices, ticketable work, and validation order.
topics: [planning, implementation, validation]
phases: [planning]
---

# PURISTA Implementation Planning

## When to use this skill
Use this skill when architecture is approved and the next step is execution planning, ticket slicing, or implementation sequencing.

## What this component/package is for
This skill turns architecture into build order: foundational packages, resources, services, contracts, workers, agents, tests, and deployment hardening.

## Hard rules
- Sequence infrastructure and contracts before dependent handlers.
- Keep tickets independently testable.
- Include validation and migration work, not only feature code.
- Preserve unresolved architecture questions as blockers.

## Decision rules
- Build schema/contracts before transports and UI.
- Build resources before commands or agents that depend on them.
- Land durable queue and run-state slices before long-running agent orchestration.

## Recommended file/folder structure
```text
implementation/
  slices.md
  dependencies.md
  risks.md
```

## Common implementation patterns
- Group work by disjoint write scope and dependency order.
- Separate platform foundation, domain behavior, AI orchestration, and UI/API exposure.
- Attach verification commands and expected test surface to each slice.

## Common mistakes / anti-patterns
- Planning by repository folder only.
- Mixing speculative improvements into the critical path.
- Ignoring store migrations, queue setup, or sandbox prerequisites.

## How this connects to other PURISTA concepts
This skill translates architecture into service builder work, resource wiring, queue workers, agent integration, CLI usage, and deployment checks.

## Read if needed
- `specs/27-voyage-execution/00-execution-epics.md`
- `specs/27-voyage-execution/25-sprint-slicing.md`
- `specs/27-voyage-execution/55-sprint-ticket-definition-pack.md`
- `website/doc/handbook/2_building_business-logic/agent/testing.md`
