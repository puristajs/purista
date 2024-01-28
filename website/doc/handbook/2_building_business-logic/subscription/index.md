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
