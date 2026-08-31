---
title: Configure the first model
description: Register one provider behind a stable model alias before defining an agent.
order: 30
---

A model alias separates application behavior from a provider SDK. Agents refer
to `assistant`; the composition root decides which provider, model, credentials,
and declared capabilities back that alias.

```ts title="src/harness.ts"
import { defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
	throw new Error('OPENAI_API_KEY is required to start the support Harness.')
}

export const harness = defineHarness({ name: 'support' })
	.models({
		assistant: {
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
			capabilities: ['object'],
		},
	})
	// Agents are added next.
	.build()
```

`object` permits structured object generation. Declare only operations that the
selected model and adapter actually support. The builder validates an agent's
requirements before a run begins; claiming unsupported capabilities defers a
failure until the relevant operation is used.

| Call or field | Purpose | Choose it when |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates this named composition root. | The name is useful in diagnostics; it is not a provider or model selector. |
| [`.models(aliases)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers provider-backed aliases for later definitions. | Register it before agent definitions; the alias key becomes the typed `model` value an agent may select. |
| [`provider`](/handbook/api/interfaces/_purista_harness.ModelAlias/#provider) | Supplies the adapter that makes calls. | Install and configure the adapter before this import; missing credentials should stop startup. |
| [`model`](/handbook/api/interfaces/_purista_harness.ModelAlias/#model) | Names the provider model for this standalone Harness runtime. | Keep it in composition, so agents remain independent of provider SDK names. |
| [`capabilities`](/handbook/api/interfaces/_purista_harness.ModelAlias/#capabilities) | Declares operations Harness may request. | Add only the operations this model and adapter implement. `object` fits the next schema-validated agent. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the assembled runtime. | It is safe here for an alias-only configuration; add agents before attempting a useful session call. |

For retries, provider options, all capabilities, and run-wide budgets, use
[configuration and model settings](/handbook/harness/configure-the-runtime/configuration-and-model-settings/).

## Keep provider details at the composition root

| Put here | Keep out of agents and workflows |
| --- | --- |
| Provider factory, key or identity, endpoint, region, model identifier | SDK client construction, provider-specific model names, credentials |

This lets the same agent use Anthropic, Bedrock, Azure AI Foundry, or a custom
provider later. See [provider selection](/handbook/harness/configure-the-runtime/provider-selection/)
before making that change.

## Verify the alias

Continue with [Build the first agent](/handbook/harness/start/build-the-first-agent/). A schema-valid
result verifies the alias, credentials, and selected model together. For a
deterministic test, inject a fake `ModelProvider` instead of a live adapter.
