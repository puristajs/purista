# `@purista/ai`

PURISTA AI runtime primitives for:

- model/provider abstraction
- stream-first agent execution
- tool and child-agent bridging
- conversation memory
- structured JSON generation
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
