---
title: Create and version a service
description: Define one stable business boundary, make its public version explicit, and keep deployment concerns outside the service contract.
order: 311
---

Create a service for one business capability: invoices, shipment tracking, or
customer notifications. Its version is part of the public contract consumed by
commands, events, clients, and other services. It is not a deployment release
or database migration number.

```sh title="Generate the Invoice service"
npm run add:service -- invoice --description "Manage invoices"
```

The generated service gives you general identity information, a versioned
builder, an aggregate module, configuration schema, and setup test. Define the
service-wide contracts in the builder module; keep definition registration in
the aggregate.

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'
import { generalInvoiceServiceInfo } from '../generalInvoiceServiceInfo.js'

export const invoiceServiceInfo = {
  serviceVersion: '1',
  ...generalInvoiceServiceInfo,
} as const satisfies ServiceInfoType

export const invoiceV1ServiceBuilder = new ServiceBuilder(invoiceServiceInfo)
```

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
