[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/core

# PURISTA

A backend framework for building message based domain services.

This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, event sourcing and lambda functions.

It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, OpenApi documentation (swagger).

## Why to use PURISTA

PURISTA tries to avoid the need for implementing boilerplate code as much as possible and to automate and autogenerate types, definitions, documentation when ever possible.

Schema and input-output-validation are deeply integrated, and they should be used whenever possible to build robust, stable systems.

PURISTA addresses developers which want to simply focus on implementation, while providing them the necessary things to use the great node/typescript tooling.

### Features

- typescript based and with typescript in mind
- mostly async-await (no call-back hell)
- easy versioning of services & API
- modular & extendable
- runs and scales from small single instance up to cloud clusters
- flexible to trace, audit and monitor
- easy to test with ready to go mocks & stubs
- clean error handling
- low learning curve

**The main goal is to let developers keep focusing on solving business requirements while building robust & maintainable software fast and efficient.**

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

This is the main package of PURISTA.

A backend framework for building message based domain services.

This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, event sourcing and lambda functions.

It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, OpenApi documentation (swagger).

It contains the builders, classes & types and some helper functions.
For easier testing of commands and subscriptions, the package contains different mock creation helper based on [sinon](https://sinonjs.org)

Learn PURIST at [purista.dev](https://purista.dev)

## Enumerations

- [EBMessageType](enumerations/EBMessageType.md)
- [EventBridgeLateResponseHandling](enumerations/EventBridgeLateResponseHandling.md)
- [PuristaSpanName](enumerations/PuristaSpanName.md)
- [PuristaSpanTag](enumerations/PuristaSpanTag.md)
- [StatusCode](enumerations/StatusCode.md)
- [StoreType](enumerations/StoreType.md)

## Classes

- [ClientBuilder](classes/ClientBuilder.md)
- [DefaultLogger](classes/DefaultLogger.md)
- [DefaultQueueBridge](classes/DefaultQueueBridge.md)
- [GenericEventEmitter](classes/GenericEventEmitter.md)
- [HandledError](classes/HandledError.md)
- [HttpClient](classes/HttpClient.md)
- [InFlightExecutionTracker](classes/InFlightExecutionTracker.md)
- [Logger](classes/Logger.md)
- [PendingInvocationRegistry](classes/PendingInvocationRegistry.md)
- [QueueDefinitionBuilder](classes/QueueDefinitionBuilder.md)
- [QueueWorkerBuilder](classes/QueueWorkerBuilder.md)
- [StreamDefinitionBuilder](classes/StreamDefinitionBuilder.md)
- [UnhandledError](classes/UnhandledError.md)

## Interfaces

- [GlobalContext](interfaces/GlobalContext.md)
- [IEmitter](interfaces/IEmitter.md)
- [ILogger](interfaces/ILogger.md)
- [QueueBridge](interfaces/QueueBridge.md)
- [RestClient](interfaces/RestClient.md)
- [StreamHandle](interfaces/StreamHandle.md)
- [StreamWriter](interfaces/StreamWriter.md)
- [TransformSchemaObjectOptions](interfaces/TransformSchemaObjectOptions.md)

## Type Aliases

- [addPrefixToObject](type-aliases/addPrefixToObject.md)
- [AuthCredentials](type-aliases/AuthCredentials.md)
- [BrokerHeaderCommandMsg](type-aliases/BrokerHeaderCommandMsg.md)
- [BrokerHeaderCommandResponseMsg](type-aliases/BrokerHeaderCommandResponseMsg.md)
- [BrokerHeaderCustomMsg](type-aliases/BrokerHeaderCustomMsg.md)
- [ClientBuilderConfig](type-aliases/ClientBuilderConfig.md)
- [ClientBuilderEvents](type-aliases/ClientBuilderEvents.md)
- [Command](type-aliases/Command.md)
- [CommandAgentInvokeConfig](type-aliases/CommandAgentInvokeConfig.md)
- [CommandContextMockResult](type-aliases/CommandContextMockResult.md)
- [CommandDefinitionBuilderTypes](type-aliases/CommandDefinitionBuilderTypes.md)
- [CommandDefinitionList](type-aliases/CommandDefinitionList.md)
- [CommandDefinitionListResolved](type-aliases/CommandDefinitionListResolved.md)
- [CommandDefinitionMetadataBase](type-aliases/CommandDefinitionMetadataBase.md)
- [Complete](type-aliases/Complete.md)
- [CompressionMethod](type-aliases/CompressionMethod.md)
- [Config](type-aliases/Config.md)
- [ConfigFull](type-aliases/ConfigFull.md)
- [ConfigStoreCacheMap](type-aliases/ConfigStoreCacheMap.md)
- [Constructor](type-aliases/Constructor.md)
- [ContentType](type-aliases/ContentType.md)
- [ContextBase](type-aliases/ContextBase.md)
- [CorrelationId](type-aliases/CorrelationId.md)
- [CreateCommandContextMockInput](type-aliases/CreateCommandContextMockInput.md)
- [CreateCommandTestHarnessOptions](type-aliases/CreateCommandTestHarnessOptions.md)
- [CreateQueueWorkerContextMockInput](type-aliases/CreateQueueWorkerContextMockInput.md)
- [CreateStreamContextMockInput](type-aliases/CreateStreamContextMockInput.md)
- [CreateSubscriptionContextMockInput](type-aliases/CreateSubscriptionContextMockInput.md)
- [CustomMessage](type-aliases/CustomMessage.md)
- [DefaultConfigStoreConfig](type-aliases/DefaultConfigStoreConfig.md)
- [DefaultEventBridgeConfig](type-aliases/DefaultEventBridgeConfig.md)
- [DefaultQueueBridgeOptions](type-aliases/DefaultQueueBridgeOptions.md)
- [DefaultSecretStoreConfig](type-aliases/DefaultSecretStoreConfig.md)
- [DefaultStateStoreConfig](type-aliases/DefaultStateStoreConfig.md)
- [DefinitionEventBridgeConfig](type-aliases/DefinitionEventBridgeConfig.md)
- [DefinitionEventBridgeConsumerFailureHandling](type-aliases/DefinitionEventBridgeConsumerFailureHandling.md)
- [DefinitionEventBridgeConsumerFailureMode](type-aliases/DefinitionEventBridgeConsumerFailureMode.md)
- [DefinitionQueueBridgeConfig](type-aliases/DefinitionQueueBridgeConfig.md)
- [EBMessage](type-aliases/EBMessage.md)
- [EBMessageAddress](type-aliases/EBMessageAddress.md)
- [EBMessageBase](type-aliases/EBMessageBase.md)
- [EBMessageId](type-aliases/EBMessageId.md)
- [EBMessageSenderAddress](type-aliases/EBMessageSenderAddress.md)
- [EmitCustomMessageFunction](type-aliases/EmitCustomMessageFunction.md)
- [EmitSchemaList](type-aliases/EmitSchemaList.md)
- [EmptyObject](type-aliases/EmptyObject.md)
- [ErrorResponsePayload](type-aliases/ErrorResponsePayload.md)
- [EventBridgeCapabilities](type-aliases/EventBridgeCapabilities.md)
- [EventBridgeConfig](type-aliases/EventBridgeConfig.md)
- [EventBridgeConsumerFailureCapabilities](type-aliases/EventBridgeConsumerFailureCapabilities.md)
- [EventKey](type-aliases/EventKey.md)
- [EventMap](type-aliases/EventMap.md)
- [EventReceiver](type-aliases/EventReceiver.md)
- [FromEmitToOtherType](type-aliases/FromEmitToOtherType.md)
- [FromInvokeToOtherType](type-aliases/FromInvokeToOtherType.md)
- [FullDefinition](type-aliases/FullDefinition.md)
- [FullServiceDefinition](type-aliases/FullServiceDefinition.md)
- [GetMessageParamsType](type-aliases/GetMessageParamsType.md)
- [GetMessagePayloadType](type-aliases/GetMessagePayloadType.md)
- [HttpClientConfig](type-aliases/HttpClientConfig.md)
- [HttpClientRequestOptions](type-aliases/HttpClientRequestOptions.md)
- [HttpExposedServiceMeta](type-aliases/HttpExposedServiceMeta.md)
- [HttpExposureOptions](type-aliases/HttpExposureOptions.md)
- [Infer](type-aliases/Infer.md)
- [InferIn](type-aliases/InferIn.md)
- [InferParameter](type-aliases/InferParameter.md)
- [InferPayload](type-aliases/InferPayload.md)
- [InferTypeOrEmptyObject](type-aliases/InferTypeOrEmptyObject.md)
- [InfoInvokeTimeout](type-aliases/InfoInvokeTimeout.md)
- [InfoInvokeTimeoutPayload](type-aliases/InfoInvokeTimeoutPayload.md)
- [InfoMessage](type-aliases/InfoMessage.md)
- [InfoMessageType](type-aliases/InfoMessageType.md)
- [InfoServiceBase](type-aliases/InfoServiceBase.md)
- [InfoServiceDrain](type-aliases/InfoServiceDrain.md)
- [InfoServiceFunctionAdded](type-aliases/InfoServiceFunctionAdded.md)
- [InfoServiceInit](type-aliases/InfoServiceInit.md)
- [InfoServiceNotReady](type-aliases/InfoServiceNotReady.md)
- [InfoServiceReady](type-aliases/InfoServiceReady.md)
- [InfoServiceShutdown](type-aliases/InfoServiceShutdown.md)
- [InfoSubscriptionError](type-aliases/InfoSubscriptionError.md)
- [InstanceConfigType](type-aliases/InstanceConfigType.md)
- [InstanceId](type-aliases/InstanceId.md)
- [InstanceOrType](type-aliases/InstanceOrType.md)
- [InvokeFunction](type-aliases/InvokeFunction.md)
- [InvokeList](type-aliases/InvokeList.md)
- [InvokeValidationMap](type-aliases/InvokeValidationMap.md)
- [IsConstructor](type-aliases/IsConstructor.md)
- [JsonSchemaOptions](type-aliases/JsonSchemaOptions.md)
- [LogFnParamType](type-aliases/LogFnParamType.md)
- [LoggerOptions](type-aliases/LoggerOptions.md)
- [LoggerStubs](type-aliases/LoggerStubs.md)
- [LogLevelName](type-aliases/LogLevelName.md)
- [NeverObject](type-aliases/NeverObject.md)
- [Newable](type-aliases/Newable.md)
- [NonEmptyString](type-aliases/NonEmptyString.md)
- [ObjectWithKeysFromStringArray](type-aliases/ObjectWithKeysFromStringArray.md)
- [OpenApiZodAny](type-aliases/OpenApiZodAny.md)
- [OpenStreamFunction](type-aliases/OpenStreamFunction.md)
- [PendigInvocation](type-aliases/PendigInvocation.md)
- [PendingStreamInvocation](type-aliases/PendingStreamInvocation.md)
- [Prettify](type-aliases/Prettify.md)
- [PrincipalId](type-aliases/PrincipalId.md)
- [QueryParameter](type-aliases/QueryParameter.md)
- [QueueBridgeCapabilities](type-aliases/QueueBridgeCapabilities.md)
- [QueueContext](type-aliases/QueueContext.md)
- [QueueDeadLetterListOptions](type-aliases/QueueDeadLetterListOptions.md)
- [QueueDeadLetterRedriveOptions](type-aliases/QueueDeadLetterRedriveOptions.md)
- [QueueDefinition](type-aliases/QueueDefinition.md)
- [QueueDefinitionList](type-aliases/QueueDefinitionList.md)
- [QueueDefinitionListResolved](type-aliases/QueueDefinitionListResolved.md)
- [QueueEnqueueOptions](type-aliases/QueueEnqueueOptions.md)
- [QueueEnqueueResult](type-aliases/QueueEnqueueResult.md)
- [QueueHandlerResult](type-aliases/QueueHandlerResult.md)
- [QueueHealthState](type-aliases/QueueHealthState.md)
- [QueueHealthStatus](type-aliases/QueueHealthStatus.md)
- [QueueInvokeClientMap](type-aliases/QueueInvokeClientMap.md)
- [QueueInvokeFunction](type-aliases/QueueInvokeFunction.md)
- [QueueInvokeList](type-aliases/QueueInvokeList.md)
- [QueueJobContext](type-aliases/QueueJobContext.md)
- [QueueJobControls](type-aliases/QueueJobControls.md)
- [QueueLease](type-aliases/QueueLease.md)
- [QueueLeaseInspectionRecord](type-aliases/QueueLeaseInspectionRecord.md)
- [QueueLeaseOptions](type-aliases/QueueLeaseOptions.md)
- [QueueLifecycleConfig](type-aliases/QueueLifecycleConfig.md)
- [QueueMessage](type-aliases/QueueMessage.md)
- [QueueMetrics](type-aliases/QueueMetrics.md)
- [QueueOrderingGuarantee](type-aliases/QueueOrderingGuarantee.md)
- [QueueRetryRequest](type-aliases/QueueRetryRequest.md)
- [QueueRetryStrategy](type-aliases/QueueRetryStrategy.md)
- [QueueScheduleFunction](type-aliases/QueueScheduleFunction.md)
- [QueueScheduleProxy](type-aliases/QueueScheduleProxy.md)
- [QueueTransformContext](type-aliases/QueueTransformContext.md)
- [QueueTransformHook](type-aliases/QueueTransformHook.md)
- [QueueWorkerAfterGuardHook](type-aliases/QueueWorkerAfterGuardHook.md)
- [QueueWorkerBeforeGuardHook](type-aliases/QueueWorkerBeforeGuardHook.md)
- [QueueWorkerContextMockResult](type-aliases/QueueWorkerContextMockResult.md)
- [QueueWorkerDefinition](type-aliases/QueueWorkerDefinition.md)
- [QueueWorkerDefinitionList](type-aliases/QueueWorkerDefinitionList.md)
- [QueueWorkerDefinitionListResolved](type-aliases/QueueWorkerDefinitionListResolved.md)
- [QueueWorkerHandler](type-aliases/QueueWorkerHandler.md)
- [QueueWorkerMode](type-aliases/QueueWorkerMode.md)
- [Schema](type-aliases/Schema.md)
- [SecretStoreCacheMap](type-aliases/SecretStoreCacheMap.md)
- [ServiceBuilderTypes](type-aliases/ServiceBuilderTypes.md)
- [ServiceClassTypes](type-aliases/ServiceClassTypes.md)
- [ServiceDefinitions](type-aliases/ServiceDefinitions.md)
- [ServiceHealthState](type-aliases/ServiceHealthState.md)
- [ServiceHealthStatus](type-aliases/ServiceHealthStatus.md)
- [ServiceInfoType](type-aliases/ServiceInfoType.md)
- [SetNewTypeValue](type-aliases/SetNewTypeValue.md)
- [SetNewTypeValues](type-aliases/SetNewTypeValues.md)
- [ShutdownEntry](type-aliases/ShutdownEntry.md)
- [StoreBaseConfig](type-aliases/StoreBaseConfig.md)
- [StreamAgentInvokeConfig](type-aliases/StreamAgentInvokeConfig.md)
- [StreamContextMockResult](type-aliases/StreamContextMockResult.md)
- [StreamControl](type-aliases/StreamControl.md)
- [StreamControlPayload](type-aliases/StreamControlPayload.md)
- [StreamDefinition](type-aliases/StreamDefinition.md)
- [StreamDefinitionBuilderTypes](type-aliases/StreamDefinitionBuilderTypes.md)
- [StreamDefinitionList](type-aliases/StreamDefinitionList.md)
- [StreamDefinitionListResolved](type-aliases/StreamDefinitionListResolved.md)
- [StreamDefinitionMetadataBase](type-aliases/StreamDefinitionMetadataBase.md)
- [StreamErrorPayload](type-aliases/StreamErrorPayload.md)
- [StreamFrame](type-aliases/StreamFrame.md)
- [StreamFramePayload](type-aliases/StreamFramePayload.md)
- [StreamFrameType](type-aliases/StreamFrameType.md)
- [StreamFunction](type-aliases/StreamFunction.md)
- [StreamFunctionContext](type-aliases/StreamFunctionContext.md)
- [StreamFunctionContextEnhancements](type-aliases/StreamFunctionContextEnhancements.md)
- [StreamInvokeList](type-aliases/StreamInvokeList.md)
- [StreamMessage](type-aliases/StreamMessage.md)
- [StreamOpenRequest](type-aliases/StreamOpenRequest.md)
- [StreamOpenRequestPayload](type-aliases/StreamOpenRequestPayload.md)
- [SubscriptionAgentInvokeConfig](type-aliases/SubscriptionAgentInvokeConfig.md)
- [SubscriptionContextMockResult](type-aliases/SubscriptionContextMockResult.md)
- [SubscriptionDefinitionBuilderTypes](type-aliases/SubscriptionDefinitionBuilderTypes.md)
- [SubscriptionDefinitionList](type-aliases/SubscriptionDefinitionList.md)
- [SubscriptionDefinitionListResolved](type-aliases/SubscriptionDefinitionListResolved.md)
- [SubscriptionDefinitionMetadataBase](type-aliases/SubscriptionDefinitionMetadataBase.md)
- [SubscriptionStorageEntry](type-aliases/SubscriptionStorageEntry.md)
- [SupportedHttpMethod](type-aliases/SupportedHttpMethod.md)
- [TenantId](type-aliases/TenantId.md)
- [TraceId](type-aliases/TraceId.md)
- [ValidationResult](type-aliases/ValidationResult.md)

## Variables

- [CONFIG\_FILE\_NAME](variables/CONFIG_FILE_NAME.md)
- [configFullSchema](variables/configFullSchema.md)
- [configSchema](variables/configSchema.md)
- [defaultQueueLifecycleConfig](variables/defaultQueueLifecycleConfig.md)
- [eventBridgeClientConfigSchema](variables/eventBridgeClientConfigSchema.md)
- [httpClientConfigSchema](variables/httpClientConfigSchema.md)
- [infoMessageTypes](variables/infoMessageTypes.md)
- [MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION](variables/MIN_CONTENT_SIZE_FOR_COMPRESSION.md)
- [puristaVersion](variables/puristaVersion.md)
- [ServiceInfoValidator](variables/ServiceInfoValidator.md)

## Functions

- [assertNonArrowFunction](functions/assertNonArrowFunction.md)
- [convertEmitValidationsToSchema](functions/convertEmitValidationsToSchema.md)
- [convertInvokeValidationsToSchema](functions/convertInvokeValidationsToSchema.md)
- [createInvokeFunctionProxy](functions/createInvokeFunctionProxy.md)
- [createOpenStreamFunctionProxy](functions/createOpenStreamFunctionProxy.md)
- [createQueueEnqueueProxy](functions/createQueueEnqueueProxy.md)
- [createQueueScheduleProxy](functions/createQueueScheduleProxy.md)
- [exportServiceDefinitions](functions/exportServiceDefinitions.md)
- [extendApi](functions/extendApi.md)
- [getCommandFunctionWithValidation](functions/getCommandFunctionWithValidation.md)
- [getDefaultEventBridgeConfig](functions/getDefaultEventBridgeConfig.md)
- [getDefaultLogLevel](functions/getDefaultLogLevel.md)
- [getNewSubscriptionStorageEntry](functions/getNewSubscriptionStorageEntry.md)
- [getSubscriptionFunctionWithValidation](functions/getSubscriptionFunctionWithValidation.md)
- [getTimeoutPromise](functions/getTimeoutPromise.md)
- [initDefaultConfigStore](functions/initDefaultConfigStore.md)
- [initDefaultSecretStore](functions/initDefaultSecretStore.md)
- [initDefaultStateStore](functions/initDefaultStateStore.md)
- [initLogger](functions/initLogger.md)
- [isCustomMessage](functions/isCustomMessage.md)
- [isHttpExposedServiceMeta](functions/isHttpExposedServiceMeta.md)
- [isInfoMessage](functions/isInfoMessage.md)
- [isInfoServiceFunctionAdded](functions/isInfoServiceFunctionAdded.md)
- [isMessageMatchingSubscription](functions/isMessageMatchingSubscription.md)
- [isStreamControl](functions/isStreamControl.md)
- [isStreamFrame](functions/isStreamFrame.md)
- [isStreamMessage](functions/isStreamMessage.md)
- [isStreamOpenRequest](functions/isStreamOpenRequest.md)
- [mergeServiceDefinition](functions/mergeServiceDefinition.md)
- [safeBind](functions/safeBind.md)
- [schemaObjectToTsType](functions/schemaObjectToTsType.md)
- [throwIfNotValidMessage](functions/throwIfNotValidMessage.md)
- [toJSONSchema](functions/toJSONSchema.md)
- [transformSchemaObject](functions/transformSchemaObject.md)
- [validate](functions/validate.md)
- [validationToSchema](functions/validationToSchema.md)

## Agent

- [AgentInvocation](interfaces/AgentInvocation.md)
- [AgentInvokeList](type-aliases/AgentInvokeList.md)
- [AgentProtocolPayload](type-aliases/AgentProtocolPayload.md)
- [AgentProtocolResponse](type-aliases/AgentProtocolResponse.md)
- [agentProtocolPayloadSchema](variables/agentProtocolPayloadSchema.md)
- [agentProtocolResponseSchema](variables/agentProtocolResponseSchema.md)

## Command

- [CommandDefinitionBuilder](classes/CommandDefinitionBuilder.md)
- [CommandAfterGuardHook](type-aliases/CommandAfterGuardHook.md)
- [CommandBeforeGuardHook](type-aliases/CommandBeforeGuardHook.md)
- [CommandDefinition](type-aliases/CommandDefinition.md)
- [CommandErrorResponse](type-aliases/CommandErrorResponse.md)
- [CommandFunction](type-aliases/CommandFunction.md)
- [CommandFunctionContext](type-aliases/CommandFunctionContext.md)
- [CommandFunctionContextEnhancements](type-aliases/CommandFunctionContextEnhancements.md)
- [CommandResponse](type-aliases/CommandResponse.md)
- [CommandSuccessResponse](type-aliases/CommandSuccessResponse.md)
- [CommandTransformFunctionContext](type-aliases/CommandTransformFunctionContext.md)
- [CommandTransformInputHook](type-aliases/CommandTransformInputHook.md)
- [CommandTransformOutputHook](type-aliases/CommandTransformOutputHook.md)
- [isCommand](functions/isCommand.md)
- [isCommandErrorResponse](functions/isCommandErrorResponse.md)
- [isCommandResponse](functions/isCommandResponse.md)
- [isCommandSuccessResponse](functions/isCommandSuccessResponse.md)

## Event bridge

- [DefaultEventBridge](classes/DefaultEventBridge.md)
- [EventBridgeBaseClass](classes/EventBridgeBaseClass.md)
- [EventBridge](interfaces/EventBridge.md)
- [getCommandQueueName](functions/getCommandQueueName.md)

## Helper

- [convertToCamelCase](functions/convertToCamelCase.md)
- [convertToKebabCase](functions/convertToKebabCase.md)
- [convertToPascalCase](functions/convertToPascalCase.md)
- [convertToSnakeCase](functions/convertToSnakeCase.md)
- [createErrorResponse](functions/createErrorResponse.md)
- [createInfoMessage](functions/createInfoMessage.md)
- [createSuccessResponse](functions/createSuccessResponse.md)
- [deserializeOtp](functions/deserializeOtp.md)
- [getCleanedMessage](functions/getCleanedMessage.md)
- [getErrorMessageForCode](functions/getErrorMessageForCode.md)
- [getNewCorrelationId](functions/getNewCorrelationId.md)
- [getNewEBMessageId](functions/getNewEBMessageId.md)
- [getNewInstanceId](functions/getNewInstanceId.md)
- [getNewTraceId](functions/getNewTraceId.md)
- [getSubscriptionQueueName](functions/getSubscriptionQueueName.md)
- [getUniqueId](functions/getUniqueId.md)
- [gracefulShutdown](functions/gracefulShutdown.md)
- [isDevelop](functions/isDevelop.md)
- [serializeOtp](functions/serializeOtp.md)

## Service

- [Service](classes/Service.md)
- [ServiceBuilder](classes/ServiceBuilder.md)
- [ServiceClass](interfaces/ServiceClass.md)
- [ServiceConstructorInput](type-aliases/ServiceConstructorInput.md)

## Store

- [ConfigStoreBaseClass](classes/ConfigStoreBaseClass.md)
- [DefaultConfigStore](classes/DefaultConfigStore.md)
- [DefaultSecretStore](classes/DefaultSecretStore.md)
- [DefaultStateStore](classes/DefaultStateStore.md)
- [SecretStoreBaseClass](classes/SecretStoreBaseClass.md)
- [StateStoreBaseClass](classes/StateStoreBaseClass.md)
- [ConfigStore](interfaces/ConfigStore.md)
- [SecretStore](interfaces/SecretStore.md)
- [StateStore](interfaces/StateStore.md)
- [ConfigDeleteFunction](type-aliases/ConfigDeleteFunction.md)
- [ConfigGetterFunction](type-aliases/ConfigGetterFunction.md)
- [ConfigSetterFunction](type-aliases/ConfigSetterFunction.md)
- [SecretDeleteFunction](type-aliases/SecretDeleteFunction.md)
- [SecretGetterFunction](type-aliases/SecretGetterFunction.md)
- [SecretSetterFunction](type-aliases/SecretSetterFunction.md)
- [StateDeleteFunction](type-aliases/StateDeleteFunction.md)
- [StateGetterFunction](type-aliases/StateGetterFunction.md)
- [StateSetterFunction](type-aliases/StateSetterFunction.md)

## Stream

- [StreamAfterGuardHook](type-aliases/StreamAfterGuardHook.md)
- [StreamBeforeGuardHook](type-aliases/StreamBeforeGuardHook.md)

## Subscription

- [SubscriptionDefinitionBuilder](classes/SubscriptionDefinitionBuilder.md)
- [Subscription](type-aliases/Subscription.md)
- [SubscriptionAfterGuardHook](type-aliases/SubscriptionAfterGuardHook.md)
- [SubscriptionBeforeGuardHook](type-aliases/SubscriptionBeforeGuardHook.md)
- [SubscriptionDefinition](type-aliases/SubscriptionDefinition.md)
- [SubscriptionFunction](type-aliases/SubscriptionFunction.md)
- [SubscriptionFunctionContext](type-aliases/SubscriptionFunctionContext.md)
- [SubscriptionFunctionContextEnhancements](type-aliases/SubscriptionFunctionContextEnhancements.md)
- [SubscriptionTransformFunctionContext](type-aliases/SubscriptionTransformFunctionContext.md)
- [SubscriptionTransformInputHook](type-aliases/SubscriptionTransformInputHook.md)
- [SubscriptionTransformOutputHook](type-aliases/SubscriptionTransformOutputHook.md)

## Unit test helper

- [CommandContextMockBuilderTypes](type-aliases/CommandContextMockBuilderTypes.md)
- [InferCommandBuilderConfig](type-aliases/InferCommandBuilderConfig.md)
- [InferCommandHarnessServiceBuilderConfig](type-aliases/InferCommandHarnessServiceBuilderConfig.md)
- [InferQueueWorkerHarnessServiceBuilderConfig](type-aliases/InferQueueWorkerHarnessServiceBuilderConfig.md)
- [InferStreamBuilderConfig](type-aliases/InferStreamBuilderConfig.md)
- [InferStreamHarnessServiceBuilderConfig](type-aliases/InferStreamHarnessServiceBuilderConfig.md)
- [StreamContextMockBuilderTypes](type-aliases/StreamContextMockBuilderTypes.md)
- [SubscriptionContextMockBuilderTypes](type-aliases/SubscriptionContextMockBuilderTypes.md)
- [createCommandContextMock](functions/createCommandContextMock.md)
- [createCommandTestHarness](functions/createCommandTestHarness.md)
- [createQueueWorkerContextMock](functions/createQueueWorkerContextMock.md)
- [createQueueWorkerTestHarness](functions/createQueueWorkerTestHarness.md)
- [createStreamContextMock](functions/createStreamContextMock.md)
- [createStreamTestHarness](functions/createStreamTestHarness.md)
- [createSubscriptionContextMock](functions/createSubscriptionContextMock.md)
- [getCommandErrorMessageMock](functions/getCommandErrorMessageMock.md)
- [getCommandMessageMock](functions/getCommandMessageMock.md)
- [getCommandSuccessMessageMock](functions/getCommandSuccessMessageMock.md)
- [getCommandTransformContextMock](functions/getCommandTransformContextMock.md)
- [getCustomMessageMessageMock](functions/getCustomMessageMessageMock.md)
- [getEventBridgeMock](functions/getEventBridgeMock.md)
- [getLoggerMock](functions/getLoggerMock.md)
- [getQueueBridgeMock](functions/getQueueBridgeMock.md)
- [getSubscriptionTransformContextMock](functions/getSubscriptionTransformContextMock.md)
