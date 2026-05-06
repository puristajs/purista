# `@purista/ai`

PURISTA AI runtime primitives for:

- model/provider abstraction
- stream-first agent execution
- tool and child-agent bridging
- conversation memory
- structured object generation
- provisional structured output streaming
- multimodal input parts
- sequential AI-generated plan execution

## Canonical runtime contract

`@purista/ai` now treats transport identity and AI workflow identity as separate layers:

- PURISTA transport keeps `message.id`, `traceId`, `otp`, and `correlationId`
- PURISTA AI protocol keeps `conversationId`, `inReplyTo`, workflow artifacts, and final `output`

The canonical runtime derives one invocation identity at request ingress and reuses it everywhere:

- `transportMessageId`: the current PURISTA message id
- `correlationId`: distributed request-chain id
- `traceId` / `otp`: transport trace propagation
- `baseSessionId`: logical session/conversation id
- `scopedSessionId`: tenant/principal/agent/session scoped storage key
- `conversationId`: equal to `baseSessionId`, never inferred from `correlationId`

That identity is reused by:

- protocol envelope creation
- session and conversation persistence
- run-state scope
- child-agent invocation
- model-call telemetry

The practical rule is simple: `correlationId` is transport lineage, `conversationId` is AI conversation truth.

## Canonical execution path

The supported runtime path is:

1. PURISTA command/stream or queue worker context enters the agent
2. `AgentExecutor` derives invocation identity once
3. `createProtocolBuffer(...)` emits PURISTA AI envelopes
4. `createAgentHandlerContext(...)` exposes conversation memory, planner helpers, tools, child agents, and models
5. `ModelRouter` owns model-call budgeting, metadata preparation, and telemetry wrapping

Legacy prompt-only helper runtimes and alternate worker/orchestrator execution paths are intentionally removed. `AgentExecutor` is the single execution contract for protocol emission, session identity, conversation persistence, child-agent forwarding, telemetry, and late-failure handling.

Late handler failures do not discard previously emitted envelopes anymore. The executor appends the terminal error frame to the existing protocol stream so UIs and consumers keep already-seen progress.

## Model method shape

PURISTA keeps separate stream and non-stream model methods.

- `generateText(...)` returns one final text result
- `streamText(...)` returns a text/reasoning stream handle plus `.final()`
- `generateObject(...)` returns one final structured result
- `streamObject(...)` returns structured section/final-object chunks plus `.final()`

This is intentionally closer to common SDK patterns than a single `generate().final()` surface. OpenAI's streaming APIs and the Vercel AI SDK both separate streamed and non-streamed calls rather than collapsing everything into one universal method.

Declared model capabilities also narrow handler typing truthfully:

- `text` guarantees `generateText(...)`
- `text-stream` guarantees `streamText(...)` and `generateText(...)`
- `object` guarantees `generateObject(...)`
- `object-stream` guarantees `streamObject(...)`
- `embedding` guarantees `embed(...)`
- `rerank` guarantees `rerank(...)`

When omitted, attached-agent model capabilities default to `['text', 'object', 'object-stream', 'text-stream']`.

## Multimodal input

The runtime now supports first-class multimodal request input through:

- `AgentInputPart`
- `AgentAttachment`
- `ProviderRequest.input`
- `ProviderRequest.attachments`

Use `prompt` for simple text-only requests. Use `input` or `attachments` when the request includes images or other files.

Example:

