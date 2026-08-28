---
title: Provide resources and metrics
description: Declare narrow application dependencies and custom metrics on a service, then supply concrete implementations at the composition root.
order: 313
---

A resource is an application-owned dependency a handler needs: a repository,
provider gateway, or policy evaluator. [`defineResource`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineresource) makes that dependency
part of the service type and requires it when the service is instantiated; it
does not construct connections, supply secrets, or authorize requests.

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
import type { InvoiceRepository } from '../../../resource/invoiceRepository.js'
import { z } from 'zod'

export const invoiceV1ServiceBuilder = new ServiceBuilder(invoiceServiceInfo)
  .defineResource<'invoiceRepository', InvoiceRepository>()
  .defineMetric('app.invoices.created', {
    kind: 'counter',
    unit: '{invoice}',
    description: 'Created invoices',
    attributes: z.object({ channel: z.enum(['web', 'batch']) }),
  })
```

| Builder method | Parameters / defaults | Effect and choice |
| --- | --- | --- |
| [`defineResource<ResourceName, ResourceType>()`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineresource) | Compile-time generic name and interface; it has no runtime argument or default resource. | Adds one typed `context.resources[name]` member and makes `resources` mandatory in `getInstance(...)`. Use a narrow application interface so an integration test can supply a fake. |
| [`defineMetric(name, definition)`](/handbook/api/classes/_purista_core.ServiceBuilder/#definemetric) | A metric name plus required `kind`, `unit`, and `description`; `attributes` is optional. | Adds a typed `context.metrics[name]` handle. Use an `app.` name and avoid reserved/framework names. The current service construction path stores the declaration without calling the exported definition validator, so exercise the metric in a service test rather than relying on startup rejection for a malformed declaration. |

The resource arrives as `context.resources.invoiceRepository` in definitions
created from the builder. The metric arrives through the typed context metric
API; supplying a metric definition does not configure an exporter or recorder.

| Put behind a resource | Keep outside a resource |
| --- | --- |
| Narrow repository or provider interface that a handler can fake | Raw credential or request-specific identity |
| Service-owned domain gateway | Global service locator or transport route |
| A dependency with a clear composition-root lifecycle | Another PURISTA command; declare an invocation capability instead |

```ts title="src/index.ts"
const service = await invoiceV1Service.getInstance(eventBridge, {
  resources: { invoiceRepository: createInvoiceRepository() },
})
```

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
