---
title: Failure and durability model
description: Understand what fails fast, what is retried, and which durability boundary your application must supply.
order: 160
---

Harness validates definitions and required capabilities before a run. Model
operations use bounded retry policy; a provider's long retry window can return a
typed deferred outcome for application queue/worker scheduling instead of
sleeping through a request timeout.

| Need | Boundary that owns it |
| --- | --- |
| Typed input/output and capability validation | Harness |
| Model retry budget and cancellation propagation | Harness configuration |
| Message delivery, retry scheduling, and DLQ | Application or PURISTA queue/worker |
| Durable run/checkpoint persistence | Selected Harness storage/workspace adapter |
| Domain idempotency and side-effect reconciliation | Application workflow/domain service |

Do not retry a model call blindly after a tool or workflow step may have changed
external state. Record an application idempotency key and make the workflow
resume from a committed boundary.

Next: [configure the runtime](/handbook/harness/configure-the-runtime/).
