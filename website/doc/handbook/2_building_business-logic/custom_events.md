---
title: Custom Event Messages
description: How to define and use custom events within PURISTA typescript nodejs backend framework
order: 204000
---

# Custom Event Messages

To be able to build real world systems, you will need to send events, which will be consumed by subscriptions or third party providers. The sender does/should not need to know, who is consuming this information.

To define a custom event, an event name and payload schema must be set. Commands,
subscriptions, streams, and AI agents all expose `canEmit(...)` so the event is
declared at builder time and emitted from the handler with a typed `context.emit(...)`.

Emitting custom events is quite easy. The command, subscription, stream, and
agent handler contexts all contain an async `emit(...)` function. It takes the
event name and the payload to send. The event type is inherited automatically
from the earlier `canEmit(...)` declaration.

Example:

```typescript

.canEmit('MyEventName', z.object({ some: z.string() }))
.setCommandFunction(async function ({ emit }, payload, _param) {
  await emit('MyEventName', { some: 'Payload' })
}

```

The same pattern works in streams and agents:

```typescript
.canEmit('support.agent.completed', z.object({ sessionId: z.string() }))
.setHandler(async function (context, payload) {
  await context.emit('support.agent.completed', { sessionId: payload.sessionId })
  return { message: 'done' }
})
```

The emitted message will have the current service (name & version & function/subscription-name) as sender address.
But there is no receiver defined at all. Emitting a custom event will be broadcasted without a specific receiver. It is up to you, to ensure, that there is somebody who listens for this event.
