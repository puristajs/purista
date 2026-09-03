---
title: Use subscription resources, stores, and context
description: Read the message and use only the resources, stores, and cross-service capabilities that the service and subscription explicitly provide.
order: 340
---

The handler receives `async function (context, payload, parameter)`. Its
`payload` and `parameter` are readonly validated domain values. `context.message`
is the original readonly EventBridge message; use it for trace, correlation,
principal, tenant, and routing information—not as an unvalidated second payload.

## Read the capability map before adding code

| Context member | Available when | Use it for |
| --- | --- | --- |
| `context.resources` | The service instance was created with the resource | Business repositories and provider clients behind a service boundary. |
| `context.configs`, `context.secrets`, `context.states` | Every service context; `getInstance` supplies in-process default stores when no adapter is bound | `getConfig/setConfig/removeConfig`, `getSecret/setSecret/removeSecret`, and `getState/setState/removeState`. Bind a real adapter when values must survive the process, be shared, or come from an external system. |
| `context.logger` | Every runtime context | Structured diagnostics that explain the reaction without copying sensitive payloads. |
| `context.metrics` | Typed from metrics declared with `ServiceBuilder.defineMetric(...)` | Counters and up/down counters expose `add(value, attributes?)`; histograms expose `record(value, attributes?)`. Attributes are required when the metric declaration has an attribute schema. |
| `context.wrapInSpan`, `context.startActiveSpan` | Every runtime context | Wrap bounded operations in OpenTelemetry spans while preserving the current trace. |
| `context.service` | The builder declared `canInvoke(...)` | A typed command dependency. |
| `context.stream` | The builder declared `canConsumeStream(...)` | A typed stream session. |
| `context.emit` | The builder declared `canEmit(...)` | A typed custom event. |
| `context.queue` | Present as a context shape, but no queue capability is declared for normal subscription handlers | A call fails with `UnhandledError(403, 'queue "<name>" is not allowed in this handler')`. Use `ServiceBuilder.bindEventToQueue(...)`. The input/output transform context is a runtime exception: its queue namespace is currently unrestricted, so keep transforms side-effect free. |

## Keep the side-effect boundary obvious

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
recordInvoiceSubscriptionBuilder.setSubscriptionFunction(async function (context, payload) {
  context.logger.info(
    { correlationId: context.message.correlationId },
    'recording invoice ledger entry',
  )

  const entry = await context.resources.ledger.recordInvoice(payload)

  context.metrics.invoiceRecorded.add(1)
  return { ledgerEntryId: entry.id }
})
```

[`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs this service-bound handler. It receives context only after the
builder has declared its outbound capabilities; runtime base facilities such
as stores and telemetry do not make an undeclared cross-service call available.

The service builder must declare the metric before the handler can use it:

```ts title="src/service/accounting/v1/accountingV1ServiceBuilder.ts"
import { ServiceBuilder } from '@purista/core'
import type { LedgerResource } from '../../../resource/ledgerResource.js'
import { accountingV1ServiceInfo } from './accountingV1ServiceInfo.js'

export const accountingV1ServiceBuilder = new ServiceBuilder(accountingV1ServiceInfo)
  .defineResource<'ledger', LedgerResource>()
  .defineMetric('invoiceRecorded', {
    kind: 'counter',
    description: 'Ledger entries recorded',
    unit: '{ledger-entry}',
  })
```

The declaration only types the service dependency. Supply the concrete resource
when creating the service instance:

```ts title="Provide the declared ledger resource"
const accounting = await accountingV1Service.getInstance(eventBridge, {
  resources: { ledger },
})
```

[`defineMetric(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#definemetric)
adds a named service metric. `kind` selects the instrument, while `description`
and `unit` make the emitted measurement interpretable; it does not replace
request tracing or attach arbitrary payload values as metric labels.

Validate a tenant/business relationship inside the resource or service before
writing. A message filter may narrow delivery, but it does not establish that
the record belongs to the message principal or tenant.

## Use direct-test stubs intentionally

`createSubscriptionContextMock(builder, { message, sandbox?, resources? })`
creates a typed deterministic context for direct handler tests. It returns
`{ context, mock, stubs }`, where `context === mock`. This is different from an
instantiated service: unconfigured config, secret, state, service, and queue
calls reject rather than silently inventing an available dependency. `emit`
uses one Sinon stub per declared event; accessing an undeclared event fails.
Reading an unsupplied resource throws `Resource <name> not set or stubbed`.
Supply only the narrow resource fake the test needs.

Next, [test subscriptions](/handbook/framework/build-services/subscriptions/test-subscriptions/) to choose the direct, runtime, and real-adapter boundaries.

For the context type, see [SubscriptionFunctionContext](/handbook/api/types/_purista_core.SubscriptionFunctionContext/).
