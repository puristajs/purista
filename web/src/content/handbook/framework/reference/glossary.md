---
title: Glossary
description: Short definitions for the Framework terms used throughout the handbook.
order: 1260
---

| Term | Meaning |
| --- | --- |
| Service | A versioned boundary for related business behavior. |
| Command | A typed request to perform one business action and return one result. |
| Event | A fact that has occurred and can be handled by one or more subscribers. |
| Subscription | A handler that reacts to an event. |
| Stream | A command-like interaction that returns incremental results. |
| Queue / worker | A durable-work pattern in which a producer creates work and a worker processes it asynchronously. |
| Bridge | The runtime integration that delivers messages to another process or external broker. |
| Store | A configuration, secret, or state implementation selected during application composition. |
| Principal | The authenticated actor represented by request/runtime context. |
| Tenant | The organization or isolation boundary that application logic must enforce. |
| Idempotency | Producing the intended business outcome once even when a message is delivered more than once. |
| DLQ | A dead-letter queue: a controlled holding area for work that cannot be processed normally. |

For the Harness's agent-specific terms, use the [AI Harness handbook](/handbook/harness/start/).
