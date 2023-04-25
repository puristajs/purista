---
order: 20
title: Edge device - no scale
shortTitle: Edge device
description: Edge device
image: https://purista.dev/graphic/edge.png
cover: https://purista.dev/graphic/edge.png
tag:
  - edge
  - edge device
  - bare metal
  - IoT
  - IIoT
  - setup
---

Running software built with PURISTA on edge devices is quite simple and does not need special handling.

There are in general 2 options.

The first option is, to run a single instance of your application and use the `DefaultEventBridge` of `@purista/core` package.
Especially if there are only limited system resources available, this fits perfectly. There is no need to have some additional message broker running on the edge device.
This means lower resource consumption and no software dependency.

![single instance](/graphic/single_instance.svg)

The second option is, to use an MQTT broker like [mosquitto](https://mosquitto.org) with a low footprint, but more capabilities.
An MQTT broker does not only provide better fault tolerance by persisting messages which are not processed. It also provides the capability to connect the edge device to a higher instance like the cloud.

It is possible to configure the broker in a way, where specific event messages are automatically available in some other broker. This means you can "extract/listen for data" without the need to change the application.

As a simplified illustration how it might look like this:

![edge device example](/graphic/edge.svg)

::: tip Pros

- low footprint
- can be connected to the cloud/server without much effort
- together with webassembly 🚀
- use the same application to run on edge and be able to scale on the cloud
:::

::: danger Cons

- 🤷
:::
