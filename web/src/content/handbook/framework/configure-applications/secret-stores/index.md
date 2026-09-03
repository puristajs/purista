---
title: Secret stores
description: Select a secret backend that matches your identity, rotation, audit, and deployment controls.
order: 520
---

Secret stores are the runtime boundary for sensitive values whose lifecycle is
part of application or business behavior: a tenant API key, a principal's
delegated credential, or a key a service must create, rotate, revoke, or
resolve while it runs. Treat the store's identity policy, audit trail,
encryption, and rotation behavior as part of the application's security design.

They are not the mandatory first destination for every credential. Use the
deployment platform's approved secret delivery and workload identity for the
technical credentials needed to start an application, construct an adapter, or
connect a resource. Keep those values at the composition root or behind a
narrow resource; never place them in logs, message contracts, telemetry, or
general handler state.

| Store | Availability | Best fit |
| --- | --- | --- |
| Default in-memory | Included; local/test only | Deterministic local tests |
| AWS Secrets Manager | `@purista/aws-secret-store` | AWS workload identity and managed rotation |
| Azure Key Vault | `@purista/azure-secret-store` | Azure managed identity |
| Google Secret Manager | `@purista/gcloud-secret-store` | Google workload identity |
| HashiCorp Vault | `@purista/vault-secret-store` | Vault-managed policy and dynamic credentials |
| Infisical | `@purista/infisical-secret-store` | Infisical-managed environments |
| Dapr | `@purista/dapr-sdk` | Platform-owned component abstraction |

Never log resolved secret values, add them to events, or use them as telemetry attributes. Rotate a credential by changing the secret backend, then restart or refresh the application according to its configured lifecycle.

Construct the selected adapter at the composition root and pass it as
`secretStore` when the service is created:

```ts title="src/index.ts"
const service = await incidentV1Service.getInstance(eventBridge, { secretStore })
```

`getSecret(...)` is enabled by default. Store writes and removals are disabled
by default. Enable them only for a service that owns that sensitive business
lifecycle and enforce tenant/principal authorization before the operation. An
adapter package does not create a vault, policy, identity, or rotation
schedule—those are required external prerequisites that each provider page
makes explicit. The included default store does not cache reads unless enabled;
the AWS, Azure, Google Cloud, Vault, and Infisical adapters cache reads in
process by default. Set `cacheTtl` to bound reuse against the required
rotation/revocation window, or set `enableCache: false` when every authorized
read must reach the backend.

Read [Configure store operations and secret caching](/handbook/framework/configure-applications/configure-store-operations-and-secret-cache/)
before enabling writes, removal, or local caching. Those options change the
authority and secret-retention boundary; they do not replace backend policy or
rotation.

## Resolve a secret in a handler

Every command, subscription, stream, and worker receives the selected store as
`context.secrets`. A lookup accepts one or more names and returns an object
with those exact names as keys. A missing secret is `undefined`. Keep the
resolved string within the smallest possible scope: never return, log, emit,
trace, cache independently, or attach it to an error.

| Handler call | Parameters and result | Use it for |
| --- | --- | --- |
| [`context.secrets.getSecret(...)`](/handbook/api/classes/_purista_core.SecretStoreBaseClass/#getsecret) | One or more secret names; returns `{ [name]: string \| undefined }`. | Resolve the sensitive value immediately before its authorized use. |
| [`context.secrets.setSecret(name, value)`](/handbook/api/classes/_purista_core.SecretStoreBaseClass/#setsecret) | One name and a string value; returns after the adapter accepts the write. Disabled by default. | A service that owns an authorized rotation or delegated-credential lifecycle. |
| [`context.secrets.removeSecret(name)`](/handbook/api/classes/_purista_core.SecretStoreBaseClass/#removesecret) | One name; returns after the adapter removes it. Disabled by default. | An authorized revocation or cleanup workflow. |

```ts title="src/service/incident/v1/command/notifyOnCall/notifyOnCallCommandBuilder.ts"
import { z } from 'zod'
import { incidentV1ServiceBuilder } from '../../incidentV1ServiceBuilder.js'

const input = z.object({ incidentId: z.string().min(1) })
const output = z.object({ incidentId: z.string(), status: z.literal('ready') })

export const notifyOnCallCommandBuilder = incidentV1ServiceBuilder
  .getCommandBuilder('notifyOnCall', 'Checks notification delivery before work is accepted')
  .addPayloadSchema(input)
  .addOutputSchema(output)
  .setCommandFunction(async function (context, payload) {
    const secrets = await context.secrets.getSecret('notifications.deliveryApiKey')
    const deliveryApiKey = secrets['notifications.deliveryApiKey']

    if (deliveryApiKey === undefined) {
      throw new Error('Notification delivery is unavailable')
    }

    return { incidentId: payload.incidentId, status: 'ready' }
  })
```

| Declaration | What it establishes | Options, default, and failure boundary |
| --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | A service-local operation for the secret-dependent check. The stable name is the command target; the description is definition metadata. | The optional `eventName` is only for a canonical command-success event. This call does not register or execute the command; add its definition to the service aggregate. |
| [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | The validated `incidentId` input and its inferred handler type. | Optional representation values retain a preceding value or resolve to JSON and UTF-8. Invalid payloads are rejected before guard hooks or secret resolution. |
| [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | The safe readiness result that may leave this command. | Its representation arguments have the same defaults. A result that violates the schema produces an internal error; never return a resolved secret to satisfy this contract. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | The service-bound handler that can resolve the configured store through `context.secrets`. | Use a non-arrow `async function`; Core rejects arrow handlers and the definition cannot be assembled without a handler. Keep the secret scoped to the operation. |

This makes the missing-secret branch explicit while keeping the external
failure message independent from the secret name or value. For a command that
rotates or revokes a runtime-managed credential, enable the relevant operation
at the composition root and authorize the acting principal before calling
`setSecret` or `removeSecret`. A disabled operation rejects with an
unauthorized `UnhandledError`; a provider can impose stricter read-only
behavior. The
[operation and caching guide](/handbook/framework/configure-applications/configure-store-operations-and-secret-cache/)
owns the shared switches, while each provider page owns its backend policy and
capabilities.

Need a provider PURISTA does not ship? [Build a custom secret store](/handbook/framework/configure-applications/secret-stores/custom-secret-store/). Otherwise return to the [chapter overview](/handbook/framework/configure-applications/).
