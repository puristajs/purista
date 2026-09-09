---
title: Configure Azure AI Foundry
description: Bind an Azure AI Foundry deployment to a stable Harness model alias.
order: 265
---

Install the adapter and configure an endpoint, deployment, API key or Azure
credential, and network policy in the application environment.

```sh title="Azure Ai Foundry example 1"
npm install @purista/harness @purista/harness-azure-foundry
```
```ts title="src/createAzureHarness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { azureFoundry } from '@purista/harness-azure-foundry'
import { z } from 'zod'

const answer = defineAgent('answer', { model: 'primary', input: z.string(), output: z.object({ answer: z.string() }), instructions: 'Answer clearly.' })
const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({ model: { provider: azureFoundry({ endpoint: process.env.AZURE_AI_ENDPOINT, apiKey: process.env.AZURE_AI_API_KEY }), model: process.env.AZURE_AI_DEPLOYMENT } })
```
Deployment capabilities and API settings are Azure-owned. Verify structured
output, tools, streaming, embeddings, and retries against the exact deployment.
