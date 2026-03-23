---
name: purista-cli-scaffolding
description: Use and align the PURISTA CLI so generated services, agents, queues, and tests match the current framework patterns.
topics: [cli, scaffolding, generators]
phases: [implementation]
---

# PURISTA CLI Scaffolding

## When to use this skill
Use this skill when creating new framework artifacts, aligning templates, or checking whether generated code reflects current PURISTA patterns.

## What this component/package is for
The CLI generates services, commands, subscriptions, streams, agents, queues, workers, and related tests using current framework conventions.

## Hard rules
- Framework changes that alter generated code must be mirrored in the CLI.
- Generated tests should use current public testing helpers.
- Do not let starter or scaffolding drift from `purista`.

## Decision rules
- Update generators when the public API or recommended structure changes.
- Keep generated examples opinionated but aligned with the framework’s latest supported path.

## Recommended file/folder structure
```text
packages/cli/src/api/
starter/
create-purista/
```

## Common implementation patterns
- Generate agent tests with `createAgentTestHarness` and `ScriptedModel`.
- Keep queue and worker scaffolding aligned with durable execution patterns.
- Document new commands in the CLI README.

## Common mistakes / anti-patterns
- Letting generated blueprints keep removed helper names.
- Updating framework docs without updating scaffolding.
- Treating template drift as acceptable technical debt.

## How this connects to other PURISTA concepts
CLI scaffolding mirrors service builders, queues, agents, testing helpers, and recommended folder structure.

## Read if needed
- `packages/cli/README.md`
- `packages/cli/src/api/content/agent/getAgentTestFileContent.ts`
- `AGENTS.md`
