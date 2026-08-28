---
title: Call other capabilities
description: Declare the command, stream, queue, or event capability your handler needs, then choose the coupling and delivery boundary deliberately.
order: 325
---

The command context is intentionally not a global service locator. Add a builder declaration before calling another capability. The declaration makes the client typed, records the contract, and lets the runtime validate it.

## Choose the boundary first

| The command needs | Choose | Trade-off |
| --- | --- | --- |
| A downstream answer before it can return | [Invoke another command](/handbook/framework/build-services/commands/call-other-capabilities/invoke-command/) | Coupled latency and availability. |
| Work to survive after this command returns | [Enqueue background work](/handbook/framework/build-services/commands/call-other-capabilities/enqueue-work/) | Acceptance is separate from completion. |
| A distinct fact that other components may react to | [Emit custom events](/handbook/framework/build-services/commands/call-other-capabilities/emit-custom-events/) | Not atomic with a resource write. |
| Progressive upstream data while this command stays connected | [Consume a stream](/handbook/framework/build-services/commands/call-other-capabilities/consume-a-stream/) | The command remains coupled to the stream session. |

## Declare only the capabilities you use

| Builder declaration | Context surface | Contract choice |
| --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | Starts the local command definition. | Keep its name stable; the optional event name belongs to the local success response, not to a dependency. |
| [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) / [`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) / [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | Types and validates the local request, selectors, and result. | Keep these schemas separate from every downstream contract so one service can evolve its own boundary deliberately. |
| [`canInvoke(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvoke) | `context.service[serviceName][version][target](payload, parameter)` | Supply schemas when another service/version/deployment owns the contract. |
| [`canEnqueue(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue) | `context.queue.enqueue[queueName](...)` and `context.queue.scheduleAt[queueName](...)` | Supply the expected job payload/parameter schemas. |
| [`canEmit(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit) | `context.emit(eventName, payload)` | A payload schema is required. |
| [`canConsumeStream(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canconsumestream) | `context.stream[serviceName][version][target](payload, parameter)` | Choose request, chunk, and final schemas plus validation flags. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | Installs the service-bound handler that receives the declared clients. | Use a non-arrow `async function`; choose the preceding `can*` declaration before using its context property. |

An empty service name, version, target, queue name, or event name fails while the definition is built. Omitted schemas deliberately leave the corresponding dependency contract unconstrained; they do not make an undeclared capability available.

## Keep the handler focused

Declare at the builder boundary and use the typed property in the handler. Avoid making a remote command chain a distributed transaction, and do not use a queue call as a hidden synchronous function.

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.ts"
export const createInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('createInvoice', 'Create an invoice')
  .canEnqueue('invoiceNotification', notificationPayloadSchema)
  .addPayloadSchema(createInvoicePayloadSchema)
  .addParameterSchema(createInvoiceParameterSchema)
  .addOutputSchema(createInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload) {
    const invoice = await context.resources.invoices.create(payload)
    await context.queue.enqueue.invoiceNotification({ invoiceId: invoice.id })
    return { invoiceId: invoice.id }
  })
```

This result proves only that the enqueue operation was accepted. The worker may run later, retry, or fail according to the queue bridge and worker policy.

For this definition, [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) creates the service-local contract. [`canEnqueue(queueName, payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue) adds the one queue client used in the handler. [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) validate the local command before and after that interaction. [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) installs the non-arrow, service-bound callback that can access the declared queue client.

Next: choose [an invocation](/handbook/framework/build-services/commands/call-other-capabilities/invoke-command/), [background work](/handbook/framework/build-services/commands/call-other-capabilities/enqueue-work/), [a custom event](/handbook/framework/build-services/commands/call-other-capabilities/emit-custom-events/), or [a stream](/handbook/framework/build-services/commands/call-other-capabilities/consume-a-stream/).

For all declaration signatures, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
