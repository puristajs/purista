---
title: Configure a service
description: Validate static service-owned settings at creation and startup, while keeping secrets, tenant identity, and mutable runtime data in their correct boundaries.
order: 314
---

Service configuration is the validated setting set for one running service
instance. Use it for bounded, restart-scoped behavior such as a reminder window
or batch limit. Do not use it for tenant identity, raw credentials, or values
that must change independently of deployment.

```ts title="src/service/invoice/v1/invoiceServiceConfig.ts"
import { z } from 'zod'

export const invoiceServiceV1ConfigSchema = z.object({
  reminderWindowDays: z.number().int().min(1).max(90).default(14),
})
```

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
export const invoiceV1ServiceBuilder = new ServiceBuilder(invoiceServiceInfo)
  .setConfigSchema(invoiceServiceV1ConfigSchema)
  .setDefaultConfig({ reminderWindowDays: 14 })
```

[`setConfigSchema(schema)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setconfigschema) declares the complete validated service configuration shape. [`setDefaultConfig(config)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setdefaultconfig) must satisfy that shape and provides defaults for the one service instance. The defaults are merged first, [`getInstance(..., { serviceConfig })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance)
wins next, and schema parsing/defaults fill still-absent values. The schema
validates during `getInstance(...)` and again at service start. Invalid input
rejects those operations with validation issues; do not catch the failure and
run with partial configuration.

| Need | Use instead |
| --- | --- |
| A fixed secret needed while constructing a resource | Deployment secret delivery or composition-root credential handling |
| A managed sensitive runtime value | [Secret stores](/handbook/framework/configure-applications/secret-stores/) |
| A non-secret value updated outside deployment | [Configuration stores](/handbook/framework/configure-applications/configuration-stores/) |
| Per-request caller/tenant identity | Trusted message context and guards |

Test schema defaults, a valid override, and invalid input before testing a
provider-backed configuration source. For the complete contract, see [ServiceBuilder](/handbook/api/classes/_purista_core.ServiceBuilder/).
