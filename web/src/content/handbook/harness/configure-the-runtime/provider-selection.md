---
title: Choose a model provider
description: Compare first-party providers by deployment, identity, model access, and operational ownership, then configure the selected adapter.
order: 230
---

All first-party providers implement the same Harness model-provider port. This
page is the provider-neutral hub: choose an adapter here, then use its child
guide to install, configure, verify, and operate it. Agent, workflow, tool,
schema, session, and evaluation code can stay provider-neutral.

The choice changes the SDK dependency, credential boundary, endpoint, model
availability, and operational controls. It should not change the model alias
your agents use.

## Compare the first-party adapters

| Provider | Choose it when | Identity and deployment boundary | Focused guide |
| --- | --- | --- | --- |
| [OpenAI](/handbook/harness/configure-the-runtime/openai/) | Your application can call OpenAI or an OpenAI-compatible Chat Completions endpoint | Application key and approved endpoint; OpenAI Responses is an OpenAI-specific API surface | [Configure OpenAI](/handbook/harness/configure-the-runtime/openai/) |
| [Google Gemini](/handbook/harness/configure-the-runtime/google-gemini/) | Gemini models, Google API access, or a Vertex/enterprise deployment fit the workload | Application-owned Google API key or Google SDK deployment/identity configuration | [Configure Google Gemini](/handbook/harness/configure-the-runtime/google-gemini/) |
| [Anthropic](/handbook/harness/configure-the-runtime/anthropic/) | Anthropic models meet the required capability and procurement fit | Application-owned Anthropic API key and model access | [Configure Anthropic](/handbook/harness/configure-the-runtime/anthropic/) |
| [Amazon Bedrock](/handbook/harness/configure-the-runtime/amazon-bedrock/) | AWS identity, region, and enabled Bedrock models are the deployment boundary | AWS credential chain, region, IAM, and account model access | [Configure Amazon Bedrock](/handbook/harness/configure-the-runtime/amazon-bedrock/) |
| [Azure AI Foundry](/handbook/harness/configure-the-runtime/azure-ai-foundry/) | An Azure inference endpoint and Azure key or identity are required | Endpoint plus application-owned API key or Azure credential | [Configure Azure AI Foundry](/handbook/harness/configure-the-runtime/azure-ai-foundry/) |
| Application-owned gateway | No first-party adapter owns the required SDK or protocol | Application-defined SDK/HTTP client, credentials, and lifecycle | [Build a custom model provider](/handbook/harness/configure-the-runtime/custom-model-provider/) |

OpenAI-compatible endpoints use the [OpenAI adapter](/handbook/harness/configure-the-runtime/openai/) with the
provider's `baseURL`, API key, and model identifier, while retaining the
default `api: 'chat_completions'`. Do not select `api: 'responses'` merely
because an endpoint describes itself as compatible: that mode is for the
OpenAI Responses API.

## Configure the selected adapter

Follow one focused child guide in this order. Each owns its install command,
credential/identity boundary, minimal model alias, capability declaration,
verification, and production operating boundary.

1. [Configure OpenAI](/handbook/harness/configure-the-runtime/openai/) — including compatible Chat Completions endpoints.
2. [Configure Google Gemini](/handbook/harness/configure-the-runtime/google-gemini/) — Google Gemini API or the official SDK's Vertex/enterprise configuration.
3. [Configure Anthropic](/handbook/harness/configure-the-runtime/anthropic/).
4. [Configure Amazon Bedrock](/handbook/harness/configure-the-runtime/amazon-bedrock/).
5. [Configure Azure AI Foundry](/handbook/harness/configure-the-runtime/azure-ai-foundry/).
6. [Build a custom model provider](/handbook/harness/configure-the-runtime/custom-model-provider/) — only when no first-party adapter fits.

## Keep the alias stable

```ts title="src/createSupportHarness.ts"
import { defineHarness, type ModelProvider } from '@purista/harness'

export function createSupportHarness(provider: ModelProvider, model: string) {
	return defineHarness({ name: 'support' })
		.models({
			assistant: {
				provider,
				model,
				capabilities: ['object'],
			},
		})
		.build()
}
```

Pass an adapter factory result and approved model ID from the composition root;
for example, `openai(...)` or `bedrock(...)` in the focused provider guide.
Call the alias `assistant` in agents rather than placing provider SDK calls in
business logic. Provider migration then changes the composition root and its
verification plan, not every agent.

| Call or field | Runtime effect | Use it this way |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts a composition with an optional diagnostic name; omitted, it uses `agent-harness`. | Give the local runtime a stable name when the process hosts more than one Harness. The name does not select a vendor. |
| [`.models(aliases)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Retains each literal alias, provider, model identifier, and capability tuple for later fluent type checks. | Define this registry before agents or workflows. An empty map is invalid; model aliases must be real adapter capabilities, not a desired vendor feature list. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Checks the completed registry graph and produces the runnable Harness. | Build after every agent/tool/workflow registry. Unknown aliases or missing required capabilities fail at composition time rather than selecting another vendor at runtime. |

Before selecting a provider, verify its currently supported models, regions,
pricing, lifecycle, and service limits through the vendor's official
documentation. The Harness package does not guarantee vendor account access or
provider feature availability.

If no first-party package matches the required gateway, follow
[build a custom model provider](/handbook/harness/configure-the-runtime/custom-model-provider/). Do not wrap a
first-party adapter merely to rename aliases; aliases already keep agent code
provider-neutral.
