---
# This control sidebar index
index: true
order: 20
# This is the icon of the page
icon: bolt fas
# This is the title of the article
title: Get started
# A page can have multiple tags
tag:
  - Installation
  - Setup
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Get started

PURISTA tries to avoid the need for implementing boilerplate code as much as possible and to automate and autogenerate types, definitions, documentation when ever possible.

Schema and input-output-validation are deeply integrated, and they should be used whenever possible to build robust, stable systems.

PURISTA addresses developers which want to simply focus on implementation, while providing them the necessary things to use the great node/typescript tooling.

## Set up a new project

Create a new project and install all needed dependencies.

```sh
mkdir myapp
cd ..myapp

npm init

npm install --save typescript @purista/core ts-node

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

