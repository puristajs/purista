---
title: Build and mount the first agent
description: Create the smallest service-owned agent, add it to a Harness, mount it, and bind one model.
order: 392
---

Start with an existing service. The project-local CLI creates an agent under
that service version and adds it to the service-owned Harness:

```bash title="Create an internal agent"
npm run add:agent -- answer-support-question --model-alias answering \
  --service support \
  --service-version 1 \
  --description "Answer a support question"
```

`--http` defaults to `none`, so this command creates no route. Use
`--http command` for a protected request/response wrapper or `--http stream`
for a protected AI SDK UI Message Stream v1 wrapper.

## 1. Define the smallest agent

Keep the definition with the service version that owns it. Use lower camel
case for the stable agent id.

```ts title="src/service/support/v1/harness/agent/answerSupportQuestion/answerSupportQuestionAgent.ts"
import { defineAgent } from '@purista/harness'

export const answerSupportQuestionAgent = defineAgent('answerSupportQuestion', {
	model: 'answering',
	description: 'Answer a support question',
	instructions: 'Answer one support question clearly and briefly.',
})
```

Without `input`, `output`, or `prompt`, this agent accepts a string, returns a
string, and uses the input as its user message. The explicit `answering` alias
states which application model role it needs. Harness does not provide reserved
aliases. Add schemas and capabilities later when the application needs their
guarantees.

Do not put credentials, providers, tenant identity, or HTTP values in the
agent definition.

## 2. Add the agent to the Harness

```ts title="src/service/support/v1/harness/supportHarness.ts"
import { defineHarness } from '@purista/harness'
import { answerSupportQuestionAgent } from './agent/answerSupportQuestion/answerSupportQuestionAgent.js'

export const supportHarness = defineHarness({ name: 'support' })
	.addAgent(answerSupportQuestionAgent)
```

Every agent added as a root receives a service address when mounted. The
Harness definition is portable: it still has no provider credentials or live
resources. Nested dependency agents stay private unless they are also added as
roots.

## 3. Mount the Harness once

```ts title="src/service/support/v1/supportV1Service.ts"
export const supportV1Service = supportV1ServiceBuilder
	.mountHarness(supportHarness)
```

[`mountHarness(definition, policy?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
records the graph and gives each added root an address. A service accepts one
Harness mount. Add a target policy later when a root needs business guards,
success events, queue delivery, or durable resume behavior.

## 4. Bind the model alias at startup

```ts title="src/index.ts"
import { openai } from '@purista/harness-openai'

const support = await supportV1Service.getInstance(eventBridge, {
	ai: {
		models: {
			answering: {
				provider: openai({ apiKey: process.env.OPENAI_API_KEY }),
				model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
			},
		},
	},
})
```

The `ai.models.answering` key matches the alias declared by the agent. The inner
`model` value is the provider-specific model ID. The
service's inferred instance configuration requires every model alias and
adapter capability used by its mounted graph.

The provider package and credentials belong to the application composition
root. Validate environment variables before creating the service and never
write a credential value into source.

At this point the agent has a PURISTA address, but no HTTP route. The next page
adds a typed command for an aggregate result and a stream for progressive UI
events: [invoke and expose a mounted agent](/handbook/framework/build-ai-powered-services/invoke-and-expose-a-harness-target/).
