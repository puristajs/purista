---
title: The Command Builder
description: How to use the command builder to create a new command for a service
order: 202010
---

# The command builder

For adding a function to a service, you should use the function builder. It is recommended to use the `getCommandBuilder` method of your service builder instance.

```typescript
const myCommandBuilder = myServiceBuilder.getCommandBuilder(
  'functionName',
  'some function description'
)
```

The command builder is responsible for collecting all information and to provide the type system.

![Flow](/graphic/builder.svg)

::: warning Order matters
You must declare the input and output schemas before adding transforms, hooks and functions!
As you can see in the diagram above, they impact the input/output types of transforms, hooks and functions.

1. command function payload, parameter and output schema
2. transform schemas
3. other definition
4. command function definition as last one
:::

## Payload schema

It is highly recommended to use schema validation for any input and output of a command.
If you use the PURISTA CLI for adding commands, a `schema.ts` and `type.ts` file is generated.  
The payload schema is already added to the command builder.

```typescript
import {  // [!code ++]
  myServiceV1MyCommandInputPayloadSchema,  // [!code ++]
} from './schema.js' // [!code ++]

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) // [!code ++]
```

By adding a payload schema, the command input will be validated during runtime and typescript types are set during development.

## Parameter schema

Parameter must be an object.  
For example, if you expose your command via REST-API, query parameters and url parameters are passed to the command function as parameter entries.

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema, // [!code ++]
} from './schema.js'

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema) // [!code ++]
```

::: danger ☝️ Be aware:
Parameters are expected to be a object.
:::

## Output schema

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema,
  myServiceV1MyCommandOutputSchema, // [!code ++]
} from './schema.js'

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema)
  .addOutputSchema(myServiceV1MyCommandOutputSchema) // [!code ++]
```

## The business logic

For implementing your business logic, you will need to set the command function.

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema,
  myServiceV1MyCommandOutputSchema,
} from './schema.js'

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema)
  .addOutputSchema(myServiceV1MyCommandOutputSchema)
  .setCommandFunction(async function (context, payload, parameter) {  // [!code ++]
    // implement your logic here // [!code ++]
  }) // [!code ++]
```

::: danger Be aware
Use the function keyword and not a arrow function here, to keep the `this` context!  

👍 `async function (context, payload, parameter) {`  
👎 `async (context, payload, parameter) => {`
:::

The command function will be called with 3 parameters.

### Context

A command function

#### Message

The command function context will contain the original message.  
This is usefull, if you like to access message information like `principalId`or `tenantId`.

#### Logger

The context provides also a logger.  
It is highly recommended to use `context.logger` instead of `this.logger`, to ensure correct logging of traces.

```typescript
.setCommandFunction(async function ({ logger }, payload, parameter) {
  logger.info({ some: 'data'}, 'The log message')
})
  
```

Please see the [logging article](../logging.md)

#### Stores

Also, you can access config, secret and state store via the context, if they are provided during service instantiation.  
More information in the section [stores](../stores/index.md).

#### Emit

The context contains the `emit` method, which can be used to emit custom events, which might be consumed by subscriptions.  
For more information please have a look at [custom events](../custom_events.md)

### Payload

The payload is a validated value and typed based on the payload schema.

### Parameter

The parameter is a validated value and typed based on the paramater schema.

## Result as an event

A core feature of PURISTA is the ability to implement event driven systems.  
Because of this, you can mark a command response as an event. Subscriptions can subscribe to a certain event.

The command builder provides the `setSuccessEventName(name: string)` method.  
If you set an event name, the output of a command be seen as an event.

```typescript
const myCommandBuilder = myServiceBuilder.getCommandBuilder(
  'functionName',
  'some function description',
  'functionEventEmitted'  // [!code ++]
)
```

alternatively

```typescript
const myCommandBuilder = myServiceBuilder.getCommandBuilder(
  'functionName',
  'some function description',
).setSuccessEventName('functionEventEmitted') // [!code ++])
```

::: info Event naming
Event names should be in the past tense.  
👍 __userCreated__  
👎 __createUser__
:::

## Transformer

The idea of having transformers, follows the PURISTA principal to separate things and decouple business logic from technical needs.
Transformers are responsible to convert the raw message payload in/to the data shape & type, the command function is expecting.

Use transformers for:

- converting data format (example xml to js object to xml)
- decrypt and encrypt the payload (end-to-end encryption)

### Input transformer

If a input transform is set, it will be executed as very first step in the message handling.  
The input transformer has it's own schemas for input payload and parameters.  
If the schema validation fails, an error response will automatically created and sent back to the caller. The command guards and the command function are not executed, if this validations fails.  
The error will be a `HandledError` with status of `Bad Request`, as the input is not as expected.

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema,
  myServiceV1MyCommandOutputSchema,
} from './schema.js'

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema)
  .addOutputSchema(myServiceV1MyCommandOutputSchema)
  .setTransformInput(z.string(), z.string(), async function (context, payload, parameter) { // [!code ++]
      const payloadParsed = JSON.parse(payload) // [!code ++]
      const parameterParsed = JSON.parse(parameter) // [!code ++]
      return { // [!code ++]
        payload: payloadParsed, // [!code ++]
        parameter:parameterParsed, // [!code ++]
      } // [!code ++]
    }) // [!code ++]
  .setCommandFunction(async function (context, payload, parameter) {
    // implement your logic here
  }) 
```

If the transform function itself is throwing an error, other than `HandledError`, a `UnhandledError` with status `Internal Server Error` is sent back to the caller.

If the transformer is used for decryption, and the decryption fails, the transform function should throw a `HandledError` with a status of `Unauthorized` or `Not permitted`.

The transform function must return a object with `payload` and `parameter` property. The type of these two properties is generated and set, based on the command function input schema and command function parameter schema.
Because of this, the input transformer must be defined after the command function schemas.

### Output transformer

If a output transform is set, it will be executed as very last step in the message handling.  
The output transformer has it's own schema, which will validate the returned value of the transform function.  
If the schema validation fails, an error response will automatically created and sent back to the caller. The command guards and the command function are not executed, if this validations fails.

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema,
  myServiceV1MyCommandOutputSchema,
} from './schema.js'

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema)
  .addOutputSchema(myServiceV1MyCommandOutputSchema)
  .setTransformInput(z.string(), z.string(), async function (context, payload, parameter) {
      const payloadParsed = JSON.parse(payload)
      const parameterParsed = JSON.parse(parameter)
      return {
        payload: payloadParsed,
        parameter:parameterParsed,
      }
    })
  .setTransformOutput(z.string(), async function (context, payload, _parameter) { // [!code ++]
    return JSON.stringify(payload) // [!code ++]
  }) // [!code ++]
  .setCommandFunction(async function (context, payload, parameter) {
    // implement your logic here
  }) 
