---
# This control sidebar index
index: true
order: 30
# This is the icon of the page
icon: wand-sparkles fas
# This is the title of the article
title: Create new Service
# A page can have multiple tags
# description
description: Create your first typescript service in PURISTA with a function and a subscription implementation in simple typescript/javascript.
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
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Create a new service

A service is a logical group of functions and subscriptions. This where the domain driven aspect comes in.  
In our example, we will use the classic example - Users.

We want to have the domain *User* and the following functionality:

- sign up a new user
- send a welcome email to user

## Set up a new service

First, we need to create a new service.  
All we need to do is to create a new class which extends the `Service` class.

Create a folder `src/service/user` and inside this folder create a file `UserServiceBuilder.ts` with following content:

```typescript
import { ServiceBuilder, ServiceInfoType } from '@purista/core'

export const userServiceInfo: ServiceInfoType = {
  serviceName: 'User',
  serviceVersion: '1',
  serviceDescription: 'service which handles all user related information',
}

export const UserServiceBuilder = new ServiceBuilder(userServiceInfo)
```

Create a file `UserService.ts` in `src/service/user` with following content:

```typescript
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder
```

Add a file `index.ts` in `src/service/user` and export our user service.

```typescript
export * from './UserService.ts'
```

Now we are ready to use our Service *User* in our `src/index.ts`.  
Extend the file as shown below:

```typescript
  // add imports
  import { UserService, userServiceInfo} from './service/user'


  // at the end of function main below await httpServerService.start()

  // create the user service instance
  const userService = UserService.getInstance(baseLogger, eventBridge)

  // start the user service
  await userService.start()
```

Our domain service *User* is now created, initialized and started.
It has no functionality yet, so let's add some logic.

## Create a command function

Now we want to be able to sign up new users, so we will create a function for it.

Create a new subfolder `src/service/user/commands/signUp` and create files `index.ts` & `schema.ts`.

