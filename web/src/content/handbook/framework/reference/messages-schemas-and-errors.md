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

## Find the concrete public types

| Surface | Public API | What it represents |
| --- | --- | --- |
| Message envelope | [`EBMessage`](/handbook/api/types/_purista_core.EBMessage/) | The union of command, response, custom-event, info, and stream protocol messages carried by EventBridge. |
| Message discriminator | [`EBMessageType`](/handbook/api/enums/_purista_core.EBMessageType/) | The `messageType` values used for routing and subscription filters. |
| Safe business error | [`HandledError`](/handbook/api/classes/_purista_core.HandledError/) | A reviewed status, message, optional data, and trace ID that may cross the service boundary. |
| Internal/runtime error | [`UnhandledError`](/handbook/api/classes/_purista_core.UnhandledError/) | A failed downstream/runtime operation whose details remain internal on normal command boundaries. |
| Status values | [`StatusCode`](/handbook/api/enums/_purista_core.StatusCode/) | HTTP-shaped numeric values shared by messages and HTTP projections. |

Schemas use PURISTA's Standard Schema validation boundary. Builders infer
payload, parameter, and result types from the schema while the runtime validates
incoming and outgoing values. A TypeScript type alone does not validate a
message received from a bridge or HTTP client.

This page is a boundary lookup, not the error-behavior owner. Use
[Handle errors across service primitives](/handbook/framework/build-services/handle-service-errors/)
to classify schema rejection, `HandledError`, unexpected failure, retry, and
safe observability. Then follow the primitive-specific command, subscription,
stream, worker, or mounted-Harness guide for its actual response and recovery
semantics.

Read [message contracts](/handbook/framework/understand-the-framework/messages-schemas-and-contracts/), [authentication and authorization](/handbook/framework/secure-and-operate/security/authentication-and-authorization/), and [contract compatibility](/handbook/framework/upgrade-and-migrate/contract-compatibility/).
