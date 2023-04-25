---
order: 10
title: Add a subscription to a service
shortTitle: Add a subscription
description: Add a subscription to an existing service
image: https://purista.dev/graphic/add_subscription.png
cover: https://purista.dev/graphic/add_subscription.png
tag:
  - typescript
  - nodejs
  - javascript
  - backend
  - framework
  - cloud
  - microservice
  - lambda
  - Installation
  - Setup
  - Guide
---

![Add subscription with cli](/graphic/add_subscription.png)


A subscription is a function which will be triggered by messages and events, when the given criteria are matching.  
The producer of the message does not have knowledge about the subscription.

Subscriptions do ot need to return a value.  
If a subscription is returning a value, it will be emitted as custom message to the event bridge.  
The subscription does not have any knowledge if the costum message has a consumer.


For adding a subscription to a service, you can use the PURISTA CLI.

```bash
purista add subscription
```

The CLI will guide you through all steps and will create all files for you.  
In the first step, you will be asked for the name of the new subscription.  
We will start with _sendWelcomeEmail_.

```bash
? What is the name of the new subscription send welcome email
```

As you can see, it is possible to enter the name of the subscription in a very natural way.  
The CLI tool will handle the naming conventions for you.  
Subscription names will be camel-case.

::: tip Try to use a subscription name, which is:

- global unique (a subscription in different service versions should have the same name)
- short, but speaking & understandable
- use simple present, like `sendWelcomeEmail` or `triggerWorkflow`
- try to standard prefixes, like `createBankAccount` or `updateUserProfile`
:::

After you have confirmed your input by pressing the enter key, you will be asked for a short description of the subscription.

```bash
? What is the matter of subscription "sendWelcomeEmail" send a welcome mail to new registered users
```

Here, you should enter some short, general description, which will be used for some human-facing documentation.  
So, please provide here something like: _send a welcome mail to new registered users_.

In the next step, you will be asked to select an event name. Then subscription will be triggered as soon as an event with given name is sent.

After selecting the event name, you must select the service.  
Use the arrow keys to select the service (and version), on which the new command should be registered.  
In our example, choose _User_ .

```bash
? select a service email 1
```

Confirm your choice by pressing the enter key.

Now, the files will be created, the event name will be added as a new enum entry and the command will be added to the command list of the service.

```bash
✔  -> checking current setup
✔  ++ /src/service/email/v1/subscription/sendWelcomeEmail/index.ts
✔  ++ /src/service/email/v1/subscription/sendWelcomeEmail/sendWelcomeEmail.test.ts
✔  ++ /src/service/email/v1/subscription/sendWelcomeEmail/schema.ts
✔  ++ /src/service/email/v1/subscription/sendWelcomeEmail/types.ts
✔  ++ /src/service/email/v1/subscription/sendWelcomeEmail/sendWelcomeEmailSubscriptionBuilder.ts
✔  _+ /src/service/email/v1/index.ts
⠋ try to update existing files - pls be patient!
👷🏗️ -> ensure new enum entry
🕵️  -> event exist in enum NewUserRegistered
👷🏗️ -> set event name from enum in subscription builder
👍  -> updated event to use enum in subscription builder
⠙ 👷🏗️ -> try to add definition to builder
👍  -> definition added to service builder
⠹ 👷🏗️ -> lint  src/service/email/v1/subscription/sendWelcomeEmail/index.ts
👷🏗️ -> lint  src/service/email/v1/subscription/sendWelcomeEmail/schema.ts
👷🏗️ -> lint  src/service/email/v1/subscription/sendWelcomeEmail/types.ts
👷🏗️ -> lint  src/service/email/v1/subscription/sendWelcomeEmail/sendWelcomeEmail.test.ts
👷🏗️ -> lint  src/service/email/v1/subscription/sendWelcomeEmail/sendWelcomeEmailSubscriptionBuilder.ts
👷🏗️ -> lint  src/service/email/v1/emailV1Service.ts
👷🏗️ -> lint  src/service/email/v1/index.ts
👷🏗️ -> lint  src/service/ServiceEvent.enum.ts
⠸ 👍  -> done linting
✔  -> files updated
⠋ 
🎉 The subscription sendWelcomeEmail in email v1 is created 🎉


start adding your business logic here:
./src/service/email/v1/subscription/sendWelcomeEmail/sendWelcomeEmailSubscriptionBuilder.ts


✔  -> 📖 Learn more about PURISTA at <https://purista.dev>
```

As you can see, in the output above, the CLI will print a direct link to the subscription builder file, where you can start adding your business logic.

## Structure

A folder for the new subscription is created - in our example it is `src/service/user/v1/subscription/sendWelcomeEmail`.  
Here, you can find, all files relating to this single subscription function.  

The structure follows the same pattern as for command functions.

## Command builder file

The main file for a subscription is the subscription builder file - `sendWelcomeEmailSubscriptionBuilder.ts` in our example.  
As you can see, the CLI tool already added some configuration properties - the ones you normally always have for a subscription.

The implementation of the business logic should be done in this file.

```typescript
import { ServiceEvent } from '../../../../ServiceEvent.enum'
import { emailV1ServiceBuilder } from '../../emailV1ServiceBuilder'
import { emailV1SendWelcomeEmailInputPayloadSchema } from './schema'

export const sendWelcomeEmailSubscriptionBuilder = emailV1ServiceBuilder
  .getSubscriptionBuilder('sendWelcomeEmail', 'send a welcome mail to new registered users')
  .subscribeToEvent(ServiceEvent.NewUserRegistered)
  .addPayloadSchema(emailV1SendWelcomeEmailInputPayloadSchema)
  .setSubscriptionFunction(async function (_context, _payload, _parameter) {
    // add your business logic here
  })

```

