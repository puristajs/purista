---
title: Use tools, skills, and service resources
description: Keep portable AI capabilities in Harness and bridge business operations through typed PURISTA host tools with trusted identity.
order: 395
---

Define portable tools, skills, and MCP servers in the Harness definition. Use a
Harness host tool when execution must cross into a PURISTA-owned business
capability.

For a command with matching schemas, bind its address directly:

```ts title="Bind a command as a host tool"
export const incidentHarnessPolicy = {
  publish: { agents: ['analyze_signals'] },
  hostTools: {
    get_incident_snapshot: commandAsHarnessTool('Support', '1', 'getIncidentSnapshot'),
  },
} as const
```

Use `mapInput` and `mapOutput` only when the model-facing contract
deliberately differs from the command contract. For richer integration, create
a typed host tool definition from the service builder:

```ts title="Implement a typed host tool"
const transferTool = transactionV1ServiceBuilder
  .getHarnessHostToolBuilder(bankHarness.contracts.hostTools.transfer_funds)
  .canInvoke('Transaction', '1', 'createTransfer', transferOutput, transferInput, transferParameter)
  .canEmit('transferRequested', transferRequestedSchema)
  .setHandler(async function (context, input) {
    return context.service.Transaction['1'].createTransfer(input, {
      idempotencyKey: context.idempotencyKey,
    })
  })
  .getDefinition()
```

The host-tool context carries trusted `tenantId`, `principalId`, `traceId`,
and `correlationId`, plus declared service resources. The model cannot supply
or override those values. Downstream command invocation forwards identity
through the normal PURISTA message envelope.

Business commands still validate authorization and invariants. A tool schema
only validates the model-produced input shape.

Use Harness storage, memory, workspace, sandbox, skills, and MCP contracts for
AI runtime state. Use PURISTA StateStore for application or session key-value
state, and a database resource for transactional records.
