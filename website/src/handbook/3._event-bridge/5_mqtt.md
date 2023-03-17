---
order: 50
title: MQTT event bridge
shortTitle: MQTT
description: MQTT event bridge
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

MQTT with the popular [mosquitto broker](https://mosquitto.org) is one of the most mature and widely used messaging protocols.  

The MQTT protocol version 5 has some interesting additions, like shared subscriptions, session ttl, message ttl and response fields. This reduces the gap between available broker features and our needs.

But handling complex subscriptions is still not possible out of the box.

### Pros

- allows scaling
- fault tollerant
- MQTT is a mature and widely used (IoT/edge)

### Cons

- needs managing of an MQTT broker
- only subscribe by event name supported
- command responses are emitted as 2 messages if event name is set

## Config

## Example
