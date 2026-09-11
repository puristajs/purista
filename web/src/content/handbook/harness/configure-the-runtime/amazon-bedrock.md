---
title: Configure Amazon Bedrock
description: Bind Bedrock with an AWS credential chain, explicit region, and model access policy.
order: 260
---

```sh title="Amazon Bedrock example 1"
npm install @purista/harness @purista/harness-bedrock
```
The adapter uses the AWS SDK credential chain. Configure `AWS_REGION`,
`BEDROCK_MODEL_ID`, IAM permissions, model access, and egress in deployment.

```ts title="src/createBedrockHarness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { bedrock } from '@purista/harness-bedrock'
import { z } from 'zod'

const answer = defineAgent('answer', { model: 'answering', input: z.string(), output: z.object({ answer: z.string() }), instructions: 'Answer clearly.' })
const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({ models: { answering: { provider: bedrock({ region: process.env.AWS_REGION ?? 'us-east-1' }), model: process.env.BEDROCK_MODEL_ID } } })
```
Bedrock Converse settings vary by foundation model. Verify each model's
supported inference fields, access policy, throttling, and regional behavior.
