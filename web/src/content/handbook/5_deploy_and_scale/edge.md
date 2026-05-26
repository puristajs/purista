---
title: Edge
description: Deploy your typescript application on edge devices or a single instance
order: 502000
---

# Edge

## When to choose edge deployment

Edge deployment is the right model when you have **constrained hardware** running close to physical processes or users — IoT sensors, industrial controllers, retail kiosks, or devices running in locations with unreliable connectivity. In these environments, "scaling" does not mean adding more cloud capacity: it means deciding which logic runs on the device and which logic runs centrally.

If your scenario is a standard server or cloud workload, see [Microservice style](./microservice_style/index.md) or [Serverless](./serverless_function_fass.md) instead.

---

When it comes to scale, it mostly does not mean the same as for servers or cloud.
In a server or cloud environment, you have "one big thing", which you need to scale somehow.
You can simply add more powerful hardware or more instances on more hardware. Especially in cloud environments, you "simply" add more resources and instances.

If you're looking into some IoT or edge scenario, scaling means something different.
The resources of a single edge device are fixed and cannot simply be upgraded.
You might have hundreds or thousands of devices with fixed resources providing raw data.

One option is to collect the raw data of all your devices and send it to your server/cloud.
This works, but wastes a lot of resources for data transmission and handling on the server side, while leaving resources on the edge device unused.
A better approach is to prepare the data on every edge device for further processing. This prepared data is most likely much smaller than raw data and reduces the amount of computation on the server side.
Things like unstable data connections, local caching, and offline resilience will also become important at some point.

With the concept of services with single, independent commands and subscriptions, you can simply decide how a single instance of your application should look like.
It is possible to run some services only on the edge device, some services only on the cloud, and some of them on both sides.
This means scaling becomes more a decision about "where is the best place to do it".

Running software built with PURISTA on edge devices is quite simple and does not need special handling.

There are in general 2 options.

## 100% on edge device

The first approach is, to run a single instance of your application and use the `DefaultEventBridge` of `@purista/core` package.
Especially if there are only limited system resources available, this fits perfectly. There is no need to have some additional message broker running on the edge device.
This means lower resource consumption and no software dependency.

![single instance](/graphic/single_instance.svg)

```typescript
// src/index.ts — edge device, fully self-contained
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { sensorV1ServiceBuilder } from './service/sensor/v1/sensorV1ServiceBuilder.js'

const main = async () => {
  const logger = initLogger('info')
  const eventBridge = new DefaultEventBridge()
  await eventBridge.start()

  const sensorService = await sensorV1ServiceBuilder.getInstance(eventBridge)
  await sensorService.start()

  gracefulShutdown(logger, [eventBridge, sensorService])
}

main()
```

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

Only the bootstrap file changes when switching from the fully local approach to MQTT-connected:

```typescript
// src/index.ts — edge device connected to MQTT broker
import { gracefulShutdown, initLogger } from '@purista/core'
import { MqttBridge } from '@purista/mqttbridge'
import { sensorV1ServiceBuilder } from './service/sensor/v1/sensorV1ServiceBuilder.js'

const main = async () => {
  const logger = initLogger('info')

  const eventBridge = new MqttBridge({
    url: process.env.MQTT_URL ?? 'mqtt://localhost:1883',
    clientId: process.env.DEVICE_ID ?? 'edge-001',
  })
  await eventBridge.start()

  const sensorService = await sensorV1ServiceBuilder.getInstance(eventBridge)
  await sensorService.start()

  gracefulShutdown(logger, [eventBridge, sensorService])
}

main()
```

The service code is unchanged. Swapping `DefaultEventBridge` for `MqttBridge` is the only difference between the fully-local and MQTT-connected deployments.

::: tip Pros

- low footprint
- can be connected to the cloud/server without much effort
- together with webassembly 🚀
- use the same application to run on edge and be able to scale on the cloud
:::

::: warning Cons

- 🤷
:::
