---
title: Subscription
description: How to add a subscription to a PURISTA typescript framework service
order: 203000
---

# Subscription

![Add subscription with cli](/graphic/add_subscription.png)

A subscription is a function which will be triggered by messages and events, when the given criteria are matching.
The producer of the message does not have knowledge about the subscription.

Subscriptions do not need to return a value.
If a subscription is returning a value, it will be emitted as custom message to the event bridge.
The subscription does not have any knowledge if the custom message has a consumer.

Subscriptions can access service resources (for example database clients/connections) via `context.resources`.
Resources are provided when creating the service instance with `serviceBuilder.getInstance(eventBridge, { resources: ... })`.
Subscriptions can also consume stream endpoints via `context.stream` when declared with `.canConsumeStream(...)`.
Typical use cases:

- update projections/read models after command success events
- send emails/notifications after business events
- trigger asynchronous integrations with external systems
- run cross-cutting reactions like auditing and metrics enrichment

In PURISTA, subscriptions are declared with the subscription builder:

- define input/parameter/output schemas
- configure matching filters (event name, sender/receiver, message type, tenant/principal)
- optionally define invokes and emitted events
- provide the subscription function implementation

Continue with:

- [The Subscription Builder](./the-subscription-builder.md)
- [Unit test a subscription](./unit-test-a-subscription.md)

## When to use

- You need asynchronous side effects.
- Multiple consumers should react to domain events.
- Work should continue even if the original caller is gone.

## Common pitfalls

- using subscriptions for synchronous request/response logic
- overly broad filters causing unexpected message matches
- assuming broker delivery guarantees that are not configured

## Checklist

- filter scope is explicit (event/message/sender/tenant/principal)
- durable/shared/ack hints are aligned with the broker setup
- emitted events (if any) have explicit schemas
- unit tests cover matching and non-matching scenarios
