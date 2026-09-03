---
title: Create and version a service
description: Define one stable business boundary, make its public version explicit, and keep deployment concerns outside the service contract.
order: 312
---

Create a service for one business capability: invoices, shipment tracking, or
customer notifications. Its version is part of the public contract consumed by
commands, events, clients, and other services. It is not a deployment release
or database migration number.

```sh title="Generate the Invoice service"
npm run add:service -- invoice --description "Manage invoices"
```

Add another contract version without replacing the shared service identity:

```sh title="Generate Invoice service version 2"
npm run add:service -- invoice --description "Manage invoices" --service-version 2
```

The CLI leaves the existing general service-info file untouched and creates a
new `v2` directory. File and directory casing follows `puristaConfig`, and the
service root follows `puristaConfig.servicePath`.

```text title="Generated service files with camelCase casing"
src/service/invoice/
├── generalInvoiceServiceInfo.ts
├── v1/
│   ├── invoiceServiceConfig.ts
│   ├── invoiceV1ServiceBuilder.ts
│   ├── invoiceV1Service.ts
│   └── invoiceV1Service.test.ts
└── v2/
    ├── invoiceServiceConfig.ts
    ├── invoiceV2ServiceBuilder.ts
    ├── invoiceV2Service.ts
    └── invoiceV2Service.test.ts
```

The generated service gives you general identity information, a versioned
builder, an aggregate module, configuration schema, and setup test. Define the
service-wide contracts in the builder module; keep definition registration in
the aggregate.

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'
import { generalInvoiceServiceInfo } from '../generalInvoiceServiceInfo.js'
import { invoiceServiceV1ConfigSchema } from './invoiceServiceConfig.js'

export const invoiceServiceInfo = {
  serviceVersion: '1',
  ...generalInvoiceServiceInfo,
} as const satisfies ServiceInfoType

const invoiceV1ServiceBuilderInstance = new ServiceBuilder(invoiceServiceInfo)
invoiceV1ServiceBuilderInstance.setConfigSchema(invoiceServiceV1ConfigSchema)

export const invoiceV1ServiceBuilder = invoiceV1ServiceBuilderInstance
```

[`ServiceBuilder.setConfigSchema(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setconfigschema)
binds the versioned service configuration contract before definitions or an
instance are resolved. The generated separate statement also preserves the
builder instance's inferred config type for later registration.

`ServiceInfoType` supplies the service name, description, and version. The
service constructor validates that identity when an instance is created, so a
missing or invalid field fails instead of producing an anonymous runtime
participant.

Service names contain one or more ASCII letters, digits, hyphens, or
underscores. Service versions contain digits only. Values such as `invoice`,
`Invoice-Reader`, and `1` are valid; `invoice.reader`, `v1`, and `1.0.0` throw a
`TypeError` during service construction. Treat the version as the address of a
contract, not a semantic package version.

| Change | Keep the version | Create a version |
| --- | --- | --- |
| Add an optional field or independent capability | Yes, with compatibility tests | No |
| Change required input/output meaning | No | Yes |
| Change an event payload incompatibly | No | Yes, or use a new event name |
| Replace an internal resource implementation | Yes | No, unless the observable contract changes |

[`markAsDeprecated()`](/handbook/api/classes/_purista_core.ServiceBuilder/#markasdeprecated) marks the service definition and newly created command,
subscription, and stream definitions as deprecated metadata. It does not
disable routes, stop the service, migrate callers, or add a replacement. Publish
a compatible successor and a migration before removing a version.

Next, [add definitions to the service](/handbook/framework/build-services/services/add-definitions-to-a-service/).
