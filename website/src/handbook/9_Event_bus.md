---
# This control sidebar index
index: true
order: 100
# This is the icon of the page
icon: cloud fas
# This is the title of the article
title: Event bridge
# A page can have multiple tags
tag:
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Event bridge

## General

## DefaultEventBridge

The core package comes with `DefaultEventBridge` which will work on local without any further installation. This should work out of the box for single instances.  
You can also use it for simple horizontal scaling. The messages and states are not shared or load balanced between instances.

This means a subscription is always running on same instance. Also any function invocation is done within the same instance.

Because of this, the `DefaultEventBridge` will only work in scenarios, where you deploy your services as monolith.

## AMQP event bridge

The package `@purista/amqpbridge` provides an event bridge for the AMQP protocol. This means you can use [RabbitMQ](https://www.rabbitmq.com) as message broker. This is the recommended message broker.

By using the AMQP event bridge, the system will scale and load balance any task across all instances.  
It also allows you, to choose a more flexible way of deployment, as you are now able to split your monolith into small pieces.

You can:

- spin up multiple monolith instances
- you can split you monolith by services and run multiple service instances (microservice style)
- you can split even more down to single function and subscription level
- you are able to connect other systems via the amqp broker

The easiest way to start - simply start a RabbitMQ docker container:

```sh
docker run --rm -it --hostname my-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

## AWS

### AWS eventbridge

### AWS SNS

### AWS MQ

## Azure

### Azure Service Bus

## Google Cloud
