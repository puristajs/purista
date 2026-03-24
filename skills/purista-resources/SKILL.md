---
name: purista-resources
description: Teach untrained models how PURISTA resources are declared with defineResource and injected at runtime so handlers stay deterministic and portable.
topics: [resources, dependencies, infrastructure]
phases: [architecture, implementation]
---

# PURISTA Resources

## When to use this skill
Use this skill whenever a handler needs a database, SDK client, repository, search system, skill registry, or sandbox executor.

## What this component/package is for
Resources are PURISTA’s explicit dependency-injection boundary for external systems and heavy runtime collaborators.

## Core PURISTA concept
Resources belong to service or agent definition, but concrete resource objects are supplied only at runtime. A builder declares what it needs, and `getInstance(...)` receives the actual implementation.

## Builder lifecycle
1. Declare a resource on the service builder with `defineResource<'name', Type>()`.
2. Use builders derived from that service builder so handlers see typed resources in context.
3. Implement handlers against `context.app.resources` or the relevant typed context surface.
4. Pass concrete `resources` into `getInstance(...)`.

## Hard rules
- Put external dependencies behind resources.
- Keep resource construction outside handlers.
- Expose retrieval systems, skill registries, and sandbox executors as resources instead of magic globals.
- Make resources deterministic and mockable for tests.

## Decision rules
- Use a resource when the dependency is owned by the application runtime.
- Use a command when the model or another service should call the capability through an allowlisted business interface.
- Keep one resource focused on one runtime collaborator or adapter family.

## Definition pattern
- Declare resources on the service builder before deriving child builders.
- Keep resource names explicit and domain-oriented.

```text
src/
  resources/
    <resource-name>/
  service/
    <service-name>/
      v1/
        <serviceName>V1ServiceBuilder.ts
```

## Implementation pattern
- Handlers call resource-backed repositories, SDK wrappers, or adapters instead of constructing dependencies inline.
- Resource types should match the actual operations handlers need.
- Tests should provide mock or inline resource objects through service instantiation.

## Configuration pattern
- Put connection settings or credentials into config and secret stores, not into handler code.
- Use the resource implementation to read config, secrets, or environment prerequisites at runtime.
- Treat `FileSkillResource`, sandbox adapters, and similar runtime helpers as resources when they are application-owned.

## Instantiation / runtime wiring
- Resource declarations do nothing until `getInstance(...)` receives `resources`.
- Runtime bootstrap is responsible for creating the concrete resource map and passing it to the service or agent instance.
- Missing runtime resources at instantiation time are a wiring error, not something handlers should repair implicitly.

## Verification cues
- Every external dependency is declared via `defineResource(...)`.
- The handler can run in tests with mock resources.
- Runtime bootstrap can name exactly which resource objects are passed to `getInstance(...)`.
- No handler creates long-lived SDK clients or database connections directly.

## Common mistakes / anti-patterns
- Reintroducing a built-in knowledgebase abstraction instead of explicit resources and skills.
- Creating one giant `utils` resource with unrelated concerns.
- Mixing resource initialization with request-time state.
- Teaching only the resource implementation and forgetting the `defineResource(...)` plus `getInstance(...)` wiring.

## How this connects to other PURISTA concepts
Resources power services, agents, stores, sandbox execution, file-based skill resources, testing, and external integrations.

## Related skills
- `purista-core` for the overall definition-to-instance model
- `purista-service-builder` for where resources are declared
- `purista-schema-contracts` for contract boundaries around resource-backed handlers
- `purista-sandbox` for isolated execution adapters
- `purista-agent-runtime` for runtime skill and resource consumption

## Read if needed
- `website/doc/handbook/2_building_business-logic/service/define-resources.md`
- `packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts`
- `packages/core/test/resource.test.ts`
- `packages/ai/src/skills/fileSystem.ts`
- `examples/ai-basic/src/service/support/v1/supportV1Service.ts`
