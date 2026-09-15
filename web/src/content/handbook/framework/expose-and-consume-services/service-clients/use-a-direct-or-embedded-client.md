---
title: Use a direct or embedded client
description: Keep direct command calls inside tests and use a shared EventBridge for production calls inside one process.
order: 443
---

Builder direct functions are test seams. `getCommandFunctionPlain()` returns the
raw handler. `getCommandFunction()` adds focused input/output validation and
before guards. Neither reproduces the full service runtime: transforms, after
guards, result-event publication, routing, transport, and service telemetry are
outside that call.

```ts title="Direct command logic test"
const command = await updateTransactionCommandBuilder.getCommandFunctionPlain()
const context = createCommandContextMock({
  resources: { transactions: transactionRepository },
})

await expect(command(context.mock, payload, parameter)).resolves.toEqual(expected)
```

For a production modular monolith, start the provider and give a generated
EventBridge client the same bridge:

```ts title="src/client/transactionClient.ts"
import { DefaultEventBridge } from '@purista/core'
import { EventBridgeClient } from '@acme/transaction-client'
import { transactionV1Service } from '../service/transaction/v1/transactionV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await transactionV1Service.getInstance(eventBridge)
await service.start()

const client = new EventBridgeClient(eventBridge)
const transaction = await client.transaction.v1.getTransaction(
  undefined,
  { transactionId },
  { principalId, tenantId },
)
```

This is embedded execution, but it is still address-first. The provider service
owns the command and the EventBridge resolves its registered receiver. Replace
the DefaultEventBridge with a compatible broker adapter to distribute the same
client boundary.

Destroy the service before the bridge. Do not reuse a destroyed service
instance.

Next: [use an EventBridge client](/handbook/framework/expose-and-consume-services/service-clients/use-an-eventbridge-client/).
