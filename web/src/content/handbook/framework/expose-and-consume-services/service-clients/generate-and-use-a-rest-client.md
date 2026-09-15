---
title: Generate and use a REST client
description: Generate a fetch-based package for HTTP-exposed commands and configure it for the real Hono gateway.
order: 445
---

The HTTP generator includes only commands with `exposeAsHttpEndpoint(...)`.
It does not generate stream, queue, subscription, schedule, or Harness clients.

```ts title="tools/generate-rest-client.ts"
import { ClientBuilder } from '@purista/core'

const builder = new ClientBuilder({
  definitionPath: './definitions',
  outputPath: './packages/bank-rest-client',
  httpClient: { clientName: 'BankHttpClient' },
  package: { name: '@acme/bank-rest-client', private: true },
})

try {
  const definitions = await builder.loadDefinitionFiles()
  await builder.cleanDistFolder()
  await builder.generateHttpClient(definitions)
  await builder.createIndex()
  await builder.createPackageJson()
  await builder.build()
} finally {
  builder.destroy()
}
```

Use the generated constructor to set the public API base URL, default timeout,
headers, and authentication:

```ts title="src/client/bankApi.ts"
import { BankHttpClient } from '@acme/bank-rest-client'

export const bankApi = new BankHttpClient({
  baseUrl: 'https://api.example.com/api',
  defaultTimeout: 10_000,
  bearerToken: sessionToken,
  defaultHeaders: { accept: 'application/json' },
})

const transaction = await bankApi.transaction.v1.getTransaction({ transactionId })
```

The generated client uses `fetch`, sends `credentials: 'include'`, and can
rotate the bearer token with `__setBearerToken__(token)`. Non-2xx responses
throw its generated `HttpError`; map its status/data to an application-owned UI
error instead of displaying upstream data unchanged.

Async Hono routes return normalized queue admission metadata with `202`, and
the generated method uses that receipt as its return type. Generated `DELETE`
methods are bodyless to match Hono. Generation fails when a DELETE endpoint
declares a non-empty payload; model required input as declared path or query
parameters instead. Generated methods do not expose arbitrary per-call
options, so configure stable values on the client instance.

Next: [use the fetch-based client](/handbook/framework/expose-and-consume-services/service-clients/use-the-fetch-based-client/).
