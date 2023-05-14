---
order: 10
title: Add a command to a service
shortTitle: Add a command
description: Add a command to an existing service
image: https://purista.dev/graphic/add_command.png
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

![Add command with cli](/graphic/add_command.png)

A command is a single function, which will be called (invoked) by someone with the expectation to get a result back.

## Create the files

Commands can be added to services. The most sight-forward way for adding a command is the usage of the PURISTA CLI.

```bash
purista add command
```

The CLI will guide you through all steps and will create all files for you.  
In the first step, you will be asked for the name of the new command.  
We will start with _signUp_.

```bash
? What is the name of the new command sign up
```

As you can see, it is possible to enter the name of the command in a very natural way.  
The CLI tool will handle the naming conventions for you.  
Command names will be camel-case.

::: tip Try to use a command name, which is:

- global unique (a command in different service versions should have the same name)
- short, but speaking & understandable
- use simple present, like `addNewFeature` or `getUser`
- try to standard prefixes, like `createBankAccount` or `updateUserProfile`
:::

After you have confirmed your input by pressing the enter key, you will be asked for a short description of the command.

```bash
? What is the matter of command "sign up" registers a new user at our product
```

Here, you should enter some short, general description, which will be used for some human-facing documentation.  
So, please provide here something like: _registers a new user at our product_.

The following step is a bit more interesting, as you will be asked for the response event name.  
A response to a command can be marked as an event, which can be subscribed to.  
You can leave the field blank and simply press enter if you do not want to add an event name.

For example, we want to add an event name.

```bash
? Name of response event newUserRegistered
```

The CLI will not handle any naming conventions here. So you are free to choose.  
The event will be automatically added as a new enum entry in `src/service/ServiceEvent.enum.ts`. This new enum entry will be used in the generated source code files.

::: tip Try use an event name, which is:

- global unique (a command in different service versions should have the same event name)
- short, but speaking & understandable
- should not contain a version in the name
- try to describe what happened, when the command execution was successfully
- use simple past, like `newFeatureAdded` or `userDeleted`
:::

In the next step, you will see a service selection.  
Use the arrow keys to select the service (and version), on which the new command should be registered.  
In our example, choose _User_ .

```bash
? select a service user 1
```

Confirm your choice by pressing the enter key.

Now, the files will be created, the event name will be added as a new enum entry and the command will be added to the command list of the service.

```bash
✔  -> checking current setup
✔  ++ /src/service/user/v1/command/signUp/index.ts
✔  ++ /src/service/user/v1/command/signUp/schema.ts
✔  ++ /src/service/user/v1/command/signUp/types.ts
✔  ++ /src/service/user/v1/command/signUp/signUp.test.ts
✔  ++ /src/service/user/v1/command/signUp/signUpCommandBuilder.ts
✔  _+ /src/service/user/v1/index.ts
⠋ try to update existing files - pls be patient!
👷🏗️ -> ensure new enum entry
⠙ 👍  -> event "newUserRegistered" added to enum as ServiceEvent.NewUserRegistered
👷🏗️ -> set event name from enum in command builder
👍  -> updated event to use enum in command builder
⠹ 👷🏗️ -> try to add definition to builder
👍  -> definition added to service builder
⠸ 👷🏗️ -> lint  src/service/user/v1/command/signUp/index.ts
👷🏗️ -> lint  src/service/user/v1/command/signUp/schema.ts
👷🏗️ -> lint  src/service/user/v1/command/signUp/types.ts
👷🏗️ -> lint  src/service/user/v1/command/signUp/signUp.test.ts
👷🏗️ -> lint  src/service/user/v1/command/signUp/signUpCommandBuilder.ts
👷🏗️ -> lint  src/service/user/v1/userV1Service.ts
👷🏗️ -> lint  src/service/user/v1/index.ts
👷🏗️ -> lint  src/service/ServiceEvent.enum.ts
⠼ 👍  -> done linting
✔  -> files updated
⠋ 

🎉 The command "sign up" in service "user" version1 is created 🎉


start adding your business logic here:
./src/service/user/v1/command/signUp/signUpCommandBuilder.ts

✔  -> 📖 Learn more about PURISTA at https://purista.dev
```

As you can see, in the output above, the CLI will print a direct link to the command builder file, where you can start adding your business logic.

## Structure

A folder for the new command is created - in our example it is `src/service/user/v1/command/signUp`.  
Here, you can find, all files relating to this single command function.  

### Command builder file

The main file for a command is the command builder file - `signUpCommandBuilder.ts` in our example.  
As you can see, the CLI tool already added some configuration properties - the ones you normally always have for a command.

The implementation of the business logic should be done in this file.

