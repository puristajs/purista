---
title: Service
description: PURISTA typescript framework service creation
order: 201000
---

# Service

![Add service with cli](/graphic/add_service.png)

A service is a logical group of functions and subscriptions. This is where the domain driven aspect comes in.
In our example, we will use the classic example - Users.

A service can provide costum configurations, which will be available in commands and subscriptions.

In general, a service itself should not contain any logic. It should only act as a logical container for commands and subscriptions.
Also, services should not hold state data.
