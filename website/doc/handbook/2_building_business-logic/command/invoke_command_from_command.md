---
title: Invoke other Command
description: How to call a other command and receive the response
order: 202040
---

# Invoke a command from a command

One cool feature of PURISTA is, that commands can invoke (call) other commands from other services.  
The communication is done via the event bridge.

This means, the command which invokes a other command, does not have any knowledge where the other command is running.

To be able to invoke other command, you need to define the other command in the command builder. By setting the input and output schemas, it will be ensured, that no data is accidentally leaving the command function and no unexpected data is received by the command function.

```typescript
import {  
  myServiceV1MyCommandInputPayloadSchema,  
  myServiceV1MyCommandInputParameterSchema,
  myServiceV1MyCommandOutputSchema,
} from './schema.js'

const invokePayloadSchema = z.object({ // [!code ++]
 inputValue: z.string() // [!code ++]
}) // [!code ++]

const invokeParameterSchema = z.object({ // [!code ++]
 someInputParameter: z.string() // [!code ++]
}) // [!code ++]

const invokeResponseSchema = z.object({ // [!code ++]
  resultValue: z.string() // [!code ++]
}) // [!code ++]

const myCommandBuilder = myServiceBuilder
  .getCommandBuilder('functionName', 'some function description', 'functionEventEmitted')
  .addPayloadSchema(myServiceV1MyCommandInputPayloadSchema) 
  .addParameterSchema(myServiceV1MyCommandInputParameterSchema)
  .addOutputSchema(myServiceV1MyCommandOutputSchema)
  .canInvoke( // [!code ++]
    'OtherServiceName', // the service name to invoke // [!code ++]
    '1', // the service version to invoke // [!code ++]
    'otherCommandName', // the command name to invoke // [!code ++]
    invokeResponseSchema, // [!code ++]
    invokePayloadSchema,  // [!code ++]
    invokeParameterSchema,  // [!code ++]
    ) // [!code ++]
  .setCommandFunction(async function (context, payload, parameter) { 

    const invokePayload = {
      inputValue: 'some input payload'
    }

     const invokeParameter = {
      someInputParameter: 'a parameter'
    }

    const invokeResult = context.service.OtherServiceName['1']
      .otherCommandName(invokePayload, invokeParameter)
    // invokeResult is type of { resultValue: string }
  })
```

You can use `canInvoke` as often as needed. Meaning you can invoke more than one other service command.

::: tip
In the invoke schemas define only necessary data. Especially the response schema should only contain data, which is used by the command function.
:::

## Testing

During unit tests, you will need to mock command invokes.  
PURISTA provides the `getCommandContextMock` in the command builder, which allows to easy mock service invocations.

Only services defined with `canInvoke` are available in the context mock.

```typescript
const context = fooCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

// type/autocomplete is done magically
context.stubs.service.OtherServiceName[1].otherCommandName.resolves({ resultValue: 'the mocked value })
```