First, let's define the shape of our data.  
To do so, we will use [zod library](https://github.com/colinhacks/zod). This will provide use schema validation, typescript types and with awesome plugin [zod-openapi](https://www.npmjs.com/package/@anatine/zod-openapi) OpenApi (swagger) definition from one single definition.

Add the needed dependencies to our project:

```sh
npm install --save zod @anatine/zod-openapi
```

### Define schema and type

Now we can start to create a schema for input payload, parameters and output payload.

Add the following content into `src/service/user/commands/signUp/schema.ts`:

```typescript
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// define the input parameters
// parameters are given as object (key-value)
export const inputParameterSchema = z.object({})

// define the input payload
export const inputPayloadSchema = extendApi(
  z.object({
    email: extendApi(
      z
        .string()
        .email()
        .transform((email) => email.toLowerCase()),
      {
        example: 'newuser@example.com',
        title: 'the users email address',
      },
    ),
    password: extendApi(z.string().min(5), {
      example: 'the_super_secret_user_password',
      title: 'the user password',
    }),
  }),
)

// define the output payload
export const outputPayloadSchema = z.object({
  uuid: extendApi(z.string().uuid(), { example: 'e118e649-09c4-4d00-917b-3a0a940e1d45', title: 'the users uuid' }),
})

```

As you can see, we define the shape of our data.  
We also add some additional metadata like `title` and `example`. This will be used to generate the OpenApi definition for our function, as we want to expose this function as a rest API endpoint.

### Add the function to service

Now it's time to let our `User` service know that he has some function `signUp` and we need to implement the logic for it.  
First, we will create a function definition in our `src/service/user/commands/signUp/index.ts`:

<Badge text="Be aware" type="warning"/>

Keep the order, schema, hook and function implementation as very last, to have correct types!

```typescript
import { UserServiceBuilder } from '../../UserServiceBuilder'

import { UserService } from '../../UserService'

import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'

export const userSignUpBuilder = UserServiceBuilder.getFunctionBuilder('signUp', 'Sign up a new unknown user', 'NewUserCreated')
  .addInputSchema(inputPayloadSchema)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)
  .exposeAsHttpEndpoint('POST', '/sign-up')
  .setFunction(async function ({ logger }, payload, _parameter) {

    logger.debug('sign up new user', payload)

    const uuid = randomUUID()

    logger.debug(this.config) // log the service config from UserService instance

    return {
      uuid
    }
  })
```

This code should be self explaining.  
We say:

*There is a new function `signUp` in `UserService`, which will create an event `NewUserCreated`, with input schema, parameter schema, output schema, and we expose it as POST endpoint on `/sign-up` path.*

It's a simple function, where we log the input, the config and return a response object.  

**But you can see some basic features:**

Our function is an asynchronous function, which allows us to use async-await within our code.  
The types generated from schema are used, and your linter/typescript will complain on mismatches.  
You have a `this` scope, which is the instance of your domain service class `UserService`.  
The first parameter of our function provides the function context.  

The function context contains useful things like logger, the full original command message and functions to invoke other service functions or emit custom events.

<Badge text="⚠️ Be aware" type="warning"/>

*You can't use arrow function to create a new service function, because they don't allow the `this` scope!*

In the real world, holding states in the service class is a bad approach and should be avoided.  
Such stuff is hard to handle and to scale. Try to keep things as stateless as possible.

So, you might ask why a service class at all?

There are use cases, where it makes sense to have it - if not, than it's an empty class which doesn't hurt.

Use cases are something like simply holding some initial configurations, which is needed by service functions.  

Now we should add the function definition to our `User` service in our `src/service/user/UserService.ts`.

```typescript
import { userSignUpBuilder } from './commands/signUp'
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder.addFunctionDefinition(userSignUpBuilder.getDefinition())

```

If you now start the application with `npm start` you should have a POST endpoint `https://localhost:8080/api/v1/sign-up` which should trigger our function.

There you can see, that we expose our function versioned by the service version.  
This means, we can also have a domain service, running with different versions.

If you have, for example, breaking API changes in a new version of our `User` service, then you would create a new Service (or copy the old one and make your changes) and set service version to a higher version.

Try to open `https://localhost:8080/api` in your browser. You should see the OpenApi- UI with your new endpoint.

## Add a subscription

Now, our service should not only be able to create new users. New users should get a welcome or confirmation email.

You could pack the send email logic into our existing function, but this might not the best way.  
Why?  
Because you start mixing up different things, increase the complexity of one simple, single function, and it increases the test complexity, while decreasing the stability and maintenance.

It's better to have a subscription, which listens for all new created users and email them.  
This allows you:

- to implement retry mechanism on sending an email more easily
- lowers the amount of mocking & stubbing within single unit tests
- reduces the request response time for the user, as there is no need to wait for the email to be sent
- keeps your "creation" code clean and easy by separating the "email send" code
- decouple things and remove/avoid dependencies
- separate user creation and sending an email in deployment later on (allows different scaling if needed)

Back to our example.  

Create a new subfolder `src/service/user/subscriptions/sendWelcomeEmail` and create files `index.ts`.

Define a subscription like this:

```typescript
import { EventName } from '../../../../types'
import { UserServiceBuilder } from '../../UserServiceBuilder'

export const sendWelcomeMailBuilder = UserServiceBuilder.getSubscriptionBuilder(
  'sendWelcomeEmail',
  'send a welcome email to new costumers',
)
  .subscribeToEvent('NewUserCreated')
  .setFunction(async function ({ logger }, _payload) {
    logger.info('Hello from sendWelcomeEmail')
  })

```

It is quite simple and similar to function definitions.

Here we create a new subscription `sendWelcomeEmail` with some description as second parameter.  
We want to subscribe to all messages with event name `NewUserCreated`.

There is only one thing left.  
Add the subscription to our service in `src/service/user/UserService.ts`.

```typescript
import { userSignUpBuilder } from './commands/signUp'
import { sendWelcomeMailBuilder } from './subscriptions/sendWelcomeMail'
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder.addFunctionDefinition(userSignUpBuilder.getDefinition())
  .addSubscriptionDefinition(sendWelcomeMailBuilder.getDefinition())

```

If you restart your program, you will see a console log, each time the `/sign-up` endpoint is called successfully.

## Call service function from other service

Until now, we have a simple request-respone-pattern and a subscription which listens for the response.  
The request is triggered by some url request.

But in real world, you might need to call an other service function within a service function.

With PURISTA it is quite easy. The function context provides an asynchronous function `invoke`.

Example:

```typescript
setFunction(async function ({ invoke }) {
  
  // invokeResponse type can be set - here it is set to type string
  const invokeResponse = await invoke<string>(
    // the address of service to call
    {
      serviceName: this.serviceInfo.serviceName,
      serviceVersion: this.serviceInfo.serviceVersion,
      serviceTarget: UserFunction.TestFunction,
    },
    // the input payload
    {
      sample: 'payload from signUp function',
    },
    // the input parameter
    {},
  )
}
```

If the invoked service fails for some reason, the `invoke` will throw `HandledError` or `UnhandledError`.  
There is also no input validation on the callers side. To ensure correct types and input, you should share the types between the two service functions, or you should add explicit input validation.  
The response is also only validated on the invoked service.
