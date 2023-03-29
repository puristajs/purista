---
order: 40
title: MQTT event bridge
shortTitle: MQTT
description: MQTT event bridge
tag:
  - event bridge
  - MQTT
  - mosquitto
---

MQTT support is on the roadmap!

see: [Github feature request](https://github.com/sebastianwessel/purista/issues/98)

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__

## General

MQTT with the popular [mosquitto broker](https://mosquitto.org) is one of the most mature and widely used messaging protocols.  

The MQTT protocol version 5 has some interesting additions, like shared subscriptions, session ttl, message ttl and response fields. This reduces the gap between available broker features and our needs.

But handling complex subscriptions is still not possible out of the box.

::: tip Pros

- allows scaling
- fault tollerant
- MQTT is a mature protocol and widely used (IoT/edge)
:::

::: danger Cons

- needs managing of an MQTT broker
- only subscribe by event name supported
- command responses are emitted as 2 messages if event name is set
:::

## Config

## Example
