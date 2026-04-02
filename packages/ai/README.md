# `@purista/ai`

PURISTA AI runtime primitives for:

- model/provider abstraction
- stream-first agent execution
- tool and child-agent bridging
- conversation memory
- structured JSON generation
- provisional structured output streaming
- multimodal input parts

## Multimodal input

The runtime now supports first-class multimodal request input through:

- `AgentInputPart`
- `AgentAttachment`
- `ProviderRequest.input`
- `ProviderRequest.attachments`

Use `prompt` for simple text-only requests. Use `input` or `attachments` when the request includes images or other files.

Example:

```ts
const result = await context.models["openai:primary"].generateJson({
  prompt: "Turn this whiteboard sketch into a backend architecture proposal.",
  input: [
    { type: "image", image: uploadedImageUrl, mediaType: "image/png" },
  ],
  schema: architectureSchema,
})
```

The provider bridge keeps the text-only fast path for pure text calls and automatically emits AI SDK content parts when non-text input is present.

## File ingestion

`@purista/ai` provides a framework seam for file ingestion:

- `FileIngestor`
- `FileIngestionContext`
- `FileIngestionResult`

Important boundary:

- the framework provides the adapter contract
- the application provides the concrete parser or extraction implementation
- the framework does not ship built-in PDF, DOCX, PPTX, XLSX, or OCR parsers

That means applications can plug in the document handling they need without forcing a single parser stack into the framework.

Example:

```ts
const result = await ingestAttachment(attachment, [
  new PassthroughImageFileIngestor(),
  myPdfIngestor,
])
```

## Images vs documents

Recommended usage:

- images: prefer native multimodal provider input
- PDFs and office files: ingest and derive normalized parts before provider invocation unless the provider supports the format natively

The normalized output of ingestion should still be `AgentInputPart[]`, so handlers and providers consume one canonical runtime shape.

## Conversation history

Conversation history can now store typed parts instead of only flat text. Text helpers still exist, but they derive from the parts-based history model.

## Current product guidance

For Voyage:

- images are the first product slice
- PDF support should be app-specific
- app-specific parsers stay outside the framework

This keeps `@purista/ai` provider-neutral and extension-friendly.

## Structured output streaming

`@purista/ai` now supports provisional structured streaming alongside final structured JSON generation.

Key surfaces:

- `ModelProvider.streamObject?(request)`
- `context.ai.models["alias"].streamObject(...)`
- `context.io.stream.sendStructuredSection(...)`
- `context.io.stream.endStructuredObject(...)`

Design rules:

- provisional section updates are for live UI only
- final structured output remains the canonical, schema-validated result
- streamed sections use replacement semantics by logical section key
- providers may degrade safely to final-object-only behavior when native structured streaming is unavailable
- declared skills from `builder.useSkills([...])` are auto-loaded for `generateText(...)`, `generateJson(...)`, and `streamObject(...)`
- deeper reference files remain an explicit handler choice via `references: [...]` or dynamic selection helpers

Example:

```ts
const stream = context.ai.models["openai:primary"].streamObject({
  prompt: "Review the current specification for architecture readiness.",
  schema: readinessSchema,
  sections: (partial) => ({
    summary: partial.summary,
    blockingBusinessQuestions: partial.blockingBusinessQuestions,
    assumptionsIfProceeding: partial.assumptionsIfProceeding,
  }),
})

for await (const chunk of stream) {
  if (chunk.type === "section") {
    context.io.stream.sendStructuredSection({
      streamId: "review:architecture",
      section: chunk.section,
      content: chunk.content,
      source: "review-worker",
    })
  }
}

const final = await stream.final()
context.io.stream.endStructuredObject({
  streamId: "review:architecture",
  data: final.data,
})
```

This is intended for apps such as Voyage, where lower workers stream live structured progress while only the final deliverable is persisted into markdown truth or workflow state.

## Skills and references

Declared root skills from `builder.useSkills([...])` are injected automatically into:

- `generateText(...)`
- `generateJson(...)`
- `streamObject(...)`

That automatic injection gives the model the umbrella skill context. Deeper reference documents should still be selected explicitly by the handler when the task needs more focused knowledge.

Use `context.ai.skills.selectReferences(...)` when you want targeted reference loading without hardcoding a fixed file list:

```ts
const references = await context.ai.skills.selectReferences({
  skillName: "purista",
  queries: [
    "service boundaries builders contracts",
    "implementation planning work packages",
  ],
  relativePathPrefixes: ["references/"],
  limit: 4,
})

const result = await context.ai.models["openai:primary"].generateJson({
  prompt,
  schema,
  references,
})
```

This is the preferred pattern for generic agents:

- declare the umbrella skill once with `useSkills([...])`
- let the model always see that root skill
- select deeper references dynamically from the handler based on the actual task

## Conversation retention

Conversation persistence is explicit agent policy, not something to leave to chance.

Framework default:

- strategy: `full`
- max frames: `40`

Use `persistConversation(...)` on agents that need a larger or different retention window:

```ts
new AgentBuilder({ agentName: "specAgent", agentVersion: "1" })
  .persistConversation("user", {
    strategy: "full",
    maxFrames: 72,
    storeName: "spec-agent-history",
  })
```

Recommended rule:

- use explicit full-history budgets for agents that synthesize business truth, architecture, or plans
- use smaller summarized histories only when the agent truly benefits from compression more than exact context preservation

## Public streamed replies

`@purista/ai` also provides a handler-level helper for the common pattern:

- generate a public assistant reply with a configured model
- stream text deltas into the current turn
- emit a final assistant end marker automatically
- return the final reply text for persistence

Surface:

- `context.ai.reply.compose(...)`
- `context.ai.reply.generate(...)`
- `context.ai.reply.publish(...)`

Example:

```ts
const reply = await context.ai.reply.generate({
  model: "openai:primary",
  prompt:
    "Write the user-facing reply after the latest specification refinement. Keep it concise and grounded in the current project truth.",
})

await saveAssistantReply(reply)
```

Decision model:

- `compose(...)`: generate internal draft text without streaming it
- `generate(...)`: generate and stream the public assistant reply with a model
- `publish(...)`: stream an already-final deterministic public reply

This is the preferred PURISTA-style pattern for assistant narration. It keeps model-generated or deterministic reply text on explicit framework paths while leaving structured artifacts and deliverables on their existing paths.

Use `compose(...)` when the text is an internal synthesis input for reflection, approval, critique, or later publication:

```ts
const draft = await context.ai.reply.compose({
  model: "openai:primary",
  prompt: "Draft the support response internally. Do not stream it yet.",
})
```

When you already have the final user-facing reply text and only want PURISTA to stream and terminate it correctly, use `publish(...)`:

```ts
const reply = context.ai.reply.publish(
  "The approval was recorded and the project remains in the current stage.",
)

await saveAssistantReply(reply)
```

## Invocation model

`@purista/ai` uses a stream-first invocation contract for agents.

- canonical target is fixed to `run`
- default invocation delivery mode is `prefer-stream`
- `prefer-stream` opens a stream first and may fallback to command invoke
- `require-stream` fails fast when stream transport is unavailable

`context.invoke.agents.forward(...)` uses strict stream semantics (`require-stream`) because live relay cannot be emulated safely.

`context.invoke.agents.runObject(...)` parses final assistant text as JSON and validates it against:

- call-level `outputSchema` when provided
- otherwise declared `.canInvokeAgent(..., { outputSchema })` schema

Top-level package exports intentionally keep runtime internals private. Use `AgentBuilder`, `getInstance(...)`, and invocation helpers (`context.invoke.agents.*` / `invokeAgent`) as the supported DX.
