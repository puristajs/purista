---
title: Call model operations
description: Use provider-neutral text, structured output, embedding, reranking, and media handles with the correct aggregate and streaming contracts.
order: 215
---

Agents usually use the default model loop. A custom agent handler or workflow
can instead call a model handle directly when application code must own the
request, schema, or result assembly. The alias capabilities determine which
methods TypeScript exposes on `context.models.<alias>`.

## Choose the operation by the result contract

| Need | Alias capability | Model-handle method | Result |
| --- | --- | --- | --- |
| One text result | `text` | `text(...)` | `TextResponse` with content, usage, and finish reason |
| Incremental text | `text_stream` | `textStream(...)` | `AsyncIterable<TextStreamChunk>` |
| One schema-bounded object | `object` | `object(...)` | `ObjectResponse<T>` |
| Progressive structured output | `object_stream` | `objectStream(...)` | `AsyncIterable<ObjectStreamChunk<T>>` |
| Vectors for one or more strings | `embeddings` | `embed(...)` | Indexed embedding vectors in input order |
| A reordered candidate set | `rerank` | `rerank(...)` | IDs, original indexes, and scores |
| Published images | `image_generation` | `image(...)` | Client-safe artifact references |
| Published speech | `speech_generation` | `speech(...)` | One client-safe artifact reference |
| Completed video | `video_generation` | `video(...)` | One client-safe artifact reference |
| Video job progress | `video_generation` | `videoStream(...)` | Queued, progress, and terminal artifact chunks |

The caller chooses aggregate or streaming behavior by calling the corresponding
method. `text` and `textStream`, and `object` and `objectStream`, are separate
capabilities because a provider or model may implement only one form. Video
uses one capability because `video` and `videoStream` are two execution modes
for the same long-running media operation.

## Call text and structured output in a custom handler

The handler owns the messages and cancellation signal. An `object` request
also supplies provider-facing JSON Schema. The agent output schema still
validates the value returned across the agent boundary.

```ts title="src/harness/agents/classifyCase.ts"
import { defineHarness } from '@purista/harness'
import { z } from 'zod'

const caseInput = z.object({ summary: z.string().min(1) })
const caseResult = z.object({ category: z.enum(['access', 'billing', 'other']) })

export const supportHarnessDefinition = defineHarness({ name: 'support' })
	.requireModel('classifier', { capabilities: ['object'] })
	.agent('classify_case', {
		input: caseInput,
		output: caseResult,
		handler: async context => {
			const response = await context.models.classifier.object<z.output<typeof caseResult>>(
				{
					messages: [{ role: 'user', content: context.input.summary }],
					schema: {
						type: 'object',
						additionalProperties: false,
						properties: { category: { enum: ['access', 'billing', 'other'] } },
						required: ['category'],
					},
					schemaName: 'support_case_category',
				},
				context.signal,
			)
			return response.object
		},
	})
	.define()
```

