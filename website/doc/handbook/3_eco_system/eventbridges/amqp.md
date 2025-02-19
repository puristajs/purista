---
title: AMQP Event Bridge
description: Use the AMQP event bridge of PURISTA
order: 301020
---

![AMQP event bridge](/graphic/amqp_event_bridge_header.png)

# AMQP Event Bridge

The AMQP protocol and the corresponding brokers are perfectly for PURISTA.

The package `@purista/amqpbridge` provides an event bridge for the AMQP protocol. This means you can use [RabbitMQ](https://www.rabbitmq.com) as message broker. This is the recommended message broker. Also, [Apache ActiveMQ](https://activemq.apache.org/) should work.

By using the AMQP event bridge, the system will scale and load balance any task across all instances.
It also allows you, to choose a more flexible way of deployment, as you are now able to split your monolith into small pieces.

You can:

- spin up multiple monolith instances
- you can split your monolith by services and run multiple service instances (microservice style)
- you can split even more down to single function and subscription level
- you are able to connect other systems via the amqp broker

::: tip Pros

- allows scaling
- full subscription support
- support of durable queues
- retry mechanism
- dead letter queues
:::

::: warning Cons

- needs managing of an AMQP broker
- no auto-reconnect
:::

## Configuration

The AMQP event bridge uses the unified configuration schema as all event bridges.

::: info API documentation

- [General event bridge config](../../../api/@purista/core/classes/EventBridgeBaseClass.md)
- [AMQP bridge config](../../../api/@purista/amqpbridge/README.md)
:::

## Usage example

The easiest way to start - simply start a RabbitMQ docker container:

```sh
docker run --rm -it --hostname my-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

Add the AMQP bridge to your code:

```typescript
import { AmqpBridge, AmqpBridgeConfig } from '@purista/amqpbridge'

// create and init our eventbridge

const config:AmqpBridgeConfig = {
    url: 'amqp://my-amqp-host.example.com'
  }

const eventBridge = new AmqpBridge( config )
await eventBridge.start()

```

## Brokers and tools

- [RabbitMQ](https://www.rabbitmq.com/)

::: tip OpenTelemetry
PURISTA is using the AMQP header feature to add the OpenTelemetry information to each message, as recommended:
[https://w3c.github.io/trace-context-mqtt/](https://w3c.github.io/trace-context-mqtt/).
:::
