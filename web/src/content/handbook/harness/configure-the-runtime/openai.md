---
title: Configure OpenAI
description: Enable the OpenAI provider adapter, choose the API surface, and verify one bounded model call.
order: 240
---

Use this adapter when the application may make outbound calls through the OpenAI
SDK or an OpenAI-compatible endpoint. It is a separate runtime package; the
core Harness package does not install or configure it.

## Enable the adapter

```sh title="Install the OpenAI provider"
npm install @purista/harness @purista/harness-openai zod
```

Provision an application-owned `OPENAI_API_KEY`, then register the provider:

```ts title="Configure an OpenAI model alias"
import { defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is required to start the Harness.')
}

export const harness = defineHarness()
  .models({
    assistant: {
      provider: openai({
        apiKey,
        // baseURL: process.env.OPENAI_BASE_URL, // for a compatible endpoint
      }),
      model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
      capabilities: ['object'],
    },
  })
  .build()
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness(options)`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates this application-local Harness composition root. With no `name`, diagnostics use `agent-harness`; this provider page can leave it unnamed when one Harness is obvious. | Set a stable name when the process runs more than one Harness or when telemetry must distinguish them. It does not select an OpenAI model or establish credentials. |
| [`openai(options)`](/handbook/api/functions/_purista_harness-openai.openai/) | Creates the OpenAI `ModelProvider`. `apiKey` is passed to the OpenAI SDK; optional SDK client options such as `baseURL` support an approved compatible endpoint. `client` is an injected test/custom-transport boundary. | Install this package in application runtime dependencies before importing it. An omitted key can be valid only when the SDK is deliberately configured from the deployment environment; this guide validates it explicitly so a missing secret stops startup. |
| `api` | `chat_completions` is the default; `responses` selects the Responses API. | Choose `responses` for compatible reasoning/tool behaviour. Keep the default for a normal chat-completions or compatible endpoint path. A provider API choice is composition configuration, not an agent instruction. |
| `harnessTimeoutMs` | Optional adapter-level model-call timeout; otherwise the adapter inherits the registered Harness model timeout (or the SDK `timeout` when supplied). | Prefer [Harness defaults](/handbook/harness/configure-the-runtime/configuration-and-model-settings/) for a uniform run budget. Use this only when this alias needs a narrower provider boundary. |
| [`.models({ assistant: ... })`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the alias, concrete provider-facing `model` identifier, and declared capabilities for later agents. | Keep `assistant` stable in agent definitions. `capabilities: ['object']` permits schema-bounded object calls only; add text, streaming, or tools only after the chosen model and agent need them. An empty alias map fails immediately. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the completed registries and returns the runnable Harness. | Build after models and any tools, skills, agents, or workflows they reference. It rejects a missing model alias or an agent capability/reference mismatch before the first request. |

## Choose the API surface

| API option | Use when | Important consequence |
| --- | --- | --- |
| Default Chat Completions | A compatible endpoint or normal chat-completions flow is required | Broad compatibility |
| `api: 'responses'` | An OpenAI reasoning model needs function tools with reasoning effort | The adapter preserves response output items for the next reasoning turn |

For a stateless Responses flow that replays reasoning items, configure the
provider request options as documented by OpenAI: `store: false` and
`include: ['reasoning.encrypted_content']`. Verify that behavior against the
current OpenAI API documentation before production rollout.

## Verify and operate

Run the [first agent](/handbook/harness/start/build-the-first-agent/) with a bounded timeout.
The expected evidence is a schema-valid object and provider/model token metadata
where the provider supplies it. Test normal code with a fake provider; keep a
credentialed smoke check outside routine CI. Apply egress, key rotation, rate
limit, and cost controls at the application/deployment boundary.

If Chat Completions receives tools plus `providerOptions.reasoning_effort`, the
adapter drops that option and warns because the API rejects the combination. Use
the Responses API when that model behavior is required.
