---
title: Choose a memory engine
description: Select scoped application memory separately from Harness history, durable workflows, and business storage.
order: 620
---

`MemoryEngine` stores application context used by agents and workflows. It is
not conversation history, a durable step log, a secret store, or a business
ledger. Choose the engine by restart, sharing, search, and operational needs.

| Need | Choice |
| --- | --- |
| Unit tests or disposable local work | `inMemoryMemoryEngine()` |
| One-host persistence | SQLite adapter |
| Shared persistence | PostgreSQL, Redis, or NATS adapter |
| Specialized backend | Application-owned `MemoryEngine` |

Bind the selected engine with `definition.getInstance({ memory })`. Configure
embedding or summary model aliases only when the engine requires them. Scope
reads and writes with trusted tenant and principal identity, bound retention,
and explicit authorization.
