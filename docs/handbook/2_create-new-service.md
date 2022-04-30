# Create a new service

A service is a logical group of functions and this where the domain driven aspect comes in.  
In our example we will use the classic example - Users.

We want to have the domain *User* and the following functionality:

- sign up a new user
- send a welcome email to user

## Setup a new service

First we need to create a new service.  
All we need to do is to create a new class which extends the `Service` class.

Create a folder `src/service/user` and inside this folder create a file `UserService.ts` with following content:

```typescript
import { Service, ServiceInfoType } from '@purista/core'

export const userServiceInfo: ServiceInfoType = {
  serviceName: 'User',
  serviceVersion: '1.0.0',
  serviceDescription: 'service which handles all user related information',
}

export class UserService extends Service {}
```

Add a file `index.ts` in `src/service/user` and export our user service class.

```typescript
export * from './UserService.ts'
```

Now we are ready to use our Service *User* in our `src/index.ts`.  
Extend the file as shown below:

```typescript
  // add imports
  import { UserService, userServiceInfo} from './service/user'


  // at the end of function main below await httpServerService.start()

  // create the user service 
  const userService = new UserService(baseLogger, userServiceInfo, eventBridge, [], [])

  // start the user service
  await userService.start()
```

Our domain service *User* is now created, initialized and started.
It has no functionality yet, so let's add some logic.

## Create a command function

Now we want to be able to sign up new users, so we will create a function for it.

Create a new subfolder `src/service/user/commands` and create files `index.ts`, `schema.ts` and `signUp.ts`

First let's define the shape of our data.  
Todo so, we will use awesome [zod library](https://github.com/colinhacks/zod) which will provide use schema validation, typescript types and with some plugin openapi (swagger) definition from one single definition.

Add the needed dependencies to our project:

```sh
npm install --save zod @anatine/zod-openapi
```

### Define schema and type

Now we can start to create a schema for input payload, parameters and output payload.

Add following content into `src/service/user/commands/schema.ts`:

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

export type InputPayloadType = z.infer<typeof inputPayloadSchema>
export type InputParameterType = z.infer<typeof inputParameterSchema>
export type OutputPayloadType = z.infer<typeof outputPayloadSchema>
```

As you can see we define the shape of our data.  
We also add some additional metadata like `title` and `example`. This will be used to generate the openapi definition for our function as we want to expose this function as rest api endpoint.

### Implement logic

Now we're ready to implement the function in `signUp.ts`.  
Add following content:

```typescript
import { randomUUID } from 'crypto'
import { CommandFunction } from '@purista/core'

import { InputParameterType, InputPayloadType, OutputPayloadType } from './schema'

export const signUp: CommandFunction<UserService, InputPayloadType, InputParameterType, OutputPayloadType> = 
  async function (payload, _parameter, _message) {

    this.log('sign up new user', payload)

    const uuid = randomUUID()

    return {
      uuid
    }
  }
```

It's a simple function where we log the input and return a response object.  
But you can see some basic features:

Our function is a async function, which allows us to use async-await within our code.  
The types generated from schema are used and your linter/typescript will complain on missmatches.  
You have a `this` scope, which is you domain service class `User`.  
As this service class is extending the base `Service` class, you will have some more usefull functions, which we will cover later on.

*Be aware* that you can't use arrow function to create a new service function, because they don't allow the `this` scope!

Because we have access to our `User` domain class instance, we can extend this class like this:

```typescript
export class UserService extends Service {
  private users:{ uuid:string, email: string, password:string } = []
}
```

and change our `signUp.ts` to:

```typescript
import { randomUUID } from 'crypto'
import { CommandFunction } from '@purista/core'

import { InputParameterType, InputPayloadType, OutputPayloadType } from './schema'

export const signUp: CommandFunction<UserService, InputPayloadType, InputParameterType, OutputPayloadType> = 
  async function (payload, _parameter, _message) {

    this.log('sign up new user', payload)

    const uuid = randomUUID()

    this.users.push({
      uuid,
      ...payload
    })

    return {
      uuid
    }
  }
```

### Add the function to service

Now it's time to let our `User` service know that he has some function `signUp`.  
First of all we will create a function definition in our `src/service/user/commands/index.ts`:

```typescript
import { FunctionDefinitionBuilder } from '@purista/core'

import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'
import { signUp } from './signUp'

export default new FunctionDefinitionBuilder('signUp', 'Sign up a new unknown user', signUp)
  .addInputSchema(inputPayloadSchema)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)
  .exposeAsHttpEndpoint('POST', '/sign-up')
```

This code should be self explaining.  
We say:

*There is a new function `signUp` with input schema, parameter schema, output schema which should be exposed as POST endpoint on `/sign-up` path.*

Now we should add the definition to our `User` service in our `src/index.ts`.

```typescript
  // add imports
  import { signUp } from './service/user'


  // add to function array
  const userService = new UserService(baseLogger, userServiceInfo, eventBridge, [ signUp.getDefinition() ], [])
```

If you now start the application with `npm start` you should have a POST endpoint `https://localhost:8080/api/v1/sign-up` which should trigger our function.

There you can see we expose our function versioned by the service version.  
This means we can also have same domain service running with different version.

If you have for example breaking api changes in a new version of our `User`service, than you would create a new Service (or copy the old one an make your changes) and set service version to a higher version.

## Add a subscription
