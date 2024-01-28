---
title: Edge
description: Deploy your typescript application on edge devices or a single instance
order: 502000
---

# Edge

When it comes to scale, it mostly does not mean the same as for servers or cloud.
In a server or cloud environment, you have "one big thing", which you need to scale somehow.
You can simply add more powerful hardware or more instance on more hardware. Especially in cloud environments, you "simply" add more ressources & instances.

If you're looking into some IoT or edge scenario, scaling means something different.
The ressources of a single edge device is fixed and cant simply be upgraded.
You might have hundereds or thousend devices with fixed ressources providing raw data.

One option is, to collect the raw data of all your devices, send them to your server/cloud.
This works, but wastes a lot of ressources for data transmition and handling on the server side. While leaving ressources on the edge device unused.
A better approach is, to prepare the data on every edge device for further processing. This prepeared data is most likely much smaller than raw data and reduces the amount of computation on the server side.
Also things like unstable data connection, caching and so on will become important at some point.

With the concept of services with single, independent commands and subscriptions, you can simply decide how a single instance of your application should look like.
It is possible to run some services only on the edge device, some services only on the cloud and some of them on both sides.
This means, scaling becomes more a decision "where is the best place to do it".

Running software built with PURISTA on edge devices is quite simple and does not need special handling.

There are in general 2 options.

## 100% on edge device

The first approach is, to run a single instance of your application and use the `DefaultEventBridge` of `@purista/core` package.
Especially if there are only limited system resources available, this fits perfectly. There is no need to have some additional message broker running on the edge device.
This means lower resource consumption and no software dependency.

![single instance](/graphic/single_instance.svg)

The downside of this approach is, that you need to somehow share the data with your server or cloud instances.
One way would be, that you provide some kind of API and the server is pulling the data from your devices.
A other option would be, that you create a subscription or a cron job, which is sending data to your cloud. In this case, you also need to handle connection issues, cache data and so on.

This might be sufficient for many scenarios - but also not sufficient for many other.

## Run on edge and share data to server & cloud

The second approach is, to use an MQTT broker like [mosquitto](https://mosquitto.org) with a low footprint, but more capabilities.
An MQTT broker does not only provide better fault tolerance by persisting messages which are not processed. It also provides the capability to connect the edge device to a higher instance like the cloud.

It is possible to configure the broker in a way, where specific event messages are automatically available in some other broker. This means you can "extract/listen for data" without the need to change the application.

As a simplified illustration how it might look like this:

![edge device example](/graphic/edge.svg)

PURISTA is providing the `@purista/mqttbridge` package, which is focusing on IoT and edge devices.
You can learn more about it at [MQTT event bridge](../3_eco_system/eventbridges/mqtt.md).

::: tip Pros

- low footprint
- can be connected to the cloud/server without much effort
- together with webassembly 🚀
- use the same application to run on edge and be able to scale on the cloud
:::

::: warning Cons

- 🤷
:::
