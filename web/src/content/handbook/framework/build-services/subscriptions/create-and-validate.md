---
title: Create and validate a subscription
description: Define a narrow event contract and a service-bound handler whose normal result is validated before it can become an event.
order: 331
---

Finish this page with one reaction that handles a synthetic business event in a
known shape. A subscription is owned by a versioned service: the service
builder creates the definition, and the running service registers it with the
EventBridge.

## Define the smallest useful event contract

Treat an event payload as a cross-service compatibility boundary. Include the
facts the reaction needs, not an aggregate snapshot or a convenience copy of
customer data. Use an explicitly declared command or an authorized resource
when the subscriber needs an additional fact.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
import { z } from 'zod'
import { accountingV1ServiceBuilder } from '../../accountingV1ServiceBuilder.js'

const invoiceCreatedSchema = z.object({
  invoiceId: z.string().min(1),
  customerId: z.string().min(1),
  amountCents: z.number().int().positive(),
})
const recordInvoiceParameterSchema = z.undefined()
const ledgerEntryCreatedSchema = z.object({ ledgerEntryId: z.string() })

export const recordInvoiceSubscriptionBuilder = accountingV1ServiceBuilder
  .getSubscriptionBuilder('recordInvoice', 'Record an issued invoice in the ledger')
  .subscribeToEvent('billing.invoiceCreated', '1')
  .addPayloadSchema(invoiceCreatedSchema)
  .addParameterSchema(recordInvoiceParameterSchema)
  .addOutputSchema('accounting.ledgerEntryCreated', ledgerEntryCreatedSchema)
  .setSubscriptionFunction(async function (context, payload) {
    const entry = await context.resources.ledger.recordInvoice(payload)
    return { ledgerEntryId: entry.id }
  })
```

Custom events and command responses do not carry a separate command parameter;
the runtime passes `undefined`. Use `z.undefined()` or omit
`addParameterSchema(...)`. Reserve an object parameter schema for a
subscription that deliberately accepts command messages.

This builder assumes the service builder already declares its `ledger` resource;
see [provide resources and metrics](/handbook/framework/build-services/services/provide-resources-and-metrics/) for that composition contract.

Use `async function`, not an arrow function, for the handler. PURISTA binds
the handler’s `this` value to the service instance and rejects arrow functions.
The handler receives readonly, validated `payload` and `parameter` values.

## Know the definition methods

| Method | Parameters and defaults | Runtime effect | Use it for |
| --- | --- | --- | --- |
| [`getSubscriptionBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getsubscriptionbuilder) | A service-local name and concise description | Starts a service-owned definition. | One independently operated reaction. |
| [`subscribeToEvent(eventName, serviceVersion?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#subscribetoevent) | Non-empty event name; optional publisher service version | Sets the business event match and, if supplied, its version. | Every custom-event subscription. |
| [`addPayloadSchema(schema, contentType = 'application/json', encoding = 'utf-8')`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addpayloadschema) | One Standard Schema and optional incoming media metadata | Validates the domain payload before guards and handler execution. | The event facts this reaction needs. |
| [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addparameterschema) | One Standard Schema | Validates the separate message parameter before guards and handler execution. | Addressing/query-like values when the message has them. |
| [`addOutputSchema(eventName, schema, contentType = 'application/json', encoding = 'utf-8')`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addoutputschema) | Result event name and schema; optional outgoing media metadata | Validates a normal handler result and returns it as a custom EventBridge message. | A narrow fact that follows from this reaction. |
| [`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction) | `async function (context, payload, parameter) {}` | Installs the required service-bound handler. | The bounded business side effect. |

If input validation fails, the handler does not run. If a normal result fails
output validation, it is an internal error. A control result such as
`{ status: 'retry' }` skips output validation; see [acknowledge and control delivery](/handbook/framework/build-services/subscriptions/acknowledge-and-control-delivery/).

## Register the definition through its service

`getDefinition()` is asynchronous. Register its pending definition before the
service resolves definitions during `getInstance`; adding it afterward fails.

```ts title="src/service/accounting/v1/accountingV1Service.ts"
import { recordInvoiceSubscriptionBuilder } from './subscription/recordInvoice/recordInvoiceSubscriptionBuilder.js'
import { accountingV1ServiceBuilder } from './accountingV1ServiceBuilder.js'

export const accountingV1Service = accountingV1ServiceBuilder
  .addSubscriptionDefinition(recordInvoiceSubscriptionBuilder.getDefinition())
```

