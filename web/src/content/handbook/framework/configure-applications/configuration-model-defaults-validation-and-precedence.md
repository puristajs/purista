---
title: Configuration defaults, validation, and precedence
description: Validate service-instance settings at composition time and retrieve changing non-secret values explicitly through the runtime configuration store.
order: 501
---

PURISTA has two deliberately different configuration paths. A service config
schema validates the stable settings supplied when a service instance is
created. A `ConfigStore` is an explicit runtime lookup for non-secret values
that may differ across deployments or change independently. Neither path is a
secret store.

| Need | Use | When it is resolved |
| --- | --- | --- |
| Validated service behavior, such as a retry limit | `ServiceBuilder.setConfigSchema(...)`, optional `setDefaultConfig(...)`, and `getInstance(..., { serviceConfig })` | Service creation |
| Environment-owned non-secret value, such as an email-provider URL | `context.configs.getConfig(...)` | Handler/runtime execution |
| Token, private key, or password | `context.secrets.getSecret(...)` | Handler/runtime execution |

## Validate stable service settings at startup

Defaults are appropriate only when the same value is safe across environments.
The schema is parsed when the service instance is created, before any command,
subscription, worker, or stream handler uses it.

```ts title="src/service/incident/v1/incidentServiceConfig.ts"
import { z } from 'zod'

export const incidentServiceV1ConfigSchema = z.object({
  escalationAfterMinutes: z.number().int().min(1).max(1_440).default(30),
  notifyOnCall: z.boolean().default(true),
})
```

```ts title="src/service/incident/v1/incidentV1ServiceBuilder.ts"
import { ServiceBuilder } from '@purista/core'
import { incidentServiceInfo } from './incidentServiceInfo.js'
import { incidentServiceV1ConfigSchema } from './incidentServiceConfig.js'

export const incidentV1ServiceBuilder = new ServiceBuilder(incidentServiceInfo)
  .setConfigSchema(incidentServiceV1ConfigSchema)
  .setDefaultConfig({ escalationAfterMinutes: 30, notifyOnCall: true })
```

```ts title="src/index.ts"
const incidentService = await incidentV1Service.getInstance(eventBridge, {
  serviceConfig: { escalationAfterMinutes: 15, notifyOnCall: true },
})
```

The schema makes `serviceConfig` type-safe on this fluent builder. At runtime,
the builder uses this precedence:

