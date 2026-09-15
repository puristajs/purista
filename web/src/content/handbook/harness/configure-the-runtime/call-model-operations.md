---
title: Call model operations
description: Use provider-neutral text, structured output, embeddings, and media operations with explicit aggregate and streaming contracts.
order: 215
---

Agents normally own the model loop. A workflow can call a bound model alias
when application code must own the request and result assembly. The alias and
selected adapter must support the operation.

| Need | Capability | Method | Result |
| --- | --- | --- | --- |
| One text result | `text` | `text(...)` | Text response and finish reason |
| Incremental text | `text_stream` | `textStream(...)` | Async text updates |
| One schema-bounded object | `object` | `object(...)` | Typed object response |
| Structured progress | `object_stream` | `objectStream(...)` | Partial snapshots and final object |
| Vectors | `embeddings` | `embed(...)` | Vectors in input order |
| Images, speech, or video | matching media capability | `image(...)`, `speech(...)`, `video(...)` | Artifact references |

## Call a model from a workflow

```ts title="src/harness/classifyCase.ts"
import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'
import { z } from 'zod'

const input = z.object({ summary: z.string().min(1) })
const output = z.object({ category: z.enum(['access', 'billing', 'other']) })

const classifyCase = defineAgent('classifyCase', {
  input,
  output,
  model: 'classifier',
  prompt: value => ({ role: 'user', content: value.summary }),
  instructions: 'Classify the support case as access, billing, or other.',
})
const classify = defineWorkflow('classifyCaseDirectly', {
  input,
  output,
  models: { classifier: { alias: 'classifier', capabilities: ['object'] } },
  handler: async context => {
    const response = await context.models.classifier.object({
      messages: [{ role: 'user', content: context.input.summary }],
      schema: { type: 'object', additionalProperties: false, properties: { category: { enum: ['access', 'billing', 'other'] } }, required: ['category'] },
      schemaName: 'support_case_category',
    }, { callId: 'classify-case' })
    return response.object
  },
})

export const definition = defineHarness({ name: 'support' }).addAgent(classifyCase).addWorkflow(classify)
export const supportHarness = await definition.getInstance({ models: { classifier: classifierModel } })
```
The standard agent uses `prompt` and `instructions`. The workflow's direct
model call uses the declared `classifier` alias and its required `callId`.
Direct model methods do not run agent instructions, tools, skills, governance,
or Guardrails. Use the default agent loop when those boundaries should act
together.

## Consume a stream completely

```ts title="Call Model Operations example 3"
const writeSummary = defineWorkflow('writeSummary', {
  input: z.object({ prompt: z.string() }),
  output: z.object({ text: z.string() }),
  models: { writer: { alias: 'writer', capabilities: ['text_stream'] } },
  handler: async context => {
    const stream = context.models.writer.textStream(
      { messages: [{ role: 'user', content: context.input.prompt }] },
      { callId: 'write-summary' },
    )
    let text = ''
    for await (const part of stream) {
      if (part.kind === 'delta') text += part.text
    }
    return { text }
  },
})
```
Consume or cancel the iterable. The provider, concurrency lease, and telemetry
span remain active until iteration finishes, throws, or the signal aborts. Use
an agent or workflow target stream for portable execution events and use
`@purista/harness-ai-sdk-ui/v1` at a browser boundary.

## Embeddings and generated media

Keep tenant authorization, document loading, candidate limits, artifact policy,
and URL signing in application code. Harness calls the configured model
operation and returns validated values. Embeddings preserve input order. Image,
speech, and video operations publish bytes through the application-owned
`ArtifactStore` and return JSON-safe artifact references; they do not expose
provider URLs or credentials.

A provider or model may implement only a subset of operations. Missing
capabilities fail before the call, and provider-specific limits can still
reject a request. Test each deployed model and operation with a deterministic
fake, then add a separately gated provider smoke test.
