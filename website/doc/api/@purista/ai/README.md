[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/ai

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

## Classes

- [AgentBuilder](classes/AgentBuilder.md)
- [AgentExecutor](classes/AgentExecutor.md)
- [AgentInstance](classes/AgentInstance.md)
- [AiSdkProvider](classes/AiSdkProvider.md)
- [FileSkillResource](classes/FileSkillResource.md)
- [FirecrackerSandboxDriver](classes/FirecrackerSandboxDriver.md)
- [InlineSkillResource](classes/InlineSkillResource.md)
- [InMemoryConversationStore](classes/InMemoryConversationStore.md)
- [LimaSandboxDriver](classes/LimaSandboxDriver.md)
- [MockModel](classes/MockModel.md)
- [ModelResourceRegistry](classes/ModelResourceRegistry.md)
- [PassthroughImageFileIngestor](classes/PassthroughImageFileIngestor.md)
- [PodmanSandboxDriver](classes/PodmanSandboxDriver.md)
- [PoolManager](classes/PoolManager.md)
- [SandboxRuntimeUnavailableError](classes/SandboxRuntimeUnavailableError.md)
- [SandboxService](classes/SandboxService.md)
- [ScriptedModel](classes/ScriptedModel.md)
- [TartSandboxDriver](classes/TartSandboxDriver.md)

## Interfaces

- [ConversationStore](interfaces/ConversationStore.md)
- [DockerSandboxDriverConfig](interfaces/DockerSandboxDriverConfig.md)
- [FileIngestor](interfaces/FileIngestor.md)
- [FirecrackerSandboxDriverConfig](interfaces/FirecrackerSandboxDriverConfig.md)
- [LimaSandboxDriverConfig](interfaces/LimaSandboxDriverConfig.md)
- [ModelProvider](interfaces/ModelProvider.md)
- [PodmanSandboxDriverConfig](interfaces/PodmanSandboxDriverConfig.md)
- [TartSandboxDriverConfig](interfaces/TartSandboxDriverConfig.md)

## Type Aliases

- [Agent2AgentReferenceMessage](type-aliases/Agent2AgentReferenceMessage.md)
- [AgentAfterGuardHook](type-aliases/AgentAfterGuardHook.md)
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
- [AgentDeclaredResourceMap](type-aliases/AgentDeclaredResourceMap.md)
- [AgentDefinition](type-aliases/AgentDefinition.md)
- [AgentExecutionCleanupPolicy](type-aliases/AgentExecutionCleanupPolicy.md)
- [AgentExecutionHttpBehavior](type-aliases/AgentExecutionHttpBehavior.md)
- [AgentExecutionInput](type-aliases/AgentExecutionInput.md)
- [AgentExecutionMode](type-aliases/AgentExecutionMode.md)
- [AgentExecutionOptions](type-aliases/AgentExecutionOptions.md)
- [AgentExecutionPolicy](type-aliases/AgentExecutionPolicy.md)
- [AgentExecutionRecoveryPolicy](type-aliases/AgentExecutionRecoveryPolicy.md)
- [AgentExecutionResult](type-aliases/AgentExecutionResult.md)
- [AgentFileInputPart](type-aliases/AgentFileInputPart.md)
- [AgentForwardingOptions](type-aliases/AgentForwardingOptions.md)
- [AgentForwardInvocationOptions](type-aliases/AgentForwardInvocationOptions.md)
- [AgentHandler](type-aliases/AgentHandler.md)
- [AgentHandlerContext](type-aliases/AgentHandlerContext.md)
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
- [AgentInvocationOptions](type-aliases/AgentInvocationOptions.md)
- [AgentInvokeConfig](type-aliases/AgentInvokeConfig.md)
- [AgentInvokeContext](type-aliases/AgentInvokeContext.md)
- [AgentInvokeRequest](type-aliases/AgentInvokeRequest.md)
- [AgentInvokeResult](type-aliases/AgentInvokeResult.md)
- [AgentManifest](type-aliases/AgentManifest.md)
- [AgentMap](type-aliases/AgentMap.md)
- [AgentModelBinding](type-aliases/AgentModelBinding.md)
- [AgentModelCallKind](type-aliases/AgentModelCallKind.md)
- [AgentModelCallOptions](type-aliases/AgentModelCallOptions.md)
- [AgentModelCallPrepareInput](type-aliases/AgentModelCallPrepareInput.md)
- [AgentModelCapability](type-aliases/AgentModelCapability.md)
- [AgentPolicy](type-aliases/AgentPolicy.md)
- [AgentPolicyHelpers](type-aliases/AgentPolicyHelpers.md)
- [AgentPrepareCallHook](type-aliases/AgentPrepareCallHook.md)
- [AgentPrepareStepHook](type-aliases/AgentPrepareStepHook.md)
- [AgentProtocolBuffer](type-aliases/AgentProtocolBuffer.md)
- [AgentProtocolEnvelope](type-aliases/AgentProtocolEnvelope.md)
- [AgentProtocolFrame](type-aliases/AgentProtocolFrame.md)
- [AgentProtocolRunOptions](type-aliases/AgentProtocolRunOptions.md)
- [AgentQualityPolicy](type-aliases/AgentQualityPolicy.md)
- [AgentQualityProfile](type-aliases/AgentQualityProfile.md)
- [AgentReflectionHelpers](type-aliases/AgentReflectionHelpers.md)
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
- [AgentRunTaskInput](type-aliases/AgentRunTaskInput.md)
- [AgentRunTaskStatus](type-aliases/AgentRunTaskStatus.md)
- [AgentRuntimeDependencies](type-aliases/AgentRuntimeDependencies.md)
- [AgentRuntimeDependenciesTyped](type-aliases/AgentRuntimeDependenciesTyped.md)
- [AgentRuntimeInstance](type-aliases/AgentRuntimeInstance.md)
- [AgentRuntimeStatus](type-aliases/AgentRuntimeStatus.md)
- [AgentRunUpdateInput](type-aliases/AgentRunUpdateInput.md)
- [AgentSessionConfig](type-aliases/AgentSessionConfig.md)
- [AgentSkillConfig](type-aliases/AgentSkillConfig.md)
- [AgentSseProtocol](type-aliases/AgentSseProtocol.md)
- [AgentStreamEmitter](type-aliases/AgentStreamEmitter.md)
- [AgentStreamHarnessResult](type-aliases/AgentStreamHarnessResult.md)
- [AgentStreamResponder](type-aliases/AgentStreamResponder.md)
- [AgentTerminalResult](type-aliases/AgentTerminalResult.md)
- [AgentTextInputPart](type-aliases/AgentTextInputPart.md)
- [AiSdkEmbedManyOverrides](type-aliases/AiSdkEmbedManyOverrides.md)
- [AiSdkEmbedOverrides](type-aliases/AiSdkEmbedOverrides.md)
- [AiSdkGenerateJsonOverrides](type-aliases/AiSdkGenerateJsonOverrides.md)
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
- [DeclaredModelAliasApi](type-aliases/DeclaredModelAliasApi.md)
- [DeclaredModelMap](type-aliases/DeclaredModelMap.md)
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
- [GenerateTextArgs](type-aliases/GenerateTextArgs.md)
- [GenerateTextOptions](type-aliases/GenerateTextOptions.md)
- [InvokeAgentOptions](type-aliases/InvokeAgentOptions.md)
- [LayeredSkillRootInput](type-aliases/LayeredSkillRootInput.md)
- [MCPCommandDescriptorInput](type-aliases/MCPCommandDescriptorInput.md)
- [MCPExposeInput](type-aliases/MCPExposeInput.md)
- [McpReferenceContent](type-aliases/McpReferenceContent.md)
- [McpReferenceToolResult](type-aliases/McpReferenceToolResult.md)
- [MCPToolDescriptor](type-aliases/MCPToolDescriptor.md)
- [MockJsonMatcher](type-aliases/MockJsonMatcher.md)
- [MockJsonReply](type-aliases/MockJsonReply.md)
- [MockTextMatcher](type-aliases/MockTextMatcher.md)
- [MockTextReply](type-aliases/MockTextReply.md)
- [ModelInvocationClassification](type-aliases/ModelInvocationClassification.md)
- [ModelInvocationPolicy](type-aliases/ModelInvocationPolicy.md)
- [ModelInvocationRetryPolicy](type-aliases/ModelInvocationRetryPolicy.md)
- [ModelProviderCapabilities](type-aliases/ModelProviderCapabilities.md)
- [ModelProviderCapability](type-aliases/ModelProviderCapability.md)
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
- [ResolveCapability](type-aliases/ResolveCapability.md)
- [ResolvedAgentQualityProfile](type-aliases/ResolvedAgentQualityProfile.md)
- [ResolvedReflectionConfig](type-aliases/ResolvedReflectionConfig.md)
- [RetryPolicy](type-aliases/RetryPolicy.md)
- [RunStateContext](type-aliases/RunStateContext.md)
- [RunStateProtocolEmitter](type-aliases/RunStateProtocolEmitter.md)
- [SandboxAdapter](type-aliases/SandboxAdapter.md)
- [SandboxAdapterIdentity](type-aliases/SandboxAdapterIdentity.md)
- [SandboxMetadata](type-aliases/SandboxMetadata.md)
- [SandboxOwner](type-aliases/SandboxOwner.md)
- [SandboxRuntimeDiagnostics](type-aliases/SandboxRuntimeDiagnostics.md)
- [SandboxScope](type-aliases/SandboxScope.md)
- [SandboxSeedFile](type-aliases/SandboxSeedFile.md)
- [SandboxServiceConfig](type-aliases/SandboxServiceConfig.md)
- [SandboxWorkspaceLayout](type-aliases/SandboxWorkspaceLayout.md)
- [ScopedSessionIdInput](type-aliases/ScopedSessionIdInput.md)
- [ScriptedChunksReply](type-aliases/ScriptedChunksReply.md)
- [ScriptedErrorReply](type-aliases/ScriptedErrorReply.md)
- [ScriptedJsonReply](type-aliases/ScriptedJsonReply.md)
- [ScriptedReasoningReply](type-aliases/ScriptedReasoningReply.md)
- [ScriptedTextReply](type-aliases/ScriptedTextReply.md)
- [SessionHelpers](type-aliases/SessionHelpers.md)
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
- [StartActiveSpanFunction](type-aliases/StartActiveSpanFunction.md)
- [StateStoreHelpers](type-aliases/StateStoreHelpers.md)
- [TestSpan](type-aliases/TestSpan.md)
- [ToAiSdkStreamOptions](type-aliases/ToAiSdkStreamOptions.md)
- [ToAiSdkUiMessageOptions](type-aliases/ToAiSdkUiMessageOptions.md)
- [TokenUsage](type-aliases/TokenUsage.md)
- [ToolInvoker](type-aliases/ToolInvoker.md)
- [TrajectoryEvaluationResult](type-aliases/TrajectoryEvaluationResult.md)
- [TrajectoryExpectation](type-aliases/TrajectoryExpectation.md)
- [TrajectoryMatchMode](type-aliases/TrajectoryMatchMode.md)

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
- [agentRunTaskSchema](variables/agentRunTaskSchema.md)
- [agentRunTaskStatusSchema](variables/agentRunTaskStatusSchema.md)
- [aiOrchestratorService](variables/aiOrchestratorService.md)
- [aiOrchestratorServiceBuilder](variables/aiOrchestratorServiceBuilder.md)
- [aiOrchestratorServiceInfo](variables/aiOrchestratorServiceInfo.md)
- [aiWorkerService](variables/aiWorkerService.md)
- [aiWorkerServiceBuilder](variables/aiWorkerServiceBuilder.md)
- [aiWorkerServiceInfo](variables/aiWorkerServiceInfo.md)
- [aiWorkloadsQueueBuilder](variables/aiWorkloadsQueueBuilder.md)
- [artifactFrameSchema](variables/artifactFrameSchema.md)
- [DEFAULT\_SANDBOX\_WORKSPACE\_ROOT](variables/DEFAULT_SANDBOX_WORKSPACE_ROOT.md)
- [defaultModelResourceRegistry](variables/defaultModelResourceRegistry.md)
- [enqueueRunCommandBuilder](variables/enqueueRunCommandBuilder.md)
- [EnsureSandboxInputSchema](variables/EnsureSandboxInputSchema.md)
- [EnsureSandboxOutputSchema](variables/EnsureSandboxOutputSchema.md)
- [errorFrameSchema](variables/errorFrameSchema.md)
- [ExecuteBashInputSchema](variables/ExecuteBashInputSchema.md)
- [ExecuteBashOutputSchema](variables/ExecuteBashOutputSchema.md)
- [executeWorkloadQueueWorkerBuilder](variables/executeWorkloadQueueWorkerBuilder.md)
- [messageFrameSchema](variables/messageFrameSchema.md)
- [planWorkloadCommandBuilder](variables/planWorkloadCommandBuilder.md)
- [protocolActorSchema](variables/protocolActorSchema.md)
- [protocolVersion](variables/protocolVersion.md)
- [sandboxServiceBuilder](variables/sandboxServiceBuilder.md)
- [telemetryFrameSchema](variables/telemetryFrameSchema.md)
- [tokenUsageSchema](variables/tokenUsageSchema.md)
- [toolEventFrameSchema](variables/toolEventFrameSchema.md)

## Functions

- [appendMessage](functions/appendMessage.md)
- [assertSandboxRuntimeAvailable](functions/assertSandboxRuntimeAvailable.md)
- [attachmentsToInputParts](functions/attachmentsToInputParts.md)
- [attachmentToConversationPart](functions/attachmentToConversationPart.md)
- [attachmentToInputPart](functions/attachmentToInputPart.md)
- [classifyModelInvocationError](functions/classifyModelInvocationError.md)
- [compileProviderAiSdkSchema](functions/compileProviderAiSdkSchema.md)
- [compileProviderJsonSchema](functions/compileProviderJsonSchema.md)
- [createActor](functions/createActor.md)
- [createAgentApprovalHelpers](functions/createAgentApprovalHelpers.md)
- [createAgentBinding](functions/createAgentBinding.md)
- [createAgentContextMock](functions/createAgentContextMock.md)
- [createAgentHandlerContext](functions/createAgentHandlerContext.md)
- [createAgentPolicyHelpers](functions/createAgentPolicyHelpers.md)
- [createAgentReflectionHelpers](functions/createAgentReflectionHelpers.md)
- [createAgentRunStateHelpers](functions/createAgentRunStateHelpers.md)
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
- [createLayeredFileSkillResource](functions/createLayeredFileSkillResource.md)
- [createLocalFilesystemSandboxAdapter](functions/createLocalFilesystemSandboxAdapter.md)
- [createMessageFrame](functions/createMessageFrame.md)
- [createProtocolBuffer](functions/createProtocolBuffer.md)
- [createProtocolEnvelope](functions/createProtocolEnvelope.md)
- [createPuristaSandboxAdapter](functions/createPuristaSandboxAdapter.md)
- [createSandboxRepoSeedFiles](functions/createSandboxRepoSeedFiles.md)
- [createSandboxSkillSeedFiles](functions/createSandboxSkillSeedFiles.md)
- [createSandboxWorkspaceLayout](functions/createSandboxWorkspaceLayout.md)
- [createScopedSessionId](functions/createScopedSessionId.md)
- [createTelemetryFrame](functions/createTelemetryFrame.md)
- [createTokenUsage](functions/createTokenUsage.md)
- [createToolEventFrame](functions/createToolEventFrame.md)
- [diffEvaluationResults](functions/diffEvaluationResults.md)
- [evaluateTrajectory](functions/evaluateTrajectory.md)
- [exposeAgentAsMCP](functions/exposeAgentAsMCP.md)
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
- [getUnsupportedWorkerAiSdkReason](functions/getUnsupportedWorkerAiSdkReason.md)
- [ingestAttachment](functions/ingestAttachment.md)
- [invokeAgent](functions/invokeAgent.md)
- [isImageMediaType](functions/isImageMediaType.md)
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
- [runAgentWithProtocol](functions/runAgentWithProtocol.md)
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
- [toProtocolSseEvents](functions/toProtocolSseEvents.md)
- [toSandboxRepoPath](functions/toSandboxRepoPath.md)
- [toSandboxSkillPath](functions/toSandboxSkillPath.md)
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
- [SandboxMetadataSchema](variables/SandboxMetadataSchema.md)
- [SandboxOwnerSchema](variables/SandboxOwnerSchema.md)
- [SandboxPayloadSchema](variables/SandboxPayloadSchema.md)
- [SandboxScopeSchema](variables/SandboxScopeSchema.md)
- [SandboxServiceConfigSchema](variables/SandboxServiceConfigSchema.md)
