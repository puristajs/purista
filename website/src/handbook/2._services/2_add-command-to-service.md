---
order: 20
title: Add a command to a service
shortTitle: Add a command
description: Add a command to an existing service
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

### Add the command to the service

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
