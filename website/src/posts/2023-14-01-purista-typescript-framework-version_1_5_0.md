---
# This control sidebar index
index: true
# This is the title of the article
title: Introducing PURISTA version 1.5
shortTitle: PURISTA version 1.5
description: Checkout all the awesome features, improvements and changes in PURISTA v1.5.0 typescript framework.
tag:
 - purista
 - version 1.5.0
category:
 - version
 - news
 - announcement
star: true
isOriginal: true
image: https://purista.dev/graphic/advertise_large.png
cover: https://purista.dev/graphic/advertise_large.png
ticky: 20230114
---

Version 1.5 of PURISTA is available, with a lot of features, enhancements, and a bunch of improvements and bug fixes.  
The documentation has been completely overwritten and more code examples are now available.  
This typescript backend framework is focusing on building backend applications simply and cleanly. The application can:

- deploy to IoT/edge
- deploy as monolithic instances
- deploy in microservice style on Kubernetes
- deploy as serverless functions (FaaS) at different cloud vendors.

::: tip Awesome!
**All this is possible From one code base, with no or low overhead and without touching the business logic!**  
See: [Deployment in handbook](../handbook/7._deployment/0_deployment.md)
:::

![PURISTA typescript Framework 1.5](/graphic/advertise_large.svg)

