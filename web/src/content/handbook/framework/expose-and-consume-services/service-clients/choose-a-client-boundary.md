---
title: Choose direct, EventBridge, REST, or fetch execution
description: Select the client by process, trust, transport, and failure boundary instead of convenience.
order: 442
---

| Caller boundary | Use | Main consequence |
| --- | --- | --- |
| Focused handler unit test | Builder direct function or context mock | Fast and deterministic, but bypasses service/EventBridge lifecycle. Never use as production service-to-service routing. |
| Same process, trusted application component | Generated EventBridge client with the shared `DefaultEventBridge` | Keeps address-first routing, validation, identity propagation, tracing, and later distribution possible. |
| Different process on a broker | Generated EventBridge client with the selected broker-backed EventBridge | Requires broker health, ACLs, timeouts, compatibility, and partial-failure handling. |
| Browser or external consumer | Generated REST client for HTTP-exposed commands | Uses Hono's public authentication, content, error, and URL contract. |
| Application calling a non-PURISTA HTTP API | `HttpClient` resource or application-owned `fetch` wrapper | The application owns the remote schema, auth, retry, and error mapping. |

Production service calls remain address-first through EventBridge even when
both services share a process. Importing and calling another command handler
creates a hidden dependency, bypasses message identity, and prevents the
EventBridge from selecting another instance.

The generated clients cover commands. Streams use the Framework stream client
declared with `canConsumeStream(...)`; queues use `canEnqueue(...)`; attached
Harness targets use their address-first contracts. Do not force every
capability into a REST command merely to reuse one client generator.

Next: [use a direct or embedded client](/handbook/framework/expose-and-consume-services/service-clients/use-a-direct-or-embedded-client/).
