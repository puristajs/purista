---
title: Configuration stores
description: Select a non-sensitive configuration backend and wire it at the application composition root.
order: 510
---

Configuration stores resolve values that vary by environment but are not secrets. Examples are feature limits, a public endpoint, or a retention period. Define service configuration schemas so invalid values fail validation instead of changing business behavior silently.

| Store | Availability | Best fit |
| --- | --- | --- |
| Default in-memory | Included with core; local/test only | First project and deterministic tests |
| Redis | `@purista/redis-config-store` + Redis | Low-latency shared configuration |
| AWS Systems Manager | `@purista/aws-config-store` + AWS IAM | AWS-native configuration hierarchy |
| NATS JetStream KV | `@purista/nats-config-store` + JetStream | NATS-operated deployments |
| Dapr | `@purista/dapr-sdk` + sidecar/component | Platform-managed configuration abstraction |

Installing a package does not select it. Construct the store with its external
configuration and pass it as `configStore` when creating the service:

```ts title="src/index.ts"
const service = await incidentV1Service.getInstance(eventBridge, { configStore })
```

`getConfig(...)` is enabled by default. `setConfig(...)` and `removeConfig(...)`
are disabled by default for every core-backed store; enable each deliberately
only in an administrative configuration workflow. Some adapters impose a
stronger limit—for example, the Dapr configuration adapter is read-only even
if write toggles are supplied. Test the store separately from service business
behavior and do not place secrets in configuration values.

## Read configuration in a handler

Every command, subscription, stream, and worker receives the configured store
through `context.configs`. A read accepts one or more names and returns an
object with those exact names as keys. A missing value is `undefined`; the
value type is `unknown`, so validate it at the business boundary before it
changes behavior.

| Handler call | Parameters and result | Use it for |
| --- | --- | --- |
| [`context.configs.getConfig(...)`](/handbook/api/classes/_purista_core.ConfigStoreBaseClass/#getconfig) | One or more configuration names; returns `{ [name]: unknown \| undefined }`. | Read the non-sensitive setting that affects this execution. |
| [`context.configs.setConfig(name, value)`](/handbook/api/classes/_purista_core.ConfigStoreBaseClass/#setconfig) | One name and an `unknown` value; returns after the adapter accepts the write. Disabled by default. | An authorized configuration-owner workflow. |
| [`context.configs.removeConfig(name)`](/handbook/api/classes/_purista_core.ConfigStoreBaseClass/#removeconfig) | One name; returns after the adapter removes it. Disabled by default. | Retiring a configuration value that the workflow owns. |

```ts title="src/service/incident/v1/command/createIncident/createIncidentCommandBuilder.ts"
import { z } from 'zod'
import { incidentV1ServiceBuilder } from '../../incidentV1ServiceBuilder.js'

const input = z.object({ incidentId: z.string().min(1) })
const output = z.object({ incidentId: z.string(), maxRetries: z.number().int() })

export const createIncidentCommandBuilder = incidentV1ServiceBuilder
  .getCommandBuilder('createIncident', 'Creates an incident with an operational retry limit')
  .addPayloadSchema(input)
  .addOutputSchema(output)
  .setCommandFunction(async function (context, payload) {
    const settings = await context.configs.getConfig('incident.maxRetries')
    const configuredRetries = settings['incident.maxRetries']

    const maxRetries =
      typeof configuredRetries === 'number' && Number.isInteger(configuredRetries)
        ? configuredRetries
        : 3

    return { incidentId: payload.incidentId, maxRetries }
  })
```

| Declaration | What it establishes | Options, default, and failure boundary |
| --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | A service-local command definition. `name` is the stable command target and `description` supplies human-readable definition metadata. | Pass the optional `eventName` only when this command has one canonical success fact to publish. The call creates a builder; register its completed definition with the service before it can run. |
| [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | The `incidentId` contract and the inferred, validated `payload` argument. | The representation arguments retain an earlier value when supplied, otherwise the definition uses JSON and UTF-8. Payload validation happens before before-guard hooks and the handler; invalid input is rejected as a bad request. |
| [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | The returned incident/retry-limit contract. | Omit the optional representation arguments for the same JSON/UTF-8 defaults. A handler result that fails this schema is an internal error, so do not use the output as an unvalidated store-value passthrough. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | The service-bound implementation that receives `context` and the schema-validated payload. | Use `async function`, not an arrow: Core rejects arrow handlers and binds the service receiver. It is required; attempting to assemble a definition without it fails. |

Use a service or application schema when a fallback would hide an invalid
deployment configuration. Do not use the store as a request-time feature-flag
transport unless the selected adapter and its refresh behavior explicitly meet
that need.

Writes are a separate authority boundary. With the default operation settings,
`setConfig` and `removeConfig` reject with an unauthorized `UnhandledError`;
an adapter can also reject an operation it does not implement. Enable the
operation at the composition root, then enforce the business authorization in
the command's guard and handler. See [Configure store operations and secret
caching](/handbook/framework/configure-applications/configure-store-operations-and-secret-cache/)
for the switches and each provider page for its mutation limits.

For the shared operation toggles, logger ownership, and the important fact that
cache fields alone do not promise provider caching, read [Configure store
operations and secret caching](/handbook/framework/configure-applications/configure-store-operations-and-secret-cache/).

Need a provider PURISTA does not ship? [Build a custom configuration store](/handbook/framework/configure-applications/configuration-stores/custom-configuration-store/). Otherwise return to the [chapter overview](/handbook/framework/configure-applications/).
