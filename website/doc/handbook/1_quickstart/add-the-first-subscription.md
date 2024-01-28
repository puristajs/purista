---
title: Add a Subscription
description: Add the first subscription to your PURISTA service
order: 105000
image: /graphic/add_subscription.png
---

# Add a subscription

![Add subscription with cli](/graphic/add_subscription.png)

A subscription is a function which will be triggered by messages and events, when the given criteria are matching.
The producer of the message does not have knowledge about the subscription.

Subscriptions do not need to return a value.
If a subscription is returning a value, it will be emitted as custom message to the event bridge.
The subscription does not have any knowledge if the custom message has a consumer.

In our example, the subcription will be part of the "Email" domain.
Because of this, we will first create a other service called "Email".

```bash
purista add service email
```

Now, we can create a new subscription, which will be added to the email service.

## Create a subscription

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

## Structure

A folder for the new subscription is created - in our example it is `src/service/user/v1/subscription/sendWelcomeEmail`.
Here, you can find, all files relating to this single subscription function.

The structure follows the same pattern as for command functions.

## Subscription builder file

The main file for a subscription is the subscription builder file - `sendWelcomeEmailSubscriptionBuilder.ts` in our example.
As you can see, the CLI tool already added some configuration properties - the ones you normally always have for a subscription.

The implementation of the business logic should be done in this file.

::: code-group

```typescript [sendWelcomeEmailSubscriptionBuilder.ts]
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

:::

::: info More on subscription builder usage:
- [Subscription builder](../2_building_business-logic/subscription/the-subscription-builder.md)
- [API documentation: SubscriptionDefinitionBuilder - Methods](../../api/classes/purista_core.SubscriptionDefinitionBuilder.html#methods)
:::
