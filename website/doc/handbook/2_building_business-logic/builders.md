---
order: 200010
title: Builders
description: Learn how to use builders in nodejs backend framework PURISTA within your typescript application
image: /graphic/builder.png
---

# Builders in PURISTA

PURISTA has the concept of builders to define services, functions and subscriptions. But why is this needed?

There is a need to define services, attach functions and subscriptions. And each function or subscription has also properties, configurations, options and so on.

One simple option would be, to have some code generators. This is a solid concept, and very often used in frameworks. But it has some disadvantages. You get some bootstrap code, and align, extent, and change the generated code. You will also need some more or less fixed folder structure, which reduces the freedom of developers.

While code generation in general is a great tool, they are not the best choice for our needs here.
PURISTA tries to be decoupled from the underlaying system and infrastructure. So, we might need a way to convert our settings into a specific architecture, for a specific infrastructure or cloud provider. This conversion might be on the fly. So we will need to access and interpret the setup programmatically. Also, we want to avoid manual configurations and manual steps as much as possible. They are time-consuming and error-prone.

## Cascading

There are several parts, where one setting or configuration is impacting a whole service. For example, the custom configuration for a service might change. You probably don't want to change several functions and subscriptions, only because you add a simple property.

Types are dynamically set and generated. You can take the input for a function as an example. You have set the input schema, which generates the input typescript type for your function. It also sets the type of message payload and maybe generates the OpenApi definition.

Now, if you add a input payload transform hook, the type of message payload and the OpenApi definition will change. The hook function itself will also have some input/output types.

There is a bunch of type definition stuff behind the scene, to ensure correct types, correct input and outputs. This improves speed during development, reduces the costs for maintaining code, and prevents bugs.

To get an idea, take a look at this diagram. This is a kind of typescript-type dependency graph. This is the stuff you would need to manage within your code and your brain, without builders.

![Example](/graphic/builder.svg)

::: warning Order matters
You must declare the input and output schemas before adding transforms, hooks and functions!
As you can see in the diagram above, they impact the input/output types of transforms, hooks and functions.
:::

There are currently 3 builders available.

- [Service Builder](service/the-service-builder.md)
- [Command Builder](command/the-command-builder.md)
- [Subscription Builder](subscription/the-subscription-builder.md)
