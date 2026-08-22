/* eslint-disable simple-import-sort/exports */
/**
 * This is the main package of PURISTA.
 *
 * A backend framework for building message based domain services.
 *
 * This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, event sourcing and lambda functions.
 *
 * It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, OpenApi documentation (swagger).
 *
 * It contains the builders, classes & types and some helper functions.
 * For easier testing of commands and subscriptions, the package contains different mock creation helper based on [sinon](https://sinonjs.org)
 *
 * Learn PURIST at [purista.dev](https://purista.dev)
 *
 * @module
 */

export type {
	ContentPart,
	ModelCapability,
	ModelProvider,
	RunEvent,
	Session,
} from '@purista/harness'

// Application authoring: versioned builders and their corresponding types.
export * from './AgentQueueBuilder/index.js'
export type { HttpExposureOptions } from './CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
export * from './CommandDefinitionBuilder/index.js'
export type { ConfigStore } from './core/ConfigStore/types/ConfigStore.js'
export { HandledError } from './core/Error/HandledError.impl.js'
export { UnhandledError } from './core/Error/UnhandledError.impl.js'
export type {
	EventBridge,
	EventBridgeCapabilities,
	EventBridgeConfig,
} from './core/EventBridge/types/index.js'
export type { QueryParameter } from './core/HttpServer/types/QueryParameter.js'
export type { SupportedHttpMethod } from './core/HttpServer/types/SupportedHttpMethod.js'
export { getNewInstanceId } from './core/helper/getNewInstanceId.impl.js'
export { getNewTraceId } from './core/helper/getNewTraceId.impl.js'
export type {
	PuristaMetricDefinition,
	PuristaMetricDefinitions,
	PuristaMetricsRuntimeOptions,
} from './core/metrics/types.js'
export type { QueueBridge, QueueBridgeCapabilities } from './core/QueueBridge/index.js'
export { DefaultSchedulerProvider } from './core/Scheduler/DefaultSchedulerProvider.impl.js'
export type { SchedulerRuntimeOptions } from './core/Scheduler/SchedulerRuntime.impl.js'
export { SchedulerRuntime } from './core/Scheduler/SchedulerRuntime.impl.js'
export type { SchedulerRuntimeStatus } from './core/Scheduler/types.js'
export type { SecretStore } from './core/SecretStore/types/SecretStore.js'
export { Service } from './core/Service/Service.impl.js'
export type {
	StateRetention,
	StateRetentionPolicy,
	StateStore,
	StateStoreCapabilities,
	StateStoreConfig,
	StateWriteOptions,
} from './core/StateStore/types/index.js'
export { EBMessageType } from './core/types/EBMessageType.enum.js'
// Application-level contracts. Protocol implementation and transport utility
// types live in `@purista/core/adapter`.
export type {
	Command,
	CommandDefinition,
	CommandErrorResponse,
	CommandFunctionContext,
	CommandResponse,
	CommandSuccessResponse,
	ContentType,
	ContextBase,
	CorrelationId,
	CustomMessage,
	EBMessage,
	EBMessageAddress,
	EBMessageBase,
	EBMessageId,
	EBMessageSenderAddress,
	ErrorResponsePayload,
	ILogger,
	InstanceId,
	Logger,
	LogLevelName,
	PrincipalId,
	QueueContext,
	QueueDefinition,
	QueueHandlerResult,
	QueueMessage,
	QueueWorkerDefinition,
	ServiceClass,
	ServiceClassTypes,
	ServiceHealthState,
	ServiceHealthStatus,
	ServiceInfoType,
	TenantId,
	TraceId,
} from './core/types/index.js'
export { isCustomMessage } from './core/types/isCustomMessage.impl.js'
export { PuristaSpanName } from './core/types/PuristaSpanName.enum.js'
export { PuristaSpanTag } from './core/types/PuristaSpanTag.enum.js'
export { StatusCode } from './core/types/StatusCode.enum.js'
// Application runtime composition.
export { DefaultConfigStore } from './DefaultConfigStore/DefaultConfigStore.impl.js'
export type { DefaultConfigStoreConfig } from './DefaultConfigStore/types/DefaultConfigStoreConfig.js'
export { DefaultEventBridge } from './DefaultEventBridge/DefaultEventBridge.impl.js'
export type { DefaultEventBridgeConfig } from './DefaultEventBridge/types/DefaultEventBridgeConfig.js'
export { DefaultLogger } from './DefaultLogger/DefaultLogger.impl.js'
export { initLogger } from './DefaultLogger/initLogger.impl.js'
export type { DefaultQueueBridgeOptions } from './DefaultQueueBridge/DefaultQueueBridge.impl.js'
export { DefaultQueueBridge } from './DefaultQueueBridge/DefaultQueueBridge.impl.js'
export { DefaultSecretStore } from './DefaultSecretStore/DefaultSecretStore.impl.js'
export type { DefaultSecretStoreConfig } from './DefaultSecretStore/types/DefaultSecretStoreConfig.js'
export { DefaultStateStore } from './DefaultStateStore/DefaultStateStore.impl.js'
export type { DefaultStateStoreConfig } from './DefaultStateStore/types/DefaultStateStoreConfig.js'
export type {
	ArchitectureAgent,
	ArchitectureCallable,
	ArchitectureDiagnostic,
	ArchitectureDiagnosticSeverity,
	ArchitectureManifest,
	ArchitectureQueue,
	ArchitectureQueueWorker,
	ArchitectureSchedule,
	ArchitectureSchemaSummary,
	ArchitectureService,
	ArchitectureSourceLocation,
	CreateArchitectureManifestOptions,
	ValidateArchitectureManifestOptions,
} from './helper/architectureManifest.js'
export {
	createArchitectureManifest,
	validateArchitectureManifest,
} from './helper/architectureManifest.js'
export type {
	CloudEvent,
	ExportScheduleManifestOptions,
	FromCloudEventOptions,
	JsonRecord,
	KubernetesCronJobScheduleInput,
	ScheduleManifest,
	ServiceContractInput,
} from './helper/enterpriseInterop.js'
export {
	exportCloudEventsSchema,
	exportScheduleManifest,
	fromCloudEvent,
	toCloudEvent,
} from './helper/enterpriseInterop.js'
export { exportServiceDefinitions } from './helper/exportServiceDefinitions.js'
export { gracefulShutdown } from './helper/gracefulShutdown.impl.js'
export type { Constructor } from './helper/types/Constructor.js'
export type { InstanceOrType } from './helper/types/InstanceOrType.js'
export type {
	FullDefinition,
	FullServiceDefinition,
} from './helper/types/index.js'
export type { NonEmptyString } from './helper/types/NonEmptyString.js'
export type { ShutdownEntry } from './helper/types/ShutdownEntry.js'
export * from './QueueDefinitionBuilder/index.js'
export * from './QueueWorkerBuilder/index.js'
export * from './ScheduleDefinitionBuilder/index.js'
export * from './SchedulerBuilder/index.js'
export * from './ServiceBuilder/index.js'
export * from './StreamDefinitionBuilder/index.js'
export * from './SubscriptionDefinitionBuilder/index.js'
// Schema, static architecture, and lifecycle helpers intentionally remain
// application-facing because the CLI and composition root use them directly.
export type { Infer, InferIn, JsonSchemaOptions, Schema, ValidationResult } from './schema/standardSchema.js'
export { toJSONSchema, validate } from './schema/standardSchema.js'
export { extendApi } from './zodOpenApi/extendApi.js'

declare global {
	interface FetchEvent extends Event {
		readonly request: Request
		respondWith(response: Promise<Response> | Response): Promise<Response>
	}
	interface ExecutionContext {
		waitUntil(promise: Promise<unknown>): void
		passThroughOnException(): void
	}
}
