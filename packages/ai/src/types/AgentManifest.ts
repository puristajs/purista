import type { QueryParameter, Schema, SupportedHttpMethod } from '@purista/core'
import type { AgentSandboxPolicy } from '../sandbox/provider.js'

export const defaultAgentModelCapabilities = ['text', 'object', 'object-stream', 'text-stream'] as const

export type AgentHttpExposure = {
	method: SupportedHttpMethod
	path: string
	streamingMode?: 'stream' | 'aggregate'
	streamProtocolAdapter?: AgentStreamProtocolAdapterId
	requestContentType?: string
	requestEncoding?: string
	responseContentType?: string
	responseEncoding?: string
	public?: boolean
	queryParameters?: QueryParameter[]
}

export type AgentExecutionRecoveryPolicy = 'resume-from-checkpoints' | 'retry-from-start' | 'fail-stale'

export type AgentExecutionHttpBehavior = 'attach-and-stream' | 'accept'

export type AgentExecutionCleanupPolicy = {
	transientStateTtlMs?: number
	keepFinalRunRecord?: boolean
	finalRunRecordTtlMs?: number
}

export type AgentExecutionPolicy = {
	leaseTtlMs?: number
	heartbeatIntervalMs?: number
	maxLeaseExtensions?: number
	maxAttempts?: number
	maxDurationMs?: number
	maxModelSteps?: number
	maxToolCalls?: number
	maxNoopPersistenceCycles?: number
	maxRepeatedFailures?: number
	recovery?: AgentExecutionRecoveryPolicy
	httpBehavior?: AgentExecutionHttpBehavior
	cleanup?: AgentExecutionCleanupPolicy
	scopeFromPayload?: string[]
}

export type ReflectionStopReason = 'accepted' | 'max-iterations' | 'stagnation'

export type ReflectionArtifactPolicy = {
	emitArtifacts?: boolean
	artifactPrefix?: string
}

export type ReflectionPreset = {
	maxIterations?: number
	stopOnStagnation?: boolean
	artifacts?: ReflectionArtifactPolicy
}

export type ReflectionPolicy = {
	enabledByDefault?: boolean
	presets?: Record<string, ReflectionPreset>
}

export type AgentQualityProfile = {
	reflection?: {
		enabled?: boolean
		preset?: string
		maxIterations?: number
		stopOnStagnation?: boolean
	}
	verification?: {
		required?: boolean
	}
	execution?: {
		maxModelSteps?: number
		maxToolCalls?: number
	}
}

export type AgentQualityPolicy = {
	defaultProfile?: string
	profiles?: Record<string, AgentQualityProfile>
}

export type AgentApprovalCheckpointPolicy = {
	required?: boolean
	when?: string
	timeoutMs?: number
	onExpiry?: 'fail' | 'return-expired'
}

export type AgentApprovalPolicy = {
	checkpoints?: Record<string, AgentApprovalCheckpointPolicy>
}

export type AgentResourcePolicy = {
	objective?: 'quality' | 'latency' | 'cost'
	budgetUsd?: number
	maxDurationMs?: number
}

export type AgentPolicy = {
	quality?: AgentQualityPolicy
	approvals?: AgentApprovalPolicy
	resources?: AgentResourcePolicy
}

export type AgentStreamProtocolAdapterId = 'purista' | 'ai-sdk.responses' | 'ai-sdk.ui-message'

export type AllowedToolDefinition = {
	serviceName: string
	serviceVersion: string
	commandName: string
	description?: string
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	toolName?: string
}

export type AllowedAgentDefinition = {
	agentName: string
	serviceVersion?: string
	description?: string
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	toolName?: string
}

export type ExternalRuntimeMetadata = {
	commands: AllowedToolDefinition[]
	agents: AllowedAgentDefinition[]
}

export type AgentSessionConfig = {
	storeName: string
	strategy?: 'full' | 'summary'
	maxFrames?: number
}

export type AgentHistoryPreset = 'user' | 'agent'

export type RetryPolicy = {
	strategy?: 'fixed' | 'exponential'
	maxAttempts: number
	delayMs?: number
}

export type AgentModelCapability = 'text' | 'text-stream' | 'object' | 'object-stream' | 'embedding' | 'rerank'

export type AgentModelBinding = {
	alias: string
	capabilities?: AgentModelCapability[]
}

export type AgentSkillConfig = {
	resourceName?: string
	names: string[]
}

export type AgentManifest = {
	agentName: string
	serviceVersion: string
	description?: string
	deprecated?: boolean
	eventBridge: string
	sandbox?: AgentSandboxPolicy
	executionPolicy?: AgentExecutionPolicy
	reflection?: ReflectionPolicy
	agentPolicy?: AgentPolicy
	models?: AgentModelBinding[]
	modelResource?: { resourceName: string; variant?: string }
	skills?: AgentSkillConfig
	session?: AgentSessionConfig
	retryPolicy?: RetryPolicy
	telemetry?: { attributes?: Record<string, string | number | boolean> }
	allowedTools: AllowedToolDefinition[]
	allowedAgents?: AllowedAgentDefinition[]
	resources?: Record<string, { resourceName: string }>
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	contextSchema?: Schema
	httpExposure?: AgentHttpExposure
	successEventName?: string
	metadata?: Record<string, unknown>
}
