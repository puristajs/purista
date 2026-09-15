---
title: Manage context and state
description: Choose what belongs in a session, an application store, memory, or a durable workspace.
order: 600
---

State has different lifetimes and security boundaries. Keep them separate so a
larger prompt does not accidentally become a retention policy.

| Need | Use | Default / availability |
| --- | --- | --- |
| Recent model exchanges | [Conversation history](/handbook/harness/manage-context-and-state/conversation-history/) | Requires configured storage for durable history. |
| Cross-worker findings | [Shared context](/handbook/harness/manage-context-and-state/shared-context/) | Application pattern, not a core store. |
| Scoped facts with search | [Memory](/handbook/harness/manage-context-and-state/memory/) | In-memory key/value is the core default. |
| Files and execution artifacts | [Durable workspaces](/handbook/harness/manage-context-and-state/durable-workspaces/) | Requires a workspace adapter. |
| Lifecycle policy | [Retention, recovery, and migration](/handbook/harness/manage-context-and-state/retention-recovery-and-migration/) | Application-owned operations policy. |

Use principal and tenant identifiers consistently when opening a session. Never
put secrets, raw regulated records, or authorization decisions into memory just
because an agent may need context.