[`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/)
starts the definition.
[`requireModel(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#requiremodel)
makes only the declared operations available to the handler's typed model
context. [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent)
binds the validated input/output to that custom handler, and
[`.define()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#define)
finishes the portable contract without selecting a provider.

Use `text(...)` in the same way when the application contract is plain text.
Direct model methods do not execute an agent's instructions, tools, skills,
governance, Guardrail interceptors, or model loop for you. Use the default
agent loop when those features should act together.

## Consume a model stream completely

`textStream(...)` emits text deltas, tool calls, and one finish chunk.
`objectStream(...)` emits partial snapshots or path/value deltas, tool calls,
and one finish chunk containing the final object. Treat intermediate object
chunks as presentation updates; only the finish object is complete.

```ts title="Consume provider-neutral text chunks"
const stream = context.models.writer.textStream(
	{ messages: [{ role: 'user', content: context.input.prompt }] },
	context.signal,
)

let text = ''
for await (const chunk of stream) {
	if (chunk.kind === 'delta') text += chunk.text
	if (chunk.kind === 'tool_call') {
		// A direct model call reports the request; application code owns execution.
	}
	if (chunk.kind === 'finish' && chunk.finishReason !== 'stop') {
		// Apply the application's outcome policy before returning a partial result.
	}
}
```

Consume or explicitly cancel the iterable. The admission lease, telemetry
span, and provider stream remain active until iteration finishes, throws, or
the cancellation signal aborts.

These chunks are an internal provider-neutral model contract. A browser-facing
agent or workflow should expose its target's `stream(...)` execution events.
Use `@purista/harness-ai-sdk-ui/v1` to convert those events to AI SDK UI Message
Stream v1. Browser code can then use AI SDK UI and AI Elements without a
Harness-specific client.

## Embed and rerank in application-owned retrieval

Keep tenant authorization, document loading, and candidate limits in
application code. The Harness only calls the configured model operation.

```ts title="Embed a query, then rerank authorized candidates"
const embedded = await context.models.embedding.embed(
	{ input: context.input.question, dimensions: 1_536 },
	context.signal,
)
const queryVector = embedded.embeddings[0]?.vector
if (!queryVector) throw new Error('The embedding provider returned no vector')

const candidates = await repository.searchAuthorized({
	tenantId: context.input.tenantId,
	queryVector,
	limit: 20,
	signal: context.signal,
})

const ranked = await context.models.reranker.rerank(
	{
		query: context.input.question,
		documents: candidates.map(candidate => ({
			id: candidate.id,
			text: candidate.text,
			metadata: { revision: candidate.revision },
		})),
		topN: 5,
	},
	context.signal,
)
```

An embedding response must contain exactly one valid index for every submitted
input; the Harness rejects a mismatched response. Reranking validates that
results reference submitted documents. No first-party provider currently
implements `rerank`, so use an application-owned `ModelProvider` for that
operation and verify it with the adapter contract tests.

## Publish generated media through an artifact store

Provider adapters return image, audio, and video bytes only to the Harness.
The Harness publishes those bytes through the application-owned
[`ArtifactStore`](/handbook/api/interfaces/_purista_harness.ArtifactStore/) and
returns JSON-safe [`ArtifactReference`](/handbook/api/interfaces/_purista_harness.ArtifactReference/)
values. A missing artifact store fails before the provider is invoked.

```ts title="Bind media models and application-owned artifact storage"
const mediaDefinition = defineHarness({ name: 'media' })
	.requireModels({
		image: { capabilities: ['image_generation'] },
		speech: { capabilities: ['speech_generation'] },
		video: { capabilities: ['video_generation'] },
	})
	// Add agents or workflows that use context.models.image, speech, or video.
	.define()

const harness = await mediaDefinition.getInstance({
	models: {
		image: { provider, model: 'image-model' },
		speech: { provider, model: 'speech-model' },
		video: { provider, model: 'video-model' },
	},
	artifacts: artifactStore,
})
```

The media definition also starts with
[`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/).
[`requireModels(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#requiremodels)
declares the three provider-neutral media contracts, and
[`.define()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#define)
finishes the portable definition.
Its runtime instance supplies concrete provider models and the artifact store;
the portable definition contains neither credentials nor storage clients.

The store decides persistence, authorization, URL signing, expiry, and cleanup.
It receives trusted run scope and an optional idempotency key. Do not return a
provider URL, credentials, or raw generated bytes from the application API.

| Artifact-store member | Responsibility |
| --- | --- |
| [`publish(request)`](/handbook/api/interfaces/_purista_harness.ArtifactStore/#publish) | Persist the supplied bytes or byte stream, honor the cancellation signal and idempotency key, and return a JSON-safe application URL with metadata. The implementation owns authorization and expiry for that URL. |
| [`close()`](/handbook/api/interfaces/_purista_harness.ArtifactStore/#close) | Optionally close clients or resources owned by the store. Harness calls it during `shutdown()` and reports cleanup failures with the other adapter shutdown errors. |

```ts title="Generate media inside a custom handler or workflow"
const images = await context.models.image.image(
	{ prompt: 'A simple blue support diagram', count: 1, outputFormat: 'png' },
	context.signal,
)

const speech = await context.models.speech.speech(
	{ text: 'Your report is ready.', voice: 'alloy', outputFormat: 'mp3' },
	context.signal,
)

for await (const update of context.models.video.videoStream(
	{ prompt: 'A short product walkthrough', durationSeconds: 5 },
	context.signal,
)) {
	if (update.kind === 'progress') reportProgress(update.progress)
	if (update.kind === 'finish') return update.artifact
}
throw new Error('The video stream ended without a terminal artifact')
```

Check the selected adapter and model before declaring a capability. The OpenAI
adapter is currently the only first-party adapter with image, speech, and video
methods; account and model access can still be narrower.

## Supply multimodal input deliberately

Text and object messages accept image, audio, or file content only when the
alias also declares `vision_input`, `audio_input`, or `file_input`. The typed
model handle omits unsupported content parts. Authorize and scan files before
building the message, apply a size limit, and prefer short-lived application
URLs over public provider-owned URLs.

Continue with [choose a model provider](../provider-selection/) and the
[provider compatibility table](/handbook/harness/reference/provider-and-adapter-compatibility/).
