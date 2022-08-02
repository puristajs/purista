---
# This control sidebar index
index: true
order: 100
# This is the icon of the page
icon: bridge fas
# This is the title of the article
title: Event bridge
description: A brief overview about event bridge opportunities to be used with PURISTA typescript framework
# A page can have multiple tags
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
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Event bridge

## General

The concept of PURISTA is based on "some" message broker. The message broker is handling all the communication messages between single functions and subscriptions.

There are a lot of different message system out there. So the question is, which one to choose. So, what features should an ideal message broker provide.

### Push based

The broker should actively deliver messages to the client instead of client pull. The reason is, that if you deploy in serverless function style, single functions are stateless, and the single instances are only existing at the time of execution. So, there is no instance at all, which can  continuously pulling for new messages.

### Queues

Most of the brokers have the concept of queues, but not all queue concepts are sufficient for our use case.

To be able to share the load across multiple instances, the queue mechanism must be able to send one single message to exactly one client instance. It should not send the same message to multiple client instances.

An other point to mentioned here:  
We need in best case persistency per queue. Queues for command requests/responses should not hold the messages forever. If a command or its response is not handled within a given amount of time, the request has been timed out. So there is no need to deliver these messages after timeout.

But on the other hand, subscriptions should be able to handle messages later and the information should not get lost.

### RPC request/reply

The broker must be able to provide some way, to build a request-replay mechanism. Otherwise, it is not possible to call a service function and receive a result.  
In general, this pattern can be build with some kind of response queue. But, as our functions and subscriptions are maybe serverless/stateless, we will need the possibility to have response queues, which are short living and automatically created and removed.

### Content based delivery

Many message brokers have the concept of topics or routing key delivery. This works well, if you have some fixed topics or routing keys. The service function part of PURISTA would work, because you could simply use a combination of message type, service name, service version and function/subscription name as a routing key.

But what about subscriptions? Subscriptions are kind of dynamic and unknown. You might want to subscribe to one single event name, or you might want to subscribe to all error responses from any service function.

Also, you do not want to have a 1:1 relation. You always have one message producer, but you might have n message consumers.

The broker must be able to deliver the same message to n different consumers, based on the message and the consumers.

## DefaultEventBridge

The core package comes with `DefaultEventBridge` which will work on local without any further installation. This should work out of the box for single instances.  
You can also use it for simple horizontal scaling. The messages and states are not shared or load balanced between instances.

This means a subscription is always running on the same instance. Also, any function invocation is done within the same instance.

Because of this, the `DefaultEventBridge` will only work in scenarios, where you deploy your services as monolith.

## AMQP event bridge

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

## AWS

### AWS EventBridge

### AWS SNS

### AWS MQ

## Azure

### Azure Service Grid

### Azure Event Hubs

### Azure Service Bus

## Google Cloud

## Apache Kafka

## MQTT Brokers

MQTT is one of the most mature and widely used messaging protocols. As mentioned in the beginning of this page, there are several things a broker should provide.

The MQTT protocol version 5 has some interesting additions, like shared subscriptions, session ttl, message ttl and response fields. This reduces the gap between available broker features and our needs.

But handling subscriptions is still not possible out of the box. Delivering one message to multiple consumers, based on the message and the consumers, can't be handled by the brokers right now.
