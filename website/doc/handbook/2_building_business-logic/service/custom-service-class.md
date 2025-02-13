---
title: Custom Service Class
description: Implement a custom service class to extends PURISTA service base functionallity
order: 201040
---

# Custom service class

In general, a service itself should not contain any logic. Its role should be limited to serving as a logical container, providing functionality defined and handled by PURISTA.

The primary reason for this is that command and subscription functions become tightly coupled to the service and the states of an actual service instance. This not only increases complexity and complicates unit testing but also makes it challenging to deploy single functions as Function as a Service (FaaS) and to scale operations.

However, there may be exceptional cases where it is sensible to have a custom class. One such example is when your service needs to function as an adapter or gateway to a third-party solution, and there is no straightforward solution at the infrastructure level.

In such cases, you acknowledge and accept that your service runs as a continuous instance 24/7 and cannot be deployed as a FaaS.

Example:

::: code-group

```typescript [CustomUserClass.ts]
import { CustomMessage, EBMessageAddress, EBMessageType, getNewTraceId, Service } from '@purista/core'
import { customConnect, CustomProvider } from 'custom-provider'

import { UserServiceV1Config } from './userServiceConfig'

export class CustomUserClass extends Service<UserServiceV1Config> {
  private customProvider?: CustomProvider
  async start() {
    super.start()

    // your custom logic
    // connect to a third-party provider
    this.customProvider = await customConnect(this.config)

    // listen for data and emit it as PURISTA custom event to the event bridge
    this.customProvider.on('data', async (data: unknown) => {
      const sender: EBMessageAddress = {
        serviceName: this.info.serviceName,
        serviceVersion: this.info.serviceVersion,
        serviceTarget: '',
      }

      const message: Readonly<Omit<CustomMessage<unknown>, 'id' | 'instanceId' | 'timestamp'>> = Object.freeze({
        messageType: EBMessageType.CustomMessage,
        traceId: getNewTraceId(),
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        sender,
        eventName: 'myCustomEven',
        payload: data,
      })
      await this.eventBridge.emitMessage(message)
    })
  }

  async destroy() {
    await this.customProvider.close()
    super.destroy()
  }
}
```

:::

and than add it in the base service builder file:

::: code-group

```typescript [userV1ServiceBuilder.ts]
import { ServiceBuilder, ServiceInfoType } from '@purista/core'

import { generalUserServiceInfo } from '../generalUserServiceInfo'
import { CustomUserClass } from './CustomUserClass'
import { userServiceV1ConfigSchema } from './userServiceConfig'

export const userServiceInfo = {
  serviceVersion: '1',
  ...generalUserServiceInfo,
} as const satisfies ServiceInfoType

// create a service builder instance and assign service config schema and default config.

export const userV1ServiceBuilder = new ServiceBuilder(userServiceInfo)
  .setConfigSchema(userServiceV1ConfigSchema)
  .setCustomClass(CustomUserClass) // [!code ++]
```

:::

In the example above, the service acts as a gateway to push data from third-party providers into the event bridge/PURISTA part.
You might want to have a subscription or command here, to push data in the opposite direction.
To move data from the event bridge/PURISTA part to the third-party provider, create a subscription or command like this:

```typescript
.setCommandFunction(async function(_context,payload) {
  const response = await this.customProvider.send(payload)
  return {
    response
  }
})

```

::: tip
If you need to implement a custom service class, try to avoid adding many subscriptions or commands here.
Reduce it to the bare minimum, and consider an additional class for commands and subscriptions, which do not directly need the custom functionality.
:::
