---
title: Custom Service Class
description: Implement a custom service class to extends PURISTA service base functionallity
order: 201040
---

# Custom service class

In general, a service should not contain any business logic. Its role should be limited to acting as a logical container, providing functionality that is defined and managed by PURISTA.

The primary reason for this separation is to prevent command and subscription functions from becoming tightly coupled to the service and its state. Tight coupling increases complexity, makes unit testing more difficult, and complicates the deployment of individual functions as Function as a Service (FaaS). It also reduces the flexibility to scale operations efficiently.

::: warning **Prefer Resources Over Custom Classes**  
Whenever possible, consider using [resources](define-resources.md) instead of custom classes. Resources offer better decoupling, a higher level of abstraction, and improved scalability.  
:::

However, there may be rare cases where using a custom class is justified. One such example is when your service needs to act as an adapter or gateway to a third-party solution, and there is no viable infrastructure-level alternative.

In such cases, you should be aware that your service will run as a continuously active instance, operating 24/7, and cannot be deployed as a FaaS.

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
        eventName: 'myCustomEvent',
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
