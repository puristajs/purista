---
title: Dapr Event Bridge
description: Use the Dapr event bridge of PURISTA
order: 301040
---

![Dapr event bridge](/graphic/dapr_event_bridge_header.png)

# Dapr Event Bridge

PURISTA provides the `@purista/dapr-sdk` package, which includes an event bridge to use the [Dapr](https://dapr.io) features.

You should be familiar with the core concepts of [Dapr](https://dapr.io).
There are also some more information available at the chapter [Deployment - Dapr](../../5_deploy_and_scale/microservice_style/dapr.md).

The Dapr event bridge contains two basic things.
There is an HTTP server, which provides endpoints for invoking commands and receiving events.
The second part of the Dapr event bridge is an HTTP client, which allows to send events, invoke functions.

## Usage

To prevent timing issues, you need to follow a order, which is not the regular order in PURISTA:

- create a Dapr event bridge instance (not started!)
- create a instance of your service (only one service per instance is possible)
- start your service
- start the Dapr event bridge instance.

This is necessary, because the Dapr sidecar will call HTTP endpoints of your container at some unknown time.
These endpoints must return the finial configuration.
Because of the internal flexible and asynchronous structure within PURISTA, the Dapr event bridge webserver will never know, if all commands and subscriptions are added at the time of some endpoint invocation.

## Example

The Dapr event bridge HTTP server is based on the awesome [Hono](https://hono.dev/) framework.
This small, simple, and ultrafast web framework provides the ability, to profit from the benefits of your runtime.
You can use regular [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) or [Deno](https://deno.com/runtime).

::: warning Node.js package required
If you use Node.js as runtime, you need to install the additional package `@hono/node-server` with version `1.0.0` or higher!
:::


::: code-tabs#shell

@tab:active Node.js

```typescript
// package required for node adapter
import { serve } from '@hono/node-server'

import { gracefulShutdown } from '@purista/core'
import { DaprEventBridge } from '@purista/dapr-sdk'

import { userV1Service } from '../../src/service/user/v1/userV1Service'

const main = async () => {

  // create a Dapr event bridge instance
  const eventBridge = new DaprEventBridge({
    serve,
  })

  // create your service instance
  const userService = userV1Service.getInstance(eventBridge)
  // start your service instance
  await userService.start()

  // start the Dapr event bridge instance
  await eventBridge.start()

  gracefulShutdown(logger, [
    // begin with the event bridge to no longer accept incoming messages
    eventBridge,
    userService,
  ])
}

main()

```

@tab:active Bun

```typescript
// no extra import required
import { gracefulShutdown } from '@purista/core'
import { DaprEventBridge } from '@purista/dapr-sdk'

import { userV1Service } from '../../src/service/user/v1/userV1Service'

const main = async () => {

  // create a Dapr event bridge instance
  const eventBridge = new DaprEventBridge({
    serve: Bun.serve,
  })

  // create your service instance
  const userService = userV1Service.getInstance(eventBridge)
  // start your service instance
  await userService.start()

  // start the Dapr event bridge instance
  await eventBridge.start()

  gracefulShutdown(logger, [
    // begin with the event bridge to no longer accept incoming messages
    eventBridge,
    userService,
  ])
}

main()

```

@tab:active Deno

```typescript
// import Deno serve
import { serve } from 'https://deno.land/std/http/server.ts'

import { gracefulShutdown } from '@purista/core'
import { DaprEventBridge } from '@purista/dapr-sdk'

import { userV1Service } from '../../src/service/user/v1/userV1Service'

const main = async () => {

  // create a Dapr event bridge instance
  const eventBridge = new DaprEventBridge({
    serve,
  })

  // create your service instance
  const userService = userV1Service.getInstance(eventBridge)
  // start your service instance
  await userService.start()

  // start the Dapr event bridge instance
  await eventBridge.start()

  gracefulShutdown(logger, [
    // begin with the event bridge to no longer accept incoming messages
    eventBridge,
    userService,
  ])
}

main()

```

:::

## Ressources

- [Dapr.io](https://dapr.io) (official website)

::: tip OpenTelemetry
PURISTA is using the HTTP header to add the OpenTelemetry information to each message, as recommended:
[https://w3c.github.io/trace-context-mqtt/](https://w3c.github.io/trace-context-mqtt/).
:::
