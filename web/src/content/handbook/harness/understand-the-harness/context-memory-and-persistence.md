---
title: Context, memory, and persistence
description: Keep conversation history, application memory, workspaces, and workflow state distinct.
order: 150
---

These storage concerns solve different problems. Combining them into one generic
memory feature makes retention, privacy, and recovery decisions unclear.

| Concern | Purpose | Typical lifetime |
| --- | --- | --- |
| Conversation history | Reconstruct exchanged messages for a session | Session |
| Harness storage | Run lifecycle, checkpoints, and external waits | Run/workflow |
| Memory engine | Scoped facts and recall for future work | Across sessions when configured |
| Durable workspace | Files and execution state for replayable work | Workflow/execution |

The base in-memory implementations are useful for local development and tests.
They are not an implicit production persistence layer. A durable deployment
requires explicit storage/workspace or memory-engine wiring, retention,
encryption/backup policy, identity scoping, and operational verification.

The dedicated context/state chapter owns engine selection, conversation bounds,
memory adapters, workspaces, retention, and recovery.
