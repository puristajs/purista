---
title: Custom Event Messages
description: How to define and use custom events within PURISTA typescript nodejs backend framework
order: 204000
---

# Custom Event Messages

To be able to build real world systems, you will need to send events, which will be consumed by subscriptions or third party providers. The sender does/should not need to know, who is consuming this information.

To define a custom event, an event name and a event schema must be set. The command and subscription builders provide the `canEmit` method, which should be used.

Emitting custom events is quite easy. The function context and the subscription context containing a helper function `emit`.
This async `emit` function has two parameters. The event name and the optional payload to be sent.  
The event name and type is automatically inherited by the definition done with `canEmit`.

Example:

```typescript

.canEmit('MyEventName', z.object({ some: z.string() }))
.setCommandFunction(async function ({ emit }, payload, _param) {
  await emit('MyEventName', { some: 'Payload' })
}

```

The emitted message will have the current service (name & version & function/subscription-name) as sender address.
But there is no receiver defined at all. Emitting a custom event will be broadcasted without a specific receiver. It is up to you, to ensure, that there is somebody who listens for this event.
