---
title: HTTP Client
description: Use the fetch based HTTP typescript client with open telemetry support
order: 208000
---

# HTTP client

The `HttpClient` is a wrapper class around the native `fetch` function.
It provides simple shortcut methods:

- `.get` for GET requests
- `.post` for POST requests
- `.put` for PUT requests
- `.patch` for PATCH requests
- `.delete` for DELETE requests
- `.setBearerToken` set a bearer token to be used for requests

Requests are also automatically added to the current OpenTelemetry trace.
The request header will also contain the standard OpenTelemetry headers. This way the requested server is able to use the tracing information.

Timeout handling is provided out of the box and can be configured in the constructor configuration property.

## Example

```typescript
import { HttpClient } from '@purista/core'

type LoginResponse = {
  token: string
}

const main = async () => {
  const client = new HttpClient({
    baseUrl: 'http://example.com',
    defaultHeaders: {
      'content-type': 'application/json; charset=utf-8',
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

## Response handling

You can provide the expected return type in the short hand functions.
The response will be automatically JSON-decoded if the header `Content-Type` is set to `application/json`.
Otherwise it will return the plain response as string.

In case the request fails or is returning an HTTP error, the methods will throw a `UnhandledError`.
This error object will contain in the data object:

- the HTTP status code
- method
- url
- path
- headers (array)
- response (string or JSON parse result)

Error responses are automatically logged and the error is added to the OpenTelemetry trace.

## OpenTelemetry

It is easy to include the client's HTTP requests in the OpenTelemetry trace. The only requirement is to pass the `spanProcessor` from your OpenTelemetry setup to the `HttpClient` constructor.

```ts
const client = new HttpClient({
  spanProcessor: this.spanProcessor, // [!code ++]
  baseUrl: 'http://example.com',
  defaultHeaders: {
    'content-type': 'application/json; charset=utf-8',
  },
})
```
