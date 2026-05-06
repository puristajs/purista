[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/ai

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

## Classes

- [AgentInstance](classes/AgentInstance.md)
- [AgentQueueBuilder](classes/AgentQueueBuilder.md)
- [AgentWorkerBuilder](classes/AgentWorkerBuilder.md)
- [AiSdkProvider](classes/AiSdkProvider.md)
- [FileSkillResource](classes/FileSkillResource.md)
- [InlineSkillResource](classes/InlineSkillResource.md)
- [InMemoryConversationStore](classes/InMemoryConversationStore.md)
- [MockModel](classes/MockModel.md)
- [ModelResourceRegistry](classes/ModelResourceRegistry.md)
- [PassthroughImageFileIngestor](classes/PassthroughImageFileIngestor.md)
- [PodmanSandboxDriver](classes/PodmanSandboxDriver.md)
- [PoolManager](classes/PoolManager.md)
- [SandboxRuntimeUnavailableError](classes/SandboxRuntimeUnavailableError.md)
- [SandboxService](classes/SandboxService.md)
- [ScriptedModel](classes/ScriptedModel.md)
- [ServiceBuilder](classes/ServiceBuilder.md)

## Interfaces

- [AiSdkStreamOptions](interfaces/AiSdkStreamOptions.md)
- [ConversationStore](interfaces/ConversationStore.md)
- [DockerSandboxDriverConfig](interfaces/DockerSandboxDriverConfig.md)
- [FileIngestor](interfaces/FileIngestor.md)
- [ModelProvider](interfaces/ModelProvider.md)
- [PodmanSandboxDriverConfig](interfaces/PodmanSandboxDriverConfig.md)
- [SandboxProvider](interfaces/SandboxProvider.md)
- [StreamProtocolAdapter](interfaces/StreamProtocolAdapter.md)

## Type Aliases

- [AddAgentInvoke](type-aliases/AddAgentInvoke.md)
- [AddModelAlias](type-aliases/AddModelAlias.md)
- [AddToolInvoke](type-aliases/AddToolInvoke.md)
- [Agent2AgentReferenceMessage](type-aliases/Agent2AgentReferenceMessage.md)
- [AgentAfterGuardHook](type-aliases/AgentAfterGuardHook.md)
- [AgentAgentExecutorFromInvokeOptions](type-aliases/AgentAgentExecutorFromInvokeOptions.md)
- [AgentApprovalCheckpointPolicy](type-aliases/AgentApprovalCheckpointPolicy.md)
- [AgentApprovalHelpers](type-aliases/AgentApprovalHelpers.md)
- [AgentApprovalPolicy](type-aliases/AgentApprovalPolicy.md)
- [AgentAttachment](type-aliases/AgentAttachment.md)
- [AgentAttachmentSource](type-aliases/AgentAttachmentSource.md)
- [AgentBeforeGuardHook](type-aliases/AgentBeforeGuardHook.md)
- [AgentBindingConfig](type-aliases/AgentBindingConfig.md)
- [AgentContextLike](type-aliases/AgentContextLike.md)
- [AgentContextMockResult](type-aliases/AgentContextMockResult.md)
- [AgentContextMockSpy](type-aliases/AgentContextMockSpy.md)
- [AgentDefinition](type-aliases/AgentDefinition.md)
- [AgentEnvelopeWriter](type-aliases/AgentEnvelopeWriter.md)
- [AgentExecutionCleanupPolicy](type-aliases/AgentExecutionCleanupPolicy.md)
- [AgentExecutionHttpBehavior](type-aliases/AgentExecutionHttpBehavior.md)
- [AgentExecutionPlan](type-aliases/AgentExecutionPlan.md)
- [AgentExecutionPolicy](type-aliases/AgentExecutionPolicy.md)
- [AgentExecutionRecoveryPolicy](type-aliases/AgentExecutionRecoveryPolicy.md)
- [AgentExecutorBaseOptions](type-aliases/AgentExecutorBaseOptions.md)
- [AgentExecutorResultMode](type-aliases/AgentExecutorResultMode.md)
- [AgentFileInputPart](type-aliases/AgentFileInputPart.md)
- [AgentForwardingOptions](type-aliases/AgentForwardingOptions.md)
- [AgentForwardInvocationOptions](type-aliases/AgentForwardInvocationOptions.md)
- [AgentHandler](type-aliases/AgentHandler.md)
- [AgentHandlerContext](type-aliases/AgentHandlerContext.md)
- [AgentHandlerContextFromBuilder](type-aliases/AgentHandlerContextFromBuilder.md)
- [AgentHandlerResult](type-aliases/AgentHandlerResult.md)
- [AgentHandlerResultObject](type-aliases/AgentHandlerResultObject.md)
- [AgentHarnessResult](type-aliases/AgentHarnessResult.md)
- [AgentHistoryPreset](type-aliases/AgentHistoryPreset.md)
- [AgentHttpExposure](type-aliases/AgentHttpExposure.md)
- [AgentImageInputPart](type-aliases/AgentImageInputPart.md)
- [AgentInfo](type-aliases/AgentInfo.md)
- [AgentInputPart](type-aliases/AgentInputPart.md)
- [AgentInstanceDependencies](type-aliases/AgentInstanceDependencies.md)
- [AgentInstanceOptions](type-aliases/AgentInstanceOptions.md)
- [AgentInvocationDeliveryMode](type-aliases/AgentInvocationDeliveryMode.md)
- [AgentInvocationFinalResult](type-aliases/AgentInvocationFinalResult.md)
- [AgentInvocationOptions](type-aliases/AgentInvocationOptions.md)
- [AgentInvocationOptionsFor](type-aliases/AgentInvocationOptionsFor.md)
- [AgentInvocationPipeline](type-aliases/AgentInvocationPipeline.md)
- [AgentInvokeBinding](type-aliases/AgentInvokeBinding.md)
- [AgentInvokeContext](type-aliases/AgentInvokeContext.md)
- [AgentInvokeHelpers](type-aliases/AgentInvokeHelpers.md)
- [AgentInvokeRequest](type-aliases/AgentInvokeRequest.md)
- [AgentInvokeResult](type-aliases/AgentInvokeResult.md)
- [AgentManifest](type-aliases/AgentManifest.md)
- [AgentManifestConfig](type-aliases/AgentManifestConfig.md)
- [AgentMap](type-aliases/AgentMap.md)
- [AgentModelBinding](type-aliases/AgentModelBinding.md)
- [AgentModelCallKind](type-aliases/AgentModelCallKind.md)
- [AgentModelCallOptions](type-aliases/AgentModelCallOptions.md)
- [AgentModelCallPrepareInput](type-aliases/AgentModelCallPrepareInput.md)
- [AgentModelCapability](type-aliases/AgentModelCapability.md)
- [AgentModelConfig](type-aliases/AgentModelConfig.md)
- [AgentModelExecutorOptions](type-aliases/AgentModelExecutorOptions.md)
- [AgentPlanDelegateById](type-aliases/AgentPlanDelegateById.md)
- [AgentPlanExecutionContext](type-aliases/AgentPlanExecutionContext.md)
- [AgentPlanExecutionResult](type-aliases/AgentPlanExecutionResult.md)
- [AgentPlanExecutionResultFromPlan](type-aliases/AgentPlanExecutionResultFromPlan.md)
- [AgentPlanExecutor](type-aliases/AgentPlanExecutor.md)
- [AgentPlanExecutorKind](type-aliases/AgentPlanExecutorKind.md)
- [AgentPlanExecutorResult](type-aliases/AgentPlanExecutorResult.md)
- [AgentPlanGenerateInput](type-aliases/AgentPlanGenerateInput.md)
- [AgentPlanHelpers](type-aliases/AgentPlanHelpers.md)
- [AgentPlanResults](type-aliases/AgentPlanResults.md)
- [AgentPlanTask](type-aliases/AgentPlanTask.md)
- [AgentPlanTaskResult](type-aliases/AgentPlanTaskResult.md)
- [AgentPolicy](type-aliases/AgentPolicy.md)
- [AgentPolicyHelpers](type-aliases/AgentPolicyHelpers.md)
- [AgentPrepareCallHook](type-aliases/AgentPrepareCallHook.md)
- [AgentPrepareStepHook](type-aliases/AgentPrepareStepHook.md)
- [AgentProtocolBuffer](type-aliases/AgentProtocolBuffer.md)
- [AgentProtocolEnvelope](type-aliases/AgentProtocolEnvelope.md)
- [AgentProtocolFrame](type-aliases/AgentProtocolFrame.md)
- [AgentQualityPolicy](type-aliases/AgentQualityPolicy.md)
- [AgentQualityProfile](type-aliases/AgentQualityProfile.md)
- [AgentQueueBuilderInput](type-aliases/AgentQueueBuilderInput.md)
- [AgentQueueBuilderTypes](type-aliases/AgentQueueBuilderTypes.md)
- [AgentQueueDefinitionResult](type-aliases/AgentQueueDefinitionResult.md)
- [AgentReflectionHelpers](type-aliases/AgentReflectionHelpers.md)
- [AgentReplyModelOptions](type-aliases/AgentReplyModelOptions.md)
- [AgentReplyObjectOptions](type-aliases/AgentReplyObjectOptions.md)
- [AgentReplyOptions](type-aliases/AgentReplyOptions.md)
- [AgentReplyStructuredOptions](type-aliases/AgentReplyStructuredOptions.md)
- [AgentReplyTextOptions](type-aliases/AgentReplyTextOptions.md)
- [AgentResourcePolicy](type-aliases/AgentResourcePolicy.md)
- [AgentRole](type-aliases/AgentRole.md)
- [AgentRunCheckpoint](type-aliases/AgentRunCheckpoint.md)
- [AgentRunError](type-aliases/AgentRunError.md)
- [AgentRunGetInput](type-aliases/AgentRunGetInput.md)
- [AgentRunHandle](type-aliases/AgentRunHandle.md)
- [AgentRunLock](type-aliases/AgentRunLock.md)
- [AgentRunLockHandle](type-aliases/AgentRunLockHandle.md)
- [AgentRunLockInput](type-aliases/AgentRunLockInput.md)
- [AgentRunOwner](type-aliases/AgentRunOwner.md)
- [AgentRunRecovery](type-aliases/AgentRunRecovery.md)
- [AgentRunRetention](type-aliases/AgentRunRetention.md)
- [AgentRunStartInput](type-aliases/AgentRunStartInput.md)
- [AgentRunState](type-aliases/AgentRunState.md)
- [AgentRunStateHelpers](type-aliases/AgentRunStateHelpers.md)
- [AgentRunStateScope](type-aliases/AgentRunStateScope.md)
- [AgentRunStatus](type-aliases/AgentRunStatus.md)
- [AgentRunTask](type-aliases/AgentRunTask.md)
- [AgentRunTaskApproval](type-aliases/AgentRunTaskApproval.md)
- [AgentRunTaskExecutor](type-aliases/AgentRunTaskExecutor.md)
- [AgentRunTaskHandoff](type-aliases/AgentRunTaskHandoff.md)
- [AgentRunTaskInput](type-aliases/AgentRunTaskInput.md)
- [AgentRunTaskKind](type-aliases/AgentRunTaskKind.md)
- [AgentRunTaskRetryPolicy](type-aliases/AgentRunTaskRetryPolicy.md)
- [AgentRunTaskStatus](type-aliases/AgentRunTaskStatus.md)
- [AgentRuntimeDependencies](type-aliases/AgentRuntimeDependencies.md)
- [AgentRuntimeDependenciesTyped](type-aliases/AgentRuntimeDependenciesTyped.md)
- [AgentRuntimeInstance](type-aliases/AgentRuntimeInstance.md)
- [AgentRuntimeStatus](type-aliases/AgentRuntimeStatus.md)
- [AgentRunUpdateInput](type-aliases/AgentRunUpdateInput.md)
- [AgentSandboxPolicy](type-aliases/AgentSandboxPolicy.md)
- [AgentSandboxRuntimeConfig](type-aliases/AgentSandboxRuntimeConfig.md)
- [AgentSandboxScopeKind](type-aliases/AgentSandboxScopeKind.md)
- [AgentSessionConfig](type-aliases/AgentSessionConfig.md)
- [AgentSkillConfig](type-aliases/AgentSkillConfig.md)
- [AgentStreamEmitter](type-aliases/AgentStreamEmitter.md)
- [AgentStreamHarnessResult](type-aliases/AgentStreamHarnessResult.md)
- [AgentStreamObjectOptions](type-aliases/AgentStreamObjectOptions.md)
- [AgentStreamObjectPublishOptions](type-aliases/AgentStreamObjectPublishOptions.md)
- [AgentStreamProtocolAdapterId](type-aliases/AgentStreamProtocolAdapterId.md)
- [AgentStreamResponder](type-aliases/AgentStreamResponder.md)
- [AgentStreamTextOptions](type-aliases/AgentStreamTextOptions.md)
- [AgentStreamTextPublishOptions](type-aliases/AgentStreamTextPublishOptions.md)
- [AgentTaskEmitter](type-aliases/AgentTaskEmitter.md)
- [AgentTerminalResult](type-aliases/AgentTerminalResult.md)
- [AgentTextInputPart](type-aliases/AgentTextInputPart.md)
- [AgentToolExecutorFromInvokeOptions](type-aliases/AgentToolExecutorFromInvokeOptions.md)
- [AgentToolExecutorLogicOptions](type-aliases/AgentToolExecutorLogicOptions.md)
- [AgentWorkerContext](type-aliases/AgentWorkerContext.md)
- [AgentWorkerDefinition](type-aliases/AgentWorkerDefinition.md)
- [AgentWorkflowEmitter](type-aliases/AgentWorkflowEmitter.md)
- [AiSdkEmbedManyOverrides](type-aliases/AiSdkEmbedManyOverrides.md)
- [AiSdkEmbedOverrides](type-aliases/AiSdkEmbedOverrides.md)
- [AiSdkGenerateJsonOverrides](type-aliases/AiSdkGenerateJsonOverrides.md)
- [AiSdkMode](type-aliases/AiSdkMode.md)
- [AiSdkProviderDefaults](type-aliases/AiSdkProviderDefaults.md)
- [AiSdkProviderMetadata](type-aliases/AiSdkProviderMetadata.md)
- [AiSdkProviderOptions](type-aliases/AiSdkProviderOptions.md)
- [AiSdkProviderOverrides](type-aliases/AiSdkProviderOverrides.md)
- [AiSdkRequest](type-aliases/AiSdkRequest.md)
- [AiSdkRequestInput](type-aliases/AiSdkRequestInput.md)
- [AiSdkRerankOverrides](type-aliases/AiSdkRerankOverrides.md)
- [AiSdkStreamEvent](type-aliases/AiSdkStreamEvent.md)
- [AiSdkStreamMode](type-aliases/AiSdkStreamMode.md)
- [AiSdkTool](type-aliases/AiSdkTool.md)
- [AiSdkToolSet](type-aliases/AiSdkToolSet.md)
- [AiSdkUiDataPart](type-aliases/AiSdkUiDataPart.md)
- [AiSdkUiDataPartMapper](type-aliases/AiSdkUiDataPartMapper.md)
- [AiSdkUiDataPartMapperInput](type-aliases/AiSdkUiDataPartMapperInput.md)
- [AllowedAgentDefinition](type-aliases/AllowedAgentDefinition.md)
- [AllowedToolDefinition](type-aliases/AllowedToolDefinition.md)
- [AppleContainerSandboxDriverConfig](type-aliases/AppleContainerSandboxDriverConfig.md)
- [ApprovalDecision](type-aliases/ApprovalDecision.md)
- [ApprovalPendingRecord](type-aliases/ApprovalPendingRecord.md)
- [ApprovalWaitOptions](type-aliases/ApprovalWaitOptions.md)
- [ApprovalWaitResult](type-aliases/ApprovalWaitResult.md)
- [BaseAgentInstanceOptions](type-aliases/BaseAgentInstanceOptions.md)
- [BaseBinding](type-aliases/BaseBinding.md)
- [BaseBindingFactoryInput](type-aliases/BaseBindingFactoryInput.md)
- [BindingDescriptor](type-aliases/BindingDescriptor.md)
- [CommandImplementation](type-aliases/CommandImplementation.md)
- [CommandMap](type-aliases/CommandMap.md)
- [ConversationFrame](type-aliases/ConversationFrame.md)
- [ConversationFramePart](type-aliases/ConversationFramePart.md)
- [ConversationHelpers](type-aliases/ConversationHelpers.md)
- [ConversationHistory](type-aliases/ConversationHistory.md)
- [ConversationMessage](type-aliases/ConversationMessage.md)
- [ConversationRole](type-aliases/ConversationRole.md)
- [ConversationSessionHelpers](type-aliases/ConversationSessionHelpers.md)
- [ConversationState](type-aliases/ConversationState.md)
- [ConversationStoreRecord](type-aliases/ConversationStoreRecord.md)
- [ConversationStoreRecordData](type-aliases/ConversationStoreRecordData.md)
- [ConversationStoreScope](type-aliases/ConversationStoreScope.md)
- [CreateAgentBindingInput](type-aliases/CreateAgentBindingInput.md)
- [CreateAgentContextMockInput](type-aliases/CreateAgentContextMockInput.md)
- [CreateAgentContextMockMessage](type-aliases/CreateAgentContextMockMessage.md)
- [CreateAgentHandlerContextInput](type-aliases/CreateAgentHandlerContextInput.md)
- [CreateAgentTestHarnessOptions](type-aliases/CreateAgentTestHarnessOptions.md)
- [CreateCommandBindingInput](type-aliases/CreateCommandBindingInput.md)
- [CreateEnvelopeInput](type-aliases/CreateEnvelopeInput.md)
- [CreateExternalBindingsInput](type-aliases/CreateExternalBindingsInput.md)
- [CreateInMemorySandboxRegistryOptions](type-aliases/CreateInMemorySandboxRegistryOptions.md)
- [EmbedArgs](type-aliases/EmbedArgs.md)
- [EmbedManyArgs](type-aliases/EmbedManyArgs.md)
- [EnsureSandboxInput](type-aliases/EnsureSandboxInput.md)
- [EnsureSandboxOutput](type-aliases/EnsureSandboxOutput.md)
- [EvaluationResult](type-aliases/EvaluationResult.md)
- [EvaluationSample](type-aliases/EvaluationSample.md)
- [ExecuteBashInput](type-aliases/ExecuteBashInput.md)
- [ExecuteBashOutput](type-aliases/ExecuteBashOutput.md)
- [ExposedAgentInput](type-aliases/ExposedAgentInput.md)
- [ExposedCommandInput](type-aliases/ExposedCommandInput.md)
- [ExposeHelpers](type-aliases/ExposeHelpers.md)
- [ExternalAgentBinding](type-aliases/ExternalAgentBinding.md)
- [ExternalBinding](type-aliases/ExternalBinding.md)
- [ExternalBindingKind](type-aliases/ExternalBindingKind.md)
- [ExternalBindingMetadata](type-aliases/ExternalBindingMetadata.md)
- [ExternalBindingSet](type-aliases/ExternalBindingSet.md)
- [ExternalCommandBinding](type-aliases/ExternalCommandBinding.md)
- [ExternalResultMode](type-aliases/ExternalResultMode.md)
- [ExternalRuntimeMetadata](type-aliases/ExternalRuntimeMetadata.md)
- [FileIngestionContext](type-aliases/FileIngestionContext.md)
- [FileIngestionResult](type-aliases/FileIngestionResult.md)
- [FilesystemSandboxAdapter](type-aliases/FilesystemSandboxAdapter.md)
- [GeneratedExecutionPlan](type-aliases/GeneratedExecutionPlan.md)
- [GenerateTextArgs](type-aliases/GenerateTextArgs.md)
- [GenerateTextOptions](type-aliases/GenerateTextOptions.md)
- [InvokeAgentOptions](type-aliases/InvokeAgentOptions.md)
- [JsonValue](type-aliases/JsonValue.md)
- [LayeredSkillRootInput](type-aliases/LayeredSkillRootInput.md)
- [MCPAgentManifestInput](type-aliases/MCPAgentManifestInput.md)
- [MCPCommandDescriptorInput](type-aliases/MCPCommandDescriptorInput.md)
- [MCPExposeInput](type-aliases/MCPExposeInput.md)
- [MCPManifestInput](type-aliases/MCPManifestInput.md)
- [McpReferenceContent](type-aliases/McpReferenceContent.md)
- [McpReferenceToolResult](type-aliases/McpReferenceToolResult.md)
- [MCPToolDescriptor](type-aliases/MCPToolDescriptor.md)
- [MockJsonMatcher](type-aliases/MockJsonMatcher.md)
- [MockJsonReply](type-aliases/MockJsonReply.md)
- [MockTextMatcher](type-aliases/MockTextMatcher.md)
- [MockTextReply](type-aliases/MockTextReply.md)
- [ModelEmbeddings](type-aliases/ModelEmbeddings.md)
- [ModelInvocationClassification](type-aliases/ModelInvocationClassification.md)
- [ModelInvocationPolicy](type-aliases/ModelInvocationPolicy.md)
- [ModelInvocationRetryPolicy](type-aliases/ModelInvocationRetryPolicy.md)
- [ModelProviderCapabilities](type-aliases/ModelProviderCapabilities.md)
- [ModelProviderCapability](type-aliases/ModelProviderCapability.md)
- [ModelProviderForCapabilities](type-aliases/ModelProviderForCapabilities.md)
- [ModelRerankers](type-aliases/ModelRerankers.md)
- [NestedAgentSpyMap](type-aliases/NestedAgentSpyMap.md)
- [NestedSpyMap](type-aliases/NestedSpyMap.md)
- [PoolAcquireResult](type-aliases/PoolAcquireResult.md)
- [PoolStats](type-aliases/PoolStats.md)
- [ProtocolActor](type-aliases/ProtocolActor.md)
- [ProtocolBufferOptions](type-aliases/ProtocolBufferOptions.md)
- [ProtocolContext](type-aliases/ProtocolContext.md)
- [ProtocolEmitter](type-aliases/ProtocolEmitter.md)
- [ProtocolSseEvent](type-aliases/ProtocolSseEvent.md)
- [ProviderEmbedManyRequest](type-aliases/ProviderEmbedManyRequest.md)
- [ProviderEmbedManyResponse](type-aliases/ProviderEmbedManyResponse.md)
- [ProviderEmbedRequest](type-aliases/ProviderEmbedRequest.md)
- [ProviderEmbedResponse](type-aliases/ProviderEmbedResponse.md)
- [ProviderGenerateTextRequest](type-aliases/ProviderGenerateTextRequest.md)
- [ProviderInvocationMode](type-aliases/ProviderInvocationMode.md)
- [ProviderInvocationPolicy](type-aliases/ProviderInvocationPolicy.md)
- [ProviderJsonOutputFromSchema](type-aliases/ProviderJsonOutputFromSchema.md)
- [ProviderJsonRequest](type-aliases/ProviderJsonRequest.md)
- [ProviderJsonResponse](type-aliases/ProviderJsonResponse.md)
- [ProviderObjectErrorChunk](type-aliases/ProviderObjectErrorChunk.md)
- [ProviderObjectFinalChunk](type-aliases/ProviderObjectFinalChunk.md)
- [ProviderObjectSectionChunk](type-aliases/ProviderObjectSectionChunk.md)
- [ProviderObjectSections](type-aliases/ProviderObjectSections.md)
- [ProviderObjectStatusChunk](type-aliases/ProviderObjectStatusChunk.md)
- [ProviderObjectStream](type-aliases/ProviderObjectStream.md)
- [ProviderObjectStreamChunk](type-aliases/ProviderObjectStreamChunk.md)
- [ProviderObjectStreamRequest](type-aliases/ProviderObjectStreamRequest.md)
- [ProviderRequest](type-aliases/ProviderRequest.md)
- [ProviderRerankRequest](type-aliases/ProviderRerankRequest.md)
- [ProviderRerankResponse](type-aliases/ProviderRerankResponse.md)
- [ProviderResponse](type-aliases/ProviderResponse.md)
- [ProviderStream](type-aliases/ProviderStream.md)
- [ProviderStreamChunk](type-aliases/ProviderStreamChunk.md)
- [PuristaAiPlanArtifact](type-aliases/PuristaAiPlanArtifact.md)
- [PuristaAiPlanStatusArtifact](type-aliases/PuristaAiPlanStatusArtifact.md)
- [PuristaAiTaskArtifact](type-aliases/PuristaAiTaskArtifact.md)
- [PuristaAiTaskChunkArtifact](type-aliases/PuristaAiTaskChunkArtifact.md)
- [PuristaAiWorkflowStageArtifact](type-aliases/PuristaAiWorkflowStageArtifact.md)
- [PuristaProtocolOptions](type-aliases/PuristaProtocolOptions.md)
- [ReflectionAcceptFn](type-aliases/ReflectionAcceptFn.md)
- [ReflectionArtifactPolicy](type-aliases/ReflectionArtifactPolicy.md)
- [ReflectionCritiqueFn](type-aliases/ReflectionCritiqueFn.md)
- [ReflectionDraftFn](type-aliases/ReflectionDraftFn.md)
- [ReflectionLoopOptions](type-aliases/ReflectionLoopOptions.md)
- [ReflectionLoopResult](type-aliases/ReflectionLoopResult.md)
- [ReflectionPolicy](type-aliases/ReflectionPolicy.md)
- [ReflectionPreset](type-aliases/ReflectionPreset.md)
- [ReflectionRefineFn](type-aliases/ReflectionRefineFn.md)
- [ReflectionStopReason](type-aliases/ReflectionStopReason.md)
- [RerankArgs](type-aliases/RerankArgs.md)
- [ResolvedAgentQualityProfile](type-aliases/ResolvedAgentQualityProfile.md)
- [ResolvedReflectionConfig](type-aliases/ResolvedReflectionConfig.md)
- [RetryPolicy](type-aliases/RetryPolicy.md)
- [RunStateContext](type-aliases/RunStateContext.md)
- [RunStateProtocolEmitter](type-aliases/RunStateProtocolEmitter.md)
- [SandboxAdapter](type-aliases/SandboxAdapter.md)
- [SandboxAdapterIdentity](type-aliases/SandboxAdapterIdentity.md)
- [SandboxDescriptor](type-aliases/SandboxDescriptor.md)
- [SandboxFileContent](type-aliases/SandboxFileContent.md)
- [SandboxMetadata](type-aliases/SandboxMetadata.md)
- [SandboxOwner](type-aliases/SandboxOwner.md)
- [SandboxProviderCreateAdapterInput](type-aliases/SandboxProviderCreateAdapterInput.md)
- [SandboxProviderEnsureInput](type-aliases/SandboxProviderEnsureInput.md)
- [SandboxRuntimeDiagnostics](type-aliases/SandboxRuntimeDiagnostics.md)
- [SandboxScope](type-aliases/SandboxScope.md)
- [SandboxSeedFile](type-aliases/SandboxSeedFile.md)
- [SandboxServiceConfig](type-aliases/SandboxServiceConfig.md)
- [SandboxSubject](type-aliases/SandboxSubject.md)
- [SandboxSubjectResolver](type-aliases/SandboxSubjectResolver.md)
- [SandboxSubjectResolverInput](type-aliases/SandboxSubjectResolverInput.md)
- [SandboxWorkspaceLayout](type-aliases/SandboxWorkspaceLayout.md)
- [ScopedSessionIdInput](type-aliases/ScopedSessionIdInput.md)
- [ScriptedChunksReply](type-aliases/ScriptedChunksReply.md)
- [ScriptedErrorReply](type-aliases/ScriptedErrorReply.md)
- [ScriptedJsonReply](type-aliases/ScriptedJsonReply.md)
- [ScriptedReasoningReply](type-aliases/ScriptedReasoningReply.md)
- [ScriptedTextReply](type-aliases/ScriptedTextReply.md)
- [ServiceAiConfig](type-aliases/ServiceAiConfig.md)
- [SessionHelpers](type-aliases/SessionHelpers.md)
- [SetOutputSchema](type-aliases/SetOutputSchema.md)
- [SetParameterSchema](type-aliases/SetParameterSchema.md)
- [SetPayloadSchema](type-aliases/SetPayloadSchema.md)
- [SkillArtifactIndex](type-aliases/SkillArtifactIndex.md)
- [SkillBundle](type-aliases/SkillBundle.md)
- [SkillBundleFile](type-aliases/SkillBundleFile.md)
- [SkillDocument](type-aliases/SkillDocument.md)
- [SkillMetadata](type-aliases/SkillMetadata.md)
- [SkillReferenceDocument](type-aliases/SkillReferenceDocument.md)
- [SkillReferenceSelectionInput](type-aliases/SkillReferenceSelectionInput.md)
- [SkillResource](type-aliases/SkillResource.md)
- [SkillSearchInput](type-aliases/SkillSearchInput.md)
- [SkillSourceInput](type-aliases/SkillSourceInput.md)
- [SkillSourceMap](type-aliases/SkillSourceMap.md)
- [StateStoreHelpers](type-aliases/StateStoreHelpers.md)
- [TestSpan](type-aliases/TestSpan.md)
- [ToAiSdkStreamOptions](type-aliases/ToAiSdkStreamOptions.md)
- [ToAiSdkUiMessageOptions](type-aliases/ToAiSdkUiMessageOptions.md)
- [TokenUsage](type-aliases/TokenUsage.md)
- [ToolInvokeMap](type-aliases/ToolInvokeMap.md)
- [ToolInvoker](type-aliases/ToolInvoker.md)
- [TrajectoryEvaluationResult](type-aliases/TrajectoryEvaluationResult.md)
- [TrajectoryExpectation](type-aliases/TrajectoryExpectation.md)
- [TrajectoryMatchMode](type-aliases/TrajectoryMatchMode.md)
- [WireEvent](type-aliases/WireEvent.md)

## Variables

- [agentProtocolEnvelopeSchema](variables/agentProtocolEnvelopeSchema.md)
- [agentProtocolFrameSchema](variables/agentProtocolFrameSchema.md)
- [agentRoleSchema](variables/agentRoleSchema.md)
- [agentRunCheckpointSchema](variables/agentRunCheckpointSchema.md)
- [agentRunErrorSchema](variables/agentRunErrorSchema.md)
- [agentRunLockSchema](variables/agentRunLockSchema.md)
- [agentRunOwnerSchema](variables/agentRunOwnerSchema.md)
- [agentRunRecoverySchema](variables/agentRunRecoverySchema.md)
- [agentRunRetentionSchema](variables/agentRunRetentionSchema.md)
- [agentRunStateSchema](variables/agentRunStateSchema.md)
- [agentRunStateScopeSchema](variables/agentRunStateScopeSchema.md)
- [agentRunStatusSchema](variables/agentRunStatusSchema.md)
- [agentRunTaskApprovalSchema](variables/agentRunTaskApprovalSchema.md)
- [agentRunTaskExecutorSchema](variables/agentRunTaskExecutorSchema.md)
- [agentRunTaskHandoffSchema](variables/agentRunTaskHandoffSchema.md)
- [agentRunTaskKindSchema](variables/agentRunTaskKindSchema.md)
- [agentRunTaskRetryPolicySchema](variables/agentRunTaskRetryPolicySchema.md)
- [agentRunTaskSchema](variables/agentRunTaskSchema.md)
- [agentRunTaskStatusSchema](variables/agentRunTaskStatusSchema.md)
- [AgentSandboxPolicySchema](variables/AgentSandboxPolicySchema.md)
- [agentSandboxScopeKinds](variables/agentSandboxScopeKinds.md)
- [AgentSandboxScopeKindSchema](variables/AgentSandboxScopeKindSchema.md)
- [artifactFrameSchema](variables/artifactFrameSchema.md)
- [DEFAULT\_SANDBOX\_WORKSPACE\_ROOT](variables/DEFAULT_SANDBOX_WORKSPACE_ROOT.md)
- [defaultAgentModelCapabilities](variables/defaultAgentModelCapabilities.md)
- [defaultModelResourceRegistry](variables/defaultModelResourceRegistry.md)
- [EnsureSandboxInputSchema](variables/EnsureSandboxInputSchema.md)
- [EnsureSandboxOutputSchema](variables/EnsureSandboxOutputSchema.md)
- [errorFrameSchema](variables/errorFrameSchema.md)
- [ExecuteBashInputSchema](variables/ExecuteBashInputSchema.md)
- [ExecuteBashOutputSchema](variables/ExecuteBashOutputSchema.md)
- [generatedExecutionPlanSchema](variables/generatedExecutionPlanSchema.md)
- [jsonValueSchema](variables/jsonValueSchema.md)
- [messageFrameSchema](variables/messageFrameSchema.md)
- [protocolActorSchema](variables/protocolActorSchema.md)
- [protocolVersion](variables/protocolVersion.md)
- [PURISTA\_AI\_PLAN\_ARTIFACT\_ID](variables/PURISTA_AI_PLAN_ARTIFACT_ID.md)
- [PURISTA\_AI\_PLAN\_STATUS\_ARTIFACT\_ID](variables/PURISTA_AI_PLAN_STATUS_ARTIFACT_ID.md)
- [PURISTA\_AI\_TASK\_ARTIFACT\_PREFIX](variables/PURISTA_AI_TASK_ARTIFACT_PREFIX.md)
- [PURISTA\_AI\_TASK\_CHUNK\_ARTIFACT\_PREFIX](variables/PURISTA_AI_TASK_CHUNK_ARTIFACT_PREFIX.md)
- [PURISTA\_AI\_WORKFLOW\_STAGE\_ARTIFACT\_ID](variables/PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID.md)
- [puristaAiPlanArtifactSchema](variables/puristaAiPlanArtifactSchema.md)
- [puristaAiPlanStatusArtifactSchema](variables/puristaAiPlanStatusArtifactSchema.md)
- [puristaAiTaskArtifactSchema](variables/puristaAiTaskArtifactSchema.md)
- [puristaAiTaskChunkArtifactSchema](variables/puristaAiTaskChunkArtifactSchema.md)
- [puristaAiWorkflowStageArtifactSchema](variables/puristaAiWorkflowStageArtifactSchema.md)
- [SandboxDescriptorSchema](variables/SandboxDescriptorSchema.md)
- [sandboxServiceBuilder](variables/sandboxServiceBuilder.md)
- [SandboxSubjectSchema](variables/SandboxSubjectSchema.md)
- [telemetryFrameSchema](variables/telemetryFrameSchema.md)
- [tokenUsageSchema](variables/tokenUsageSchema.md)
- [toolEventFrameSchema](variables/toolEventFrameSchema.md)

## Functions

- [appendMessage](functions/appendMessage.md)
- [assertSandboxRuntimeAvailable](functions/assertSandboxRuntimeAvailable.md)
- [attachmentsToInputParts](functions/attachmentsToInputParts.md)
- [attachmentToConversationPart](functions/attachmentToConversationPart.md)
- [attachmentToInputPart](functions/attachmentToInputPart.md)
- [buildTaskArtifactId](functions/buildTaskArtifactId.md)
- [buildTaskChunkArtifactId](functions/buildTaskChunkArtifactId.md)
- [classifyModelInvocationError](functions/classifyModelInvocationError.md)
- [compileProviderAiSdkSchema](functions/compileProviderAiSdkSchema.md)
- [compileProviderJsonSchema](functions/compileProviderJsonSchema.md)
- [createActor](functions/createActor.md)
- [createAgentApprovalHelpers](functions/createAgentApprovalHelpers.md)
- [createAgentBinding](functions/createAgentBinding.md)
- [createAgentContextMock](functions/createAgentContextMock.md)
- [createAgentHandlerContext](functions/createAgentHandlerContext.md)
- [createAgentInvocationFinalResult](functions/createAgentInvocationFinalResult.md)
- [createAgentPlanHelpers](functions/createAgentPlanHelpers.md)
- [createAgentPolicyHelpers](functions/createAgentPolicyHelpers.md)
- [createAgentReflectionHelpers](functions/createAgentReflectionHelpers.md)
- [createAgentRunStateHelpers](functions/createAgentRunStateHelpers.md)
- [createAgentTerminalResult](functions/createAgentTerminalResult.md)
- [createAgentTestHarness](functions/createAgentTestHarness.md)
- [createAiSdkRequest](functions/createAiSdkRequest.md)
- [createArtifactFrame](functions/createArtifactFrame.md)
- [createBindingsMetadata](functions/createBindingsMetadata.md)
- [createCommandBinding](functions/createCommandBinding.md)
- [createConversationHelpers](functions/createConversationHelpers.md)
- [createEnvelopeFromContext](functions/createEnvelopeFromContext.md)
- [createErrorEnvelopeFromContext](functions/createErrorEnvelopeFromContext.md)
- [createErrorFrame](functions/createErrorFrame.md)
- [createEvaluationResult](functions/createEvaluationResult.md)
- [createExposeHelpers](functions/createExposeHelpers.md)
- [createExternalBindings](functions/createExternalBindings.md)
- [createInlineSkillResource](functions/createInlineSkillResource.md)
- [createInMemorySandboxRegistry](functions/createInMemorySandboxRegistry.md)
- [createInProcessSandboxProvider](functions/createInProcessSandboxProvider.md)
- [createLayeredFileSkillResource](functions/createLayeredFileSkillResource.md)
- [createMessageFrame](functions/createMessageFrame.md)
- [createProtocolBuffer](functions/createProtocolBuffer.md)
- [createProtocolEnvelope](functions/createProtocolEnvelope.md)
- [createPuristaSandboxAdapter](functions/createPuristaSandboxAdapter.md)
- [createPuristaSandboxProvider](functions/createPuristaSandboxProvider.md)
- [createSandboxRepoSeedFiles](functions/createSandboxRepoSeedFiles.md)
- [createSandboxSkillSeedFiles](functions/createSandboxSkillSeedFiles.md)
- [createSandboxWorkspaceLayout](functions/createSandboxWorkspaceLayout.md)
- [createScopedSessionId](functions/createScopedSessionId.md)
- [createTelemetryFrame](functions/createTelemetryFrame.md)
- [createTokenUsage](functions/createTokenUsage.md)
- [createToolEventFrame](functions/createToolEventFrame.md)
- [createUnsafeLocalFilesystemSandboxAdapter](functions/createUnsafeLocalFilesystemSandboxAdapter.md)
- [diffEvaluationResults](functions/diffEvaluationResults.md)
- [evaluateTrajectory](functions/evaluateTrajectory.md)
- [exposeAgentAsMCP](functions/exposeAgentAsMCP.md)
- [exposeAgentAsMCPFromManifest](functions/exposeAgentAsMCPFromManifest.md)
- [exposeCommandAsMCP](functions/exposeCommandAsMCP.md)
- [exposeCommandsAsMCP](functions/exposeCommandsAsMCP.md)
- [exposeToolsAsMCP](functions/exposeToolsAsMCP.md)
- [extractAgentErrorMessage](functions/extractAgentErrorMessage.md)
- [extractArtifactContent](functions/extractArtifactContent.md)
- [extractArtifactJson](functions/extractArtifactJson.md)
- [extractFinalAssistantText](functions/extractFinalAssistantText.md)
- [extractInputPartFromMessagePart](functions/extractInputPartFromMessagePart.md)
- [extractLatestUserMessageInputParts](functions/extractLatestUserMessageInputParts.md)
- [extractLatestUserMessageText](functions/extractLatestUserMessageText.md)
- [extractTextFromMessagePart](functions/extractTextFromMessagePart.md)
- [fromAgent2AgentReferenceMessage](functions/fromAgent2AgentReferenceMessage.md)
- [fromMcpReferenceToolCall](functions/fromMcpReferenceToolCall.md)
- [generateText](functions/generateText.md)
- [getAgentRuntimeStatuses](functions/getAgentRuntimeStatuses.md)
- [getApprovalStateKey](functions/getApprovalStateKey.md)
- [getArtifactFrames](functions/getArtifactFrames.md)
- [getArtifactIds](functions/getArtifactIds.md)
- [getErrorFrames](functions/getErrorFrames.md)
- [getExternalRuntimeMetadata](functions/getExternalRuntimeMetadata.md)
- [getFinalAssistantText](functions/getFinalAssistantText.md)
- [getFrames](functions/getFrames.md)
- [getMessageFrames](functions/getMessageFrames.md)
- [getPayloadSessionId](functions/getPayloadSessionId.md)
- [getRunStateArtifacts](functions/getRunStateArtifacts.md)
- [getSandboxRuntimeDiagnostics](functions/getSandboxRuntimeDiagnostics.md)
- [getTelemetryFrames](functions/getTelemetryFrames.md)
- [getToolFrames](functions/getToolFrames.md)
- [getToolNames](functions/getToolNames.md)
- [getToolOutputs](functions/getToolOutputs.md)
- [ingestAttachment](functions/ingestAttachment.md)
- [invokeAgent](functions/invokeAgent.md)
- [isImageMediaType](functions/isImageMediaType.md)
- [isPuristaAiTaskArtifactId](functions/isPuristaAiTaskArtifactId.md)
- [isPuristaAiTaskChunkArtifactId](functions/isPuristaAiTaskChunkArtifactId.md)
- [isPuristaAiWorkflowArtifactId](functions/isPuristaAiWorkflowArtifactId.md)
- [normalizeAgentInvocationFinalResult](functions/normalizeAgentInvocationFinalResult.md)
- [parseTaskIdFromArtifactId](functions/parseTaskIdFromArtifactId.md)
- [publishAgentManifest](functions/publishAgentManifest.md)
- [readApprovalDecision](functions/readApprovalDecision.md)
- [recordProtocolFrameAsSpan](functions/recordProtocolFrameAsSpan.md)
- [renderSkillDocuments](functions/renderSkillDocuments.md)
- [renderSkillReferences](functions/renderSkillReferences.md)
- [resolveAgentExecutionLimits](functions/resolveAgentExecutionLimits.md)
- [resolveAgentQualityProfile](functions/resolveAgentQualityProfile.md)
- [resolveBaseSessionId](functions/resolveBaseSessionId.md)
- [resolveLayeredSkillRoots](functions/resolveLayeredSkillRoots.md)
- [resolveReflectionPreset](functions/resolveReflectionPreset.md)
- [runBoundedModelInvocation](functions/runBoundedModelInvocation.md)
- [summarizeHistory](functions/summarizeHistory.md)
- [toAgent2AgentReferenceMessage](functions/toAgent2AgentReferenceMessage.md)
- [toAiSdkStreamEvents](functions/toAiSdkStreamEvents.md)
- [toAiSdkTool](functions/toAiSdkTool.md)
- [toAiSdkToolName](functions/toAiSdkToolName.md)
- [toAiSdkTools](functions/toAiSdkTools.md)
- [toAttachmentUrl](functions/toAttachmentUrl.md)
- [toFrameRecord](functions/toFrameRecord.md)
- [toMcpReferenceToolResult](functions/toMcpReferenceToolResult.md)
- [toPlanArtifactPayload](functions/toPlanArtifactPayload.md)
- [toPlanStatusArtifactPayload](functions/toPlanStatusArtifactPayload.md)
- [toProtocolSseEvents](functions/toProtocolSseEvents.md)
- [toSandboxRepoPath](functions/toSandboxRepoPath.md)
- [toSandboxSkillPath](functions/toSandboxSkillPath.md)
- [toTaskArtifactPayload](functions/toTaskArtifactPayload.md)
- [toTaskChunkArtifactPayload](functions/toTaskChunkArtifactPayload.md)
- [toWorkflowStageArtifactPayload](functions/toWorkflowStageArtifactPayload.md)
- [trimHistory](functions/trimHistory.md)
- [validateDataset](functions/validateDataset.md)
- [writeApprovalDecision](functions/writeApprovalDecision.md)

## Drivers

- [AppleContainerSandboxDriver](classes/AppleContainerSandboxDriver.md)
- [DockerSandboxDriver](classes/DockerSandboxDriver.md)
- [SandboxDriver](interfaces/SandboxDriver.md)

## Resources

- [SandboxRegistry](classes/SandboxRegistry.md)

## Schemas

- [BashResultSchema](variables/BashResultSchema.md)
- [SandboxFileContentSchema](variables/SandboxFileContentSchema.md)
- [SandboxMetadataSchema](variables/SandboxMetadataSchema.md)
- [SandboxOwnerSchema](variables/SandboxOwnerSchema.md)
- [SandboxPayloadSchema](variables/SandboxPayloadSchema.md)
- [SandboxScopeSchema](variables/SandboxScopeSchema.md)
- [SandboxServiceConfigSchema](variables/SandboxServiceConfigSchema.md)
