---
title: Configure Google Gemini
description: Enable the Google Gemini provider adapter with application-owned Google API or Vertex configuration, then declare only the model capabilities you use.
order: 245
---

Use this adapter when the application needs Gemini models through Google's
official `@google/genai` SDK. It is a separate runtime package. The core
Harness package neither installs the SDK nor creates a Google API key, Vertex
project, IAM role, endpoint, or model entitlement.

## Enable the adapter

```sh title="Install the Google Gemini provider"
npm install @purista/harness @purista/harness-google
```

For the Gemini API, provision an application-owned `GEMINI_API_KEY`. Create
the provider at the composition root and keep the Harness alias stable:

```ts title="Configure a Google Gemini model alias"
import { defineHarness } from '@purista/harness'
import { google } from '@purista/harness-google'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
	throw new Error('GEMINI_API_KEY is required to start the Gemini Harness.')
}

const provider = google({ apiKey })

export const harness = defineHarness()
	.models({
		assistant: {
			provider,
			model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
			capabilities: ['object'],
		},
	})
	.build()
```

The `google(...)` factory also accepts the official `GoogleGenAIOptions` for a
Vertex or enterprise deployment. Keep project, location, identity, endpoint,
and network setup in application configuration, and follow the current Google
SDK documentation for that deployment shape. Harness aliases and agents remain
the same after that composition-root change.

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness(options)`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the application-local Harness composition root. Its optional `name` defaults to `agent-harness` and identifies Harness diagnostics only. | Give it a stable name when multiple Harnesses share a process. It does not select a Gemini model or authenticate with Google. |
| [`google(options)`](/handbook/api/functions/_purista_harness-google.google/) | Creates a Gemini `ModelProvider` using the official Google SDK. `apiKey` and other supported Google SDK options remain at the application boundary. | Install the adapter before importing it. `client` is only for a controlled test or an application-owned transport wrapper. A missing key, bad Vertex configuration, unavailable endpoint, or denied model access must fail startup or the request; do not silently choose another provider. |
| `harnessTimeoutMs` | Optional adapter-specific model-call timeout. Otherwise the provider inherits the registered Harness model timeout. | Prefer the [common Harness defaults](/handbook/harness/configure-the-runtime/configuration-and-model-settings/) unless this alias needs a narrower external boundary. Cancellation stops cooperative waiting; it cannot undo an already-started tool side effect. |
| [`.models({ assistant: ... })`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the stable alias, selected Google model identifier, and allowed operations. | Start with `object` for the schema-bounded path. Add each capability only after verifying the exact model and Google deployment supports it. An empty alias map is rejected. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the completed registries and creates the runnable Harness. | Build after every model, tool, skill, agent, and workflow registry it depends on. Missing aliases and capability/reference mismatches fail before a provider call. |

## Configure Gemini generation per model

The adapter puts the typed Harness settings in the Google SDK `config` object.
The API publishes defaults and which settings a model allows in its model
metadata, so omit a value when the deployment should keep that model default.

```ts title="src/createGeminiHarness.ts"
export const harness = defineHarness({ name: 'support' })
	.models({
		assistant: {
			provider,
			model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
			capabilities: ['object', 'tool_use'],
			defaults: {
				maxTokens: 700,
				stopSequences: ['\n--- end ---'],
			},
		},
	})
	.build()
```

| Harness field | Gemini SDK request field | Compatibility guidance |
| --- | --- | --- |
| `maxTokens` | `config.maxOutputTokens` | The maximum and default vary by model. Check the selected model metadata instead of copying a limit between Gemini families. |
| `temperature` | `config.temperature` | Gemini documents a model-dependent range and default. Gemini 3.x guidance recommends keeping its default unless you have measured the change for the workload. |
| `topP` | `config.topP` | Use only when the model exposes it. Do not tune it together with `temperature` by default. |
| `stopSequences` | `config.stopSequences` | Google limits the collection and can reject unsupported/model-specific use. Treat it as an output-format boundary, not an authorization control. |
| `parallelToolCalls` | The adapter applies Google function-calling configuration when it is `false`. | It is not a provider-wide parallel-tool switch. Verify the exact function-calling behavior for the model. |

For a Gemini-only setting, use the nested `config` escape hatch. The following
example is valid only when the selected model exposes `topK`:

```ts title="src/createGeminiHarness.ts"

const assistantModelOptions = {
	defaults: {
		maxTokens: 700,
		providerOptions: {
			config: {
				topK: 40,
			},
		},
	},
}
```

Do not duplicate a typed setting such as `maxTokens` inside `config`; the
adapter applies the typed setting after that raw object. Google’s
[GenerateContent configuration reference](https://ai.google.dev/api/generate-content)
states explicitly that not every parameter is configurable for every model;
its [model-parameter guidance](https://ai.google.dev/gemini-api/docs/prompting-strategies)
also explains the Gemini 3.x sampling recommendation.

## Declare the capability you actually use

The adapter maps text and structured output, streaming, application function
tools, embeddings, and supported inline image, audio, and file parts. It does
not provide reranking. The adapter cannot establish what an individual Gemini
model or endpoint has enabled, so the model alias remains the source of truth.

| Needed operation | Add this Harness capability | Adapter support |
| --- | --- | --- |
| Generate text | `text` | Supported |
| Stream text | `text_stream` | Supported |
| Return or stream a schema-bounded object | `object` or `object_stream` | Supported |
| Let the agent call application tools | `tool_use` | Supported through Google function declarations |
| Send inline image, audio, or file data | `vision_input`, `audio_input`, or `file_input` | Supported when the selected model and Google deployment accept that input |
| Create vectors | `embeddings` | Supported; use a separate alias when the embedding model differs |
| Rank retrieved documents | `rerank` | Not provided by this adapter |

For example, an application that needs a tool-using multimodal assistant and a
separate embedding alias can share one provider instance:

```ts title="Register Gemini generation and embedding aliases"
const harness = defineHarness()
	.models({
		assistant: {
			provider,
			model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
			capabilities: ['object', 'tool_use', 'vision_input'],
		},
		embeddings: {
			provider,
			model: process.env.GEMINI_EMBEDDING_MODEL ?? 'gemini-embedding-2',
			capabilities: ['embeddings'],
		},
	})
	.build()
```

API reference: [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/),
[`HarnessBuilder.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models), and
[`HarnessBuilder.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build).

Remote image and file URLs are forwarded as Google file URIs. They must use a
scheme and storage location the selected Google API and model accept. The
adapter does not upload a local sandbox file; use supported inline data for
small application-owned content or upload the file in application code first.

## Verify and operate

Run the [first agent](/handbook/harness/start/build-the-first-agent/) with a
bounded input, output schema, and timeout. A successful result is a
schema-valid object with provider/model usage metadata when Google supplies it.
Use a fake `ModelProvider` for routine agent tests; reserve credentialed Gemini
or Vertex smoke checks for a controlled integration environment.

Before production, verify the selected model's capability, availability,
regional/endpoint access, quota, pricing, data handling, and lifecycle in
Google's current documentation. Network egress, API-key rotation, workload
identity, model access, and cost controls remain application and platform
responsibilities.

Return to [choose a model provider](../provider-selection/) to compare the
other first-party adapters, or continue with
[build the first agent](/handbook/harness/start/build-the-first-agent/).
