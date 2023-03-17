---
order: 20
title: Edge device - no scale
shortTitle: Edge device
description: Edge device
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

Running software built with PURISTA on edge devices is quite simple and does not need special handling.

There are in general 2 options.

The first option is, to run a single instance of your application and using the `DefaultEventBridge` of `@purista/core` package.  
Especially if there are only limited system ressources available, this fits perfect. There is no need to have some additional message broker running on the edge device.  
This means lower ressource consumption and no software dependency.

![single instance](/graphic/single_instance.svg)

The second option is, to use a MQTT broker like [mosquitto](https://mosquitto.org) with low foot print, but more capabilities.  
An MQTT broker does not only provide better fault tolerance by persisting messages wich are not processed. It also provides the capability to connect the edge device to a higher instance like cloud.  

It is possible to configure the broker in way, where specific event messages are automatically available in some other broker. This means you can "extract/listen for data" without the need to change the application.

As a simplified illustration how it might look like:

![edge device example](/graphic/edge.svg)

## Pros

- low footprint
- can be connected to cloud/server without much effort
- together with webassembly 🚀
- use same application to run on edge and be able to scale on cloud

## Cons

- 🤷