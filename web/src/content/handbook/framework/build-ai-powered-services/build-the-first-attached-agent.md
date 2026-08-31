---
title: Build the first attached agent
description: Generate or define a small attached agent, register all of its Framework projections, bind a compatible runtime, and verify a typed result.
order: 392
---

This page produces a small, aggregate ticket-triage result. The example keeps
the business contract in the service and uses a Harness-backed execution only
for the model call.

## Prerequisites

- A versioned service builder exists. See [Services](/handbook/framework/build-services/services/).
- `@purista/core` is installed. The attached-agent builder owns the typed
  contract; your application does **not** need to import a transitive
  `@purista/harness` dependency directly.
- A live provider is **not** configured by default. Install the provider package
  your application selects, provision its credentials through your
  secret/environment setup, then bind its provider instance in `getInstance`.
  Provider installation alone does not enable a model.

For the OpenAI example on this page, add the separate adapter package and
provision `OPENAI_API_KEY` before starting the service:

```sh title="Install the OpenAI runtime adapter"
npm install @purista/harness-openai
```

Generate the service-owned files if you started from a PURISTA project. The CLI
prompts for the required description when it is not passed:

```bash title="Generate a support triage agent"
npm run add:agent -- triage-ticket --service Support --service-version 1
```

The generator creates the builder, a deterministic test, an export, and adds
the awaited definition to the selected service. A handwritten agent follows
the same implementation order:

1. Declare the model alias and only the capabilities the agent needs.
2. Declare the request and final-result schemas.
3. Attach the Harness agent using that already-declared model alias.
4. Register the generated definitions with the service.
5. Bind the actual provider for that alias when the service is instantiated.

## 1. Declare the model requirement

`addModel` names a model requirement; it does not create a provider connection
or read credentials. The alias must be declared before `setHarnessAgent`, and
the inline agent definition can select only an alias the builder already knows.

| Capability | Declare it when the agent needs | Do not declare it for |
| --- | --- | --- |
| `text` | One bounded plain-text result. | A schema-validated object or live text connection. |
| `text_stream` | Incremental plain-text chunks over a live connection. | A caller that needs only one final text result or a disconnect-safe result. |
| `object` | One schema-validated object, such as the triage classification. | A text-only answer or incremental structured chunks. |
| `object_stream` | Incremental structured output from a provider that supports it. | A final object without progressive structured updates. |
| `tool_use` | The model may call declared Framework/Harness tools. | Tool-free classification or summarization. |
| `vision_input` | The prompt includes an explicitly authorized image. | Text, audio, or files without an image. |
| `audio_input` | The prompt includes explicitly authorized audio. | Text, images, or files without audio. |
| `file_input` | The prompt includes an explicitly authorized file. | A file the service has not scanned, authorized, and prepared for the provider. |
| `embeddings` | The handler generates vectors for retrieval, similarity, or indexing. | The default agent loop when it does not perform vector work. |
| `rerank` | The handler reranks a supplied candidate set. | A request that has no candidate set to order. |

The triage agent returns a structured object, so its declared capability set is
`['object']`. The service startup check compares this set with the bound
provider capabilities.

`addModel(alias, options)` creates a named capability requirement. The agent
definition references that requirement through `model: alias`; here,
`model: 'primary'` resolves the `primary` entry. The service composition root
supplies the provider and concrete model identifier in `ai.models.primary`.
This lets the same service definition run with a compatible model selected for
each environment without changing its business contract.

## 2. Define the schemas and attached agent

The model binding is declared before the attached Harness definition that
references its alias.

```ts title="src/service/support/v1/agent/triageTicket/triageTicketAgentBuilder.ts"
import { z } from 'zod'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

const input = z.object({ ticketId: z.string(), text: z.string().min(1).max(4_000) })
const output = z.object({ priority: z.enum(['low', 'normal', 'high']), reason: z.string() })

export const triageTicketAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets by urgency')
	.addPayloadSchema(input)
	.addOutputSchema(output)
	.addModel('primary', { capabilities: ['object'] })
	.setHarnessAgent({
		model: 'primary',
		input,
		output,
		instructions: 'Classify the ticket urgency and return the declared object.',
	})
```

