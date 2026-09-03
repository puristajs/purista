---
title: Configuration and environment variables
description: Keep typed service configuration separate from deployment settings, credentials, and adapter-specific environment variables.
order: 1235
---

PURISTA does not create one global environment-variable namespace. Each
application reads deployment settings at its composition root, validates them,
and passes typed configuration to services and adapters. This keeps service
definitions portable and makes missing settings fail before traffic is served.

## Put each value in the right boundary

| Value | Owner | Pass it through |
| --- | --- | --- |
| Business behavior setting | Service definition | `setConfigSchema(schema)`, `setDefaultConfig(...)`, and `getInstance(..., { serviceConfig })` |
| Non-secret deployment setting | Application configuration | Validated `process.env`, configuration store, or deployment config |
| Credential or key | Secret manager | `secretStore` and least-privilege workload identity |
| Database/client instance | Application resource | `defineResource(...)` and `getInstance(..., { resources })` |
| Broker, queue, HTTP, telemetry, or AI provider setting | Adapter/runtime construction | The selected adapter constructor or runtime binding |

```ts title="src/config/applicationConfig.ts"
import { z } from 'zod'

const applicationConfigSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z.string().url().optional(),
})

export const applicationConfig = applicationConfigSchema.parse(process.env)
```

Validate once, then pass only the fields a component owns. Do not let handlers
read `process.env` directly; that hides dependencies and makes tests depend on
process-global mutable state.

## Configure a service with a schema

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
const invoiceConfigSchema = z.object({
  reminderWindowDays: z.number().int().positive().default(14),
})

const invoiceV1ServiceBuilderInstance = new ServiceBuilder(invoiceServiceInfo)
invoiceV1ServiceBuilderInstance.setConfigSchema(invoiceConfigSchema)

export const invoiceV1ServiceBuilder = invoiceV1ServiceBuilderInstance
```

[`ServiceBuilder.setConfigSchema(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setconfigschema)
sets the validated service-level contract. Use
[`setDefaultConfig(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setdefaultconfig)
only for safe application defaults that also satisfy that schema.

Supply `serviceConfig` to
[`ServiceBuilder.getInstance(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance).
Invalid configuration rejects instance creation with schema issues. Defaults
come from the schema. The service may read the parsed value as `this.config`;
handlers should not reparse it.

## Keep secrets out of ordinary configuration

Environment variables can inject a secret-store endpoint or workload-identity
selector, but do not copy secret values into service configuration, logs,
metrics, traces, generated definitions, or client bundles. Resolve secrets at
the narrow resource boundary and rotate them through the selected provider.

Verify configuration with one valid test, every required-field failure, and a
startup test against the selected adapter. A successful schema parse does not
prove broker credentials, network reachability, permissions, or external
provider compatibility.

Next: [packages and feature availability](/handbook/framework/reference/packages-and-feature-availability/).
