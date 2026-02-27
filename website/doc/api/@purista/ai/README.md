[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/ai

# @purista/ai

## Classes

- [AgentExecutor](classes/AgentExecutor.md)
- [EchoProvider](classes/EchoProvider.md)
- [InMemoryKnowledgeAdapter](classes/InMemoryKnowledgeAdapter.md)
- [InMemorySessionStore](classes/InMemorySessionStore.md)
- [ModelResourceRegistry](classes/ModelResourceRegistry.md)
- [PoolManager](classes/PoolManager.md)

## Interfaces

- [KnowledgeAdapter](interfaces/KnowledgeAdapter.md)
- [ModelProvider](interfaces/ModelProvider.md)
- [SessionStore](interfaces/SessionStore.md)

## Type Aliases

- [AgentBuilder](type-aliases/AgentBuilder.md)
- [AgentDefinition](type-aliases/AgentDefinition.md)
- [AgentExecutionInput](type-aliases/AgentExecutionInput.md)
- [AgentExecutionOptions](type-aliases/AgentExecutionOptions.md)
- [AgentExecutionResult](type-aliases/AgentExecutionResult.md)
- [AgentInfo](type-aliases/AgentInfo.md)
- [AgentManifest](type-aliases/AgentManifest.md)
- [AgentManifestInput](type-aliases/AgentManifestInput.md)
- [AgentManifestRecord](type-aliases/AgentManifestRecord.md)
- [AgentProtocolEnvelope](type-aliases/AgentProtocolEnvelope.md)
- [AgentProtocolFrame](type-aliases/AgentProtocolFrame.md)
- [AgentProtocolRunOptions](type-aliases/AgentProtocolRunOptions.md)
- [AgentRole](type-aliases/AgentRole.md)
- [AgentRuntimeMode](type-aliases/AgentRuntimeMode.md)
- [AllowedToolDefinition](type-aliases/AllowedToolDefinition.md)
- [ConcurrencyPoolConfig](type-aliases/ConcurrencyPoolConfig.md)
- [ConversationFrame](type-aliases/ConversationFrame.md)
- [ConversationHistory](type-aliases/ConversationHistory.md)
- [CreateEnvelopeInput](type-aliases/CreateEnvelopeInput.md)
- [EvaluationProfile](type-aliases/EvaluationProfile.md)
- [KnowledgeAdapterConfig](type-aliases/KnowledgeAdapterConfig.md)
- [KnowledgeDocument](type-aliases/KnowledgeDocument.md)
- [ManifestValidationResult](type-aliases/ManifestValidationResult.md)
- [MemoryAdapterConfig](type-aliases/MemoryAdapterConfig.md)
- [ModelResourceReference](type-aliases/ModelResourceReference.md)
- [ProtocolActor](type-aliases/ProtocolActor.md)
- [ProviderRequest](type-aliases/ProviderRequest.md)
- [ProviderResponse](type-aliases/ProviderResponse.md)
- [PuristaProtocolOptions](type-aliases/PuristaProtocolOptions.md)
- [RetryPolicy](type-aliases/RetryPolicy.md)
- [SessionRecord](type-aliases/SessionRecord.md)
- [SessionRecordData](type-aliases/SessionRecordData.md)
- [StartActiveSpanFunction](type-aliases/StartActiveSpanFunction.md)
- [TelemetryConfig](type-aliases/TelemetryConfig.md)
- [TokenUsage](type-aliases/TokenUsage.md)

## Variables

- [agentProtocolEnvelopeSchema](variables/agentProtocolEnvelopeSchema.md)
- [agentProtocolFrameSchema](variables/agentProtocolFrameSchema.md)
- [agentRoleSchema](variables/agentRoleSchema.md)
- [aiOrchestratorService](variables/aiOrchestratorService.md)
- [aiOrchestratorServiceBuilder](variables/aiOrchestratorServiceBuilder.md)
- [aiOrchestratorServiceInfo](variables/aiOrchestratorServiceInfo.md)
- [aiWorkerService](variables/aiWorkerService.md)
- [aiWorkerServiceBuilder](variables/aiWorkerServiceBuilder.md)
- [aiWorkerServiceInfo](variables/aiWorkerServiceInfo.md)
- [aiWorkloadsQueueBuilder](variables/aiWorkloadsQueueBuilder.md)
- [artifactFrameSchema](variables/artifactFrameSchema.md)
- [errorFrameSchema](variables/errorFrameSchema.md)
- [executeWorkloadQueueWorkerBuilder](variables/executeWorkloadQueueWorkerBuilder.md)
- [messageFrameSchema](variables/messageFrameSchema.md)
- [planWorkloadCommandBuilder](variables/planWorkloadCommandBuilder.md)
- [protocolActorSchema](variables/protocolActorSchema.md)
- [protocolVersion](variables/protocolVersion.md)
- [telemetryFrameSchema](variables/telemetryFrameSchema.md)
- [tokenUsageSchema](variables/tokenUsageSchema.md)
- [toolEventFrameSchema](variables/toolEventFrameSchema.md)

## Functions

- [appendMessage](functions/appendMessage.md)
- [createActor](functions/createActor.md)
- [createArtifactFrame](functions/createArtifactFrame.md)
- [createEnvelopeFromContext](functions/createEnvelopeFromContext.md)
- [createErrorEnvelopeFromContext](functions/createErrorEnvelopeFromContext.md)
- [createErrorFrame](functions/createErrorFrame.md)
- [createMessageFrame](functions/createMessageFrame.md)
- [createProtocolEnvelope](functions/createProtocolEnvelope.md)
- [createTelemetryFrame](functions/createTelemetryFrame.md)
- [createTokenUsage](functions/createTokenUsage.md)
- [createToolEventFrame](functions/createToolEventFrame.md)
- [defineAgent](functions/defineAgent.md)
- [publishAgentManifest](functions/publishAgentManifest.md)
- [recordProtocolFrameAsSpan](functions/recordProtocolFrameAsSpan.md)
- [runAgentWithProtocol](functions/runAgentWithProtocol.md)
- [summarizeHistory](functions/summarizeHistory.md)
- [trimHistory](functions/trimHistory.md)