Despite its conventional aggregate name, `accountingV1Service` is still a
`ServiceBuilder`. Create the running instance with
`await accountingV1Service.getInstance(eventBridge, { resources: { ledger } })`,
then call `start()` on that instance.

Start the EventBridge and consumer service, then publish one schema-valid
synthetic event. This focused integration assertion proves that the selected
bridge routed the event and the handler reached its resource:

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoice.integration.test.ts"
import { getCustomMessageMessageMock } from '@purista/core'
import { expect, vi } from 'vitest'

await eventBridge.emitMessage(getCustomMessageMessageMock('billing.invoiceCreated', {
  invoiceId: 'invoice-42',
  customerId: 'customer-42',
  amountCents: 4_200,
}, {
  sender: {
    serviceName: 'Billing',
    serviceVersion: '1',
    serviceTarget: 'createInvoice',
    instanceId: 'billing-test',
  },
}))

await vi.waitFor(() => expect(ledger.recordInvoice).toHaveBeenCalledOnce())
```

The configured result event is returned to the EventBridge only after the
handler and normal runtime stages complete; it is not proof that another
subscriber has finished. The [subscription testing guide](/handbook/framework/build-services/subscriptions/test-subscriptions/)
shows a Sinon-based unit test and the full runtime boundary.

## Inspect, test, and evolve a definition

| Method | What it returns or changes | Use it when | Important boundary |
| --- | --- | --- | --- |
| [`getDefinition()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#getdefinition) | A promise for the completed subscription definition, including metadata, filters, and hooks. | Registering the subscription with [`addSubscriptionDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addsubscriptiondefinition). | It requires a handler and does not start or register a service by itself. |
| [`markAsDeprecated()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#markasdeprecated) | Deprecation metadata on the definition. | Marking a replaced public subscription while a compatible migration path still exists. | It does not block delivery, remove the registration, or notify publishers. |
| [`getSubscriptionFunction()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#getsubscriptionfunction) | The handler wrapped with input/output validation and before guards. | A focused direct test of the normal handler boundary. | It does not run input/output transforms, after guards, result-event construction, registration, or adapter delivery. |
| [`getSubscriptionFunctionPlain()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#getsubscriptionfunctionplain) | The raw handler. | A narrow unit test that intentionally supplies all validation and guard conditions itself. | It runs neither validation nor hooks. |

`getSubscriptionFunction()` throws `UnhandledError(501, "No function
implementation for <name>")` when no handler exists. `getDefinition()` instead
throws the plain definition-time error `SubscriptionDefinitionBuilder: missing
function implementation for <name>`.

The remaining public methods have one focused owner:

| Capability | Methods | Guide |
| --- | --- | --- |
| Routing | `filterSentFrom`, `filterReceivedBy`, `filterForMessageType`, `filterPrincipalId`, `filterTenantId` | [Match and filter events](/handbook/framework/build-services/subscriptions/match-and-filter-events/) |
| Boundary conversion and policy | `setTransformInput`, `setTransformOutput`, `setBeforeGuardHooks`, `setAfterGuardHooks` | [Transform and guard a subscription](/handbook/framework/build-services/subscriptions/transform-and-guard/) |
| Delivery advice | `adviceDurable`, `adviceAutoacknowledgeMessage`, `receiveMessageOnEveryInstance`, `adviceConsumerFailureHandling` | [Configure delivery failures and idempotency](/handbook/framework/build-services/subscriptions/delivery-failures-and-idempotency/) |
| Outbound capabilities | `canInvoke`, `canConsumeStream`, `canEmit` | [Call other capabilities](/handbook/framework/build-services/subscriptions/call-other-capabilities/) |
| Transform tests | `getTransformInputFunction`, `getTransformOutputFunction`, `getSubscriptionTransformContextMock` | [Test subscriptions](/handbook/framework/build-services/subscriptions/test-subscriptions/) |

The transform helper getters belong to a transform-specific test; the
[testing guide](/handbook/framework/build-services/subscriptions/test-subscriptions/) names their exact boundary.

Next, narrow delivery with [event filters](/handbook/framework/build-services/subscriptions/match-and-filter-events/) or add a focused [transform or guard](/handbook/framework/build-services/subscriptions/transform-and-guard/).

For signatures and generic types, see [SubscriptionDefinitionBuilder](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