You can also follow news on twitter **[@purista_js](https://twitter.com/purista_js)** and get direct in touch at the **[Discord Chat](https://discord.gg/9feaUm3H2v)**.

PURISTA has now a CLI tool, which will help to set up a project and speed up the creation of new services, commands, and subscriptions.  
The biggest addition in version 1.5 is the integration of [OpenTelemetry](https://opentelemetry.io) into the core functionality of PURISTA.  

Subscriptions have been overhauled and are now aligned to commands. You have now the same functionality for in- and output transformations and hooks. Starting with version 1.5, subscriptions can return results, which will be published as custom event messages.  

PURISTA version 1.5, introduces stores for configurations, states, and secrets. They are interfaces in the context of commands and subscriptions. This allows drop-in replacements for specific vendor solutions, without touching your business logic.  

The first infrastructure-focused SDK `@purista/k8s-sdk` is available now, which will help developers, to deploy their applications in microservice style on [Kubernetes](https://kubernetes.io).

In addition to bug fixes, type, and documentation improvements, a set of breaking changes and name changes are coming with version 1.5. This was necessary to unify and improve naming and simplify constructors and method calls.

<!-- more -->

## CLI tool

The CLI tool is a great helper for your daily business!  
It does not only allow you to set up and initialize new repositories.  
You can now quickly add new services or add commands and subscriptions to an existing service.  

All needed files, like builders, and unit tests will be created for you.

If you add a new command or a new subscription, they will automatically be added to the corresponding service builder. Event names will be automatically added to a global enum in the repository.  

You can start using PURISTA CLI with:

::: code-tabs#shell

@tab:active npm

```bash
npx @purista/cli init
```

@tab bun

```bash
bunx @purista/cli init
```

:::

## Overhauled Subscriptions

Subscriptions are now much more powerful.  
The biggest change here is on the concept level.  
Previously, subscriptions were not able to return values.  
This has been changed!

Now, subscriptions can return values.  
If they return values, they need a corresponding output schema and an event name. The result is validated and then published to the event bridge as a custom message with the given even name.

This allows much more complex scenarios in the real world.

Also, subscriptions have now optional in- and output transformers and hooks, like commands. This reduces a lot of duplicate bloat code in many scenarios.

## Opentelemetry support

OpenTelemetry support is now built into the core of the framework.  
This allows tracing and monitoring of your application by using an open standard protocol.

You can now use great third-party solutions like [Grafana](https://grafana.com), [Jaeger](https://www.jaegertracing.io), [ZipKin](https://zipkin.io), [Uptrace](https://uptrace.dev) or solutions from your preferred cloud vendor, to get insights of your application.

## Introducing stores

By providing stores for commands and subscriptions, it is possible to generalize a daily challenge.  
Most applications need to get some kind of configuration or secrets and they need to handle business states.  
For each of these specific requirements, there are hundreds of different ways and solutions.  

With stores in PURISTA, they become a unified interface against your business logic.  
The actual implementation of the stores can be replaced with drop-in packages and modules.  
This will allow support of different solutions and cloud provider products:

Planned stores for integration of:

- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [Azure App Configuration](https://azure.microsoft.com/en-us/products/app-configuration)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager)
- [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)
- [HashiCorp Vault](https://www.vaultproject.io)  
...and much more

You can also provide a custom solution, which can be implemented in a very simple way.

## Kubernetes SDK

Using Kubernetes as the basement for an application and deploying a software solution as a bunch of microservices, has become a de facto standard for scalable applications, running on servers and in the cloud.  

The SDK provides a simple helper, to get single services, based on PURISTA, quickly deployed in Kubernetes.

More SDKs will come later, to provide helpers for different vendors and deployment ways.

## Improved and simplified interfaces

Some breaking changes were necessary to improve the naming and usage of methods and constructors.  
The constructors have been simplified.  
Also, some previously required parameters, like the logger, have become optional, to follow the pattern: _"Default everywhere and allow overwriting in case it is needed"_.

### Breaking changes

The constructor and method signatures have been changed for:

- `getInstance` in service builders
- `constructor` of _HttpServerService_ from `@purista/httpserver`
- `constructor` of _DefaultEventBridge_ in `@purista/core`
- `constructor` of _AmqpBridge_ in `@purista/amqpbridge`

Some names have been changed to get a more consistent naming:

The _FunctionDefinitionBuilder_ is renamed to _CommandDefinitionBuilder_.

- `setFunction` is now `setCommandFunction` in _CommandDefinitionBuilder_
- `getFunction` is now `getCommandFunction` in _CommandDefinitionBuilder_
- `setFunction` is now `setSubscriptionFunction` in SubscriptionDefinitionBuilder
- `getFunction` is now `getSubscriptionFunction` in SubscriptionDefinitionBuilder
- `addMessageType` is now `filterForMessageType` in SubscriptionDefinitionBuilder
- `onlyInstanceId` is now `filterInstanceId` in SubscriptionDefinitionBuilder
- `onlyPrincipalId` is now `filterPrincipalId` in SubscriptionDefinitionBuilder
- `sentFrom` is now `filterSentFrom` in SubscriptionDefinitionBuilder
- `receivedBy` is now `filterReceivedBy` in SubscriptionDefinitionBuilder
- `addFunctionDefinition` is now `addCommandDefinition` in _ServiceBuilder_
- `getFunctionBuilder` is now `getCommandBuilder` in _ServiceBuilder_
- `getFunctionContextMock` is now `getCommandContextMock`


### Additions

Mocks have now an optional parameter for a [sinon.js](https://sinonjs.org) sandbox.

- `getEventBridgeMock` has now optionalparameter sandbox
- `getLoggerMock` has now optionalparameter sandbox
- `getCommandContextMock` has now optional parameter sandbox
- `getSubscriptionContextMock` has now optionalparameter sandbox
- new test helper `getCommandTransformContextMock`
- new test helper `getSubscriptionTransformContextMock`
- new test helper `getCommandErrorMessageMock`
- new test helper `getCommandMessageMock`
- new test helper `getCommandSuccessMessageMock`
- new test helper `getCustomMessageMessageMock`

## What's next?

There is already a basic roadmap, which is available on [GitHub](https://github.com/users/sebastianwessel/projects/1/views/4).  
The next releases are focusing on:

- stabilizing and bug fixing
- support more event bridge solutions
- support of more vendor dependent store modules
- extending documentation

Also, last, but not least, building a community around PURISTA.
