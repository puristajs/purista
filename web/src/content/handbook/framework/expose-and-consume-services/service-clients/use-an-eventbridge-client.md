---
title: Use an EventBridge client
description: Generate typed command methods and route them through an already-started compatible EventBridge.
order: 444
---

Generate the client from reviewed definitions:

```ts title="tools/generate-eventbridge-client.ts"
import { ClientBuilder } from '@purista/core'

const builder = new ClientBuilder({
  definitionPath: './definitions',
  outputPath: './packages/transaction-client',
  eventBridgeClient: { clientName: 'EventBridgeClient' },
  package: { name: '@acme/transaction-client', private: true },
})

try {
  const definitions = await builder.loadDefinitionFiles()
  await builder.cleanDistFolder()
  await builder.generateEventBridgeClient(definitions)
  await builder.createIndex()
  await builder.createPackageJson()
  await builder.build()
} finally {
  builder.destroy()
}
```

`cleanDistFolder()` deletes the configured output directory recursively. Keep
the output path narrow and run the generator in a clean build workspace.

At runtime, construct the generated client with an EventBridge that has already
started:

```ts title="src/client/createTransactionClient.ts"
import type { EventBridge } from '@purista/core'
import { EventBridgeClient } from '@acme/transaction-client'

export const createTransactionClient = (eventBridge: EventBridge) =>
  new EventBridgeClient(eventBridge)
```

A service `transaction`, version `1`, command `getTransaction` becomes
`client.transaction.v1.getTransaction(payload, parameter, options?)`.
`options` may carry `traceId`, `principalId`, and `tenantId`. Supply only
identity established by a trusted application boundary; the receiving guard
still authorizes the business action.

The generator does not construct or start a broker adapter, discover a service,
retry unsafe commands, or bypass authorization. Test the selected EventBridge
and timeout/failure behavior in the deployed topology.

Next: [generate and use a REST client](/handbook/framework/expose-and-consume-services/service-clients/generate-and-use-a-rest-client/).
