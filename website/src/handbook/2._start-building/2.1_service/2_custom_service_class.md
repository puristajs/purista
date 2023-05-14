---
order: 20
title: Custom service class
shortTitle: Custom service class
description: Use a custom service class.
image: https://purista.dev/graphic/add_service.png
tag:
  - service
---

In general, a service itself should not contain any logic. It should only act as a logical container, which provides functionality defined and handled by PURISTA.

The main reason for it:  
Command and subscription functions will become directly coupled to the service and the states of an actual service instance. This not only increases complexity and makes unit tests more difficult. It makes it very difficult, to be able to deploy single functions as FaaS and to scale things.

But, there might be some edge cases, where it makes sense to have a custom class.  
A good example of such an edge case:  
Your service needs to act as a kind of adapter or gateway, to some other third-party solution, and there is no straightforward way, to solve this at the infrastructure level.

In this case, you know and might accept, that your service is running as an instance 24/7, and can't be deployed as FaaS.

Example:

```typescript
// CustomUserClass.ts
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

and than add it in the base service builder file:

```typescript
// userV1ServiceBuilder.ts
import { ServiceBuilder, ServiceInfoType } from '@purista/core'

import { generalUserServiceInfo } from '../generalUserServiceInfo'
import { CustomUserClass } from './CustomUserClass'
import { userServiceV1ConfigSchema } from './userServiceConfig'

export const userServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalUserServiceInfo,
}

// create a service builder instance and assign service config schema and default config.

export const userV1ServiceBuilder = new ServiceBuilder(userServiceInfo)
  .setConfigSchema(userServiceV1ConfigSchema)
  .setDefaultConfig({ myOption: 'something' })
  .setCustomClass(CustomUserClass)
```

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
