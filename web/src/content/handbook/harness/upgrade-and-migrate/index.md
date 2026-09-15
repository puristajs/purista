---
title: Migrate to Harness v4
description: Move a Harness v3 application to the v4 definition, runtime binding, outcome, and lifecycle contracts.
order: 1300
---

Harness v4 is a clean break. Definitions are immutable, composition is
additive, and runtime adapters are supplied when an application creates an
instance. Generated builder modules and implicit runtime projections are
removed.

| Existing v3 usage | v4 destination |
| --- | --- |
| Fluent builder or module factory | defineAgent, defineWorkflow, defineTool, defineSkill, or defineMcpServer |
| One builder containing every capability | defineCatalog(...), then defineHarness(...).use(catalog) |
| Builder finalization | await definition.getInstance({ ...runtime bindings }) |
| Session prompt helpers | session.agents.id.run(...) or .stream(...) with explicit call IDs |
| Implicit approval booleans | Typed interrupted outcomes and resume |
| Split runtime/checkpoint stores | The v4 storage, memory, workspace, and artifact contracts selected by the runtime |
| Generated transport projections | PURISTA mountHarness(...) plus explicit Framework command, stream, queue, or HTTP projection |

Start with [the v3 to v4 rewrite](./migrate-to-v3/), then migrate adapters and
data, and finish with [verification and rollback](./verification-and-rollback/).

Keep all Harness packages on the same published v4 range. A successful install
does not prove provider capabilities, storage compatibility, or safe recovery.
