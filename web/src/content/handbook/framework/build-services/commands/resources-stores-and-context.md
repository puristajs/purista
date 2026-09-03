---
title: Use command resources, stores, and context
description: Read trusted message metadata and use only the resource, store, client, metric, and telemetry capabilities that the service and command declare.
order: 328
---

The command context is the command’s dependency boundary. It is not a global
service locator: the service supplies common runtime capabilities, while the
command builder adds only the typed downstream clients it declares.

## Know which callback receives which context

| Callback | Inputs | Context boundary |
| --- | --- | --- |
| Command handler | `(context, payload, parameter)` | Full command context plus the validated domain input. |
| Before guard | `(context, payload, parameter)` | Full command context after domain input validation and before the handler. |
| After guard | `(context, result, payload, parameter)` | Full command context after domain output validation and before an optional output transform. |
| Input transform | `(context, rawPayload, rawParameter)` | Base runtime context, message, resources, and stores; no declared command/stream/queue/event clients. |
| Output transform | `(context, result, parameter)` | Base transform context and validated domain result; no command, stream, or emit clients. Runtime supplies the declared typed queue namespace, while the public transform context type currently shows the base queue shape. |

The full execution order is on the [Commands lifecycle](/handbook/framework/build-services/commands/#follow-the-complete-command-lifecycle).

## Map a declaration to a context property

| Context property | Available when | Use it for |
| --- | --- | --- |
| `message` | Always | Readonly received envelope, trace ID, principal ID, and tenant ID. Treat identity values as trusted transport metadata, not replacement values from payload. |
| `resources` | [`defineResource(...)` and runtime injection](/handbook/framework/build-services/services/provide-resources-and-metrics/) | Narrow injected repository/SDK interfaces. |
| `configs`, `secrets`, `states` | [The matching store is wired at service creation](/handbook/framework/configure-applications/use-stores-from-handlers/); included in-memory defaults exist for local/test use. | Runtime configuration, sensitive values, and service state. |
| `service` | [`canInvoke(...)`](/handbook/framework/build-services/commands/call-other-capabilities/invoke-command/) | A declared command client. |
| `stream` | [`canConsumeStream(...)`](/handbook/framework/build-services/commands/call-other-capabilities/consume-a-stream/) | A declared stream session. |
| `queue` | [`canEnqueue(...)`](/handbook/framework/build-services/commands/call-other-capabilities/enqueue-work/) | A declared queue’s enqueue and scheduling client. |
| `emit` | [`canEmit(...)`](/handbook/framework/build-services/commands/call-other-capabilities/emit-custom-events/) | A declared custom event. |
| `logger`, `metrics`, `startActiveSpan`, `wrapInSpan` | Runtime; metric declarations where required | Safe structured logs, low-cardinality metrics, and traced work. |

## Use only the local business data

```ts title="src/service/invoice/v1/command/recordPayment/recordPaymentCommandBuilder.ts"
export const recordPaymentCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('recordPayment', 'Record a payment')
  .addPayloadSchema(recordPaymentPayloadSchema)
  .addOutputSchema(recordPaymentOutputSchema)
  .setCommandFunction(async function (context, payload) {
    const payment = await context.resources.payments.record({
      tenantId: context.message.tenantId,
      paymentId: payload.paymentId,
      amountCents: payload.amountCents,
    })

    context.logger.info({ outcome: 'recorded' }, 'payment recorded')
    return { paymentId: payment.id, status: 'completed' }
  })
```

The surrounding contract uses
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder),
[`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema),
[`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema),
and
[`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction).
Their purpose, parameters, defaults, and validation behavior stay canonical in
[Create and validate a command](/handbook/framework/build-services/commands/create-and-validate/).

The command reads trusted tenant scope from the message and passes only the
fields the repository operation needs. The log records an outcome rather than
a payment, tenant, request, or payload identifier.

## Keep operational data safe

- Log stable identifiers and outcome data, never credentials, raw secrets, or unbounded payloads.
- Use low-cardinality metric attributes; a customer ID or request ID does not belong in a metric label.
- Start a span only for a useful operation boundary; the command runtime already supplies command spans and correlated logs.
- Add a resource declaration instead of importing a database client directly into a handler. It keeps the handler testable and makes lifecycle ownership explicit.

[Handler inputs and context](/handbook/framework/build-services/handler-context/)
owns the cross-primitive model. This page owns only the command-specific
callback and capability map.

In a unit test, create the context with
[`createCommandContextMock(...)`](/handbook/api/functions/_purista_core.createCommandContextMock/),
call the bound handler, and assert the specific resource or logger stub. This
proves declared context wiring; use `createCommandTestHarness(...)` when schema,
after-guard, output-transform, and response ordering matter.

For the builder API, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).

Next: [expose a command](/handbook/framework/build-services/commands/expose-a-command/).