```ts
const result = await context.models["openai:primary"].generateObject({
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

`@purista/ai` now supports provisional structured streaming alongside final structured object generation.

Key surfaces:

- `ModelProvider.streamObject?(request)`
- `context.ai.models["alias"].streamObject(...)`
- `context.ai.streamObject({ model, ..., publishToCurrentStream })`
- `context.ai.streamText({ model, ..., publishToCurrentStream })`

Design rules:

- provisional section updates are for live UI only
- final structured output remains the canonical, schema-validated result
- attached agents can validate their final structured result through `addOutputSchema(...)`
- streamed sections use replacement semantics by logical section key
- providers may degrade safely to final-object-only behavior when native structured streaming is unavailable
- declared skills from `builder.useSkills([...])` are auto-loaded for `generateText(...)`, `generateObject(...)`, and `streamObject(...)`
- deeper reference files remain an explicit handler choice via `references: [...]` or dynamic selection helpers
- `publishToCurrentStream.taskId` binds live model output to the reserved task lane:
  - `purista-ai:task:<taskId>`
  - `purista-ai:task-chunk:<taskId>`
  - `purista-ai:plan-status`

Example:

```ts
const final = await context.ai.streamObject({
  model: "openai:primary",
  prompt: "Review the current specification for architecture readiness.",
  schema: readinessSchema,
  sections: (partial) => ({
    summary: partial.summary,
    blockingBusinessQuestions: partial.blockingBusinessQuestions,
    assumptionsIfProceeding: partial.assumptionsIfProceeding,
  }),
  publishToCurrentStream: {
    artifactIdPrefix: "review-architecture",
    renderSectionDelta: ({ section, content }) =>
      typeof content === "string" ? `${section}: ${content}` : undefined,
  },
})
```

This is intended for apps such as Voyage, where lower workers stream live structured progress while only the final deliverable is persisted into markdown truth or workflow state.

## Tracing and telemetry layering

Every model capability call is wrapped in a PURISTA-owned outer span, and the Vercel AI SDK telemetry runs inside the same trace tree through `experimental_telemetry`.

Covered capabilities:

- `generateText`
- `streamText`
- `generateObject`
- `streamObject`
- `embed`
- `embedMany`
- `rerank`

The outer PURISTA span records runtime metadata such as:

- agent name and service version
- provider name and model alias
- capability name
- tenant and principal ids
- `correlationId`
- `transportMessageId`
- `baseSessionId`
- `scopedSessionId`
- `conversationId`

The AI SDK telemetry remains enabled underneath that outer span so teams can keep native provider tracing without losing PURISTA-specific lineage.

The runtime does not mint a second competing trace model. PURISTA owns the outer semantic span and passes the existing active trace into the Vercel AI SDK telemetry layer.

## Logging and error sanitization

Non-debug observability in `@purista/ai` is intentionally sanitized.

- warn/error/info logs must not include prompts, request bodies, transcripts, attachments, tool arguments, skill content, or sandbox stdout/stderr
- provider failures log response-side diagnostics such as `statusCode`, `providerCode`, `requestId`, `retryable`, safe response headers, and sanitized response body
- protocol `error` frames expose only sanitized `details` summaries and do not include raw `stack` or nested `cause`
- the original exception is still recorded on OTEL spans through `recordException(...)`, so trace correlation remains intact without leaking request payloads into logs or protocol streams

The practical rule is:

- logs and protocol frames carry sanitized operational diagnostics
- spans carry correlation and exception linkage
- raw prompts/request payloads do not appear outside explicit application-level debug paths

## Conversation persistence

Conversation storage uses one canonical record shape:

```ts
type ConversationStoreRecordData = {
  conversation?: ConversationState
}
```

Session helpers persist role-based conversation state through `context.memory.conversation`. Prompt-only history arrays and ad hoc `lastOutput` fields are no longer the canonical storage contract.

## Sequential plan execution

`@purista/ai` now includes a higher-level sequential planner/executor on the handler context:

- `context.plan.generate(...)`
- `context.plan.execute(...)`

Use it when one agent should:

- generate a plan from the incoming request
- persist that plan into durable run-state
- execute tasks sequentially
- route tasks to one main worker or optional named delegates
- emit the canonical `purista-ai:*` plan/task artifacts automatically

This is intentionally not a full parallel multi-agent orchestration engine. V1 is single-agent and sequential.

The preferred DX is an explicit split:

1. `const plan = await context.plan.generate(...)`
2. `const result = await context.plan.execute(plan)`

Planner-generated tasks stay business-level:

- `id`
- `title`
- `instruction`
- optional `delegate`
- optional `dependsOn`

The required `worker` handles tasks without a `delegate`. Optional `delegates` are named specialists. The task `instruction` is passed to the resolved executor as the user-facing task message.
`context.plan.generate(...)` can infer `request` from the incoming payload prompt and default the title when omitted.

Recommended executor split:

- `createModelExecutor(...)` for the worker and normal model-backed delegates
- `createToolExecutorFromInvoke(...)` for allowlisted tool delegates
- `createAgentExecutorFromInvoke(...)` for allowlisted child-agent delegates

When a child-agent delegate forwards into the current stream, prefer the typed forwarding policy over a blanket `artifacts: true` setting. The common planner composition is:

- forward workflow progress (`run-state`, `purista-ai:*`, `purista-ai:workflow-stage`)
- forward tool events and handled errors
- suppress child `output` artifacts unless the parent intentionally wants to expose them in-band

For post-plan synthesis or other non-task phases, use `context.io.workflow.emitStage(...)`. This emits the reserved `purista-ai:workflow-stage` artifact so UIs can show finalization progress without overloading planner run-state or confusing it with the final `output` artifact.

Treat `createToolExecutorLogic(...)` as an escape hatch for genuinely custom runtime logic, not the primary planner DX.

## Skills and references

Declared root skills from `builder.useSkills([...])` are injected automatically into:

- `generateText(...)`
- `generateObject(...)`
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

const result = await context.ai.models["openai:primary"].generateObject({
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

For attached agents, bind the conversation store explicitly at service instantiation through `getInstance(..., { ai: { conversationStore } })` and keep the retention budget on the store/runtime side instead of hiding it in handler code.

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

`context.invoke.agents.stream({...})` is the preferred composition API for child-agent streaming. It keeps canonical envelopes intact and supports `.forwardToCurrentStream(...)`, `.tap(...)`, `.toWriter(...)`, and `.collect()` without manual iterator plumbing.

`context.invoke.agents.forward(...)` is the shorthand for the common "forward child stream into the current response" case and uses strict stream semantics (`require-stream`) because live relay cannot be emulated safely.

`context.invoke.agents.runObject(...)` reads the final `output` artifact as the canonical machine result and validates it against:

- call-level `outputSchema` when provided
- otherwise declared `.canInvokeAgent(..., { outputSchema })` schema

Forwarded child-agent frames preserve the child envelope identity. The parent may emit its own orchestration/tool frames, but forwarded assistant messages, artifacts, tool frames, and errors keep the original child `actor`, `conversationId`, and lineage metadata.

Top-level package exports intentionally keep runtime internals private. Use the `@purista/ai` `ServiceBuilder` agent extension, `getInstance(...)`, and invocation helpers (`context.invoke.agents.*` / `invokeAgent`) as the supported DX.

## Sandbox reliability semantics

Sandbox behavior is now explicit and converged for production troubleshooting:

- `executeBash` accepts optional `timeoutMs` (max `30m`) and maps timeout failures to handled timeout responses.
- owner-scoped `ensureSandbox` uses a persistent owner-tuple provisioning lock to avoid duplicate sandbox creation under concurrent calls.
- sandbox file writes use a binary-safe transport contract (`utf-8` or `base64` encoded file payloads) instead of assuming text-only content.
- runtime queue-worker execution and in-process execution use the same internal workload engine for envelope/error parity.

Important design boundary remains unchanged:

- root skill content is injected by default when declared via `useSkills([...])`
- deeper skill/reference files are explicit handler choice
- budget/limit policy stays developer-owned at app level