1. [`setDefaultConfig(config)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setdefaultconfig) supplies a complete service-owned baseline.
2. [`getInstance(eventBridge, { serviceConfig })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) overlays the instance's explicit values.
3. [`setConfigSchema(schema)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setconfigschema) parses that merged object; schema defaults fill absent or `undefined` fields and schema validation rejects invalid values.

| Call | Parameters and choice | Runtime effect and failure |
| --- | --- | --- |
| [`setConfigSchema(schema)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setconfigschema) | One schema whose output is an object. Use it whenever a service has configuration that changes behavior. | Infers the `serviceConfig` shape for `getInstance(...)`; invalid merged values reject instance creation and service start with validation issues. |
| [`setDefaultConfig(config)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setdefaultconfig) | One complete value that satisfies the schema's parsed output. Use it for an application-owned baseline that callers commonly override per instance. | Is merged before `serviceConfig`. Prefer schema defaults when a value is inherent to the contract; prefer this call when the composition owner chooses the baseline. |
| [`getInstance(eventBridge, { serviceConfig })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | A started EventBridge and optional runtime bindings. `serviceConfig` is available only after `setConfigSchema(...)`. | Validates the merged configuration before returning the service. `start()` validates it again before registering the service. |

Invalid instance configuration should stop startup or readiness, not fall back
to an unsafe value. There is no hidden precedence between a config store and
the `serviceConfig` object: they are different APIs with different lifecycles.

## Read a changing non-secret and its credential explicitly

This subscription reads the provider URL from the configured `ConfigStore` and
the API token from the configured `SecretStore`. Keep the names stable and
deployment-owned; do not copy either value into an event, log, metric, or trace.

```ts title="src/service/email/v1/subscription/sendWelcomeEmail/sendWelcomeEmailSubscriptionBuilder.ts"
import { z } from 'zod'
import { emailV1ServiceBuilder } from '../../emailV1ServiceBuilder.js'

const userRegisteredPayloadSchema = z.object({
  email: z.string().email(),
})

const emailProviderSettingsSchema = z.object({
  emailProviderUrl: z.string().url(),
})

export const sendWelcomeEmailSubscriptionBuilder = emailV1ServiceBuilder
  .getSubscriptionBuilder('sendWelcomeEmail', 'Send a welcome email')
  .subscribeToEvent('user.registered')
  .addPayloadSchema(userRegisteredPayloadSchema)
  .setSubscriptionFunction(async function (context, payload) {
    const config = await context.configs.getConfig('emailProviderUrl')
    const settings = emailProviderSettingsSchema.parse(config)
    const secrets = await context.secrets.getSecret('emailProviderAuthToken')

    if (secrets.emailProviderAuthToken === undefined) {
      throw new Error('Email provider configuration is unavailable.')
    }

    await fetch(settings.emailProviderUrl, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secrets.emailProviderAuthToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ recipient: payload.email, template: 'welcome' }),
    })
  })
```

The subscription declaration and handler each have a distinct job:

| Call or context member | Parameters/options | Why it belongs here |
| --- | --- | --- |
| [`getSubscriptionBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getsubscriptionbuilder) | A non-empty local subscription name and human-readable description. | Creates a subscription definition scoped to the service's declared resources and metrics. |
| [`subscribeToEvent(eventName, serviceVersion?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#subscribetoevent) | Required event name; optional producer service version. | Routes only that event name. Specify a version when the subscription must not accept another producer contract version. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addpayloadschema) | The incoming event payload schema; content type and encoding default to `application/json` and `utf-8`. | Validates input and infers `payload` for the handler. It does not validate values later read from a store. |
| [`setSubscriptionFunction(handler)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction) | The implementation must be a `function`, not an arrow function, so PURISTA can bind its service receiver. | Runs after the subscription input is validated. The handler receives trusted runtime context and the typed payload. |
| [`context.configs.getConfig(...names)`](/handbook/api/classes/_purista_core.ConfigStoreBaseClass/#getconfig) | One or more names; returns an object keyed by those names with `unknown` values or `undefined`. | Resolves a non-secret value at execution time. Parse it before use because a service config schema cannot type a generic store result. |
| [`context.secrets.getSecret(...names)`](/handbook/api/classes/_purista_core.SecretStoreBaseClass/#getsecret) | One or more names; returns an object keyed by those names with string values or `undefined`. | Resolves the credential immediately before the authorized external call. Never return, emit, log, or trace it. |

When `configStore` or `secretStore` is omitted from `getInstance(...)`, Core
creates included in-memory defaults. They are development/test placeholders;
the config store warns and its read operation is enabled while writes/removals
are disabled by default. Pass a configured production adapter at the
composition root before relying on shared configuration or secret protection.
The [configuration-store](/handbook/framework/configure-applications/configuration-stores/)
and [secret-store](/handbook/framework/configure-applications/secret-stores/)
guides own adapter installation, provisioning, and operation enablement.

## Test both boundaries

Test service config with valid, missing, and invalid `getInstance(...)` input.
Test runtime lookups with a controlled store that returns the needed names,
missing values, and a safe failure. This proves deterministic application flow;
adapter-specific connectivity, identity, and rotation belong in the selected
store's integration tests and deployment checks.

Next: choose a [configuration store](/handbook/framework/configure-applications/configuration-stores/)
and a [secret store](/handbook/framework/configure-applications/secret-stores/).
