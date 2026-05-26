---
title: Deploy to Dapr
description: Deploy your typescript application in a microservice styled way
order: 503020
---

# Deploy to Dapr

## Why Dapr matters for PURISTA portability

The most powerful aspect of the Dapr integration is **infrastructure portability**. PURISTA's `DaprEventBridge` (from `@purista/dapr-sdk`) always connects to the Dapr sidecar — never to a broker directly. Dapr then handles the actual pub/sub routing through whichever component you configure:

| Dapr pub/sub component | Underlying broker |
|---|---|
| `pubsub.redis` | Redis Streams |
| `pubsub.kafka` | Apache Kafka |
| `pubsub.azure.servicebus` | Azure Service Bus |
| `pubsub.aws.snssqs` | AWS SNS + SQS |
| `pubsub.rabbitmq` | RabbitMQ |

**You change a Dapr component YAML file to switch brokers. No PURISTA code changes at all.** This is the key benefit: your service code is written once and is cloud-agnostic at the infrastructure level.

## Dapr core concept

Deployments to Dapr are similar to Kubernetes deployments.
Your single services are deployed as containers (pods) on a Kubernetes cluster.
On plain Kubernetes deployments, the event bridge of a service is directly connected to the message broker.
If you are on a Dapr infrastructure, Dapr will automatically add a sidecar container to your service instance.
The whole communication from and to your service is passed through this sidecar container.

Dapr also provides abstraction and adapters for config, state, and secret stores.

To learn more about Dapr, visit the official site __[dapr.io](https://dapr.io/)__.

![single instance](/graphic/dapr.svg)

## Prepare your code

Similar to Kubernetes deployments, a http server must be provided by your service instance.
The `@purista/dapr-sdk` package provides an event bridge which works as an HTTP server. In addition, adapters for config, state, and secrets stores are available.

The bootstrap pattern replaces `AmqpBridge` / `NatsBridge` with `DaprEventBridge`. Everything else — service instantiation, graceful shutdown — stays the same:

```typescript
// src/index.ts (Node.js runtime — pass the Hono Node adapter as `serve`)
import { serve } from '@hono/node-server'
import { gracefulShutdown, initLogger } from '@purista/core'
import { DaprEventBridge } from '@purista/dapr-sdk'
import { orderV1ServiceBuilder } from './service/order/v1/orderV1ServiceBuilder.js'

const main = async () => {
  const logger = initLogger('info')

  // DaprEventBridge acts as an HTTP server for the Dapr sidecar injected by Kubernetes.
  // The sidecar handles pub/sub routing to whichever component is configured
  // (Redis, Kafka, Azure Service Bus, AWS SNS+SQS, RabbitMQ, ...).
  const eventBridge = new DaprEventBridge({ serve })
  await eventBridge.start()

  const orderService = await orderV1ServiceBuilder.getInstance(eventBridge)
  await orderService.start()

  gracefulShutdown(logger, [eventBridge, orderService])
}

main()
```

You change a Dapr component YAML file to switch the underlying broker. No PURISTA code changes are needed.

You can find a complete runnable example in the [PURISTA repository](https://github.com/puristajs/purista/tree/master/examples/dapr-example).
This example also contains the usage of the Dapr config store, secret store, and state store.

### Kubernetes deployment file

The deployment of an application or service follows the regular Kubernetes deployment.
The only difference here is, to provide the information, required by Dapr to work properly.

Dapr requires to have a unique app-ID for a service defined in the deployment.
This id match the pattern `[prefix-][convertToKebabCase(service-name)]-v[convertToKebabCase(service version)]`.
If the app-ID does not follow this pattern, PURISTA services might be not able to invoke commands or subscribe to events correctly

```yaml
# file order-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: purista-order-service-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: purista-order-service
  template:
    metadata:
      # We add the annotations below to let Dapr recognize
      # and deploy the sidecar together with our service in the pod.
      annotations:
        dapr.io/enabled: "true"
        # The client service will use this name to locate
        # the Order service through the Dapr sidecar.
        dapr.io/app-id: "purista-order-v1"
        # The port that your application is listening on
        dapr.io/app-port: "3000"
      labels:
        app: purista-order-service
    spec:
      containers:
        - name: purista-order-service
          image: example/dapr-example-purista-order-service
```

### Limitations

Dapr provides some additional functionality, like the concept of actors or bulk messaging. Currently these functionalities are not supported by the `@purista/dapr-sdk`.

It is also not possible to deploy multiple services or service versions in one container (pod). Each service/service-version must be deployed independently.
