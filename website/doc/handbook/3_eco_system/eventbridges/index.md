---
title: Event Bridges
description: Use the right event bridge for PURISTA typescript framwork
order: 301000
---

# Event Bridges

The concept of PURISTA is based on "some" message broker. The message broker is handling all the communication messages between single functions and subscriptions.

There are a lot of different message system out there. So the question is, which one to choose. So, what features should an ideal message broker provide.

## Supported message broker

| name                                        | scale | subscriptions*                        | durable   | status   |
|---                                          |:---:    |---                                    |:---:        |:---:       |
| [__Default__](./default_event_bridge.md)  | 🚫     | ✅ __complex__                        | 🚫        | stable   |
| [__MQTT__](./mqtt.md)                     | ✅     | ✅ __complex__                        | ✅        | beta |
| [__AMQP__](./amqp.md)        | ✅     | ✅ __complex__                        | ✅        | beta |
| __KubeMQ__                | ✅     | ☑️ _event only_                        | ✅        | [planned](https://github.com/sebastianwessel/purista/issues/64)     |
| [__NATS__](./nats.md)                     | ✅     | ✅ __complex__                        | 🚫       | beta |
| [__Dapr__](./dapr.md)                     | ✅     | ☑️ _event only_                        | ✅        | beta |
| __Knative__| ✅     | 🔎 under investigation   | 🔎        | [requested](https://github.com/sebastianwessel/purista/issues/113)|
| __AWS EventBridge__  | ✅     | ☑️ _event only<br>(max 5 per event)_   | ✅        | [planned](https://github.com/sebastianwessel/purista/issues/99)|

__(*)__ _- complex = based on events and/or additional properties like sender, receiver, type_
__(*)__ _- event only = subscriptions can subscribe to event names only_

You need a other message broker to be supported?
Than you can [open an issue](https://github.com/sebastianwessel/purista/issues) or implement on your own.

### Push based

The broker should actively deliver messages to the client instead of client pull. The reason is, that if you deploy in serverless function style, single functions are stateless, and the single instances are only existing at the time of execution. So, there is no real instance at all, which can  continuously pulling for new messages.

### Queues

Most of the brokers have the concept of queues, but not all queue concepts are sufficient for our use case.

To be able to share the load across multiple instances, the queue mechanism must be able to send one single message to exactly one client instance. It should not send the same message to multiple client instances.

An other point to mentioned here:
We need in best case persistency per queue. Queues for command requests/responses should not hold the messages forever. If a command or its response is not handled within a given amount of time, the request has been timed out. So there is no need to deliver these messages after timeout.

But on the other hand, subscriptions should be able to handle messages later and the information should not get lost.

### Request reply pattern

The broker must be able to provide some way, to build a request-replay mechanism. Otherwise, it is not possible to call a service function and receive a result.
In general, this pattern can be build with some kind of response queue. But, as our functions and subscriptions are maybe serverless/stateless, we will need the possibility to have response queues, which are short living and automatically created and removed.

### Content based delivery

Many message brokers have the concept of topics or routing key delivery. This works well, if you have some fixed topics or routing keys. The service function part of PURISTA would work, because you could simply use a combination of message type, service name, service version and function/subscription name as a routing key.

But what about subscriptions? Subscriptions are kind of dynamic and unknown. You might want to subscribe to one single event name, or you might want to subscribe to all error responses from any service function.

Also, you do not want to have a 1:1 relation. You always have one message producer, but you might have n message consumers.

The broker should be able to deliver the same message to n different consumers, based on the message and the consumers.
