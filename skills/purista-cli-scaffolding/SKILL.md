---
name: purista-cli-scaffolding
description: Teach untrained models how PURISTA CLI generators mirror builder-defined services, agents, queues, workers, and tests so scaffolding stays aligned with the framework.
topics: [cli, scaffolding, generators]
phases: [implementation]
---

# PURISTA CLI Scaffolding

## When to use this skill
Use this skill when creating new framework artifacts, aligning templates, or checking whether generated code reflects current PURISTA patterns.

## What this component/package is for
The CLI generates services, commands, subscriptions, streams, agents, queues, workers, and related tests using current framework conventions.

## Core PURISTA concept
Scaffolding is a projection of the builder model. The CLI must generate the same definition, implementation, configuration, and instantiation structure that the framework expects by hand.

## Builder lifecycle
1. Update framework builder patterns first.
2. Mirror those patterns in CLI content generators.
3. Ensure generated files assemble definitions back into the owning service or agent.
4. Ensure generated tests instantiate the runtime with current public helpers.

## Hard rules
- Framework changes that alter generated code must be mirrored in the CLI.
- Generated tests should use current public testing helpers.
- Do not let starter or scaffolding drift from `purista`.

## Decision rules
- Update generators when the public API or recommended structure changes.
- Keep generated examples opinionated but aligned with the framework’s latest supported path.
- Prefer teaching the canonical builder lifecycle over generating shortcuts that hide how PURISTA actually works.

## Definition pattern
- Generator outputs should create builder files, schema files, assembly files, and tests that reflect current PURISTA patterns.

## Implementation pattern
- Generate child builders from service builders.
- Generate service assembly files that call `getDefinition()` and re-register definitions.
- Generate tests that instantiate services or agents with the current helper stack.

## Configuration pattern
- Generator outputs should show where config schemas, resources, and runtime dependencies are declared.
- Do not hide runtime `getInstance(...)` wiring in templates that imply magic defaults.

## Instantiation / runtime wiring
- Generated examples and tests must still create service or agent instances explicitly.
- Starter and `create-purista` outputs should remain aligned with the same runtime wiring shape.

## Verification cues
- Generated output uses current builder APIs.
- Generated service files assemble definitions back into the service builder.
- Generated tests instantiate runtime with current public helpers.

## Common mistakes / anti-patterns
- Letting generated blueprints keep removed helper names.
- Updating framework docs without updating scaffolding.
- Treating template drift as acceptable technical debt.
- Generating files that hide the service/agent instantiation path.

## How this connects to other PURISTA concepts
CLI scaffolding mirrors service builders, agents, queues, resources, tests, starter defaults, and `create-purista` templates.

## Read if needed
- `packages/cli/README.md`
- `packages/cli/src/api/content`
- `packages/cli/src/api/content/manipulation/ensureQueueCollections.ts`
- `../starter`
- `../create-purista`
