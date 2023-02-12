---
# This control sidebar index
index: true
order: 20
# This is the icon of the page
icon: bolt fas
# This is the title of the article
title: PURISTA framework - build your first typescript application and run on nodejs
shortTitle: Get started
# description
description: Setup your typescript project to build your first nodejs application based on the PURISTA backend framework.
# A page can have multiple tags
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
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

PURISTA tries to avoid the need for implementing boilerplate code as much as possible and to automate and autogenerate types, definitions, documentation when ever possible.

Schema and input-output-validation are deeply integrated, and they should be used whenever possible to build robust, stable systems.

PURISTA addresses developers which want to simply focus on implementation, while providing them the necessary things to use the great node/typescript tooling.

## Set up a new project

Create a new project and install all needed dependencies.

```sh
mkdir myapp
cd ..myapp

npm init

npm install --save typescript @purista/core @purista/httpserver ts-node

npm install --save-dev @types/node

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
import { DefaultEventBridge} from '@purista/core'
import { HttpServerService } from '@purista/httpserver'

const main = async () => {

  // create eventbridge
  const eventBridge = new DefaultEventBridge()
  // start eventbridge (e.g. connect to broker)
  await eventBridge.start()

  // create and init a webserver
  const httpServerService = new HttpServerService(eventBridge)

  // start the webserver
  await httpServerService.start()
}

main()

```

Now you can start your new program with `npm start`.  
It will start a http webserver on your local machine.  

Open your browser and visit [http://localhost:9090](http://localhost:9090) and you should see

```json
{"status":404,"message":"Not Found"}
```

The only, per default existing, endpoint is the OpenApi UI (swagger UI) [http://localhost:9090/api/](http://localhost:9090/api/).
