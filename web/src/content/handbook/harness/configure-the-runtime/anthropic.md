---
title: Configure Anthropic
description: Enable the Anthropic provider adapter and keep API credentials and model selection in the application composition root.
order: 250
---

Use this adapter when Anthropic is the approved model provider for the
application. It is separately installed and makes external SDK calls from your
application process.

## Enable the adapter

```sh title="Install the Anthropic provider"
npm install @purista/harness @purista/harness-anthropic zod
```

Provide an application-owned `ANTHROPIC_API_KEY` and register a stable alias:

```ts title="Configure an Anthropic model alias"
import { defineHarness } from '@purista/harness'
import { anthropic } from '@purista/harness-anthropic'

const apiKey = process.env.ANTHROPIC_API_KEY
const model = process.env.ANTHROPIC_MODEL
if (!apiKey || !model) {
  throw new Error('ANTHROPIC_API_KEY and ANTHROPIC_MODEL are required.')
}

export const harness = defineHarness()
  .models({
    assistant: {
      provider: anthropic({ apiKey }),
      model,
      capabilities: ['object'],
    },
  })
  .build()
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness(options)`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the application-local Harness composition root. Its optional `name` defaults to `agent-harness` and identifies diagnostics, not an Anthropic account or model. | Give it a stable application name when multiple Harnesses share a process; keep provider selection in this adapter configuration. |
| [`anthropic(options)`](/handbook/api/functions/_purista_harness-anthropic.anthropic/) | Creates an Anthropic-backed `ModelProvider`; `apiKey` and the remaining supported Anthropic SDK client options stay in the application composition root. | Install the adapter before import and fail startup when the selected deployment requires an API key that is absent. `client` is only for an explicitly injected test or custom-transport client. |
| `harnessTimeoutMs` | Optional adapter-specific model-call timeout. Without it, the adapter inherits the registered Harness model timeout (or the SDK `timeout` option when supplied). | Prefer the common Harness default unless this alias has a stricter provider budget. A timeout cancels cooperative waiting; it does not undo a tool side effect already started by an agent. |
| [`.models({ assistant: ... })`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers a stable Harness alias, the provider-facing model identifier, and capabilities used by later agents. | Keep the alias in agent definitions while deployment selects `model`. `object` is the smallest capability for the shown structured path; declare tools or streams only after the selected model supports the requested operation. An empty alias map is rejected. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates all registered aliases and the later agent/tool/workflow references, then returns the runnable Harness. | Build only after the needed registries are in place. A missing alias, unsupported capability, or invalid reference fails before the first invocation. |

Replace `ANTHROPIC_MODEL` with an approved model identifier from your
application configuration. Do not claim a capability merely because another
provider supports it; declare only capabilities verified for this model and
adapter.

## Verify and harden

Invoke the [first agent](/handbook/harness/start/build-the-first-agent/) with a bounded
input, output schema, and timeout. A fake `ModelProvider` exercises the same
agent in routine tests without an API key.

For production, control network egress, key rotation, model access, rate/cost
budgets, and data residency outside the adapter. The Harness normalizes typed
results and telemetry; it does not provision the Anthropic account or replace
your application data policy.
