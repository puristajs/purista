---
title: PURISTA to Temporal
description: Learn how to user combine your PURISTA application with Temporal.
order: 601020
---

# PURISTA to Temporal

A Temporal workflow does not start by itself. There must be someone or something, which starts a specific workflow and provides the workflow input payload.  
We will create a PURISTA command, which is exposed via the HTTP server, to start a workflow.

This allows us, to manually start workflows via the OpenAPI UI.

## Create a command

Expecting we have a service called `User`, we create a command `register` with `purista add command register`.  
Ensure, you allready have set up the HTTP server and OpenAPI UI.

As next step, we will need to add the Temporal configuration to our service `User`, to become available in our command `register`. We need to extend our `userServiceConfig.ts`

```typescript
import { z } from 'zod'

// define the service config schema and the default service configuration

export const userServiceV1ConfigSchema = z.object({
  taskQueue: z.string(), // [!code ++]
  namespace: z.string(), // [!code ++]
  connect: z.object({ // [!code ++]
    address: z.string(), // [!code ++]
  }), // [!code ++]
})

export type UserServiceV1Config = z.input<typeof userServiceV1ConfigSchema>
```

In the main `index.ts`, where we initiate the service instances, we need to provide the config.

```typescript
import temporalConfig from './config/temporalConfig.js'

const userService = userV1Service.getInstance(eventBridge, {
    serviceConfig: { ...temporalConfig },
  })
```

Now, we want to expose our newly created command and start a workflow.  
We only need to add a few lines here in `registerCommandBuilder.ts`

```typescript
import { randomUUID } from 'node:crypto' // [!code ++]

import { Client, Connection } from '@temporalio/client' // [!code ++]

import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'
import {
  userV1RegisterInputParameterSchema,
  userV1RegisterInputPayloadSchema,
  userV1RegisterOutputPayloadSchema,
} from './schema.js'

export const registerCommandBuilder = userV1ServiceBuilder
  .getCommandBuilder('register', 'registers a new user')
  .setSuccessEventName(ServiceEvent.UserRegistrationStarted)
  .addPayloadSchema(userV1RegisterInputPayloadSchema)
  .addParameterSchema(userV1RegisterInputParameterSchema)
  .addOutputSchema(userV1RegisterOutputPayloadSchema)
  .exposeAsHttpEndpoint('POST', 'register') // [!code ++]
  .disableHttpSecurity() // [!code ++]
  .setCommandFunction(async function ({ logger }, payload, _parameter) {
    
    const connection = await Connection.connect(this.config.connect) // [!code ++]

    const client = new Client({ // [!code ++]
      connection,  // [!code ++]
      namespace: this.config.namespace, // [!code ++]
    }) // [!code ++]

    const handle = await client.workflow.start('onboardingWorkflow', { // [!code ++]
      taskQueue: this.config.taskQueue, // [!code ++]
      args: [payload], // [!code ++]
      workflowId: randomUUID(), // [!code ++]
    }) // [!code ++]
    
    logger.info(`Started workflow ${handle.workflowId}`) // [!code ++]

    await connection.close()

    return { // [!code ++]
      payload, // [!code ++]
      workflowId: handle.workflowId // [!code ++]
    } // [!code ++]
  })

```

::: info
For simplicity, the connection to Temporal is directly done in the command on each request.  
You might move this to the service via custom class.
:::

## Try out

- start the Temporal worker with `npm run dev:worker`
- in a other cli start the PURISTA application with `npm run dev`
- open the [OpenAPI UI](http://localhost:3000/api)

You should now be able to call the `register` endpoint with some payload.  
The command will:

- connect to Temporal
- start the workflow `onboardingWorkflow` and pass the payload as argument to it
- the workflow should be started and the workflow id is logged
- the command returns the input payload and the workflow id

The workflow id is some kind of instance id. Each run of a workflow, must have a unique id.

You can add some log output to `src/temporal/workflows/onboardingWorkflow.ts`.

```typescript
import { proxyActivities } from '@temporalio/workflow'
import type { ActivitiesType } from '../worker.js'

const { } = proxyActivities<ActivitiesType>({
  startToCloseTimeout: '1 minute',
})

export async function onboardingWorkflow(input: unknown): Promise<void> {
  console.log(input) // [!code ++]
}
```

You can use the Temporal UI [http://localhost:8080/](http://localhost:8080/) to view the workflows.
