---
title: Call other capabilities
description: Make synchronous dependencies, stream consumption, and event-to-queue handoffs explicit before a subscription performs them.
order: 336
---

Choose the boundary before adding code. A subscription already reacts
asynchronously to an event; a synchronous downstream call adds latency and
availability coupling. Use the event payload or a local resource first when it
contains the needed fact.

| Need | Choose | What the subscription waits for |
| --- | --- | --- |
| A typed bounded answer now | [Invoke a command](/handbook/framework/build-services/subscriptions/call-other-capabilities/invoke-command/) | The downstream command response. |
| Progressive frames and a deliberate cancellation boundary | [Consume a stream](/handbook/framework/build-services/subscriptions/call-other-capabilities/consume-a-stream/) | Each frame while the session is open. |
| Durable work with independent retry and worker operation | [Queue work from an event](/handbook/framework/build-services/subscriptions/call-other-capabilities/queue-work-from-an-event/) | Queue acceptance only. |
| An independent fact with no direct result | [Publish a custom event](/handbook/framework/build-services/subscriptions/publish-result-and-custom-events/) | The local emit operation, not another subscriber. |

Subscriptions can declare [`canInvoke`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#caninvoke), [`canConsumeStream`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#canconsumestream), and [`canEmit`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#canemit).
They do **not** have `canEnqueue`: calling `context.queue.enqueue(...)` from a
normal subscription is rejected at runtime. Use the service-level
event-to-queue binding when an event must start durable work.

For definitions and callback types, see [SubscriptionDefinitionBuilder](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
