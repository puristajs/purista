---
title: Create typed tools
description: Define native application tools with schemas, authorization, and deterministic tests.
order: 410
---

Use `defineTool(id, definition)` for one reusable operation. Put credentials,
repositories, and authorization in the runtime resources supplied to its
handler. Add the returned definition to an agent's `tools` array.

```ts title="src/harness/tools/findOrder.ts"
import { defineTool } from '@purista/harness'
import { z } from 'zod'

const orders = {
  find: async (orderId: string) => ({ orderId, status: 'processing' }),
}

export const findOrder = defineTool('findOrder', {
  description: 'Read one order visible to the current caller.',
  input: z.object({ orderId: z.string().min(1) }),
  output: z.object({ orderId: z.string(), status: z.string() }),
  handler: async (_context, input) => orders.find(input.orderId),
})
```
A portable tool receives only the declared Harness tool context and signal. Use
a closure-injected client as above, and keep caller authentication and business
authorization in the application that creates that client. PURISTA-hosted
service resources belong in `ServiceBuilder.defineTool` and its hosted context;
do not put Framework resources into a standalone Harness definition. A tool
validates input and output at its boundary and does not make a side effect
idempotent. Test malformed input and dependency failure, then use a strict fake
model fixture to verify that the agent selected the tool.

MCP tools use `defineMcpServer` and remote names; see [MCP](./mcp/).