```typescript
import { ServiceEvent } from '../../../../ServiceEvent.enum'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder'
import {
  userV1SignUpInputParameterSchema,
  userV1SignUpInputPayloadSchema,
  userV1SignUpOutputPayloadSchema,
} from './schema'

export const signUpCommandBuilder = userV1ServiceBuilder
  // command name and description
  .getCommandBuilder('signUp', 'registers a new user at our product')
  // adding of the response event name
  .setSuccessEventName(ServiceEvent.NewUserRegistered)
  .addPayloadSchema(userV1SignUpInputPayloadSchema)
  .addParameterSchema(userV1SignUpInputParameterSchema)
  .addOutputSchema(userV1SignUpOutputPayloadSchema)
  // adding the implementation of the command
  .setCommandFunction(async function (_context, _payload, _parameter) {
    // add your business logic here
  })
```

::: info More on command builder usage:

- API documentation: [CommandDefinitionBuilder - Methods](../../../api/classes/purista_core.CommandDefinitionBuilder.html#methods)
- chapter: _4. Exposing_
:::

### Schema file

The schema file contains the schemas for input and output validation.

```typescript
import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const userV1SignUpInputParameterSchema = extendApi(z.object({}), { title: 'sign up input parameter schema' })

// define the input payload
export const userV1SignUpInputPayloadSchema = extendApi(z.any(), { title: 'sign up input payload schema' })

// define the output payload
export const userV1SignUpOutputPayloadSchema = extendApi(z.any(), { title: 'sign up output payload schema' })
```

The core package contains some helper here, which are based on the package [`@anatine/zod-openapi`](https://github.com/anatine/zod-plugins/blob/main/packages/zod-openapi/README.md).  
This gives the opportunity, to enrich the schema with more information and details, which than can be used, to improve a generated OpenAPI/AsyncAPI documentation.  
Because of this, you can add human understandable titles, descriptions, examples and so on.  
It is not required, but recommended, to use this package. You can also use plain [zod](https://zod.dev).

### Type file

There is also a file `types.ts`, which contains types, that are generated out of the input and output schemas defined in `schema.ts`.  
The types are not used by PURISTA or one of the builders. The types can be used by the developers.

```typescript
import { z } from 'zod'

import {
  userV1SignUpInputParameterSchema,
  userV1SignUpInputPayloadSchema,
  userV1SignUpOutputPayloadSchema,
} from './schema'

export type UserV1SignUpInputParameter = z.input<typeof userV1SignUpInputParameterSchema>

export type UserV1SignUpInputPayload = z.input<typeof userV1SignUpInputPayloadSchema>

export type UserV1SignUpOutputPayload = z.output<typeof userV1SignUpOutputPayloadSchema>
```

### Test file

The file with the `.test.ts` extension, is the unit test for the command implementation.  
It contains a real test, which then can be extended and aligned to your actual implementation.

```typescript
import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service'
import { signUpCommandBuilder } from './signUpCommandBuilder'
import { UserV1SignUpInputParameter, UserV1SignUpInputPayload } from './types'

describe('service User version 1 - command signUp', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const signUp = signUpCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1SignUpInputPayload = undefined

    const parameter: UserV1SignUpInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    const result = await signUp(context.mock, payload, parameter)

    expect(result).toBeUndefined()
  })
})

```

More about unit testing in the next chapter [Test a command](./2_test-a-command.md)

## Implement the command

In the command builder file, you can implement the command function.  
A command function has the service instance as `this` scope assigned. Because of this, you can't use arrow functions.

<Badge text="👎 does not work" type="danger"/>

```typescript
.setCommandFunction((context, payload, parameter) => {
    // add your business logic here
  })
```

<Badge text="👍 works" type="tip"/>

```typescript
.setCommandFunction(async function (context, payload, parameter) {
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
You should always start with the command function input and output schemas, follwed by the transform schemas.

![Command builder defintion and execution flow](/graphic/command_builder.svg)

### Command function context

The function context provides a unified interface for

- the logger
- the original command message
- the config store
- the secret store
- the state store
- a method `emit`, which allows emitting of custom events to the event bridge
- a method `invoke`, which allows invoking of other commands

::: tip API documentation

The [CommandFunctionContext](../../../api/modules/purista_core.html#commandfunctioncontext) is a union type of [ContextBase](../../../api/modules/purista_core.html#contextbase) and [CommandFunctionContextEnhancements](../../../api/modules/purista_core.html#commandfunctioncontextenhancements)

:::

### Payload

The payload contains the payload for this command. It is validated against the input payload schema, before the command function is called. They typescript type is automatically generated from the input schema.

### Parameter

In addition to the payload, a command function can have parameters. This is especially usefull, when the command is exposed as http or GraphQL endpoint.  
Url parameter, query parameter or GraphQL query inputs can be mapped to parameters. The parameters will be validated against the parameter schema, before the command function is called.

### Return value

A command function is expected to return a value. The returned value is validated against the output schema.  
The result typescript type of the command function is generated from the output schema.

It is possible to not return a value. In this case the response message, which is always sent back, will contain a payload with value `undefined`.

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
