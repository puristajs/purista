# Get started

## Setup a new project

Create a new project and install all needed dependencies.

```sh
mkdir myapp
cd ..myapp

npm init

npm install --save typescript @purista/core @purista/core @purista/core ts-node

npm install --save-dev  @types/node

mkdir src
```

Add to your `package.json`:

```json
"scripts": {
    "start": "ts-node src/index.ts",
}
```

Create the main execution file `src/index.ts` with following content:

```typescript
import { DefaultEventBridge, initLogger } from '@purista/core'
import { HttpServerService } from '@purista/core'

const main = async () => {
  // initialize the logging
  const baseLogger = initLogger('debug')

  // create and init our eventbridge
  const eventBridge = new DefaultEventBridge(baseLogger)

  // create and init a webserver
  const httpServerService = await HttpServerService.createInstance(
    baseLogger,
    eventBridge
  )

  // start the webserver
  await httpServerService.start()
}

main()

```
