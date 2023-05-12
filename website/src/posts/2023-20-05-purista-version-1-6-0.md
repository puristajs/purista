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
Also, there are some improvements for configs and types

<!-- more -->

## MQTT event bridge

## Dapr SDK

## Http client

The core package contains now a nice helper.  
With the `HttpClient` class it is possible to build HTTP based clients quick & easy.

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
