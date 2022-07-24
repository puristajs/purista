---
# This control sidebar index
index: true
order: 60
# This is the icon of the page
icon: hand-holding-magic fas
# This is the title of the article
title: Custom events
# A page can have multiple tags
tag:
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Custom events

To be able to build real world systems, you will need to send events, which will be consumed by subscriptions or third party providers. The sender does/should not need to know, who is consuming this information.

Emitting custom events is quite easy. The function context and the subscription context containing a helper function `emit`.  
This async `emit` function has two parameters. The event name and the optional payload to be send.

Example:

```typescript

.setFunction(async function ({ emit }, payload, _param) {
  await emit('MyEventName', { some: 'Payload' })
}

// you can also set a type for payload

.setFunction(async function ({ emit }, payload, _param) {
  await emit<number>('MyEventName', 1)
}

```

The emitted message will have the current service (name & version & function/subscription-name) as sender address.  
But there is no receiver defined at all. Emitting a custom event will be broadcasted without a specific receiver. It is up to you, to ensure, that there is somebody who listens for this event.
