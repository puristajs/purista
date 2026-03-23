---
name: purista-resources
description: Model external dependencies as explicit PURISTA resources and keep handlers deterministic, testable, and portable.
topics: [resources, dependencies, infrastructure]
phases: [architecture, implementation]
---

# PURISTA Resources

## When to use this skill
Use this skill whenever a handler needs a database, SDK client, repository, search system, skill registry, or sandbox executor.

## What this component/package is for
Resources are PURISTA’s dependency-injection boundary for external systems and heavy runtime collaborators.

## Hard rules
- Put external dependencies behind resources.
- Keep resource construction outside handlers.
- Expose retrieval systems, skill registries, and sandbox executors as resources instead of special magic APIs.

## Decision rules
- Use a resource when the dependency is owned by the application runtime.
- Use a command when the model or another service should call the capability through an allowlisted business interface.

## Recommended file/folder structure
```text
src/resources/
  <resource-name>/
```

## Common implementation patterns
- Resource-backed repositories for domain data.
- Resource-backed `FileSkillResource` or application skill loaders.
- Resource-backed sandbox execution adapters.

## Common mistakes / anti-patterns
- Reintroducing removed abstractions such as a built-in knowledgebase layer.
- Creating one giant “utils” resource with unrelated concerns.
- Mixing resource initialization with request-time state.

## How this connects to other PURISTA concepts
Resources power services, agents, stores, sandbox execution, testing, and external integrations.

## Read if needed
- `website/doc/handbook/2_building_business-logic/service/define-resources.md`
- `website/doc/handbook/2_building_business-logic/agent/handler-context.md`
- `packages/ai/src/skills/fileSystem.ts`
