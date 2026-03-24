---
name: purista-command-builder
description: Teach untrained models how to define PURISTA commands with getCommandBuilder, schemas, handler implementation, definition assembly, and runtime service instances.
topics: [commands, schemas, services]
phases: [implementation]
---

# PURISTA Command Builder

## When to use this skill
Use this skill when implementing a synchronous or directly invoked business action.

## What this component/package is for
Commands define explicit request/response contracts for service actions such as create, approve, calculate, fetch, or trigger.

## Core PURISTA concept
A command is not just a handler. It is a builder-defined contract derived from a service builder, attached back to that service as a definition, and executed only through a running service instance.

## Builder lifecycle
1. Start from the owning service builder.
2. Create the builder with `getCommandBuilder(...)`.
3. Attach schemas with `addPayloadSchema(...)`, `addParameterSchema(...)`, and `addOutputSchema(...)` as needed.
4. Add metadata such as success event name or HTTP exposure when the command needs it.
5. Implement behavior with `setCommandFunction(...)`.
6. Call `getDefinition()`.
7. Register the definition on the service with `addCommandDefinition(...)`.
8. Execute the command through the running service instance created by `getInstance(...)`.

## Hard rules
- Validate input and output with schemas.
- Keep command handlers thin and resource-driven.
- Emit domain events explicitly when the command changes business state.
- Make command names business-oriented.

## Decision rules
- Use a command when a caller expects a direct response.
- If the work is long-running or durability-sensitive, split the initiation command from a queue-backed worker.
- Keep transport exposure optional; a command remains a PURISTA command even if it is also exposed over HTTP or tools.

## Definition pattern
- Place the command builder under the owning service version folder.

```text
src/service/<service-name>/v1/command/<command-name>/
  <commandName>CommandBuilder.ts
  schema.ts
  implementation.ts  # optional helper module if the logic is not kept inline
```

## Implementation pattern
- Put schema declarations beside the command builder.
- Use `setCommandFunction(...)` directly in the builder file or delegate to a nearby builder-owned implementation module when the logic grows.
- Keep resource and store access in helpers if the logic grows.
- Return domain results, not transport wrappers.

## Configuration pattern
- The command inherits service-owned config and resources from the service builder and service instance.
- Queue, store, logger, and resource access comes from the running service context, not from module-level globals.

## Instantiation / runtime wiring
- Commands do not run standalone; they are part of a service instance created with `getInstance(...)`.
- The owning service must register the command definition before instance creation.
- Runtime wiring supplies the logger, EventBridge, queue bridge, stores, and resources the handler relies on.

## Verification cues
- The command builder is derived from the owning service builder.
- `getDefinition()` is called and the result is passed into `addCommandDefinition(...)`.
- The handler uses context/resources instead of hidden globals.
- A reviewer can point to the service instance that would execute the command.

## Common mistakes / anti-patterns
- Returning transport-specific response wrappers from the handler.
- Hiding side effects inside untyped helper code.
- Turning one command into a workflow engine.
- Showing only `setCommandFunction(...)` without the service assembly and `getInstance(...)` path.

## How this connects to other PURISTA concepts
Commands are the most common service entrypoints and are often exposed through HTTP, tools, agents, or queue initiation patterns.

## Related skills
- `purista-service-builder` for the owning service lifecycle
- `purista-schema-contracts` for payload and output schemas
- `purista-queue-builder` for enqueue-then-process patterns
- `purista-http-runtime` for transport exposure
- `purista-external-runtime-bindings` for neutral tool exposure

## Read if needed
- `website/doc/handbook/2_building_business-logic/command/index.md`
- `packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts`
- `examples/client-builder/src/service/pingPong/v1/command/ping/pingCommandBuilder.ts`
- `examples/client-builder/src/service/pingPong/v1/pingPongV1Service.ts`
- `specs/15-async-queues/40-builder-integration.md`
