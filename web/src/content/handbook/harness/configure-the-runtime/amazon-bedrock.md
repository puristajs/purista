---
title: Configure Amazon Bedrock
description: Use the Bedrock adapter with an AWS credential chain, explicit region, and application-owned model access policy.
order: 260
---

Use Bedrock when AWS identity, network controls, and enabled Bedrock models are
the intended deployment boundary. The adapter uses the AWS SDK credential chain;
the Harness does not create IAM permissions or enable a model for an account.

## Enable the adapter

```sh title="Install the Bedrock provider"
npm install @purista/harness @purista/harness-bedrock zod
```

```ts title="Configure a Bedrock model alias"
import { defineHarness } from '@purista/harness'
import { bedrock } from '@purista/harness-bedrock'

const model = process.env.BEDROCK_MODEL_ID
if (!model) {
  throw new Error('BEDROCK_MODEL_ID is required to start the Bedrock Harness.')
}

export const harness = defineHarness()
  .models({
    assistant: {
      provider: bedrock({ region: process.env.AWS_REGION ?? 'us-east-1' }),
      model,
      capabilities: ['object'],
    },
  })
  .build()
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness(options)`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the local composition root. `name` is optional and defaults to `agent-harness`; it labels Harness diagnostics only. | Name a Harness when its traces and failures must be separated from another local Harness. It does not configure AWS identity or select a Bedrock model. |
| [`bedrock(options)`](/handbook/api/functions/_purista_harness-bedrock.bedrock/) | Creates the AWS Bedrock runtime provider. `region` and the other supported AWS client configuration remain application-owned; the normal AWS credential chain resolves the workload identity. | An injected `client` is for controlled tests or transport customization. Do not encode access keys in agent code. Region, credentials, model access, and egress failures are AWS deployment failures, not a reason to choose a fallback model silently. |
| `harnessTimeoutMs` | Optional adapter-specific model-call timeout. Otherwise the registered Harness model timeout is used. | Use the global timeout for one consistent policy; narrow this alias only when its expected provider latency needs a different limit. |
| [`.models({ assistant: ... })`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the provider alias, Bedrock model identifier, and operations agents may request. | `object` enables the shown schema-bounded result. Add tool or stream capabilities only after verifying the intended Bedrock model and account access support them. An empty alias map is invalid. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the registered composition and returns a runnable Harness. | Build after every registry it depends on. It fails before a request if an agent asks for an unknown alias or an undeclared capability. |

## Provision before running

1. Configure the standard AWS SDK credential chain for the workload identity.
2. Select a region where the intended model is available.
3. Grant least-privilege permission for the model operation and verify account
   model access.
4. Set `BEDROCK_MODEL_ID` from deployment configuration, not agent code.

## Verify and operate

Run one schema-bounded invocation, then inspect application telemetry for the
provider/model outcome without recording content. If credential resolution,
region, network policy, or model access fails, fix the AWS application boundary;
do not substitute a different provider without an explicit deployment decision.

Use a fake provider for normal tests. Before production, confirm the model's
regional availability, account entitlements, quotas, and lifecycle in current
AWS documentation.
