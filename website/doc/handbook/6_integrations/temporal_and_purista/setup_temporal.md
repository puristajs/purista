---
title: Setup Temporal
description: Learn how to setup temporal with typescript on your local machine.
order: 601010
---

# Setup Temporal

First of all, you should setup Temporal.

## Temporal on local machine

Please follow the offical guide: [Set up a local development environment for Temporal and TypeScript](https://learn.temporal.io/getting_started/typescript/dev_environment/) or use docker compose file from [PURISTA examples](https://github.com/puristajs/purista/tree/master/examples/temporal).

## Install dependencies

To interact with temporal, we will need some dependencies in our project.

```bash
npm install @temporalio/client @temporalio/worker @temporalio/workflow @temporalio/activity
```

The package `@temporalio/client` will be used by your PURISTA application.  
The other 3 packages  `@temporalio/worker`, `@temporalio/workflow` and `@temporalio/activity` are needed at the Temporal worker side.

::: info Requirements
In this example, it is expected that you are using the default config with `tsx` and `esm`.
:::

Add s shortcut to `package.json`.

```json
{
  "scripts": {
    ...
    "dev:worker": "tsx watch src/temporal/worker.ts workflow.watch",
    ...
  }
}
```

## Add to your code

As soon as you have a Temporal instance running, you can start adding some code.  
In this example, we will put everything which is running in Temporal in the sub folder `src/temporal`.

Please create a project structure like this:

```bash
|- src
   |- config
   |  |- temporalConfig.js
   |
   |- temporal
      |- worker.ts
      |- activities
      |  |- index.ts
      |
      |- workflows
         |- index.ts
```

### Config

Because we will need some the configuration on both side - worker and PURISTA application, we will create a shared config file in `src/config/temporalConfig.ts`.  

```typescript
const temporalConfig = {
  taskQueue: 'default-task-queue',
  namespace: 'default',
  connect: {
    address: 'localhost:7233',
  },
}

export default temporalConfig
```

### Activities

As we do not have any activities yet, we will simply create the file `src/temporal/activities/index.ts` with following content:

```typescript
export default {}
```

### Workflows

We will create an example workflow `onboardingWorkflow`. To do so, we create a file `src/temporal/workflows/onboardingWorkflow.ts` with content of:

```typescript
import { proxyActivities } from '@temporalio/workflow'
import type { ActivitiesType } from '../worker.js'

const { } = proxyActivities<ActivitiesType>({
  startToCloseTimeout: '1 minute',
})

export async function onboardingWorkflow(input: unknown): Promise<void> {
}
```

Do not forget to add the workflow to the `src/temporal/workflows/index.ts` file.

```typescript
export * from './onboardingWorkflow.js'
```

### Worker

We need a worker in Temporal. The worker is responsible for executing the workflows.  
Create a file `src/temporal/worker.ts` with following content:

```typescript
import { fileURLToPath } from 'node:url'

import { Context } from '@temporalio/activity'
import { NativeConnection, Worker } from '@temporalio/worker'

import temporalConfig from '../config/temporalConfig.js'
import * as activities from './activities/index.js'

export type ActivitiesType = typeof activities

async function run() {
  // Step 1: Establish a connection with Temporal server.
  //
  // Worker code uses `@temporalio/worker.NativeConnection`.
  // (But in your application code it's `@temporalio/client.Connection`.)
  const connection = await NativeConnection.connect(temporalConfig.connect)

  // Step 2: Register Workflows and Activities with the Worker.
  const worker = await Worker.create({
    connection,
    namespace: temporalConfig.namespace,
    taskQueue: temporalConfig.taskQueue,
    // Workflows are registered using a path as they run in a separate JS context.
    workflowsPath: fileURLToPath(new URL('./workflows', import.meta.url)),
    activities: {
      ...activities,
    },
  })

  // Step 3: Start accepting tasks on the `default-task-queue` queue
  //
  // The worker runs until it encounters an unexpected error or the process receives a shutdown signal registered on
  // the SDK Runtime object.
  //
  // By default, worker logs are written via the Runtime logger to STDERR at INFO level.
  //
  // See https://typescript.temporal.io/api/classes/worker.Runtime#install to customize these defaults.
  await worker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

```

### Run the worker

Ensure your Temporal instance is running.  
If everything is set correctly, you should be able to start the worker and the worker connects to the Temporal instance.

```bash
npm run dev:worker
```

At this point, we have some Temporal environment up and running, but, nothings happens.
There is no one who will trigger our workflow.

We need to connect our PURISTA application to Temporal, to be able to start our workflow.
