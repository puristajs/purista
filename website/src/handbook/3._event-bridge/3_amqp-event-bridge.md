---
order: 30
title: AMQP event bridge
shortTitle: AMQP
description: AMQP event bridge
tag:
  - typescript
  - nodejs
  - javascript
  - backend
  - framework
  - cloud
  - microservice
  - lambda
  - Installation
  - Setup
  - Guide
---

## Useage

The AMQP protocol and the corresponding brokers are perfectly for PURISTA.

The package `@purista/amqpbridge` provides an event bridge for the AMQP protocol. This means you can use [RabbitMQ](https://www.rabbitmq.com) as message broker. This is the recommended message broker. Also, [Apache ActiveMQ](https://activemq.apache.org/) should work.

By using the AMQP event bridge, the system will scale and load balance any task across all instances.  
It also allows you, to choose a more flexible way of deployment, as you are now able to split your monolith into small pieces.

You can:

- spin up multiple monolith instances
- you can split your monolith by services and run multiple service instances (microservice style)
- you can split even more down to single function and subscription level
- you are able to connect other systems via the amqp broker

The easiest way to start - simply start a RabbitMQ docker container:

```sh
docker run --rm -it --hostname my-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

### Pros

- allows scaling
- full subscription support

### Cons

- needs managing of an AMQP broker

## Config

## Example

