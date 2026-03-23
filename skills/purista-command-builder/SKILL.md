---
name: purista-command-builder
description: Implement request/response business actions with strong schemas, resource-backed handlers, and explicit side effects.
topics: [commands, schemas, services]
phases: [implementation]
---

# PURISTA Command Builder

## When to use this skill
Use this skill when implementing a synchronous or directly invoked business action.

## What this component/package is for
Commands define explicit request/response contracts for actions such as create, approve, calculate, or trigger.

## Hard rules
- Validate input and output with schemas.
- Keep handlers thin and resource-driven.
- Emit domain events explicitly when the command changes business state.
- Make command names business-oriented.

## Decision rules
- Use a command when a caller expects a direct response.
- If the work is long-running or durability-sensitive, split the initiation command from a queue-backed worker.

## Recommended file/folder structure
```text
src/service/<service-name>/v1/command/<command-name>/
  <commandName>CommandBuilder.ts
  schema.ts
  handler.ts
```

## Common implementation patterns
- Put Zod or schema declarations beside the command builder.
- Keep resource and store access in dedicated helpers if the logic grows.
- Publish follow-up events after the state change succeeds.

## Common mistakes / anti-patterns
- Returning transport-specific response wrappers from the handler.
- Hiding side effects inside untyped helper code.
- Turning one command into a workflow engine.

## How this connects to other PURISTA concepts
Commands are the most common external runtime bindings, AI tools, HTTP endpoints, and queue entrypoints.

## Read if needed
- `website/doc/handbook/2_building_business-logic/command/index.md`
- `website/doc/handbook/2_building_business-logic/schemas.md`
- `specs/15-async-queues/40-builder-integration.md`
