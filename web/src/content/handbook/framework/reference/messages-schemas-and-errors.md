---
title: Messages, schemas, and errors
description: Keep command, event, subscription, and HTTP boundaries typed, intentional, and diagnosable.
order: 1220
---

Treat a message schema as a public contract at its intended boundary, even when producer and consumer live in one repository today. Validate input at the boundary, use focused payloads, and return errors that a caller or operator can act on without exposing sensitive implementation data.

| Boundary | Contract concern | Verify |
| --- | --- | --- |
| Command | Input, result, and failure semantics | Unit and API/client contract tests |
| Event | Additive evolution and subscriber compatibility | Retained/replayed message test |
| Subscription | Input event and side-effect idempotency | Retry and duplicate-delivery test |
| HTTP | Public request/response/error shape | Consumer-facing integration test |

Avoid logging complete request bodies, secrets, or tenant data merely to debug a failed schema. Record the correlation/context information and a safe error classification, then restrict detailed diagnostic data to its authorized sink.

This page is a boundary lookup, not the error-behavior owner. Use
[Handle errors across service primitives](/handbook/framework/build-services/handle-service-errors/)
to classify schema rejection, `HandledError`, unexpected failure, retry, and
safe observability. Then follow the primitive-specific command, subscription,
stream, worker, or attached-agent guide for its actual response and recovery
semantics.

Read [message contracts](/handbook/framework/understand-the-framework/messages-schemas-and-contracts/), [authentication and authorization](/handbook/framework/secure-and-operate/security/authentication-and-authorization/), and [contract compatibility](/handbook/framework/upgrade-and-migrate/contract-compatibility/).