```

::: info Parameter
In the transform output function, the parameter value will be provided.
This allows to write more dynamic output transformer function which might transform a response only if it is necessary.
:::

If the transform function itself is throwing an error, other than `HandledError`, a `UnhandledError` with status `Internal Server Error` is sent back to the caller.

The transform function must return the final raw payload.
Because of this, the output transformer must be defined after the command function schemas.

## Guards

The intention of guards is, to have the opportunity, to move authentication and authorization logic out of the main business logic.
A common example is, to add role and permission checks by using guards.

You can add multiple guards.  
Guards are executed in parallel.  
Guards should throw a `HandledError` with a proper status code, if the execution should be aborted.
If a guard is throwing an error, other than a `HandledError`, a `UnhandledError` with status `Internal Server Error` is sent back to the caller.  
A guard should not change values and does not return a value.

### BeforeGuards

BeforeGuards are executed after transformers and schema validation and before the command function.  
A before guard function will be called with same input parameters as the command function.

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema,
  myServiceV1MyCommandOutputSchema,
} from './schema.js'

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema)
  .addOutputSchema(myServiceV1MyCommandOutputSchema)
  .setTransformInput(z.string(), z.string(), async function (context, payload, parameter) {
      const payloadParsed = JSON.parse(payload)
      const parameterParsed = JSON.parse(parameter)
      return {
        payload: payloadParsed,
        parameter:parameterParsed,
      }
    })
  .setTransformOutput(z.string(), async function (context, payload, _parameter) {
    return JSON.stringify(payload)
  })
  .setBeforeGuardHooks({ // [!code ++]
    first: async function (_context, payload, parameter) { // [!code ++]
      // the guard implementation // [!code ++]
    }, // [!code ++]
  }) // [!code ++]
  .setCommandFunction(async function (context, payload, parameter) {
    // implement your logic here
  }) 
```

### AfterGuards

PURISTA also allows you to define AfterGuards. However, because the command function has already finished executing by the time an AfterGuard runs, the potential uses for AfterGuards are somewhat restricted.

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema,
  myServiceV1MyCommandOutputSchema,
} from './schema.js'

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema)
  .addOutputSchema(myServiceV1MyCommandOutputSchema)
  .setTransformInput(z.string(), z.string(), async function (context, payload, parameter) {
      const payloadParsed = JSON.parse(payload)
      const parameterParsed = JSON.parse(parameter)
      return {
        payload: payloadParsed,
        parameter:parameterParsed,
      }
    })
  .setTransformOutput(z.string(), async function (context, payload, _parameter) {
    return JSON.stringify(payload)
  })
  .setBeforeGuardHooks({ // [!code ++]
    first: async function (_context, payload, parameter) {
      // the guard implementation
    },
  })
  .setAfterGuardHooks({ // [!code ++]
    first: async function (_context, outputPayload, parameter) { // [!code ++]
      // the guard implementation // [!code ++]
    }, // [!code ++]
  }) // [!code ++]
  .setCommandFunction(async function (context, payload, parameter) {
    // implement your logic here
  }) 
```

::: info Parameter
In the AfterGuard function, the parameter value will be provided.
It will be the same value provided to the command function.
:::