::: info More on subscription builder usage:

- API documentation: [SubscriptionDefinitionBuilder - Methods](../../../api/classes/purista_core.SubscriptionDefinitionBuilder.html#methods)
:::

## Implement the subscription

In the subscription builder file, you can implement the subscription function.  
A subscription function has the service instance as `this` scope assigned. Because of this, you can't use arrow functions.

<Badge text="👎 does not work" type="danger"/>

```typescript
.setSubscriptionFunction((context, payload, parameter) => {
    // add your business logic here
  })
```

<Badge text="👍 works" type="tip"/>

```typescript
.setSubscriptionFunction(async function (context, payload, parameter) {
    // add your business logic here
  })
```

The `this` scope allows access to methods and properties of the service instance.  
You can access:

- the service config `this.config`
- the service information name, version and description of service with `this.info`

**It is not recommended to directly access the service instance for any other purpose.**.  
Use the function context instead, to access logger, stores and other functionality.

As types are automatically generated, depending on given schemas and settings, a logical flow for adding settings is adviced.  
You should always start with the subscription function input and output schemas, follwed by the transform schemas.

![Subscription builder defintion and execution flow](/graphic/subscription_builder.svg)

### Subscription function context

The function context provides a unified interface for

- the logger
- the original subscription message
- the config store
- the secret store
- the state store
- a method `emit`, which allows emitting of custom events to the event bridge
- a method `invoke`, which allows invoking of other subscriptions

::: tip API documentation

The [SubscriptionFunctionContext](../../../api/modules/purista_core.html#subscriptionfunctioncontext) is a union type of [ContextBase](../../../api/modules/purista_core.html#contextbase) and [SubscriptionFunctionContextEnhancements](../../../api/modules/purista_core.html#subscriptionfunctioncontextenhancements)

:::

### Payload

The payload contains the payload for this subscription. It is validated against the input payload schema, before the subscription function is called. They typescript type is automatically generated from the input schema.

### Parameter

In addition to the payload, a subscription function can have parameters. Parameters are only set, if the the subscription is subscribed to command request messages.  
Extended subscribing is not supported by all event bridges.

### Return value

A subscription function is can return a value. If the subscriptions is returning a value, the result value will be validated against the output schema.  
The result typescript type of the subscription function is generated from the output schema.

If a subscription is returning a result, it will be emitted as custom message to the event bridge.

## Subscribing

Subscriptions are triggered by messages with specific properties.  
The subscription builder provides methods to define, which properties must match to execute the subscription.  
It depends on the event bridge and the underlaying message broker if complex subscriptions are supported.

### Subscribe by event name

Command response messages can have an event name assigned. Custom messages must have an event name assigned.  
A subscription can subscribe messages by event name.  
This is supported by all event bridges.

Usage:

```typescript
subscriptionBuilder.subscribeToEvent('eventName')
```

### Complex subscriptions

Complex subscriptions provide a way to define more specific properties.  
Only some of the available event bridges support complex subscriptions.  

Available properties:

- `filterReceivedBy` = the message must be sent to receiver
- `filterSentFrom` = the message must be sent from receiver
- `filterForMessageType` = the message must have a specific message type
- `filterPrincipalId` = the message must have the given principal id
- `filterInstanceId` = the message must be sent from given instance

In most use cases, there is no need to use complex subscriptions and subscribing by event name is sufficient.  
But in some scenarios, like in IoT, it might make life easier, if there are possibilities to use complex subscriptions.  

::: warning Keep in mind

- the event bridge must support complex subscriptions  
- all given properties must match to trigger the subscription
:::

## Event bridge advice

The PURISTA builder for commands and subscriptions allowing the developer to give the underlaying event bridge advices.  
Advices can help to build more robust systems and to configure the system for special needs.

If the underlaying message broker does not support a feature, required for an advice, the advice is ignored and has no effect.

### adviceAutoacknowledgeMessage

Many message brokers have the mesage acknowledge pattern.
If a message is sent from the message broker and received by the consumer, the message broker expects to get a acknowledgement from the consumer.  
Because of this, there are two major questions here:

How to handle a message with negative or without acknowledgment?  
This will mostly configured on the message broker itself.  
They will re-send the message or move the message to a dead letter queue.  
The consumer should not take care of this.

When should the consumer return the acknowledgment - on receiving the message or after processing the message?  
This is on consumer side and the message broker can not take care of this.  
The `adviceAutoacknowledgeMessage` method in the builders, is advising the PURISTA even bridge to send the acknowledgement as soon as the message receives. When the method is called with parameter `false`, the acknowledgement is sent, after the processing the message. In case the processing is throwing an `UnhandledError`, a negative acknowledgement is sent.

::: info Default settings:

Enabled for commands by default.  
Disabled for subscriptions by default.
:::

### adviceDurable

A good explanation can be found here: [RabbitMQ documentation](https://www.rabbitmq.com/queues.html#durability).

::: info Default settings:

Setting not available for commands - disabled by default.  
Enabled for subscriptions by default.
:::

### receiveMessageOnEveryInstance

Per default, subscriptions will use a queue which is shared by all instances to be able to scale.  
But there are use cases, with the need that every instance will receive a message.  

For example in IoT environments there is often the need, that all devices receive a message.

Use the subscription builder method `receiveMessageOnEveryInstance`, if you want want that a message is sent to all instances.

::: info Default settings:

Setting not available for commands - disabled by default.  
Disabled for subscriptions by default.
:::
