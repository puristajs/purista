---
title: Choose a model provider
description: Select a provider based on deployment, identity, model access, and operational ownership—not on agent code.
order: 230
---

All first-party providers implement the same Harness model-provider port. Agent,
workflow, tool, schema, session, and evaluation code can stay provider-neutral.
The choice changes the SDK dependency, credential boundary, endpoint, model
availability, and operational controls.

| Provider | Choose it when | Avoid it when | Enablement |
| --- | --- | --- | --- |
| OpenAI | Your application can call OpenAI or an OpenAI-compatible endpoint | Provider egress or account policy forbids it | Install adapter and configure application key/endpoint |
| Anthropic | Anthropic models meet the required capability and procurement fit | Its account/region/model access is unavailable | Install adapter and configure application key |
| Amazon Bedrock | AWS identity, region, and model access are the deployment boundary | Your workload cannot use the AWS credential chain or enabled model | Install adapter; configure region and IAM/model access |
| Azure AI Foundry | Azure endpoint and identity/key management are required | No compatible endpoint or Azure credential/key is available | Install adapter; configure endpoint plus API key or credential |

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
