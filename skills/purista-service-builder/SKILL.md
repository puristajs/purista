---
name: purista-service-builder
description: Define versioned PURISTA services with resources, configuration, lifecycle, and bounded responsibilities.
topics: [services, builders, resources]
phases: [architecture, implementation]
---

# PURISTA Service Builder

## When to use this skill
Use this skill when creating or refactoring a service boundary.

## What this component/package is for
The service builder defines service identity, resources, configuration, hooks, and the container for commands, subscriptions, streams, and queue workers.

## Hard rules
- Keep one clear domain responsibility per service.
- Declare resources and config on the service, not inside handlers.
- Version services explicitly.
- Avoid leaking transport concerns into the service definition.

## Decision rules
- Add a new service when ownership, state, or integration boundaries differ materially.
- Add a new version when a public contract changes incompatibly.

## Recommended file/folder structure
```text
src/service/<service-name>/v1/
  <serviceName>V1Service.ts
  command/
  subscription/
  stream/
  queue/
  worker/
```

## Common implementation patterns
- Build service first, then register commands and subscriptions under the version folder.
- Keep resource factories deterministic and injectable for tests.
- Export the versioned service module from a stable index.

## Common mistakes / anti-patterns
- One “misc” service with unrelated business behavior.
- Resource construction inside command handlers.
- Forgetting versioned folder boundaries.

## How this connects to other PURISTA concepts
Service builders host commands, subscriptions, streams, queues, resources, stores, and agent entrypoints.

## Read if needed
- `website/doc/handbook/2_building_business-logic/service/the-service-builder.md`
- `website/doc/handbook/2_building_business-logic/service/define-resources.md`
- `website/doc/handbook/2_building_business-logic/service/unit-test-a-service.md`
