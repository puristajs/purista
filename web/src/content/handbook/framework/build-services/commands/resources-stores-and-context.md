---
title: Use command resources, stores, and context
description: Read trusted message metadata and use only the resource, store, client, metric, and telemetry capabilities that the service and command declare.
order: 330
---

The command context is the command’s dependency boundary. It is not a global service locator: the service provides resources and runtime stores, while command declarations add the typed remote capabilities.

## Map a declaration to a context property

| Context property | Available when | Use it for |
| --- | --- | --- |
| `message` | Always | Readonly received envelope, trace ID, principal ID, and tenant ID. Treat identity values as trusted transport metadata, not replacement values from payload. |
| `resources` | `ServiceBuilder.defineResource(...)` and `getInstance(..., { resources })` | Narrow injected repository/SDK interfaces. |
| `configs`, `secrets`, `states` | Matching store is wired at service creation; included in-memory defaults exist for local/test use. | Runtime configuration, sensitive values, and service state. |
| `service` | `canInvoke(...)` | A declared command client. |
| `stream` | `canConsumeStream(...)` | A declared stream session. |
| `queue` | `canEnqueue(...)` | A declared queue’s enqueue and scheduling client. |
| `emit` | `canEmit(...)` | A declared custom event. |
| `logger`, `metrics`, `startActiveSpan`, `wrapInSpan` | Runtime; metric declarations where required | Safe structured logs, low-cardinality metrics, and traced work. |

The handler, before guards, and after guards receive the full command context. Input and output transforms receive the base context, message, and resources but not command/stream/event client proxies.

## Use a resource and state together

```ts title="src/service/invoice/v1/command/recordPayment/recordPaymentCommandBuilder.ts"
export const recordPaymentCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('recordPayment', 'Record a payment')
  .addPayloadSchema(recordPaymentPayloadSchema)
  .addParameterSchema(recordPaymentParameterSchema)
  .addOutputSchema(recordPaymentOutputSchema)
  .setCommandFunction(async function (context, payload) {
    const key = `payment:${context.message.tenantId}:${payload.paymentId}`
    const existing = await context.states.getState(key)
    if (existing[key]?.status === 'completed') return { status: 'already-completed' }

    const payment = await context.resources.payments.record(payload)
    await context.states.setState(key, { status: 'completed', paymentId: payment.id })
    context.logger.info({ paymentId: payment.id }, 'payment recorded')
    return { status: 'completed' }
  })
```

This is not a multi-store transaction. Validate stored values before using them, derive tenant scope from `context.message`, and design idempotency/race handling for the selected state backend.

[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) inherits the service’s resource typing, but it does not construct resources or stores. [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) give the handler its local immutable values. [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) is the non-arrow service-bound callback where the composition-root resources and runtime stores are available.

## Keep operational data safe

- Log stable identifiers and outcome data, never credentials, raw secrets, or unbounded payloads.
- Use low-cardinality metric attributes; a customer ID or request ID does not belong in a metric label.
- Start a span only for a useful operation boundary; the command runtime already supplies command spans and correlated logs.
- Add a resource declaration instead of importing a database client directly into a handler. It keeps the handler testable and makes lifecycle ownership explicit.

Read [Use stores in a service](/handbook/framework/build-services/use-stores-in-a-service/) for store wiring and [Handler inputs and context](/handbook/framework/build-services/handler-context/) for the cross-primitive map.

For the builder API, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
