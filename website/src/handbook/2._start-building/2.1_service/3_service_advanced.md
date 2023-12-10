---
order: 30
title: Advanced
shortTitle: Advanced
description: Use a custom service class.
image: https://purista.dev/graphic/add_service.png
tag:
  - service
---

## Service class events

Service instances are able to emit regular JavaScript events. This provides a way to observe the service instance, and to decouple things.

As an example:  
You like to try out [Prometheus](https://prometheus.io) to track certain data.  
One way of doing it, would be to directly integrate the Prometheus client into your commands and subscriptions.  

But, by doing this, it would add a dependency, directly to your business code, with all the down sides.  
A better way is, to emit the data from your command or subscription as regular JavaScript events.  
Some function "outside" your service can listen to these events, and process the data.

::: tip PRO

- keeps the business code isolated
- easier to test and to handle errors
- the dependency will be in one place - easier to maintain, fewer duplicate code
- the dependency will become optional - e.g. can simpler replaced by other solutions
:::

::: danger CONTRA

- a bit more overhead at the beginning
:::

### Event types

There are three types:

- technical events relating to the service itself are prefixed with `service-` (see [ServiceEventsNames](../../../api/enums/purista_core.ServiceEventsNames.md))
- response messages, which have an event name assigned, are prefixed with `custom-`
- additional events can be introduced by developers, and they must be prefixed with `misc-`

### Example

As an example, we will simply count the unhandled errors with the Prometheus client.

```typescript
// observer.ts
import client from 'prom-client'

export const collectData = (serviceInstance: Service) => {
  // Create a Registry which registers the metrics
  const register = new client.Registry()
  // Enable the collection of default metrics
  client.collectDefaultMetrics({ register })
  // Add a default label which is added to all metrics
  register.setDefaultLabels({
    serviceName: theService.info.serviceName,
    serviceVersion: theService.info.serviceVersion,
  })

  // create a counter
  const counter = new client.Counter({
    name: 'unhandled_error_count',
    help: 'metric_help',
  });

  serviceInstace.on(ServiceEventsNames.CommandUnhandledError, ()=> {
    counter.inc()
  })

  serviceInstace.on(ServiceEventsNames.SubscriptionUnhandledError, ()=> {
    counter.inc()
  })

  return register
}
```

```typescript
// main or index file
// ...
import { collectData } from './observer'
// ...
// your regular instance creation an existing code
// ...

const register = collectData(serviceInstance)

// if you use the @purista/k8s-sdk
// expose the metrics like this
server.router.add('GET', '/metrics', async (_request, response) => {
  response.setHeader('content-type', register.contentType)
  response.end(await register.metrics())
})

```

As you can see, things are nicely separated and structured. You can re-use the `collectData` for multiple services, if you want.

### Custom events

You can emit custom JavaScript events in command and subscription functions. They must be prefixed with `misc-`. They can emit any

Example of emitting custom events:

```typescript
.setCommandFunction(async function (context, payload, parameter) {
  const customValue = {
    value: 'something'
  }

  this.emit('misc-object', customValue)

  const customValue = {
    value: 'something'
  }

  this.emit('misc-string', 'string_value')
  this.emit('misc-number', 1)
  this.emit('misc-boolean', 1)
})
```

Example of listening for custom events:

```typescript
serviceInstace.on('misc-string', (eventPayload)=> {
    console.log(eventPayload) // outputs: string_value
})
```

::: tip Use enum for custom events
It is recommended, to use your own enum for emitting and listener registration of events. 
Your code will become more maintable.
:::
