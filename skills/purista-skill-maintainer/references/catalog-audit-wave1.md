# PURISTA Skill Catalog Consolidation Audit

## Target catalog
- `purista`
  - the only shared framework skill consumed by apps and agents
  - teaches concepts, architecture, implementation, runtime wiring, and planning through `references/`
- `purista-skill-maintainer`
  - the only separate meta skill

## Consolidation inputs
The old fragmented framework skill set is folded into `purista`:
- core mental model
- application architecture
- service/builders/contracts
- resources and stores
- queues, streams, subscriptions, and bridges
- agents, runtime, testing, and AI integration
- HTTP, sandbox, MCP, and external bindings
- observability and deployment
- OTel Metrics API guidance, custom metric builders, typed `context.metrics`, and ai-harness telemetry ownership
- scaffolding and implementation planning
- spec-to-architecture guidance

## Umbrella-skill quality requirements
- `SKILL.md` stays compact and navigation-oriented
- most teaching depth lives in `references/`
- code snippets are short and verified
- references are grouped so a model can load only the needed topic
- architecture, runtime, and implementation guidance stay consistent instead of drifting across many folders

## Downstream review notes
- `voyage` should consume only `purista` plus its local overlay
- `specs/00-context.md` and public website context outputs must point at the single canonical path under `web/src/content/`
- framework tests must stop asserting the old multi-skill catalog shape
