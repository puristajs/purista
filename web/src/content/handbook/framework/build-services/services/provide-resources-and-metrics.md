---
title: Provide resources and metrics
description: Declare narrow application dependencies and custom metrics on a service, then supply concrete implementations at the composition root.
order: 314
---

A resource is an application-owned dependency a handler needs: a repository,
provider gateway, or policy evaluator. [`defineResource`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineresource) makes that dependency
part of the service type and requires it when the service is instantiated; it
does not construct connections, supply secrets, or authorize requests.

The service is the logical dependency and runtime boundary for its commands,
subscriptions, streams, workers, and mounted Harness host tools. The service builder
declares the interfaces and shared requirements. The application composition
root selects concrete resources, store adapters, bridges, logger, telemetry,
and validated service configuration when it calls `getInstance(...)`. PURISTA
then exposes the appropriate typed subset to each callback. Business code stays
coupled to the service contract, not to a database, broker, telemetry vendor,
or provider SDK.

Most runtime facilities appear on the handler context: `resources`,
`configs`, `secrets`, `states`, `logger`, `metrics`, and tracing helpers.
Validated service configuration is owned by the bound service instance and is
available as `this.config` inside a non-arrow callback. A command-specific
client such as `context.service` or `context.queue` appears only after that
command declares the matching `can*` capability.

## Declare the service dependency

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
import { ServiceBuilder } from '@purista/core'
import type { InvoiceRepository } from '../../../resource/invoiceRepository.js'

export const invoiceV1ServiceBuilder = new ServiceBuilder(invoiceServiceInfo)
  .defineResource<'invoices', InvoiceRepository>()
```

| Builder method | Parameters / defaults | Effect and choice |
| --- | --- | --- |
| [`defineResource<ResourceName, ResourceType>()`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineresource) | Compile-time generic name and interface; it has no runtime argument or default implementation. | Adds one typed `context.resources[name]` member and makes the `resources` option mandatory in TypeScript. `getInstance(...)` also fails when a service with declared resources receives no resource object. Use a narrow application interface so a test can supply a fake. |

The resource arrives as `context.resources.invoices` in commands,
subscriptions, streams, and workers created from this service builder.

| Put behind a resource | Keep outside a resource |
| --- | --- |
| Narrow repository or provider interface that a handler can fake | Raw credential or request-specific identity |
| Service-owned domain gateway | Global service locator or transport route |
| A dependency with a clear composition-root lifecycle | Another PURISTA command; declare an invocation capability instead |

## Supply the implementation at runtime

Construct infrastructure in the application composition root, then pass the
ready implementation to the service instance.

```ts title="src/application/createInvoiceService.ts"
const invoices = await createInvoiceRepository()

const service = await invoiceV1Service.getInstance(eventBridge, {
  resources: { invoices },
})

await service.start()
```

`getInstance(...)` stores the supplied object and exposes it to every
definition context; it does not call resource-specific `start`, `connect`, or
`destroy` methods. The composition root owns that lifecycle: make the resource
ready before the service handles messages, destroy the service before closing
the resource, and handle partial-startup cleanup. Keep credentials in
deployment configuration or a secret store instead of embedding them in the
resource declaration.

For tests, pass a small in-memory implementation or stub through the same
`resources` option. This verifies the real dependency boundary without a
database or provider SDK.

## Declare application metrics separately

A custom metric is another service-level declaration, but it is not a
resource and has a different runtime owner.

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
import { ServiceBuilder } from '@purista/core'
import type { InvoiceRepository } from '../../../resource/invoiceRepository.js'
import { z } from 'zod'

export const invoiceV1ServiceBuilder = new ServiceBuilder(invoiceServiceInfo)
  .defineResource<'invoices', InvoiceRepository>()
  .defineMetric('app.invoices.created', {
    kind: 'counter',
    unit: '{invoice}',
    description: 'Created invoices',
    attributes: z.object({ channel: z.enum(['web', 'batch']) }),
  })
```

| Builder method | Parameters / defaults | Effect and choice |
| --- | --- | --- |
| [`defineMetric(name, definition)`](/handbook/api/classes/_purista_core.ServiceBuilder/#definemetric) | A metric name plus required `kind`, `unit`, and `description`; `attributes` is optional. | Adds a typed `context.metrics[name]` handle. Use an `app.` name and avoid reserved/framework names. The current service construction path stores the declaration without calling the exported definition validator, so exercise the metric in a service test rather than relying on startup rejection for a malformed declaration. |

The metric arrives through the typed context metric API. Supplying a metric
definition does not configure an exporter or recorder.

Metric recording is enabled by default; this call does not configure export.
Pass an exporter-backed Meter (or configure the global MeterProvider) as shown
in [OpenTelemetry](/handbook/framework/secure-and-operate/observability/opentelemetry/)
when measurements must leave the process.

| Metric kind | Handler method | Use it for |
| --- | --- | --- |
| `counter` | `context.metrics['app.invoices.created'].add(1, { channel: 'web' })` | A value that only increases, such as accepted invoices. |
| `upDownCounter` | `.add(1, attributes)` or `.add(-1, attributes)` | A current quantity that may rise and fall, such as active jobs. |
| `histogram` | `.record(milliseconds, attributes)` | A distribution, such as duration or payload size. |

The optional `attributes` schema makes the second argument type-safe. Use only
small, reviewed dimensions such as channel; metric filtering rejects selected
unsafe names and non-scalar values, but cannot determine whether an otherwise
valid value is high cardinality.

Do not put secrets or tenant scope into a generic resource just to hide their
lifecycle. Use the appropriate store and derive trusted request identity in a
handler/guard. A resource interface does not itself enforce authorization or
tenant isolation.

Next, [configure a service](/handbook/framework/build-services/services/configure-a-service/) or [instantiate and start it](/handbook/framework/build-services/services/instantiate-and-start-a-service/).

For signatures, see [ServiceBuilder](/handbook/api/classes/_purista_core.ServiceBuilder/).