`setHarnessAgent` accepts an agent definition, not a built Harness runtime.
PURISTA binds it to the service's `ai` runtime at `getInstance` and registers
it under `triageTicket`. Use `defineHarness(...).build()` when the application
owns a standalone Harness runtime, its sessions, and its invocation boundary.
See [attached-runtime architecture](/handbook/framework/build-ai-powered-services/architecture-and-lifecycle/#attached-definition-versus-a-standalone-harness)
for the ownership boundary and the Harness [agent-definition guide](/handbook/harness/build-agents/agent-definition/)
for every optional agent setting.

### What this builder declares

| Call | What it declares now | Important choice or limit |
| --- | --- | --- |
| [`getAgentQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getagentqueuebuilder) | A service-owned agent name and description, plus the generated command, stream, queue, and worker definitions. | The name forms part of the service contract and generated capability names. The description is for operators and generated documentation; it is not agent instructions. |
| [`addPayloadSchema(input)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addpayloadschema) | The validated input contract shared by the generated projections and the attached execution. | Use the narrow request schema the caller is allowed to supply. Do not put trusted principal, tenant, or secret data in it; use handler context instead. |
| [`addOutputSchema(output)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addoutputschema) | The validated aggregate result and final stream value. | Treat it as the stable business result. For a text stream, chunks are separate from this final schema. |
| [`addModel('primary', options)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#addmodel) | A named model requirement and its declared capabilities. | The attached agent references the alias. The composition root must bind a provider and concrete model identifier under that alias; neither belongs in the service definition. |
| [`setHarnessAgent(definition)`](/handbook/api/classes/_purista_core.AgentQueueBuilder/#setharnessagent) | The Harness default-loop execution behind every generated projection. | Exactly one execution setter is allowed: choose this, `setHarnessWorkflow`, or `setRunFunction`. Its `model` is type-checked against earlier `addModel` aliases such as `primary`. |

The focused [AgentBuilder and runtime-binding guide](/handbook/framework/build-ai-powered-services/configure-agent-builder-and-runtime-binding/) owns the full option tables, mutual-exclusivity rules, and runtime-capability checks. The links above remain the exact signature lookup.

## 3. Register the generated definitions

`getDefinition()` is asynchronous. Add its result to the service before the
service resolves definitions; [`addAgentDefinition(definition)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addagentdefinition)
registers the generated command, stream, queue, and worker definitions as one
unit. Calling it after `resolveDefinitions()` fails.

```ts title="src/service/support/v1/supportV1Service.ts"
import { triageTicketAgentBuilder } from './agent/triageTicket/triageTicketAgentBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

const triageTicketAgent = await triageTicketAgentBuilder.getDefinition()

export const supportV1Service = supportV1ServiceBuilder.addAgentDefinition(triageTicketAgent)
```

## 4. Bind the runtime at composition time

`addModel` declares what the service needs. It does not contain a provider or
credential. The following composition binds `primary`; its provider must support
the declared `object` capability.

```ts title="src/main.ts"
import { DefaultEventBridge } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
	throw new Error('OPENAI_API_KEY is required to start the support service.')
}

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await supportV1Service.getInstance(eventBridge, {
	ai: {
		models: {
			primary: {
				provider: openai({ apiKey }),
				model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
			},
		},
	},
})
await service.start()
```

This agent omits `builtinTools`, so no built-in file or command tool is
enabled for the first result. Add an application-owned sandbox only when a later agent uses
tools that need one. The builder still remains provider-neutral: another
deployment can bind a compatible provider and concrete model under `primary`
without changing the service contract. See [configure OpenAI](/handbook/harness/configure-the-runtime/openai/)
for adapter options and [provider selection](/handbook/harness/configure-the-runtime/provider-selection/)
for other supported runtime adapters.

The first observable result is a generated command named `triageTicket` that
returns the validated `output` object. In development, prove that contract with
a scripted model before making a live provider request; see [test an AI-powered
service deterministically](/handbook/framework/build-ai-powered-services/test-an-ai-powered-service-deterministically/).

Next: [configure AgentBuilder and runtime binding](/handbook/framework/build-ai-powered-services/configure-agent-builder-and-runtime-binding/).
