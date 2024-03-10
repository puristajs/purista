---
title: Temporal to PURISTA
description: Learn how to user combine your PURISTA application with Temporal.
order: 601030
---

# Temporal to PURISTA

To be able to connect PURISTA commands, and to emit PURISTA events, we need to create a connection from Temporal to the eventbridge.

But before connecting Temporal to PURISTA, we will create a command in our PURISTA application, which gets invoked from a Temporal workflow.  
In this example, it is expected that you have created a service `Email` with a command `sendEmailVerification`.
Also, we will use the NATS event bridge.

## Connect worker to eventbridge

We need to connect the worker in Temporal to the eventbridge used in our PURISTA application.  
We add a few lines to `src/temporal/worker.ts`

```typescript
import { fileURLToPath } from 'node:url'

import { Context } from '@temporalio/activity'
import { NativeConnection, Worker } from '@temporalio/worker'

import type { EventBridge } from '@purista/core' // [!code ++]
import { initLogger } from '@purista/core' // [!code ++]
import { NatsBridge } from '@purista/natsbridge' // [!code ++]

import temporalConfig from '../config/temporalConfig.js'
import natsBridgeConfig from '../config/natsBridgeConfig.js' // [!code ++]
import * as activities from './activities/index.js'

export type ActivitiesType = typeof activities

async function run() {

  const logger = initLogger('debug')

  // inject eventBride and logger // [!code ++]
  const eventBridge = new NatsBridge({ ...natsBridgeConfig, logger }) // [!code ++]
  await eventBridge.start() // [!code ++]
  
  const connection = await NativeConnection.connect(temporalConfig.connect)

  const worker = await Worker.create({
    connection,
    namespace: temporalConfig.namespace,
    taskQueue: temporalConfig.taskQueue,
    workflowsPath: fileURLToPath(new URL('./workflows', import.meta.url)),
    activities: {
      ...activities,
    },
  })

  await worker.run()
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

```

To make our life easier, we create a simple helper function `getInvoke` in file `src/temporal/getInvoke.ts`.

```typescript
import type { EventBridge } from '@purista/core'
import { Context } from '@temporalio/activity'

// a small get which returns the invoke function
export const getInvoke =
  (eventBridge: EventBridge) =>
  async <Output = unknown>(
    serviceName: string,
    serviceVersion: string,
    serviceTarget: string,
    payload: unknown,
    parameter = {},
  ): Promise<Output> => {
    const ctx = Context.current()
    return eventBridge.invoke<Output>({
      sender: {
        serviceName: ctx.info.workflowType,
        serviceVersion: '1',
        serviceTarget: ctx.info.activityType,
        instanceId: eventBridge.instanceId,
      },
      receiver: {
        serviceName,
        serviceVersion,
        serviceTarget,
      },
      payload: {
        payload,
        parameter,
      },
      contentEncoding: 'utf-8',
      contentType: 'application/json',
    })
  }

```

## Add an activity

Before we can use an activity in a workflow, we must register the activity in the worker.

```typescript
import { fileURLToPath } from 'node:url'

import { Context } from '@temporalio/activity'
import { NativeConnection, Worker } from '@temporalio/worker'

import type { EventBridge } from '@purista/core'
import { initLogger } from '@purista/core'
import { NatsBridge } from '@purista/natsbridge'

import temporalConfig from '../config/temporalConfig.js'
import natsBridgeConfig from '../config/natsBridgeConfig.js'
import * as activities from './activities/index.js'

const getPuristaBasedActivities = (eventbridge: EventBridge) => {  // [!code ++]
  const invoke = getInvoke(eventBridge) // [!code ++]

  return { // [!code ++]
    sendEmailVerification: (email: string) => // [!code ++]
      invoke<{ userId: string }> // our helper with return type // [!code ++]
        ('Email', '1', 'sendVerificationEmail', { email }), // [!code ++]
  } // [!code ++]
} // [!code ++]

export type ActivitiesType = typeof activities & ReturnType<typeof getPuristaBasedActivities>

async function run() {

  const logger = initLogger('debug')

  // inject eventBride and logger
  const eventBridge = new NatsBridge({ ...natsBridgeConfig, logger })
  await eventBridge.start()
  
  const connection = await NativeConnection.connect(temporalConfig.connect)

  const worker = await Worker.create({
    connection,
    namespace: temporalConfig.namespace,
    taskQueue: temporalConfig.taskQueue,
    workflowsPath: fileURLToPath(new URL('./workflows', import.meta.url)),
    activities: {
      ...activities,
      ...getPuristaBasedActivities(eventBridge) // [!code ++]
    },
  })

  await worker.run()
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

```

## Use an activity

Our workflow currently does nothing instead logging the input.  
We will now add an activity, which calls a PURISTA command and returns the commands result.

```typescript
import { proxyActivities } from '@temporalio/workflow'
import type { ActivitiesType } from '../worker.js'

const { } = proxyActivities<ActivitiesType>({// [!code --]
const { sendEmailVerification } = proxyActivities<ActivitiesType>({// [!code ++]
  startToCloseTimeout: '1 minute',
})

export async function onboardingWorkflow(input: unknown): Promise<void> { // [!code --]
export async function onboardingWorkflow(input: { email: string } ): Promise<void> { // [!code ++]

  const result = await sendEmailVerification(input.email) // [!code ++]

  console.log(input) // [!code --]
  console.log(result) // [!code ++]
}
```

After starting the PURISTA application and the Temporal worker, you should be able to call the `register` endpoint via the OpenAPI UI with a payload like this:

```json
{
  "email": "mail@example.com"
}
```

The `onboardingWorkflow` will start, execute the activity `sendEmailVerification`, which invokes the PURISTA command `sendEmailVerification` of service `Email`. The response of that command invocation will be logged by the workflow.

We now have the communication from Temoral to the PURISTA application, and the opposite from the PURISTA application to Temporal.
