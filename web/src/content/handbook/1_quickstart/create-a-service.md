---
title: Create a Service
description: Create the first PURISTA service
order: 103000
image: /graphic/add_service.png
---

# Create the first service

![Add service with cli](/graphic/add_service.png)

A service is a logical group of functions and subscriptions. This is where the business-driven aspect comes in.
In our example, we will use the classic example - Users.

At the end, we want to have two business areas - *User* and *Email*.
...
? What is the name (or business area) of your new service (something like: user or account)
...
They should reflect a single entity or business name.
...
For example, if you have a business area _bank account_, you can simply type in _bank account_.  The CLI tool will convert it to something like _bankAccount_

After you have confirmed your input by pressing the enter key, you will be asked for a short description of the service.

```bash
? What is the matter of service "user"
```

Here, you should enter some short, general description, which will be used for some human-facing documentation.
So, please provide here something like: _manages data related to users_.

In the last step, you will be asked for the version of your service.  It defaults to _1_, which you can simply confirm by pressing the enter key.
If you need to create a new version of an existing service, you can enter any integer number larger than _1_.

```bash
Version number of this service (1)
```

Now, all files should be generated.

## Start the service

In PURISTA, services are defined by using service builders. Based on the service builder, an instance of the service can be created. This instance needs to be started. By starting the service, the service will connect to the event bridge and start listening for events.

```typescript [index.ts]
import { DefaultEventBridge } from '@purista/core'
import { userV1Service } from './service/user/v1/userV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const userService = await userV1Service.getInstance(eventBridge)
await userService.start()
```

The first argument to `getInstance` is always the event bridge. Additional options such as `logger`, `resources`, and `queueBridge` are passed as a second argument.

## Next step

With the service created, [add your first command](./add-the-first-command.md) to give the service something to do.
