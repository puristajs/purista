---
title: Configure Azure AI Foundry
description: Enable the Azure AI Foundry adapter with an endpoint and either an API key or Azure credential.
order: 270
---

Use Azure AI Foundry when an Azure inference endpoint and Azure identity or key
management form the provider boundary. The adapter requires an endpoint plus an
API key or credential unless an application injects a client for tests.

## Enable the adapter

```sh title="Install the Azure AI Foundry provider"
npm install @purista/harness @purista/harness-azure-foundry zod
```

The adapter can use an API key without another application package. For a
managed identity, install the Azure identity implementation as well:

```sh title="Install managed-identity support"
npm install @azure/identity
```

```ts title="Configure an Azure AI Foundry model alias"
import { defineHarness } from '@purista/harness'
import { azureFoundry } from '@purista/harness-azure-foundry'

const endpoint = process.env.AZURE_AI_ENDPOINT
const apiKey = process.env.AZURE_AI_API_KEY
const model = process.env.AZURE_AI_MODEL
if (!endpoint || !apiKey || !model) {
  throw new Error('AZURE_AI_ENDPOINT, AZURE_AI_API_KEY, and AZURE_AI_MODEL are required.')
}

export const harness = defineHarness()
  .models({
    assistant: {
      provider: azureFoundry({
        endpoint,
        apiKey,
      }),
      model,
      capabilities: ['object'],
    },
  })
  .build()
```

For a managed Azure identity, pass an Azure `credential` instead of `apiKey`:

```ts title="src/azureFoundryProvider.ts"
import { DefaultAzureCredential } from '@azure/identity'
import { azureFoundry } from '@purista/harness-azure-foundry'

const endpoint = process.env.AZURE_AI_ENDPOINT
if (!endpoint) {
  throw new Error('AZURE_AI_ENDPOINT is required to create the Azure AI provider.')
}

export const provider = azureFoundry({
  endpoint,
  credential: new DefaultAzureCredential(),
})
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness(options)`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the application-local composition root. Its optional `name` defaults to `agent-harness` and is used for Harness diagnostics. | Set a name to distinguish multiple Harness instances; it does not configure Azure identity, endpoint, or deployment. |
| [`azureFoundry(options)`](/handbook/api/functions/_purista_harness-azure-foundry.azureFoundry/) | Creates an Azure AI Foundry provider. It needs an `endpoint` unless a complete `client` is injected. | Use `client` only for a controlled test/custom-transport boundary; it intentionally bypasses endpoint/key construction. |
| `apiKey` or `credential` | `apiKey` authenticates with `AzureKeyCredential`; `credential` accepts an Azure token/key credential. When a `credential` or `client` is present, the adapter ignores `apiKey`. | Use exactly one identity strategy per deployment. A managed identity avoids distributing a static key, but still requires Azure role and network configuration. |
| `harnessTimeoutMs` | Optional model-call timeout for this provider; otherwise the adapter inherits the Harness model timeout. | Keep it below the overall run timeout. A timeout stops the waiting operation but does not reverse an already-started remote effect. |
| [`.models({ assistant: ... })`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the alias, deployment/model identifier, and capabilities for later agents. | `object` is sufficient for the illustrated structured response. Add tools, text, streaming, or embeddings only when the exact endpoint and deployment support them. An empty alias map is rejected. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates completed registries and produces the runnable Harness. | Build after the selected agent/tool/workflow registries. Missing aliases and capability/reference mismatches fail before a provider call. |

The adapter rejects construction without an endpoint and either key or
credential when no client is injected. Keep exactly one identity strategy per
deployment environment; do not silently fall back from a managed identity to a
developer key.

## Verify and operate

Use one bounded schema-validated invocation to verify endpoint, identity/key,
network access, and model deployment. Do not put endpoint URLs or keys in agent
instructions, tool output, or telemetry content.

Production ownership remains with the application and Azure platform: endpoint
access, identity roles, private networking, key rotation, quota/cost policy,
and data residency. Test the agent with an injected fake provider; reserve live
endpoint checks for controlled integration or smoke environments.
