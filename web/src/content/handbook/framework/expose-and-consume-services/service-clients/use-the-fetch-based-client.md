---
title: Use the fetch-based client
description: Wrap an external HTTP API as an injected resource with explicit authentication, timeout, tracing, and error ownership.
order: 446
---

`HttpClient` is PURISTA's generic fetch wrapper for an external HTTP API. It is
not a generated PURISTA service client and does not know the remote schemas.
Define a narrow application interface around it and inject that interface as a
service resource.

```ts title="src/resource/riskClient.ts"
import { HttpClient } from '@purista/core'

export const createRiskClient = (input: { baseUrl: string; token: string }) => {
  const http = new HttpClient({
    name: 'risk-api',
    baseUrl: input.baseUrl,
    bearerToken: input.token,
    defaultTimeout: 5_000,
  })

  return {
    classifyTransaction: (transactionId: string) =>
      http.post<{ risk: 'low' | 'high' }>(
        '/classifications',
        { transactionId },
      ),
  }
}
```

Object payloads are serialized as JSON. JSON responses are parsed when their
content type begins with `application/json`; `204` resolves `undefined`.
Non-2xx responses and transport failures become `UnhandledError`, and the
configured default timeout becomes status `408`.

The client uses `defaultTimeout` unless one request supplies
`options.timeout`. Configure the normal budget on the client instance and use
an override only when one operation needs a different bound. Do not retry
state-changing calls until the remote API's idempotency and unknown-outcome
behavior are defined.

```ts title="Declare and provide the resource"
const transactionV1ServiceBuilder = new ServiceBuilder(transactionServiceInfo)
  .defineResource<'risk', ReturnType<typeof createRiskClient>>()

const service = await transactionV1Service.getInstance(eventBridge, {
  resources: { risk: createRiskClient(applicationConfig.risk) },
})
```

Keep credentials in the composition root. Never construct the remote client in
each handler or place tokens in URLs, logs, metrics, or spans.

Next: [test client behavior](/handbook/framework/expose-and-consume-services/service-clients/test-client-behavior/).
