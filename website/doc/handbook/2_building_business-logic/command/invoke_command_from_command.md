---
title: Invoke other Command
description: How to call a other command and receive the response
order: 202020
---

# Invoke a command from a command

One fantastic feature of PURISTA is that commands can trigger other commands from different services. This communication occurs through the event bridge.

This implies that the command initiating the action doesn't need to know where the other command is located.

To trigger another command, you must specify it in the command builder. By setting the input and output schemas, we ensure that data is handled correctly, preventing any unintended data from leaving or entering the command function.

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


