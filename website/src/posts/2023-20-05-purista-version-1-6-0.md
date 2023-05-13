---
# This control sidebar index
index: true
# This is the title of the article
title: PURISTA version 1.6.0 - Dapr, MQTT and more
shortTitle: PURISTA version 1.6.0
description: Checkout all the awesome features, improvements and changes in PURISTA v1.6.0 typescript framework.
tag:
 - purista
 - version 1.6.0
category:
 - version
 - news
 - announcement
star: true
isOriginal: true
image: https://purista.dev/graphic/advertise_large.png
cover: https://purista.dev/graphic/advertise_large.png
---


PURISTA version 1.6.0 comes with a set of new event bridges.  
Starting from version 1.6.0, the new MQTT event bridge supports the MQTT protocol.  
This is a huge step forward if you're developing solutions for IoT and Edge.

On the other side, Dapr support is now added for cloud environments.  
This not only includes simple deployments and usage of the core event functionality.  
The new Dapr-SDK provides also the integration of state, config, and secret stores via Dapr.

**PURISTA now requires Node version >= 18.15**.  
Also, the provided PURISTA packages no longer contain source map files, resulting in a much smaller size.

A very common task is, to build an HTTP adapter and call external REST APIs.  
For such a task, the new base class `HttpClient` is available, which is based on the native fetch function.  
Error handling, JSON decoding, timeout handling, and OpenTelemetry support are built in.

In addition, there are a bunch of improvements regarding types, and configurations, and some bugs have been fixed.

<!-- more -->

## MQTT event bridge

By providing the MQTT event bridge, PURISTA is making a huge step into the IoT and edge device area.  
The MQTT bridge is based on the MQTT 5 protocol, which makes it possible to provide nearly the same functionality as on other event bridges.

## Dapr SDK

## Http client

The core package has some new nice helpers.  
With the `HttpClient` class, it is possible to build HTTP-based clients quickly & easily.

The `HttpClient` is based on Node.js native `fetch`.

Example:

```typescript
import { HttpClient } from '@purista/core'

type LoginResponse = {
  token: string
}

const main = async () => {
  const client = new HttpClient({
    baseUrl: 'http://example.com',
    defaultHeaders: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })

  const loginCredentials = {
    username: 'user',
    password: 'secret_thing',
  }

  // to a POST request to receive a bearer token
  const loginResponse = await client.post<LoginResponse>('/login', loginCredentials)

  // set the bearer token for all following requests
  client.setBearerToken(loginResponse.token)

  // make a GET request with bearer token set in header
  const restrictedResponse = await client.get('/restricted/path')

  // log the response from a protected route
  console.log(restrictedResponse)
}

main()
```
